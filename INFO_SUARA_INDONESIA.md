# 🔊 Filter Suara Bahasa Indonesia

## 🎯 Overview

Sistem sekarang **hanya menampilkan suara bahasa Indonesia dan bahasa daerah** di Indonesia.

---

## ✅ Bahasa yang Didukung:

### **1. Bahasa Nasional:**
- 🇮🇩 **Bahasa Indonesia** (id-ID)
  - Google Indonesia Female (Damayanti)
  - Microsoft Indonesia Female
  - Suara sistem Indonesia lainnya

### **2. Bahasa Daerah:**
- 🗣️ **Bahasa Jawa** (jv-ID)
- 🗣️ **Bahasa Sunda** (su-ID)
- 🗣️ **Bahasa Bali**
- 🗣️ **Bahasa Melayu**

---

## 🔍 Filter Otomatis:

### **Kriteria Filter:**

Sistem memfilter suara berdasarkan:

1. **Kode Bahasa (lang)**:
   - `id` - Indonesia
   - `jv` - Jawa
   - `su` - Sunda

2. **Nama Suara (name)**:
   - Mengandung "Indonesia"
   - Mengandung "Damayanti"
   - Mengandung "Jawa"
   - Mengandung "Sunda"
   - Mengandung "Bali"
   - Mengandung "Melayu"

### **Suara yang TIDAK Ditampilkan:**
- ❌ Bahasa Inggris (en-US, en-GB)
- ❌ Bahasa Mandarin (zh-CN)
- ❌ Bahasa Jepang (ja-JP)
- ❌ Bahasa Korea (ko-KR)
- ❌ Bahasa Arab (ar-SA)
- ❌ Bahasa Eropa lainnya
- ❌ Bahasa asing lainnya

---

## 📱 Cara Kerja:

### **1. Load Voices:**
```typescript
const allVoices = window.speechSynthesis.getVoices();
```

### **2. Filter Indonesia:**
```typescript
const indonesianVoices = allVoices.filter(voice => {
  const lang = voice.lang.toLowerCase();
  const name = voice.name.toLowerCase();
  
  return (
    lang.includes('id') ||           // Indonesia
    lang.includes('jv') ||           // Jawa
    lang.includes('su') ||           // Sunda
    name.includes('indonesia') ||
    name.includes('damayanti') ||
    name.includes('jawa') ||
    name.includes('sunda') ||
    name.includes('bali') ||
    name.includes('melayu')
  );
});
```

### **3. Display:**
```typescript
setAvailableVoices(indonesianVoices);
```

---

## 🎨 UI Features:

### **Dropdown Suara:**
```
┌─────────────────────────────────────┐
│ Pilih Suara Bahasa Indonesia       │
├─────────────────────────────────────┤
│ ▼ Default (Suara Sistem)           │
│   Google Indonesia Female (id-ID)   │
│   Microsoft Indonesia (id-ID)       │
│   Bahasa Jawa (jv-ID)              │
└─────────────────────────────────────┘
```

### **Info Jumlah Suara:**
```
✅ Ditemukan 3 suara bahasa Indonesia
```

### **Jika Tidak Ada:**
```
ℹ️ Browser Anda tidak memiliki suara bahasa Indonesia.
   Sistem akan menggunakan suara default.
```

---

## 🌐 Browser Support:

### **Chrome/Edge:**
- ✅ Google Indonesia Female (Damayanti)
- ✅ Suara online dari Google
- ✅ Kualitas terbaik

### **Firefox:**
- ⚠️ Terbatas, tergantung OS
- ⚠️ Mungkin tidak ada suara Indonesia
- ✅ Fallback ke default

### **Safari:**
- ✅ Suara sistem macOS/iOS
- ✅ Siri Voice Indonesia (jika tersedia)
- ⚠️ Tergantung pengaturan sistem

### **Windows:**
- ✅ Microsoft Indonesia Female
- ✅ Tersedia di Windows 10/11
- ✅ Perlu download language pack

---

## 🔧 Troubleshooting:

### **Problem 1: Tidak Ada Suara Indonesia**

**Penyebab:**
- Browser tidak punya suara Indonesia
- OS belum install language pack
- Browser belum load voices

**Solusi:**
```
1. Chrome/Edge:
   - Buka chrome://settings/languages
   - Tambah "Bahasa Indonesia"
   - Restart browser

2. Windows:
   - Settings → Time & Language → Language
   - Add "Bahasa Indonesia"
   - Download speech pack
   - Restart

3. Refresh halaman
   - Voices load saat page load
   - Refresh untuk reload voices
```

