# 🎯 FITUR PANGGILAN CANGGIH - KIANSANTANG

## 📋 **OVERVIEW**

Sistem panggilan KIANSANTANG telah di-upgrade dengan fitur-fitur canggih yang terinspirasi dari BKD Project, memberikan pengalaman pemanggilan antrian yang lebih profesional dan fleksibel.

---

## ✨ **FITUR BARU**

### 1. **🔔 Notifikasi Suara (Start Notification)**

**Deskripsi:**
Suara notifikasi yang diputar SEBELUM pengumuman antrian dimulai.

**Jenis Notifikasi:**
- **Beep** (Default) - Suara "bip" standar (880 Hz, 0.5 detik)
- **Bell** - Suara lonceng dual-tone (880 Hz + 1200 Hz, 1 detik)
- **Chime** - Suara chime tinggi (1500 Hz, 0.3 detik)
- **Custom** - Upload audio custom Anda sendiri
- **None** - Tanpa notifikasi

**Cara Mengatur:**
1. Buka **Operator** → **Pengaturan**
2. Tab **"Notifikasi"** (akan ditambahkan)
3. Pilih jenis notifikasi
4. Jika pilih "Custom", upload file audio (MP3/WAV)
5. Klik **"Simpan Pengaturan"**
6. Klik **"Test Notifikasi"** untuk mencoba

---

### 2. **🔊 End Notification**

**Deskripsi:**
Suara notifikasi yang diputar SETELAH pengumuman selesai (suara "tut" pendek).

**Karakteristik:**
- Frekuensi: 440 Hz
- Durasi: 0.3 detik
- Type: Square wave
- Volume: 15%

**Fungsi:**
- Menandakan pengumuman telah selesai
- Memberikan feedback audio kepada operator
- Membantu operator tahu kapan bisa panggil antrian berikutnya

---

### 3. **🔁 Ulangi Panggilan Terakhir**

**Deskripsi:**
Tombol untuk mengulang panggilan terakhir (paragraf kedua dan seterusnya) tanpa perlu panggil ulang dari awal.

**Cara Kerja:**
1. Sistem menyimpan teks pengumuman terakhir
2. Saat tombol "Ulangi" diklik:
   - Ambil paragraf kedua dan seterusnya
   - Tambahkan prefix: "Sekali lagi, ..."
   - Tambahkan suffix: "... Atas perhatiannya kami ucapkan terima kasih."
   - Putar dengan TTS
   - Akhiri dengan end notification

**Contoh:**

**Panggilan Awal:**
```
PEMANGGILAN LAYANAN PENGHADAPAN

Nomor Antrian: Peh Ha 001
Nama: Budi Santoso
Layanan: Penghadapan

Silakan menuju ke Loket 1
Mohon membawa dokumen yang diperlukan
```

**Saat Ulangi:**
```
Sekali lagi, Silakan menuju ke Loket 1. Mohon membawa dokumen yang diperlukan. Atas perhatiannya kami ucapkan terima kasih.
```

**Tombol:**
- Icon: 🔁 (Repeat)
- Posisi: Header operator, sebelah tombol "Pengaturan"
- Status: Disabled jika tidak ada panggilan atau panggilan terlalu pendek
- Warna: Hijau (border-green-200)

---

### 4. **📢 Live Announcement Display**

**Deskripsi:**
Tampilan real-time teks yang sedang diumumkan.

**Fitur:**
- Muncul saat announcement dimulai
- Menampilkan teks lengkap yang sedang diucapkan
- Animasi pulse untuk menarik perhatian
- Badge "LIVE" dengan indikator merah berkedip
- Icon speaker animasi bounce
- Background gradient biru
- Auto-hide setelah announcement selesai (1 detik delay)

**UI Components:**
```tsx
{isAnnouncing && currentAnnouncement && (
  <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 animate-pulse">
    <div className="flex items-start gap-4">
      <Volume2 className="w-8 h-8 text-blue-600 animate-bounce" />
      <div className="flex-1">
        <h3 className="text-lg font-bold text-blue-900 mb-2">
          🔊 Sedang Memutar Pengumuman
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-normal text-red-600">LIVE</span>
          </span>
        </h3>
        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {currentAnnouncement}
          </p>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          💡 Pengumuman akan diulang 2x secara otomatis
        </p>
      </div>
    </div>
  </Card>
)}
```

---

### 5. **🎙️ Audio Context Management**

**Deskripsi:**
Manajemen AudioContext global untuk performa lebih baik.

**Implementasi:**
```typescript
let audioContextRef: AudioContext | null = null;

// Reuse audio context untuk semua suara
if (!audioContextRef) {
  audioContextRef = new (window.AudioContext || window.webkitAudioContext)();
}
```

