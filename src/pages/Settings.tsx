import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast as sonnerToast } from 'sonner';

interface DisplaySettings {
  id: string;
  running_text: string;
  video_url: string | null;
  logo_url: string | null;
  video_column_span: number;
  queue_column_span: number;
  institution_name: string;
}

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<DisplaySettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
    sonnerToast.success('Logout berhasil');
  };

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from('display_settings')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat pengaturan',
        variant: 'destructive',
      });
      return;
    }

    setSettings(data);
  };

  const handleVideoUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      throw new Error('File harus berupa video');
    }
    if (file.size > 100 * 1024 * 1024) {
      throw new Error('Ukuran video maksimal 100MB');
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `video-${Date.now()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('display-videos')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('display-videos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('File harus berupa gambar');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Ukuran logo maksimal 5MB');
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('display-logos')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('display-logos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setLoading(true);
    try {
      let videoUrl = settings.video_url;
      let logoUrl = settings.logo_url;

      if (videoFile) {
        videoUrl = await handleVideoUpload(videoFile);
      }

      if (logoFile) {
        logoUrl = await handleLogoUpload(logoFile);
      }

      const { error } = await supabase
        .from('display_settings')
        .update({
          running_text: settings.running_text,
          video_url: videoUrl,
          logo_url: logoUrl,
          video_column_span: settings.video_column_span,
          queue_column_span: settings.queue_column_span,
          institution_name: settings.institution_name,
        })
        .eq('id', '00000000-0000-0000-0000-000000000001');

      if (error) throw error;

      toast({
        title: 'Berhasil',
        description: 'Pengaturan berhasil disimpan',
      });

      setVideoFile(null);
      setLogoFile(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyimpan pengaturan',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!settings) return <div className="p-8">Memuat...</div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold">Pengaturan Display</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="institution">Nama Instansi</Label>
            <Input
              id="institution"
              value={settings.institution_name}
              onChange={(e) => setSettings({ ...settings, institution_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="runningText">Teks Running Text</Label>
            <Textarea
              id="runningText"
              value={settings.running_text}
              onChange={(e) => setSettings({ ...settings, running_text: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="videoSpan">Lebar Kolom Video (1-3)</Label>
              <Input
                id="videoSpan"
                type="number"
                min="1"
                max="3"
                value={settings.video_column_span}
                onChange={(e) => setSettings({ ...settings, video_column_span: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="queueSpan">Lebar Kolom Antrian (1-3)</Label>
              <Input
                id="queueSpan"
                type="number"
                min="1"
                max="3"
                value={settings.queue_column_span}
                onChange={(e) => setSettings({ ...settings, queue_column_span: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Upload Video</Label>
            <div className="flex items-center gap-2">
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
              {settings.video_url && !videoFile && (
                <span className="text-sm text-muted-foreground">Video sudah ada</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Upload Logo</Label>
            <div className="flex items-center gap-2">
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
              {settings.logo_url && !logoFile && (
                <span className="text-sm text-muted-foreground">Logo sudah ada</span>
              )}
            </div>
            {settings.logo_url && (
              <img src={settings.logo_url} alt="Logo" className="w-24 h-24 object-contain mt-2" />
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Settings;