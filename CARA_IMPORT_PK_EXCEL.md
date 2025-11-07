# 📊 CARA IMPORT PK OFFICERS DARI EXCEL

## 🎯 **OVERVIEW**

Fitur import Excel memungkinkan Anda menambahkan banyak data PK Officers sekaligus dari file Excel (.xlsx, .xls, .ods) dengan cepat dan mudah.

---

## ✨ **FITUR UTAMA**

### **1. Download Template**
- Template Excel siap pakai
- Format sudah benar
- Contoh data included

### **2. Upload & Preview**
- Upload file Excel
- Preview data sebelum import
- Validasi otomatis

### **3. Validasi Data**
- Cek nama tidak kosong
- Cek jabatan tidak kosong
- Highlight error dengan warna merah

### **4. Import ke Database**
- Import massal ke Supabase
- Progress tracking
- Statistics (berhasil/gagal)

---

## 📝 **LANGKAH-LANGKAH**

### **STEP 1: Download Template**

1. **Buka** halaman Manajemen PK:
   ```
   Settings → Manajemen PK
   ```

2. **Klik** tombol **"Import Excel"** (hijau, icon spreadsheet)

3. **Klik** tombol **"Download Template"**

4. **File akan terdownload:** `Template_Import_PK_Officers.xlsx`

---

### **STEP 2: Isi Data di Excel**

1. **Buka** file template yang sudah didownload

2. **Format Kolom:**
   ```
   Kolom A: Nama PK
   Kolom B: Jabatan
   Kolom C: Status Aktif
   ```

3. **Isi Data:**

   **Contoh:**
   ```
   | Nama PK           | Jabatan                                    | Status Aktif |
   |-------------------|--------------------------------------------|--------------|
   | Budi Santoso      | Pembimbing Kemasyarakatan Ahli Pertama     | Ya           |
   | Siti Nurhaliza    | Pembimbing Kemasyarakatan Ahli Muda        | Ya           |
   | Ahmad Yani        | Pembimbing Kemasyarakatan Ahli Madya       | Tidak        |
   ```

4. **Status Aktif - Format yang Diterima:**
   - ✅ **Ya** / **Tidak**
   - ✅ **Yes** / **No**
   - ✅ **Y** / **N**
   - ✅ **1** / **0**
   - ✅ **Aktif** / **Tidak Aktif**
   - ✅ **Active** / **Inactive**
   - ✅ **true** / **false**

5. **Simpan** file Excel

---

### **STEP 3: Upload File**

1. **Kembali** ke halaman Import Excel di aplikasi

2. **Klik** "Pilih File Excel"

3. **Pilih** file Excel yang sudah diisi

4. **Klik** tombol **"Preview Data"**

5. **Tunggu** proses parsing (beberapa detik)

---

### **STEP 4: Review & Validasi**

**Setelah preview, Anda akan melihat:**

1. **Tabel Preview:**
   - Nomor baris
   - Nama PK
   - Jabatan
   - Status (Aktif/Tidak Aktif dengan icon)

2. **Validasi Errors (jika ada):**
   ```
   ⚠️ Ditemukan 2 error validasi:
   • Baris 5 - Nama: Nama tidak boleh kosong
   • Baris 7 - Jabatan: Jabatan tidak boleh kosong
   ```

3. **Baris dengan Error:**
   - Background merah muda
   - Mudah diidentifikasi

**Jika Ada Error:**
- Tutup dialog
- Perbaiki data di Excel
- Upload ulang

**Jika Tidak Ada Error:**
- Lanjut ke Step 5

---

### **STEP 5: Import ke Database**

1. **Pastikan** tidak ada error validasi

2. **Klik** tombol **"Import ke Database"** (hijau)

3. **Tunggu** proses import (beberapa detik)

4. **Lihat** hasil import:
   ```
   ✅ Import Selesai!
   Total: 10 | Berhasil: 10 | Gagal: 0
   ```

5. **Dialog** akan otomatis tertutup

6. **Data PK** langsung muncul di tabel

---

## 📋 **FORMAT EXCEL DETAIL**

### **Kolom 1: Nama PK**

**Wajib:** Ya  
**Tipe:** Text  
**Contoh:**
```
✅ Budi Santoso
✅ Dr. Siti Nurhaliza, S.H., M.H.
✅ Ahmad Yani
❌ (kosong)
```

---

### **Kolom 2: Jabatan**