**Keuntungan:**
- Menghindari multiple audio context (lebih efisien)
- Mengurangi memory usage
- Performa lebih baik
- Kompatibel dengan browser lama (webkitAudioContext)

---

### 6. **💾 Last Announcement Storage**

**Deskripsi:**
Menyimpan teks pengumuman terakhir untuk fitur "Ulangi".

**Implementasi:**
```typescript
let lastAnnouncementText: string = '';

// Saat announce
lastAnnouncementText = announcement;

// Saat repeat
const paragraphs = lastAnnouncementText.split(/\n\n+/).filter(p => p.trim() !== '');
const repeatText = paragraphs.slice(1).join('. ');
```

**Validasi:**
```typescript
canRepeatLast(): boolean {
  if (!lastAnnouncementText) return false;
  const paragraphs = lastAnnouncementText.split(/\n\n+/).filter(p => p.trim() !== '');
  return paragraphs.length > 1; // Minimal 2 paragraf
}
```

---

## 🔧 **CARA MENGGUNAKAN**

### **A. Setup Notifikasi**

1. **Buka Pengaturan Operator**
   ```
   Operator → Pengaturan → Tab "Notifikasi"
   ```

2. **Pilih Jenis Notifikasi**
   - Beep (Standar)
   - Bell (Lonceng)
   - Chime (Ding)
   - Custom (Upload audio)
   - None (Tanpa suara)

3. **Upload Custom Audio (Opsional)**
   - Klik "Unggah Audio Notifikasi"
   - Pilih file MP3/WAV
   - Max size: 5MB
   - Recommended: 1-2 detik

4. **Test & Simpan**
   - Klik "Test Notifikasi"
   - Dengarkan hasilnya
   - Klik "Simpan Pengaturan"

---

### **B. Menggunakan Tombol Ulangi**

1. **Panggil Antrian Pertama**
   - Klik "Panggil Selanjutnya"
   - Tunggu announcement selesai

2. **Ulangi Panggilan**
   - Klik tombol **"Ulangi"** (🔁)
   - Sistem akan memutar paragraf kedua dan seterusnya
   - Otomatis ditambahkan "Sekali lagi..." dan "Terima kasih"

3. **Kapan Tombol Aktif?**
   - ✅ Ada panggilan sebelumnya
   - ✅ Panggilan memiliki minimal 2 paragraf
   - ❌ Disabled jika sedang announcing
   - ❌ Disabled jika belum ada panggilan

---

### **C. Monitoring Live Announcement**

1. **Saat Memanggil Antrian**
   - Card "Sedang Memutar Pengumuman" muncul otomatis
   - Menampilkan teks yang sedang diucapkan
   - Badge "LIVE" berkedip

2. **Informasi yang Ditampilkan**
   - Teks lengkap announcement
   - Icon speaker animasi
   - Informasi "Pengumuman akan diulang 2x"

3. **Auto-Hide**
   - Card hilang otomatis setelah announcement selesai
   - Delay 1 detik setelah end notification

---

## 🎨 **CUSTOMIZATION**

### **1. Ubah Suara Notifikasi**

**Beep (Default):**
```typescript
oscillator.type = 'sine';
oscillator.frequency.setValueAtTime(880, context.currentTime);
gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.5);
duration = 0.5;
```

**Bell (Dual Tone):**
```typescript
// Tone 1: 880 Hz
oscillator.type = 'sine';
oscillator.frequency.setValueAtTime(880, context.currentTime);

// Tone 2: 1200 Hz
const osc2 = context.createOscillator();
osc2.type = 'sine';
osc2.frequency.setValueAtTime(1200, context.currentTime);
osc2.connect(gainNode);

duration = 1;
```

**Chime (High Pitch):**
```typescript
oscillator.type = 'triangle';
oscillator.frequency.setValueAtTime(1500, context.currentTime);
gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.3);
duration = 0.3;
```

---

### **2. Ubah Template Ulangi**

Edit di `soundManager.ts`:

```typescript
const finalText = `Sekali lagi, ${repeatText}. Atas perhatiannya kami ucapkan terima kasih.`;
```

Ubah menjadi:
```typescript
const finalText = `Kami ulangi, ${repeatText}. Mohon segera menuju loket yang ditentukan.`;
```

---

### **3. Ubah Animasi Live Display**

Edit di `Operator.tsx`:

```tsx
<Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 animate-pulse">
```

Ubah warna:
```tsx
<Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 animate-pulse">
```

---

## 🐛 **TROUBLESHOOTING**

