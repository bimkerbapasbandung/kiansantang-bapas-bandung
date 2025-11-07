# 📊 TEMPLATE GOOGLE SHEETS - UPDATED STRUCTURE

**Struktur Baru: Data PK Sederhana + Data Klien Lengkap**

---

## 📋 SHEET 1: Master_PK

**Kolom yang dibutuhkan (4 kolom saja):**

| A | B | C | D |
|---|---|---|---|
| **ID** | **Nama** | **Jabatan** | **Status** |

### **Contoh Data:**

```
┌─────────┬──────────────────────────┬─────────────┬────────┐
│   ID    │          Nama            │   Jabatan   │ Status │
├─────────┼──────────────────────────┼─────────────┼────────┤
│ PK001   │ Drs. Ahmad Wijaya, M.Si  │ PK Pratama  │ Aktif  │
│ PK002   │ Sri Lestari, S.Sos       │ PK Muda     │ Aktif  │
│ PK003   │ Budi Santoso, S.H.       │ PK Madya    │ Aktif  │
└─────────┴──────────────────────────┴─────────────┴────────┘
```

### **Cara Setup:**

1. **Buat header di row 1:**
   - A1: `ID`
   - B1: `Nama`
   - C1: `Jabatan`
   - D1: `Status`

2. **Format header:**
   - Bold (Ctrl+B)
   - Background: Hijau (#34A853)
   - Text: Putih
   - Freeze: View → Freeze → 1 row

3. **Isi data (copy paste per row):**

**Row 2:**
```
PK001	Drs. Ahmad Wijaya, M.Si	PK Pratama	Aktif
```

**Row 3:**
```
PK002	Sri Lestari, S.Sos	PK Muda	Aktif
```

**Row 4:**
```
PK003	Budi Santoso, S.H.	PK Madya	Aktif
```

---

## 📋 SHEET 2-4: Klien_PK001, Klien_PK002, Klien_PK003

**Kolom yang dibutuhkan (9 kolom):**

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| **No** | **Tanggal** | **Nama_Klien** | **Kontak** | **Alamat** | **Status_Bekerja** | **Jenis_Pekerjaan** | **Status_Wajib_Lapor** | **Catatan** |

### **Contoh Data:**

```
┌────┬────────────┬──────────────┬──────────────┬─────────────────┬────────────────┬──────────────────┬────────────────────┬──────────┐
│ No │  Tanggal   │ Nama_Klien   │    Kontak    │     Alamat      │ Status_Bekerja │ Jenis_Pekerjaan  │ Status_Wajib_Lapor │ Catatan  │
├────┼────────────┼──────────────┼──────────────┼─────────────────┼────────────────┼──────────────────┼────────────────────┼──────────┤
│ 1  │ 2024-11-06 │ John Doe     │ 081234567890 │ Jl. Merdeka 1   │ Bekerja        │ Swasta           │ Wajib Lapor        │ -        │
│ 2  │ 2024-11-06 │ Jane Smith   │ 081234567891 │ Jl. Sudirman 2  │ Tidak Bekerja  │ -                │ Wajib Lapor        │ -        │
│ 3  │ 2024-11-06 │ Bob Johnson  │ 081234567892 │ Jl. Gatot 3     │ Bekerja        │ Wiraswasta       │ Tidak Wajib Lapor  │ -        │
└────┴────────────┴──────────────┴──────────────┴─────────────────┴────────────────┴──────────────────┴────────────────────┴──────────┘
```

### **Cara Setup:**

1. **Buat header di row 1:**
   - A1: `No`
   - B1: `Tanggal`
   - C1: `Nama_Klien`
   - D1: `Kontak`
   - E1: `Alamat`
   - F1: `Status_Bekerja`
   - G1: `Jenis_Pekerjaan`
   - H1: `Status_Wajib_Lapor`
   - I1: `Catatan`

2. **Format header:**
   - Bold (Ctrl+B)
   - Background: Biru (#4285F4)
   - Text: Putih
   - Freeze: View → Freeze → 1 row

3. **Isi data contoh (copy paste per row):**

**Row 2:**
```
1	2024-11-06	John Doe	081234567890	Jl. Merdeka No. 1	Bekerja	Swasta	Wajib Lapor	-
```

**Row 3:**
```
2	2024-11-06	Jane Smith	081234567891	Jl. Sudirman No. 2	Tidak Bekerja	-	Wajib Lapor	-
```

**Row 4:**
```
3	2024-11-06	Bob Johnson	081234567892	Jl. Gatot No. 3	Bekerja	Wiraswasta	Tidak Wajib Lapor	-
```

---

## 🎨 DATA VALIDATION

### **Kolom Status_Bekerja (F):**

1. Select kolom F (dari F2 ke bawah)
2. Menu **Data** → **Data validation**
3. Criteria: **List from a range** atau **List of items**
4. Items:
   ```
   Bekerja
   Tidak Bekerja
   ```
5. Show dropdown: ✅
6. Save

### **Kolom Status_Wajib_Lapor (H):**

1. Select kolom H (dari H2 ke bawah)
2. Menu **Data** → **Data validation**
3. Items:
   ```
   Wajib Lapor
   Tidak Wajib Lapor
   ```
4. Show dropdown: ✅
5. Save

### **Kolom Status di Master_PK (D):**

1. Select kolom D (dari D2 ke bawah)
2. Menu **Data** → **Data validation**
3. Items:
   ```
   Aktif
   Tidak Aktif
   ```
4. Show dropdown: ✅
5. Save

---

## 🎨 CONDITIONAL FORMATTING

### **Status_Bekerja = "Bekerja":**

1. Select kolom F
2. Format → Conditional formatting
3. Format cells if: **Text is exactly** → `Bekerja`
4. Formatting style:
   - Background: Light Green (#C8E6C9)
   - Text: Dark Green (#2E7D32)

### **Status_Bekerja = "Tidak Bekerja":**

1. Select kolom F
2. Format → Conditional formatting
3. Format cells if: **Text is exactly** → `Tidak Bekerja`
4. Formatting style:
   - Background: Light Red (#FFCDD2)
   - Text: Dark Red (#C62828)

### **Status_Wajib_Lapor = "Wajib Lapor":**

1. Select kolom H
2. Format → Conditional formatting
3. Format cells if: **Text is exactly** → `Wajib Lapor`
4. Formatting style:
   - Background: Light Orange (#FFE0B2)
   - Text: Dark Orange (#E65100)

---

## 📝 PENJELASAN KOLOM

### **Master_PK:**

- **ID**: Kode unik PK (PK001, PK002, dst)
- **Nama**: Nama lengkap Pembimbing Kemasyarakatan
- **Jabatan**: Jabatan PK (PK Pratama, PK Muda, PK Madya, dll)
- **Status**: Aktif atau Tidak Aktif

### **Klien_PK[ID]:**

- **No**: Nomor urut otomatis
- **Tanggal**: Tanggal pendaftaran (format: YYYY-MM-DD)
- **Nama_Klien**: Nama lengkap klien
- **Kontak**: Nomor telepon/WhatsApp klien
- **Alamat**: Alamat lengkap klien
- **Status_Bekerja**: 
  - `Bekerja` - Klien sedang bekerja
  - `Tidak Bekerja` - Klien tidak bekerja
- **Jenis_Pekerjaan**: 
  - Isi jika Status_Bekerja = "Bekerja"
  - Contoh: Swasta, PNS, Wiraswasta, Buruh, dll
  - Isi `-` jika tidak bekerja
- **Status_Wajib_Lapor**:
  - `Wajib Lapor` - Klien wajib lapor rutin
  - `Tidak Wajib Lapor` - Klien tidak wajib lapor
- **Catatan**: Catatan tambahan tentang klien (opsional)

---

## ✅ CHECKLIST SETUP

### **Master_PK:**
```
□ Sheet "Master_PK" dibuat
□ Header 4 kolom: ID, Nama, Jabatan, Status
□ Header di-format (bold, warna hijau, text putih)
□ Header di-freeze
□ Data validation untuk kolom Status
□ Minimal 3 data PK diisi
```

### **Klien Sheets:**
```
□ Sheet "Klien_PK001" dibuat
□ Sheet "Klien_PK002" dibuat
□ Sheet "Klien_PK003" dibuat
□ Header 9 kolom sesuai template
□ Header di-format (bold, warna biru, text putih)
□ Header di-freeze
□ Data validation untuk Status_Bekerja
□ Data validation untuk Status_Wajib_Lapor
□ Conditional formatting diterapkan
□ Data contoh diisi (minimal 1 per sheet)
```

---

## 🔄 CARA MENGISI DATA

### **Menambah PK Baru:**

1. Buka sheet **Master_PK**
2. Tambah row baru di bawah data terakhir
3. Isi:
   - ID: PK004 (increment dari terakhir)
   - Nama: Nama lengkap PK
   - Jabatan: Jabatan PK
   - Status: Pilih dari dropdown (Aktif/Tidak Aktif)
4. Buat sheet baru: **Klien_PK004**
5. Copy header dari Klien_PK001
6. Sync di aplikasi

### **Menambah Klien Baru:**

1. Buka sheet klien PK yang sesuai (misal: **Klien_PK001**)
2. Tambah row baru di bawah data terakhir
3. Isi:
   - No: Increment otomatis (1, 2, 3, ...)
   - Tanggal: Tanggal hari ini (format: 2024-11-06)
   - Nama_Klien: Nama lengkap klien
   - Kontak: Nomor telepon/WA (08xxxxxxxxxx)
   - Alamat: Alamat lengkap
   - Status_Bekerja: Pilih dari dropdown
   - Jenis_Pekerjaan: Isi jika bekerja, `-` jika tidak
   - Status_Wajib_Lapor: Pilih dari dropdown
   - Catatan: Isi jika ada catatan khusus, `-` jika tidak ada
4. Sync di aplikasi

---

## 📊 CONTOH LENGKAP

### **Master_PK Sheet:**

```
ID      | Nama                      | Jabatan    | Status
--------|---------------------------|------------|--------
PK001   | Drs. Ahmad Wijaya, M.Si   | PK Pratama | Aktif
PK002   | Sri Lestari, S.Sos        | PK Muda    | Aktif
PK003   | Budi Santoso, S.H.        | PK Madya   | Aktif
PK004   | Dewi Sartika, S.Psi       | PK Pratama | Aktif
```

### **Klien_PK001 Sheet:**

```
No | Tanggal    | Nama_Klien   | Kontak       | Alamat              | Status_Bekerja | Jenis_Pekerjaan | Status_Wajib_Lapor | Catatan
---|------------|--------------|--------------|---------------------|----------------|-----------------|--------------------|---------
1  | 2024-11-06 | John Doe     | 081234567890 | Jl. Merdeka No. 1   | Bekerja        | Swasta          | Wajib Lapor        | -
2  | 2024-11-06 | Jane Smith   | 081234567891 | Jl. Sudirman No. 2  | Tidak Bekerja  | -               | Wajib Lapor        | Sedang mencari kerja
3  | 2024-11-06 | Bob Johnson  | 081234567892 | Jl. Gatot No. 3     | Bekerja        | Wiraswasta      | Tidak Wajib Lapor  | -
4  | 2024-11-07 | Alice Brown  | 081234567893 | Jl. Diponegoro 4    | Bekerja        | PNS             | Wajib Lapor        | -
```

---

## 🎯 TIPS & BEST PRACTICES

1. **Konsistensi Format:**
   - Gunakan format tanggal: YYYY-MM-DD (2024-11-06)
   - Nomor telepon: 08xxxxxxxxxx (tanpa spasi atau tanda hubung)
   - Gunakan `-` untuk field kosong, bukan dikosongkan

2. **Data Validation:**
   - Selalu gunakan dropdown untuk field pilihan
   - Hindari typo dengan menggunakan validation

3. **Naming Convention:**
   - ID PK: PK001, PK002, PK003 (3 digit)
   - Sheet klien: Klien_PK001, Klien_PK002 (exact match dengan ID)

4. **Regular Sync:**
   - Sync setelah menambah/update data
   - Cek sync logs untuk memastikan berhasil

5. **Backup:**
   - Download backup Google Sheets secara berkala
   - File → Download → Excel (.xlsx)

---

**KIANSANTANG - Kios Antrian Santun dan Tanggap**  
*Sistem Layanan BAPAS Bandung Berbasis Digital*

© 2024 BAPAS Kelas I Bandung
