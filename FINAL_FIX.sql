-- ============================================
-- FINAL FIX - COPY PASTE INI SEKARANG!
-- ============================================

-- Hapus tabel lama jika ada
DROP TABLE IF EXISTS public.bimbingan_clients CASCADE;

-- Buat tabel baru
CREATE TABLE public.bimbingan_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id TEXT NOT NULL,
  pk_officer_id TEXT NOT NULL,
  pk_officer_name TEXT NOT NULL,
  pk_officer_position TEXT,
  sub_service TEXT NOT NULL,
  nama_lengkap TEXT NOT NULL,
  alamat_domisili TEXT NOT NULL,
  status_pekerjaan TEXT NOT NULL,
  jenis_pekerjaan TEXT,
  whatsapp_number TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  buku_wajib_lapor_sent BOOLEAN DEFAULT FALSE,
  buku_wajib_lapor_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- RLS
ALTER TABLE public.bimbingan_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" 
ON public.bimbingan_clients 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Sample data
INSERT INTO public.bimbingan_clients (
  queue_id, pk_officer_id, pk_officer_name, pk_officer_position,
  sub_service, nama_lengkap, alamat_domisili, status_pekerjaan,
  jenis_pekerjaan, whatsapp_number
) VALUES
('TEST-001', 'pk-001', 'Test PK', 'PK Test', 'wajib_lapor', 
 'Budi Santoso', 'Jl. Test 123', 'bekerja', 'Karyawan', '628123456789'),
('TEST-002', 'pk-001', 'Test PK', 'PK Test', 'kepribadian',
 'Siti Aminah', 'Jl. Test 456', 'tidak_bekerja', '-', '628234567890');

-- Verify
SELECT 'SUCCESS! Tabel dibuat dengan ' || COUNT(*)::TEXT || ' data' as result 
FROM public.bimbingan_clients;
