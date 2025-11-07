# 🧪 Panduan Testing - Manajemen PK

## 📋 Prerequisites

Sebelum testing, pastikan:
- ✅ Aplikasi sudah running di `http://localhost:8080`
- ✅ Supabase sudah dikonfigurasi (file `.env`)
- ✅ Migration database sudah dijalankan
- ✅ Ada user dengan role admin

---

## 🔑 Setup Admin User

### Opsi 1: Via Supabase Dashboard (Recommended)

1. **Daftar User Baru**
   ```
   - Buka: http://localhost:8080/auth
   - Email: admin@bapas.go.id
   - Password: (pilih password yang kuat)
   - Klik "Sign Up"
   ```

2. **Tambahkan Role Admin**
   - Buka **Supabase Dashboard** → **SQL Editor**
   - Jalankan query:
   ```sql
   SELECT public.make_user_admin('admin@bapas.go.id');
   ```
   - Atau manual:
   ```sql
   -- Cek user_id
   SELECT id, email FROM auth.users WHERE email = 'admin@bapas.go.id';
   
   -- Insert admin role (ganti UUID dengan user_id dari query di atas)
   INSERT INTO public.user_roles (user_id, role) 
   VALUES ('paste-user-id-disini', 'admin');
   ```

3. **Verifikasi**
   ```sql
   SELECT u.email, ur.role 
   FROM auth.users u
   JOIN public.user_roles ur ON u.id = ur.user_id
   WHERE u.email = 'admin@bapas.go.id';
   ```
   Result harus menunjukkan: `admin@bapas.go.id | admin`

---

## 🧪 Flow Testing: Manajemen PK

### **STEP 1: Login sebagai Admin** 🔐

1. Buka browser: `http://localhost:8080`
2. Klik tombol **"Login"** di kanan atas
3. Atau langsung ke: `http://localhost:8080/auth`
4. Masukkan kredensial admin:
   - Email: `admin@bapas.go.id`
   - Password: (password yang Anda buat)
5. Klik **"Sign In"**
6. Akan redirect ke halaman utama

**✅ Verifikasi:** Tombol "Login" berubah jadi "Operator" dan "Logout"

---

### **STEP 2: Buka Settings** ⚙️

1. Dari halaman utama, klik tombol **"Operator"**
2. Atau dari menu navigasi, klik **"Settings"**
3. Atau langsung ke: `http://localhost:8080/settings`

**✅ Verifikasi:** Anda melihat halaman "Pengaturan Display"

---

### **STEP 3: Klik "Kelola PK"** 👥

1. Di halaman Settings, lihat ke kanan atas
2. Klik tombol **"Kelola PK"** (icon Users)
3. Akan redirect ke: `http://localhost:8080/pk-management`

**✅ Verifikasi:** 
- Melihat halaman "Manajemen Pembimbing Kemasyarakatan"
- Ada 3 kartu statistik (Total PK, Aktif, Tidak Aktif)
- Ada tabel dengan 8 PK sample data

---

### **STEP 4: Tambah PK Baru** ➕

1. Klik tombol **"Tambah PK"** di kanan atas
2. Dialog form akan muncul
3. Isi form:
   - **Nama Lengkap:** `Andi Wijaya, S.H.` (wajib)
   - **NIP:** `199607012020031001` (opsional, harus unique)
   - **Jabatan:** `Pembimbing Kemasyarakatan` (wajib)
   - **No. Telepon:** `08123456799`
   - **Email:** `andi.wijaya@bapas.go.id`
   - **Toggle Aktif:** ON (hijau)
4. Klik **"Simpan"**

**✅ Verifikasi:**
- Toast notification hijau: "PK baru berhasil ditambahkan"
- PK baru muncul di tabel
- Statistik "Total PK" bertambah 1

**❌ Test Error:**
- Coba tambah lagi dengan NIP yang sama
- Akan muncul error: "NIP sudah terdaftar"

---

### **STEP 5: Edit Data PK** ✏️

