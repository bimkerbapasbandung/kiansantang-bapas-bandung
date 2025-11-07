# 🔧 Troubleshooting: Gagal Menyimpan Data Klien Bimbingan

## 🎯 Masalah: "Gagal menyimpan data klien"

---

## ✅ SOLUSI LENGKAP (Step by Step)

### **STEP 1: Cek Apakah Tabel Sudah Dibuat**

1. **Buka Supabase Table Editor** (sudah terbuka)
2. **Cari tabel:** `bimbingan_clients`
3. **Jika TIDAK ADA** → Lanjut ke STEP 2
4. **Jika ADA** → Lanjut ke STEP 3

---

### **STEP 2: Buat Tabel (Jika Belum Ada)**

**File SQL sudah terbuka di Notepad!**

1. **Copy semua** dari `CREATE_BIMBINGAN_TABLE_SIMPLE.sql`
2. **Buka Supabase** → SQL Editor
3. **Paste & Run**
4. **Tunggu "Success"**
5. **Verify:** Cek Table Editor, tabel `bimbingan_clients` harus muncul

---

### **STEP 3: Cek Browser Console**

Browser sudah terbuka! Sekarang:

1. **Tekan F12** (buka Developer Tools)
2. **Klik tab "Console"**
3. **Test form bimbingan:**
   - Klik "Bimbingan"
   - Pilih sub menu
   - Isi form
   - Submit
4. **Lihat console:**
   - Akan muncul log detail
   - Cari "=== DATABASE ERROR ===" atau "=== EXCEPTION ERROR ==="
   - Baca error message

---

## 🔍 Error Messages & Solutions

### **Error 1: "relation bimbingan_clients does not exist"**

**Artinya:** Tabel belum dibuat

**Solusi:**
```sql
-- Run di Supabase SQL Editor
-- File: CREATE_BIMBINGAN_TABLE_SIMPLE.sql
```

### **Error 2: "column does not exist"**

**Artinya:** Ada field yang tidak match dengan tabel

**Solusi:**
```sql
-- Cek struktur tabel
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bimbingan_clients';

-- Atau drop & recreate table
DROP TABLE public.bimbingan_clients CASCADE;
-- Lalu run CREATE_BIMBINGAN_TABLE_SIMPLE.sql lagi
```

### **Error 3: "permission denied"**

**Artinya:** RLS policy belum diset

**Solusi:**
```sql
-- Disable RLS sementara (untuk testing)
ALTER TABLE public.bimbingan_clients DISABLE ROW LEVEL SECURITY;

-- Atau buat policy baru
CREATE POLICY "Allow all operations"
ON public.bimbingan_clients
FOR ALL
USING (true)
WITH CHECK (true);
```

### **Error 4: "invalid input syntax"**

**Artinya:** Format data tidak sesuai

**Solusi:**
- Cek console log "Insert data:"
- Pastikan semua field sesuai tipe data
- Cek pk_officer_id (harus string, bukan UUID)

---

## 🧪 Test Manual di Supabase

### **Test 1: Insert Manual**

```sql
-- Test insert langsung di SQL Editor
INSERT INTO public.bimbingan_clients (
  queue_id, pk_officer_id, pk_officer_name, pk_officer_position,
  sub_service, nama_lengkap, alamat_domisili, status_pekerjaan, 
  jenis_pekerjaan, whatsapp_number
) VALUES (
  'TEST-001',
  'test-pk-id',
  'Test PK',
  'Pembimbing Kemasyarakatan',
  'wajib_lapor',
  'Test Klien',
  'Jl. Test No. 123',
  'bekerja',
  'Karyawan',
  '628123456789'
);

-- Verify
SELECT * FROM public.bimbingan_clients WHERE queue_id = 'TEST-001';
```

**Jika berhasil:** Masalah di aplikasi
**Jika gagal:** Masalah di database

---

## 📊 Cek Data di Database

### **Query 1: Cek Tabel Exists**

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'bimbingan_clients'
);
```

### **Query 2: Cek Struktur Tabel**

```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'bimbingan_clients'
ORDER BY ordinal_position;
```

### **Query 3: Cek RLS Status**

```sql
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'bimbingan_clients';
```

### **Query 4: Cek Policies**

```sql
SELECT * 
FROM pg_policies 
WHERE tablename = 'bimbingan_clients';
```

---

## 🔄 Fresh Start (Nuclear Option)

Jika semua gagal, reset total:

```sql
-- 1. Drop table
DROP TABLE IF EXISTS public.bimbingan_clients CASCADE;

-- 2. Run CREATE_BIMBINGAN_TABLE_SIMPLE.sql
-- (Copy paste dari file)

-- 3. Verify
SELECT COUNT(*) FROM public.bimbingan_clients;
-- Harus return 2 (sample data)

-- 4. Test di aplikasi
```

---

## 🎯 Checklist Debugging

```
[ ] Tabel bimbingan_clients sudah dibuat
[ ] Struktur tabel sesuai (cek column_name)
[ ] RLS enabled dengan policy "Allow all"
[ ] Sample data berhasil diinsert (2 rows)
[ ] Browser console terbuka (F12)
[ ] Test form bimbingan
[ ] Lihat console log detail
[ ] Identifikasi error spesifik
[ ] Apply solusi sesuai error
[ ] Test lagi
[ ] ✅ Berhasil!
```

---

## 💡 Tips Debugging

### **1. Selalu Cek Console**
- F12 → Console tab
- Lihat log "=== BIMBINGAN SUBMIT START ==="
- Lihat "Insert data:" untuk cek format
- Lihat error detail

### **2. Test Step by Step**
1. Test insert manual di SQL Editor
2. Test dengan sample data
3. Test dari aplikasi

### **3. Verify Database**
- Cek tabel exists
- Cek struktur kolom
- Cek RLS policies
- Cek sample data

---

## 📞 Error Messages Lengkap

Sekarang aplikasi akan menampilkan error detail:

### **Di Toast Notification:**
```
❌ Tabel bimbingan_clients belum dibuat
❌ Gagal menyimpan data: [error message]
❌ Terjadi kesalahan: [error message]
```

### **Di Console:**
```
=== BIMBINGAN SUBMIT START ===
Data: { ... }
Queue created: { ... }
Insert data: { ... }

=== DATABASE ERROR ===
Error code: ...
Error message: ...
Error details: ...
Error hint: ...
```

---

## 🚀 Quick Fix (Most Common)

**90% masalah karena tabel belum dibuat!**

**Solusi Cepat:**

1. **Copy SQL** dari `CREATE_BIMBINGAN_TABLE_SIMPLE.sql`
2. **Paste di Supabase SQL Editor**
3. **Run**
4. **Test lagi**
5. **Done!** ✅

---

## 📖 Files Reference

- `CREATE_BIMBINGAN_TABLE_SIMPLE.sql` - SQL untuk create table
- `TROUBLESHOOT_BIMBINGAN.md` - File ini
- `FITUR_BIMBINGAN_LENGKAP.md` - Dokumentasi fitur

---

## ✅ Success Indicators

Jika berhasil, Anda akan lihat:

1. **Toast hijau:** "Pendaftaran bimbingan berhasil!"
2. **Console log:** "=== INSERT SUCCESS ==="
3. **Ticket muncul** dengan nomor antrian
4. **Data tersimpan** di database (cek Table Editor)

---

**Ikuti step by step, pasti berhasil!** 🚀
