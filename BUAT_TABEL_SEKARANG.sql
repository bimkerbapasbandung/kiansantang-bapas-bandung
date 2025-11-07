-- ============================================
-- COPY PASTE INI SEKARANG!
-- ============================================

DROP TABLE IF EXISTS public.bimbingan_clients CASCADE;

CREATE TABLE public.bimbingan_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id VARCHAR(50) NOT NULL,
  pk_officer_id TEXT NOT NULL,
  pk_officer_name VARCHAR(255) NOT NULL,
  pk_officer_position VARCHAR(255),
  sub_service VARCHAR(50) NOT NULL,
  nama_lengkap VARCHAR(255) NOT NULL,
  alamat_domisili TEXT NOT NULL,
  status_pekerjaan VARCHAR(20) NOT NULL,
  jenis_pekerjaan VARCHAR(255),
  whatsapp_number VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  buku_wajib_lapor_sent BOOLEAN DEFAULT FALSE,
  buku_wajib_lapor_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

ALTER TABLE public.bimbingan_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON public.bimbingan_clients FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.bimbingan_clients (queue_id, pk_officer_id, pk_officer_name, pk_officer_position, sub_service, nama_lengkap, alamat_domisili, status_pekerjaan, jenis_pekerjaan, whatsapp_number) VALUES
('BM-001', (SELECT id::TEXT FROM pk_officers LIMIT 1), 'Test PK', 'PK', 'wajib_lapor', 'Budi Santoso', 'Jl. Test', 'bekerja', 'Karyawan', '628123456789'),
('BM-002', (SELECT id::TEXT FROM pk_officers LIMIT 1), 'Test PK', 'PK', 'kepribadian', 'Siti Aminah', 'Jl. Test 2', 'tidak_bekerja', '-', '628234567890');

SELECT 'SUCCESS! Tabel dibuat dengan ' || COUNT(*)::TEXT || ' data sample' as result FROM public.bimbingan_clients;