### **Problem 1: Notifikasi Tidak Bunyi**

**Solusi:**
1. Cek browser support AudioContext
2. Cek volume sistem
3. Cek pengaturan notifikasi (jangan pilih "None")
4. Test dengan `soundManager.testNotification()`

**Debug:**
```typescript
console.log('AudioContext support:', 'AudioContext' in window);
console.log('Notification settings:', soundManager.getNotificationSettings());
```

---

### **Problem 2: Tombol Ulangi Disabled**

**Solusi:**
1. Pastikan sudah ada panggilan sebelumnya
2. Pastikan panggilan memiliki minimal 2 paragraf
3. Pastikan tidak sedang announcing

**Debug:**
```typescript
console.log('Can repeat:', soundManager.canRepeatLast());
console.log('Last announcement:', lastAnnouncementText);
console.log('Is announcing:', isAnnouncing);
```

---

### **Problem 3: Live Display Tidak Muncul**

**Solusi:**
1. Cek state `isAnnouncing` dan `currentAnnouncement`
2. Pastikan callback `onAnnouncementStart` dipanggil
3. Cek console untuk error

**Debug:**
```typescript
console.log('Is announcing:', isAnnouncing);
console.log('Current announcement:', currentAnnouncement);
```

---

### **Problem 4: Custom Audio Tidak Terload**

**Solusi:**
1. Cek format file (MP3/WAV)
2. Cek size file (max 5MB)
3. Cek localStorage quota
4. Clear localStorage dan upload ulang

**Debug:**
```typescript
const settings = soundManager.getNotificationSettings();
console.log('Custom sound URL length:', settings.customSoundURL?.length);
console.log('Notification type:', settings.type);
```

---

## 📊 **PERFORMA**

### **Before Upgrade:**
- Single AudioContext per sound
- No notification sound
- No repeat function
- No live display

### **After Upgrade:**
- ✅ Reusable AudioContext (lebih efisien)
- ✅ 5 jenis notifikasi (beep/bell/chime/custom/none)
- ✅ Repeat last call function
- ✅ Live announcement display
- ✅ End notification
- ✅ Better UX

---

## 🎯 **BEST PRACTICES**

### **1. Pilih Notifikasi yang Tepat**

- **Beep**: Untuk lingkungan formal/kantor
- **Bell**: Untuk menarik perhatian lebih
- **Chime**: Untuk suasana lebih friendly
- **Custom**: Untuk branding khusus
- **None**: Untuk testing/silent mode

---

### **2. Template yang Baik**

**Good:**
```
PEMANGGILAN LAYANAN PENGHADAPAN

Nomor Antrian: {{queueNumber}}
Nama: {{clientName}}

Silakan menuju ke Loket {{counter}}
Mohon membawa dokumen yang diperlukan
```

**Bad:**
```
{{queueNumber}} ke loket {{counter}}
```

**Why?**
- Template good memiliki 2+ paragraf → bisa diulang
- Template bad hanya 1 paragraf → tidak bisa diulang

---

### **3. Gunakan Repeat Dengan Bijak**

**Kapan Pakai:**
- ✅ Klien tidak dengar panggilan pertama
- ✅ Klien ragu-ragu
- ✅ Ruangan ramai

**Kapan Tidak:**
- ❌ Klien sudah jalan ke loket
- ❌ Sedang announcing
- ❌ Belum ada panggilan

---

## 📝 **CHANGELOG**

### **Version 2.0 - Advanced Calling System**

**Added:**
- 🔔 Start notification (beep/bell/chime/custom/none)
- 🔊 End notification
- 🔁 Repeat last call button
- 📢 Live announcement display
- 🎙️ Audio context management
- 💾 Last announcement storage

**Improved:**
- Better UX for operators
- More professional sound system
- Cleaner code architecture
- Better error handling

**Fixed:**
- Multiple AudioContext issue
- Memory leaks
- Callback timing

---

## 🚀 **NEXT STEPS**

**Recommended:**
1. Deploy ke Netlify ✅
2. Test di production
3. Gather user feedback
4. Add analytics untuk track usage
5. Add more notification sounds

**Future Features:**
- Voice recording untuk custom announcement
- Multi-language support
- Queue priority system
- Auto-call dengan delay
- WhatsApp notification integration

---

## 📞 **SUPPORT**

**Jika ada masalah:**
1. Cek dokumentasi ini
2. Cek console browser (F12)
3. Test dengan `soundManager.testSound()`
4. Clear localStorage dan reload
5. Contact developer

---

**Dibuat dengan ❤️ untuk BAPAS Kelas I Bandung**
**Inspired by BKD Project - Advanced TTS System**
