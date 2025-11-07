// Sound Manager untuk notifikasi suara yang lebih baik
// Inspired by BKD Project - Advanced TTS System

let audioContextRef: AudioContext | null = null;
let lastAnnouncementText: string = '';

export const soundManager = {
  // Load voice settings from localStorage
  getVoiceSettings() {
    const saved = localStorage.getItem('voiceSettings');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default settings - realistis untuk pengumuman
    return {
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
      voice: 'default'
    };
  },

  // Load custom audio settings
  getCustomAudioSettings() {
    const saved = localStorage.getItem('customAudioSettings');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      penghadapan: null,
      bimbingan: null,
      kunjungan: null,
      pengaduan: null,
      useCustomAudio: false
    };
  },

  // Play custom audio if available
  playCustomAudio(serviceType: string): Promise<boolean> {
    return new Promise((resolve) => {
      const customAudio = this.getCustomAudioSettings();
      
      if (!customAudio.useCustomAudio) {
        resolve(false);
        return;
      }

      const audioData = customAudio[serviceType as keyof typeof customAudio];
      if (!audioData || typeof audioData !== 'string') {
        resolve(false);
        return;
      }

      try {
        const audio = new Audio(audioData);
        audio.onended = () => resolve(true);
        audio.onerror = () => resolve(false);
        audio.play();
      } catch (error) {
        console.error('Error playing custom audio:', error);
        resolve(false);
      }
    });
  },

  // Load call templates from localStorage
  getCallTemplates() {
    const saved = localStorage.getItem('callTemplates');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default templates jika belum ada
    return {
      penghadapan: 'Nomor antrian {{queueNumber}} untuk layanan {{serviceName}}, silakan menuju loket {{counter}}',
      bimbingan: 'Nomor antrian {{queueNumber}} untuk layanan bimbingan {{subServiceName}}, silakan menuju loket {{counter}}',
      kunjungan: 'Nomor antrian {{queueNumber}} untuk layanan kunjungan, silakan menuju loket {{counter}}',
      pengaduan: 'Nomor antrian {{queueNumber}} untuk layanan pengaduan, silakan menuju loket {{counter}}'
    };
  },

  // Format queue number untuk TTS
  formatQueueNumber(queueNumber: string): string {
    return queueNumber
      .split('-')
      .map(part => {
        // Ubah kode layanan menjadi kata
        const serviceCodes: Record<string, string> = {
          'PH': 'Peh Ha',
          'BM': 'Be Em',
          'KJ': 'Ka Je',
          'PG': 'Pe Ge',
          'WL': 'We El',
          'KP': 'Ka Pe',
          'KM': 'Ka Em'
        };
        
        if (serviceCodes[part]) {
          return serviceCodes[part];
        }
        
        // Bacakan angka satu per satu
        return part.split('').join(' ');
      })
      .join(' ');
  },

  // Replace template placeholders dengan data real
  replaceTemplatePlaceholders(template: string, data: any): string {
    let result = template;
    
    // Replace semua placeholder
    const placeholders: Record<string, any> = {
      '{{queueNumber}}': data.queueNumber || '',
      '{{clientName}}': data.clientName || '',
      '{{serviceName}}': data.serviceName || '',
      '{{subServiceName}}': data.subServiceName || '',
      '{{pkOfficerName}}': data.pkOfficerName || '',
      '{{pkOfficerPosition}}': data.pkOfficerPosition || '',
      '{{time}}': data.time || new Date().toLocaleTimeString('id-ID'),
      '{{counter}}': data.counter || ''
    };

    Object.keys(placeholders).forEach(key => {
      result = result.replace(new RegExp(key, 'g'), placeholders[key]);
    });

    // Hapus emoji dan karakter khusus untuk TTS
    result = result.replace(/[📢🎫👤📋📝👨‍💼📍⏰✅🆔📄]/g, '');
    
    // Hapus baris kosong berlebih
    result = result.replace(/\n\n+/g, '. ');
    result = result.replace(/\n/g, '. ');
    
    // Bersihkan spasi berlebih
    result = result.replace(/\s+/g, ' ').trim();

    return result;
  },

  // Fungsi untuk memutar suara panggilan antrian
  async announceQueue(
    queueNumber: string, 
    counter: number, 
    serviceType?: string,
    queueData?: any,
    onAnnouncementStart?: (text: string) => void,
    onAnnouncementEnd?: () => void
  ): Promise<void> {
    // Try to play custom audio first if service type is provided
    if (serviceType) {
      const played = await this.playCustomAudio(serviceType);
      if (played) {
        console.log('Custom audio played successfully');
        return;
      }
    }

    // Fallback to TTS
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis tidak didukung di browser ini');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    // Load custom voice settings
    const settings = this.getVoiceSettings();

    // Load templates
    const templates = this.getCallTemplates();

    // Tentukan template berdasarkan serviceType
    let template = templates.penghadapan; // default
    if (serviceType && templates[serviceType as keyof typeof templates]) {
      template = templates[serviceType as keyof typeof templates];
    }

    // Format queue number untuk TTS
    const formattedQueueNumber = this.formatQueueNumber(queueNumber);

    // Prepare data untuk template
    const templateData = {
      queueNumber: formattedQueueNumber,
      counter: counter.toString(),
      ...queueData // Merge dengan data tambahan jika ada
    };

    // Replace placeholders
    const announcement = this.replaceTemplatePlaceholders(template, templateData);
    
    // Save for repeat function
    lastAnnouncementText = announcement;
    
    console.log('Announcement text:', announcement);
    
    // Callback untuk announcement start
    if (onAnnouncementStart) {
      onAnnouncementStart(announcement);
    }
    
    const utterance = new SpeechSynthesisUtterance(announcement);
    utterance.lang = 'id-ID';
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    // Apply custom voice if selected
    if (settings.voice !== 'default') {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.name === settings.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name);
      }
    }

    // Ulangi pengumuman 2 kali
    let repeatCount = 0;
    utterance.onend = () => {
      repeatCount++;
      if (repeatCount < 2) {
        setTimeout(() => {
          const repeatUtterance = new SpeechSynthesisUtterance(announcement);
          repeatUtterance.lang = 'id-ID';
          repeatUtterance.rate = settings.rate;
          repeatUtterance.pitch = settings.pitch;
          repeatUtterance.volume = settings.volume;
          
          if (settings.voice !== 'default') {
            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = voices.find(v => v.name === settings.voice);
            if (selectedVoice) {
              repeatUtterance.voice = selectedVoice;
            }
          }
          
          repeatUtterance.onend = () => {
            // Setelah pengulangan selesai, play end notification
            this.playEndNotification();
            if (onAnnouncementEnd) {
              setTimeout(onAnnouncementEnd, 1000);
            }
          };
          
          speechSynthesis.speak(repeatUtterance);
        }, 500);
      } else {
        // Jika hanya 1x (tidak ada pengulangan)
        this.playEndNotification();
        if (onAnnouncementEnd) {
          setTimeout(onAnnouncementEnd, 1000);
        }
      }
    };

    speechSynthesis.speak(utterance);
  },

  // Get notification settings
  getNotificationSettings() {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      type: 'beep', // 'beep', 'bell', 'chime', 'custom', 'none'
      customSoundURL: null
    };
  },

  // Play start notification (sebelum announcement)
  playNotification(): Promise<void> {
    return new Promise((resolve) => {
      const settings = this.getNotificationSettings();
      
      if (settings.type === 'none') {
        resolve();
        return;
      }

      // Play custom sound if available
      if (settings.type === 'custom' && settings.customSoundURL) {
        try {
          const audio = new Audio(settings.customSoundURL);
          audio.onended = () => resolve();
          audio.onerror = () => {
            console.error('Failed to play custom notification');
            resolve();
          };
          audio.play().catch(() => resolve());
          return;
        } catch (error) {
          console.error('Error playing custom notification:', error);
        }
      }

      // Play synthesized notification sound
      try {
        if (!audioContextRef) {
          audioContextRef = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const context = audioContextRef;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        gainNode.gain.setValueAtTime(0.2, context.currentTime);

        let duration = 0.5;

        switch (settings.type) {
          case 'bell':
            // Bell sound - dual tone
            const osc2 = context.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1200, context.currentTime);
            osc2.connect(gainNode);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1);
            duration = 1;
            osc2.start();
            osc2.stop(context.currentTime + 1);
            break;

          case 'chime':
            // Chime sound - high pitch triangle
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(1500, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.3);
            duration = 0.3;
            break;

          case 'beep':
          default:
            // Beep sound - standard sine wave
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.5);
            duration = 0.5;
            break;
        }

        oscillator.start();
        oscillator.stop(context.currentTime + duration);
        setTimeout(resolve, duration * 1000);
      } catch (error) {
        console.warn('Audio context tidak didukung:', error);
        resolve();
      }
    });
  },

  // Play end notification (setelah announcement selesai)
  playEndNotification(): void {
    try {
      if (!audioContextRef) {
        audioContextRef = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const context = audioContextRef;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(440, context.currentTime);
      gainNode.gain.setValueAtTime(0.15, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.3);

      oscillator.start();
      oscillator.stop(context.currentTime + 0.3);
    } catch (error) {
      console.warn('Could not play end notification:', error);
    }
  },

  // Repeat last announcement (untuk tombol ulangi)
  async repeatLastAnnouncement(
    onAnnouncementStart?: (text: string) => void,
    onAnnouncementEnd?: () => void
  ): Promise<void> {
    if (!lastAnnouncementText) {
      console.warn('No previous announcement to repeat');
      return;
    }

    // Split by paragraphs
    const paragraphs = lastAnnouncementText.split(/\n\n+/).filter(p => p.trim() !== '');

    if (paragraphs.length <= 1) {
      console.warn('No additional paragraphs to repeat');
      return;
    }

    // Repeat from second paragraph onwards
    const repeatText = paragraphs.slice(1).join('. ');
    const finalText = `Sekali lagi, ${repeatText}. Atas perhatiannya kami ucapkan terima kasih.`;

    if (onAnnouncementStart) {
      onAnnouncementStart(finalText);
    }

    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis tidak didukung');
      return;
    }

    speechSynthesis.cancel();

    const settings = this.getVoiceSettings();
    const utterance = new SpeechSynthesisUtterance(finalText);
    utterance.lang = 'id-ID';
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    if (settings.voice !== 'default') {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.name === settings.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onend = () => {
      this.playEndNotification();
      if (onAnnouncementEnd) {
        setTimeout(onAnnouncementEnd, 1000);
      }
    };

    speechSynthesis.speak(utterance);
  },

  // Check if can repeat (ada paragraf kedua atau lebih)
  canRepeatLast(): boolean {
    if (!lastAnnouncementText) return false;
    const paragraphs = lastAnnouncementText.split(/\n\n+/).filter(p => p.trim() !== '');
    return paragraphs.length > 1;
  },

  // Tes suara
  async testSound(): Promise<void> {
    await this.playNotification();
    setTimeout(() => {
      this.announceQueue('PH-001', 1);
    }, 500);
  }
};
