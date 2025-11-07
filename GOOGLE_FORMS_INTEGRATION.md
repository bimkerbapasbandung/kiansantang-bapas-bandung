# 📝 Panduan Integrasi Google Forms untuk Manajemen PK

## 🎯 Overview

Sistem Manajemen PK sekarang terintegrasi dengan Google Forms untuk input data yang lebih mudah. Admin bisa mengisi form online, dan data otomatis masuk ke database.

---

## 🚀 Setup Google Form (15 Menit)

### **STEP 1: Buat Google Form**

1. **Buka Google Forms:**
   ```
   https://forms.google.com
   ```

2. **Klik "Blank Form" (+ icon)**

3. **Set Judul Form:**
   ```
   Pendaftaran Pembimbing Kemasyarakatan (PK)
   ```

4. **Set Deskripsi:**
   ```
   Form untuk mendaftarkan data Pembimbing Kemasyarakatan Bapas Bandung
   ```

---

### **STEP 2: Buat Pertanyaan**

Tambahkan pertanyaan berikut:

#### **Pertanyaan 1: Nama Lengkap** (Wajib)
- Tipe: **Short answer**
- Label: `Nama Lengkap`
- Required: ✅ Yes
- Validation: None

#### **Pertanyaan 2: NIP** (Opsional)
- Tipe: **Short answer**
- Label: `Nomor Induk Pegawai (NIP)`
- Required: ❌ No
- Validation: Number (18 digits)
- Example: `199001012015031001`

#### **Pertanyaan 3: Jabatan** (Wajib)
- Tipe: **Dropdown** atau **Short answer**
- Label: `Jabatan`
- Required: ✅ Yes
- Options (jika dropdown):
  - Pembimbing Kemasyarakatan
  - Pembimbing Kemasyarakatan Ahli Pertama
  - Pembimbing Kemasyarakatan Ahli Muda
  - Pembimbing Kemasyarakatan Ahli Madya

#### **Pertanyaan 4: No. Telepon** (Opsional)
- Tipe: **Short answer**
- Label: `Nomor Telepon`
- Required: ❌ No
- Example: `08123456789`

#### **Pertanyaan 5: Email** (Opsional)
- Tipe: **Short answer**
- Label: `Email`
- Required: ❌ No
- Validation: Email format
- Example: `nama@bapas.go.id`

#### **Pertanyaan 6: Status** (Wajib)
- Tipe: **Multiple choice**
- Label: `Status Aktif`
- Required: ✅ Yes
- Options:
  - Aktif
  - Tidak Aktif
- Default: Aktif

---

### **STEP 3: Konfigurasi Form**

1. **Klik icon Settings** (gear icon)

2. **Tab "General":**
   - ✅ Collect email addresses
   - ✅ Response receipts: Always
   - ✅ Limit to 1 response

3. **Tab "Presentation":**
   - ✅ Show progress bar
   - Confirmation message:
     ```
     Terima kasih! Data PK telah tersimpan dan akan segera diproses.
     ```

4. **Klik "Save"**

---

### **STEP 4: Hubungkan ke Google Sheets**

1. **Di Google Form, klik tab "Responses"**

2. **Klik icon Google Sheets** (hijau)

3. **Pilih "Create a new spreadsheet"**

4. **Nama spreadsheet:**
   ```
   Data PK Bapas Bandung
   ```

5. **Klik "Create"**

6. **Google Sheets akan terbuka otomatis**

---

## 🔗 Setup Auto-Sync ke Supabase (Apps Script)

### **STEP 5: Setup Apps Script**

1. **Di Google Sheets, klik "Extensions" → "Apps Script"**

2. **Hapus kode default**

3. **Paste kode berikut:**

```javascript
// ========================================
// KONFIGURASI (GANTI DENGAN DATA ANDA!)
// ========================================

const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

// ========================================
// FUNGSI UTAMA
// ========================================

function onFormSubmit(e) {
  try {
    // Ambil data dari form submission
    const responses = e.values;
    
    // Format data sesuai response order
    const timestamp = responses[0];
    const email = responses[1] || null;
    const name = responses[2];
    const nip = responses[3] || null;
    const position = responses[4];
    const phone = responses[5] || null;
    const emailContact = responses[6] || null;
    const statusText = responses[7];
    
    // Convert status text ke boolean
    const isActive = statusText === 'Aktif';
    
    // Data untuk Supabase
    const pkData = {
      name: name,
      nip: nip,
      position: position,
      phone: phone,
      email: emailContact,
      is_active: isActive
    };
    
    // Kirim ke Supabase
    const response = sendToSupabase(pkData);
    
    // Log hasil
    Logger.log('✅ Data berhasil dikirim: ' + JSON.stringify(response));
    
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    
    // Kirim email notifikasi error (opsional)
    sendErrorEmail(error.toString());
  }
}

function sendToSupabase(data) {
  const url = SUPABASE_URL + '/rest/v1/pk_officers';
  
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Prefer': 'return=representation'
    },
    'payload': JSON.stringify(data),
    'muteHttpExceptions': true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();
  
  if (responseCode === 201) {
    return JSON.parse(responseBody);
  } else {
    throw new Error('Supabase error: ' + responseCode + ' - ' + responseBody);
  }
}

function sendErrorEmail(errorMessage) {
  const recipient = 'admin@bapas.go.id'; // Ganti dengan email admin
  const subject = '❌ Error: PK Form Submission';
  const body = 'Terjadi error saat submit form PK:\n\n' + errorMessage;
  
  try {
    MailApp.sendEmail(recipient, subject, body);
  } catch (e) {
    Logger.log('Failed to send error email: ' + e.toString());
  }
}

// Test function (untuk testing manual)
function testConnection() {
  const testData = {
    name: 'Test PK',
    nip: '999999999999999999',
    position: 'Test Position',
    phone: '08123456789',
    email: 'test@bapas.go.id',
    is_active: true
  };
  
  try {
    const response = sendToSupabase(testData);
    Logger.log('✅ Test berhasil: ' + JSON.stringify(response));
  } catch (error) {
    Logger.log('❌ Test gagal: ' + error.toString());
  }
}
```

