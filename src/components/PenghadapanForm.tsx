import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PenghadapanFormProps {
  onSubmit: (data: PenghadapanData) => void;
  onBack: () => void;
}

export interface PenghadapanData {
  jenisUPT: 'lapas' | 'rutan' | 'lpka';
  asalUPT: string;
  jumlahKlien: number;
  namaKlien: string[];
  noWhatsapp: string;
  dokumen: File | null;
}

export const PenghadapanForm = ({ onSubmit, onBack }: PenghadapanFormProps) => {
  const [jenisUPT, setJenisUPT] = useState<'lapas' | 'rutan' | 'lpka' | ''>('');
  const [asalUPT, setAsalUPT] = useState('');
  const [namaKlien, setNamaKlien] = useState<string[]>(['']);
  const [noWhatsapp, setNoWhatsapp] = useState('');
  const [dokumen, setDokumen] = useState<File | null>(null);

  const handleAddKlien = () => {
    setNamaKlien([...namaKlien, '']);
  };

  const handleRemoveKlien = (index: number) => {
    if (namaKlien.length > 1) {
      const newNamaKlien = namaKlien.filter((_, i) => i !== index);
      setNamaKlien(newNamaKlien);
    }
  };

  const handleKlienChange = (index: number, value: string) => {
    const newNamaKlien = [...namaKlien];
    newNamaKlien[index] = value;
    setNamaKlien(newNamaKlien);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      // Validasi tipe file
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format file harus PDF, JPG, atau PNG');
        return;
      }
      setDokumen(file);
      toast.success('File berhasil dipilih');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!jenisUPT) {
      toast.error('Pilih jenis UPT terlebih dahulu');
      return;
    }

    if (!asalUPT.trim()) {
      toast.error('Isi asal UPT terlebih dahulu');
      return;
    }

    const validNamaKlien = namaKlien.filter(nama => nama.trim() !== '');
    if (validNamaKlien.length === 0) {
      toast.error('Isi minimal 1 nama klien');
      return;
    }

    if (!noWhatsapp.trim()) {
      toast.error('Isi nomor WhatsApp terlebih dahulu');
      return;
    }

    // Validasi format WhatsApp (angka saja, minimal 10 digit)
    const cleanWhatsapp = noWhatsapp.replace(/\D/g, '');
    if (cleanWhatsapp.length < 10) {
      toast.error('Nomor WhatsApp minimal 10 digit');
      return;
    }

    // Upload dokumen opsional untuk testing
    // if (!dokumen) {
    //   toast.error('Upload dokumen terlebih dahulu');
    //   return;
    // }

    // Submit data
    onSubmit({
      jenisUPT,
      asalUPT: asalUPT.trim(),
      jumlahKlien: validNamaKlien.length,
      namaKlien: validNamaKlien,
      noWhatsapp: cleanWhatsapp,
      dokumen,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <h2 className="text-3xl font-bold">Form Penghadapan Klien</h2>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Pilih Jenis UPT */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">1. Pilih Jenis UPT *</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'lapas', label: 'LAPAS' },
                { value: 'rutan', label: 'RUTAN' },
                { value: 'lpka', label: 'LPKA' },
              ].map((option) => (
                <Card
                  key={option.value}
                  onClick={() => setJenisUPT(option.value as 'lapas' | 'rutan' | 'lpka')}
                  className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    jenisUPT === option.value
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-card hover:shadow-md'
                  }`}
                >
                  <p className="text-xl font-semibold text-center">{option.label}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Asal UPT */}
          <div className="space-y-3">
            <Label htmlFor="asalUPT" className="text-lg font-semibold">
              2. Asal UPT (Nama Lengkap) *
            </Label>
            <Input
              id="asalUPT"
              type="text"
              placeholder="Contoh: Lapas Kelas I Sukamiskin Bandung"
              value={asalUPT}
              onChange={(e) => setAsalUPT(e.target.value)}
              className="text-lg p-6"
              required
            />
            <p className="text-sm text-muted-foreground">
              Isi nama lengkap UPT yang menghadapkan klien
            </p>
          </div>

          {/* Nama-Nama Klien */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">
                3. Nama-Nama Klien * ({namaKlien.filter(n => n.trim()).length} klien)
              </Label>
              <Button
                type="button"
                onClick={handleAddKlien}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Klien
              </Button>
            </div>

            <div className="space-y-3">
              {namaKlien.map((nama, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder={`Nama Klien ${index + 1}`}
                      value={nama}
                      onChange={(e) => handleKlienChange(index, e.target.value)}
                      className="text-lg p-6"
                    />
                  </div>
                  {namaKlien.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => handleRemoveKlien(index)}
                      variant="destructive"
                      size="icon"
                      className="h-14 w-14"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Klik "Tambah Klien" untuk menambah lebih banyak klien
            </p>
          </div>

          {/* Nomor WhatsApp */}
          <div className="space-y-3">
            <Label htmlFor="noWhatsapp" className="text-lg font-semibold">
              4. Nomor WhatsApp *
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
              Nomor WhatsApp untuk menerima notifikasi antrian (minimal 10 digit)
            </p>
          </div>

          {/* Upload Dokumen */}
          <div className="space-y-3">
            <Label htmlFor="dokumen" className="text-lg font-semibold">
              5. Upload Dokumen Penghadapan (Opsional)
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                id="dokumen"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="dokumen"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Upload className="w-12 h-12 text-gray-400" />
                <div>
                  <p className="text-lg font-semibold">
                    {dokumen ? dokumen.name : 'Klik untuk upload dokumen'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Format: PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
              </label>
            </div>
            {dokumen && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  ✅ File terpilih: <strong>{dokumen.name}</strong> ({(dokumen.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full text-lg py-6"
            >
              Submit Penghadapan
            </Button>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Catatan:</strong> Pastikan semua data sudah benar sebelum submit. 
              Dokumen yang diupload akan disimpan dan dapat diakses oleh petugas.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};
