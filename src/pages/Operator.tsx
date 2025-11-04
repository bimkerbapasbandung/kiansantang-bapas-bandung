import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { queueManager } from '@/lib/queueManager';
import { QueueItem, SERVICE_NAMES, SUB_SERVICE_NAMES } from '@/types/queue';
import { Phone, CheckCircle, ArrowLeft, RefreshCw, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Operator = () => {
  const navigate = useNavigate();
  const [waitingQueues, setWaitingQueues] = useState<QueueItem[]>([]);
  const [currentQueue, setCurrentQueue] = useState<QueueItem | null>(null);
  const [counter] = useState(1);

  useEffect(() => {
    loadQueues();
    const handleUpdate = () => loadQueues();
    window.addEventListener('queueUpdate', handleUpdate);
    return () => window.removeEventListener('queueUpdate', handleUpdate);
  }, []);

  const loadQueues = () => {
    setWaitingQueues(queueManager.getWaitingQueues());
    setCurrentQueue(queueManager.getCurrentlyServing());
  };

  const callNext = () => {
    if (waitingQueues.length === 0) {
      toast.error('Tidak ada antrian menunggu');
      return;
    }

    const nextQueue = waitingQueues[0];
    queueManager.callQueue(nextQueue.id, counter);
    toast.success(`Memanggil antrian ${nextQueue.queueNumber}`);
    
    // Simulate voice announcement
    const announcement = `Nomor antrian ${nextQueue.queueNumber.split('-').join(' ')} menuju loket ${counter}`;
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(announcement);
      utterance.lang = 'id-ID';
      speechSynthesis.speak(utterance);
    }
    
    loadQueues();
  };

  const completeService = () => {
    if (currentQueue) {
      queueManager.completeQueue(currentQueue.id);
      toast.success('Layanan selesai');
      loadQueues();
    }
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
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-3xl font-bold">Dashboard Operator - Loket {counter}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={resetAll}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

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
                <Button onClick={completeService} className="w-full" size="lg">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Selesai
                </Button>
              </div>
            ) : (
              <div className="text-center p-12 text-muted-foreground">
                Tidak ada antrian sedang dilayani
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Antrian Menunggu ({waitingQueues.length})</h2>
              <Button onClick={callNext} disabled={waitingQueues.length === 0}>
                <Phone className="w-4 h-4 mr-2" />
                Panggil Selanjutnya
              </Button>
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
