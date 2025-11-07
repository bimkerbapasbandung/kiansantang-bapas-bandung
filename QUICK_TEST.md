# 🧪 QUICK TEST GUIDE - 5 MENIT

## ⚡ **RAPID TESTING - SEMUA FITUR**

### **TEST 1: HOME PAGE (30 detik)**

1. **Buka** http://localhost:8081
2. **Klik** "Bimbingan"
3. **Pilih** "Wajib Lapor"
4. **Cek** daftar PK muncul
5. **✅ PASS** jika ada PK

---

### **TEST 2: GOOGLE SHEETS SYNC (30 detik)**

1. **Buka** http://localhost:8081/operator
2. **Klik** "Sync Google Sheets"
3. **Lihat** toast notification
4. **Cek** console log (F12)
5. **✅ PASS** jika muncul "Sync berhasil! X PK"

---

### **TEST 3: DISPLAY PAGE (30 detik)**

1. **Buka** http://localhost:8081/display
2. **Cek** video autoplay
3. **Cek** clock update
4. **Cek** responsive (resize browser)
5. **✅ PASS** jika semua tampil

---

### **TEST 4: BIMBINGAN FORM (1 menit)**

1. **Buka** home → Bimbingan → Wajib Lapor
2. **Pilih** PK dari list
3. **Isi** form:
   - Nama: Test User
   - Alamat: Test Address
   - Status: Bekerja
   - Pekerjaan: Test Job
   - WhatsApp: 08123456789
4. **Submit**
5. **✅ PASS** jika queue generated

---

### **TEST 5: OPERATOR (1 menit)**

1. **Buka** http://localhost:8081/operator
2. **Klik** "Panggil Selanjutnya"
3. **Lihat** antrian muncul
4. **Klik** "Selesai"
5. **✅ PASS** jika antrian selesai

---

### **TEST 6: SEARCH & FILTER (30 detik)**

1. **Di Operator page**
2. **Ketik** di search box
3. **Pilih** filter layanan
4. **✅ PASS** jika filter works

---

### **TEST 7: RESPONSIVE (30 detik)**

1. **Resize browser** ke mobile size (375px)
2. **Cek** semua halaman:
   - Home
   - Display
   - Operator
   - Bimbingan
3. **✅ PASS** jika responsive

---

### **TEST 8: VIDEO (30 detik)**

1. **Buka** Display page
2. **Cek** video autoplay
3. **Cek** video controls
4. **✅ PASS** jika video plays

---

### **TEST 9: PRINT (30 detik)**

1. **Generate** queue
2. **Klik** "Cetak Tiket"
3. **Cek** print preview
4. **✅ PASS** jika print dialog muncul

---

### **TEST 10: ERROR HANDLING (30 detik)**

1. **Disconnect** internet
2. **Klik** Sync Google Sheets
3. **Cek** error message
4. **Reconnect** internet
5. **✅ PASS** jika error handled gracefully

---

## 📊 **HASIL TEST:**

```
✅ HOME PAGE:        [ ]
✅ GOOGLE SHEETS:    [ ]
✅ DISPLAY:          [ ]
✅ BIMBINGAN FORM:   [ ]
✅ OPERATOR:         [ ]
✅ SEARCH & FILTER:  [ ]
✅ RESPONSIVE:       [ ]
✅ VIDEO:            [ ]
✅ PRINT:            [ ]
✅ ERROR HANDLING:   [ ]

TOTAL: __/10 PASS
```

---

## 🐛 **JIKA ADA BUG:**

### **Bug Report Template:**

```
**Test:** [Nama Test]
**Expected:** [Apa yang seharusnya terjadi]
**Actual:** [Apa yang terjadi]
**Steps:** 
1. ...
2. ...
**Console Error:** [Copy paste error dari console]
**Screenshot:** [Attach screenshot]
```

---

## ✅ **QUICK FIX COMMANDS:**

### **Restart Server:**
```bash
# Stop (Ctrl+C)
npm run dev
```

### **Clear Cache:**
```
Ctrl+Shift+R (hard reload)
```

### **Check Console:**
```
F12 → Console tab
```

### **Check Network:**
```
F12 → Network tab
```

---

## 🎯 **CRITICAL TESTS (MUST PASS):**

1. ✅ **Google Sheets Sync** - Core feature
2. ✅ **PK List Load** - Core feature
3. ✅ **Queue Generation** - Core feature
4. ✅ **Display Page** - Core feature
5. ✅ **Operator Call** - Core feature

**Jika 5 test ini PASS → ✅ PRODUCTION READY!**

---

## 📸 **SCREENSHOT CHECKLIST:**

Ambil screenshot untuk dokumentasi:
- [ ] Home page
- [ ] Bimbingan form dengan PK list
- [ ] Display page dengan video
- [ ] Operator dashboard
- [ ] Queue ticket print
- [ ] Google Sheets sync success
- [ ] Mobile responsive view

---

## 🚀 **AFTER TESTING:**

### **If All Pass:**
1. ✅ Mark as PRODUCTION READY
2. ✅ Deploy to production
3. ✅ Notify stakeholders
4. ✅ Train users

### **If Some Fail:**
1. ❌ Document bugs
2. ❌ Fix critical bugs
3. ❌ Re-test
4. ❌ Repeat until all pass

---

**KIANSANTANG - Kios Antrian Santun dan Tanggap**
*Quick Test Guide - 5 Minutes to Production Ready!*

© 2024 BAPAS Kelas I Bandung
