-- ============================================
-- COPY SEMUA INI DAN PASTE DI SUPABASE
-- ============================================

DROP TABLE IF EXISTS public.bimbingan_clients CASCADE;

CREATE TABLE public.bimbingan_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id VARCHAR(50) NOT NULL,
  pk_officer_id VARCHAR(255) NOT NULL,
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

CREATE INDEX idx_bimbingan_clients_queue_id ON public.bimbingan_clients(queue_id);
CREATE INDEX idx_bimbingan_clients_pk_officer_id ON public.bimbingan_clients(pk_officer_id);

ALTER TABLE public.bimbingan_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on bimbingan_clients"
ON public.bimbingan_clients
FOR ALL
USING (true)
WITH CHECK (true);

INSERT INTO public.bimbingan_clients (
  queue_id, pk_officer_id, pk_officer_name, pk_officer_position,
  sub_service, nama_lengkap, alamat_domisili, status_pekerjaan, 
  jenis_pekerjaan, whatsapp_number
) VALUES
  ('BM-WL-001', 'sample-pk-1', 'Ahmad Fauzi', 'Pembimbing Kemasyarakatan',
   'wajib_lapor', 'Budi Santoso', 'Jl. Merdeka No. 123, Bandung',
   'bekerja', 'Karyawan Swasta', '628123456789'),
  ('BM-KP-001', 'sample-pk-1', 'Ahmad Fauzi', 'Pembimbing Kemasyarakatan',
   'kepribadian', 'Siti Aminah', 'Jl. Sudirman No. 456, Bandung',
   'tidak_bekerja', '-', '628234567890');

SELECT COUNT(*) as total_klien FROM public.bimbingan_clients;
