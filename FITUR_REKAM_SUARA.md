# 🎤 Fitur Rekam Suara Custom

## 🎯 Overview

Operator sekarang bisa **merekam suara sendiri** atau **upload file audio** untuk pemanggilan antrian yang lebih personal dan profesional!

---

## ✨ Fitur Baru:

### **1. Rekam Suara Langsung** 🎤
- ✅ Rekam langsung dari browser
- ✅ Real-time recording dengan timer
- ✅ Format audio: WebM (Opus codec)
- ✅ Kualitas tinggi

### **2. Upload File Audio** 📁
- ✅ Upload file audio yang sudah ada
- ✅ Support format: MP3, WAV, OGG, WebM, dll
- ✅ Maksimal 5MB per file
- ✅ Validasi otomatis

### **3. Playback & Preview** ▶️
- ✅ Putar rekaman sebelum simpan
- ✅ Test audio sebelum digunakan
- ✅ Kontrol play/pause

### **4. Management Audio** 🗂️
- ✅ Hapus rekaman
- ✅ Download rekaman
- ✅ Replace rekaman lama
- ✅ Per layanan (4 layanan)

### **5. Toggle Custom Audio** 🔄
- ✅ Enable/disable audio custom
- ✅ Fallback ke TTS otomatis
- ✅ Fleksibel per kebutuhan

---

## 📋 Layanan yang Didukung:

### **1. Pemanggilan Penghadapan**
**Template Lengkap:**
```
"Pemanggilan layanan penghadapan.
Nomor antrian P H 001.
Atas nama Budi Santoso.
Pembimbing kemasyarakatan Ahmad Fauzi.
Silakan menuju ke loket 1.
Mohon membawa dokumen yang diperlukan."
```

### **2. Pemanggilan Bimbingan**
**Template Lengkap:**
```
"Pemanggilan layanan bimbingan.
Nomor antrian B M W L 001.
Klien atas nama Ujang.
Jenis bimbingan wajib lapor.
Pembimbing kemasyarakatan Budi Santoso.
Silakan menuju ke ruang bimbingan loket 1.
Mohon membawa KTP dan dokumen pendukung."
```

### **3. Pemanggilan Kunjungan**
**Template Lengkap:**
```
"Pemanggilan layanan kunjungan.
Nomor antrian K J 001.
Pengunjung atas nama Siti Aminah.
Keperluan kunjungan keluarga.
Silakan menuju ke loket 1.
Mohon membawa KTP dan surat izin kunjungan."
```

### **4. Pemanggilan Pengaduan**
**Template Lengkap:**
```
"Pemanggilan layanan pengaduan.
Nomor antrian P G 001.
Atas nama Ahmad Yani.
Jenis pengaduan layanan.
Silakan menuju ke loket 1.
Mohon siapkan dokumen pendukung pengaduan."
```

---

## 📝 Konsep: Template Pemanggilan dalam Bahasa Indonesia

### **Apa itu Template Pemanggilan?**

Template pemanggilan adalah **format lengkap pesan** yang akan disampaikan saat memanggil antrian. Bukan hanya nomor antrian, tapi **semua informasi penting** dalam bahasa Indonesia yang mudah dipahami.

### **Mengapa Template Lengkap?**

1. **Informasi Lengkap** - Klien tahu semua detail (nama, layanan, PK, loket)
2. **Profesional** - Terdengar formal dan terstruktur
3. **Jelas** - Tidak ada kebingungan tentang apa yang harus dilakukan
4. **Konsisten** - Setiap pemanggilan mengikuti format yang sama

### **Struktur Template:**

```
1. Pembukaan: "Pemanggilan layanan [nama layanan]"
2. Nomor Antrian: "Nomor antrian [kode]-[nomor]"
3. Identitas: "Atas nama [nama klien]"
4. Info Layanan: [Detail spesifik per layanan]
5. Instruksi: "Silakan menuju ke [lokasi]"
6. Penutup: [Instruksi tambahan]
```

### **Panduan per Layanan:**

| Layanan | Info Wajib | Info Tambahan |
|---------|-----------|---------------|
| **Penghadapan** | Nomor, Nama, PK | Jabatan PK, Dokumen |
| **Bimbingan** | Nomor, Nama, Jenis, PK | Ruang bimbingan, KTP |
| **Kunjungan** | Nomor, Nama, Keperluan | Surat izin |
| **Pengaduan** | Nomor, Nama, Jenis | Dokumen pendukung |

---

## 🚀 Cara Menggunakan:

### **STEP 1: Buka Tab Rekam Suara**

```
1. Login ke Dashboard Operator
2. Klik "Pengaturan" (⚙️)
3. Klik tab "Rekam Suara" (🎤)
```

### **STEP 2: Rekam Template Lengkap**

