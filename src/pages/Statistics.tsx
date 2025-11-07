import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { queueManager } from '@/lib/queueManager';
import { QueueItem, SERVICE_NAMES } from '@/types/queue';
import { ArrowLeft, Download, Users, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Statistics = () => {
  const navigate = useNavigate();
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadQueues();
  }, [selectedDate]);

  const loadQueues = () => {
    const allQueues = queueManager.getQueues();
    const filtered = allQueues.filter(q => {
      const queueDate = new Date(q.createdAt).toISOString().split('T')[0];
      return queueDate === selectedDate;
    });
    setQueues(filtered);
  };

  const stats = {
    total: queues.length,
    completed: queues.filter(q => q.status === 'completed').length,
    serving: queues.filter(q => q.status === 'serving').length,
    waiting: queues.filter(q => q.status === 'waiting').length,
    byService: Object.fromEntries(
      Object.keys(SERVICE_NAMES).map(service => [
        service,
        queues.filter(q => q.serviceType === service).length
      ])
    ),
    avgWaitTime: calculateAverageWaitTime(queues),
    avgServiceTime: calculateAverageServiceTime(queues)
  };

  function calculateAverageWaitTime(queues: QueueItem[]): number {
    const servedQueues = queues.filter(q => q.calledAt);
    if (servedQueues.length === 0) return 0;
    
    const totalWait = servedQueues.reduce((sum, q) => {
      const wait = q.calledAt!.getTime() - q.createdAt.getTime();
      return sum + wait;
    }, 0);
    
    return Math.round(totalWait / servedQueues.length / 1000 / 60); // minutes
  }

  function calculateAverageServiceTime(queues: QueueItem[]): number {
    const completedQueues = queues.filter(q => q.completedAt && q.calledAt);
    if (completedQueues.length === 0) return 0;
    
    const totalService = completedQueues.reduce((sum, q) => {
      const serviceTime = q.completedAt!.getTime() - q.calledAt!.getTime();
      return sum + serviceTime;
    }, 0);
    
    return Math.round(totalService / completedQueues.length / 1000 / 60); // minutes
  }

  const exportToCSV = () => {
    const headers = ['Nomor Antrian', 'Layanan', 'Sub Layanan', 'Nama Klien', 'PK', 'Status', 'Waktu Dibuat', 'Waktu Dipanggil', 'Waktu Selesai'];
    const rows = queues.map(q => [
      q.queueNumber,
      SERVICE_NAMES[q.serviceType],
      q.subService,
      q.clientName,
      q.pkOfficerName,
      q.status,
      new Date(q.createdAt).toLocaleString('id-ID'),
      q.calledAt ? new Date(q.calledAt).toLocaleString('id-ID') : '-',
      q.completedAt ? new Date(q.completedAt).toLocaleString('id-ID') : '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `laporan-antrian-${selectedDate}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/operator')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-3xl font-bold">Statistik & Laporan</h1>
          </div>
          <Button onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <label className="font-medium">Tanggal:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Antrian</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Selesai</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% dari total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Waktu Tunggu</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgWaitTime} menit</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Waktu Layanan</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgServiceTime} menit</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Antrian per Layanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.byService).map(([service, count]) => (
                <div key={service} className="flex items-center justify-between">
                  <span className="font-medium">{SERVICE_NAMES[service as keyof typeof SERVICE_NAMES]}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-64 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="font-bold w-12 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Antrian Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">No. Antrian</th>
                    <th className="text-left p-2">Layanan</th>
                    <th className="text-left p-2">Nama Klien</th>
                    <th className="text-left p-2">PK</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {queues.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-muted-foreground">
                        Tidak ada data untuk tanggal ini
                      </td>
                    </tr>
                  ) : (
                    queues.map((queue) => (
                      <tr key={queue.id} className="border-b hover:bg-secondary/50">
                        <td className="p-2 font-medium">{queue.queueNumber}</td>
                        <td className="p-2">{SERVICE_NAMES[queue.serviceType]}</td>
                        <td className="p-2">{queue.clientName}</td>
                        <td className="p-2 text-sm">{queue.pkOfficerName}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              queue.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : queue.status === 'serving'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {queue.status === 'completed' ? 'Selesai' : queue.status === 'serving' ? 'Dilayani' : 'Menunggu'}
                          </span>
                        </td>
                        <td className="p-2 text-sm">{new Date(queue.createdAt).toLocaleTimeString('id-ID')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
