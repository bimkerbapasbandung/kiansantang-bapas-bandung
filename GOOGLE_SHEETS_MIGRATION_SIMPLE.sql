-- ============================================
-- GOOGLE SHEETS INTEGRATION - SIMPLE MIGRATION
-- Copy-paste SQL ini ke Supabase SQL Editor
-- ============================================

-- 1. Add Google Sheets fields to pk_officers table
ALTER TABLE pk_officers ADD COLUMN IF NOT EXISTS sheet_id TEXT;
ALTER TABLE pk_officers ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE;

-- 2. Create bimbingan_clients table if not exists
CREATE TABLE IF NOT EXISTS bimbingan_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT,
  contact TEXT,
  address TEXT,
  employment_status TEXT,
  job_type TEXT,
  reporting_status TEXT,
  notes TEXT,
  pk_officer_id UUID REFERENCES pk_officers(id),
  pk_officer_sheet_id TEXT,
  synced_from_sheets BOOLEAN DEFAULT FALSE,
  sheet_row_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2b. Add columns if table already exists
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS contact TEXT;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS employment_status TEXT;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS job_type TEXT;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS reporting_status TEXT;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS pk_officer_id UUID;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS pk_officer_sheet_id TEXT;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS synced_from_sheets BOOLEAN DEFAULT FALSE;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS sheet_row_number INTEGER;

-- 2c. Add constraints if not exists (drop first if exists to avoid errors)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bimbingan_clients_employment_status_check'
  ) THEN
    ALTER TABLE bimbingan_clients ADD CONSTRAINT bimbingan_clients_employment_status_check 
      CHECK (employment_status IN ('Bekerja', 'Tidak Bekerja'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bimbingan_clients_reporting_status_check'
  ) THEN
    ALTER TABLE bimbingan_clients ADD CONSTRAINT bimbingan_clients_reporting_status_check 
      CHECK (reporting_status IN ('Wajib Lapor', 'Tidak Wajib Lapor'));
  END IF;
END $$;

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pk_officers_sheet_id ON pk_officers(sheet_id);
CREATE INDEX IF NOT EXISTS idx_bimbingan_clients_contact ON bimbingan_clients(contact);
CREATE INDEX IF NOT EXISTS idx_bimbingan_clients_employment ON bimbingan_clients(employment_status);
CREATE INDEX IF NOT EXISTS idx_bimbingan_clients_reporting ON bimbingan_clients(reporting_status);
CREATE INDEX IF NOT EXISTS idx_bimbingan_clients_synced ON bimbingan_clients(synced_from_sheets);
CREATE INDEX IF NOT EXISTS idx_bimbingan_clients_pk ON bimbingan_clients(pk_officer_id);
CREATE INDEX IF NOT EXISTS idx_bimbingan_clients_pk_sheet_id ON bimbingan_clients(pk_officer_sheet_id);

-- 4. Create sync logs table
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT NOT NULL CHECK (sync_type IN ('pk', 'client', 'all')),
  pk_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
  message TEXT,
  records_synced INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_synced_at ON sync_logs(synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);

-- 5. Enable RLS on new tables
ALTER TABLE bimbingan_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- 6. Create policies
CREATE POLICY "Anyone can view clients" ON bimbingan_clients FOR SELECT USING (true);
CREATE POLICY "Anyone can view sync logs" ON sync_logs FOR SELECT USING (true);

-- 7. Create view for easy querying
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
  bc.pk_officer_sheet_id,
  po.name as pk_name,
  po.position as pk_position,
  bc.created_at,
  bc.synced_from_sheets
FROM bimbingan_clients bc
LEFT JOIN pk_officers po ON po.sheet_id = bc.pk_officer_sheet_id
WHERE bc.synced_from_sheets = true
ORDER BY bc.created_at DESC;

-- ============================================
-- SELESAI! Migration berhasil!
-- ============================================
