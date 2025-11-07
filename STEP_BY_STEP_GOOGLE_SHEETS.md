# 🚀 STEP BY STEP - Google Sheets Integration

**Panduan Langkah demi Langkah untuk Setup Google Sheets**

---

## 📌 PERSIAPAN

### Yang Anda Butuhkan:
- ✅ Akun Google
- ✅ Browser (Chrome/Firefox)
- ✅ Akses ke project KIANSANTANG
- ✅ Koneksi internet

**Estimasi Waktu Total: 30-40 menit**

---

## 🎯 STEP 1: BUAT GOOGLE SHEETS (10 menit)

### **1.1 Buat Spreadsheet Baru**

1. Buka browser, kunjungi: https://sheets.google.com
2. Klik tombol **+ Blank** (sheet kosong)
3. Klik "Untitled spreadsheet" di pojok kiri atas
4. Rename menjadi: **"KIANSANTANG - Database PK dan Klien"**
5. Tekan Enter

✅ **Checkpoint:** Anda sekarang punya Google Sheets baru

---

### **1.2 Buat Sheet Master_PK**

1. Di bagian bawah, klik kanan pada tab "Sheet1"
2. Pilih **"Rename"**
3. Ketik: **Master_PK**
4. Tekan Enter

5. Sekarang buat header di row 1:
   - Cell A1: ketik **ID**
   - Cell B1: ketik **Nama**
   - Cell C1: ketik **Jabatan**
   - Cell D1: ketik **Status**
   - Cell E1: ketik **Email**
   - Cell F1: ketik **Telepon**
   - Cell G1: ketik **Sheet_ID**

6. Format header:
   - Select row 1 (klik angka 1)
   - Klik **Bold** (Ctrl+B)
   - Klik **Fill color** → Pilih warna hijau
   - Klik **Text color** → Pilih putih

7. Freeze header:
   - Klik menu **View** → **Freeze** → **1 row**

✅ **Checkpoint:** Header Master_PK sudah siap

---

### **1.3 Isi Data Contoh PK**

Copy paste data ini ke row 2-4:

**Row 2:**
```
PK001 | Ahmad Yani | PK Pratama | Aktif | ahmad@bapas.go.id | 081234567890 | Klien_PK001
```

**Row 3:**
```
PK002 | Siti Nurhaliza | PK Muda | Aktif | siti@bapas.go.id | 081234567891 | Klien_PK002
```

**Row 4:**
```
PK003 | Budi Santoso | PK Madya | Aktif | budi@bapas.go.id | 081234567892 | Klien_PK003
```

**Cara paste:**
1. Copy text di atas (satu row)
2. Klik cell A2
3. Paste (Ctrl+V)
4. Pilih **"Split text to columns"** jika muncul
5. Ulangi untuk row 3 dan 4

✅ **Checkpoint:** Data PK sudah terisi

---

### **1.4 Buat Sheet untuk Klien PK001**

1. Klik tombol **+** di pojok kiri bawah (untuk sheet baru)
2. Rename sheet baru menjadi: **Klien_PK001**

3. Buat header di row 1:
   - A1: **No**
   - B1: **Tanggal**
   - C1: **Nama_Klien**
   - D1: **NIK**
   - E1: **Alamat**
   - F1: **Telepon**
   - G1: **Jenis_Layanan**
   - H1: **Sub_Layanan**
   - I1: **Status**
   - J1: **Catatan**

4. Format header:
   - Select row 1
   - Bold (Ctrl+B)
   - Fill color: Biru
   - Text color: Putih
   - Freeze: View → Freeze → 1 row

5. Isi data contoh (row 2):
```
1 | 2024-11-06 | John Doe | 3201234567890123 | Jl. Merdeka No. 1 | 081234567890 | Penghadapan | Umum | Selesai | -
```

✅ **Checkpoint:** Sheet Klien_PK001 sudah siap

---

### **1.5 Duplikasi untuk PK002 dan PK003**

