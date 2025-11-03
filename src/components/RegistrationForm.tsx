import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedOfficer = pkOfficers.find(officer => officer.id === selectedPkId);
    if (clientName && selectedOfficer) {
      onSubmit(clientName, selectedOfficer);
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
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pkOfficer">Pembimbing Kemasyarakatan (PK)</Label>
            <Select value={selectedPkId} onValueChange={setSelectedPkId} required>
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
