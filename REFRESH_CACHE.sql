-- ============================================
-- COPY PASTE INI UNTUK REFRESH CACHE
-- ============================================

-- 1. Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';

-- 2. Verify tabel ada
SELECT 
  'Tabel bimbingan_clients ADA dengan ' || COUNT(*)::TEXT || ' rows' as status
FROM bimbingan_clients;

-- 3. Test insert
INSERT INTO bimbingan_clients (
  queue_id, pk_officer_id, pk_officer_name, pk_officer_position,
  sub_service, nama_lengkap, alamat_domisili, status_pekerjaan,
  jenis_pekerjaan, whatsapp_number
) VALUES (
  'TEST-' || NOW()::TEXT,
  'test-pk',
  'Test PK',
  'PK Test',
  'wajib_lapor',
  'Test User',
  'Jl. Test',
  'bekerja',
  'Karyawan',
  '628123456789'
) RETURNING id, queue_id, nama_lengkap;

-- 4. Verify lagi
SELECT COUNT(*) as total_rows FROM bimbingan_clients;
