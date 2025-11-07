# 📱 Setup WhatsApp BAPAS Bandung

## 🎯 Cara Kerja Sistem WhatsApp

### **Flow Pengiriman Pesan:**

```
1. User isi form + nomor WhatsApp
   ↓
2. Submit → Dapat nomor antrian
   ↓
3. Klik "Kirim ke WhatsApp"
   ↓
4. Buka WhatsApp Web/Desktop BAPAS
   ↓
5. Pesan sudah ter-generate otomatis
   ↓
6. Operator klik "Send"
   ↓
7. User terima pesan di WhatsApp ✅
```

---

## ⚙️ Setup Nomor WhatsApp BAPAS

### **STEP 1: Siapkan Nomor WhatsApp BAPAS**

**Opsi A: WhatsApp Business (Recommended)**
- Download WhatsApp Business
- Daftar dengan nomor kantor BAPAS
- Verifikasi nomor
- Setup profil bisnis

**Opsi B: WhatsApp Regular**
- Gunakan nomor kantor yang ada
- Install WhatsApp Web di komputer operator

---

### **STEP 2: Update Nomor di Aplikasi**

Edit file: `src/components/QueueTicket.tsx`

**Cari baris 57:**
```typescript
const BAPAS_WHATSAPP = '6282117001234'; // ⚠️ GANTI INI!
```

**Ganti dengan nomor BAPAS:**
```typescript
const BAPAS_WHATSAPP = '628221234567'; // Nomor WhatsApp BAPAS
```

Format:
- Mulai dengan `62` (kode Indonesia)
- Tanpa `+` atau spasi
- Contoh: `628221234567`

---

## 📋 Format Pesan yang Dikirim

```
*BAPAS BANDUNG*
_Sistem Antrian Layanan_

━━━━━━━━━━━━━━━━━━━━

*NOMOR ANTRIAN ANDA*

📋 Nomor: *PH-002*
👤 Pengguna: Lapas Sukamiskin (2 klien)
🏢 Layanan: Penghadapan
📅 Waktu: 05/11/2025, 21:44:15

━━━━━━━━━━━━━━━━━━━━

✅ Antrian Anda telah terdaftar
⏰ Mohon menunggu panggilan
📍 Lokasi: BAPAS Kelas I Bandung

_Terima kasih telah menggunakan layanan kami_
```

---

## 🚀 Cara Penggunaan (Operator)

### **1. User Submit Form**
- User isi form penghadapan
- Masukkan nomor WhatsApp
- Submit

### **2. Operator Kirim Pesan**
- Setelah ticket muncul
- Klik tombol **"Kirim ke WhatsApp"**
- WhatsApp Web/Desktop terbuka
- Pesan sudah ter-generate
- **Klik "Send"** di WhatsApp
- Done! ✅

---

## 💡 Tips & Best Practices

### **1. Login WhatsApp Web**
- Buka: https://web.whatsapp.com
- Scan QR code dengan HP BAPAS
- Centang "Keep me signed in"
- Jangan logout

### **2. Komputer Operator**
- Install WhatsApp Desktop (lebih stabil)
- Download: https://www.whatsapp.com/download
- Login sekali, tetap login

### **3. Multiple Operator**
- Gunakan 1 nomor WhatsApp BAPAS
- Login di beberapa komputer (max 4 device)
- Semua operator bisa kirim dari nomor yang sama

### **4. Template Pesan**
- Pesan otomatis ter-generate
- Konsisten untuk semua user
- Professional & informatif

---

## 🔧 Troubleshooting

### **❌ WhatsApp tidak terbuka**
**Solusi:**
- Pastikan WhatsApp Web sudah login
- Coba refresh WhatsApp Web
- Restart browser

### **❌ Pesan tidak terkirim**
**Solusi:**
- Cek koneksi internet
- Pastikan nomor user valid
- Cek WhatsApp tidak di-block

### **❌ Nomor tidak valid**
**Solusi:**
- Validasi nomor minimal 10 digit
- Format otomatis ke 62xxx
- User harus isi nomor aktif

---

## 🎯 Alternatif: WhatsApp Business API

Untuk pengiriman otomatis tanpa operator, gunakan WhatsApp Business API:

### **Provider Rekomendasi:**
1. **Fonnte** (Indonesia)
   - https://fonnte.com
   - Harga: Rp 50.000/bulan
   - Mudah integrate

2. **Wablas** (Indonesia)
   - https://wablas.com
   - Harga: Rp 100.000/bulan
   - Fitur lengkap

3. **Twilio** (Global)
   - https://twilio.com
   - Pay per message
   - Enterprise grade

### **Cara Integrate API:**
1. Daftar di provider
2. Dapat API key
3. Update code untuk hit API
4. Pesan terkirim otomatis

---

## 📊 Monitoring

### **Track Pesan:**
- Simpan log di database
- Kolom: `whatsapp_sent_at`
- Status: `pending`, `sent`, `failed`

### **SQL untuk Monitoring:**
```sql
-- Lihat antrian yang sudah kirim WhatsApp
SELECT 
  queue_id,
  nama_klien,
  whatsapp_number,
  whatsapp_sent_at,
  created_at
FROM penghadapan_submissions
WHERE whatsapp_sent_at IS NOT NULL
ORDER BY created_at DESC;
```

---

## 🔐 Keamanan

### **Best Practices:**
- ✅ Jangan share nomor WhatsApp BAPAS
- ✅ Logout WhatsApp Web saat tidak digunakan
- ✅ Gunakan komputer yang aman
- ✅ Backup chat penting
- ✅ Monitor penggunaan

---

## 📞 Kontak Support

Jika ada masalah:
1. Cek dokumentasi ini
2. Test dengan nomor sendiri dulu
3. Pastikan WhatsApp Web aktif
4. Hubungi IT support jika perlu

---

## ✅ Checklist Setup

- [ ] Siapkan nomor WhatsApp BAPAS
- [ ] Install WhatsApp Business/Regular
- [ ] Login WhatsApp Web di komputer operator
- [ ] Update nomor di `QueueTicket.tsx` baris 57
- [ ] Test kirim ke nomor sendiri
- [ ] Train operator cara penggunaan
- [ ] Monitor pengiriman pesan
- [ ] Backup & maintain

---

**Sistem siap digunakan! Operator tinggal klik "Kirim ke WhatsApp" dan pesan otomatis ter-generate!** 🚀
