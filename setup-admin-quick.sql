-- ========================================
-- QUICK SETUP ADMIN USER
-- Copy-paste script ini ke Supabase SQL Editor
-- ========================================

-- STEP 1: Cek user yang sudah terdaftar
-- (Pastikan user sudah daftar via aplikasi /auth terlebih dahulu)
SELECT 
  id, 
  email, 
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- ========================================
-- STEP 2: Jadikan user menjadi admin
-- GANTI 'admin@bapas.go.id' dengan email user yang ingin dijadikan admin
-- ========================================

-- Cara 1: Menggunakan function helper (RECOMMENDED)
SELECT public.make_user_admin('admin@bapas.go.id');

-- Cara 2: Insert manual
-- GANTI 'USER_ID_DISINI' dengan UUID dari STEP 1
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('USER_ID_DISINI', 'admin');

-- ========================================
-- STEP 3: Verifikasi admin berhasil dibuat
-- ========================================
SELECT 
  u.email,
  ur.role,
  ur.created_at as role_assigned_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';

-- ========================================
-- BONUS: Setup multiple admin sekaligus
-- ========================================
-- SELECT public.make_user_admin('admin@bapas.go.id');
-- SELECT public.make_user_admin('budi@bapas.go.id');
-- SELECT public.make_user_admin('siti@bapas.go.id');

-- ========================================
-- SELESAI! 
-- Sekarang user bisa login sebagai admin
-- dan akses /settings & /pk-management
-- ========================================
