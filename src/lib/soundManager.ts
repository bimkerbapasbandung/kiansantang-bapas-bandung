// Sound Manager untuk notifikasi suara yang lebih baik
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
            // Setelah pengulangan selesai
            if (onAnnouncementEnd) {
              onAnnouncementEnd();
            }
          };
          
          speechSynthesis.speak(repeatUtterance);
        }, 500);
      } else {
        // Jika hanya 1x (tidak ada pengulangan)
        if (onAnnouncementEnd) {
          onAnnouncementEnd();
        }
      }
    };

    speechSynthesis.speak(utterance);
  },

  // Fungsi untuk memutar suara notifikasi
  playNotification(): void {
    // Buat audio context untuk suara notifikasi
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Audio context tidak didukung:', error);
    }
  },

  // Tes suara
  testSound(): void {
    this.playNotification();
    setTimeout(() => {
      this.announceQueue('PH-001', 1);
    }, 500);
  }
};