1. Klik kanan pada tab **Klien_PK001**
2. Pilih **"Duplicate"**
3. Rename menjadi: **Klien_PK002**
4. Hapus data di row 2 (biarkan header)

5. Ulangi untuk **Klien_PK003**

✅ **Checkpoint:** Semua sheet sudah dibuat (Master_PK, Klien_PK001, Klien_PK002, Klien_PK003)

---

### **1.6 Share Google Sheets**

1. Klik tombol **Share** di pojok kanan atas
2. Di bagian "General access", klik **"Restricted"**
3. Pilih **"Anyone with the link"**
4. Set permission: **Viewer**
5. Klik **Copy link**
6. Klik **Done**

✅ **Checkpoint:** Google Sheets sudah di-share

---

### **1.7 Simpan Spreadsheet ID**

Dari link yang di-copy tadi, formatnya seperti ini:
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit#gid=0
```

**Contoh:**
```
https://docs.google.com/spreadsheets/d/1abc123xyz456def789/edit#gid=0
```

**SPREADSHEET_ID adalah:** `1abc123xyz456def789`

📝 **SIMPAN ID INI!** Anda akan butuh nanti.

✅ **Checkpoint:** Spreadsheet ID sudah dicatat

---

## ☁️ STEP 2: SETUP GOOGLE CLOUD (15 menit)

### **2.1 Buat Google Cloud Project**

1. Buka: https://console.cloud.google.com/
2. Login dengan akun Google yang sama
3. Klik **Select a project** (pojok kiri atas)
4. Klik **NEW PROJECT**
5. Project name: **KIANSANTANG-Integration**
6. Klik **CREATE**
7. Tunggu beberapa detik sampai project dibuat
8. Pastikan project sudah terpilih (cek di pojok kiri atas)

✅ **Checkpoint:** Google Cloud Project sudah dibuat

---

### **2.2 Enable Google Sheets API**

1. Di sidebar kiri, klik **☰** (hamburger menu)
2. Pilih **APIs & Services** → **Library**
3. Di search box, ketik: **Google Sheets API**
4. Klik hasil pertama: **Google Sheets API**
5. Klik tombol **ENABLE**
6. Tunggu beberapa detik

✅ **Checkpoint:** Google Sheets API sudah enabled

---

### **2.3 Enable Google Drive API**

1. Klik **← Back to Library** (atau klik Library di sidebar)
2. Search: **Google Drive API**
3. Klik hasil pertama
4. Klik **ENABLE**
5. Tunggu beberapa detik

✅ **Checkpoint:** Google Drive API sudah enabled

---

### **2.4 Create API Key**

1. Di sidebar, klik **APIs & Services** → **Credentials**
2. Klik tombol **+ CREATE CREDENTIALS** (atas)
3. Pilih **API key**
4. API key akan muncul di popup
5. **COPY API KEY INI!** 📝
6. Klik **RESTRICT KEY** (jangan close popup dulu)

✅ **Checkpoint:** API Key sudah dibuat

---

### **2.5 Restrict API Key (PENTING!)**

Masih di popup API key:

1. **Name:** Ganti menjadi "KIANSANTANG API Key"

2. **Application restrictions:**
   - Pilih **HTTP referrers (web sites)**
   - Klik **ADD AN ITEM**
   - Ketik: `http://localhost:*`
   - Klik **ADD AN ITEM** lagi
   - Ketik: `https://yourdomain.com/*` (ganti dengan domain Anda nanti)

3. **API restrictions:**
   - Pilih **Restrict key**
   - Centang: **Google Sheets API**
   - Centang: **Google Drive API**

4. Klik **SAVE**

✅ **Checkpoint:** API Key sudah di-restrict

---

## 💻 STEP 3: SETUP PROJECT (10 menit)

### **3.1 Install Dependencies**

Buka terminal/command prompt di folder project:

```bash
# Install Google Sheets dependencies
npm install googleapis google-auth-library

# Atau jika menggunakan yarn
yarn add googleapis google-auth-library
```

Tunggu sampai selesai install.

✅ **Checkpoint:** Dependencies sudah terinstall

---

### **3.2 Setup Environment Variables**

