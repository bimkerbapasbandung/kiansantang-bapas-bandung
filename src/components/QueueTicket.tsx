import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QueueItem, SERVICE_NAMES, SUB_SERVICE_NAMES } from '@/types/queue';
import { Printer } from 'lucide-react';

interface QueueTicketProps {
  queue: QueueItem;
  onClose: () => void;
}

export const QueueTicket = ({ queue, onClose }: QueueTicketProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-primary">BAPAS Bandung</h2>
          <div className="border-2 border-primary rounded-lg p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Nomor Antrian</p>
            <p className="text-6xl font-bold text-primary">{queue.queueNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Layanan</p>
            <p className="text-xl font-semibold">{SERVICE_NAMES[queue.serviceType]}</p>
            <p className="text-sm text-muted-foreground">
              {SUB_SERVICE_NAMES[queue.serviceType][queue.subService as keyof typeof SUB_SERVICE_NAMES[typeof queue.serviceType]]}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(queue.createdAt).toLocaleString('id-ID')}
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={handlePrint} className="flex-1" variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Cetak
          </Button>
          <Button onClick={onClose} className="flex-1">
            Selesai
          </Button>
        </div>
      </Card>
    </div>
  );
};
