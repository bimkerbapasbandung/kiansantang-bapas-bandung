import { useState, useEffect } from 'react';
import { queueManager } from '@/lib/queueManager';
import { QueueItem, SERVICE_NAMES } from '@/types/queue';
import { RunningText } from '@/components/RunningText';
import { Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface DisplaySettings {
  running_text: string;
  video_url: string | null;
  logo_url: string | null;
  video_column_span: number;
  queue_column_span: number;
  institution_name: string;
}

const Display = () => {
  const [currentQueue, setCurrentQueue] = useState<QueueItem | null>(null);
  const [time, setTime] = useState(new Date());
  const [waitingCount, setWaitingCount] = useState(0);
  const [settings, setSettings] = useState<DisplaySettings | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadSettings = async () => {
      console.log('=== LOADING DISPLAY SETTINGS ===');
      const { data, error } = await supabase
        .from('display_settings')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();
      
      console.log('Settings loaded:', { data, error });
      
      if (data) {
        setSettings(data);
        console.log('✅ Settings updated:', {
          video_url: data.video_url,
          logo_url: data.logo_url,
          running_text: data.running_text
        });
      }
    };

    loadSettings();

    // Real-time subscription untuk settings changes
    const channel = supabase
      .channel('display_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'display_settings'
        },
        (payload) => {
          console.log('🔄 Settings changed:', payload);
          loadSettings();
        }
      )
      .subscribe();

    console.log('✅ Real-time subscription active');

    return () => {
      console.log('🔌 Unsubscribing from settings changes');
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const loadData = () => {
      setCurrentQueue(queueManager.getCurrentlyServing());
      setWaitingCount(queueManager.getWaitingQueues().length);
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    const timeInterval = setInterval(() => setTime(new Date()), 1000);

    const handleUpdate = () => loadData();
    window.addEventListener('queueUpdate', handleUpdate);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
      window.removeEventListener('queueUpdate', handleUpdate);
    };
  }, []);

  const handleManualReload = async () => {
    console.log('🔄 Manual reload triggered');
    setReloadKey(prev => prev + 1);
    
    const { data, error } = await supabase
      .from('display_settings')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single();
    
    console.log('Manual reload result:', { data, error });
    
    if (data) {
      setSettings(data);
      console.log('✅ Settings manually reloaded');
    }
  };

  if (!settings) return <div className="min-h-screen bg-display-bg flex items-center justify-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 text-display-text flex flex-col">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
        <div className="p-6 flex items-center justify-between">
          {settings.logo_url && (
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl">
              <img 
                key={`${settings.logo_url}-${reloadKey}`}
                src={`${settings.logo_url}?t=${Date.now()}`}
                alt="Logo" 
                className="h-16 object-contain"
                onLoad={() => console.log('✅ Logo loaded:', settings.logo_url)}
                onError={(e) => console.error('❌ Logo load error:', e)}
              />
            </div>
          )}
          <div className="flex-1 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-1">
              KIANSANTANG
            </h1>
            <p className="text-sm font-medium text-blue-100 tracking-wide">
              Kios Antrian Santun dan Tanggap
            </p>
            <p className="text-xs text-blue-200 mt-1">
              {settings.institution_name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleManualReload}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              title="Reload Settings"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            {settings.logo_url && <div className="w-12" />}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-6">
        {/* Video Area */}
        <div 
          className="space-y-4"
          style={{ gridColumn: `span ${settings.video_column_span || 1}` }}
        >
          <div className="bg-card rounded-lg overflow-hidden aspect-video flex items-center justify-center border-4 border-display-accent">
            {settings.video_url ? (
              <video 
                key={`${settings.video_url}-${reloadKey}`}
                src={`${settings.video_url}?t=${Date.now()}`}
                controls 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
                onError={(e) => console.error('❌ Video load error:', e)}
                onLoadedData={() => console.log('✅ Video loaded:', settings.video_url)}
              />
            ) : (
              <div className="text-center p-6">
                <p className="text-muted-foreground mb-2">Video Profil</p>
                <p className="text-sm text-muted-foreground">{settings.institution_name}</p>
              </div>
            )}
          </div>
          
          {/* Time and Waiting Info */}
          <div className="bg-card rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-display-accent" />
              <div>
                <p className="text-3xl font-bold">
                  {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {time.toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-1">Antrian Menunggu</p>
              <p className="text-4xl font-bold text-display-accent">{waitingCount}</p>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-1">Estimasi Waktu</p>
              <p className="text-2xl font-semibold">{waitingCount * 5} menit</p>
            </div>
          </div>
        </div>

        {/* Queue Display */}
        <div 
          className="flex flex-col"
          style={{ gridColumn: `span ${settings.queue_column_span || 2}` }}
        >
          <div className="flex-1 bg-card rounded-lg p-12 flex flex-col items-center justify-center">
            {currentQueue ? (
              <div className="text-center space-y-8 w-full">
                <div className="space-y-2">
                  <p className="text-2xl text-muted-foreground">Nomor Antrian</p>
                  <p className="text-[120px] font-bold leading-none text-display-accent animate-pulse">
                    {currentQueue.queueNumber}
                  </p>
                </div>
                
                <div className="space-y-4 pt-8 border-t-4 border-border">
                  <div>
                    <p className="text-xl text-muted-foreground mb-2">Layanan</p>
                    <p className="text-5xl font-bold">{SERVICE_NAMES[currentQueue.serviceType]}</p>
                  </div>
                  
                  <div>
                    <p className="text-xl text-muted-foreground mb-2">Menuju Loket</p>
                    <p className="text-6xl font-bold text-display-accent">
                      {currentQueue.counter || '-'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-4xl font-bold text-muted-foreground">
                  Selamat Datang
                </p>
                <p className="text-2xl text-muted-foreground">
                  Silakan ambil nomor antrian
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Running Text */}
      <RunningText text={settings.running_text} />
    </div>
  );
};

export default Display;
