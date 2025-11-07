-- Create pk_officers table for Pembimbing Kemasyarakatan
CREATE TABLE IF NOT EXISTS public.pk_officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  nip VARCHAR(50) UNIQUE,
  position VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create index for faster queries
CREATE INDEX idx_pk_officers_active ON public.pk_officers(is_active);
CREATE INDEX idx_pk_officers_name ON public.pk_officers(name);
CREATE INDEX idx_pk_officers_nip ON public.pk_officers(nip);

-- Enable RLS on pk_officers
ALTER TABLE public.pk_officers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone (including public) can view active PK officers
CREATE POLICY "Anyone can view active PK officers"
ON public.pk_officers
FOR SELECT
USING (is_active = true);

-- Policy: Authenticated users can view all PK officers
CREATE POLICY "Authenticated users can view all PK officers"
ON public.pk_officers
FOR SELECT
TO authenticated
USING (true);

-- Policy: Only admins can insert PK officers
CREATE POLICY "Only admins can insert PK officers"
ON public.pk_officers
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can update PK officers
CREATE POLICY "Only admins can update PK officers"
ON public.pk_officers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can delete PK officers
CREATE POLICY "Only admins can delete PK officers"
ON public.pk_officers
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pk_officers_updated_at
BEFORE UPDATE ON public.pk_officers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.pk_officers (name, nip, position, phone, email, is_active) VALUES
  ('Ahmad Fauzi, S.H.', '199001012015031001', 'Pembimbing Kemasyarakatan Ahli Pertama', '08123456789', 'ahmad.fauzi@bapas.go.id', true),
  ('Siti Nurhaliza, S.Sos.', '199205152016032002', 'Pembimbing Kemasyarakatan Ahli Pertama', '08123456790', 'siti.nurhaliza@bapas.go.id', true),
  ('Budi Santoso, S.H., M.H.', '198709202012031003', 'Pembimbing Kemasyarakatan Ahli Muda', '08123456791', 'budi.santoso@bapas.go.id', true),
  ('Ratna Dewi, S.Psi.', '199103252017032001', 'Pembimbing Kemasyarakatan Ahli Pertama', '08123456792', 'ratna.dewi@bapas.go.id', true),
  ('Dedi Kurniawan, S.E.', '198812102014031002', 'Pembimbing Kemasyarakatan', '08123456793', 'dedi.kurniawan@bapas.go.id', true),
  ('Maya Puspitasari, S.Sos.', '199308182018032003', 'Pembimbing Kemasyarakatan Ahli Pertama', '08123456794', 'maya.puspita@bapas.go.id', true),
  ('Rizki Pratama, S.H.', '199506222019031001', 'Pembimbing Kemasyarakatan', '08123456795', 'rizki.pratama@bapas.go.id', true),
  ('Eka Wahyuni, S.Psi.', '199204152016032004', 'Pembimbing Kemasyarakatan Ahli Pertama', '08123456796', 'eka.wahyuni@bapas.go.id', true)
ON CONFLICT (nip) DO NOTHING;

-- Create view for active PK officers statistics
CREATE OR REPLACE VIEW public.pk_officers_stats AS
SELECT 
  COUNT(*) as total_officers,
  COUNT(*) FILTER (WHERE is_active = true) as active_officers,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_officers
FROM public.pk_officers;

-- Grant access to the view
GRANT SELECT ON public.pk_officers_stats TO authenticated;
GRANT SELECT ON public.pk_officers_stats TO anon;
