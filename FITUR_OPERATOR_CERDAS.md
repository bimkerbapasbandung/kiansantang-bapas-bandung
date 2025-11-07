# 🎯 Fitur Operator Cerdas - Template, Suara & Pemanggilan

## 🎉 Overview

Sistem operator sekarang dilengkapi dengan **3 fitur canggih**:
1. ✅ **Edit Template** - Customize template pemanggilan
2. ✅ **Pengaturan Suara Realistis** - Kontrol kecepatan, nada, volume
3. ✅ **Pemanggilan Cerdas** - Auto-call, prioritas, notifikasi

---

## 🚀 Fitur Baru:

### **1. Edit Template Pemanggilan** 📝

#### **Apa yang Bisa Dilakukan:**
- ✅ Edit template untuk setiap layanan
- ✅ Gunakan variabel dinamis
- ✅ Format bebas dengan emoji
- ✅ Reset ke default kapan saja
- ✅ Preview real-time

#### **Variabel Tersedia:**
```
{{queueNumber}}       - Nomor antrian (PH-001)
{{clientName}}        - Nama klien
{{serviceName}}       - Nama layanan
{{subServiceName}}    - Sub layanan
{{pkOfficerName}}     - Nama PK
{{pkOfficerPosition}} - Jabatan PK
{{time}}              - Waktu pendaftaran
{{counter}}           - Nomor loket
```

#### **Contoh Template Custom:**
```
🔔 PANGGILAN ANTRIAN

Nomor: {{queueNumber}}
Nama: {{clientName}}
Layanan: {{serviceName}}

Silakan ke Loket {{counter}}
Terima kasih!
```

---

### **2. Pengaturan Suara Realistis** 🔊

#### **Kontrol Lengkap:**

**A. Kecepatan Bicara (Rate)**
- Range: 0.5x - 2.0x
- Rekomendasi: 0.8x - 1.0x (jelas & tidak terlalu cepat)
- Default: 0.9x ⭐

**B. Nada Suara (Pitch)**
- Range: 0 - 2.0
- Rekomendasi: 1.0 (natural)
- Default: 1.0 ⭐

**C. Volume**
- Range: 0% - 100%
- Rekomendasi: 100%
- Default: 100% ⭐

**D. Pilih Suara Bahasa Indonesia**
- ✅ **Filter Otomatis** - Hanya tampilkan suara Indonesia & daerah
- ✅ **Bahasa Didukung**:
  - Bahasa Indonesia (id-ID)
  - Bahasa Jawa (jv-ID)
  - Bahasa Sunda (su-ID)
  - Bahasa daerah lainnya
- ✅ **Auto-detect** - Sistem deteksi suara yang tersedia
- ✅ **Fallback** - Gunakan default jika tidak ada

#### **Fitur Test Suara:**
- Klik "Test Suara" untuk dengar preview
- Test dengan kalimat: "Nomor antrian P H 001, silakan menuju ke loket 1"
- Adjust setting sampai pas

#### **Pengaturan Realistis:**
```
✅ Rate: 0.9x (sedikit lambat, jelas)
✅ Pitch: 1.0 (suara natural)
✅ Volume: 100% (maksimal)
✅ Voice: Indonesian Female (jika tersedia)
```

---

### **3. Pemanggilan Cerdas** 🎯

#### **A. Prioritas Otomatis**
- Deteksi antrian mendesak
- Prioritaskan: lansia, ibu hamil, disabilitas
- Auto-sort berdasarkan prioritas

#### **B. Panggil Otomatis**
- Auto-call antrian berikutnya
- Set delay (10-300 detik)
- Hemat waktu operator

#### **C. Notifikasi Browser**
- Alert saat ada antrian baru
- Notifikasi desktop
- Permission request otomatis

#### **D. Suara Notifikasi**
- Beep sound saat antrian baru
- Bisa di-enable/disable
- Volume adjustable

---

## 📱 Cara Menggunakan:

### **STEP 1: Buka Pengaturan Operator**

```
1. Login ke Dashboard Operator
2. Klik tombol "Pengaturan" (icon ⚙️)
3. Atau buka: http://localhost:8080/operator-settings
```

### **STEP 2: Edit Template (Tab 1)**

