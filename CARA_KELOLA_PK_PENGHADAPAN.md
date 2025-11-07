# 📋 Cara Kelola Daftar PK untuk Menu Penghadapan

## ✅ Perubahan yang Sudah Dilakukan:

### **SEBELUM:**
Menu Penghadapan → Sub Menu: Lapas, Rutan, LPKA (hardcoded)

### **SESUDAH:**
Menu Penghadapan → **Langsung pilih PK Officer** (dari database yang dikelola admin)

---

## 🎯 Cara Kerja Baru:

### **1. User Klik "Penghadapan"**
- Langsung masuk ke form registrasi
- **Tidak ada sub menu** Lapas/Rutan/LPKA lagi

### **2. User Pilih PK Officer**
- Dropdown menampilkan **semua PK aktif** dari database
- PK Officer bisa dari Lapas, Rutan, LPKA, atau unit lain
- Data diambil dari tabel `pk_officers`

### **3. Admin Kelola Daftar PK**
- Buka: `http://localhost:8080/pk-management`
- Tambah/Edit/Hapus PK Officer
- Tandai PK sebagai Aktif/Tidak Aktif
- **PK yang aktif** akan muncul di dropdown

---

## 🔧 Cara Admin Mengelola PK:

### **Akses Menu PK Management:**

1. **Login sebagai admin:**
   - Email: `admin@bapas.go.id`
   - Password: `adminbapas123`

2. **Buka menu PK Management:**
   - URL: `http://localhost:8080/pk-management`
   - Atau klik menu "Manajemen PK" di dashboard

### **Tambah PK Baru:**

**Cara 1: Via SQL (Tercepat)**
```sql
INSERT INTO pk_officers (name, nip, position, phone, email, is_active)
VALUES 
  ('Nama PK', '199001012020031001', 'PK Lapas Sukamiskin', '08123456789', 'email@bapas.go.id', true);
```

**Cara 2: Via Google Sheets (Jika sudah setup)**
- Isi Google Form
- Data otomatis masuk ke database

### **Edit PK:**

Di halaman PK Management:
- **Toggle Aktif/Tidak Aktif:** Klik tombol hijau/merah
- **Hapus PK:** Klik tombol merah "Hapus"
- **Refresh Data:** Klik tombol "Refresh"

---

## 💡 Rekomendasi Penamaan PK:

Untuk memudahkan user memilih, gunakan format nama yang jelas:

### **Format 1: Nama + Unit**
```
Ahmad Fauzi - Lapas Sukamiskin
Siti Nurhaliza - Rutan Bandung
Budi Santoso - LPKA Bandung
```

### **Format 2: Nama + Jabatan + Unit**
```
Ahmad Fauzi, S.H. (PK Lapas Sukamiskin)
Siti Nurhaliza, S.Sos. (PK Rutan Bandung)
```

### **Contoh SQL Insert:**
```sql
INSERT INTO pk_officers (name, position, is_active) VALUES
  ('Ahmad Fauzi - Lapas Sukamiskin', 'Pembimbing Kemasyarakatan', true),
  ('Siti Nurhaliza - Rutan Bandung', 'Pembimbing Kemasyarakatan', true),
  ('Budi Santoso - LPKA Bandung', 'Pembimbing Kemasyarakatan', true);
```

---

## 🎯 Keuntungan Sistem Baru:

### ✅ **Fleksibel**
- Admin bisa tambah/hapus PK kapan saja
- Tidak perlu edit code

### ✅ **Dinamis**
- PK baru langsung muncul di dropdown
- PK tidak aktif otomatis hilang dari pilihan

### ✅ **Terorganisir**
- Semua PK dalam satu database
- Mudah di-manage dari satu halaman

### ✅ **Scalable**
- Bisa tambah PK sebanyak-banyaknya
- Tidak ada batasan hardcode

---

## 📊 Contoh Flow User:

```
1. User buka aplikasi
   ↓
2. Klik "Penghadapan"
   ↓
3. Langsung ke form (tidak ada sub menu)
   ↓
4. Isi nama klien
   ↓
5. Pilih PK dari dropdown:
   - Ahmad Fauzi - Lapas Sukamiskin
   - Siti Nurhaliza - Rutan Bandung
   - Budi Santoso - LPKA Bandung
   - [65 PK lainnya...]
   ↓
6. Submit → Dapat nomor antrian
```

---

## 🔄 Jika Ingin Kembali ke Sub Menu:

Jika suatu saat ingin kembali ke sistem sub menu (Lapas/Rutan/LPKA), edit file:

**File:** `src/types/queue.ts`

**Ganti:**
```typescript
penghadapan: {
  umum: 'Penghadapan',
},
```

**Jadi:**
```typescript
penghadapan: {
  lapas: 'Lapas',
  rutan: 'Rutan',
  lpka: 'LPKA',
},
```

Dan hapus auto-select di `src/pages/Index.tsx` baris 46-48.

---

## 📞 Support:

Jika ada pertanyaan atau butuh bantuan:
- Cek file: `QUICK_START_PK.md`
- Cek file: `GOOGLE_FORMS_INTEGRATION.md`
- Atau tanya di chat! 🚀
