# 📢 Panduan Template Panggilan Suara

## 🎯 Overview

Sistem sekarang menggunakan **template yang dapat dikustomisasi** untuk panggilan suara! Setiap layanan (penghadapan, bimbingan, kunjungan, pengaduan) dapat memiliki template panggilan suara yang berbeda sesuai kebutuhan.

---

## ✨ Fitur Baru

### **1. Template Per Layanan** ✅
- Setiap layanan punya template sendiri
- Template dapat diedit di `/operator-settings`
- Tersimpan di localStorage
- Otomatis digunakan saat panggil antrian

### **2. Dynamic Placeholders** ✅
- `{{queueNumber}}` - Nomor antrian (diformat untuk TTS)
- `{{clientName}}` - Nama klien
- `{{serviceName}}` - Nama layanan (Penghadapan, Bimbingan, dll)
- `{{subServiceName}}` - Sub layanan (Wajib Lapor, dll)
- `{{pkOfficerName}}` - Nama PK
- `{{pkOfficerPosition}}` - Jabatan PK
- `{{time}}` - Waktu panggilan
- `{{counter}}` - Nomor loket

### **3. Auto TTS Conversion** ✅
- Emoji dihapus otomatis untuk TTS
- Baris baru diubah jadi pause (titik)
- Format nomor antrian untuk dibacakan jelas
- Pengulangan 2x otomatis

---

## 🎨 Template Default

### **Penghadapan:**
```
📢 PEMANGGILAN LAYANAN PENGHADAPAN

🎫 Nomor Antrian: {{queueNumber}}
👤 Nama: {{clientName}}
📋 Layanan: {{serviceName}}
📝 Sub Layanan: {{subServiceName}}
👨‍💼 PK: {{pkOfficerName}}
📍 Posisi: {{pkOfficerPosition}}
⏰ Waktu: {{time}}

📍 Silakan menuju ke Loket {{counter}}
✅ Mohon membawa dokumen yang diperlukan
```

**Hasil TTS:**
```
"PEMANGGILAN LAYANAN PENGHADAPAN. Nomor Antrian: Peh Ha 0 0 1. 
Nama: Budi Santoso. Layanan: Penghadapan. Sub Layanan: Penghadapan. 
PK: Ahmad Yani. Posisi: Pembimbing Kemasyarakatan Pratama. 
Waktu: 10:30. Silakan menuju ke Loket 1. 
Mohon membawa dokumen yang diperlukan."
```

---

### **Bimbingan:**
```
📢 PEMANGGILAN LAYANAN BIMBINGAN

🎫 Nomor Antrian: {{queueNumber}}
👤 Nama Klien: {{clientName}}
📋 Jenis Bimbingan: {{subServiceName}}
👨‍💼 Pembimbing Kemasyarakatan: {{pkOfficerName}}
📍 Jabatan: {{pkOfficerPosition}}
⏰ Waktu Daftar: {{time}}

📍 Silakan menuju ke Ruang Bimbingan - Loket {{counter}}
📝 Mohon membawa KTP dan dokumen pendukung
```

**Hasil TTS:**
```
"PEMANGGILAN LAYANAN BIMBINGAN. Nomor Antrian: Be Em 0 0 2. 
Nama Klien: Siti Aminah. Jenis Bimbingan: Wajib Lapor. 
Pembimbing Kemasyarakatan: Siti Nurhaliza. 
Jabatan: Pembimbing Kemasyarakatan Muda. Waktu Daftar: 11:00. 
Silakan menuju ke Ruang Bimbingan - Loket 2. 
Mohon membawa KTP dan dokumen pendukung."
```

---

### **Kunjungan:**
```
📢 PEMANGGILAN LAYANAN KUNJUNGAN

🎫 Nomor Antrian: {{queueNumber}}
👤 Nama Pengunjung: {{clientName}}
📋 Layanan: {{serviceName}}
📝 Keperluan: {{subServiceName}}
⏰ Waktu: {{time}}

📍 Silakan menuju ke Loket {{counter}}
🆔 Mohon membawa KTP dan surat izin kunjungan
```

---

### **Pengaduan:**
```
📢 PEMANGGILAN LAYANAN PENGADUAN

🎫 Nomor Antrian: {{queueNumber}}
👤 Nama: {{clientName}}
📋 Layanan: {{serviceName}}
📝 Jenis: {{subServiceName}}
⏰ Waktu: {{time}}

📍 Silakan menuju ke Loket {{counter}}
📄 Mohon siapkan dokumen pendukung pengaduan
```

---

## 🔧 Cara Edit Template

### **STEP 1: Buka Settings**
```
1. Login sebagai operator
2. Klik tombol "Settings" ⚙️
3. Atau navigasi ke /operator-settings
```

### **STEP 2: Pilih Tab Template**
```
1. Klik tab "Template" 📝
2. Lihat 4 template untuk setiap layanan
```

