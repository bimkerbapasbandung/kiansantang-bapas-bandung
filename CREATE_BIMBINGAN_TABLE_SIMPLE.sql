-- ============================================
-- SIMPLE VERSION: Create Bimbingan Clients Table
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop table if exists (untuk fresh start)
DROP TABLE IF EXISTS public.bimbingan_clients CASCADE;

-- Create table
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

-- Create indexes
CREATE INDEX idx_bimbingan_clients_queue_id ON public.bimbingan_clients(queue_id);
CREATE INDEX idx_bimbingan_clients_pk_officer_id ON public.bimbingan_clients(pk_officer_id);
CREATE INDEX idx_bimbingan_clients_sub_service ON public.bimbingan_clients(sub_service);
CREATE INDEX idx_bimbingan_clients_status ON public.bimbingan_clients(status);
CREATE INDEX idx_bimbingan_clients_created_at ON public.bimbingan_clients(created_at DESC);

-- Enable RLS
ALTER TABLE public.bimbingan_clients ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all operations
CREATE POLICY "Allow all operations on bimbingan_clients"
ON public.bimbingan_clients
FOR ALL
USING (true)
WITH CHECK (true);

-- Insert sample data untuk testing
INSERT INTO public.bimbingan_clients (
  queue_id, pk_officer_id, pk_officer_name, pk_officer_position,
  sub_service, nama_lengkap, alamat_domisili, status_pekerjaan, 
  jenis_pekerjaan, whatsapp_number
) VALUES
  (
    'BM-WL-001',
    'sample-pk-1',
    'Ahmad Fauzi',
    'Pembimbing Kemasyarakatan',
    'wajib_lapor',
    'Budi Santoso',
    'Jl. Merdeka No. 123, Bandung',
    'bekerja',
    'Karyawan Swasta',
    '628123456789'
  ),
  (
    'BM-KP-001',
    'sample-pk-1',
    'Ahmad Fauzi',
    'Pembimbing Kemasyarakatan',
    'kepribadian',
    'Siti Aminah',
    'Jl. Sudirman No. 456, Bandung',
    'tidak_bekerja',
    '-',
    '628234567890'
  );

-- Verify data
SELECT COUNT(*) as total_klien FROM public.bimbingan_clients;
SELECT * FROM public.bimbingan_clients ORDER BY created_at DESC LIMIT 5;

-- ============================================
-- DONE! Table created successfully
-- ============================================
