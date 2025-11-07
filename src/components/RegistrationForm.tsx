import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PKOfficer {
  id: string;
  name: string;
  position: string;
}

interface RegistrationFormProps {
  onSubmit: (clientName: string, pkOfficer: PKOfficer) => void;
  onBack: () => void;
}

export const RegistrationForm = ({ onSubmit, onBack }: RegistrationFormProps) => {
  const [clientName, setClientName] = useState('');
  const [selectedPkId, setSelectedPkId] = useState('');
  const [pkOfficers, setPkOfficers] = useState<PKOfficer[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ clientName?: string; pkOfficer?: string }>({});

  useEffect(() => {
    fetchPkOfficers();
  }, []);

  const fetchPkOfficers = async () => {
    try {
      const { data, error } = await supabase
        .from('pk_officers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setPkOfficers(data || []);
    } catch (error) {
      console.error('Error fetching PK officers:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { clientName?: string; pkOfficer?: string } = {};
    
    if (!clientName.trim()) {
      newErrors.clientName = 'Nama klien harus diisi';
    } else if (clientName.trim().length < 3) {
      newErrors.clientName = 'Nama klien minimal 3 karakter';
    } else if (!/^[a-zA-Z\s.]+$/.test(clientName.trim())) {
      newErrors.clientName = 'Nama klien hanya boleh mengandung huruf dan spasi';
    }
    
    if (!selectedPkId) {
      newErrors.pkOfficer = 'Pembimbing Kemasyarakatan harus dipilih';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Mohon lengkapi form dengan benar');
      return;
    }
    
    const selectedOfficer = pkOfficers.find(officer => officer.id === selectedPkId);
    if (clientName && selectedOfficer) {
      onSubmit(clientName, selectedOfficer);
      toast.success('Nomor antrian berhasil dibuat');
    }
  };

  const isFormValid = clientName.trim() !== '' && selectedPkId !== '';

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali
      </Button>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Formulir Pendaftaran</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nama Klien</Label>
            <Input
              id="clientName"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                if (errors.clientName) {
                  setErrors({ ...errors, clientName: undefined });
                }
              }}
              className={errors.clientName ? 'border-red-500' : ''}
              required
            />
            {errors.clientName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.clientName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pkOfficer">Pembimbing Kemasyarakatan (PK)</Label>
            <Select 
              value={selectedPkId} 
              onValueChange={(value) => {
                setSelectedPkId(value);
                if (errors.pkOfficer) {
                  setErrors({ ...errors, pkOfficer: undefined });
                }
              }} 
              required
            >
              <SelectTrigger id="pkOfficer">
                <SelectValue placeholder="Pilih Pembimbing Kemasyarakatan" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>Memuat...</SelectItem>
                ) : pkOfficers.length === 0 ? (
                  <SelectItem value="empty" disabled>Tidak ada data</SelectItem>
                ) : (
                  pkOfficers.map((officer) => (
                    <SelectItem key={officer.id} value={officer.id}>
                      {officer.name} - {officer.position}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.pkOfficer && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.pkOfficer}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!isFormValid || loading}
          >
            Ambil Nomor Antrian
          </Button>
        </form>
      </Card>
    </div>
  );
};
