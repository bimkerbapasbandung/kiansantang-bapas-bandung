-- Cek jumlah data PK di database
SELECT COUNT(*) as total_pk FROM public.pk_officers;

-- Lihat 10 data terakhir yang di-insert
SELECT name, position, created_at 
FROM public.pk_officers 
ORDER BY created_at DESC 
LIMIT 10;

-- Lihat semua PK
SELECT id, name, position, is_active, created_at 
FROM public.pk_officers 
ORDER BY name;
