# 📖 Panduan Cek Data PK di Supabase

## Cara 1: Via Table Editor (Paling Mudah!)

### Di Supabase Dashboard:

1. **Login** ke Supabase
2. **Pilih Project** Anda (klik nama project)
3. Di **Sidebar Kiri**, cari menu:
   ```
   📊 Table Editor
   ```
   (Biasanya di bagian atas, icon seperti tabel)

4. **Klik "Table Editor"**

5. Di halaman Table Editor, cari tabel:
   ```
   pk_officers
   ```
   Di list tabel sebelah kiri.

6. **Klik tabel "pk_officers"**

7. **Lihat jumlah rows** di bagian atas:
   ```
   Rows: ?? / ??
   ```
   Ini adalah jumlah total data PK!

---

## Cara 2: Via SQL Editor

### Di Supabase Dashboard:

1. **Login** ke Supabase
2. **Pilih Project** Anda
3. Di **Sidebar Kiri**, cari:
   ```
   🔍 SQL Editor
   ```
   (Icon seperti kode/query)

4. **Klik "SQL Editor"**

5. Akan ada button **"+ New query"** di kanan atas, klik itu

6. **Paste query ini:**
   ```sql
   SELECT COUNT(*) as total_pk FROM public.pk_officers;
   ```

7. **Klik "RUN"** (tombol hijau)

8. **Lihat hasil** di bawah

---

## 🎯 Lokasi Menu di Sidebar:

Menu Supabase Dashboard (dari atas ke bawah):

```
🏠 Home
📊 Table Editor          ← CEK DI SINI (CARA 1)
🔍 Authentication
📁 Storage
🔍 SQL Editor           ← ATAU DI SINI (CARA 2)
📊 Database
⚙️ Settings
```

---

## ✅ Yang Harus Dicari:

### Jika pakai Table Editor:
- Tabel: `pk_officers`
- Lihat: Jumlah rows di atas

### Jika pakai SQL Editor:
- Run query: `SELECT COUNT(*) FROM pk_officers;`
- Lihat: Angka hasil

---

## 💡 Tips:

- **Table Editor** lebih mudah = Tinggal klik dan lihat
- **SQL Editor** lebih detail = Bisa jalankan query custom

Pilih yang paling mudah untuk Anda!
