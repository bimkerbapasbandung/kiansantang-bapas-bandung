-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update display_settings RLS policies
DROP POLICY IF EXISTS "Anyone can insert display settings" ON public.display_settings;
DROP POLICY IF EXISTS "Anyone can update display settings" ON public.display_settings;

-- Require admin for modifications
CREATE POLICY "Only admins can update display settings"
ON public.display_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert display settings"
ON public.display_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add storage bucket policies for display-videos
CREATE POLICY "Anyone can view videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'display-videos');

CREATE POLICY "Only admins can upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'display-videos' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Only admins can update videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'display-videos' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'display-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'display-videos' AND public.has_role(auth.uid(), 'admin'));

-- Add storage bucket policies for display-logos
CREATE POLICY "Anyone can view logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'display-logos');

CREATE POLICY "Only admins can upload logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'display-logos' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Only admins can update logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'display-logos' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'display-logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'display-logos' AND public.has_role(auth.uid(), 'admin'));

-- Update storage buckets with file size and MIME type restrictions
UPDATE storage.buckets
SET 
  file_size_limit = 104857600, -- 100MB
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/ogg']
WHERE id = 'display-videos';

UPDATE storage.buckets
SET 
  file_size_limit = 5242880, -- 5MB
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
WHERE id = 'display-logos';