# 🔐 Setup Admin User - Panduan Lengkap

## Cara 1: Via Aplikasi + SQL (RECOMMENDED) ✅

### Step 1: Daftar User Baru
1. Buka browser: `http://localhost:8080/auth`
2. Isi form Sign Up:
   - **Email:** `admin@bapas.go.id`
   - **Password:** `adminbapas123` (ganti dengan password kuat)
3. Klik **"Sign Up"**
4. User akan otomatis terdaftar di Supabase

### Step 2: Jadikan Admin
1. Buka **Supabase Dashboard** (https://supabase.com/dashboard)
2. Pilih project Anda
3. Klik **"SQL Editor"** di sidebar kiri
4. Copy-paste query ini:

```sql
-- Cari user yang baru didaftarkan
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@bapas.go.id';
```

5. Klik **"Run"** - catat `id` yang muncul (UUID)

6. Jalankan query untuk tambah role admin:

```sql
-- GANTI 'USER_ID_DISINI' dengan UUID dari query di atas
INSERT INTO public.user_roles (user_id, role) 
VALUES ('USER_ID_DISINI', 'admin');

-- Contoh:
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('12345678-1234-1234-1234-123456789abc', 'admin');
```

7. Verifikasi:
```sql
SELECT u.email, ur.role 
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@bapas.go.id';
```

### Step 3: Test Login
1. Logout dari aplikasi (jika sudah login)
2. Buka: `http://localhost:8080/auth`
3. Login dengan:
   - Email: `admin@bapas.go.id`
   - Password: (password yang Anda buat)
4. Setelah login, coba akses: `http://localhost:8080/settings`
5. Anda harus bisa melihat tombol "Kelola PK"

---

## Cara 2: Menggunakan Function Helper (MUDAH) ⚡

Jika sudah ada user terdaftar, gunakan function helper:

```sql
-- Jadikan user menjadi admin berdasarkan email
SELECT public.make_user_admin('email@user.com');

-- Contoh:
SELECT public.make_user_admin('admin@bapas.go.id');
SELECT public.make_user_admin('budi@bapas.go.id');
SELECT public.make_user_admin('siti@bapas.go.id');
```

**Result:** `User email@user.com is now an admin`

---

## Cara 3: Insert Manual (untuk Multiple Users) 📝

Jika ingin setup beberapa admin sekaligus:

```sql
-- 1. Lihat semua user yang terdaftar
SELECT id, email, created_at FROM auth.users;

-- 2. Insert admin role untuk beberapa user
INSERT INTO public.user_roles (user_id, role) VALUES
  ('user-id-1', 'admin'),
  ('user-id-2', 'admin'),
  ('user-id-3', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

---

## 🔍 Verifikasi Admin

### Query 1: Lihat Semua Admin
```sql
SELECT 
  u.email,
  u.created_at as registered_at,
  ur.role,
  ur.created_at as role_assigned_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY ur.created_at DESC;
```

### Query 2: Cek Role Specific User
```sql
SELECT 
  u.email,
  ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@bapas.go.id';
```

### Query 3: Lihat Semua User dengan Role
```sql
SELECT 
  u.email,
  COALESCE(ur.role::text, 'user') as role,
  u.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;
```

---

## 🗑️ Hapus Role Admin (jika perlu)

```sql
-- Hapus role admin dari user
DELETE FROM public.user_roles 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@bapas.go.id'
)
AND role = 'admin';
```

---

## 🎯 Akses yang Tersedia untuk Admin

Setelah menjadi admin, user bisa akses:

| Halaman | Route | Fitur |
|---------|-------|-------|
| **Operator** | `/operator` | Dashboard operator |
| **Statistics** | `/statistics` | Laporan & statistik |
| **Settings** | `/settings` | Pengaturan display |
| **PK Management** | `/pk-management` | Kelola data PK |

User biasa hanya bisa akses:
- Operator dashboard (`/operator`)
- Statistics (`/statistics`)

---

## 📋 Quick Reference

### Default Admin Credentials (untuk testing)
```
Email: admin@bapas.go.id
Password: Admin123! (GANTI SETELAH LOGIN PERTAMA!)
```

### Quick SQL Commands

**Buat admin dari email:**
```sql
SELECT public.make_user_admin('email@example.com');
```

**Lihat semua admin:**
```sql
SELECT u.email FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
```

**Cek apakah user adalah admin:**
```sql
SELECT public.has_role(
  (SELECT id FROM auth.users WHERE email = 'admin@bapas.go.id'),
  'admin'
);
-- Result: true atau false
```

---

## ⚠️ Troubleshooting

### Problem: "Function make_user_admin doesn't exist"
**Solusi:** Jalankan migration file:
```sql
-- Copy dari: supabase/migrations/20251105000100_create_admin_user.sql
-- Paste di SQL Editor dan Run
```

### Problem: "Cannot access /settings or /pk-management"
**Solusi:** 
1. Logout dan login ulang
2. Verifikasi role di database
3. Clear browser cache

### Problem: "User not found"
**Solusi:**
1. Pastikan user sudah daftar via aplikasi
2. Cek di auth.users:
   ```sql
   SELECT * FROM auth.users WHERE email = 'admin@bapas.go.id';
   ```

### Problem: "Already has admin role"
**Error:** `duplicate key value violates unique constraint`
**Solusi:** User sudah admin, tidak perlu insert lagi

---

## 🔒 Security Best Practices

1. **Strong Password**
   - Minimal 8 karakter
   - Kombinasi huruf besar, kecil, angka, simbol
   - Jangan gunakan password default!

2. **Limited Admin Access**
   - Hanya berikan role admin ke user yang perlu
   - Review admin list secara berkala

3. **Audit Log**
   ```sql
   -- Lihat aktivitas admin
   SELECT * FROM public.user_roles 
   WHERE role = 'admin'
   ORDER BY created_at DESC;
   ```

4. **Backup Admin**
   - Setup minimal 2 admin user
   - Jaga kredensial dengan aman

---

## 📞 Need Help?

Jika masih ada masalah:
1. Check Supabase logs
2. Verify migrations sudah jalan
3. Test dengan user baru
4. Contact developer

---

**Last Updated:** November 2024