1. Buka file `.env` di root project
   - Jika belum ada, buat file baru: `.env`

2. Tambahkan konfigurasi ini:

```bash
# Google Sheets Configuration
VITE_GOOGLE_SPREADSHEET_ID=paste_spreadsheet_id_anda_disini
VITE_GOOGLE_API_KEY=paste_api_key_anda_disini

# Auto Sync Settings
VITE_ENABLE_AUTO_SYNC=true
VITE_SYNC_INTERVAL_MINUTES=5
```

3. **Replace dengan data Anda:**
   - `VITE_GOOGLE_SPREADSHEET_ID`: Paste Spreadsheet ID dari Step 1.7
   - `VITE_GOOGLE_API_KEY`: Paste API Key dari Step 2.4

**Contoh:**
```bash
VITE_GOOGLE_SPREADSHEET_ID=1abc123xyz456def789
VITE_GOOGLE_API_KEY=AIzaSyABC123XYZ456...
VITE_ENABLE_AUTO_SYNC=true
VITE_SYNC_INTERVAL_MINUTES=5
```

4. **SAVE FILE!** (Ctrl+S)

✅ **Checkpoint:** Environment variables sudah dikonfigurasi

---

### **3.3 Run Database Migration**

#### **Opsi A: Menggunakan Supabase CLI**

```bash
supabase migration up
```

#### **Opsi B: Manual via Supabase Dashboard**

1. Buka: https://supabase.com/dashboard
2. Pilih project Anda
3. Klik **SQL Editor** di sidebar
4. Klik **+ New query**
5. Buka file: `supabase/migrations/20241106000000_add_google_sheets_fields.sql`
6. Copy semua isinya
7. Paste ke SQL Editor
8. Klik **RUN** (atau Ctrl+Enter)
9. Tunggu sampai selesai
10. Pastikan muncul "Success"

✅ **Checkpoint:** Database migration sudah dijalankan

---

### **3.4 Verify Files**

Pastikan file-file ini ada di project:

```
✅ src/lib/googleSheetsManager.ts
✅ src/hooks/useGoogleSheets.ts
✅ src/components/GoogleSheetsSync.tsx
✅ supabase/migrations/20241106000000_add_google_sheets_fields.sql
```

Jika ada yang belum, file sudah dibuat di session sebelumnya.

✅ **Checkpoint:** Semua file sudah ada

---

## 🧪 STEP 4: TESTING (5 menit)

### **4.1 Start Development Server**

```bash
npm run dev

# Atau
yarn dev
```

Tunggu sampai server running.

✅ **Checkpoint:** Server sudah running

---

### **4.2 Test di Browser**

1. Buka browser: http://localhost:5173 (atau port yang ditampilkan)
2. Login sebagai admin
3. Buka halaman admin/settings

---

### **4.3 Test Sync Component**

Tambahkan component di halaman admin untuk test:

**File:** `src/pages/Admin.tsx` (atau halaman admin Anda)

```typescript
import { GoogleSheetsSync } from '@/components/GoogleSheetsSync';

// Di dalam return component:
<div className="space-y-6">
  <GoogleSheetsSync />
  {/* Component lainnya */}
</div>
```

Save dan refresh browser.

✅ **Checkpoint:** Component muncul di halaman

---

### **4.4 Test Manual Sync**

1. Klik tombol **"Sync Now"**
2. Tunggu beberapa detik
3. Perhatikan:
   - Loading indicator muncul
   - Toast notification muncul
   - Status berubah

**Jika berhasil:**
- ✅ Toast: "Sinkronisasi berhasil!"
- ✅ Badge: "Synced" (hijau)
- ✅ Last sync time updated

**Jika gagal:**
- ❌ Toast: "Sinkronisasi gagal"
- ❌ Badge: "Error" (merah)
- Lanjut ke troubleshooting

✅ **Checkpoint:** Sync berhasil!

---

### **4.5 Verify Data di Supabase**