### **STEP 3: Edit Template**
```
1. Pilih layanan yang ingin diedit
2. Edit teks di textarea
3. Gunakan placeholder {{...}} untuk data dinamis
4. Tambahkan emoji untuk tampilan (akan dihapus di TTS)
```

### **STEP 4: Simpan**
```
1. Klik tombol "Simpan" 💾
2. Lihat notifikasi "Template berhasil disimpan!"
3. Template langsung aktif untuk panggilan berikutnya
```

---

## 📋 Placeholder yang Tersedia

| Placeholder | Deskripsi | Contoh Output |
|-------------|-----------|---------------|
| `{{queueNumber}}` | Nomor antrian (formatted) | "Peh Ha 0 0 1" |
| `{{clientName}}` | Nama klien | "Budi Santoso" |
| `{{serviceName}}` | Nama layanan | "Penghadapan" |
| `{{subServiceName}}` | Sub layanan | "Wajib Lapor" |
| `{{pkOfficerName}}` | Nama PK | "Ahmad Yani" |
| `{{pkOfficerPosition}}` | Jabatan PK | "Pembimbing Kemasyarakatan Pratama" |
| `{{time}}` | Waktu panggilan | "10:30" |
| `{{counter}}` | Nomor loket | "1" |

---

## 🎭 Contoh Kustomisasi

### **Template Singkat (Cepat):**
```
Nomor antrian {{queueNumber}} untuk {{serviceName}}, 
silakan menuju loket {{counter}}
```

**Hasil TTS:**
```
"Nomor antrian Peh Ha 0 0 1 untuk Penghadapan, 
silakan menuju loket 1"
```

---

### **Template Formal (Lengkap):**
```
📢 PEMANGGILAN LAYANAN {{serviceName}}

Kepada Saudara {{clientName}}, 
dengan nomor antrian {{queueNumber}}, 
untuk layanan {{subServiceName}}, 
mohon segera menuju ke Loket {{counter}}.

Pembimbing Kemasyarakatan yang bertugas: {{pkOfficerName}}.
Terima kasih.
```

**Hasil TTS:**
```
"PEMANGGILAN LAYANAN Penghadapan. Kepada Saudara Budi Santoso, 
dengan nomor antrian Peh Ha 0 0 1, untuk layanan Penghadapan, 
mohon segera menuju ke Loket 1. 
Pembimbing Kemasyarakatan yang bertugas: Ahmad Yani. 
Terima kasih."
```

---

### **Template Ramah (Friendly):**
```
Halo {{clientName}}! 😊

Nomor antrian Anda {{queueNumber}} sudah dipanggil.
Silakan menuju ke Loket {{counter}} ya.

PK yang akan melayani: {{pkOfficerName}}
Sampai jumpa! 👋
```

**Hasil TTS:**
```
"Halo Budi Santoso! Nomor antrian Anda Peh Ha 0 0 1 sudah dipanggil. 
Silakan menuju ke Loket 1 ya. 
PK yang akan melayani: Ahmad Yani. 
Sampai jumpa!"
```

---

## 🔄 Cara Kerja System

### **Flow Panggilan:**

```
1. Operator klik "Panggil Berikutnya"
   ↓
2. System ambil antrian pertama
   ↓
3. System load template dari localStorage
   ↓
4. System pilih template sesuai serviceType
   ↓
5. System replace placeholder dengan data real
   ↓
6. System hapus emoji untuk TTS
   ↓
7. System format nomor antrian (PH-001 → "Peh Ha 0 0 1")
   ↓
8. System apply voice settings (rate, pitch, volume, voice)
   ↓
9. System speak announcement
   ↓
10. System ulangi 2x otomatis
```

---

## 💡 Tips Membuat Template

### **DO ✅**

- Gunakan kalimat pendek dan jelas
- Pisahkan informasi dengan baris baru
- Gunakan placeholder untuk data dinamis
- Tambahkan emoji untuk visual (akan dihapus di TTS)
- Test dengan "Test Suara" sebelum simpan
- Simpan setelah edit

### **DON'T ❌**

- Jangan terlalu panjang (max 3-4 kalimat)
- Jangan gunakan singkatan yang ambigu
- Jangan lupa placeholder `{{counter}}`
- Jangan hardcode data (gunakan placeholder)
- Jangan lupa simpan setelah edit

---

## 🎤 Format Nomor Antrian

### **Kode Layanan:**

| Kode | Dibacakan | Layanan |
|------|-----------|---------|
| PH | "Peh Ha" | Penghadapan |
| BM | "Be Em" | Bimbingan |
| KJ | "Ka Je" | Kunjungan |
| PG | "Pe Ge" | Pengaduan |

### **Contoh:**

```
PH-001 → "Peh Ha 0 0 1"
BM-025 → "Be Em 0 2 5"
KJ-100 → "Ka Je 1 0 0"
PG-999 → "Pe Ge 9 9 9"
```

---

## 🧪 Testing Template

### **Test 1: Edit & Save**
```
1. Buka /operator-settings → Tab "Template"
2. Edit template penghadapan
3. Ubah teks: "Halo {{clientName}}!"
4. Klik "Simpan"
5. ✅ Lihat notifikasi sukses
```

