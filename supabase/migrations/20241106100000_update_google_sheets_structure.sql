-- Update Google Sheets Integration Structure
-- Data PK: Hanya Nama dan Jabatan
-- Data Klien: Nama, Kontak, Alamat, Status Bekerja, Jenis Pekerjaan, Status Wajib Lapor, Catatan

-- Remove unnecessary columns from pk_officers (keep it simple)
ALTER TABLE pk_officers DROP COLUMN IF EXISTS email;
ALTER TABLE pk_officers DROP COLUMN IF EXISTS phone;

-- Keep only essential fields for PK
-- pk_officers now has: id, name, position, is_active, sheet_id, last_synced_at

-- Update bimbingan_clients table for new client data structure
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS contact TEXT; -- Nomor telepon/WA
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS employment_status TEXT CHECK (employment_status IN ('Bekerja', 'Tidak Bekerja'));
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS job_type TEXT; -- Jenis pekerjaan
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS reporting_status TEXT CHECK (reporting_status IN ('Wajib Lapor', 'Tidak Wajib Lapor'));
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS synced_from_sheets BOOLEAN DEFAULT FALSE;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS sheet_row_number INTEGER; -- Track row number in sheet

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_bimbingan_clients_contact ON bimbingan_clients(contact);
CREATE INDEX IF NOT EXISTS idx_bimbingan_clients_employment_status ON bimbingan_clients(employment_status);
CREATE INDEX IF NOT EXISTS idx_bimbingan_clients_reporting_status ON bimbingan_clients(reporting_status);
CREATE INDEX IF NOT EXISTS idx_bimbingan_clients_synced ON bimbingan_clients(synced_from_sheets);

-- Add comments for documentation
COMMENT ON COLUMN pk_officers.name IS 'Nama lengkap Pembimbing Kemasyarakatan';
COMMENT ON COLUMN pk_officers.position IS 'Jabatan PK (contoh: PK Pratama, PK Muda, PK Madya)';
COMMENT ON COLUMN pk_officers.sheet_id IS 'ID sheet Google Sheets untuk klien PK ini (contoh: Klien_PK001)';

COMMENT ON COLUMN bimbingan_clients.client_name IS 'Nama lengkap klien';
COMMENT ON COLUMN bimbingan_clients.contact IS 'Nomor telepon/WhatsApp klien';
COMMENT ON COLUMN bimbingan_clients.address IS 'Alamat lengkap klien';
COMMENT ON COLUMN bimbingan_clients.employment_status IS 'Status pekerjaan: Bekerja atau Tidak Bekerja';
COMMENT ON COLUMN bimbingan_clients.job_type IS 'Jenis pekerjaan klien (jika bekerja)';
COMMENT ON COLUMN bimbingan_clients.reporting_status IS 'Status wajib lapor: Wajib Lapor atau Tidak Wajib Lapor';
COMMENT ON COLUMN bimbingan_clients.notes IS 'Catatan tambahan tentang klien';
COMMENT ON COLUMN bimbingan_clients.sheet_row_number IS 'Nomor baris di Google Sheets untuk tracking';

-- Create or replace view for easy client data access
CREATE OR REPLACE VIEW client_data_view AS
SELECT 
  bc.id,
  bc.client_name,
  bc.contact,
  bc.address,
  bc.employment_status,
  bc.job_type,
  bc.reporting_status,
  bc.notes,
  bc.pk_officer_id,
  po.name as pk_name,
  po.position as pk_position,
  bc.created_at,
  bc.synced_from_sheets
FROM bimbingan_clients bc
LEFT JOIN pk_officers po ON bc.pk_officer_id = po.id
WHERE bc.synced_from_sheets = true
ORDER BY bc.created_at DESC;

-- Grant permissions
GRANT SELECT ON client_data_view TO authenticated;

-- Update sync_logs to track client sync details
ALTER TABLE sync_logs ADD COLUMN IF NOT EXISTS clients_added INTEGER DEFAULT 0;
ALTER TABLE sync_logs ADD COLUMN IF NOT EXISTS clients_updated INTEGER DEFAULT 0;

COMMENT ON TABLE client_data_view IS 'View untuk melihat data klien lengkap dengan info PK';
COMMENT ON TABLE sync_logs IS 'Log sinkronisasi Google Sheets dengan detail jumlah klien';
