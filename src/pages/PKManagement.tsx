import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Edit, Trash2, Search, UserCheck, UserX } from 'lucide-react';
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

const PKManagement = () => {
  const navigate = useNavigate();
  const [officers, setOfficers] = useState<PKOfficer[]>([]);
  const [filteredOfficers, setFilteredOfficers] = useState<PKOfficer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<PKOfficer | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    position: '',
    phone: '',
    email: '',
    is_active: true
  });

  useEffect(() => {
    loadOfficers();
  }, []);

  useEffect(() => {
    filterOfficers();
  }, [officers, searchTerm, showActiveOnly]);

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

  const filterOfficers = () => {
    let filtered = officers;

    if (showActiveOnly) {
      filtered = filtered.filter(o => o.is_active);
    }

    if (searchTerm) {
      filtered = filtered.filter(o =>
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.nip && o.nip.toLowerCase().includes(searchTerm.toLowerCase())) ||
        o.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOfficers(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingOfficer) {
        // Update
        const { error } = await supabase
          .from('pk_officers')
          .update({
            name: formData.name,
            nip: formData.nip || null,
            position: formData.position,
            phone: formData.phone || null,
            email: formData.email || null,
            is_active: formData.is_active
          })
          .eq('id', editingOfficer.id);

        if (error) throw error;
        toast.success('Data PK berhasil diperbarui');
      } else {
        // Insert
        const { error } = await supabase
          .from('pk_officers')
          .insert({
            name: formData.name,
            nip: formData.nip || null,
            position: formData.position,
            phone: formData.phone || null,
            email: formData.email || null,
            is_active: formData.is_active
          });

        if (error) throw error;
        toast.success('PK baru berhasil ditambahkan');
      }

      setDialogOpen(false);
      resetForm();
      loadOfficers();
    } catch (error: any) {
      console.error('Error saving PK officer:', error);
      if (error.code === '23505') {
        toast.error('NIP sudah terdaftar');
      } else {
        toast.error('Gagal menyimpan data');
      }
    }
  };

  const handleEdit = (officer: PKOfficer) => {
    setEditingOfficer(officer);
    setFormData({
      name: officer.name,
      nip: officer.nip || '',
      position: officer.position,
      phone: officer.phone || '',
      email: officer.email || '',
      is_active: officer.is_active
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus data PK ini?')) return;

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

  const resetForm = () => {
    setFormData({
      name: '',
      nip: '',
      position: '',
      phone: '',
      email: '',
      is_active: true
    });
    setEditingOfficer(null);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/settings')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-3xl font-bold">Manajemen Pembimbing Kemasyarakatan</h1>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah PK
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingOfficer ? 'Edit Data PK' : 'Tambah PK Baru'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nip">NIP</Label>
                    <Input
                      id="nip"
                      value={formData.nip}
                      onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                      placeholder="199001012015031001"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Jabatan *</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      required
                      placeholder="Pembimbing Kemasyarakatan Ahli Pertama"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">No. Telepon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="08123456789"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nama@bapas.go.id"
                    />
                  </div>
                  
                  <div className="col-span-2 flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Aktif</Label>
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                    Batal
                  </Button>
                  <Button type="submit">
                    {editingOfficer ? 'Update' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total PK</p>
                <p className="text-2xl font-bold">{officers.length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-primary" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {officers.filter(o => o.is_active).length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tidak Aktif</p>
                <p className="text-2xl font-bold text-red-600">
                  {officers.filter(o => !o.is_active).length}
                </p>
              </div>
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, NIP, atau jabatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-active"
                checked={showActiveOnly}
                onCheckedChange={setShowActiveOnly}
              />
              <Label htmlFor="show-active">Tampilkan Aktif Saja</Label>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-3">Nama</th>
                  <th className="text-left p-3">NIP</th>
                  <th className="text-left p-3">Jabatan</th>
                  <th className="text-left p-3">Kontak</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-center p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredOfficers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                      Tidak ada data PK
                    </td>
                  </tr>
                ) : (
                  filteredOfficers.map((officer) => (
                    <tr key={officer.id} className="border-b hover:bg-secondary/50">
                      <td className="p-3 font-medium">{officer.name}</td>
                      <td className="p-3 text-sm">{officer.nip || '-'}</td>
                      <td className="p-3 text-sm">{officer.position}</td>
                      <td className="p-3 text-sm">
                        {officer.phone && <div>{officer.phone}</div>}
                        {officer.email && <div className="text-xs text-muted-foreground">{officer.email}</div>}
                        {!officer.phone && !officer.email && '-'}
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActive(officer)}
                        >
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              officer.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {officer.is_active ? 'Aktif' : 'Tidak Aktif'}
                          </span>
                        </Button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(officer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(officer.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PKManagement;