### **Test 2: Test di Console**
```
1. Buka Console (F12)
2. Ketik:
   soundManager.getCallTemplates()
3. ✅ Lihat template yang tersimpan
```

### **Test 3: Test Real Call**
```
1. Buka /operator
2. Panggil antrian
3. ✅ Dengar announcement sesuai template
4. ✅ Cek console log: "Announcement text: ..."
```

---

## 🔍 Debugging

### **Problem: Template tidak berubah**

**Penyebab:**
- Lupa klik "Simpan"
- Browser cache
- localStorage tidak tersimpan

**Solusi:**
```
1. Edit template
2. ❗ KLIK "SIMPAN" ❗
3. Refresh browser (F5)
4. Cek console:
   localStorage.getItem('callTemplates')
5. Test panggil antrian lagi
```

---

### **Problem: Placeholder tidak diganti**

**Penyebab:**
- Typo di placeholder
- Data tidak tersedia
- Format placeholder salah

**Solusi:**
```
1. Cek spelling: {{queueNumber}} bukan {{queuenumber}}
2. Cek data tersedia di queue
3. Cek console log saat panggil
4. Format: {{placeholder}} bukan {placeholder}
```

---

### **Problem: TTS terdengar aneh**

**Penyebab:**
- Emoji tidak terhapus
- Format teks tidak sesuai
- Voice settings ekstrem

**Solusi:**
```
1. Cek console log: "Announcement text: ..."
2. Pastikan emoji terhapus
3. Adjust voice settings (rate, pitch)
4. Gunakan kalimat natural
```

---

## 📖 Console Commands

### **Cek Template Tersimpan:**
```javascript
localStorage.getItem('callTemplates')
```

### **Cek Template Parsed:**
```javascript
JSON.parse(localStorage.getItem('callTemplates'))
```

### **Load Template via soundManager:**
```javascript
soundManager.getCallTemplates()
```

### **Test Replace Placeholder:**
```javascript
const template = "Nomor {{queueNumber}} ke loket {{counter}}";
const data = { queueNumber: "PH-001", counter: "1" };
soundManager.replaceTemplatePlaceholders(template, data);
```

### **Test Format Queue Number:**
```javascript
soundManager.formatQueueNumber("PH-001")
// Output: "Peh Ha 0 0 1"
```

---

## ✅ Best Practices

### **Template Pendek (Recommended):**
```
Nomor antrian {{queueNumber}} untuk {{serviceName}}, 
silakan menuju loket {{counter}}
```
- ✅ Cepat
- ✅ Jelas
- ✅ Tidak membosankan

---

### **Template Sedang:**
```
📢 {{serviceName}}

Nomor: {{queueNumber}}
Nama: {{clientName}}
Loket: {{counter}}

Silakan menuju loket {{counter}}
```
- ✅ Informatif
- ✅ Terstruktur
- ✅ Tidak terlalu panjang

---

### **Template Lengkap:**
```
📢 PEMANGGILAN LAYANAN {{serviceName}}

🎫 Nomor Antrian: {{queueNumber}}
👤 Nama: {{clientName}}
📋 Layanan: {{subServiceName}}
👨‍💼 PK: {{pkOfficerName}}

📍 Silakan menuju ke Loket {{counter}}
```
- ✅ Sangat informatif
- ⚠️ Agak panjang
- ⚠️ Perlu voice rate lebih cepat (1.0-1.1)

---

## 🎯 Rekomendasi per Use Case

### **Kantor Sibuk (Banyak Antrian):**
```
Template: Pendek
Voice: Google Male
Rate: 1.0 (cepat)
Pitch: 1.0 (normal)
```

### **Kantor Formal (Pemerintah):**
```
Template: Sedang/Lengkap
Voice: Google Male
Rate: 0.8 (lambat, jelas)
Pitch: 0.7 (rendah, formal)
```

### **Customer Service (Ramah):**
```
Template: Sedang
Voice: Google Female
Rate: 0.9 (sedikit lambat)
Pitch: 1.15 (sedikit tinggi)
```

---

## 📊 Summary

**Fitur:**
- ✅ Template per layanan (4 template)
- ✅ 8 placeholder dinamis
- ✅ Auto TTS conversion
- ✅ Emoji removal
- ✅ Format nomor antrian
- ✅ Pengulangan 2x
- ✅ Custom voice settings

**Cara Pakai:**
1. Edit template di `/operator-settings`
2. Gunakan placeholder `{{...}}`
3. Simpan template
4. Panggil antrian di `/operator`
5. ✅ Template otomatis digunakan!

**Tips:**
- Gunakan template pendek untuk efisiensi
- Test sebelum simpan
- Kombinasikan dengan voice settings
- Cek console log untuk debugging

---

**Template panggilan suara sekarang dapat dikustomisasi sesuai kebutuhan!** 📢✨

Setiap layanan punya template sendiri dengan data dinamis! 🎯
