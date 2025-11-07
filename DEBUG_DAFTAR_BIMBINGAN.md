# 🔧 Debug: Gagal Klik Daftar Bimbingan

## 🎯 Cara Debug:

### **STEP 1: Buka Console**
```
1. Tekan F12
2. Klik tab "Console"
3. Clear console (icon 🚫)
```

### **STEP 2: Test Form**
```
1. Klik "Bimbingan"
2. Pilih sub menu
3. Pilih PK
4. Isi semua field
5. Klik "Daftar Bimbingan"
6. LIHAT CONSOLE!
```

### **STEP 3: Lihat Log**

**Jika validasi gagal:**
```
=== FORM SUBMIT START ===
Selected PK: { id: "...", name: "..." }
Form data: { namaLengkap: "", ... }
❌ Toast: "Isi nama lengkap klien"
```

**Jika validasi berhasil:**
```
=== FORM SUBMIT START ===
Selected PK: { ... }
Form data: { ... }
✅ Validation passed
Submitting data: { ... }

=== BIMBINGAN SUBMIT START ===
(di Index.tsx)
```

**Jika ada error:**
```
=== FORM SUBMIT ERROR ===
Error: [error message]
```

---

## 🔍 Kemungkinan Error:

### **Error 1: Field Kosong**
```
❌ Pilih Pembimbing Kemasyarakatan terlebih dahulu
❌ Isi nama lengkap klien
❌ Isi alamat domisili
❌ Pilih status pekerjaan
❌ Isi jenis pekerjaan
❌ Isi nomor WhatsApp
❌ Nomor WhatsApp minimal 10 digit
```

**Solusi:** Isi semua field yang required

### **Error 2: PK Tidak Terpilih**
```
Selected PK: null
```

**Solusi:** Klik card PK untuk memilih

### **Error 3: Submit Handler Error**
```
=== BIMBINGAN SUBMIT START ===
=== DATABASE ERROR ===
```

**Solusi:** Cek error di Index.tsx (sudah ada log detail)

---

## ✅ Checklist Form:

```
[ ] PK sudah dipilih (card PK highlight biru)
[ ] Nama lengkap terisi
[ ] Alamat terisi
[ ] Status pekerjaan dipilih (card highlight)
[ ] Jenis pekerjaan terisi (jika bekerja)
[ ] WhatsApp terisi (minimal 10 digit)
[ ] Klik "Daftar Bimbingan"
[ ] Lihat console log
```

---

## 🎯 Test Step by Step:

### **1. Pilih PK**
- Klik card PK
- Card harus highlight biru
- Console: "Silakan isi data klien"

### **2. Isi Nama**
- Ketik nama lengkap
- Minimal 1 karakter

### **3. Isi Alamat**
- Ketik alamat lengkap
- Minimal 1 karakter

### **4. Pilih Status Pekerjaan**
- Klik "Bekerja" atau "Tidak Bekerja"
- Card harus highlight

### **5. Isi Jenis Pekerjaan (Jika Bekerja)**
- Ketik jenis pekerjaan
- Field muncul jika pilih "Bekerja"

### **6. Isi WhatsApp**
- Ketik nomor (08xxx atau 628xxx)
- Minimal 10 digit

### **7. Submit**
- Klik "Daftar Bimbingan"
- Lihat console log
- Lihat toast notification

---

## 💡 Tips:

- **Selalu buka Console** (F12) saat test
- **Clear console** sebelum test baru
- **Screenshot error** jika ada
- **Copy console log** untuk debug

---

## 📊 Console Log yang Benar:

```javascript
=== FORM SUBMIT START ===
Selected PK: {
  id: "abc-123",
  name: "Ahmad Fauzi",
  position: "PK Lapas"
}
Form data: {
  namaLengkap: "Budi Santoso",
  alamatDomisili: "Jl. Merdeka",
  statusPekerjaan: "bekerja",
  jenisPekerjaan: "Karyawan",
  noWhatsapp: "08123456789"
}
✅ Validation passed
Submitting data: {
  subService: "wajib_lapor",
  pkOfficerId: "abc-123",
  pkOfficerName: "Ahmad Fauzi",
  pkOfficerPosition: "PK Lapas",
  namaLengkap: "Budi Santoso",
  alamatDomisili: "Jl. Merdeka",
  statusPekerjaan: "bekerja",
  jenisPekerjaan: "Karyawan",
  noWhatsapp: "628123456789"
}

=== BIMBINGAN SUBMIT START ===
Data: { ... }
Queue created: { ... }
Insert data: { ... }
=== INSERT SUCCESS ===
```

---

**Buka Console (F12) dan test sekarang!** 🔍