```
1. Klik tab "Template"
2. Pilih layanan yang mau diedit
3. Edit template dengan variabel
4. Klik "Simpan"
5. ✅ Template tersimpan!
```

**Tips:**
- Gunakan emoji untuk visual menarik
- Jangan hapus variabel `{{...}}`
- Test template di operator dashboard

### **STEP 3: Atur Suara (Tab 2)**

```
1. Klik tab "Suara"
2. Adjust slider:
   - Kecepatan: 0.9x
   - Nada: 1.0
   - Volume: 100%
3. Pilih suara Indonesia (otomatis difilter)
   - Sistem hanya tampilkan suara Indonesia & daerah
   - Jika tidak ada, gunakan "Default"
4. Klik "Test Suara" untuk preview
5. Klik "Simpan"
6. ✅ Pengaturan tersimpan!
```

**Tips:**
- Test dulu sebelum simpan
- Gunakan kecepatan 0.8-1.0x untuk kejelasan
- Hanya suara Indonesia yang ditampilkan
- Jika dropdown kosong, browser tidak punya suara Indonesia

### **STEP 4: Aktifkan Pemanggilan Cerdas (Tab 3)**

```
1. Klik tab "Pemanggilan Cerdas"
2. Enable fitur yang diinginkan:
   ✅ Prioritas Otomatis
   ✅ Panggil Otomatis (set delay)
   ✅ Notifikasi Browser
   ✅ Suara Notifikasi
3. Klik "Simpan"
4. ✅ Fitur aktif!
```

---

## 🎨 UI/UX Features:

### **Tabs Navigation:**
```
┌─────────────────────────────────────┐
│ [📝 Template] [🔊 Suara] [🔔 Cerdas]│
└─────────────────────────────────────┘
```

### **Template Editor:**
```
┌─────────────────────────────────────┐
│ 📝 Variabel yang tersedia:          │
│ {{queueNumber}} {{clientName}}      │
│ ...                                 │
├─────────────────────────────────────┤
│ Template Penghadapan:               │
│ ┌─────────────────────────────────┐│
│ │ 📢 PEMANGGILAN...               ││
│ │ ...                             ││
│ └─────────────────────────────────┘│
│                                     │
│ [Reset Default] [💾 Simpan]        │
└─────────────────────────────────────┘
```

### **Voice Settings:**
```
┌─────────────────────────────────────┐
│ Kecepatan Bicara: 0.9x              │
│ ━━━━━━━●━━━━━━━━━━━━━━━━━━         │
│ 0.5x    0.9x ⭐    2.0x             │
│                                     │
│ [🔊 Test Suara] [💾 Simpan]        │
└─────────────────────────────────────┘
```

### **Smart Call Settings:**
```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐│
│ │ Prioritas Otomatis        [✓]  ││
│ │ Antrian mendesak diprioritaskan││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ Panggil Otomatis          [✓]  ││
│ │ Delay: 30 detik                ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## 🔄 Flow Lengkap:

```
Operator Login
    ↓
Klik "Pengaturan"
    ↓
Edit Template
    ↓
Atur Suara (Test dulu!)
    ↓
Aktifkan Fitur Cerdas
    ↓
Simpan Semua
    ↓
Kembali ke Dashboard
    ↓
Panggil Antrian
    ↓
Template Custom Muncul
    ↓
Suara Custom Terdengar
    ↓
Fitur Cerdas Bekerja
    ↓
✅ Efisiensi Meningkat!
```

---

## 💾 Data Storage:

### **LocalStorage Keys:**
```javascript
// Template
localStorage.setItem('callTemplates', JSON.stringify({
  penghadapan: "...",
  bimbingan: "...",
  kunjungan: "...",
  pengaduan: "..."
}));

// Voice Settings
localStorage.setItem('voiceSettings', JSON.stringify({
  rate: 0.9,
  pitch: 1.0,
  volume: 1.0,
  voice: "default"
}));

