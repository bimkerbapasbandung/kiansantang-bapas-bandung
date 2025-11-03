-- Create table for PK (Petugas Kemasyarakatan) officers
CREATE TABLE public.pk_officers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pk_officers ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read PK officers list
CREATE POLICY "Anyone can view active PK officers" 
ON public.pk_officers 
FOR SELECT 
USING (is_active = true);

-- Insert some sample PK officers
INSERT INTO public.pk_officers (name, position) VALUES
  ('Drs. Ahmad Wijaya, M.Si', 'Kepala Seksi Bimbingan Klien'),
  ('Sri Lestari, S.Sos', 'Pembimbing Kemasyarakatan Madya'),
  ('Budi Santoso, S.H.', 'Pembimbing Kemasyarakatan Muda'),
  ('Dewi Sartika, A.Md', 'Pembimbing Kemasyarakatan Pertama');