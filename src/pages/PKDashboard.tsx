import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Download, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface BimbinganClient {
  id: string;
  queue_id: string;
  pk_officer_id: string;
  pk_officer_name: string;
  sub_service: string;
  nama_lengkap: string;
  alamat_domisili: string;
  status_pekerjaan: string;
  jenis_pekerjaan: string;
  whatsapp_number: string;
  status: string;
  buku_wajib_lapor_sent: boolean;
  created_at: string;
}

const PKDashboard = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<BimbinganClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPK, setSelectedPK] = useState<string>('all');
  const [pkOfficers, setPkOfficers] = useState<any[]>([]);

  useEffect(() => {
    loadPKOfficers();
    loadClients();
  }, []);

  const loadPKOfficers = async () => {
    try {
      const { data, error } = await supabase
        .from('pk_officers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setPkOfficers(data || []);
    } catch (error) {
      console.error('Error loading PK officers:', error);
    }
  };

  const loadClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bimbingan_clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Gagal memuat data klien');
    } finally {
      setLoading(false);
    }
  };

  const getSubServiceLabel = (subService: string) => {
    const labels: Record<string, string> = {
      wajib_lapor: 'Wajib Lapor',
      kepribadian: 'Kepribadian',
      kemandirian: 'Kemandirian',
    };
    return labels[subService] || subService;
  };

  const filteredClients = selectedPK === 'all' 
    ? clients 
    : clients.filter(c => c.pk_officer_id === selectedPK);

  const sendBukuWajibLapor = async (client: BimbinganClient) => {
    try {
      // Format nomor WhatsApp
      let phoneNumber = client.whatsapp_number;
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '62' + phoneNumber.substring(1);
      } else if (!phoneNumber.startsWith('62')) {
        phoneNumber = '62' + phoneNumber;
      }

      // Format pesan buku wajib lapor
      const message = `*BAPAS BANDUNG*\n` +
        `_Buku Wajib Lapor Digital_\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `*INFORMASI KLIEN*\n\n` +
        `📋 Nomor Antrian: ${client.queue_id}\n` +
        `👤 Nama: ${client.nama_lengkap}\n` +
        `🏢 Jenis Bimbingan: ${getSubServiceLabel(client.sub_service)}\n` +
        `👨‍💼 Pembimbing: ${client.pk_officer_name}\n` +
        `📍 Alamat: ${client.alamat_domisili}\n` +
        `💼 Status Pekerjaan: ${client.status_pekerjaan === 'bekerja' ? 'Bekerja' : 'Tidak Bekerja'}\n` +
        `${client.status_pekerjaan === 'bekerja' ? `🏭 Jenis Pekerjaan: ${client.jenis_pekerjaan}\n` : ''}` +
        `📅 Tanggal Daftar: ${new Date(client.created_at).toLocaleDateString('id-ID')}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `*JADWAL WAJIB LAPOR*\n\n` +
        `📌 Setiap bulan pada minggu pertama\n` +
        `⏰ Jam 08:00 - 15:00 WIB\n` +
        `📍 Lokasi: BAPAS Kelas I Bandung\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `*CATATAN PENTING*\n\n` +
        `✅ Harap datang tepat waktu\n` +
        `✅ Bawa KTP asli\n` +
        `✅ Berpakaian sopan\n` +
        `✅ Konfirmasi kehadiran via WhatsApp\n\n` +
        `_Terima kasih atas kerjasamanya_\n\n` +
        `📞 Hubungi: ${client.pk_officer_name}\n` +
        `📱 WhatsApp: ${client.whatsapp_number}`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      // Buka WhatsApp
      window.open(whatsappUrl, '_blank');

      // Update status di database
      const { error } = await supabase
        .from('bimbingan_clients')
        .update({
          buku_wajib_lapor_sent: true,
          buku_wajib_lapor_sent_at: new Date().toISOString(),
        })
        .eq('id', client.id);

      if (error) throw error;

      toast.success('Membuka WhatsApp untuk mengirim buku wajib lapor');
      loadClients(); // Refresh data
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal mengirim buku wajib lapor');
    }
  };

  const exportToCSV = () => {
    const csvData = filteredClients.map(c => ({
      'Nomor Antrian': c.queue_id,
      'Nama Lengkap': c.nama_lengkap,
      'Alamat': c.alamat_domisili,
      'Status Pekerjaan': c.status_pekerjaan === 'bekerja' ? 'Bekerja' : 'Tidak Bekerja',
      'Jenis Pekerjaan': c.jenis_pekerjaan,
      'WhatsApp': c.whatsapp_number,
      'Jenis Bimbingan': getSubServiceLabel(c.sub_service),
      'Pembimbing': c.pk_officer_name,
      'Buku Terkirim': c.buku_wajib_lapor_sent ? 'Ya' : 'Belum',
      'Tanggal Daftar': new Date(c.created_at).toLocaleDateString('id-ID'),
    }));

    const headers = Object.keys(csvData[0] || {});
    const csv = [
      headers.join(','),
      ...csvData.map(row => headers.map(h => `"${row[h as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-klien-bimbingan-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Data berhasil diexport');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 md:p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-primary-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold">
                Dashboard Pembimbing Kemasyarakatan
              </h1>
              <p className="text-sm md:text-lg opacity-90">
                Data Klien Bimbingan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Filter & Actions */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <Label className="text-sm font-semibold mb-2 block">Filter by PK:</Label>
              <select
                value={selectedPK}
                onChange={(e) => setSelectedPK(e.target.value)}
                className="w-full md:w-64 p-2 border rounded-md"
              >
                <option value="all">Semua PK</option>
                {pkOfficers.map(pk => (
                  <option key={pk.id} value={pk.id}>{pk.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button onClick={loadClients} variant="outline" className="flex-1 md:flex-none">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={exportToCSV} variant="outline" className="flex-1 md:flex-none">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Klien</p>
            <p className="text-3xl font-bold">{filteredClients.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Wajib Lapor</p>
            <p className="text-3xl font-bold">
              {filteredClients.filter(c => c.sub_service === 'wajib_lapor').length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Kepribadian</p>
            <p className="text-3xl font-bold">
              {filteredClients.filter(c => c.sub_service === 'kepribadian').length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Kemandirian</p>
            <p className="text-3xl font-bold">
              {filteredClients.filter(c => c.sub_service === 'kemandirian').length}
            </p>
          </Card>
        </div>

        {/* Client List */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Daftar Klien</h2>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Memuat data...</p>
          ) : filteredClients.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Belum ada data klien</p>
          ) : (
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <Card key={client.id} className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold">{client.nama_lengkap}</h3>
                        <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded">
                          {client.queue_id}
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {getSubServiceLabel(client.sub_service)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p><strong>Pembimbing:</strong> {client.pk_officer_name}</p>
                        <p><strong>WhatsApp:</strong> {client.whatsapp_number}</p>
                        <p><strong>Alamat:</strong> {client.alamat_domisili}</p>
                        <p><strong>Pekerjaan:</strong> {client.status_pekerjaan === 'bekerja' ? client.jenis_pekerjaan : 'Tidak Bekerja'}</p>
                        <p><strong>Tanggal:</strong> {new Date(client.created_at).toLocaleDateString('id-ID')}</p>
                        <p><strong>Buku Terkirim:</strong> {client.buku_wajib_lapor_sent ? '✅ Ya' : '❌ Belum'}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => sendBukuWajibLapor(client)}
                      className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                      disabled={client.buku_wajib_lapor_sent}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {client.buku_wajib_lapor_sent ? 'Sudah Terkirim' : 'Kirim Buku WL'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PKDashboard;

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
