CREATE TABLE bimbingan_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id TEXT,
  pk_officer_id TEXT,
  pk_officer_name TEXT,
  pk_officer_position TEXT,
  sub_service TEXT,
  nama_lengkap TEXT,
  alamat_domisili TEXT,
  status_pekerjaan TEXT,
  jenis_pekerjaan TEXT,
  whatsapp_number TEXT,
  status TEXT DEFAULT 'active',
  buku_wajib_lapor_sent BOOLEAN DEFAULT FALSE,
  buku_wajib_lapor_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

ALTER TABLE bimbingan_clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON bimbingan_clients FOR ALL USING (true) WITH CHECK (true);

SELECT 'Table created!' as result;