#### **Opsi A: Rekam Langsung**
```
1. Pilih layanan (misal: Penghadapan)
2. Klik "Mulai Rekam" 🎤
3. Browser minta izin mikrofon → Izinkan
4. Timer mulai berjalan (0:00)
5. Bicara dengan jelas sesuai TEMPLATE LENGKAP:
   
   "Pemanggilan layanan penghadapan.
   Nomor antrian P H 001.
   Atas nama Budi Santoso.
   Pembimbing kemasyarakatan Ahmad Fauzi.
   Silakan menuju ke loket 1.
   Mohon membawa dokumen yang diperlukan."

6. Klik "Stop Rekam" ⏹️
7. ✅ Rekaman template tersimpan otomatis!
```

**💡 Tips:**
- Lihat tab "Template" untuk panduan format lengkap
- Sesuaikan dengan data contoh yang relevan
- Durasi ideal: 10-15 detik untuk template lengkap

#### **Opsi B: Upload File**
```
1. Pilih layanan
2. Klik "Upload Audio" 📁
3. Pilih file audio dari komputer
4. File ter-upload otomatis
5. ✅ Audio tersimpan!
```

### **STEP 3: Preview Audio**

```
1. Setelah rekam/upload
2. Klik "Putar" ▶️
3. Dengar rekaman
4. Jika tidak puas:
   - Klik "Hapus" 🗑️
   - Rekam ulang
```

### **STEP 4: Aktifkan Audio Custom**

```
1. Toggle "Gunakan Audio Custom" → ON ✅
2. Klik "Simpan Semua" 💾
3. ✅ Audio custom aktif!
```

### **STEP 5: Test di Operator Dashboard**

```
1. Kembali ke /operator
2. Panggil antrian
3. 🔊 Audio custom Anda akan diputar!
```

---

## 🎨 UI Features:

### **Card Rekam Suara:**
```
┌─────────────────────────────────────┐
│ Pemanggilan Penghadapan             │
├─────────────────────────────────────┤
│ [🎤 Mulai Rekam] [📁 Upload Audio] │
└─────────────────────────────────────┘
```

### **Saat Merekam:**
```
┌─────────────────────────────────────┐
│ Pemanggilan Penghadapan    🔴 0:15  │
├─────────────────────────────────────┤
│ [⏹️ Stop Rekam]                     │
└─────────────────────────────────────┘
```

### **Setelah Rekam:**
```
┌─────────────────────────────────────┐
│ Pemanggilan Penghadapan             │
├─────────────────────────────────────┤
│ [▶️ Putar] [⬇️ Download] [🗑️ Hapus] │
│ ✅ Audio tersimpan                  │
└─────────────────────────────────────┘
```

---

## 💡 Tips Rekam Suara:

### **1. Persiapan:**
- ✅ Ruangan tenang (no noise)
- ✅ Mikrofon berkualitas
- ✅ Jarak mikrofon 15-20cm dari mulut
- ✅ Test mikrofon dulu

### **2. Saat Merekam:**
- ✅ Bicara jelas dan pelan
- ✅ Intonasi natural
- ✅ Volume stabil
- ✅ Tidak terlalu cepat

### **3. Format Template Lengkap:**
```
"Pemanggilan layanan [nama layanan].
Nomor antrian [kode]-[nomor].
Atas nama [nama klien].
[Info tambahan sesuai layanan].
Silakan menuju ke [lokasi].
[Instruksi tambahan]."
```

**Contoh Penghadapan:**
```
"Pemanggilan layanan penghadapan.
Nomor antrian P H 001.
Atas nama Budi Santoso.
Pembimbing kemasyarakatan Ahmad Fauzi.
Silakan menuju ke loket 1.
Mohon membawa dokumen yang diperlukan."
```

### **4. Durasi:**
- ✅ Ideal: 5-10 detik
- ✅ Tidak terlalu panjang
- ✅ Tidak terlalu pendek

---

## 🔧 Technical Details:

### **Recording:**
```typescript
// MediaRecorder API
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm;codecs=opus'
});
```

### **Storage:**
```typescript
// Convert to base64 for localStorage
const reader = new FileReader();
reader.onloadend = () => {
  const base64 = reader.result as string;
  localStorage.setItem('customAudioSettings', base64);
};
```

### **Playback:**
```typescript
// Play custom audio
const audio = new Audio(audioData);
audio.play();

// Fallback to TTS if no custom audio
if (!played) {
  speechSynthesis.speak(utterance);
}
```

---

## 🔄 Flow Lengkap:

