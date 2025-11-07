-- Script untuk membuat user admin (Manual via Dashboard)
-- Jalankan query ini di Supabase SQL Editor setelah user terdaftar

-- CARA SETUP ADMIN:
-- 1. Daftar user baru melalui aplikasi (/auth)
-- 2. Copy user_id dari tabel auth.users
-- 3. Jalankan query berikut dengan user_id tersebut:

-- INSERT admin role untuk user tertentu
-- GANTI 'USER_ID_DISINI' dengan UUID user yang ingin dijadikan admin

-- Contoh:
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('12345678-1234-1234-1234-123456789abc', 'admin');

-- Atau gunakan function helper berikut:
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Insert admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'User % is now an admin', user_email;
END;
$$;

-- CARA MENGGUNAKAN:
-- SELECT public.make_user_admin('admin@example.com');

-- Untuk testing, buat admin dengan email tertentu:
-- 1. Daftar user dengan email: admin@bapas.go.id
-- 2. Lalu jalankan:
-- SELECT public.make_user_admin('admin@bapas.go.id');
