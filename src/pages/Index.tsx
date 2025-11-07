import { useState, useEffect } from 'react';
import { ServiceCard } from '@/components/ServiceCard';
import { QueueTicket } from '@/components/QueueTicket';
import { RegistrationForm } from '@/components/RegistrationForm';
import { PenghadapanForm, PenghadapanData } from '@/components/PenghadapanForm';
import { BimbinganForm, BimbinganData } from '@/components/BimbinganForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ServiceType, SUB_SERVICE_NAMES, QueueItem } from '@/types/queue';
import { queueManager } from '@/lib/queueManager';
import { FileText, Users, UserCheck, MessageSquare, ArrowLeft, Monitor, Settings, LogOut, LogIn, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedSubService, setSelectedSubService] = useState<string | null>(null);
  const [generatedQueue, setGeneratedQueue] = useState<QueueItem | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const services = [
    { type: 'penghadapan' as ServiceType, icon: FileText },
    { type: 'bimbingan' as ServiceType, icon: UserCheck },
    { type: 'kunjungan' as ServiceType, icon: Users },
    { type: 'pengaduan' as ServiceType, icon: MessageSquare },
  ];

  const handleServiceSelect = (type: ServiceType) => {
    setSelectedService(type);
    // Untuk Penghadapan, set flag khusus
    if (type === 'penghadapan') {
      setSelectedSubService('penghadapan-form');
    }
  };

  const handleSubServiceSelect = (subService: string) => {
    setSelectedSubService(subService);
  };

  const handleRegistrationSubmit = (clientName: string, pkOfficer: { id: string; name: string; position: string }) => {
    if (selectedService && selectedSubService) {
      const queue = queueManager.createQueue(
        selectedService, 
        selectedSubService,
        clientName,
        pkOfficer.id,
        pkOfficer.name,
        pkOfficer.position
      );
      setGeneratedQueue(queue);
      setSelectedService(null);
      setSelectedSubService(null);
    }
  };

  const handleCloseTicket = () => {
    setGeneratedQueue(null);
  };

  const handleBack = () => {
    setSelectedSubService(null);
    setSelectedService(null);
  };

  const handleBackFromRegistration = () => {
    setSelectedSubService(null);
  };

  const handlePenghadapanSubmit = async (data: PenghadapanData) => {
    try {
      let publicUrl = null;
      let dokumenFilename = null;

      // Upload dokumen ke Supabase Storage (jika ada)
      if (data.dokumen) {
        try {
          const fileExt = data.dokumen.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('penghadapan-documents')
            .upload(filePath, data.dokumen);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            toast.error('Gagal upload dokumen, melanjutkan tanpa dokumen');
          } else {
            // Get public URL
            const { data: urlData } = supabase.storage
              .from('penghadapan-documents')
              .getPublicUrl(filePath);
            
            publicUrl = urlData.publicUrl;
            dokumenFilename = data.dokumen.name;
            toast.success('Dokumen berhasil diupload');
          }
        } catch (uploadErr) {
          console.error('Upload exception:', uploadErr);
          toast.error('Error upload dokumen, melanjutkan tanpa dokumen');
        }
      }

      // Create queue dengan info penghadapan
      const clientInfo = `${data.asalUPT} (${data.jumlahKlien} klien)`;
      const queue = queueManager.createQueue(
        'penghadapan',
        data.jenisUPT,
        clientInfo,
        'system', // PK ID placeholder
        data.jenisUPT.toUpperCase(), // PK name = jenis UPT
        data.asalUPT // PK position = asal UPT
      );
      
      // Tambahkan WhatsApp ke queue
      queue.whatsappNumber = data.noWhatsapp;

      // Simpan data penghadapan ke database
      const { error: dbError } = await supabase
        .from('penghadapan_submissions')
        .insert({
          queue_id: queue.queueNumber,
          jenis_upt: data.jenisUPT,
          asal_upt: data.asalUPT,
          jumlah_klien: data.jumlahKlien,
          nama_klien: data.namaKlien,
          dokumen_url: publicUrl,
          dokumen_filename: dokumenFilename,
          status: 'pending',
        });

      if (dbError) {
        console.error('Error saving penghadapan:', dbError);
        // Tetap lanjut meskipun error DB, queue sudah dibuat
      }

      setGeneratedQueue(queue);
      setSelectedService(null);
      setSelectedSubService(null);
      toast.success('Penghadapan berhasil didaftarkan!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan, silakan coba lagi');
    }
  };

  const handleBimbinganSubmit = async (data: BimbinganData) => {
    try {
      console.log('=== BIMBINGAN SUBMIT START ===');
      console.log('Data:', data);

      // Create queue dengan info bimbingan
      const queue = queueManager.createQueue(
        'bimbingan',
        data.subService,
        data.namaLengkap,
        data.pkOfficerId,
        data.pkOfficerName,
        data.pkOfficerPosition
      );
      
      console.log('Queue created:', queue);
      
      // Tambahkan WhatsApp ke queue
      queue.whatsappNumber = data.noWhatsapp;

      // Prepare data untuk insert
      const insertData = {
        queue_id: queue.queueNumber,
        pk_officer_id: data.pkOfficerId,
        pk_officer_name: data.pkOfficerName,
        pk_officer_position: data.pkOfficerPosition,
        sub_service: data.subService,
        nama_lengkap: data.namaLengkap,
        alamat_domisili: data.alamatDomisili,
        status_pekerjaan: data.statusPekerjaan,
        jenis_pekerjaan: data.jenisPekerjaan,
        whatsapp_number: data.noWhatsapp,
        status: 'active',
      };

      console.log('Insert data:', insertData);

      // Simpan data klien bimbingan ke database
      const { data: insertedData, error: dbError } = await supabase
        .from('bimbingan_clients')
        .insert(insertData)
        .select();

      if (dbError) {
        console.error('=== DATABASE ERROR ===');
        console.error('Error code:', dbError.code);
        console.error('Error message:', dbError.message);
        console.error('Error details:', dbError.details);
        console.error('Error hint:', dbError.hint);
        
        // Show detailed error to user
        if (dbError.message.includes('relation') && dbError.message.includes('does not exist')) {
          toast.error('Tabel bimbingan_clients belum dibuat. Silakan run SQL migration terlebih dahulu.');
        } else {
          toast.error(`Gagal menyimpan data: ${dbError.message}`);
        }
        return;
      }

      console.log('=== INSERT SUCCESS ===');
      console.log('Inserted data:', insertedData);

      setGeneratedQueue(queue);
      setSelectedService(null);
      setSelectedSubService(null);
      toast.success('Pendaftaran bimbingan berhasil!');
    } catch (error: any) {
      console.error('=== EXCEPTION ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      toast.error(`Terjadi kesalahan: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Gagal logout');
    } else {
      toast.success('Berhasil logout');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
              <Monitor className="w-8 h-8 md:w-12 md:h-12" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                KIANSANTANG
              </h1>
              <p className="text-xs md:text-sm font-medium text-blue-100 tracking-wide">
                Kios Antrian Santun dan Tanggap
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm md:text-base text-blue-100 font-medium">
              Sistem Layanan BAPAS Bandung Berbasis Digital
            </p>
            <p className="text-xs md:text-sm text-blue-200 mt-1">
              Balai Pemasyarakatan Kelas I Bandung
            </p>
          </div>
        </div>
      </div>

      {/* Modern Navigation Bar */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-wrap gap-2 md:gap-3 justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Online</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/display')}
                className="border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              >
                <Monitor className="w-4 h-4 mr-2" />
                Display
              </Button>
              {session ? (
                <>
                  <Button 
                    variant="default"
                    onClick={() => navigate('/operator')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Operator
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="default" 
                    onClick={() => navigate('/admin-setup')}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Setup Admin
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/auth')}
                    className="border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {!selectedService ? (
          <div className="space-y-6">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Pilih Layanan</h2>
              <p className="text-sm md:text-base text-muted-foreground">Silakan pilih jenis layanan yang Anda butuhkan</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {services.map(({ type, icon }) => (
                <ServiceCard
                  key={type}
                  type={type}
                  icon={icon}
                  onClick={() => handleServiceSelect(type)}
                />
              ))}
            </div>
          </div>
        ) : selectedSubService === 'penghadapan-form' ? (
          <PenghadapanForm 
            onSubmit={handlePenghadapanSubmit}
            onBack={handleBack}
          />
        ) : selectedService === 'bimbingan' && selectedSubService ? (
          <BimbinganForm 
            subService={selectedSubService as 'wajib_lapor' | 'kepribadian' | 'kemandirian'}
            onSubmit={handleBimbinganSubmit}
            onBack={handleBackFromRegistration}
          />
        ) : selectedSubService ? (
          <RegistrationForm 
            onSubmit={handleRegistrationSubmit}
            onBack={handleBackFromRegistration}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
              <Button variant="outline" onClick={handleBack} className="w-full md:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <h2 className="text-2xl md:text-3xl font-bold">Pilih Sub Layanan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {Object.entries(SUB_SERVICE_NAMES[selectedService]).map(([key, label]) => (
                <Card
                  key={key}
                  onClick={() => handleSubServiceSelect(key)}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card"
                >
                  <p className="text-xl font-semibold text-center">{label}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {generatedQueue && (
        <QueueTicket queue={generatedQueue} onClose={handleCloseTicket} />
      )}
    </div>
  );
};

export default Index;
