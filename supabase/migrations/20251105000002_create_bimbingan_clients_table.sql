-- Create table for Bimbingan Clients
CREATE TABLE IF NOT EXISTS public.bimbingan_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id VARCHAR(50) NOT NULL,
  pk_officer_id UUID REFERENCES public.pk_officers(id),
  pk_officer_name VARCHAR(255) NOT NULL,
  pk_officer_position VARCHAR(255),
  sub_service VARCHAR(50) NOT NULL CHECK (sub_service IN ('wajib_lapor', 'kepribadian', 'kemandirian')),
  nama_lengkap VARCHAR(255) NOT NULL,
  alamat_domisili TEXT NOT NULL,
  status_pekerjaan VARCHAR(20) NOT NULL CHECK (status_pekerjaan IN ('bekerja', 'tidak_bekerja')),
  jenis_pekerjaan VARCHAR(255),
  whatsapp_number VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'inactive')),
  buku_wajib_lapor_sent BOOLEAN DEFAULT FALSE,
  buku_wajib_lapor_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Create indexes
CREATE INDEX idx_bimbingan_clients_queue_id ON public.bimbingan_clients(queue_id);
CREATE INDEX idx_bimbingan_clients_pk_officer_id ON public.bimbingan_clients(pk_officer_id);
CREATE INDEX idx_bimbingan_clients_sub_service ON public.bimbingan_clients(sub_service);
CREATE INDEX idx_bimbingan_clients_status ON public.bimbingan_clients(status);
CREATE INDEX idx_bimbingan_clients_created_at ON public.bimbingan_clients(created_at DESC);
CREATE INDEX idx_bimbingan_clients_whatsapp ON public.bimbingan_clients(whatsapp_number);

-- Enable RLS
ALTER TABLE public.bimbingan_clients ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all operations (simplified for now)
CREATE POLICY "Allow all operations on bimbingan_clients"
ON public.bimbingan_clients
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_bimbingan_clients_updated_at
BEFORE UPDATE ON public.bimbingan_clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create view for PK to see their clients
CREATE OR REPLACE VIEW public.pk_clients_view AS
SELECT 
  bc.id,
  bc.queue_id,
  bc.pk_officer_id,
  bc.pk_officer_name,
  bc.sub_service,
  bc.nama_lengkap,
  bc.alamat_domisili,
  bc.status_pekerjaan,
  bc.jenis_pekerjaan,
  bc.whatsapp_number,
  bc.status,
  bc.buku_wajib_lapor_sent,
  bc.created_at,
  bc.updated_at,
  CASE 
    WHEN bc.sub_service = 'wajib_lapor' THEN 'Wajib Lapor'
    WHEN bc.sub_service = 'kepribadian' THEN 'Kepribadian'
    WHEN bc.sub_service = 'kemandirian' THEN 'Kemandirian'
  END as sub_service_label
FROM public.bimbingan_clients bc
ORDER BY bc.created_at DESC;

-- Grant access to view
GRANT SELECT ON public.pk_clients_view TO authenticated, anon;

-- Sample data for testing
INSERT INTO public.bimbingan_clients (
  queue_id, pk_officer_id, pk_officer_name, pk_officer_position,
  sub_service, nama_lengkap, alamat_domisili, status_pekerjaan, 
  jenis_pekerjaan, whatsapp_number
) VALUES
  (
    'BM-WL-001',
    (SELECT id FROM public.pk_officers LIMIT 1),
    (SELECT name FROM public.pk_officers LIMIT 1),
    (SELECT position FROM public.pk_officers LIMIT 1),
    'wajib_lapor',
    'Ahmad Fauzi',
    'Jl. Merdeka No. 123, Bandung',
    'bekerja',
    'Karyawan Swasta',
    '628123456789'
  ),
  (
    'BM-KP-001',
    (SELECT id FROM public.pk_officers LIMIT 1),
    (SELECT name FROM public.pk_officers LIMIT 1),
    (SELECT position FROM public.pk_officers LIMIT 1),
    'kepribadian',
    'Siti Nurhaliza',
    'Jl. Sudirman No. 456, Bandung',
    'tidak_bekerja',
    '-',
    '628234567890'
  );
