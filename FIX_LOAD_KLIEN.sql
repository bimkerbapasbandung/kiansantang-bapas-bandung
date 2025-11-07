-- ============================================
-- FIX: Gagal Memuat Data Klien
-- ============================================
-- COPY PASTE INI DI SUPABASE SQL EDITOR
-- ============================================

-- STEP 1: Cek apakah ada data klien
SELECT COUNT(*) as total_klien FROM public.bimbingan_clients;

-- STEP 2: Lihat semua data klien
SELECT 
  id,
  pk_officer_id,
  pk_officer_name,
  nama_lengkap,
  sub_service,
  created_at
FROM public.bimbingan_clients
ORDER BY created_at DESC;

-- STEP 3: Lihat semua PK officers
SELECT 
  id,
  name,
  position,
  is_active
FROM public.pk_officers
WHERE is_active = true
ORDER BY name;

-- STEP 4: Update pk_officer_id di bimbingan_clients agar match dengan pk_officers
-- (Ganti dengan ID PK yang sebenarnya dari tabel pk_officers)

-- Ambil ID PK pertama
DO $$
DECLARE
  first_pk_id UUID;
BEGIN
  -- Get first PK officer ID
  SELECT id INTO first_pk_id FROM public.pk_officers WHERE is_active = true LIMIT 1;
  
  -- Update all bimbingan_clients to use this PK ID
  UPDATE public.bimbingan_clients
  SET pk_officer_id = first_pk_id::TEXT
  WHERE pk_officer_id = 'sample-pk-1';
  
  RAISE NOTICE 'Updated pk_officer_id to: %', first_pk_id;
END $$;

-- STEP 5: Verify update
SELECT 
  bc.id,
  bc.pk_officer_id,
  bc.pk_officer_name,
  bc.nama_lengkap,
  po.name as pk_name_from_table
FROM public.bimbingan_clients bc
LEFT JOIN public.pk_officers po ON bc.pk_officer_id = po.id::TEXT
ORDER BY bc.created_at DESC;

-- STEP 6: Test query yang digunakan aplikasi
-- (Ganti 'PASTE_PK_ID_DISINI' dengan ID PK yang mau di-test)
SELECT * FROM public.bimbingan_clients
WHERE pk_officer_id = 'PASTE_PK_ID_DISINI'
  AND status = 'active'
ORDER BY created_at DESC;

-- ============================================
-- HASIL YANG DIHARAPKAN:
-- - STEP 1: Harus ada minimal 2 klien
-- - STEP 2: Harus muncul list klien
-- - STEP 3: Harus muncul list PK
-- - STEP 4: Update berhasil
-- - STEP 5: pk_name_from_table harus terisi (tidak NULL)
-- - STEP 6: Harus muncul klien untuk PK tersebut
-- ============================================
