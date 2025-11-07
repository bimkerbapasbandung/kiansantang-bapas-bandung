# 🔧 Troubleshooting: Pengaturan Suara Tidak Berpengaruh

## ❓ Masalah Umum

### **Problem: Pengaturan suara tidak berpengaruh saat panggil antrian**

---

## ✅ Solusi Lengkap

### **STEP 1: Pastikan Sudah Menyimpan Pengaturan** ⚠️

**Masalah paling umum:** Lupa klik tombol "Simpan"!

```
1. Buka /operator-settings
2. Tab "Suara" 🔊
3. Ubah pengaturan (rate, pitch, volume, voice)
4. ❗ KLIK "SIMPAN" ❗
5. Lihat notifikasi: "Pengaturan suara berhasil disimpan!"
```

**Visual Indicator:**
- Jika ada badge **"⚠️ Belum Disimpan"** → Klik "Simpan Perubahan"
- Tombol "Simpan" berwarna **orange** → Ada perubahan yang belum disimpan
- Tombol "Simpan" normal → Sudah tersimpan

---

### **STEP 2: Test Pengaturan Sebelum Digunakan** 🎤

```
1. Ubah pengaturan suara
2. Klik "Test Suara"
3. Dengar hasilnya
4. Puas? → Klik "Simpan"
5. Tidak puas? → Ubah lagi → Test lagi
```

**Catatan:**
- "Test Suara" menggunakan pengaturan SAAT INI (belum tersimpan)
- Untuk menyimpan → Harus klik "Simpan"

---

### **STEP 3: Verifikasi Pengaturan Tersimpan** ✅

**Cara 1: Cek LocalStorage**
```
1. Buka DevTools (F12)
2. Tab "Application" atau "Storage"
3. LocalStorage → pilih domain Anda
4. Cari key: "voiceSettings"
5. Lihat value-nya
```

**Contoh Value:**
```json
{
  "rate": 0.9,
  "pitch": 1.0,
  "volume": 1.0,
  "voice": "Google Bahasa Indonesia"
}
```

**Cara 2: Cek Console Log**
```
1. Buka DevTools (F12)
2. Tab "Console"
3. Klik "Test Suara"
4. Lihat log:
   - "Using voice: Google Bahasa Indonesia"
   - "Test voice settings: {rate: 0.9, pitch: 1.0, ...}"
```

---

### **STEP 4: Refresh Browser** 🔄

Kadang browser perlu di-refresh untuk load settings baru:

```
1. Setelah klik "Simpan"
2. Refresh halaman (F5 atau Ctrl+R)
3. Atau tutup dan buka tab baru
4. Test lagi
```

---

### **STEP 5: Clear Cache (Jika Masih Bermasalah)** 🗑️

```
1. Buka DevTools (F12)
2. Klik kanan tombol Refresh
3. Pilih "Empty Cache and Hard Reload"
4. Atau:
   - Chrome: Ctrl+Shift+Delete
   - Pilih "Cached images and files"
   - Clear data
```

---

## 🔍 Debugging Step-by-Step

### **1. Cek Apakah Settings Tersimpan**

**Buka Console (F12) dan ketik:**
```javascript
localStorage.getItem('voiceSettings')
```

**Hasil yang diharapkan:**
```
'{"rate":0.9,"pitch":1.0,"volume":1.0,"voice":"default"}'
```

**Jika null atau undefined:**
- Settings belum disimpan
- Klik "Simpan" di pengaturan

---

### **2. Cek Apakah soundManager Load Settings**

**Buka Console dan ketik:**
```javascript
soundManager.getVoiceSettings()
```

**Hasil yang diharapkan:**
```javascript
{
  rate: 0.9,
  pitch: 1.0,
  volume: 1.0,
  voice: "default"
}
```

---

### **3. Test Manual Speech Synthesis**

