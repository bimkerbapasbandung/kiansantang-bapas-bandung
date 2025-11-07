import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Square, Play, Trash2, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface AudioRecorderProps {
  onSave: (audioBlob: Blob, audioUrl: string) => void;
  existingAudioUrl?: string;
  label: string;
}

export const AudioRecorder = ({ onSave, existingAudioUrl, label }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl && !existingAudioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl, existingAudioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onSave(audioBlob, url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        toast.success('Rekaman berhasil disimpan!');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.info('Mulai merekam...');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Gagal mengakses mikrofon. Pastikan izin mikrofon sudah diberikan.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        toast.error('Gagal memutar audio');
        setIsPlaying(false);
      };
      
      audio.play();
      setIsPlaying(true);
      toast.info('Memutar rekaman...');
    }
  };

  const deleteRecording = () => {
    if (audioUrl && !existingAudioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setRecordingTime(0);
    toast.success('Rekaman dihapus');
  };

  const downloadRecording = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `rekaman-${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Rekaman berhasil diunduh!');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('audio/')) {
        toast.error('File harus berupa audio!');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB!');
        return;
      }

      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      onSave(file, url);
      toast.success('Audio berhasil diupload!');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{label}</h3>
        {isRecording && (
          <div className="flex items-center gap-2 text-red-500">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="font-mono">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {!isRecording && !audioUrl && (
          <>
            <Button onClick={startRecording} className="flex-1">
              <Mic className="w-4 h-4 mr-2" />
              Mulai Rekam
            </Button>
            <label className="flex-1">
              <Button variant="outline" className="w-full" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Audio
                </span>
              </Button>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </>
        )}

        {isRecording && (
          <Button onClick={stopRecording} variant="destructive" className="flex-1">
            <Square className="w-4 h-4 mr-2" />
            Stop Rekam
          </Button>
        )}

        {audioUrl && !isRecording && (
          <>
            <Button onClick={playAudio} disabled={isPlaying} variant="outline">
              <Play className="w-4 h-4 mr-2" />
              {isPlaying ? 'Memutar...' : 'Putar'}
            </Button>
            <Button onClick={downloadRecording} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={deleteRecording} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </Button>
          </>
        )}
      </div>

      {audioUrl && (
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm text-muted-foreground">
            ✅ Audio tersimpan. Klik "Putar" untuk mendengar.
          </p>
        </div>
      )}

      {!audioUrl && !isRecording && (
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
          <p className="text-sm">
            💡 <strong>Tips:</strong> Rekam suara Anda atau upload file audio untuk pemanggilan custom.
          </p>
        </div>
      )}
    </Card>
  );
};