**Wajib:** Ya  
**Tipe:** Text  
**Contoh:**
```
✅ Pembimbing Kemasyarakatan Ahli Pertama
✅ Pembimbing Kemasyarakatan Ahli Muda
✅ Pembimbing Kemasyarakatan Ahli Madya
✅ Pembimbing Kemasyarakatan Ahli Utama
✅ Pembimbing Kemasyarakatan Penyelia
❌ (kosong)
```

---

### **Kolom 3: Status Aktif**

**Wajib:** Tidak (default: Tidak Aktif)  
**Tipe:** Text/Boolean  
**Format Diterima:**

**Untuk AKTIF:**
```
✅ Ya
✅ Yes
✅ Y
✅ 1
✅ Aktif
✅ Active
✅ true
✅ TRUE
```

**Untuk TIDAK AKTIF:**
```
✅ Tidak
✅ No
✅ N
✅ 0
✅ Tidak Aktif
✅ Inactive
✅ false
✅ FALSE
✅ (kosong)
```

---

## 🎨 **CONTOH FILE EXCEL**

### **Template (3 baris contoh):**

| Nama PK           | Jabatan                                    | Status Aktif |
|-------------------|--------------------------------------------|--------------|
| John Doe          | Pembimbing Kemasyarakatan Ahli Pertama     | Ya           |
| Jane Smith        | Pembimbing Kemasyarakatan Ahli Muda        | Ya           |
| Bob Johnson       | Pembimbing Kemasyarakatan Ahli Madya       | Tidak        |

---

### **Contoh Data Real (10 PK):**

| Nama PK                    | Jabatan                                    | Status Aktif |
|----------------------------|--------------------------------------------|--------------|
| Budi Santoso, S.H.         | Pembimbing Kemasyarakatan Ahli Pertama     | Ya           |
| Siti Nurhaliza, S.Sos.     | Pembimbing Kemasyarakatan Ahli Muda        | Ya           |
| Ahmad Yani, S.H., M.H.     | Pembimbing Kemasyarakatan Ahli Madya       | Ya           |
| Dewi Lestari, S.Psi.       | Pembimbing Kemasyarakatan Ahli Pertama     | Ya           |
| Eko Prasetyo, S.Sos.       | Pembimbing Kemasyarakatan Ahli Muda        | Tidak        |
| Fitri Handayani, S.H.      | Pembimbing Kemasyarakatan Ahli Pertama     | Ya           |
| Gunawan Wibisono, S.Sos.   | Pembimbing Kemasyarakatan Penyelia         | Ya           |
| Hendra Kusuma, S.H.        | Pembimbing Kemasyarakatan Ahli Madya       | Ya           |
| Indah Permata, S.Psi.      | Pembimbing Kemasyarakatan Ahli Pertama     | Tidak        |
| Joko Widodo, S.H., M.H.    | Pembimbing Kemasyarakatan Ahli Utama       | Ya           |

---

## ⚠️ **VALIDASI & ERROR**

### **Error 1: Nama Kosong**

**Error Message:**
```
Baris 5 - Nama: Nama tidak boleh kosong
```

**Solusi:**
- Isi kolom Nama di baris 5
- Nama minimal 1 karakter

---

### **Error 2: Jabatan Kosong**

**Error Message:**
```
Baris 7 - Jabatan: Jabatan tidak boleh kosong
```

**Solusi:**
- Isi kolom Jabatan di baris 7
- Jabatan minimal 1 karakter

---

### **Error 3: Format File Salah**

**Error Message:**
```
Format file tidak valid. Gunakan .xlsx, .xls, atau .ods
```

**Solusi:**
- Gunakan file Excel (.xlsx, .xls)
- Atau LibreOffice Calc (.ods)
- Jangan gunakan .csv atau .txt

---

### **Error 4: File Kosong**

**Error Message:**
```
File kosong atau tidak memiliki data
```

**Solusi:**
- Pastikan file memiliki header row
- Pastikan ada minimal 1 baris data
- Jangan upload file kosong

---

## 🐛 **TROUBLESHOOTING**

### **Problem 1: Preview Tidak Muncul**

**Penyebab:**
- File tidak ter-upload dengan benar
- Format file salah
- File corrupt

**Solusi:**
1. Refresh halaman
2. Upload ulang file
3. Coba download template dan isi ulang
4. Cek format file (.xlsx, .xls, .ods)

---

### **Problem 2: Import Gagal Semua**

**Penyebab:**
- Koneksi database error
- Data duplikat
- Permission error

**Solusi:**
1. Cek koneksi internet
2. Cek apakah data sudah ada di database
3. Coba import dengan data lebih sedikit (5-10 baris)
4. Cek console browser (F12) untuk error detail

