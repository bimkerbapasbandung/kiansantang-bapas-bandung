-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create storage buckets for video and logo
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('display-videos', 'display-videos', true),
  ('display-logos', 'display-logos', true);

-- Create display settings table
CREATE TABLE public.display_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  running_text TEXT NOT NULL DEFAULT 'Selamat datang di Balai Pemasyarakatan Kelas I Bandung • Melayani dengan Profesional dan Bermartabat • Harap menunggu panggilan nomor antrian Anda',
  video_url TEXT,
  logo_url TEXT,
  video_column_span INTEGER NOT NULL DEFAULT 1,
  queue_column_span INTEGER NOT NULL DEFAULT 2,
  institution_name TEXT NOT NULL DEFAULT 'BALAI PEMASYARAKATAN KELAS I BANDUNG',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.display_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for display settings (public read, no auth required for display)
CREATE POLICY "Anyone can view display settings"
ON public.display_settings
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update display settings"
ON public.display_settings
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can insert display settings"
ON public.display_settings
FOR INSERT
WITH CHECK (true);

-- Create storage policies for videos
CREATE POLICY "Anyone can view display videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'display-videos');

CREATE POLICY "Anyone can upload display videos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'display-videos');

CREATE POLICY "Anyone can update display videos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'display-videos');

CREATE POLICY "Anyone can delete display videos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'display-videos');

-- Create storage policies for logos
CREATE POLICY "Anyone can view display logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'display-logos');

CREATE POLICY "Anyone can upload display logos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'display-logos');

CREATE POLICY "Anyone can update display logos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'display-logos');

CREATE POLICY "Anyone can delete display logos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'display-logos');

-- Insert default settings
INSERT INTO public.display_settings (id) 
VALUES ('00000000-0000-0000-0000-000000000001');

-- Create trigger for updated_at
CREATE TRIGGER update_display_settings_updated_at
BEFORE UPDATE ON public.display_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();