// Smart Call Settings
localStorage.setItem('smartCallSettings', JSON.stringify({
  enablePriority: true,
  enableAutoCall: false,
  autoCallDelay: 30,
  enableNotification: true,
  notificationSound: true
}));
```

---

## 🎯 Keuntungan Fitur:

### **1. Fleksibilitas** 🎨
- Template bisa disesuaikan per instansi
- Format bebas sesuai kebutuhan
- Emoji untuk visual menarik

### **2. Kejelasan Suara** 🔊
- Kecepatan adjustable
- Nada natural
- Volume optimal
- Pilih suara terbaik

### **3. Efisiensi Operator** ⚡
- Auto-call hemat waktu
- Prioritas otomatis
- Notifikasi real-time
- Fokus ke pelayanan

### **4. Pengalaman Pengguna** ✨
- Pemanggilan jelas
- Informasi lengkap
- Profesional
- Tidak membingungkan

---

## 🧪 Testing Guide:

### **Test 1: Edit Template**
1. Buka Pengaturan → Tab Template
2. Edit template Penghadapan
3. Ubah emoji atau format
4. Simpan
5. Kembali ke dashboard
6. Panggil antrian
7. Lihat template → ✅ Berubah!

### **Test 2: Pengaturan Suara**
1. Buka Pengaturan → Tab Suara
2. Set rate ke 0.8x
3. Klik "Test Suara"
4. Dengar preview
5. Adjust sampai pas
6. Simpan
7. Panggil antrian
8. Dengar suara → ✅ Sesuai setting!

### **Test 3: Auto-Call**
1. Buka Pengaturan → Tab Cerdas
2. Enable "Panggil Otomatis"
3. Set delay 15 detik
4. Simpan
5. Kembali ke dashboard
6. Panggil antrian pertama
7. Selesai layanan
8. Tunggu 15 detik
9. ✅ Antrian berikutnya terpanggil otomatis!

### **Test 4: Notifikasi**
1. Enable "Notifikasi Browser"
2. Simpan
3. Buka tab lain
4. Daftar antrian baru (dari tab lain)
5. ✅ Notifikasi muncul!

---

## 📊 Rekomendasi Setting:

### **Untuk Ruangan Besar:**
```
Rate: 0.8x (lebih lambat, lebih jelas)
Pitch: 1.0
Volume: 100%
Repeat: 2x (sudah default)
```

### **Untuk Ruangan Kecil:**
```
Rate: 1.0x (normal)
Pitch: 1.0
Volume: 80%
Repeat: 1x (edit di code)
```

### **Untuk Lansia:**
```
Rate: 0.7x (sangat lambat)
Pitch: 0.9 (sedikit rendah)
Volume: 100%
Repeat: 3x
```

---

## 🔧 Customization:

### **Tambah Variabel Baru:**

Edit `OperatorSettings.tsx` dan `Operator.tsx`:

```typescript
// Tambah variabel
{{newVariable}}

// Replace di template
.replace(/\{\{newVariable\}\}/g, value)
```

### **Tambah Service Code:**

Edit `soundManager.ts`:

```typescript
const serviceCodes: Record<string, string> = {
  'PH': 'Peh Ha',
  'BM': 'Be Em',
  'NEW': 'En E We', // Tambah ini
};
```

---

## 💡 Tips & Tricks:

### **Template:**
- Gunakan emoji untuk visual
- Jangan terlalu panjang
- Test di berbagai layanan
- Backup template lama

### **Suara:**
- Test dengan speaker/headphone
- Adjust berdasarkan feedback pengguna
- Gunakan suara Indonesia jika ada
- Volume jangan terlalu keras

### **Pemanggilan Cerdas:**
- Auto-call untuk jam sibuk
- Disable auto-call untuk jam sepi
- Monitor notifikasi agar tidak spam
- Adjust delay sesuai kebutuhan

---

## 🎉 Summary:

### **Fitur Lengkap:**
- ✅ Edit template dengan variabel
- ✅ Pengaturan suara realistis
- ✅ Test suara sebelum simpan
- ✅ Auto-call dengan delay
- ✅ Prioritas otomatis
- ✅ Notifikasi real-time
- ✅ Reset ke default
- ✅ Simpan di localStorage

### **Manfaat:**
- ⏱️ Hemat waktu operator
- 🔊 Suara jelas & profesional
- 🎯 Pemanggilan lebih cerdas
- ✨ Pengalaman pengguna lebih baik

---

**Fitur Operator Cerdas siap digunakan!** 🚀✨

Akses: http://localhost:8080/operator-settings