### **Problem 2: Suara Tidak Jelas**

**Solusi:**
```
1. Adjust kecepatan ke 0.8x
2. Pilih suara berbeda
3. Cek volume sistem
4. Test dengan speaker/headphone
```

### **Problem 3: Suara Asing Muncul**

**Solusi:**
```
Seharusnya tidak terjadi karena sudah difilter.
Jika terjadi:
1. Screenshot dropdown
2. Report bug
3. Gunakan "Default" sementara
```

---

## 📊 Contoh Suara Tersedia:

### **Google Chrome (Windows):**
```
✅ Google Indonesia Female (id-ID)
✅ Microsoft Indonesia Female (id-ID)
Total: 2 suara
```

### **Microsoft Edge (Windows):**
```
✅ Microsoft Indonesia Female (id-ID)
✅ Google Indonesia Female (id-ID)
Total: 2 suara
```

### **Firefox (Windows):**
```
⚠️ Mungkin kosong
Fallback: Default (Suara sistem)
```

### **Chrome (Android):**
```
✅ Google Indonesia Female (id-ID)
Total: 1 suara
```

---

## 💡 Rekomendasi:

### **Browser Terbaik:**
```
1. Google Chrome ⭐⭐⭐⭐⭐
   - Suara terlengkap
   - Kualitas terbaik
   - Online voices

2. Microsoft Edge ⭐⭐⭐⭐
   - Suara Microsoft
   - Integrasi Windows
   - Stabil

3. Firefox ⭐⭐⭐
   - Terbatas
   - Tergantung OS
   - Fallback OK
```

### **Pengaturan Optimal:**
```
✅ Browser: Chrome/Edge
✅ Suara: Google Indonesia Female
✅ Rate: 0.9x
✅ Pitch: 1.0
✅ Volume: 100%
```

---

## 🎯 Testing:

### **Test 1: Cek Suara Tersedia**
```
1. Buka /operator-settings
2. Tab "Suara"
3. Lihat dropdown "Pilih Suara"
4. Cek jumlah suara
5. ✅ Hanya suara Indonesia muncul
```

### **Test 2: Test Suara**
```
1. Pilih suara Indonesia
2. Klik "Test Suara"
3. Dengar: "Nomor antrian P H 001..."
4. ✅ Suara Indonesia terdengar
```

### **Test 3: Fallback**
```
1. Jika dropdown kosong
2. Pilih "Default"
3. Klik "Test Suara"
4. ✅ Suara sistem terdengar
```

---

## 📝 Code Reference:

### **File:** `src/pages/OperatorSettings.tsx`

**Line 119-143:**
```typescript
// Load available voices - filter hanya bahasa Indonesia dan daerah
const loadVoices = () => {
  const allVoices = window.speechSynthesis.getVoices();
  
  // Filter hanya suara Indonesia dan bahasa daerah
  const indonesianVoices = allVoices.filter(voice => {
    const lang = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();
    
    // Filter berdasarkan kode bahasa Indonesia dan daerah
    return (
      lang.includes('id') ||           // id-ID (Indonesia)
      lang.includes('jv') ||           // jv-ID (Jawa)
      lang.includes('su') ||           // su-ID (Sunda)
      name.includes('indonesia') ||    // Nama mengandung "Indonesia"
      name.includes('damayanti') ||    // Google Indonesia Female
      name.includes('jawa') ||         // Jawa
      name.includes('sunda') ||        // Sunda
      name.includes('bali') ||         // Bali
      name.includes('melayu')          // Melayu
    );
  });
  
  setAvailableVoices(indonesianVoices);
};
```

---

## ✅ Summary:

**Fitur Filter:**
- ✅ Hanya tampilkan suara Indonesia & daerah
- ✅ Filter otomatis berdasarkan lang & name
- ✅ Info jumlah suara tersedia
- ✅ Pesan jika tidak ada suara
- ✅ Fallback ke default
- ✅ Support 5+ bahasa daerah

**Keuntungan:**
- 🎯 Fokus ke suara Indonesia
- 🚫 Tidak bingung dengan suara asing
- ✅ User experience lebih baik
- 🇮🇩 Sesuai kebutuhan lokal

---

**Filter suara Indonesia aktif!** 🇮🇩🔊

Hanya suara bahasa Indonesia dan daerah yang akan ditampilkan di dropdown.
