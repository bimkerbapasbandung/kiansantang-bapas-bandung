-- ========================================
-- CREATE DEFAULT ADMIN USER
-- Email: admin@bapas.go.id
-- Password: adminbapas123
-- ========================================

-- Note: Supabase tidak bisa langsung insert ke auth.users via SQL
-- User harus didaftar via aplikasi atau Supabase Dashboard terlebih dahulu

-- Function untuk auto-assign admin role ke email tertentu saat user daftar
CREATE OR REPLACE FUNCTION public.auto_assign_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-assign admin role untuk email tertentu
  IF NEW.email = 'admin@bapas.go.id' 
     OR NEW.email LIKE '%@admin.bapas.go.id' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger yang auto-run saat user baru daftar
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_admin_role();

-- Info: Sekarang setiap user yang daftar dengan email:
-- - admin@bapas.go.id
-- - [anything]@admin.bapas.go.id
-- Akan otomatis mendapat role admin!

-- ========================================
-- CARA PAKAI:
-- 1. Jalankan migration ini
-- 2. Daftar user baru dengan email: admin@bapas.go.id
-- 3. Otomatis jadi admin, langsung bisa akses /settings dan /pk-management
-- ========================================
