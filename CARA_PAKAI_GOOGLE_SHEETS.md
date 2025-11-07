# 📊 CARA PAKAI GOOGLE SHEETS INTEGRATION

## ✅ FITUR YANG SUDAH AKTIF:

### **1. Data PK dari Google Sheets**
- ✅ Menu Bimbingan sekarang mengambil data PK dari Google Sheets
- ✅ Hanya PK yang sudah di-sync yang akan muncul
- ✅ Data otomatis update setelah sync

---

## 🔄 CARA SYNC DATA

### **STEP 1: Buka Halaman Operator**

1. Login ke aplikasi
2. Pilih menu **"Operator"**
3. Lihat header - ada tombol **"Sync Google Sheets"** dengan icon 🔄

---

### **STEP 2: Klik Tombol Sync**

1. **Klik tombol "Sync Google Sheets"**
2. **Tunggu** beberapa detik
3. **Lihat notifikasi:**
   - ✅ Success: "Sync berhasil! X PK officers synced"
   - ❌ Error: Pesan error

---

### **STEP 3: Cek Data PK**

1. **Kembali ke halaman utama**
2. **Pilih "Bimbingan"**
3. **Pilih jenis layanan** (Wajib Lapor/Kepribadian/Kemandirian)
4. **Lihat daftar PK** - sekarang muncul data dari Google Sheets!

---

## 📋 ALUR LENGKAP:

```
Google Sheets (Master_PK)
    ↓
[Klik Sync Button]
    ↓
Supabase Database (pk_officers)
    ↓
Menu Bimbingan (Pilih PK)
```

---

## 🎯 CONTOH PENGGUNAAN:

### **Scenario: Tambah PK Baru**

1. **Buka Google Sheets** Anda
2. **Tambah data PK baru** di sheet Master_PK:
   ```
   PK004   Andi Wijaya, S.H.   PK Pratama   Aktif
   ```
3. **Kembali ke aplikasi**
4. **Klik "Sync Google Sheets"** di halaman Operator
5. **Tunggu notifikasi** "Sync berhasil!"
6. **Buka menu Bimbingan**
7. **PK baru sudah muncul** di daftar!

---

### **Scenario: Update Data PK**

1. **Buka Google Sheets**
2. **Edit data PK** (misalnya ganti jabatan):
   ```
   PK001   Drs. Ahmad Wijaya, M.Si   PK Madya   Aktif
   ```
3. **Klik "Sync Google Sheets"** di aplikasi
4. **Data PK terupdate** otomatis!

---

### **Scenario: Nonaktifkan PK**

1. **Buka Google Sheets**
2. **Ubah status** jadi "Tidak Aktif":
   ```
   PK002   Sri Lestari, S.Sos   PK Muda   Tidak Aktif
   ```
3. **Sync di aplikasi**
4. **PK tersebut tidak muncul** di menu Bimbingan

---

## 🔍 TROUBLESHOOTING:

### **❌ "Belum ada data PK dari Google Sheets"**

**Penyebab:**
- Belum pernah sync
- Semua PK statusnya "Tidak Aktif"

**Solusi:**
1. Pastikan ada data PK di Google Sheets
2. Pastikan status PK = "Aktif"
3. Klik tombol "Sync Google Sheets"

---

### **❌ "Gagal sync - API Key invalid"**

**Penyebab:**
- API Key salah atau expired

**Solusi:**
1. Cek file `.env`
2. Pastikan `VITE_GOOGLE_API_KEY` benar
3. Restart server (`npm run dev`)

---

### **❌ "Cannot read spreadsheet"**

**Penyebab:**
- Google Sheets belum di-share
- Spreadsheet ID salah

**Solusi:**
1. Buka Google Sheets
2. Klik "Share" → "Anyone with the link"
3. Cek Spreadsheet ID di `.env`

---

## 📊 STRUKTUR DATA:

### **Master_PK (Google Sheets):**
```
ID      | Nama                    | Jabatan    | Status
--------|-------------------------|------------|--------
PK001   | Drs. Ahmad Wijaya, M.Si | PK Pratama | Aktif
PK002   | Sri Lestari, S.Sos      | PK Muda    | Aktif
PK003   | Budi Santoso, S.H.      | PK Madya   | Aktif
```

### **pk_officers (Database):**
```
id (UUID)  | name                    | position   | is_active | sheet_id
-----------|-------------------------|------------|-----------|----------
uuid-123   | Drs. Ahmad Wijaya, M.Si | PK Pratama | true      | PK001
uuid-456   | Sri Lestari, S.Sos      | PK Muda    | true      | PK002
uuid-789   | Budi Santoso, S.H.      | PK Madya   | true      | PK003
```

---

## 🎊 FITUR SELANJUTNYA (Coming Soon):

- [ ] Auto-sync setiap 5 menit
- [ ] Sync data klien dari Google Sheets
- [ ] Notifikasi real-time saat ada perubahan
- [ ] Export data antrian ke Google Sheets

---

**KIANSANTANG - Kios Antrian Santun dan Tanggap**
*Sistem Layanan BAPAS Bandung Berbasis Digital*

© 2024 BAPAS Kelas I Bandung
