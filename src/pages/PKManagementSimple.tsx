import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, RefreshCw, UserCheck, Users, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface PKOfficer {
  id: string;
  name: string;
  nip: string | null;
  position: string;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
}

const PKManagementSimple = () => {
  const navigate = useNavigate();
  const [officers, setOfficers] = useState<PKOfficer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // GANTI URL GOOGLE FORM INI DENGAN FORM ANDA!
  const GOOGLE_FORM_URL = 'https://forms.gle/YOUR_FORM_ID_HERE'; // Update ini dengan URL form Anda
  
  // URL Google Sheets untuk import (opsional)
  const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1lRqV8wNjaEGKjlXS68JMJ7wnmWUiQqBwUUzAAw0UBOc/edit';
  
  // Set ke true jika sudah buat Google Form
  const GOOGLE_FORM_ENABLED = true; // Aktifkan untuk menggunakan Google Form/Sheets

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pk_officers')
        .select('*')
        .order('name');

      if (error) throw error;
      setOfficers(data || []);
    } catch (error) {
      console.error('Error loading PK officers:', error);
      toast.error('Gagal memuat data PK');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (officer: PKOfficer) => {
    try {
      const { error } = await supabase
        .from('pk_officers')
        .update({ is_active: !officer.is_active })
        .eq('id', officer.id);

      if (error) throw error;
      toast.success(`PK berhasil ${!officer.is_active ? 'diaktifkan' : 'dinonaktifkan'}`);
      loadOfficers();
    } catch (error) {
      console.error('Error toggling active status:', error);
      toast.error('Gagal mengubah status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus ${name}?`)) return;

    try {
      const { error } = await supabase
        .from('pk_officers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Data PK berhasil dihapus');
      loadOfficers();
    } catch (error) {
      console.error('Error deleting PK officer:', error);
      toast.error('Gagal menghapus data');
    }
  };

  const stats = {
    total: officers.length,
    active: officers.filter(o => o.is_active).length,
    inactive: officers.filter(o => !o.is_active).length,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-3xl font-bold">Manajemen Pembimbing Kemasyarakatan</h1>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button onClick={loadOfficers} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total PK</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-12 h-12 text-primary opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktif</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <UserCheck className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tidak Aktif</p>
                <p className="text-3xl font-bold text-red-600">{stats.inactive}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Google Form Integration - Only show if enabled */}
        {GOOGLE_FORM_ENABLED ? (
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    📝 Tambah PK via Google Forms
                  </h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Gunakan Google Form untuk menambahkan data Pembimbing Kemasyarakatan baru. 
                    Form ini lebih mudah digunakan dan data otomatis tersimpan.
                  </p>
                  
                  <div className="flex gap-3 flex-wrap">
                    <Button 
                      onClick={() => window.open(GOOGLE_FORM_URL, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Buka Google Form
                    </Button>
                    
                    <Button 
                      onClick={() => window.open(GOOGLE_SHEETS_URL, '_blank')}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Lihat Data di Sheets
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 text-sm">
                <p className="font-semibold text-blue-900 mb-2">💡 Cara Penggunaan:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>Klik tombol "Buka Google Form"</li>
                  <li>Isi data PK (Nama, NIP, Jabatan, Kontak)</li>
                  <li>Submit form</li>
                  <li>Kembali ke halaman ini dan klik "Refresh"</li>
                  <li>Data PK baru akan muncul di tabel di bawah</li>
                </ol>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500 rounded-lg">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-900 mb-2">
                  📝 Tambah PK Baru
                </h3>
                <p className="text-sm text-amber-700 mb-3">
                  Untuk menambahkan data PK baru, gunakan salah satu cara berikut:
                </p>
                
                <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="font-semibold text-amber-900 mb-2">📌 Cara 1: Via SQL (Tercepat)</p>
                    <p className="text-sm text-amber-800 mb-2">Buka Supabase Dashboard → SQL Editor, lalu jalankan:</p>
                    <code className="block bg-white p-3 rounded text-xs text-gray-800 overflow-x-auto">
                      INSERT INTO pk_officers (name, nip, position, phone, email, is_active)<br/>
                      VALUES ('Nama PK', '199001012020031001', 'Jabatan', '08123456789', 'email@bapas.go.id', true);
                    </code>
                  </div>
                  
                  <div className="pt-2 border-t border-amber-300">
                    <p className="font-semibold text-amber-900 mb-1">📌 Cara 2: Setup Google Form (Opsional)</p>
                    <p className="text-sm text-amber-800">
                      Lihat panduan di file <code className="bg-white px-2 py-1 rounded">GOOGLE_FORMS_INTEGRATION.md</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Table */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Daftar Pembimbing Kemasyarakatan</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Memuat data...</p>
              </div>
            ) : officers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                <p className="text-muted-foreground mb-2">Belum ada data PK</p>
                <p className="text-sm text-muted-foreground">
                  Gunakan Google Form di atas untuk menambahkan data
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-3 font-semibold">No</th>
                      <th className="text-left p-3 font-semibold">Nama</th>
                      <th className="text-left p-3 font-semibold">NIP</th>
                      <th className="text-left p-3 font-semibold">Jabatan</th>
                      <th className="text-left p-3 font-semibold">Kontak</th>
                      <th className="text-center p-3 font-semibold">Status</th>
                      <th className="text-center p-3 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {officers.map((officer, index) => (
                      <tr key={officer.id} className="border-b hover:bg-secondary/30">
                        <td className="p-3 text-muted-foreground">{index + 1}</td>
                        <td className="p-3">
                          <div className="font-medium">{officer.name}</div>
                        </td>
                        <td className="p-3 text-sm font-mono">{officer.nip || '-'}</td>
                        <td className="p-3 text-sm">{officer.position}</td>
                        <td className="p-3 text-sm">
                          {officer.phone && <div>📱 {officer.phone}</div>}
                          {officer.email && (
                            <div className="text-xs text-muted-foreground">✉️ {officer.email}</div>
                          )}
                          {!officer.phone && !officer.email && '-'}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => toggleActive(officer)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              officer.is_active
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {officer.is_active ? (
                              <>
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                Aktif
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 inline mr-1" />
                                Tidak Aktif
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(officer.id, officer.name)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        {/* Info Footer */}
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>⚠️ Catatan:</strong> Data PK yang ditampilkan di sini berasal dari database. 
            {GOOGLE_FORM_ENABLED 
              ? 'Untuk menambah PK baru, gunakan Google Form. Data akan otomatis tersinkronisasi.'
              : 'Untuk menambah PK baru, gunakan SQL query di Supabase Dashboard (lihat panduan di atas).'}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PKManagementSimple;
