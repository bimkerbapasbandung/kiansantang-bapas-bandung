# 🚀 DEPLOY SUPER MUDAH - 3 LANGKAH!

## ⚡ **CARA TERMUDAH - IKUTI INI!**

---

## 📋 **STEP 1: BUILD**

Buka **Command Prompt** (bukan PowerShell!):

```
Tekan: Windows + R
Ketik: cmd
Enter
```

Lalu jalankan:

```bash
cd C:\Users\bimke\antrianlayananbapasbandung-6cb26656
npm run build
```

**Tunggu sampai selesai** (30 detik - 1 menit)

**Expected output:**
```
✓ built in 15s
dist/index.html
dist/assets/...
```

✅ **Jika muncul "dist" folder → BERHASIL!**

---

## 📤 **STEP 2: UPLOAD KE NETLIFY**

### **2.1. Buka Netlify:**

**Link:** https://app.netlify.com/drop

### **2.2. Sign Up (GRATIS!):**

Pilih salah satu:
- 📧 Sign up with Email
- 🐙 Sign up with GitHub
- 🔵 Sign up with Google

**Tidak perlu kartu kredit!**

### **2.3. Upload:**

1. **Buka folder project** di File Explorer:
   ```
   C:\Users\bimke\antrianlayananbapasbandung-6cb26656
   ```

2. **Cari folder `dist`** (hasil build tadi)

3. **Drag folder `dist`** ke browser (area upload Netlify)

4. **Tunggu upload** (1-2 menit)

5. **DONE!** Website online! 🎉

**URL:** `https://random-name-12345.netlify.app`

---

## ⚙️ **STEP 3: SETUP ENVIRONMENT**

**PENTING:** Agar aplikasi bisa connect ke database!

### **3.1. Buka Site Settings:**

Setelah upload, klik nama site → **Site settings**

### **3.2. Add Environment Variables:**

Klik **Environment variables** (sidebar kiri)

### **3.3. Copy Paste Ini Satu Per Satu:**

**Variable 1:**
```
Key: VITE_SUPABASE_URL
Value: https://kumtbqyeyzvejwxsuier.supabase.co
```

**Variable 2:**
```
Key: VITE_SUPABASE_PUBLISHABLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1bXRicXlleXp2ZWp3eHN1aWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzU0NTQsImV4cCI6MjA3Nzc1MTQ1NH0.iN6AOQNP3_5hpks0W8pfpsg1I-5_vNfMFKD4x5mDRQM
```

**Variable 3:**
```
Key: VITE_GOOGLE_SPREADSHEET_ID
Value: 1P9P_kGuIPrZDm1rBTeG491FfdX2z7jawXW6C4N3dSr0
```

**Variable 4:**
```
Key: VITE_GOOGLE_API_KEY
Value: AIzaSyBlhAbp9EZPnV9O5yh5tL_K9R8axVg5frU
```

**Variable 5:**
```
Key: VITE_ENABLE_AUTO_SYNC
Value: true
```

**Variable 6:**
```
Key: VITE_SYNC_INTERVAL_MINUTES
Value: 5
```

### **3.4. Redeploy:**

1. Klik **"Deploys"** tab (atas)
2. Klik **"Trigger deploy"**
3. Klik **"Deploy site"**
4. Tunggu 2-3 menit
5. **DONE!** ✅

---

## 🎉 **SELESAI!**

Website Anda sudah online!

**URL:** Lihat di dashboard Netlify

**Test:**
1. Buka URL website
2. Coba pilih layanan
3. Coba generate antrian
4. Coba buka `/display`
5. Coba buka `/operator`

**Jika semua OK → SUKSES!** 🎊

---

## 🌐 **BONUS: GANTI NAMA DOMAIN**

Domain default: `random-name-12345.netlify.app`

**Cara ganti:**

1. **Site settings** → **Domain management**
2. **Options** → **Edit site name**
3. Ketik nama baru (contoh: `kiansantang-bapas`)
4. **Save**

