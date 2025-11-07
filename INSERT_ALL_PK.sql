-- ========================================
-- INSERT 65 DATA PK (3 Sample + 62 Import)
-- ========================================
-- Copy SEMUA dan paste ke Supabase SQL Editor

-- Hapus data lama jika ada
DELETE FROM public.pk_officers;

-- Insert 3 Sample Data + 62 Data dari Google Sheets
INSERT INTO public.pk_officers (name, nip, position, phone, email, is_active) VALUES
  -- 3 Sample Data
  ('Ahmad Fauzi, S.H.', '199001012015031001', 'Pembimbing Kemasyarakatan Ahli Pertama', '08123456789', 'ahmad.fauzi@bapas.go.id', true),
  ('Siti Nurhaliza, S.Sos.', '199205152016032002', 'Pembimbing Kemasyarakatan Ahli Pertama', '08123456790', 'siti.nurhaliza@bapas.go.id', true),
  ('Budi Santoso, S.H., M.H.', '198709202012031003', 'Pembimbing Kemasyarakatan Ahli Muda', '08123456791', 'budi.santoso@bapas.go.id', true),
  
  -- 62 Data dari Google Sheets
  ('Drs. Budiana, MP', NULL, 'PK Madya', NULL, NULL, true),
  ('Iyus Yusuf, A.K.S,. M.A.P', NULL, 'PK Madya', NULL, NULL, true),
  ('Lisna Sunarsih, S.Sos,. SH.MH.', NULL, 'PK Madya', NULL, NULL, true),
  ('Adhani Wardianti', NULL, 'PK Madya', NULL, NULL, true),
  ('Drs. Hari Terbit Matahari, M.A.P', NULL, 'PK Madya', NULL, NULL, true),
  ('Mahyudi, A.K.S,.M.P', NULL, 'PK Madya', NULL, NULL, true),
  ('Drs. Achmad Hidayat, M.Si.', NULL, 'PK Madya', NULL, NULL, true),
  ('Dra. Choirinah, M.Si', NULL, 'PK Madya', NULL, NULL, true),
  ('Ati Ekawati, S.Psi.', NULL, 'PK Madya', NULL, NULL, true),
  ('Uan Kurniawan N, A.K.S,M.A.P', NULL, 'PK Madya', NULL, NULL, true),
  ('Drs. Adrian', NULL, 'PK Madya', NULL, NULL, true),
  ('Dra. Rima Khuriatul Rahmatilah', NULL, 'PK Madya', NULL, NULL, true),
  ('Jovita Pujiani Safitri, S.H.', NULL, 'PK Pertama', NULL, NULL, true),
  ('Efi siti Fatonah, S.S.T', NULL, 'PK Madya', NULL, NULL, true),
  ('Drs Riyadi', NULL, 'PK Muda', NULL, NULL, true),
  ('Agus Catur Prasetyo, A.Md.IP, S.H', NULL, 'PK Muda', NULL, NULL, true),
  ('Nurjaman. S.S.T.', NULL, 'PK Muda', NULL, NULL, true),
  ('Drs. Intan', NULL, 'PK Muda', NULL, NULL, true),
  ('Wati Andriyani, S.H.', NULL, 'PK Muda', NULL, NULL, true),
  ('Misrun, S.H', NULL, 'PK Muda', NULL, NULL, true),
  ('Liza Meiliza, S.E.', NULL, 'PK Muda', NULL, NULL, true),
  ('Sri Rahayu, A.Md,IP.S.IP', NULL, 'PK Muda', NULL, NULL, true),
  ('Tri Prasetiyo, S.Sos,. M.H', NULL, 'PK Muda', NULL, NULL, true),
  ('Drs. Suparman', NULL, 'PK Muda', NULL, NULL, true),
  ('Maretta Mugia Sajati, S.H,. M.H', NULL, 'PK Muda', NULL, NULL, true),
  ('Budi Pamungkas, S.H.', NULL, 'PK Muda', NULL, NULL, true),
  ('Isep Saeful Millah, S.Sos.', NULL, 'PK Muda', NULL, NULL, true),
  ('Hadi Firdaus A.Md,. S.Si', NULL, 'PK Muda', NULL, NULL, true),
  ('Sri Sopianira, S.Pd', NULL, 'PK Muda', NULL, NULL, true),
  ('Cahyo Budisantoso, S.ST', NULL, 'PK Muda', NULL, NULL, true),
  ('Banias Sariadi, A.Ks.', NULL, 'PK Muda', NULL, NULL, true),
  ('Hadian Ramadhany, S.I.Kom', NULL, 'PK Muda', NULL, NULL, true),
  ('Arie Wiryawan Supriadi, S.H', NULL, 'PK Muda', NULL, NULL, true),
  ('Agus Sutisna, A.Md.IP, S.H., M.H.', NULL, 'PK Muda', NULL, NULL, true),
  ('Agustian Kusmana, S.Kom', NULL, 'PK Pertama', NULL, NULL, true),
  ('Arini Fitria Hidayati, S.Sos', NULL, 'PK Pertama', NULL, NULL, true),
  ('Anisa Nur Aisah, S.Sos', NULL, 'PK Pertama', NULL, NULL, true),
  ('Feisal Makarim, S.Sos', NULL, 'PK Pertama', NULL, NULL, true),
  ('Dufri Andreas, S.Sos', NULL, 'PK Pertama', NULL, NULL, true),
  ('Nurjihan Habiba, S.Sos', NULL, 'PK Pertama', NULL, NULL, true),
  ('Bayu Indra Prasetya, S.Psi.', NULL, 'PK Pertama', NULL, NULL, true),
  ('Anindya Dwi Maysita, S.Psi', NULL, 'PK Pertama', NULL, NULL, true),
  ('Geryssa Resta Panembrama, S.Psi', NULL, 'PK Pertama', NULL, NULL, true),
  ('Satria Eka Purwantoro, S.Sos', NULL, 'PK Pertama', NULL, NULL, true),
  ('Claudia Maria Elmonia, S.Psi', NULL, 'PK Pertama', NULL, NULL, true),
  ('Ria Djusnita, S.H', NULL, 'PK Pertama', NULL, NULL, true),
  ('Angga Permana Putra, S.Psi', NULL, 'PK Pertama', NULL, NULL, true),
  ('Albhi Aprilyanto, S.H.', NULL, 'PK Pertama', NULL, NULL, true),
  ('Muhammad Asril Zalmi Tanjung, S.Psi', NULL, 'PK Pertama', NULL, NULL, true),
  ('Wulan Purnama Sari, S.Psi', NULL, 'PK Pertama', NULL, NULL, true),
  ('Andiani Apriliani, S.H', NULL, 'PK Pertama', NULL, NULL, true),
  ('Eggy Gilang Perdana, S.H', NULL, 'PK Pertama', NULL, NULL, true),
  ('Henrie Ernawan, S.Psi.', NULL, 'PK Pertama', NULL, NULL, true),
  ('Fajar Maulani Nurrahman, S.Sos.', NULL, 'PK Pertama', NULL, NULL, true),
  ('Azka Millatina, S.Psi.', NULL, 'PK Pertama', NULL, NULL, true),
  ('Bella Ayu Widiyaningrum, S.Tr.Pas', NULL, 'PK Pertama', NULL, NULL, true),
  ('Binta Nur ''Izzatie, S.Tr.Pas', NULL, 'PK Pertama', NULL, NULL, true),
  ('Grace Tresya Demak Sibuea, S.Tr.Pas', NULL, 'PK Pertama', NULL, NULL, true),
  ('Irawan Kurniawan', NULL, 'PK Pertama', NULL, NULL, true),
  ('Dina Anggun Wahyuni, Amd.IP', NULL, 'APK', NULL, NULL, true),
  ('Ryan Rizkia', NULL, 'APK', NULL, NULL, true),
  ('Muhamad Anggiansah', NULL, 'APK', NULL, NULL, true)
ON CONFLICT (nip) DO NOTHING;

-- Verifikasi jumlah data
SELECT COUNT(*) as total_pk_inserted FROM public.pk_officers;

-- Lihat 5 data pertama
SELECT name, position FROM public.pk_officers LIMIT 5;

-- ========================================
-- ✅ SELESAI!
-- Seharusnya muncul: total_pk_inserted = 65
-- ========================================
