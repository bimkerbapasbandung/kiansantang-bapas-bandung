import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QueueItem, SERVICE_NAMES, SUB_SERVICE_NAMES } from '@/types/queue';
import { Printer, Send } from 'lucide-react';
import { toast } from 'sonner';

interface QueueTicketProps {
  queue: QueueItem;
  onClose: () => void;
}

export const QueueTicket = ({ queue, onClose }: QueueTicketProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = async () => {
    if (!queue.whatsappNumber) {
      toast.error('Nomor WhatsApp tidak tersedia');
      return;
    }

    // Format nomor WhatsApp (tambah 62 jika dimulai dengan 0)
    let phoneNumber = queue.whatsappNumber;
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '62' + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('62')) {
      phoneNumber = '62' + phoneNumber;
    }

    // Format pesan WhatsApp
    const message = `*BAPAS BANDUNG*\n` +
      `_Sistem Antrian Layanan_\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `*NOMOR ANTRIAN ANDA*\n\n` +
      `📋 Nomor: *${queue.queueNumber}*\n` +
      `👤 Pengguna: ${queue.clientName}\n` +
      `🏢 Layanan: ${SERVICE_NAMES[queue.serviceType]}\n` +
      `📅 Waktu: ${new Date(queue.createdAt).toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `✅ Antrian Anda telah terdaftar\n` +
      `⏰ Mohon menunggu panggilan\n` +
      `📍 Lokasi: BAPAS Kelas I Bandung\n\n` +
      `_Terima kasih telah menggunakan layanan kami_`;

    // Encode message untuk URL
    const encodedMessage = encodeURIComponent(message);
    
    // NOMOR WHATSAPP BAPAS BANDUNG (GANTI DENGAN NOMOR RESMI)
    const BAPAS_WHATSAPP = '6282117001234'; // ⚠️ GANTI INI!
    
    // URL untuk kirim dari WhatsApp BAPAS ke nomor user
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Buka WhatsApp Web/Desktop untuk operator BAPAS
    window.open(whatsappUrl, '_blank');
    
    toast.success('Membuka WhatsApp untuk mengirim pesan ke ' + phoneNumber);
    toast.info('Klik Send di WhatsApp untuk mengirim', { duration: 5000 });
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
            <p className="text-sm text-muted-foreground">Pengguna Layanan</p>
            <p className="text-lg font-semibold">{queue.clientName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Layanan</p>
            <p className="text-xl font-semibold">{SERVICE_NAMES[queue.serviceType]}</p>
          </div>
          <div className="text-sm text-muted-foreground pt-2">
            {new Date(queue.createdAt).toLocaleString('id-ID', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={handleSendWhatsApp} className="w-full bg-green-600 hover:bg-green-700">
            <Send className="w-4 h-4 mr-2" />
            Kirim ke WhatsApp
          </Button>
          <div className="flex gap-3">
            <Button onClick={handlePrint} className="flex-1" variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Cetak
            </Button>
            <Button onClick={onClose} className="flex-1" variant="outline">
              Tutup
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
