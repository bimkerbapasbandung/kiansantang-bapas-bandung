# 📢 Fitur Template Pemanggilan Operator

## 🎯 Overview

Operator sekarang memiliki **template pemanggilan otomatis** yang berbeda untuk setiap jenis layanan, dengan data lengkap pengguna yang mendaftar.

---

## ✨ Fitur Baru:

### **1. Template Berbeda per Layanan**
- ✅ **Penghadapan** - Template khusus dengan data PK
- ✅ **Bimbingan** - Template dengan info pembimbing
- ✅ **Kunjungan** - Template dengan info pengunjung
- ✅ **Pengaduan** - Template dengan info pengadu

### **2. Data Pengguna Lengkap**
- ✅ Nama klien/pengunjung
- ✅ Nomor antrian
- ✅ Jenis layanan
- ✅ Sub layanan
- ✅ Nama PK (jika ada)
- ✅ Jabatan PK
- ✅ Nomor WhatsApp
- ✅ Waktu pendaftaran

### **3. Tombol Copy Template**
- ✅ Copy dengan 1 klik
- ✅ Siap paste ke WhatsApp/SMS
- ✅ Format rapi dengan emoji

---

## 🚀 Cara Menggunakan:

### **Untuk Operator:**

1. **Login ke Dashboard Operator**
   - Buka: http://localhost:8080/operator
   - Login dengan akun operator

2. **Panggil Antrian**
   - Klik "Panggil Selanjutnya"
   - Antrian akan muncul di "Sedang Dilayani"

3. **Lihat Data Pengguna**
   - Data otomatis muncul:
     - 👤 Nama
     - 👨‍💼 PK (jika ada)
     - 💬 WhatsApp

4. **Lihat Template Pemanggilan**
   - Klik tombol "Lihat Template"
   - Template muncul dengan data lengkap

5. **Copy Template**
   - Klik tombol "Copy"
   - Template tersalin ke clipboard
   - Paste ke WhatsApp/SMS

6. **Selesai Layanan**
   - Klik "Selesai"
   - Template otomatis disembunyikan

---

## 📋 Template untuk Setiap Layanan:

### **1. Template PENGHADAPAN:**

```
📢 PEMANGGILAN LAYANAN PENGHADAPAN

🎫 Nomor Antrian: PH-001
👤 Nama: Budi Santoso
📋 Layanan: Penghadapan
📝 Sub Layanan: Litmas
👨‍💼 PK: Ahmad Fauzi
📍 Posisi: Pembimbing Kemasyarakatan Muda
⏰ Waktu: 5/11/2025, 23:00:00

📍 Silakan menuju ke Loket 1
✅ Mohon membawa dokumen yang diperlukan
```

### **2. Template BIMBINGAN:**

```
📢 PEMANGGILAN LAYANAN BIMBINGAN

🎫 Nomor Antrian: BM-WL-001
👤 Nama Klien: Ujang
📋 Jenis Bimbingan: Wajib Lapor
👨‍💼 Pembimbing Kemasyarakatan: Budi Santoso, S.H.
📍 Jabatan: Pembimbing Kemasyarakatan Muda
⏰ Waktu Daftar: 5/11/2025, 23:00:00

📍 Silakan menuju ke Ruang Bimbingan - Loket 1
📝 Mohon membawa KTP dan dokumen pendukung
```

### **3. Template KUNJUNGAN:**

```
📢 PEMANGGILAN LAYANAN KUNJUNGAN

🎫 Nomor Antrian: KJ-001
👤 Nama Pengunjung: Siti Aminah
📋 Layanan: Kunjungan
📝 Keperluan: Kunjungan Keluarga
⏰ Waktu: 5/11/2025, 23:00:00

📍 Silakan menuju ke Loket 1
🆔 Mohon membawa KTP dan surat izin kunjungan
```

### **4. Template PENGADUAN:**

```
📢 PEMANGGILAN LAYANAN PENGADUAN

🎫 Nomor Antrian: PG-001
👤 Nama: Ahmad Yani
📋 Layanan: Pengaduan
📝 Jenis: Pengaduan Layanan
⏰ Waktu: 5/11/2025, 23:00:00

📍 Silakan menuju ke Loket 1
📄 Mohon siapkan dokumen pendukung pengaduan
```

---

## 💡 Keuntungan Fitur Ini:

### **1. Efisiensi Operator**
- ⏱️ **Hemat Waktu** - Tidak perlu ketik manual
- 📋 **Data Lengkap** - Semua info sudah tersedia
- 🚀 **Cepat** - Copy paste dalam 2 detik

### **2. Komunikasi Profesional**
- ✅ **Format Konsisten** - Semua template rapi
- 📱 **Siap WhatsApp** - Langsung kirim ke pengguna
- 🎯 **Informasi Jelas** - Tidak ada yang terlewat

### **3. Pengalaman Pengguna**
- 📢 **Pemanggilan Jelas** - Tahu harus ke mana
- 📝 **Info Lengkap** - Tahu apa yang harus dibawa
- ⏰ **Waktu Jelas** - Tahu kapan terdaftar

