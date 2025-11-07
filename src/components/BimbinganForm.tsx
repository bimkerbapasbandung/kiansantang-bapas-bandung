import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UserCheck, Search, Users, AlertCircle, Sheet, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface BimbinganFormProps {
  subService: 'wajib_lapor' | 'kepribadian' | 'kemandirian';
  onSubmit: (data: BimbinganData) => void;
  onBack: () => void;
}

export interface BimbinganData {
  subService: string;
  pkOfficerId: string;
  pkOfficerName: string;
  pkOfficerPosition: string;
  namaLengkap: string;
  alamatDomisili: string;
  statusPekerjaan: 'bekerja' | 'tidak_bekerja';
  jenisPekerjaan: string;
  noWhatsapp: string;
}

interface PKOfficer {
  id: string;
  name: string;
  position: string;
  is_active: boolean;
}

export const BimbinganForm = ({ subService, onSubmit, onBack }: BimbinganFormProps) => {
  const [pkOfficers, setPkOfficers] = useState<PKOfficer[]>([]);
  const [filteredPKOfficers, setFilteredPKOfficers] = useState<PKOfficer[]>([]);
  const [searchPK, setSearchPK] = useState('');
  const [selectedPK, setSelectedPK] = useState<PKOfficer | null>(null);
  const [pkClients, setPkClients] = useState<any[]>([]);
  const [showClientList, setShowClientList] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [namaLengkap, setNamaLengkap] = useState('');
  const [alamatDomisili, setAlamatDomisili] = useState('');
  const [statusPekerjaan, setStatusPekerjaan] = useState<'bekerja' | 'tidak_bekerja' | ''>('');
  const [jenisPekerjaan, setJenisPekerjaan] = useState('');
  const [noWhatsapp, setNoWhatsapp] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(false);

  useEffect(() => {
    loadPKOfficers();
  }, []);

  useEffect(() => {
    // Filter PK berdasarkan pencarian
    if (searchPK.trim() === '') {
      setFilteredPKOfficers(pkOfficers);
    } else {
      const filtered = pkOfficers.filter(pk => 
        pk.name.toLowerCase().includes(searchPK.toLowerCase()) ||
        pk.position.toLowerCase().includes(searchPK.toLowerCase())
      );
      setFilteredPKOfficers(filtered);
    }
  }, [searchPK, pkOfficers]);

  const loadPKOfficers = async () => {
    try {
      setLoading(true);
      console.log('=== LOADING PK OFFICERS ===');
      
      // Load PK officers yang sudah di-sync dari Google Sheets
      const { data, error } = await supabase
        .from('pk_officers')
        .select('*')
        .eq('is_active', true)
        .not('sheet_id', 'is', null) // Hanya PK yang sudah di-sync dari Google Sheets
        .order('name');

      console.log('PK Officers query result:', { data, error });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No PK officers found with sheet_id');
        toast.info('💡 Belum ada data PK dari Google Sheets. Silakan sync terlebih dahulu!');
      } else {
        console.log(`✅ Loaded ${data.length} PK officers`);
        toast.success(`✅ ${data.length} PK berhasil dimuat dari Google Sheets`);
      }
      
      setPkOfficers(data || []);
      setFilteredPKOfficers(data || []);
    } catch (error: any) {
      console.error('=== ERROR LOADING PK OFFICERS ===');
      console.error('Error:', error);
      console.error('Error message:', error?.message);
      toast.error(`❌ Gagal memuat data PK: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadPKClients = async (pkId: string) => {
    try {
      setLoadingClients(true);
      console.log('=== LOADING PK CLIENTS ===');
      console.log('PK ID:', pkId);

      const { data, error, count } = await supabase
        .from('bimbingan_clients')
        .select('*', { count: 'exact' })
        .eq('pk_officer_id', pkId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      console.log('Query result:', { data, error, count });

      if (error) {
        console.error('=== LOAD CLIENTS ERROR ===');
        console.error('Error:', error);
        throw error;
      }

      setPkClients(data || []);
      
      if (data && data.length > 0) {
        setShowClientList(true);
        toast.success(`✅ Ditemukan ${data.length} klien dari PK ini`);
        console.log('Clients loaded:', data);
      } else {
        setShowClientList(false);
        toast.info('💡 Belum ada klien terdaftar untuk PK ini. Silakan isi data klien baru.');
        console.log('No clients found for PK:', pkId);
      }
    } catch (error: any) {
      console.error('=== EXCEPTION LOADING CLIENTS ===');
      console.error('Error:', error);
      console.error('Error message:', error?.message);
      toast.error(`Gagal memuat data klien: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleSelectPK = (pk: PKOfficer) => {
    setSelectedPK(pk);
    setSearchPK('');
    
    // DISABLE AUTO-LOAD SEMENTARA (untuk stabilitas)
    // loadPKClients(pk.id);
    
    // Reset form jika ganti PK
    setSelectedClient(null);
    setNamaLengkap('');
    setAlamatDomisili('');
    setStatusPekerjaan('');
    setJenisPekerjaan('');
    setNoWhatsapp('');
    
    // Notifikasi ke user
    toast.info('Silakan isi data klien di form di bawah');
  };

  const handleSelectClient = (client: any) => {
    setSelectedClient(client);
    setNamaLengkap(client.nama_lengkap);
    setAlamatDomisili(client.alamat_domisili);
    setStatusPekerjaan(client.status_pekerjaan);
    setJenisPekerjaan(client.jenis_pekerjaan || '');
    setNoWhatsapp(client.whatsapp_number);
    setShowClientList(false);
    toast.success('Data klien berhasil dimuat');
  };

  const handleNewClient = () => {
    setSelectedClient(null);
    setNamaLengkap('');
    setAlamatDomisili('');
    setStatusPekerjaan('');
    setJenisPekerjaan('');
    setNoWhatsapp('');
    setShowClientList(false);
    toast.info('Silakan isi data klien baru');
  };

  const getSubServiceLabel = () => {
    const labels = {
      wajib_lapor: 'Wajib Lapor',
      kepribadian: 'Kepribadian',
      kemandirian: 'Kemandirian',
    };
    return labels[subService];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('=== FORM SUBMIT START ===');
    console.log('Selected PK:', selectedPK);
    console.log('Form data:', {
      namaLengkap,
      alamatDomisili,
      statusPekerjaan,
      jenisPekerjaan,
      noWhatsapp
    });

    try {
      // Validasi
      if (!selectedPK) {
        toast.error('❌ Pilih Pembimbing Kemasyarakatan terlebih dahulu');
        return;
      }

      if (!namaLengkap.trim()) {
        toast.error('❌ Isi nama lengkap klien');
        return;
      }

      if (!alamatDomisili.trim()) {
        toast.error('❌ Isi alamat domisili');
        return;
      }

      if (!statusPekerjaan) {
        toast.error('❌ Pilih status pekerjaan');
        return;
      }

      if (statusPekerjaan === 'bekerja' && !jenisPekerjaan.trim()) {
        toast.error('❌ Isi jenis pekerjaan');
        return;
      }

      if (!noWhatsapp.trim()) {
        toast.error('❌ Isi nomor WhatsApp');
        return;
      }

      // Validasi format WhatsApp
      const cleanWhatsapp = noWhatsapp.replace(/\D/g, '');
      if (cleanWhatsapp.length < 10) {
        toast.error('❌ Nomor WhatsApp minimal 10 digit');
        return;
      }

      console.log('✅ Validation passed');

      // Submit data
      const submitData = {
        subService,
        pkOfficerId: selectedPK.id,
        pkOfficerName: selectedPK.name,
        pkOfficerPosition: selectedPK.position,
        namaLengkap: namaLengkap.trim(),
        alamatDomisili: alamatDomisili.trim(),
        statusPekerjaan,
        jenisPekerjaan: statusPekerjaan === 'bekerja' ? jenisPekerjaan.trim() : '-',
        noWhatsapp: cleanWhatsapp,
      };

      console.log('Submitting data:', submitData);
      onSubmit(submitData);
    } catch (error: any) {
      console.error('=== FORM SUBMIT ERROR ===');
      console.error('Error:', error);
      toast.error(`❌ Error: ${error?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h2 className="text-3xl font-bold">Form Pendaftaran Bimbingan</h2>
          <p className="text-muted-foreground">{getSubServiceLabel()}</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Pilih Pembimbing Kemasyarakatan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">
                1. Pilih Pembimbing Kemasyarakatan *
              </Label>
              <div className="flex items-center gap-2">
                {pkOfficers.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sheet className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-600">
                      {pkOfficers.length} PK dari Google Sheets
                    </span>
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={loadPKOfficers}
                  disabled={loading}
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
            
            {/* Search Box */}
            {!selectedPK && pkOfficers.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari nama atau jabatan PK..."
                  value={searchPK}
                  onChange={(e) => setSearchPK(e.target.value)}
                  className="pl-10 text-lg p-6"
                />
              </div>
            )}

            {/* Selected PK Display */}
            {selectedPK && (
              <Card className="p-4 bg-primary text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <UserCheck className="w-5 h-5 mt-1" />
                    <div>
                      <p className="font-semibold">{selectedPK.name}</p>
                      <p className="text-sm opacity-90">{selectedPK.position}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPK(null);
                      setShowClientList(false);
                      setPkClients([]);
                    }}
                    className="text-primary"
                  >
                    Ganti PK
                  </Button>
                </div>
              </Card>
            )}

            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Memuat data PK...</p>
              </div>
            ) : pkOfficers.length === 0 ? (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center space-y-4">
                <div className="flex justify-center">
                  <Sheet className="w-16 h-16 text-blue-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-blue-900">
                    📊 Belum Ada Data PK dari Google Sheets
                  </p>
                  <p className="text-blue-700">
                    Silakan sync data PK dari Google Sheets terlebih dahulu.
                  </p>
                  <p className="text-sm text-blue-600">
                    💡 Klik tombol "Sync Google Sheets" di halaman Operator
                  </p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  onClick={loadPKOfficers}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Coba Lagi
                </Button>
              </div>
            ) : !selectedPK ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {filteredPKOfficers.length === 0 ? (
                  <div className="col-span-2 text-center py-8">
                    <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Tidak ada PK ditemukan</p>
                  </div>
                ) : (
                  filteredPKOfficers.map((pk) => (
                    <Card
                      key={pk.id}
                      onClick={() => handleSelectPK(pk)}
                      className="p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md bg-card border-2 hover:border-primary"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <UserCheck className="w-5 h-5 mt-1 flex-shrink-0 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{pk.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{pk.position}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Sheet className="w-3 h-3 text-green-600" />
                          <span className="text-green-600 font-medium">Dari Google Sheets</span>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            ) : null}
          </div>

          {/* Daftar Klien PK (jika ada) */}
          {selectedPK && showClientList && pkClients.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">
                  <Users className="w-5 h-5 inline mr-2" />
                  Pilih Klien yang Sudah Terdaftar
                </Label>
                <Button
                  type="button"
                  onClick={handleNewClient}
                  variant="outline"
                  size="sm"
                >
                  + Klien Baru
                </Button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-3">
                  💡 Ditemukan {pkClients.length} klien terdaftar. Pilih untuk auto-fill data atau klik "Klien Baru".
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {pkClients.map((client) => (
                    <Card
                      key={client.id}
                      onClick={() => handleSelectClient(client)}
                      className="p-3 cursor-pointer hover:bg-blue-100 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{client.nama_lengkap}</p>
                          <p className="text-sm text-muted-foreground">
                            {client.whatsapp_number} • {client.status_pekerjaan === 'bekerja' ? client.jenis_pekerjaan : 'Tidak Bekerja'}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded">
                          {client.sub_service === 'wajib_lapor' ? 'WL' : client.sub_service === 'kepribadian' ? 'KP' : 'KM'}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Info Klien Terpilih */}
          {selectedClient && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                ✅ Data klien <strong>{selectedClient.nama_lengkap}</strong> berhasil dimuat. 
                Anda bisa edit data jika ada perubahan atau langsung submit.
              </p>
            </div>
          )}

          {/* Nama Lengkap Klien */}
          <div className="space-y-3">
            <Label htmlFor="namaLengkap" className="text-lg font-semibold">
              2. Nama Lengkap Klien *
            </Label>
            <Input
              id="namaLengkap"
              type="text"
              placeholder="Contoh: Ahmad Fauzi"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              className="text-lg p-6"
              required
            />
          </div>

          {/* Alamat Domisili */}
          <div className="space-y-3">
            <Label htmlFor="alamatDomisili" className="text-lg font-semibold">
              3. Alamat Domisili *
            </Label>
            <textarea
              id="alamatDomisili"
              placeholder="Contoh: Jl. Merdeka No. 123, Bandung"
              value={alamatDomisili}
              onChange={(e) => setAlamatDomisili(e.target.value)}
              className="w-full min-h-[100px] p-4 text-lg border rounded-md"
              required
            />
          </div>

          {/* Status Pekerjaan */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">4. Status Pekerjaan *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'bekerja', label: 'Bekerja' },
                { value: 'tidak_bekerja', label: 'Tidak Bekerja' },
              ].map((option) => (
                <Card
                  key={option.value}
                  onClick={() => setStatusPekerjaan(option.value as 'bekerja' | 'tidak_bekerja')}
                  className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    statusPekerjaan === option.value
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-card hover:shadow-md'
                  }`}
                >
                  <p className="text-xl font-semibold text-center">{option.label}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Jenis Pekerjaan (conditional) */}
          {statusPekerjaan === 'bekerja' && (
            <div className="space-y-3">
              <Label htmlFor="jenisPekerjaan" className="text-lg font-semibold">
                5. Jenis Pekerjaan *
              </Label>
              <Input
                id="jenisPekerjaan"
                type="text"
                placeholder="Contoh: Karyawan Swasta, Wiraswasta, PNS, dll"
                value={jenisPekerjaan}
                onChange={(e) => setJenisPekerjaan(e.target.value)}
                className="text-lg p-6"
                required
              />
            </div>
          )}

          {/* Nomor WhatsApp */}
          <div className="space-y-3">
            <Label htmlFor="noWhatsapp" className="text-lg font-semibold">
              {statusPekerjaan === 'bekerja' ? '6' : '5'}. Nomor WhatsApp *
            </Label>
            <Input
              id="noWhatsapp"
              type="tel"
              placeholder="Contoh: 08123456789 atau 628123456789"
              value={noWhatsapp}
              onChange={(e) => setNoWhatsapp(e.target.value)}
              className="text-lg p-6"
              required
            />
            <p className="text-sm text-muted-foreground">
              Nomor WhatsApp untuk menerima notifikasi dan buku wajib lapor (minimal 10 digit)
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full text-lg py-6"
              disabled={loading || pkOfficers.length === 0}
            >
              Daftar Bimbingan
            </Button>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Catatan:</strong> Data yang Anda masukkan akan digunakan untuk membuat 
              buku wajib lapor dan akan dikirim ke WhatsApp Anda. Pastikan semua data sudah benar.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};
