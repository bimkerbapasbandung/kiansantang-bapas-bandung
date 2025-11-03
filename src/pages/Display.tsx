import { useState, useEffect } from 'react';
import { queueManager } from '@/lib/queueManager';
import { QueueItem, SERVICE_NAMES } from '@/types/queue';
import { RunningText } from '@/components/RunningText';
import { Clock } from 'lucide-react';

const Display = () => {
  const [currentQueue, setCurrentQueue] = useState<QueueItem | null>(null);
  const [time, setTime] = useState(new Date());
  const [waitingCount, setWaitingCount] = useState(0);

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

  return (
    <div className="min-h-screen bg-display-bg text-display-text flex flex-col">
      {/* Header */}
      <div className="bg-primary p-6">
        <h1 className="text-4xl font-bold text-center text-white">
          BALAI PEMASYARAKATAN KELAS I BANDUNG
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-3 gap-6 p-6">
        {/* Video Area */}
        <div className="col-span-1 space-y-4">
          <div className="bg-card rounded-lg overflow-hidden aspect-video flex items-center justify-center border-4 border-display-accent">
            <div className="text-center p-6">
              <p className="text-muted-foreground mb-2">Video Profil</p>
              <p className="text-sm text-muted-foreground">BAPAS Bandung</p>
            </div>
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
        <div className="col-span-2 flex flex-col">
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
      <RunningText text="Selamat datang di Balai Pemasyarakatan Kelas I Bandung • Melayani dengan Profesional dan Bermartabat • Harap menunggu panggilan nomor antrian Anda" />
    </div>
  );
};

export default Display;