1. Buka Supabase Dashboard
2. Klik **Table Editor**
3. Pilih table **pk_officers**
4. Cek apakah data PK sudah masuk:
   - PK001 - Ahmad Yani
   - PK002 - Siti Nurhaliza
   - PK003 - Budi Santoso

✅ **Checkpoint:** Data sudah masuk ke database!

---

## 🎉 SELESAI!

### **Apa yang Sudah Anda Capai:**

✅ Google Sheets dibuat dengan struktur yang benar
✅ Master_PK sheet dengan data PK
✅ Sheet terpisah untuk klien setiap PK
✅ Google Cloud Project setup
✅ APIs enabled (Sheets & Drive)
✅ API Key created & restricted
✅ Environment variables configured
✅ Database migration run
✅ Sync component working
✅ Data berhasil sync ke Supabase

---

## 🔄 CARA MENGGUNAKAN

### **Menambah PK Baru:**

1. Buka Google Sheets
2. Go to sheet **Master_PK**
3. Tambah row baru:
   ```
   PK004 | Nama PK | Jabatan | Aktif | email@bapas.go.id | 08123456789 | Klien_PK004
   ```
4. Buat sheet baru: **Klien_PK004** (copy dari Klien_PK001)
5. Di app, klik **Sync Now**
6. Data PK baru akan masuk ke database

### **Menambah Klien:**

1. Buka Google Sheets
2. Go to sheet **Klien_PK001** (atau PK lain)
3. Tambah row baru dengan data klien
4. Di app, klik **Sync Now**
5. Data klien akan masuk ke database

### **Auto Sync:**

- Sistem akan auto sync setiap 5 menit
- Anda tidak perlu klik manual
- Bisa diubah di `.env` → `VITE_SYNC_INTERVAL_MINUTES`

---

## ⚠️ TROUBLESHOOTING

### **Error: "API key not valid"**

**Solusi:**
1. Cek `.env` → pastikan API key benar
2. Cek Google Cloud Console → API key masih aktif?
3. Cek restrictions → pastikan localhost sudah ditambahkan
4. Restart dev server (Ctrl+C, lalu `npm run dev` lagi)

### **Error: "The caller does not have permission"**

**Solusi:**
1. Cek Google Sheets → pastikan sudah di-share "Anyone with the link"
2. Cek permission: harus "Viewer" atau "Editor"
3. Refresh browser

### **Error: "Requested entity was not found"**

**Solusi:**
1. Cek `.env` → pastikan Spreadsheet ID benar
2. Cek nama sheet → harus exact: "Master_PK", "Klien_PK001", dst
3. Case-sensitive!

### **Data tidak muncul setelah sync:**

**Solusi:**
1. Buka browser console (F12)
2. Lihat error messages
3. Cek Supabase logs
4. Verify data di Google Sheets (format benar?)

### **Sync button tidak muncul:**

**Solusi:**
1. Cek import component sudah benar
2. Cek file `GoogleSheetsSync.tsx` ada
3. Restart dev server
4. Clear browser cache

---

## 📞 BUTUH BANTUAN?

Jika masih ada masalah:

1. **Check Console:**
   - Browser console (F12)
   - Terminal/command prompt
   - Supabase logs

2. **Verify Setup:**
   - Google Sheets structure
   - API key restrictions
   - Environment variables
   - Database migration

3. **Test Manual:**
   ```typescript
   // Di browser console
   const { getAllPK } = useGoogleSheets();
   const data = await getAllPK();
   console.log(data);
   ```

---

## 🎯 NEXT STEPS

Sekarang Anda bisa:

1. ✅ Tambah PK baru via Google Sheets
2. ✅ Tambah klien untuk setiap PK
3. ✅ Auto sync setiap 5 menit
4. ✅ Manual sync kapan saja
5. ✅ Monitor sync logs
6. ✅ View data di Supabase

**Selamat! Google Sheets Integration sudah berjalan!** 🎉

---

**KIANSANTANG - Kios Antrian Santun dan Tanggap**  
*Sistem Layanan BAPAS Bandung Berbasis Digital*

© 2024 BAPAS Kelas I Bandung