```
Operator Login
    ↓
Klik "Pengaturan"
    ↓
Tab "Rekam Suara"
    ↓
Pilih Layanan
    ↓
Rekam/Upload Audio
    ↓
Preview (Putar)
    ↓
Puas? → Simpan
Tidak? → Hapus & Rekam Ulang
    ↓
Toggle "Gunakan Audio Custom" ON
    ↓
Klik "Simpan Semua"
    ↓
Kembali ke Dashboard
    ↓
Panggil Antrian
    ↓
🔊 Audio Custom Diputar!
    ↓
✅ Pemanggilan Profesional!
```

---

## 📊 Data Storage:

### **LocalStorage Structure:**
```javascript
customAudioSettings: {
  penghadapan: "data:audio/webm;base64,GkXf...",
  bimbingan: "data:audio/webm;base64,GkXf...",
  kunjungan: "data:audio/webm;base64,GkXf...",
  pengaduan: "data:audio/webm;base64,GkXf...",
  useCustomAudio: true
}
```

### **File Size:**
- Recording: ~100KB per 10 detik
- Upload: Max 5MB
- Storage: Base64 encoded

---

## 🎯 Keuntungan:

### **1. Personalisasi** 🎨
- Suara operator sendiri
- Lebih personal
- Brand voice konsisten

### **2. Profesional** ✨
- Kualitas audio tinggi
- Tidak robotic
- Intonasi natural

### **3. Fleksibel** 🔄
- Bisa ganti kapan saja
- Per layanan berbeda
- Enable/disable mudah

### **4. Offline Ready** 📴
- Tersimpan lokal
- Tidak perlu internet
- Cepat diakses

---

## 🧪 Testing Guide:

### **Test 1: Rekam Suara**
```
1. Tab "Rekam Suara"
2. Pilih "Penghadapan"
3. Klik "Mulai Rekam"
4. Bicara: "Nomor antrian P H 001..."
5. Klik "Stop Rekam"
6. ✅ Rekaman tersimpan
```

### **Test 2: Preview**
```
1. Setelah rekam
2. Klik "Putar"
3. Dengar rekaman
4. ✅ Audio terdengar jelas
```

### **Test 3: Upload File**
```
1. Pilih "Bimbingan"
2. Klik "Upload Audio"
3. Pilih file MP3
4. ✅ File ter-upload
```

### **Test 4: Playback di Operator**
```
1. Toggle "Gunakan Audio Custom" ON
2. Simpan
3. Kembali ke /operator
4. Panggil antrian Penghadapan
5. ✅ Audio custom diputar!
```

### **Test 5: Fallback**
```
1. Panggil antrian Kunjungan (no audio)
2. ✅ TTS fallback bekerja
```

---

## ⚠️ Troubleshooting:

### **Problem 1: Mikrofon Tidak Berfungsi**

**Penyebab:**
- Izin mikrofon ditolak
- Mikrofon tidak terdeteksi
- Browser tidak support

**Solusi:**
```
1. Chrome: chrome://settings/content/microphone
   - Allow untuk situs ini
2. Refresh halaman
3. Klik "Mulai Rekam" lagi
4. Izinkan saat popup muncul
```

### **Problem 2: Audio Tidak Diputar**

**Penyebab:**
- Toggle "Gunakan Audio Custom" OFF
- Rekaman corrupt
- Browser issue

**Solusi:**
```
1. Cek toggle ON
2. Simpan ulang
3. Test dengan "Putar"
4. Rekam ulang jika perlu
```

### **Problem 3: File Upload Gagal**

**Penyebab:**
- File terlalu besar (>5MB)
- Format tidak didukung
- File corrupt

**Solusi:**
```
1. Compress file audio
2. Convert ke MP3/WAV
3. Max 5MB
4. Coba file lain
```

---

## 📱 Browser Support:

### **Chrome/Edge:**
- ✅ MediaRecorder API
- ✅ Opus codec
- ✅ Full support

### **Firefox:**
- ✅ MediaRecorder API
- ✅ Full support
- ⚠️ Format berbeda

### **Safari:**
- ⚠️ Limited support
- ⚠️ Perlu polyfill
- ✅ Upload file OK

---

## 🎉 Summary:

### **Fitur Lengkap:**
- ✅ Rekam suara langsung
- ✅ Upload file audio
- ✅ Preview/playback
- ✅ Download rekaman
- ✅ Hapus rekaman
- ✅ Per layanan (4 layanan)
- ✅ Toggle enable/disable
- ✅ Fallback ke TTS
- ✅ Storage di localStorage
- ✅ Base64 encoding

### **Manfaat:**
- 🎨 Personalisasi tinggi
- ✨ Profesional
- 🔊 Kualitas audio baik
- 🔄 Fleksibel
- ⚡ Cepat & offline

---

**Fitur Rekam Suara Custom siap digunakan!** 🎤🚀

Akses: http://localhost:8080/operator-settings → Tab "Rekam Suara"

Rekam suara Anda sendiri untuk pemanggilan yang lebih personal dan profesional!
