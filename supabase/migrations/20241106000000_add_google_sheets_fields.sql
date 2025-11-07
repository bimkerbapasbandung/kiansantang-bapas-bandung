-- Add Google Sheets integration fields to pk_officers table
ALTER TABLE pk_officers ADD COLUMN IF NOT EXISTS sheet_id TEXT;
ALTER TABLE pk_officers ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE pk_officers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE pk_officers ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pk_officers_sheet_id ON pk_officers(sheet_id);
CREATE INDEX IF NOT EXISTS idx_pk_officers_email ON pk_officers(email);

-- Add synced_from_sheets flag to bimbingan_clients
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS synced_from_sheets BOOLEAN DEFAULT FALSE;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS nik TEXT;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE bimbingan_clients ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Menunggu';

-- Create sync logs table
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sync_type TEXT NOT NULL CHECK (sync_type IN ('pk', 'client', 'all')),
  pk_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
  message TEXT,
  records_synced INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_by UUID REFERENCES auth.users(id)
);

-- Create index for sync logs
CREATE INDEX IF NOT EXISTS idx_sync_logs_synced_at ON sync_logs(synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_pk_id ON sync_logs(pk_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);

-- Create function to log sync
CREATE OR REPLACE FUNCTION log_sync(
  p_sync_type TEXT,
  p_pk_id TEXT,
  p_status TEXT,
  p_message TEXT,
  p_records_synced INTEGER DEFAULT 0,
  p_errors_count INTEGER DEFAULT 0
) RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO sync_logs (
    sync_type,
    pk_id,
    status,
    message,
    records_synced,
    errors_count
  ) VALUES (
    p_sync_type,
    p_pk_id,
    p_status,
    p_message,
    p_records_synced,
    p_errors_count
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Create view for sync statistics
CREATE OR REPLACE VIEW sync_statistics AS
SELECT 
  sync_type,
  COUNT(*) as total_syncs,
  SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful_syncs,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_syncs,
  SUM(records_synced) as total_records_synced,
  SUM(errors_count) as total_errors,
  MAX(synced_at) as last_sync_at
FROM sync_logs
GROUP BY sync_type;

-- Grant permissions
GRANT SELECT ON sync_statistics TO authenticated;
GRANT ALL ON sync_logs TO authenticated;

-- Add comments
COMMENT ON TABLE sync_logs IS 'Logs for Google Sheets synchronization operations';
COMMENT ON COLUMN pk_officers.sheet_id IS 'Google Sheets ID for this PK''s client sheet';
COMMENT ON COLUMN pk_officers.email IS 'Email address of the PK officer';
COMMENT ON COLUMN pk_officers.phone IS 'Phone number of the PK officer';
COMMENT ON COLUMN pk_officers.last_synced_at IS 'Last time this PK data was synced from Google Sheets';
COMMENT ON COLUMN bimbingan_clients.synced_from_sheets IS 'Flag indicating if this record was synced from Google Sheets';
COMMENT ON COLUMN bimbingan_clients.nik IS 'Nomor Induk Kependudukan (National ID)';
COMMENT ON COLUMN bimbingan_clients.address IS 'Client address';
COMMENT ON COLUMN bimbingan_clients.status IS 'Client status: Menunggu, Proses, Selesai';
