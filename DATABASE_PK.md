# 📊 Database Pembimbing Kemasyarakatan (PK)

## 🎯 Overview

Database untuk mengelola data Pembimbing Kemasyarakatan (PK) dengan fitur CRUD lengkap dan halaman manajemen untuk admin.

---

## 🗄️ Struktur Database

### Tabel: `pk_officers`

```sql
CREATE TABLE public.pk_officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  nip VARCHAR(50) UNIQUE,
  position VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);
```

### Kolom:

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary key, auto-generated |
| `name` | VARCHAR(255) | Nama lengkap PK (wajib) |
| `nip` | VARCHAR(50) | Nomor Induk Pegawai (unique, opsional) |
| `position` | VARCHAR(100) | Jabatan (wajib) |
| `phone` | VARCHAR(20) | Nomor telepon (opsional) |
| `email` | VARCHAR(255) | Email (opsional) |
| `is_active` | BOOLEAN | Status aktif/tidak aktif (default: true) |
| `created_at` | TIMESTAMP | Waktu dibuat (auto) |
| `updated_at` | TIMESTAMP | Waktu diupdate (auto) |
| `created_by` | UUID | User yang membuat (opsional) |
| `updated_by` | UUID | User yang mengupdate (opsional) |

### Indexes:
- `idx_pk_officers_active` - Index pada `is_active`
- `idx_pk_officers_name` - Index pada `name`
- `idx_pk_officers_nip` - Index pada `nip`

---

## 🔒 Row Level Security (RLS)

### Policies:

1. **Anyone can view active PK officers**
   - Public dapat melihat PK yang aktif
   - Untuk form pendaftaran antrian

2. **Authenticated users can view all PK officers**
   - User yang login bisa lihat semua (aktif & tidak aktif)
   - Untuk operator dan admin

3. **Only admins can insert/update/delete**
   - Hanya admin yang bisa mengelola data PK
   - Menggunakan fungsi `has_role(auth.uid(), 'admin')`

---

## 🎨 Halaman Manajemen PK

### Route: `/pk-management`

**Akses:** Admin only (protected route)

### Fitur:

#### 1. **Dashboard Statistics**
- Total PK
- Jumlah PK Aktif
- Jumlah PK Tidak Aktif
- Icon visual dengan warna

#### 2. **Search & Filter**
- Search bar untuk cari nama, NIP, atau jabatan
- Toggle "Tampilkan Aktif Saja"
- Real-time filtering

#### 3. **Table View**
Kolom:
- Nama
- NIP
- Jabatan
- Kontak (phone + email)
- Status (badge warna)
- Aksi (Edit & Delete)

#### 4. **Add/Edit Dialog**
Form fields:
- Nama Lengkap * (wajib)
- NIP (opsional)
- Jabatan * (wajib)
- No. Telepon (opsional)
- Email (opsional)
- Toggle Aktif/Tidak Aktif

#### 5. **Actions**
- **Tambah PK** - Dialog form untuk tambah PK baru
- **Edit** - Edit data PK yang sudah ada
- **Delete** - Hapus PK (dengan konfirmasi)
- **Toggle Status** - Aktifkan/nonaktifkan PK (klik badge status)

---

## 📝 Sample Data

Database sudah include 8 PK contoh:

1. Ahmad Fauzi, S.H. - Pembimbing Kemasyarakatan Ahli Pertama
2. Siti Nurhaliza, S.Sos. - Pembimbing Kemasyarakatan Ahli Pertama
3. Budi Santoso, S.H., M.H. - Pembimbing Kemasyarakatan Ahli Muda
4. Ratna Dewi, S.Psi. - Pembimbing Kemasyarakatan Ahli Pertama
5. Dedi Kurniawan, S.E. - Pembimbing Kemasyarakatan
6. Maya Puspitasari, S.Sos. - Pembimbing Kemasyarakatan Ahli Pertama
7. Rizki Pratama, S.H. - Pembimbing Kemasyarakatan
8. Eka Wahyuni, S.Psi. - Pembimbing Kemasyarakatan Ahli Pertama

---

## 🚀 Setup & Migration

### 1. Jalankan Migration

Migration file: `20251105000000_create_pk_officers_table.sql`

```bash
# Jika menggunakan Supabase CLI
supabase db push

# Atau manual via Supabase Dashboard
# Copy isi file SQL dan execute di SQL Editor
```

### 2. Akses Halaman Management

```
http://localhost:8080/pk-management
```

**Note:** Harus login sebagai admin terlebih dahulu

---

## 🔗 Integrasi dengan Form Pendaftaran

Form pendaftaran antrian sudah terintegrasi dengan database PK:

```typescript
// Di RegistrationForm.tsx
const { data, error } = await supabase
  .from('pk_officers')
  .select('*')
  .eq('is_active', true)
  .order('name');
```

Dropdown PK akan otomatis load dari database dan hanya menampilkan PK yang aktif.

---

## 📊 View: pk_officers_stats

View untuk statistik agregat:

```sql
CREATE VIEW pk_officers_stats AS
SELECT 
  COUNT(*) as total_officers,
  COUNT(*) FILTER (WHERE is_active = true) as active_officers,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_officers
FROM pk_officers;
```

Query:
```sql
SELECT * FROM pk_officers_stats;
```

---

## 🎯 Cara Menggunakan

### Untuk Admin:

1. **Login sebagai Admin**
   - Buka `/auth`
   - Login dengan akun admin

2. **Buka Settings**
   - Dari dashboard operator → Settings
   - Atau langsung ke `/settings`

3. **Klik "Kelola PK"**
   - Tombol di kanan atas
   - Akan redirect ke `/pk-management`

4. **Kelola Data PK**
   - **Tambah:** Klik tombol "Tambah PK"
   - **Edit:** Klik icon pensil pada row PK
   - **Hapus:** Klik icon trash (akan ada konfirmasi)
   - **Ubah Status:** Klik badge status (Aktif/Tidak Aktif)

5. **Cari PK**
   - Gunakan search bar untuk cari cepat
   - Toggle "Tampilkan Aktif Saja" untuk filter

### Untuk Operator/User:

- PK yang aktif otomatis muncul di dropdown form pendaftaran
- Tidak perlu akses ke halaman management
- Data selalu up-to-date

---

## 🔧 API Endpoints

### Get All PK (Authenticated)
```typescript
const { data } = await supabase
  .from('pk_officers')
  .select('*')
  .order('name');
```

### Get Active PK Only (Public)
```typescript
const { data } = await supabase
  .from('pk_officers')
  .select('*')
  .eq('is_active', true)
  .order('name');
```

### Insert New PK (Admin only)
```typescript
const { error } = await supabase
  .from('pk_officers')
  .insert({
    name: 'Nama PK',
    nip: '199001012015031001',
    position: 'Jabatan',
    phone: '08123456789',
    email: 'email@bapas.go.id',
    is_active: true
  });
```

### Update PK (Admin only)
```typescript
const { error } = await supabase
  .from('pk_officers')
  .update({ is_active: false })
  .eq('id', 'uuid-pk');
```

### Delete PK (Admin only)
```typescript
const { error } = await supabase
  .from('pk_officers')
  .delete()
  .eq('id', 'uuid-pk');
```

---

## ⚠️ Validasi

### Client-side:
- Nama: wajib diisi
- Jabatan: wajib diisi
- NIP: unique (akan error jika duplikat)
- Email: format email valid

### Database:
- `name` NOT NULL
- `position` NOT NULL
- `nip` UNIQUE
- `is_active` DEFAULT true

---

## 🎨 UI Components

File: `src/pages/PKManagement.tsx`

Menggunakan:
- `shadcn/ui` components (Dialog, Card, Table, Switch, etc.)
- `lucide-react` icons
- `sonner` untuk toast notifications
- Real-time filtering dengan React state

---

## 📱 Responsive Design

- Table responsive dengan horizontal scroll
- Dialog form responsive
- Mobile-friendly layout
- Touch-friendly buttons

---

## 🔐 Security

✅ Row Level Security enabled
✅ Only admins can modify data
✅ Public can only read active officers
✅ Authenticated users can read all
✅ NIP uniqueness constraint
✅ SQL injection prevention (via Supabase)

---

## 📈 Performance

- Indexes pada kolom yang sering di-query
- Efficient filtering dengan RLS
- Auto-generated timestamps
- Minimal database calls

---

## 🆘 Troubleshooting

**Q: PK tidak muncul di dropdown form?**
- Pastikan PK status aktif (`is_active = true`)
- Refresh halaman
- Check console untuk error

**Q: Tidak bisa tambah/edit PK?**
- Pastikan login sebagai admin
- Check user role di database

**Q: Error "NIP sudah terdaftar"?**
- NIP harus unique
- Coba NIP berbeda atau kosongkan field NIP

**Q: Tombol "Kelola PK" tidak muncul?**
- Hanya muncul di halaman Settings
- Hanya untuk user dengan role admin

---

## 📋 Checklist Setup

- [x] Migration file created
- [x] Table structure defined
- [x] RLS policies configured
- [x] Indexes created
- [x] Sample data inserted
- [x] Management page created
- [x] Route added to App.tsx
- [x] Link added to Settings page
- [x] Integration with registration form
- [x] Documentation complete

---

**Status:** ✅ Ready to Use
**Last Updated:** November 2024