4. **Klik "Save project"** (icon disk)

5. **Nama project:** `PK Form to Supabase`

---

### **STEP 6: Konfigurasi Script**

1. **Ganti `SUPABASE_URL`:**
   - Buka Supabase Dashboard → Settings → API
   - Copy "Project URL"
   - Paste ke script

2. **Ganti `SUPABASE_ANON_KEY`:**
   - Di halaman yang sama
   - Copy "anon/public key"
   - Paste ke script

3. **Save script**

---

### **STEP 7: Setup Trigger**

1. **Di Apps Script, klik icon "Triggers"** (jam)

2. **Klik "+ Add Trigger"**

3. **Konfigurasi:**
   - Function: `onFormSubmit`
   - Deployment: Head
   - Event source: **From spreadsheet**
   - Event type: **On form submit**

4. **Klik "Save"**

5. **Authorize:**
   - Klik "Review Permissions"
   - Pilih akun Google Anda
   - Klik "Advanced" → "Go to [project name] (unsafe)"
   - Klik "Allow"

---

### **STEP 8: Test Integration**

1. **Di Apps Script, klik function dropdown** → pilih `testConnection`

2. **Klik "Run"** (▶️)

3. **Lihat "Execution log":**
   - ✅ Jika sukses: `Test berhasil: {...}`
   - ❌ Jika gagal: Cek error message

4. **Test via form:**
   - Buka Google Form
   - Isi dan submit
   - Cek Google Sheets (data masuk?)
   - Cek aplikasi Manajemen PK (data muncul?)

---

## 🔧 Update URL di Aplikasi

### **STEP 9: Update URL Google Form**

1. **Di Google Form, klik "Send"**

2. **Copy link:**
   ```
   https://forms.gle/xxxxxxxxxxxxx
   ```

3. **Buka file:**
   ```
   src/pages/PKManagementSimple.tsx
   ```

4. **Ganti baris 21:**
   ```typescript
   const GOOGLE_FORM_URL = 'https://forms.gle/YOUR_FORM_ID_HERE';
   ```
   Menjadi:
   ```typescript
   const GOOGLE_FORM_URL = 'https://forms.gle/xxxxxxxxxxxxx';
   ```

5. **Copy URL Google Sheets dan ganti baris 24:**
   ```typescript
   const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit';
   ```

6. **Save file**

---

## ✅ Cara Penggunaan

### **Untuk Admin:**

1. **Akses halaman PK Management:**
   ```
   http://localhost:8080/pk-management
   ```

2. **Klik tombol "Buka Google Form"**

3. **Isi form** dengan data PK

4. **Submit form**

5. **Kembali ke halaman Management**

6. **Klik "Refresh"**

7. **Data PK baru muncul!** ✅

---

## 📊 Flow Diagram

```
User mengisi Google Form
         ↓
Data masuk ke Google Sheets
         ↓
Apps Script trigger jalan
         ↓
Data dikirim ke Supabase via API
         ↓
Supabase insert ke tabel pk_officers
         ↓
Halaman Management menampilkan data baru
```

---

## 🎨 Keuntungan Sistem Ini

✅ **Mudah digunakan** - Form familiar untuk semua orang
✅ **Otomatis** - Data langsung masuk ke database
✅ **Google Sheets backup** - Data juga tersimpan di Sheets
✅ **Validation** - Form validation otomatis dari Google
✅ **Mobile-friendly** - Bisa diisi dari HP
✅ **Tidak perlu login** - Langsung isi form
✅ **History** - Semua submission tercatat di Sheets

---

## 🐛 Troubleshooting

### Problem: Data tidak masuk ke Supabase
**Solusi:**
1. Cek Apps Script execution log
2. Pastikan SUPABASE_URL dan ANON_KEY benar
3. Pastikan RLS policy allow insert
4. Test dengan function `testConnection()`

### Problem: Trigger tidak jalan
**Solusi:**
1. Cek trigger sudah dibuat dengan benar
2. Event type harus "On form submit"
3. Re-authorize jika perlu

### Problem: Form URL tidak berfungsi
**Solusi:**
1. Pastikan form sudah di-publish
2. Copy ulang URL dari tombol "Send"
3. Update di file PKManagementSimple.tsx

---

## 📱 Alternative: Embed Form

Jika ingin embed form langsung di halaman:

```typescript
<iframe 
  src="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true"
  width="100%"
  height="800"
  frameborder="0"
>
  Loading…
</iframe>
```

---

## 🔐 Security Notes

- Anon key sudah aman untuk public use
- RLS policy protect data
- Apps Script berjalan dengan permission akun Google Anda
- Jangan share Service Role Key!

---

**Status:** ✅ Ready to Use
**Last Updated:** November 2024
