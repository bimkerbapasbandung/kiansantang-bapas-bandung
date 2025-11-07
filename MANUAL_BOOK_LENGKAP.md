# 📘 MANUAL BOOK - SISTEM ANTRIAN LAYANAN BAPAS BANDUNG

**Versi:** 2.0 | **Tanggal:** November 2024

---

## 📑 DAFTAR ISI

1. [Pendahuluan](#pendahuluan)
2. [Spesifikasi Sistem](#spesifikasi-sistem)
3. [Instalasi](#instalasi)
4. [Panduan Pengguna](#panduan-pengguna)
5. [Fitur Utama](#fitur-utama)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)

---

# PENDAHULUAN

## Tentang Aplikasi

Sistem Antrian Layanan BAPAS Bandung adalah aplikasi web untuk mengelola antrian layanan di Balai Pemasyarakatan Kelas I Bandung.

### Jenis Layanan:
1. **Penghadapan (PH)** - Penghadapan rutin klien
2. **Bimbingan (BM)** - Wajib Lapor, Kepribadian, Kemandirian
3. **Kunjungan (KJ)** - Individu, Instansi
4. **Pengaduan (PG)** - Pengaduan umum

### Pengguna:
- **Admin** - Kelola sistem dan PK
- **Operator** - Kelola antrian
- **PK** - Lihat jadwal
- **Klien** - Daftar antrian

---

# SPESIFIKASI SISTEM

## Teknologi
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (Backend)
- Web Speech API (TTS)

## Persyaratan
- Browser: Chrome 90+, Edge 90+
- Internet: Min. 2 Mbps
- Speaker untuk announcement
- Node.js v18+ (development)

---

# INSTALASI

## Setup Admin (Pertama Kali)

```
1. Akses aplikasi di browser
2. Klik "Setup Admin"
3. Masukkan email & password
4. Klik "Buat Admin"
5. ✅ Login dengan kredensial
```

## Setup Database PK

**PK harus diinput sebelum bisa digunakan!**

```
1. Login sebagai Admin
2. Klik "Kelola PK"
3. Klik "Tambah PK Baru"
4. Isi: Nama, Jabatan, Status Aktif
5. Klik "Simpan"
```

📖 **Detail:** `QUICK_START_PK.md`

## Setup Operator

```
1. Login → Dashboard Operator
2. Klik "Pengaturan" ⚙️
3. Tab "Pengaturan Suara":
   - Pilih voice (Google recommended)
   - Atur rate: 0.8-1.0
   - Atur pitch: 0.9-1.2
   - Test & Simpan
4. Tab "Template":
   - Edit template per layanan
   - Gunakan {{placeholder}}
   - Simpan
```

## Setup Display

```
1. Buka /display di TV/Monitor
2. Tekan F11 untuk fullscreen
3. ✅ Display siap
```

---

# PANDUAN PENGGUNA

## Untuk Klien

### Cara Daftar Antrian:

**1. Pilih Layanan**
```
- Penghadapan
- Bimbingan
- Kunjungan
- Pengaduan
```

**2. Isi Form**
```
- Nama Lengkap (wajib)
- WhatsApp (opsional)
- Pilih PK (untuk Penghadapan/Bimbingan)
- Pilih Sub-layanan (untuk Bimbingan/Kunjungan)
```

**3. Dapatkan Nomor**
```
✅ Nomor antrian: PH-001
📱 Screenshot atau catat
⏰ Lihat estimasi waktu
```

**4. Tunggu Panggilan**
```
👀 Pantau Display TV
👂 Dengar pengumuman
🚶 Menuju loket yang disebutkan
```

---

## Untuk Operator

### Workflow:

```
1. Login → Dashboard Operator
2. Lihat "Antrian Menunggu"
3. Klik "Panggil Berikutnya" 📞
4. Sistem announce otomatis (2x)
5. Layani klien
6. Klik "Selesai" ✅
7. Ulangi
```

### Fitur:

**Filter Antrian:**
```
- Dropdown: Pilih layanan
- Search: Cari nomor/nama
```

**Lihat Template:**
```
- Klik "Lihat Template" 📋
- Copy jika perlu
```

**Reset:**
```
⚠️ Hapus SEMUA antrian
- Klik "Reset" 🔄
- Konfirmasi
```

---

## Untuk Admin

### Kelola PK:

**Tambah:**
```
Kelola PK → Tambah PK Baru
- Nama: "Ahmad Yani"
- Jabatan: "Pembimbing Kemasyarakatan Pratama"
- Status: Aktif ✅
```

**Edit:**
```
Klik icon edit ✏️ → Ubah → Simpan
```

**Nonaktifkan:**
```
Toggle status → Tidak Aktif
(PK tidak muncul di form)
```

**Hapus:**
```
⚠️ Tidak bisa dikembalikan!
Klik icon hapus 🗑️ → Konfirmasi
```

### Statistik:

```
Klik "Statistik" 📈
- Total antrian
- Per layanan
- Waktu tunggu rata-rata
- Grafik trend
```

---

# FITUR UTAMA

## 1. Sistem Antrian

### Format Nomor:
```
PH-001  →  Penghadapan #1
BM-025  →  Bimbingan #25
KJ-100  →  Kunjungan #100
PG-999  →  Pengaduan #999
```

### Status:
- 🟡 **Waiting** - Menunggu
- 🟢 **Serving** - Dilayani
- ✅ **Completed** - Selesai

---

## 2. Announcement System

### Text-to-Speech:

**Fitur:**
- Pengumuman otomatis
- Pengulangan 2x
- Voice customization
- Template dinamis

**Voice Settings:**
- Rate: 0.5-2.0 (kecepatan)
- Pitch: 0.5-2.0 (nada)
- Volume: 0.0-1.0
- Voice: Google/Microsoft

**Cara Kerja:**
```
1. Operator panggil
2. Load template
3. Replace {{placeholder}}
4. Convert ke TTS
5. Speak 2x
```

📖 **Detail:** 
- `PANDUAN_GOOGLE_VOICES_INDONESIA.md`
- `PANDUAN_PITCH_DAN_VARIASI_SUARA.md`

---

### Custom Audio:

**Fitur:**
- Rekam audio per layanan
- Max 5MB
- Priority: Audio > TTS

**Cara Rekam:**
```
1. Pengaturan → Tab "Rekam Suara"
2. Pilih layanan
3. Klik "Mulai Rekam" 🎤
4. Ucapkan template
5. Stop → Preview → Simpan
```

📖 **Detail:** `FITUR_REKAM_SUARA.md`

---

## 3. Template System

### Placeholder:
```
{{queueNumber}}       - Nomor antrian
{{clientName}}        - Nama klien
{{serviceName}}       - Nama layanan
{{subServiceName}}    - Sub layanan
{{pkOfficerName}}     - Nama PK
{{pkOfficerPosition}} - Jabatan PK
{{time}}              - Waktu
{{counter}}           - Nomor loket
```

### Contoh:
```
Template:
📢 {{serviceName}}
Nomor: {{queueNumber}}
Nama: {{clientName}}
Loket: {{counter}}

TTS Output:
"Penghadapan. Nomor: Peh Ha 0 0 1. 
Nama: Budi Santoso. Loket: 1."
```

📖 **Detail:** `PANDUAN_TEMPLATE_PANGGILAN_SUARA.md`

---

## 4. Live Announcement Display

**Fitur:**
- Text announcement real-time
- Animasi LIVE indicator
- Auto-hide setelah selesai

**Tampilan:**
```
┌────────────────────────────────┐
│ 🔊 Sedang Memutar  ● LIVE     │
│ ┌────────────────────────────┐ │
│ │ PEMANGGILAN PENGHADAPAN.   │ │
│ │ Nomor: Peh Ha 0 0 1.       │ │
│ │ Nama: Budi Santoso.        │ │
│ └────────────────────────────┘ │
│ 💡 Diulang 2x otomatis        │
└────────────────────────────────┘
```

📖 **Detail:** `FITUR_TAMPILAN_TEXT_ANNOUNCEMENT.md`

---

## 5. Display System

**Informasi:**
- Antrian sedang dilayani (highlight)
- 5 antrian berikutnya
- Real-time update
- Fullscreen mode

---

# TROUBLESHOOTING

## 1. Tidak Bisa Login

**Solusi:**
```
✓ Cek email & password
✓ Pastikan admin sudah dibuat
✓ Clear browser cache
✓ Coba browser lain
```

---

## 2. PK Tidak Muncul

**Solusi:**
```
✓ Login admin → Kelola PK
✓ Pastikan ada data PK
✓ Pastikan status "Aktif"
✓ Tambah PK jika kosong
✓ Refresh halaman
```

📖 **Detail:** `QUICK_START_PK.md`

---

## 3. Suara Tidak Keluar

**Solusi:**
```
✓ Cek volume speaker
✓ Cek browser permission (autoplay)
✓ Test suara di Pengaturan
✓ Coba voice lain (Google/Microsoft)
✓ Coba browser lain (Chrome)
```

📖 **Detail:** `TROUBLESHOOTING_PENGATURAN_SUARA.md`

---

## 4. Template Tidak Berubah

**Solusi:**
```
✓ Klik "Simpan" setelah edit
✓ Refresh browser (F5)
✓ Clear cache
✓ Edit ulang
```

---

## 5. Display Tidak Update

**Solusi:**
```
✓ Refresh halaman (F5)
✓ Cek koneksi internet
✓ Restart browser
✓ Install auto-refresh extension
```

---

## 6. Antrian Tidak Muncul

**Solusi:**
```
✓ Pastikan form terisi lengkap
✓ Pastikan PK dipilih
✓ Refresh operator dashboard
✓ Cek console error (F12)
```

---

# FAQ

## Q: Berapa lama antrian tersimpan?
**A:** Antrian tersimpan permanen di database sampai dihapus manual atau reset.

## Q: Bisa pakai HP untuk operator?
**A:** Bisa, tapi desktop/laptop lebih recommended untuk UX yang lebih baik.

## Q: Apakah bisa offline?
**A:** Tidak, aplikasi memerlukan koneksi internet untuk akses Supabase.

## Q: Bagaimana cara backup data?
**A:** Export dari Supabase Dashboard atau gunakan fitur export di Statistik.

## Q: Bisa custom nomor antrian?
**A:** Format nomor otomatis (XX-NNN), tidak bisa custom manual.

## Q: Maksimal berapa antrian per hari?
**A:** Tidak ada limit, tergantung kapasitas database.

## Q: Bisa integrasi WhatsApp?
**A:** Fitur WhatsApp notification sedang dalam development.

## Q: Apakah gratis?
**A:** Ya, aplikasi gratis. Biaya hanya untuk hosting (Supabase free tier tersedia).

---

# LAMPIRAN

## Dokumentasi Lengkap

### Setup & Instalasi:
- `SETUP_ADMIN.md` - Setup admin
- `QUICK_START_PK.md` - Setup PK
- `PANDUAN_SUPABASE.md` - Setup database

### Fitur:
- `FITUR_OPERATOR_CERDAS.md` - Smart features
- `FITUR_REKAM_SUARA.md` - Audio recording
- `FITUR_TEMPLATE_PEMANGGILAN.md` - Template system
- `FITUR_TAMPILAN_TEXT_ANNOUNCEMENT.md` - Live display

### Voice & Audio:
- `PANDUAN_GOOGLE_VOICES_INDONESIA.md` - Google voices
- `PANDUAN_PITCH_DAN_VARIASI_SUARA.md` - Voice settings
- `PANDUAN_TEMPLATE_PANGGILAN_SUARA.md` - Template audio
- `TROUBLESHOOTING_PENGATURAN_SUARA.md` - Audio issues

### Troubleshooting:
- `TROUBLESHOOT_BIMBINGAN.md` - Bimbingan issues
- `DEBUG_DAFTAR_BIMBINGAN.md` - Debug guide
- `TESTING_GUIDE.md` - Testing guide

---

## Kontak Support

**Email:** support@bapas-bandung.go.id  
**Telp:** (022) xxx-xxxx  
**Website:** https://bapas-bandung.kemenkumham.go.id

---

## Changelog

### Version 2.0 (November 2024)
- ✅ Template system dengan placeholder dinamis
- ✅ Live announcement display
- ✅ Google/Microsoft voices support
- ✅ Custom audio recording
- ✅ Voice settings (rate, pitch, volume)
- ✅ Real-time queue management
- ✅ Improved UI/UX

### Version 1.0 (Oktober 2024)
- ✅ Basic queue management
- ✅ Multi-service support
- ✅ Display system
- ✅ PK management
- ✅ Basic TTS

---

**© 2024 BAPAS Kelas I Bandung. All rights reserved.**