---

### **Problem 3: Sebagian Data Gagal**

**Penyebab:**
- Data duplikat (nama sama)
- Constraint violation
- Data terlalu panjang

**Solusi:**
1. Cek data yang gagal di console
2. Hapus data duplikat
3. Perbaiki data yang bermasalah
4. Import ulang data yang gagal saja

---

### **Problem 4: Status Tidak Sesuai**

**Penyebab:**
- Format status salah
- Typo di kolom status

**Solusi:**
1. Gunakan format yang benar: Ya/Tidak, Yes/No, 1/0
2. Cek typo (spasi, huruf besar/kecil)
3. Gunakan dropdown di Excel untuk konsistensi

---

## 💡 **TIPS & BEST PRACTICES**

### **Tip 1: Gunakan Template**

**Selalu download template terlebih dahulu!**
- Format sudah benar
- Contoh data included
- Menghindari error format

---

### **Tip 2: Validasi di Excel Dulu**

**Sebelum upload:**
- Cek semua nama terisi
- Cek semua jabatan terisi
- Cek format status konsisten
- Hapus baris kosong

---

### **Tip 3: Import Bertahap**

**Untuk data banyak (>50 baris):**
- Import 20-30 baris per batch
- Lebih mudah track error
- Lebih cepat proses

---

### **Tip 4: Backup Data**

**Sebelum import:**
- Export data existing (jika ada)
- Simpan file Excel sebagai backup
- Bisa rollback jika ada masalah

---

### **Tip 5: Gunakan Dropdown di Excel**

**Untuk kolom Status:**
```excel
Data → Data Validation → List
Source: Ya,Tidak
```

**Keuntungan:**
- Konsisten
- Tidak ada typo
- Lebih cepat input

---

## 📊 **STATISTIK IMPORT**

### **Setelah Import Selesai:**

```
✅ Import Selesai!
Total: 25 | Berhasil: 23 | Gagal: 2
```

**Artinya:**
- **Total:** 25 baris data di Excel
- **Berhasil:** 23 data berhasil masuk database
- **Gagal:** 2 data gagal (cek console untuk detail)

---

## 🔄 **WORKFLOW IDEAL**

```
1. Download Template
   ↓
2. Isi Data di Excel
   ↓
3. Validasi Manual (cek nama, jabatan, status)
   ↓
4. Upload File
   ↓
5. Preview Data
   ↓
6. Cek Validasi (ada error?)
   ├─ Ada Error → Perbaiki di Excel → Upload Ulang
   └─ Tidak Ada Error → Lanjut
   ↓
7. Import ke Database
   ↓
8. Cek Hasil (berhasil semua?)
   ├─ Gagal Sebagian → Cek Console → Perbaiki → Import Ulang
   └─ Berhasil Semua → DONE! ✅
```

---

## 🎯 **KEUNTUNGAN IMPORT EXCEL**

### **vs Manual Input:**

| Aspek              | Manual Input      | Import Excel     |
|--------------------|-------------------|------------------|
| **Kecepatan**      | 2-3 menit/PK      | 10 detik/batch   |
| **Effort**         | Tinggi            | Rendah           |
| **Error Rate**     | 10-15%            | <5%              |
| **Bulk Insert**    | Tidak             | Ya (unlimited)   |
| **Validasi**       | Manual            | Otomatis         |
| **Preview**        | Tidak             | Ya               |

---

## 📱 **SUPPORT**

**Jika ada masalah:**

1. **Cek dokumentasi ini**
2. **Cek console browser** (F12 → Console)
3. **Download template ulang**
4. **Try dengan data lebih sedikit**
5. **Contact developer**

---

## ✅ **CHECKLIST**

**Sebelum Import:**
- [ ] Download template
- [ ] Isi data sesuai format
- [ ] Cek nama tidak kosong
- [ ] Cek jabatan tidak kosong
- [ ] Cek format status (Ya/Tidak)
- [ ] Hapus baris kosong
- [ ] Simpan file

**Saat Import:**
- [ ] Upload file
- [ ] Preview data
- [ ] Cek validasi
- [ ] Perbaiki error (jika ada)
- [ ] Import ke database
- [ ] Cek hasil

**Setelah Import:**
- [ ] Verify data di tabel
- [ ] Test dengan buat antrian
- [ ] Backup file Excel
- [ ] Dokumentasi

---

**Selamat Menggunakan Fitur Import Excel! 🎉**

**Butuh bantuan?**
- Baca dokumentasi ini
- Cek console browser
- Download template ulang
- Contact support
