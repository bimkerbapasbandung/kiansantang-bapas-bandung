# 🔍 DEBUG GOOGLE SHEETS - STEP BY STEP

## ✅ LANGKAH DEBUG:

### **STEP 1: RESTART SERVER**

Server harus di-restart agar perubahan `.env` terbaca!

1. **Stop server** (Ctrl+C di terminal)
2. **Start lagi:**
   ```bash
   npm run dev
   ```

---

### **STEP 2: BUKA CONSOLE BROWSER**

1. **Buka aplikasi** (http://localhost:8081)
2. **Tekan F12** (buka Developer Tools)
3. **Klik tab "Console"**
4. **Clear console** (klik icon 🚫 atau ketik `clear()`)

---

### **STEP 3: KLIK SYNC**

1. **Buka halaman Operator**
2. **Klik tombol "Sync Google Sheets"**
3. **LIHAT CONSOLE LOG!**

---

## 📊 **EXPECTED CONSOLE OUTPUT:**

### **Jika BERHASIL:**
```javascript
=== STARTING GOOGLE SHEETS SYNC ===

=== FETCHING PK FROM GOOGLE SHEETS ===
Spreadsheet ID: 1P9P_kGuIPrZDm1rBTeG491FfdX2z7jawXW6C4N3dSr0
API Key: ✓ Set

Fetching from URL: https://sheets.googleapis.com/v4/spreadsheets/1P9P_kGuIPrZDm1rBTeG491FfdX2z7jawXW6C4N3dSr0/values/Master_PK!A2:D?key=AIzaSy...

Response status: 200

API Response data: {
  range: "Master_PK!A2:D26",
  majorDimension: "ROWS",
  values: [
    ["PK001", "Drs. Budiana, MP", "PK Madya", "Aktif"],
    ["PK002", "Iyus Yusuf, A.K.S.", "PK Madya", "Aktif"],
    ...
  ]
}

Rows fetched: 25
Raw data: [["PK001", "Drs. Budiana, MP", ...], ...]

Parsed PK data: [
  { id: "PK001", nama: "Drs. Budiana, MP", jabatan: "PK Madya", status: "Aktif", sheetId: "PK001" },
  ...
]

PK Sync Result: { success: true, count: 25, updated: 0, inserted: 25 }

=== SYNC COMPLETED ===
```

---

### **Jika GAGAL - Error 1: API Key Invalid**
```javascript
=== FETCHING PK FROM GOOGLE SHEETS ===
Spreadsheet ID: 1P9P_kGuIPrZDm1rBTeG491FfdX2z7jawXW6C4N3dSr0
API Key: ✓ Set

Fetching from URL: https://...

Response status: 400

API Error Response: {
  "error": {
    "code": 400,
    "message": "API key not valid. Please pass a valid API key.",
    "status": "INVALID_ARGUMENT"
  }
}

=== ERROR FETCHING SHEET DATA ===
```

**SOLUSI:** API Key salah, cek di Google Cloud Console!

---

### **Jika GAGAL - Error 2: Spreadsheet Not Found**
```javascript
Response status: 404

API Error Response: {
  "error": {
    "code": 404,
    "message": "Requested entity was not found.",
    "status": "NOT_FOUND"
  }
}
```

**SOLUSI:** Spreadsheet ID salah atau belum di-share!

---

### **Jika GAGAL - Error 3: Sheet Name Salah**
```javascript
Response status: 400

API Error Response: {
  "error": {
    "code": 400,
    "message": "Unable to parse range: Master_PK!A2:D",
    "status": "INVALID_ARGUMENT"
  }
}
```

**SOLUSI:** Sheet name bukan "Master_PK" (case sensitive!)

---

### **Jika GAGAL - Error 4: No Data**
```javascript
Response status: 200

API Response data: {
  range: "Master_PK!A2:D2",
  majorDimension: "ROWS"
  // values: undefined (tidak ada!)
}

Rows fetched: 0
Raw data: []
Parsed PK data: []
```

**SOLUSI:** Google Sheets kosong atau kolom ID tidak ada!

---

## 🔧 **COMMON FIXES:**

### **Fix 1: Restart Server**
```bash
# Stop server (Ctrl+C)
npm run dev
```

### **Fix 2: Clear Browser Cache**
```
Ctrl+Shift+R (hard reload)
```

### **Fix 3: Check .env**
```bash
# Pastikan ada:
VITE_GOOGLE_SPREADSHEET_ID=1P9P_kGuIPrZDm1rBTeG491FfdX2z7jawXW6C4N3dSr0
VITE_GOOGLE_API_KEY=AIzaSyBlhAbp9EZPnV9O5yh5tL_K9R8axVg5frU
```

### **Fix 4: Test API Manual**

Buka di browser:
```
https://sheets.googleapis.com/v4/spreadsheets/1P9P_kGuIPrZDm1rBTeG491FfdX2z7jawXW6C4N3dSr0/values/Master_PK!A2:D?key=AIzaSyBlhAbp9EZPnV9O5yh5tL_K9R8axVg5frU
```

Harusnya muncul JSON dengan data!

---

## 📋 **CHECKLIST GOOGLE SHEETS:**

- [ ] Sheet name = "Master_PK" (exact, case sensitive)
- [ ] Header di row 1: ID | Nama | Jabatan | Status
- [ ] Data mulai dari row 2
- [ ] Kolom A (ID): PK001, PK002, PK003, ... (bukan 1, 2, 3)
- [ ] Kolom D (Status): Aktif atau Tidak Aktif (tidak boleh kosong)
- [ ] Google Sheets sudah di-share: "Anyone with the link"

---

## 🎯 **ACTION ITEMS:**

1. ✅ **Perbaiki Google Sheets** (tambah kolom ID dengan format PK001, PK002, dst)
2. ✅ **Isi kolom Status** dengan "Aktif"
3. ✅ **Restart server** (npm run dev)
4. ✅ **Clear console** (F12 → Console → Clear)
5. ✅ **Klik Sync**
6. ✅ **Screenshot console log** dan kirim ke saya

---

**KIANSANTANG - Kios Antrian Santun dan Tanggap**
*Sistem Layanan BAPAS Bandung Berbasis Digital*

© 2024 BAPAS Kelas I Bandung
