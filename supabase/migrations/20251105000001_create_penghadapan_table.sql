-- Create table for Penghadapan submissions
CREATE TABLE IF NOT EXISTS public.penghadapan_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id VARCHAR(50) NOT NULL,
  jenis_upt VARCHAR(10) NOT NULL CHECK (jenis_upt IN ('lapas', 'rutan', 'lpka')),
  asal_upt VARCHAR(255) NOT NULL,
  jumlah_klien INTEGER NOT NULL,
  nama_klien TEXT[] NOT NULL,
  dokumen_url TEXT,
  dokumen_filename VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create index
CREATE INDEX idx_penghadapan_queue_id ON public.penghadapan_submissions(queue_id);
CREATE INDEX idx_penghadapan_jenis_upt ON public.penghadapan_submissions(jenis_upt);
CREATE INDEX idx_penghadapan_status ON public.penghadapan_submissions(status);
CREATE INDEX idx_penghadapan_created_at ON public.penghadapan_submissions(created_at DESC);

-- Enable RLS
ALTER TABLE public.penghadapan_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all operations (simplified for now)
CREATE POLICY "Allow all operations on penghadapan_submissions"
ON public.penghadapan_submissions
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_penghadapan_submissions_updated_at
BEFORE UPDATE ON public.penghadapan_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('penghadapan-documents', 'penghadapan-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for penghadapan documents
CREATE POLICY "Allow authenticated users to upload penghadapan documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'penghadapan-documents');

CREATE POLICY "Allow public to read penghadapan documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'penghadapan-documents');

CREATE POLICY "Allow authenticated users to update their penghadapan documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'penghadapan-documents');

CREATE POLICY "Allow authenticated users to delete penghadapan documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'penghadapan-documents');