1. Pilih salah satu PK dari tabel
2. Klik icon **Pensil (Edit)** di kolom Aksi
3. Dialog form akan muncul dengan data yang sudah terisi
4. Ubah data, misalnya:
   - Ganti **No. Telepon** menjadi: `08129999999`
   - Ubah **Email** menjadi: `email.baru@bapas.go.id`
5. Klik **"Update"**

**✅ Verifikasi:**
- Toast notification: "Data PK berhasil diperbarui"
- Data di tabel berubah sesuai edit
- Dialog tertutup otomatis

---

### **STEP 6: Toggle Status Aktif/Tidak Aktif** 🔄

1. Lihat kolom **"Status"** di tabel
2. Pilih PK dengan status "Aktif" (badge hijau)
3. **Klik langsung pada badge status**
4. Status akan berubah:
   - Dari "Aktif" (hijau) → "Tidak Aktif" (merah)
   - Atau sebaliknya

**✅ Verifikasi:**
- Badge warna berubah instantly
- Toast notification: "PK berhasil dinonaktifkan" atau "diaktifkan"
- Statistik "Aktif" dan "Tidak Aktif" update

**🎯 Test Filter:**
- Toggle **"Tampilkan Aktif Saja"** ON
- PK yang tidak aktif akan hilang dari tabel
- Toggle OFF → semua PK muncul lagi

---

### **STEP 7: Gunakan Search untuk Cari PK** 🔍

**Test 1: Search by Nama**
1. Di search bar, ketik: `Ahmad`
2. Tabel auto-filter
3. Hanya PK dengan nama "Ahmad" yang muncul

**Test 2: Search by NIP**
1. Clear search bar
2. Ketik NIP: `199001012015031001`
3. Hanya 1 PK yang muncul (Ahmad Fauzi)

**Test 3: Search by Jabatan**
1. Clear search bar
2. Ketik: `Ahli Muda`
3. Hanya PK dengan jabatan "Ahli Muda" yang muncul

**Test 4: Kombinasi Search + Filter**
1. Ketik di search: `Ahli`
2. Toggle "Tampilkan Aktif Saja": ON
3. Hasil: Hanya PK aktif dengan jabatan "Ahli"

**✅ Verifikasi:**
- Filtering real-time (tidak perlu tekan Enter)
- Case-insensitive (huruf besar/kecil tidak masalah)
- Clear search → semua data kembali

---

### **STEP 8 (Bonus): Hapus PK** 🗑️

1. Pilih PK yang ingin dihapus
2. Klik icon **Trash (Hapus)** merah di kolom Aksi
3. Dialog konfirmasi muncul: "Yakin ingin menghapus data PK ini?"
4. Klik **OK**

**✅ Verifikasi:**
- Toast notification: "Data PK berhasil dihapus"
- PK hilang dari tabel
- Statistik "Total PK" berkurang 1

**⚠️ Warning:** PK yang dihapus tidak bisa dikembalikan!

---

## 🔗 Test Integrasi dengan Form Pendaftaran

Setelah kelola PK, test integrasi:

1. **Logout** dari admin
2. Buka halaman utama: `http://localhost:8080`
3. Pilih layanan (misal: **Penghadapan**)
4. Pilih sub layanan (misal: **Lapas**)
5. Isi **Nama Klien**
6. Klik dropdown **"Pilih Pembimbing Kemasyarakatan"**

**✅ Verifikasi:**
- Dropdown berisi semua PK yang **aktif** saja
- PK yang baru ditambah muncul di dropdown
- PK yang dinonaktifkan TIDAK muncul
- Data sortir by nama (A-Z)

7. Pilih salah satu PK
8. Klik **"Ambil Nomor Antrian"**
9. Tiket muncul dengan data PK yang dipilih

---

## 📊 Test Case Summary