**Buka Console dan ketik:**
```javascript
const utterance = new SpeechSynthesisUtterance('Test suara');
utterance.rate = 0.5; // Sangat lambat
utterance.pitch = 2.0; // Sangat tinggi
utterance.volume = 1.0;
speechSynthesis.speak(utterance);
```

**Jika terdengar lambat dan tinggi:**
- Speech synthesis berfungsi
- Masalah di pengaturan atau penyimpanan

**Jika tidak terdengar:**
- Browser issue
- Coba browser lain

---

### **4. Cek Available Voices**

**Buka Console dan ketik:**
```javascript
speechSynthesis.getVoices()
```

**Hasil:**
```javascript
[
  {name: "Google Bahasa Indonesia", lang: "id-ID", ...},
  {name: "Microsoft Andika - Indonesian", lang: "id-ID", ...},
  ...
]
```

**Jika array kosong:**
- Tunggu beberapa detik
- Atau ketik:
```javascript
speechSynthesis.onvoiceschanged = () => {
  console.log(speechSynthesis.getVoices());
}
```

---

## 🎯 Checklist Troubleshooting

### **Sebelum Komplain "Tidak Berpengaruh":**

- [ ] Sudah ubah pengaturan (rate, pitch, volume, voice)
- [ ] Sudah klik "Test Suara" dan dengar hasilnya
- [ ] **Sudah klik tombol "SIMPAN"** ⚠️
- [ ] Sudah lihat notifikasi "berhasil disimpan"
- [ ] Badge "Belum Disimpan" sudah hilang
- [ ] Sudah refresh browser
- [ ] Sudah test panggil antrian di dashboard
- [ ] Sudah cek localStorage ada "voiceSettings"
- [ ] Sudah cek console log tidak ada error

---

## 🚨 Masalah Spesifik & Solusi

### **Problem 1: Rate/Pitch/Volume Tidak Berubah**

**Penyebab:**
- Lupa klik "Simpan"
- Browser cache

**Solusi:**
```
1. Klik "Simpan" di tab Suara
2. Refresh browser (F5)
3. Test lagi
```

---

### **Problem 2: Voice Selection Tidak Berubah**

**Penyebab:**
- Voice belum ter-load saat page load
- Voice tidak tersedia di browser

**Solusi:**
```
1. Tunggu 2-3 detik setelah page load
2. Refresh halaman
3. Pilih voice lagi
4. Klik "Test Suara"
5. Jika terdengar berbeda → Klik "Simpan"
```

**Cek Voice Tersedia:**
```javascript
// Di console
speechSynthesis.getVoices().filter(v => v.lang.includes('id'))
```

---

### **Problem 3: Pengaturan Hilang Setelah Refresh**

**Penyebab:**
- LocalStorage ter-clear
- Tidak klik "Simpan"
- Browser private/incognito mode

**Solusi:**
```
1. Jangan gunakan mode incognito
2. Cek browser settings → Allow cookies/storage
3. Set ulang pengaturan
4. Klik "Simpan"
5. Cek localStorage:
   localStorage.getItem('voiceSettings')
```

---

### **Problem 4: Test Suara Berfungsi, Tapi Panggil Antrian Tidak**

**Penyebab:**
- Custom audio aktif (override TTS)
- soundManager tidak load settings

**Solusi:**
```
1. Tab "Rekam Suara"
2. Toggle "Gunakan Audio Custom" → OFF
3. Klik "Simpan Semua"
4. Test panggil antrian lagi
```

**Atau cek di console:**
```javascript
soundManager.getCustomAudioSettings()
// Jika useCustomAudio: true → matikan
```

---

### **Problem 5: Suara Terlalu Cepat/Lambat**

**Rekomendasi Rate:**
- 0.5 = Sangat lambat
- 0.8 = Lambat (jelas)
- 0.9 = Sedikit lambat (realistis) ✅
- 1.0 = Normal
- 1.5 = Cepat
- 2.0 = Sangat cepat