---

## 🎨 UI/UX Features:

### **Card Data Pengguna:**
```
┌─────────────────────────────────┐
│ 👤 Nama: Budi Santoso          │
│ 👨‍💼 PK: Ahmad Fauzi            │
│ 💬 WhatsApp: 08123456789       │
└─────────────────────────────────┘
```

### **Template Box:**
```
┌─────────────────────────────────┐
│ 📢 Template Pemanggilan  [Copy]│
├─────────────────────────────────┤
│ 📢 PEMANGGILAN LAYANAN...      │
│                                 │
│ 🎫 Nomor Antrian: ...          │
│ 👤 Nama: ...                   │
│ ...                            │
└─────────────────────────────────┘
```

### **Action Buttons:**
```
┌──────────────────┐ ┌──────────────────┐
│ 💬 Lihat Template│ │ ✅ Selesai      │
└──────────────────┘ └──────────────────┘
```

---

## 🔄 Flow Lengkap:

```
Operator Login
    ↓
Panggil Antrian
    ↓
Antrian Muncul di "Sedang Dilayani"
    ↓
Data Pengguna Otomatis Muncul
    ↓
Klik "Lihat Template"
    ↓
Template Muncul dengan Data Lengkap
    ↓
Klik "Copy"
    ↓
Template Tersalin
    ↓
Paste ke WhatsApp/SMS
    ↓
Kirim ke Pengguna
    ↓
Klik "Selesai"
    ↓
Template Disembunyikan
    ↓
Siap Panggil Antrian Berikutnya
```

---

## 📱 Integrasi WhatsApp:

### **Cara Kirim ke WhatsApp:**

1. **Copy Template** (klik tombol Copy)
2. **Buka WhatsApp Web** atau aplikasi
3. **Pilih kontak** atau nomor dari data pengguna
4. **Paste** (Ctrl+V)
5. **Kirim** ✅

### **Atau Langsung dari Nomor:**

Jika ada nomor WhatsApp di data:
- Klik nomor WhatsApp
- Otomatis buka WhatsApp Web
- Template sudah tersalin
- Tinggal paste & kirim

---

## 🎯 Customisasi Template:

Template bisa disesuaikan di file:
```
src/pages/Operator.tsx
```

Fungsi `getCallTemplate()` line 79-130

### **Contoh Edit Template:**

```typescript
const templates = {
  penghadapan: `
📢 CUSTOM TEMPLATE ANDA

🎫 Nomor: ${queue.queueNumber}
👤 Nama: ${queue.clientName}
// ... tambahkan field lain
`,
  // ... template lainnya
};
```

---

## 🧪 Testing:

### **Test 1: Penghadapan**
1. Daftar layanan Penghadapan
2. Login operator
3. Panggil antrian
4. Klik "Lihat Template"
5. ✅ Template Penghadapan muncul

### **Test 2: Bimbingan**
1. Daftar layanan Bimbingan
2. Login operator
3. Panggil antrian
4. Klik "Lihat Template"
5. ✅ Template Bimbingan muncul

### **Test 3: Copy Template**
1. Lihat template
2. Klik "Copy"
3. ✅ Toast: "Template berhasil disalin!"
4. Paste di notepad
5. ✅ Template tersalin lengkap

---

## 📊 Data yang Ditampilkan:

### **Semua Layanan:**
- ✅ Nomor antrian
- ✅ Nama pengguna
- ✅ Jenis layanan
- ✅ Sub layanan
- ✅ Waktu pendaftaran
- ✅ Nomor loket

### **Khusus Penghadapan & Bimbingan:**
- ✅ Nama PK
- ✅ Jabatan PK
- ✅ Nomor WhatsApp

---

## 💻 Technical Details:

### **State Management:**
```typescript
const [showTemplate, setShowTemplate] = useState(false);
```

### **Template Generator:**
```typescript
const getCallTemplate = (queue: QueueItem) => {
  // Generate template berdasarkan serviceType
  return templates[queue.serviceType];
};
```

### **Copy Function:**
```typescript
const copyTemplate = (queue: QueueItem) => {
  navigator.clipboard.writeText(template);
  toast.success('Template berhasil disalin!');
};
```

---

## 🎉 Summary:

### **Fitur Baru:**
- ✅ Template pemanggilan otomatis
- ✅ Berbeda per layanan
- ✅ Data pengguna lengkap
- ✅ Copy dengan 1 klik
- ✅ Format profesional dengan emoji

### **Manfaat:**
- ⏱️ Hemat waktu operator
- 📋 Data lengkap & akurat
- 📱 Siap kirim WhatsApp
- ✅ Komunikasi profesional

---

**Fitur template pemanggilan siap digunakan!** 📢✨

Operator tinggal:
1. Panggil antrian
2. Lihat template
3. Copy
4. Kirim ke WhatsApp
5. Selesai!