**Domain baru:** `https://kiansantang-bapas.netlify.app`

---

## 📸 **VISUAL GUIDE:**

### **Netlify Drop Page:**
```
┌────────────────────────────────────┐
│                                    │
│   Drop your site folder here       │
│                                    │
│   ┌──────────────────────────┐    │
│   │                          │    │
│   │   [Drag & Drop Area]     │    │
│   │                          │    │
│   │   Or browse to upload    │    │
│   │                          │    │
│   └──────────────────────────┘    │
│                                    │
└────────────────────────────────────┘
```

### **After Upload:**
```
✅ Your site is live!

https://random-name-12345.netlify.app

[Change site name]  [Site settings]
```

### **Environment Variables:**
```
Site settings > Environment variables

┌─────────────────────────────────┐
│ Key: VITE_SUPABASE_URL          │
│ Value: https://...              │
│ Scopes: ☑ All scopes           │
│                                 │
│ [Save]                          │
└─────────────────────────────────┘
```

---

## 🚨 **TROUBLESHOOTING:**

### **Problem 1: Build gagal**

**Solution:**
```bash
# Buka Command Prompt (cmd)
cd C:\Users\bimke\antrianlayananbapasbandung-6cb26656
rmdir /s /q node_modules
rmdir /s /q dist
npm install
npm run build
```

### **Problem 2: Folder dist tidak ada**

**Solution:**
- Build belum selesai, tunggu sampai selesai
- Check ada error di terminal
- Coba build lagi

### **Problem 3: Website blank setelah deploy**

**Solution:**
- Check environment variables sudah ditambahkan semua
- Trigger deploy ulang
- Check console browser (F12) untuk error

### **Problem 4: Fitur tidak jalan**

**Solution:**
- Pastikan semua 6 environment variables sudah ditambahkan
- Pastikan value-nya benar (tidak ada spasi extra)
- Redeploy site

---

## ✅ **CHECKLIST:**

**Pre-Deploy:**
- [ ] Buka Command Prompt (cmd)
- [ ] `cd` ke folder project
- [ ] `npm run build` berhasil
- [ ] Folder `dist` ada

**Deploy:**
- [ ] Sign up Netlify (gratis)
- [ ] Upload folder `dist`
- [ ] Website online (dapat URL)

**Setup:**
- [ ] Add 6 environment variables
- [ ] Trigger deploy ulang
- [ ] Test website

**Done:**
- [ ] Semua fitur jalan
- [ ] Share URL dengan tim
- [ ] Celebrate! 🎉

---

## 💰 **BIAYA:**

```
Netlify:        Rp 0
Domain:         Rp 0 (.netlify.app)
Supabase:       Rp 0
Google Sheets:  Rp 0
HTTPS:          Rp 0
─────────────────────
TOTAL:          Rp 0 ✅

100% GRATIS SELAMANYA!
```

---

## 📞 **BUTUH BANTUAN?**

**Jika ada masalah:**

1. Screenshot error
2. Copy paste error message
3. Kirim ke saya

**Atau:**
- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://answers.netlify.com

---

## 🎯 **RINGKASAN:**

```
1. Build:    cmd /c npm run build
2. Upload:   Drag 'dist' ke netlify.com/drop
3. Setup:    Add 6 environment variables
4. Done:     Website online! 🎉
```

**Total waktu: 10 menit!**

---

**KIANSANTANG - Kios Antrian Santun dan Tanggap**
*Deploy Guide - Super Mudah!*

© 2024 BAPAS Kelas I Bandung

---

## 🚀 **MULAI SEKARANG:**

1. **Buka Command Prompt**
2. **Copy paste:**
   ```bash
   cd C:\Users\bimke\antrianlayananbapasbandung-6cb26656
   npm run build
   ```
3. **Tunggu selesai**
4. **Lanjut ke STEP 2!**

**Good luck!** 🍀