**Setting Optimal:**
```
Rate: 0.8 - 0.9
Pitch: 1.0
Volume: 1.0
```

---

## 📋 Workflow Benar

```
1. Buka /operator-settings
   ↓
2. Tab "Suara" 🔊
   ↓
3. Ubah Rate (misal: 0.9)
   ↓
4. Ubah Pitch (misal: 1.0)
   ↓
5. Ubah Volume (misal: 1.0)
   ↓
6. Pilih Voice (misal: Google Bahasa Indonesia)
   ↓
7. Klik "Test Suara" 🎤
   ↓
8. Dengar hasilnya
   ↓
9. Puas? → Lanjut
   Tidak? → Ubah lagi (kembali ke step 3)
   ↓
10. ❗ KLIK "SIMPAN" ❗
    ↓
11. Lihat notifikasi: "Pengaturan suara berhasil disimpan!"
    ↓
12. Badge "Belum Disimpan" hilang
    ↓
13. Refresh browser (F5)
    ↓
14. Kembali ke /operator
    ↓
15. Panggil antrian
    ↓
16. ✅ Pengaturan suara berlaku!
```

---

## 🎓 Tips Penting

### **DO ✅**

- Selalu klik "Test Suara" sebelum simpan
- Selalu klik "Simpan" setelah ubah pengaturan
- Tunggu notifikasi "berhasil disimpan"
- Refresh browser setelah simpan
- Cek badge "Belum Disimpan" hilang

### **DON'T ❌**

- Jangan lupa klik "Simpan"
- Jangan langsung test di dashboard tanpa simpan dulu
- Jangan gunakan mode incognito
- Jangan clear localStorage tanpa backup
- Jangan skip "Test Suara"

---

## 🔧 Advanced Debugging

### **Cek Full Flow:**

```javascript
// 1. Cek localStorage
console.log('Saved settings:', localStorage.getItem('voiceSettings'));

// 2. Cek soundManager load
console.log('Loaded settings:', soundManager.getVoiceSettings());

// 3. Cek voices available
console.log('Available voices:', speechSynthesis.getVoices());

// 4. Test manual
const settings = soundManager.getVoiceSettings();
const utterance = new SpeechSynthesisUtterance('Test');
utterance.rate = settings.rate;
utterance.pitch = settings.pitch;
utterance.volume = settings.volume;
console.log('Manual test:', utterance);
speechSynthesis.speak(utterance);
```

---

## 📞 Masih Bermasalah?

### **Langkah Terakhir:**

1. **Clear All Data:**
```javascript
localStorage.removeItem('voiceSettings');
localStorage.removeItem('customAudioSettings');
```

2. **Refresh Browser:**
```
Ctrl + Shift + Delete → Clear all
```

3. **Set Ulang:**
```
- Buka /operator-settings
- Tab "Suara"
- Set dari awal
- Test → Simpan → Refresh
```

4. **Coba Browser Lain:**
```
- Chrome ✅ (Recommended)
- Edge ✅
- Firefox ✅
- Safari ⚠️ (Limited support)
```

---

## ✅ Summary

**Masalah Utama:**
- ❌ Lupa klik "Simpan"
- ❌ Tidak refresh browser
- ❌ Custom audio aktif (override TTS)
- ❌ Browser cache

**Solusi:**
1. ✅ Ubah pengaturan
2. ✅ Klik "Test Suara"
3. ✅ **KLIK "SIMPAN"** ⚠️
4. ✅ Refresh browser
5. ✅ Test di dashboard

**Visual Indicator:**
- Badge "⚠️ Belum Disimpan" → Harus simpan
- Tombol orange → Ada perubahan
- Notifikasi sukses → Tersimpan

---

**Pengaturan suara akan berpengaruh jika sudah disimpan dengan benar!** 🔊✅

Selalu ingat: **UBAH → TEST → SIMPAN → REFRESH → TEST LAGI**
