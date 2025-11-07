import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Volume2, MessageSquare, Bell, Settings as SettingsIcon, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { soundManager } from '@/lib/soundManager';
import { AudioRecorder } from '@/components/AudioRecorder';

interface TemplateSettings {
  penghadapan: string;
  bimbingan: string;
  kunjungan: string;
  pengaduan: string;
}

interface VoiceSettings {
  rate: number; // 0.5 - 2.0
  pitch: number; // 0 - 2
  volume: number; // 0 - 1
  voice: string;
}

interface SmartCallSettings {
  enablePriority: boolean;
  enableAutoCall: boolean;
  autoCallDelay: number; // seconds
  enableNotification: boolean;
  notificationSound: boolean;
}

interface CustomAudioSettings {
  penghadapan: string | null;
  bimbingan: string | null;
  kunjungan: string | null;
  pengaduan: string | null;
  useCustomAudio: boolean;
}

interface NotificationSettings {
  type: 'beep' | 'bell' | 'chime' | 'custom' | 'none';
  customSoundURL: string | null;
}

const OperatorSettings = () => {
  const navigate = useNavigate();
  
  // Template Settings
  const [templates, setTemplates] = useState<TemplateSettings>({
    penghadapan: `📢 PEMANGGILAN LAYANAN PENGHADAPAN

🎫 Nomor Antrian: {{queueNumber}}
👤 Nama: {{clientName}}
📋 Layanan: {{serviceName}}
📝 Sub Layanan: {{subServiceName}}
👨‍💼 PK: {{pkOfficerName}}
📍 Posisi: {{pkOfficerPosition}}
⏰ Waktu: {{time}}

📍 Silakan menuju ke Loket {{counter}}
✅ Mohon membawa dokumen yang diperlukan`,

    bimbingan: `📢 PEMANGGILAN LAYANAN BIMBINGAN

🎫 Nomor Antrian: {{queueNumber}}
👤 Nama Klien: {{clientName}}
📋 Jenis Bimbingan: {{subServiceName}}
👨‍💼 Pembimbing Kemasyarakatan: {{pkOfficerName}}
📍 Jabatan: {{pkOfficerPosition}}
⏰ Waktu Daftar: {{time}}

📍 Silakan menuju ke Ruang Bimbingan - Loket {{counter}}
📝 Mohon membawa KTP dan dokumen pendukung`,

    kunjungan: `📢 PEMANGGILAN LAYANAN KUNJUNGAN

🎫 Nomor Antrian: {{queueNumber}}
👤 Nama Pengunjung: {{clientName}}
📋 Layanan: {{serviceName}}
📝 Keperluan: {{subServiceName}}
⏰ Waktu: {{time}}

📍 Silakan menuju ke Loket {{counter}}
🆔 Mohon membawa KTP dan surat izin kunjungan`,

    pengaduan: `📢 PEMANGGILAN LAYANAN PENGADUAN

🎫 Nomor Antrian: {{queueNumber}}
👤 Nama: {{clientName}}
📋 Layanan: {{serviceName}}
📝 Jenis: {{subServiceName}}
⏰ Waktu: {{time}}

📍 Silakan menuju ke Loket {{counter}}
📄 Mohon siapkan dokumen pendukung pengaduan`
  });

  // Voice Settings
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    rate: 0.9, // Kecepatan realistis (0.9 = sedikit lambat, lebih jelas)
    pitch: 1.0, // Nada normal
    volume: 1.0, // Volume penuh
    voice: 'default'
  });

  // Smart Call Settings
  const [smartSettings, setSmartSettings] = useState<SmartCallSettings>({
    enablePriority: true,
    enableAutoCall: false,
    autoCallDelay: 30,
    enableNotification: true,
    notificationSound: true
  });

  // Custom Audio Settings
  const [customAudio, setCustomAudio] = useState<CustomAudioSettings>({
    penghadapan: null,
    bimbingan: null,
    kunjungan: null,
    pengaduan: null,
    useCustomAudio: false
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    type: 'beep',
    customSoundURL: null
  });

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasUnsavedVoiceChanges, setHasUnsavedVoiceChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedTemplates = localStorage.getItem('callTemplates');
    if (savedTemplates) setTemplates(JSON.parse(savedTemplates));

    const savedVoice = localStorage.getItem('voiceSettings');
    if (savedVoice) setVoiceSettings(JSON.parse(savedVoice));

    const savedSmart = localStorage.getItem('smartCallSettings');
    if (savedSmart) setSmartSettings(JSON.parse(savedSmart));

    const savedAudio = localStorage.getItem('customAudioSettings');
    if (savedAudio) setCustomAudio(JSON.parse(savedAudio));

    const savedNotification = localStorage.getItem('notificationSettings');
    if (savedNotification) setNotificationSettings(JSON.parse(savedNotification));

    // Load available voices - filter bahasa Indonesia dengan prioritas Google
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      
      // Filter suara Indonesia dan bahasa daerah
      const indonesianVoices = allVoices.filter(voice => {
        const lang = voice.lang.toLowerCase();
        const name = voice.name.toLowerCase();
        
        // Filter berdasarkan kode bahasa dan nama
        return (
          // Kode bahasa Indonesia
          lang.includes('id-id') ||
          lang.includes('id_id') ||
          lang === 'id' ||
          
          // Bahasa daerah Indonesia
          lang.includes('jv') ||           // Jawa
          lang.includes('su') ||           // Sunda
          lang.includes('ban') ||          // Bali
          
          // Google voices
          name.includes('google') && name.includes('indonesia') ||
          name.includes('google bahasa indonesia') ||
          name.includes('damayanti') ||    // Google Indonesia Female
          name.includes('wayah') ||        // Google Indonesia Male
          
          // Microsoft voices
          name.includes('microsoft') && name.includes('indonesia') ||
          name.includes('andika') ||       // Microsoft Andika (Male)
          name.includes('gadis') ||        // Microsoft Gadis (Female)
          
          // Nama mengandung Indonesia
          name.includes('indonesia') ||
          name.includes('indonesian') ||
          
          // Bahasa daerah
          name.includes('jawa') ||
          name.includes('javanese') ||
          name.includes('sunda') ||
          name.includes('sundanese') ||
          name.includes('bali') ||
          name.includes('balinese') ||
          name.includes('melayu') ||
          name.includes('malay')
        );
      });
      
      // Sort: Google first, then Microsoft, then others
      const sortedVoices = indonesianVoices.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        
        // Google voices priority
        const aIsGoogle = aName.includes('google');
        const bIsGoogle = bName.includes('google');
        if (aIsGoogle && !bIsGoogle) return -1;
        if (!aIsGoogle && bIsGoogle) return 1;
        
        // Microsoft voices second
        const aIsMicrosoft = aName.includes('microsoft');
        const bIsMicrosoft = bName.includes('microsoft');
        if (aIsMicrosoft && !bIsMicrosoft) return -1;
        if (!aIsMicrosoft && bIsMicrosoft) return 1;
        
        // Alphabetical for same type
        return a.name.localeCompare(b.name);
      });
      
      setAvailableVoices(sortedVoices);
      
      // Log available voices for debugging
      console.log('Available Indonesian voices:', sortedVoices.map(v => ({
        name: v.name,
        lang: v.lang,
        localService: v.localService
      })));
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Detect voice settings changes
  useEffect(() => {
    const savedVoice = localStorage.getItem('voiceSettings');
    if (savedVoice) {
      const saved = JSON.parse(savedVoice);
      const hasChanges = 
        saved.rate !== voiceSettings.rate ||
        saved.pitch !== voiceSettings.pitch ||
        saved.volume !== voiceSettings.volume ||
        saved.voice !== voiceSettings.voice;
      setHasUnsavedVoiceChanges(hasChanges);
    } else {
      setHasUnsavedVoiceChanges(true);
    }
  }, [voiceSettings]);

  const saveTemplates = () => {
    localStorage.setItem('callTemplates', JSON.stringify(templates));
    toast.success('Template berhasil disimpan!');
  };

  const saveVoiceSettings = () => {
    localStorage.setItem('voiceSettings', JSON.stringify(voiceSettings));
    setHasUnsavedVoiceChanges(false);
    toast.success('Pengaturan suara berhasil disimpan!');
  };

  const saveSmartSettings = () => {
    localStorage.setItem('smartCallSettings', JSON.stringify(smartSettings));
    toast.success('Pengaturan pemanggilan berhasil disimpan!');
  };

  const saveCustomAudio = () => {
    localStorage.setItem('customAudioSettings', JSON.stringify(customAudio));
    toast.success('Pengaturan audio custom berhasil disimpan!');
  };

  const saveNotificationSettings = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    toast.success('Pengaturan notifikasi berhasil disimpan!');
  };

  const handleCustomNotificationUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setNotificationSettings(prev => ({
          ...prev,
          customSoundURL: base64
        }));
        toast.success('Audio notifikasi custom berhasil diunggah!');
      };
      reader.readAsDataURL(file);
    }
  };

  const testNotification = async () => {
    const { soundManager } = await import('@/lib/soundManager');
    await soundManager.playNotification();
    toast.info('Memutar notifikasi test...');
  };

  const handleAudioSave = (serviceType: keyof Omit<CustomAudioSettings, 'useCustomAudio'>, audioBlob: Blob, audioUrl: string) => {
    // Convert blob to base64 for storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setCustomAudio(prev => ({
        ...prev,
        [serviceType]: base64
      }));
      toast.success(`Audio ${serviceType} berhasil disimpan!`);
    };
    reader.readAsDataURL(audioBlob);
  };

  const testVoice = () => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance('Nomor antrian P H 001, silakan menuju ke loket 1');
    utterance.lang = 'id-ID';
    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = voiceSettings.volume;
    
    // Get fresh voices list
    const voices = window.speechSynthesis.getVoices();
    
    if (voiceSettings.voice !== 'default') {
      const voice = voices.find(v => v.name === voiceSettings.voice);
      if (voice) {
        utterance.voice = voice;
        console.log('Using voice:', voice.name);
      } else {
        console.warn('Voice not found:', voiceSettings.voice);
      }
    }

    console.log('Test voice settings:', {
      rate: utterance.rate,
      pitch: utterance.pitch,
      volume: utterance.volume,
      voice: utterance.voice?.name || 'default'
    });

    window.speechSynthesis.speak(utterance);
    toast.info('Memutar suara test...');
  };

  const resetToDefault = (type: 'template' | 'voice' | 'smart') => {
    if (type === 'template') {
      localStorage.removeItem('callTemplates');
      window.location.reload();
    } else if (type === 'voice') {
      setVoiceSettings({
        rate: 0.9,
        pitch: 1.0,
        volume: 1.0,
        voice: 'default'
      });
      localStorage.removeItem('voiceSettings');
      toast.success('Pengaturan suara direset ke default');
    } else {
      setSmartSettings({
        enablePriority: true,
        enableAutoCall: false,
        autoCallDelay: 30,
        enableNotification: true,
        notificationSound: true
      });
      localStorage.removeItem('smartCallSettings');
      toast.success('Pengaturan pemanggilan direset ke default');
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/operator')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-3xl font-bold">Pengaturan Operator</h1>
          </div>
        </div>

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates">
              <MessageSquare className="w-4 h-4 mr-2" />
              Template
            </TabsTrigger>
            <TabsTrigger value="voice">
              <Volume2 className="w-4 h-4 mr-2" />
              Suara
            </TabsTrigger>
            <TabsTrigger value="audio">
              <Mic className="w-4 h-4 mr-2" />
              Rekam Suara
            </TabsTrigger>
            <TabsTrigger value="smart">
              <Bell className="w-4 h-4 mr-2" />
              Cerdas
            </TabsTrigger>
          </TabsList>

          {/* TEMPLATE TAB */}
          <TabsContent value="templates" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Edit Template Pemanggilan</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => resetToDefault('template')}>
                      Reset Default
                    </Button>
                    <Button onClick={saveTemplates}>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan
                    </Button>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                  <p className="font-semibold">📝 Variabel yang tersedia:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <code>{'{{queueNumber}}'}</code>
                    <code>{'{{clientName}}'}</code>
                    <code>{'{{serviceName}}'}</code>
                    <code>{'{{subServiceName}}'}</code>
                    <code>{'{{pkOfficerName}}'}</code>
                    <code>{'{{pkOfficerPosition}}'}</code>
                    <code>{'{{time}}'}</code>
                    <code>{'{{counter}}'}</code>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Template Penghadapan</Label>
                    <Textarea
                      value={templates.penghadapan}
                      onChange={(e) => setTemplates({ ...templates, penghadapan: e.target.value })}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label>Template Bimbingan</Label>
                    <Textarea
                      value={templates.bimbingan}
                      onChange={(e) => setTemplates({ ...templates, bimbingan: e.target.value })}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label>Template Kunjungan</Label>
                    <Textarea
                      value={templates.kunjungan}
                      onChange={(e) => setTemplates({ ...templates, kunjungan: e.target.value })}
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label>Template Pengaduan</Label>
                    <Textarea
                      value={templates.pengaduan}
                      onChange={(e) => setTemplates({ ...templates, pengaduan: e.target.value })}
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* VOICE TAB */}
          <TabsContent value="voice" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold">Pengaturan Suara</h2>
                    {hasUnsavedVoiceChanges && (
                      <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold animate-pulse">
                        ⚠️ Belum Disimpan
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={testVoice}>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Test Suara
                    </Button>
                    <Button variant="outline" onClick={() => resetToDefault('voice')}>
                      Reset Default
                    </Button>
                    <Button 
                      onClick={saveVoiceSettings}
                      className={hasUnsavedVoiceChanges ? 'bg-orange-600 hover:bg-orange-700' : ''}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {hasUnsavedVoiceChanges ? 'Simpan Perubahan' : 'Simpan'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Kecepatan Bicara (Rate)</Label>
                      <span className="text-sm font-mono">{voiceSettings.rate.toFixed(1)}x</span>
                    </div>
                    <Slider
                      value={[voiceSettings.rate]}
                      onValueChange={([value]) => setVoiceSettings({ ...voiceSettings, rate: value })}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0.5x (Sangat Lambat)</span>
                      <span>0.9x (Realistis) ⭐</span>
                      <span>2.0x (Sangat Cepat)</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Nada Suara (Pitch)</Label>
                      <span className="text-sm font-mono">{voiceSettings.pitch.toFixed(2)}</span>
                    </div>
                    <Slider
                      value={[voiceSettings.pitch]}
                      onValueChange={([value]) => setVoiceSettings({ ...voiceSettings, pitch: value })}
                      min={0.5}
                      max={2.0}
                      step={0.05}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0.5 (Rendah)</span>
                      <span>0.9 (Wanita) 👩</span>
                      <span>1.0 (Normal) ⭐</span>
                      <span>1.2 (Tinggi)</span>
                      <span>2.0 (Sangat Tinggi)</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Volume</Label>
                      <span className="text-sm font-mono">{Math.round(voiceSettings.volume * 100)}%</span>
                    </div>
                    <Slider
                      value={[voiceSettings.volume]}
                      onValueChange={([value]) => setVoiceSettings({ ...voiceSettings, volume: value })}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Pilih Suara Bahasa Indonesia</Label>
                    <select
                      className="w-full p-2 border rounded-md font-mono text-sm"
                      value={voiceSettings.voice}
                      onChange={(e) => setVoiceSettings({ ...voiceSettings, voice: e.target.value })}
                    >
                      <option value="default">🔊 Default (Suara Sistem)</option>
                      
                      {availableVoices.length > 0 ? (
                        <>
                          {/* Google Voices */}
                          {availableVoices.filter(v => v.name.toLowerCase().includes('google')).length > 0 && (
                            <optgroup label="🌟 Google Voices (Rekomendasi - Kualitas Terbaik)">
                              {availableVoices
                                .filter(v => v.name.toLowerCase().includes('google'))
                                .map((voice, index) => (
                                  <option key={`google-${index}`} value={voice.name}>
                                    {voice.name.includes('Female') || voice.name.includes('Damayanti') ? '👩' : '👨'} {voice.name}
                                  </option>
                                ))}
                            </optgroup>
                          )}
                          
                          {/* Microsoft Voices */}
                          {availableVoices.filter(v => v.name.toLowerCase().includes('microsoft')).length > 0 && (
                            <optgroup label="🎤 Microsoft Voices (Kualitas Baik)">
                              {availableVoices
                                .filter(v => v.name.toLowerCase().includes('microsoft'))
                                .map((voice, index) => (
                                  <option key={`microsoft-${index}`} value={voice.name}>
                                    {voice.name.includes('Gadis') ? '👩' : '👨'} {voice.name}
                                  </option>
                                ))}
                            </optgroup>
                          )}
                          
                          {/* Other Voices */}
                          {availableVoices.filter(v => 
                            !v.name.toLowerCase().includes('google') && 
                            !v.name.toLowerCase().includes('microsoft')
                          ).length > 0 && (
                            <optgroup label="🔊 Suara Lainnya">
                              {availableVoices
                                .filter(v => 
                                  !v.name.toLowerCase().includes('google') && 
                                  !v.name.toLowerCase().includes('microsoft')
                                )
                                .map((voice, index) => (
                                  <option key={`other-${index}`} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                  </option>
                                ))}
                            </optgroup>
                          )}
                        </>
                      ) : (
                        <option disabled>Tidak ada suara Indonesia tersedia</option>
                      )}
                    </select>
                    
                    {availableVoices.length === 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg border border-yellow-300">
                        <p className="text-sm font-semibold">⚠️ Tidak ada suara Indonesia tersedia</p>
                        <p className="text-xs mt-1">
                          Browser Anda tidak memiliki suara bahasa Indonesia. Sistem akan menggunakan suara default.
                        </p>
                        <p className="text-xs mt-2 font-semibold">
                          💡 Tip: Gunakan Chrome untuk akses ke Google Voices (kualitas terbaik)
                        </p>
                      </div>
                    )}
                    
                    {availableVoices.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-300">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                          ✅ Ditemukan {availableVoices.length} suara bahasa Indonesia
                        </p>
                        <div className="text-xs mt-2 space-y-1">
                          {availableVoices.filter(v => v.name.toLowerCase().includes('google')).length > 0 && (
                            <p>🌟 Google: {availableVoices.filter(v => v.name.toLowerCase().includes('google')).length} suara (Rekomendasi)</p>
                          )}
                          {availableVoices.filter(v => v.name.toLowerCase().includes('microsoft')).length > 0 && (
                            <p>🎤 Microsoft: {availableVoices.filter(v => v.name.toLowerCase().includes('microsoft')).length} suara</p>
                          )}
                          {availableVoices.filter(v => 
                            !v.name.toLowerCase().includes('google') && 
                            !v.name.toLowerCase().includes('microsoft')
                          ).length > 0 && (
                            <p>🔊 Lainnya: {availableVoices.filter(v => 
                              !v.name.toLowerCase().includes('google') && 
                              !v.name.toLowerCase().includes('microsoft')
                            ).length} suara</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg space-y-3 border-2 border-purple-400">
                    <p className="font-semibold text-sm">🎭 Preset Suara - Klik untuk Terapkan:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVoiceSettings({ ...voiceSettings, rate: 0.85, pitch: 0.75 })}
                        className="text-xs"
                      >
                        👨 Pria Rendah
                        <br />
                        <span className="text-[10px] text-muted-foreground">Rate: 0.85, Pitch: 0.75</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVoiceSettings({ ...voiceSettings, rate: 0.9, pitch: 1.0 })}
                        className="text-xs"
                      >
                        👨 Pria Normal ⭐
                        <br />
                        <span className="text-[10px] text-muted-foreground">Rate: 0.9, Pitch: 1.0</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVoiceSettings({ ...voiceSettings, rate: 0.9, pitch: 1.15 })}
                        className="text-xs"
                      >
                        👩 Wanita Normal
                        <br />
                        <span className="text-[10px] text-muted-foreground">Rate: 0.9, Pitch: 1.15</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVoiceSettings({ ...voiceSettings, rate: 0.85, pitch: 1.3 })}
                        className="text-xs"
                      >
                        👩 Wanita Tinggi
                        <br />
                        <span className="text-[10px] text-muted-foreground">Rate: 0.85, Pitch: 1.3</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVoiceSettings({ ...voiceSettings, rate: 0.8, pitch: 0.7 })}
                        className="text-xs"
                      >
                        🎙️ Announcer Formal
                        <br />
                        <span className="text-[10px] text-muted-foreground">Rate: 0.8, Pitch: 0.7</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVoiceSettings({ ...voiceSettings, rate: 1.0, pitch: 1.1 })}
                        className="text-xs"
                      >
                        😊 Ramah & Ceria
                        <br />
                        <span className="text-[10px] text-muted-foreground">Rate: 1.0, Pitch: 1.1</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      💡 Klik preset, lalu "Test Suara" untuk mendengar. Jika cocok, klik "Simpan".
                    </p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg space-y-2 border-2 border-yellow-400">
                    <p className="font-semibold text-sm">⚠️ PENTING - Cara Menggunakan:</p>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li><strong>Ubah pengaturan</strong> (rate, pitch, volume, voice) atau <strong>pilih preset</strong></li>
                      <li><strong>Klik "Test Suara"</strong> untuk mendengar hasil</li>
                      <li><strong>Klik "Simpan"</strong> untuk menyimpan pengaturan</li>
                      <li><strong>Pengaturan akan berlaku</strong> saat panggil antrian di dashboard</li>
                    </ol>
                    <p className="text-sm mt-2 text-red-600 font-semibold">
                      ❗ Jika tidak klik "Simpan", pengaturan tidak akan tersimpan!
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2">
                    <p className="font-semibold text-sm">💡 Panduan Pitch (Nada Suara):</p>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li><strong>0.5 - 0.8:</strong> Suara rendah/berat (pria dewasa, formal)</li>
                      <li><strong>0.9 - 1.1:</strong> Suara normal (natural, realistis) ⭐</li>
                      <li><strong>1.2 - 1.5:</strong> Suara tinggi (wanita, ramah)</li>
                      <li><strong>1.6 - 2.0:</strong> Suara sangat tinggi (anak-anak, ceria)</li>
                      <li><strong>Tip:</strong> Gunakan preset untuk hasil terbaik!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* AUDIO RECORDING TAB */}
          <TabsContent value="audio" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Rekam Suara Custom</h2>
                  <div className="flex gap-2">
                    <Button onClick={saveCustomAudio}>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Semua
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted">
                  <div>
                    <p className="font-semibold">Gunakan Audio Custom</p>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan untuk menggunakan rekaman suara Anda
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={customAudio.useCustomAudio}
                    onChange={(e) => setCustomAudio({ ...customAudio, useCustomAudio: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
                  <p className="font-semibold text-sm mb-2">📝 Panduan Template per Layanan:</p>
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong>Penghadapan:</strong> Sebutkan nomor antrian, nama klien, nama PK, dan loket tujuan
                    </div>
                    <div>
                      <strong>Bimbingan:</strong> Sebutkan nomor antrian, nama klien, jenis bimbingan, nama PK, dan ruang bimbingan
                    </div>
                    <div>
                      <strong>Kunjungan:</strong> Sebutkan nomor antrian, nama pengunjung, keperluan, dan loket tujuan
                    </div>
                    <div>
                      <strong>Pengaduan:</strong> Sebutkan nomor antrian, nama pengadu, jenis pengaduan, dan loket tujuan
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <AudioRecorder
                      label="Pemanggilan Penghadapan"
                      onSave={(blob, url) => handleAudioSave('penghadapan', blob, url)}
                      existingAudioUrl={customAudio.penghadapan || undefined}
                    />
                    <p className="text-xs text-muted-foreground mt-1 ml-1">
                      💬 Contoh: "Pemanggilan layanan penghadapan, nomor antrian P H 001, atas nama Budi Santoso, pembimbing kemasyarakatan Ahmad Fauzi, silakan menuju ke loket 1"
                    </p>
                  </div>

                  <div>
                    <AudioRecorder
                      label="Pemanggilan Bimbingan"
                      onSave={(blob, url) => handleAudioSave('bimbingan', blob, url)}
                      existingAudioUrl={customAudio.bimbingan || undefined}
                    />
                    <p className="text-xs text-muted-foreground mt-1 ml-1">
                      💬 Contoh: "Pemanggilan layanan bimbingan, nomor antrian B M W L 001, klien atas nama Ujang, jenis bimbingan wajib lapor, pembimbing kemasyarakatan Budi Santoso, silakan menuju ke ruang bimbingan loket 1"
                    </p>
                  </div>

                  <div>
                    <AudioRecorder
                      label="Pemanggilan Kunjungan"
                      onSave={(blob, url) => handleAudioSave('kunjungan', blob, url)}
                      existingAudioUrl={customAudio.kunjungan || undefined}
                    />
                    <p className="text-xs text-muted-foreground mt-1 ml-1">
                      💬 Contoh: "Pemanggilan layanan kunjungan, nomor antrian K J 001, pengunjung atas nama Siti Aminah, keperluan kunjungan keluarga, silakan menuju ke loket 1"
                    </p>
                  </div>

                  <div>
                    <AudioRecorder
                      label="Pemanggilan Pengaduan"
                      onSave={(blob, url) => handleAudioSave('pengaduan', blob, url)}
                      existingAudioUrl={customAudio.pengaduan || undefined}
                    />
                    <p className="text-xs text-muted-foreground mt-1 ml-1">
                      💬 Contoh: "Pemanggilan layanan pengaduan, nomor antrian P G 001, atas nama Ahmad Yani, jenis pengaduan layanan, silakan menuju ke loket 1"
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2">
                  <p className="font-semibold text-sm">💡 Tips Rekam Template Pemanggilan:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Rekam di ruangan tenang tanpa noise</li>
                    <li>Gunakan mikrofon berkualitas baik</li>
                    <li>Bicara dengan jelas dan tidak terlalu cepat</li>
                    <li><strong>Rekam TEMPLATE LENGKAP dalam Bahasa Indonesia</strong></li>
                    <li>Gunakan format dari tab "Template" sebagai panduan</li>
                    <li>Contoh untuk Penghadapan:</li>
                  </ul>
                  <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-xs">
                    <p className="font-mono">
                      "Pemanggilan layanan penghadapan.<br/>
                      Nomor antrian P H 001.<br/>
                      Atas nama Budi Santoso.<br/>
                      Silakan menuju ke loket 1.<br/>
                      Mohon membawa dokumen yang diperlukan."
                    </p>
                  </div>
                  <ul className="text-sm space-y-1 list-disc list-inside mt-2">
                    <li>Atau upload file audio template yang sudah direkam</li>
                    <li>Ukuran maksimal: 5MB per file</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg space-y-2">
                  <p className="font-semibold text-sm">⚠️ Catatan Penting:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Rekaman suara adalah <strong>template lengkap dalam Bahasa Indonesia</strong></li>
                    <li>Rekam dengan menyebutkan semua informasi: nomor antrian, nama, layanan, dan loket</li>
                    <li>Gunakan contoh template dari tab "Template" sebagai panduan</li>
                    <li>Jika "Gunakan Audio Custom" diaktifkan, sistem akan memutar rekaman Anda</li>
                    <li>Jika tidak ada rekaman untuk layanan tertentu, sistem fallback ke Text-to-Speech</li>
                    <li>Rekaman akan diputar sesuai dengan jenis layanan yang dipanggil</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* SMART CALL TAB */}
          <TabsContent value="smart" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Pemanggilan Cerdas</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => resetToDefault('smart')}>
                      Reset Default
                    </Button>
                    <Button onClick={saveSmartSettings}>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Prioritas Otomatis</p>
                      <p className="text-sm text-muted-foreground">
                        Antrian mendesak diprioritaskan (lansia, disabilitas, dll)
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={smartSettings.enablePriority}
                      onChange={(e) => setSmartSettings({ ...smartSettings, enablePriority: e.target.checked })}
                      className="w-5 h-5"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Panggil Otomatis</p>
                      <p className="text-sm text-muted-foreground">
                        Panggil antrian berikutnya secara otomatis setelah delay
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={smartSettings.enableAutoCall}
                      onChange={(e) => setSmartSettings({ ...smartSettings, enableAutoCall: e.target.checked })}
                      className="w-5 h-5"
                    />
                  </div>

                  {smartSettings.enableAutoCall && (
                    <div className="ml-4 space-y-3">
                      <Label>Delay Panggilan Otomatis (detik)</Label>
                      <Input
                        type="number"
                        value={smartSettings.autoCallDelay}
                        onChange={(e) => setSmartSettings({ ...smartSettings, autoCallDelay: parseInt(e.target.value) })}
                        min={10}
                        max={300}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Notifikasi Browser</p>
                      <p className="text-sm text-muted-foreground">
                        Tampilkan notifikasi saat ada antrian baru
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={smartSettings.enableNotification}
                      onChange={(e) => setSmartSettings({ ...smartSettings, enableNotification: e.target.checked })}
                      className="w-5 h-5"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Suara Notifikasi</p>
                      <p className="text-sm text-muted-foreground">
                        Putar suara saat ada antrian baru
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={smartSettings.notificationSound}
                      onChange={(e) => setSmartSettings({ ...smartSettings, notificationSound: e.target.checked })}
                      className="w-5 h-5"
                    />
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg space-y-2">
                  <p className="font-semibold text-sm">🎯 Fitur Pemanggilan Cerdas:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Deteksi antrian mendesak (lansia, ibu hamil, disabilitas)</li>
                    <li>Auto-call untuk efisiensi operator</li>
                    <li>Notifikasi real-time untuk antrian baru</li>
                    <li>Estimasi waktu tunggu otomatis</li>
                    <li>Statistik performa operator</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OperatorSettings;
