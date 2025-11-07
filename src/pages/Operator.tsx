import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { queueManager } from '@/lib/queueManager';
import { soundManager } from '@/lib/soundManager';
import { QueueItem, SERVICE_NAMES, SUB_SERVICE_NAMES, ServiceType } from '@/types/queue';
import { Phone, CheckCircle, ArrowLeft, RefreshCw, LogOut, Search, BarChart3, Copy, User, MapPin, Briefcase, MessageSquare, Settings, Volume2, Sheet, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { GoogleSheetsSyncButton } from '@/components/GoogleSheetsSync';

const Operator = () => {
  const navigate = useNavigate();
  const [waitingQueues, setWaitingQueues] = useState<QueueItem[]>([]);
  const [currentQueue, setCurrentQueue] = useState<QueueItem | null>(null);
  const [counter] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState<ServiceType | 'all'>('all');
  const [showTemplate, setShowTemplate] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<string>('');
  const [isAnnouncing, setIsAnnouncing] = useState(false);

  const loadQueues = useCallback(() => {
    let queues = queueManager.getWaitingQueues();
    
    // Apply service filter
    if (filterService !== 'all') {
      queues = queues.filter(q => q.serviceType === filterService);
    }
    
    // Apply search filter
    if (searchTerm) {
      queues = queues.filter(q => 
        q.queueNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.pkOfficerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setWaitingQueues(queues);
    setCurrentQueue(queueManager.getCurrentlyServing());
  }, [searchTerm, filterService]);

  useEffect(() => {
    loadQueues();
    const handleUpdate = () => loadQueues();
    window.addEventListener('queueUpdate', handleUpdate);
    return () => window.removeEventListener('queueUpdate', handleUpdate);
  }, [loadQueues]);

  const callNext = async () => {
    if (waitingQueues.length === 0) {
      toast.error('Tidak ada antrian menunggu');
      return;
    }

    const nextQueue = waitingQueues[0];
    queueManager.callQueue(nextQueue.id, counter);
    toast.success(`Memanggil antrian ${nextQueue.queueNumber}`);
    
    // Prepare data untuk template
    const queueData = {
      clientName: nextQueue.clientName || 'Klien',
      serviceName: SERVICE_NAMES[nextQueue.serviceType] || 'Layanan',
      subServiceName: SUB_SERVICE_NAMES[nextQueue.serviceType]?.[nextQueue.subService as keyof typeof SUB_SERVICE_NAMES[typeof nextQueue.serviceType]] || nextQueue.subService || '',
      pkOfficerName: nextQueue.pkOfficerName || '',
      pkOfficerPosition: nextQueue.pkOfficerPosition || '',
      time: new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    
    // Play notification sound first (async)
    await soundManager.playNotification();
    
    // Then announce queue
    soundManager.announceQueue(
      nextQueue.queueNumber, 
      counter, 
      nextQueue.serviceType,
      queueData,
      (text) => {
        // Callback saat announcement dimulai
        setCurrentAnnouncement(text);
        setIsAnnouncing(true);
      },
      () => {
        // Callback saat announcement selesai
        setTimeout(() => {
          setIsAnnouncing(false);
          setCurrentAnnouncement('');
        }, 1000);
      }
    );
    
    loadQueues();
  };

  const repeatLastCall = () => {
    if (!soundManager.canRepeatLast()) {
      toast.error('Tidak ada panggilan untuk diulang atau panggilan terlalu pendek');
      return;
    }

    toast.info('Mengulang panggilan terakhir...');
    
    soundManager.repeatLastAnnouncement(
      (text) => {
        setCurrentAnnouncement(text);
        setIsAnnouncing(true);
      },
      () => {
        setTimeout(() => {
          setIsAnnouncing(false);
          setCurrentAnnouncement('');
        }, 1000);
      }
    );
  };

  const completeService = () => {
    if (currentQueue) {
      queueManager.completeQueue(currentQueue.id);
      toast.success('Layanan selesai');
      setShowTemplate(false);
      loadQueues();
    }
  };

  const getCallTemplate = (queue: QueueItem) => {
    // Load custom templates from localStorage
    const savedTemplates = localStorage.getItem('callTemplates');
    const customTemplates = savedTemplates ? JSON.parse(savedTemplates) : null;

    const defaultTemplates = {
      penghadapan: `📢 PEMANGGILAN LAYANAN PENGHADAPAN

🎫 Nomor Antrian: {{queueNumber}}
👤 Nama: {{clientName}}
📋 Layanan: {{serviceName}}
📝 Sub Layanan: {{subServiceName}}
👨‍💼 PK: {{pkOfficerName}}
📍 Posisi: {{pkOfficerPosition}}
⏰ Waktu: {{time}}

📍 Silakan menuju ke Loket {{counter}}
✅ Mohon membawa dokumen yang diperlukan`,

      bimbingan: `📢 PEMANGGILAN LAYANAN BIMBINGAN

🎫 Nomor Antrian: {{queueNumber}}
👤 Nama Klien: {{clientName}}
📋 Jenis Bimbingan: {{subServiceName}}
👨‍💼 Pembimbing Kemasyarakatan: {{pkOfficerName}}
📍 Jabatan: {{pkOfficerPosition}}
⏰ Waktu Daftar: {{time}}

📍 Silakan menuju ke Ruang Bimbingan - Loket {{counter}}
📝 Mohon membawa KTP dan dokumen pendukung`,

      kunjungan: `📢 PEMANGGILAN LAYANAN KUNJUNGAN

🎫 Nomor Antrian: {{queueNumber}}
👤 Nama Pengunjung: {{clientName}}
📋 Layanan: {{serviceName}}
📝 Keperluan: {{subServiceName}}
⏰ Waktu: {{time}}

📍 Silakan menuju ke Loket {{counter}}
🆔 Mohon membawa KTP dan surat izin kunjungan`,

      pengaduan: `📢 PEMANGGILAN LAYANAN PENGADUAN

🎫 Nomor Antrian: {{queueNumber}}
👤 Nama: {{clientName}}
📋 Layanan: {{serviceName}}
📝 Jenis: {{subServiceName}}
⏰ Waktu: {{time}}

📍 Silakan menuju ke Loket {{counter}}
📄 Mohon siapkan dokumen pendukung pengaduan`
    };

    // Use custom template if available, otherwise use default
    const templates = customTemplates || defaultTemplates;
    let template = templates[queue.serviceType] || `Nomor antrian {{queueNumber}} silakan ke Loket {{counter}}`;

    // Replace variables
    template = template
      .replace(/\{\{queueNumber\}\}/g, queue.queueNumber)
      .replace(/\{\{clientName\}\}/g, queue.clientName)
      .replace(/\{\{serviceName\}\}/g, SERVICE_NAMES[queue.serviceType])
      .replace(/\{\{subServiceName\}\}/g, SUB_SERVICE_NAMES[queue.serviceType][queue.subService as keyof typeof SUB_SERVICE_NAMES[typeof queue.serviceType]])
      .replace(/\{\{pkOfficerName\}\}/g, queue.pkOfficerName || '-')
      .replace(/\{\{pkOfficerPosition\}\}/g, queue.pkOfficerPosition || '-')
      .replace(/\{\{time\}\}/g, new Date(queue.createdAt).toLocaleString('id-ID'))
      .replace(/\{\{counter\}\}/g, counter.toString());

    return template;
  };

  const copyTemplate = (queue: QueueItem) => {
    const template = getCallTemplate(queue);
    navigator.clipboard.writeText(template);
    toast.success('Template berhasil disalin!');
  };

  const showTemplateModal = () => {
    setShowTemplate(true);
  };

  const resetAll = () => {
    if (confirm('Reset semua data antrian?')) {
      queueManager.resetCounters();
      queueManager.saveQueues([]);
      toast.success('Data direset');
      loadQueues();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
    toast.success('Logout berhasil');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Modern Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="border-blue-200 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  KIANSANTANG
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Dashboard Operator - Loket {counter}
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <GoogleSheetsSyncButton />
              <Button 
                variant="outline" 
                onClick={repeatLastCall}
                disabled={!soundManager.canRepeatLast() || isAnnouncing}
                className="border-green-200 hover:bg-green-50"
                title="Ulangi Panggilan Terakhir"
              >
                <Repeat className="w-4 h-4 mr-2" />
                Ulangi
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/operator-settings')}
                className="border-blue-200 hover:bg-blue-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Pengaturan
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/statistics')}
                className="border-indigo-200 hover:bg-indigo-50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Statistik
              </Button>
              <Button 
                variant="destructive" 
                onClick={resetAll}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-red-200 hover:bg-red-50 text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Announcement Display */}
        {isAnnouncing && currentAnnouncement && (
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-400 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Volume2 className="w-8 h-8 text-blue-600 animate-bounce" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  🔊 Sedang Memutar Pengumuman
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-normal text-red-600">LIVE</span>
                  </span>
                </h3>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {currentAnnouncement}
                  </p>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  💡 Pengumuman akan diulang 2x secara otomatis
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Sedang Dilayani</h2>
            {currentQueue ? (
              <div className="space-y-4">
                <div className="text-center p-8 bg-primary/10 rounded-lg">
                  <p className="text-5xl font-bold text-primary mb-2">{currentQueue.queueNumber}</p>
                  <p className="text-lg font-semibold">{SERVICE_NAMES[currentQueue.serviceType]}</p>
                  <p className="text-sm text-muted-foreground">
                    {SUB_SERVICE_NAMES[currentQueue.serviceType][currentQueue.subService as keyof typeof SUB_SERVICE_NAMES[typeof currentQueue.serviceType]]}
                  </p>
                </div>
                
                {/* Data Pengguna */}
                <div className="bg-secondary p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">Nama:</span>
                    <span>{currentQueue.clientName}</span>
                  </div>
                  {currentQueue.pkOfficerName && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">PK:</span>
                      <span>{currentQueue.pkOfficerName}</span>
                    </div>
                  )}
                  {currentQueue.whatsappNumber && (
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">WhatsApp:</span>
                      <span>{currentQueue.whatsappNumber}</span>
                    </div>
                  )}
                </div>

                {/* Template Pemanggilan */}
                {showTemplate && (
                  <div className="bg-secondary p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">📢 Template Pemanggilan</h3>
                      <Button size="sm" variant="outline" onClick={() => copyTemplate(currentQueue)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <pre className="text-xs whitespace-pre-wrap bg-background p-3 rounded border">
                      {getCallTemplate(currentQueue)}
                    </pre>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={showTemplateModal} variant="outline" size="lg">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    {showTemplate ? 'Sembunyikan' : 'Lihat'} Template
                  </Button>
                  <Button onClick={completeService} className="w-full" size="lg">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Selesai
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 text-muted-foreground">
                Tidak ada antrian sedang dilayani
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Antrian Menunggu ({queueManager.getWaitingQueues().length})</h2>
                <Button onClick={callNext} disabled={waitingQueues.length === 0}>
                  <Phone className="w-4 h-4 mr-2" />
                  Panggil Selanjutnya
                </Button>
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nomor antrian atau nama..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterService} onValueChange={(value) => setFilterService(value as ServiceType | 'all')}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter Layanan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Layanan</SelectItem>
                    <SelectItem value="penghadapan">Penghadapan</SelectItem>
                    <SelectItem value="bimbingan">Bimbingan</SelectItem>
                    <SelectItem value="kunjungan">Kunjungan</SelectItem>
                    <SelectItem value="pengaduan">Pengaduan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {waitingQueues.length === 0 ? (
                <div className="text-center p-12 text-muted-foreground">
                  Tidak ada antrian menunggu
                </div>
              ) : (
                waitingQueues.map((queue) => (
                  <div
                    key={queue.id}
                    className="p-4 bg-secondary rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-lg">{queue.queueNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {SERVICE_NAMES[queue.serviceType]} - {SUB_SERVICE_NAMES[queue.serviceType][queue.subService as keyof typeof SUB_SERVICE_NAMES[typeof queue.serviceType]]}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(queue.createdAt).toLocaleTimeString('id-ID')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Operator;
