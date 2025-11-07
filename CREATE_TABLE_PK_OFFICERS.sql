-- ========================================
-- STEP 1: CREATE TABLE PK_OFFICERS
-- ========================================
-- Copy dan jalankan query ini TERLEBIH DAHULU di Supabase SQL Editor

-- Create pk_officers table
CREATE TABLE IF NOT EXISTS public.pk_officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  nip VARCHAR(50) UNIQUE,
  position VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_pk_officers_active ON public.pk_officers(is_active);
CREATE INDEX IF NOT EXISTS idx_pk_officers_name ON public.pk_officers(name);
CREATE INDEX IF NOT EXISTS idx_pk_officers_nip ON public.pk_officers(nip);

-- Enable RLS
ALTER TABLE public.pk_officers ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all operations (karena sudah disable proteksi di app)
CREATE POLICY "Allow all operations on pk_officers"
ON public.pk_officers
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_pk_officers_updated_at ON public.pk_officers;
CREATE TRIGGER update_pk_officers_updated_at
BEFORE UPDATE ON public.pk_officers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert 3 sample data untuk testing
INSERT INTO public.pk_officers (name, nip, position, phone, email, is_active) VALUES
  ('Ahmad Fauzi, S.H.', '199001012015031001', 'Pembimbing Kemasyarakatan Ahli Pertama', '08123456789', 'ahmad.fauzi@bapas.go.id', true),
  ('Siti Nurhaliza, S.Sos.', '199205152016032002', 'Pembimbing Kemasyarakatan Ahli Pertama', '08123456790', 'siti.nurhaliza@bapas.go.id', true),
  ('Budi Santoso, S.H., M.H.', '198709202012031003', 'Pembimbing Kemasyarakatan Ahli Muda', '08123456791', 'budi.santoso@bapas.go.id', true)
ON CONFLICT (nip) DO NOTHING;

-- Verify
SELECT COUNT(*) as total_pk_created FROM public.pk_officers;

-- ========================================
-- ✅ TABLE CREATED!
-- ========================================
-- Setelah run query ini berhasil, baru run query INSERT dari tool converter!