| Test Case | Action | Expected Result | Status |
|-----------|--------|-----------------|--------|
| TC-001 | Login admin | Berhasil login, redirect ke home | ✅ |
| TC-002 | Akses Settings | Halaman settings terbuka | ✅ |
| TC-003 | Buka Kelola PK | Redirect ke /pk-management | ✅ |
| TC-004 | View statistik | 3 kartu stats dengan angka | ✅ |
| TC-005 | View tabel PK | 8 sample PK tampil | ✅ |
| TC-006 | Tambah PK valid | PK tersimpan, toast sukses | ✅ |
| TC-007 | Tambah NIP duplikat | Error "NIP sudah terdaftar" | ✅ |
| TC-008 | Edit PK | Data update, toast sukses | ✅ |
| TC-009 | Toggle status | Status berubah, stats update | ✅ |
| TC-010 | Search by nama | Filter real-time bekerja | ✅ |
| TC-011 | Search by NIP | Filter real-time bekerja | ✅ |
| TC-012 | Search by jabatan | Filter real-time bekerja | ✅ |
| TC-013 | Filter aktif only | Hanya PK aktif tampil | ✅ |
| TC-014 | Hapus PK | PK terhapus, toast sukses | ✅ |
| TC-015 | Integrasi dropdown | PK aktif muncul di form | ✅ |

---

## 🐛 Troubleshooting

### Problem 1: Tidak bisa akses /pk-management
**Solusi:**
- Pastikan sudah login sebagai admin
- Cek role di database:
  ```sql
  SELECT * FROM public.user_roles WHERE user_id = auth.uid();
  ```
- Jika belum ada, jalankan:
  ```sql
  SELECT public.make_user_admin('email@anda.com');
  ```

### Problem 2: Tabel kosong / PK tidak muncul
**Solusi:**
- Pastikan migration sudah dijalankan
- Cek data di database:
  ```sql
  SELECT * FROM public.pk_officers;
  ```
- Jika kosong, jalankan ulang migration file

### Problem 3: Search tidak bekerja
**Solusi:**
- Clear search bar dan coba lagi
- Pastikan ada PK yang match dengan keyword
- Refresh halaman

### Problem 4: Dropdown form kosong
**Solusi:**
- Pastikan ada PK dengan status `is_active = true`
- Cek di halaman management, toggle status jadi aktif
- Refresh halaman form

### Problem 5: Error saat tambah/edit
**Solusi:**
- Cek console browser (F12) untuk error detail
- Pastikan field wajib terisi (nama, jabatan)
- NIP harus unique atau dikosongkan
- Email harus format valid

---

## 📸 Screenshot Checklist

Saat testing, ambil screenshot untuk dokumentasi:

- [ ] Login page
- [ ] Settings page dengan tombol "Kelola PK"
- [ ] PK Management dashboard
- [ ] Dialog tambah PK (form kosong)
- [ ] Dialog tambah PK (form terisi)
- [ ] Toast notification sukses
- [ ] Tabel dengan PK baru
- [ ] Dialog edit PK
- [ ] Status toggle (aktif → tidak aktif)
- [ ] Search result
- [ ] Filter "Aktif saja"
- [ ] Dropdown PK di form pendaftaran
- [ ] Tiket dengan data PK

---

## ✅ Test Completion Checklist

- [ ] Admin user sudah dibuat
- [ ] Bisa login sebagai admin
- [ ] Akses halaman PK Management
- [ ] Lihat statistik dashboard
- [ ] Tambah PK baru berhasil
- [ ] Test NIP duplikat (harus error)
- [ ] Edit data PK berhasil
- [ ] Toggle status aktif/tidak aktif berhasil
- [ ] Search by nama bekerja
- [ ] Search by NIP bekerja
- [ ] Search by jabatan bekerja
- [ ] Filter "Tampilkan Aktif Saja" bekerja
- [ ] Hapus PK berhasil
- [ ] PK muncul di dropdown form pendaftaran
- [ ] Hanya PK aktif yang muncul di dropdown
- [ ] Bisa buat tiket dengan PK dari database

---

## 🎯 Next Steps

Setelah testing berhasil:

1. **Production Deployment**
   - Setup Supabase production database
   - Run migrations di production
   - Setup admin user di production

2. **User Training**
   - Latih admin cara kelola PK
   - Dokumentasikan SOP

3. **Monitoring**
   - Monitor error logs
   - Track usage statistics
   - Backup database reguler

---

**Happy Testing!** 🚀

Jika menemukan bug atau ada pertanyaan, catat di issue tracker atau hubungi developer.
