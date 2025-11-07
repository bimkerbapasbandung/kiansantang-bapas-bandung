# 🚀 SETUP GOOGLE SHEETS - CARA SUPER MUDAH!

## ✅ YANG SUDAH SELESAI:

- ✅ Google Sheets dibuat (ID: 1P9P_kGuIPrZDm1rBTeG491FfdX2z7jawXW6C4N3dSr0)
- ✅ File .env sudah diupdate
- ✅ File SQL migration sudah dibuat

---

## 📋 TINGGAL 3 LANGKAH!

### **LANGKAH 1: ISI API KEY (30 detik)**

1. Buka file `.env` di VS Code
2. Di baris 7, ganti `GANTI_DENGAN_API_KEY_ANDA_DISINI` dengan API Key Anda
3. Save (Ctrl+S)

**Contoh:**
```bash
VITE_GOOGLE_API_KEY=AIzaSyABC123XYZ456...
```

---

### **LANGKAH 2: RUN SQL MIGRATION (1 menit)**

1. **Buka:** https://supabase.com/dashboard
2. **Login** dan pilih project KIANSANTANG
3. **Klik:** SQL Editor (sidebar kiri)
4. **Klik:** + New query
5. **Buka file:** `GOOGLE_SHEETS_MIGRATION_SIMPLE.sql` (di VS Code)
6. **Copy semua isinya** (Ctrl+A, Ctrl+C)
7. **Paste** di SQL Editor Supabase (Ctrl+V)
8. **Klik:** RUN (atau Ctrl+Enter)
9. **Tunggu** sampai muncul "Success"

✅ Done!

---

### **LANGKAH 3: TEST RUN (1 menit)**

1. **Di VS Code terminal**, ketik:
```bash
npm run dev
```

2. **Tunggu** sampai muncul:
```
Local: http://localhost:5173/
```

3. **Buka browser:** http://localhost:5173

4. **Login** sebagai admin

5. **Test sync** (jika ada tombol sync)

✅ Done!

---

## 🎉 SELESAI!

**Jika ada error, screenshot dan kirim ke saya!**

---

## 📝 CATATAN PENTING:

### **API Key Anda:**
- Simpan di Notepad
- Jangan share ke orang lain
- Jangan commit ke Git

### **Spreadsheet ID:**
```
1P9P_kGuIPrZDm1rBTeG491FfdX2z7jawXW6C4N3dSr0
```

### **Link Google Sheets:**
```
https://docs.google.com/spreadsheets/d/1P9P_kGuIPrZDm1rBTeG491FfdX2z7jawXW6C4N3dSr0/edit
```

---

## 🆘 TROUBLESHOOTING:

### **Error: API Key invalid**
- Cek API Key di .env (tidak ada spasi, tidak ada quotes)
- Pastikan API Key sudah di-restrict di Google Cloud

### **Error: Cannot read spreadsheet**
- Pastikan Google Sheets sudah di-share (Anyone with link)
- Cek Spreadsheet ID di .env

### **Error: Migration failed**
- Cek apakah table sudah ada
- Coba run migration lagi

---

**KIANSANTANG - Kios Antrian Santun dan Tanggap**
