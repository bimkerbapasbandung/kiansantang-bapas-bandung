# 📊 GOOGLE SHEETS SETUP GUIDE - KIANSANTANG

**Panduan Lengkap Setup Google Sheets Integration**

---

## 🎯 QUICK START

### **Step 1: Buat Google Sheets**

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **Blank** untuk sheet baru
3. Rename: "KIANSANTANG - Database PK dan Klien"

---

### **Step 2: Buat Sheet Master_PK**

1. Rename Sheet1 menjadi **"Master_PK"**
2. Buat header di row 1:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ID | Nama | Jabatan | Status | Email | Telepon | Sheet_ID |

3. Format header:
   - Bold
   - Background: Hijau (#34A853)
   - Text: Putih
   - Freeze row 1

4. Contoh data (row 2-4):

```
PK001 | Ahmad Yani | PK Pratama | Aktif | ahmad@bapas.go.id | 081234567890 | Klien_PK001
PK002 | Siti Nurhaliza | PK Muda | Aktif | siti@bapas.go.id | 081234567891 | Klien_PK002
PK003 | Budi Santoso | PK Madya | Aktif | budi@bapas.go.id | 081234567892 | Klien_PK003
```

---

### **Step 3: Buat Sheet untuk Setiap PK**

Untuk setiap PK, buat sheet baru:

**Sheet Name:** `Klien_PK001`, `Klien_PK002`, dst.

**Header (row 1):**

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| No | Tanggal | Nama_Klien | NIK | Alamat | Telepon | Jenis_Layanan | Sub_Layanan | Status | Catatan |

**Format Header:**
- Bold
- Background: Biru (#4285F4)
- Text: Putih
- Freeze row 1

**Contoh Data:**

```
1 | 2024-11-06 | John Doe | 3201234567890123 | Jl. Merdeka No. 1 | 081234567890 | Penghadapan | Umum | Selesai | -
2 | 2024-11-06 | Jane Smith | 3201234567890124 | Jl. Sudirman No. 2 | 081234567891 | Bimbingan | Dewasa | Proses | -
```

---

### **Step 4: Setup Google Sheets API**

#### **A. Create Google Cloud Project**

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik **Select a project** → **NEW PROJECT**
3. Project name: `KIANSANTANG-Integration`
4. Klik **CREATE**

#### **B. Enable APIs**

1. Go to **APIs & Services** → **Library**
2. Search dan enable:
   - ✅ **Google Sheets API**
   - ✅ **Google Drive API**

#### **C. Create API Key (Untuk Read-Only)**

1. Go to **APIs & Services** → **Credentials**
2. Klik **CREATE CREDENTIALS** → **API key**
3. Copy API key
4. Klik **RESTRICT KEY**:
   - Application restrictions: **HTTP referrers**
   - Add: `http://localhost:*`, `https://yourdomain.com/*`
   - API restrictions: **Restrict key**
   - Select: Google Sheets API
5. Klik **SAVE**

#### **D. Share Google Sheets**

1. Buka Google Sheets Anda
2. Klik **Share**
3. Change to: **Anyone with the link** → **Viewer**
4. Copy link

#### **E. Get Spreadsheet ID**

Dari URL:
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
```

Copy bagian `[SPREADSHEET_ID]`

---

### **Step 5: Setup Environment Variables**

Edit file `.env`:

```bash
# Google Sheets Configuration
VITE_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
VITE_GOOGLE_API_KEY=your_api_key_here

# Auto Sync Settings
VITE_ENABLE_AUTO_SYNC=true
VITE_SYNC_INTERVAL_MINUTES=5
```

---

### **Step 6: Run Database Migration**

```bash
# Jika menggunakan Supabase CLI
supabase migration up

# Atau jalankan SQL manual di Supabase Dashboard
# Copy isi file: supabase/migrations/20241106000000_add_google_sheets_fields.sql
# Paste di SQL Editor dan Execute
```

---

### **Step 7: Test Integration**

```bash
# Start development server
npm run dev

# Buka browser
# Test sync di halaman admin
```

---

## 📋 TEMPLATE GOOGLE SHEETS

### **Master_PK Sheet**

```
┌─────────┬──────────────────┬─────────────┬────────┬───────────────────────┬──────────────┬──────────────┐
│   ID    │      Nama        │   Jabatan   │ Status │        Email          │   Telepon    │   Sheet_ID   │
├─────────┼──────────────────┼─────────────┼────────┼───────────────────────┼──────────────┼──────────────┤
│ PK001   │ Ahmad Yani       │ PK Pratama  │ Aktif  │ ahmad@bapas.go.id     │ 081234567890 │ Klien_PK001  │
│ PK002   │ Siti Nurhaliza   │ PK Muda     │ Aktif  │ siti@bapas.go.id      │ 081234567891 │ Klien_PK002  │
│ PK003   │ Budi Santoso     │ PK Madya    │ Aktif  │ budi@bapas.go.id      │ 081234567892 │ Klien_PK003  │
└─────────┴──────────────────┴─────────────┴────────┴───────────────────────┴──────────────┴──────────────┘
```

### **Klien_PK001 Sheet**

```
┌────┬────────────┬──────────────┬──────────────────┬───────────────────┬──────────────┬────────────────┬──────────────┬──────────┬──────────┐
│ No │  Tanggal   │ Nama_Klien   │       NIK        │      Alamat       │   Telepon    │ Jenis_Layanan  │ Sub_Layanan  │  Status  │ Catatan  │
├────┼────────────┼──────────────┼──────────────────┼───────────────────┼──────────────┼────────────────┼──────────────┼──────────┼──────────┤
│ 1  │ 2024-11-06 │ John Doe     │ 3201234567890123 │ Jl. Merdeka No. 1 │ 081234567890 │ Penghadapan    │ Umum         │ Selesai  │ -        │
│ 2  │ 2024-11-06 │ Jane Smith   │ 3201234567890124 │ Jl. Sudirman No.2 │ 081234567891 │ Bimbingan      │ Dewasa       │ Proses   │ -        │
│ 3  │ 2024-11-06 │ Bob Johnson  │ 3201234567890125 │ Jl. Gatot No. 3   │ 081234567892 │ Kunjungan      │ Keluarga     │ Menunggu │ -        │
└────┴────────────┴──────────────┴──────────────────┴───────────────────┴──────────────┴────────────────┴──────────────┴──────────┴──────────┘
```

---

## 🎨 FORMATTING TIPS

### **Color Scheme:**

**Master_PK:**
- Header: Green (#34A853)
- Odd rows: White
- Even rows: Light Green (#E8F5E9)

**Klien Sheets:**
- Header: Blue (#4285F4)
- Odd rows: White
- Even rows: Light Blue (#E3F2FD)

### **Data Validation:**

**Status Column (Master_PK):**
```
Data validation → List from range
Values: Aktif, Tidak Aktif
```

**Status Column (Klien):**
```
Data validation → List from range
Values: Menunggu, Proses, Selesai
```

**Jenis_Layanan Column:**
```
Data validation → List from range
Values: Penghadapan, Bimbingan, Kunjungan, Pengaduan
```

### **Conditional Formatting:**

**Status = "Selesai":**
- Background: Light Green (#C8E6C9)
- Text: Dark Green (#2E7D32)

**Status = "Proses":**
- Background: Light Orange (#FFE0B2)
- Text: Dark Orange (#E65100)

**Status = "Menunggu":**
- Background: Light Blue (#BBDEFB)
- Text: Dark Blue (#1565C0)

---

## 🔧 ADVANCED SETUP (Optional)

### **Service Account (For Write Access)**

Jika perlu write access dari aplikasi:

1. **Create Service Account:**
   - Go to **IAM & Admin** → **Service Accounts**
   - Click **CREATE SERVICE ACCOUNT**
   - Name: `kiansantang-service`
   - Role: **Editor**
   - Click **CREATE KEY** → **JSON**
   - Download JSON file

2. **Share Sheets with Service Account:**
   - Copy service account email dari JSON
   - Share Google Sheets dengan email tersebut
   - Give **Editor** permission

3. **Add to Environment:**
   ```bash
   VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=kiansantang@project.iam.gserviceaccount.com
   VITE_GOOGLE_CREDENTIALS='{"type":"service_account",...}'
   ```

---

## 📊 FORMULAS & AUTOMATION

### **Auto-numbering (Column A):**

Di cell A2:
```
=ROW()-1
```

Drag down untuk auto-numbering.

### **Auto-date (Column B):**

Di cell B2:
```
=TODAY()
```

### **Count Statistics:**

Buat sheet "Statistics" dengan formulas:

**Total Klien per PK:**
```
=COUNTA(Klien_PK001!A2:A)
```

**Count by Status:**
```
=COUNTIF(Klien_PK001!I:I,"Selesai")
```

**Count by Service:**
```
=COUNTIF(Klien_PK001!G:G,"Penghadapan")
```

---

## 🔄 SYNC WORKFLOW

### **Automatic Sync:**

```
1. App loads → Initialize Google Sheets hook
2. Auto sync every 5 minutes (configurable)
3. Fetch data from Google Sheets
4. Upsert to Supabase database
5. Log sync results
```

### **Manual Sync:**

```
1. User clicks "Sync Now" button
2. Fetch all PK from Master_PK sheet
3. Upsert PK to pk_officers table
4. For each PK:
   - Fetch clients from Klien_[PK_ID] sheet
   - Upsert to bimbingan_clients table
5. Show success/error toast
6. Update last sync time
```

---

## 📱 USAGE IN APP

### **Admin Dashboard:**

```typescript
import { GoogleSheetsSync } from '@/components/GoogleSheetsSync';

<GoogleSheetsSync />
```

### **PK Management:**

```typescript
import { useGoogleSheets } from '@/hooks/useGoogleSheets';

const { getAllPK, addPK, isLoading } = useGoogleSheets();

// Load PK
const pkData = await getAllPK();

// Add new PK
await addPK({
  nama: 'New PK',
  jabatan: 'PK Pratama',
  status: 'Aktif',
  email: 'newpk@bapas.go.id',
  telepon: '081234567890'
});
```

### **Client Management:**

```typescript
const { getClientsByPK, addClient } = useGoogleSheets();

// Get clients for specific PK
const clients = await getClientsByPK('PK001');

// Add new client
await addClient('PK001', {
  tanggal: '2024-11-06',
  namaKlien: 'New Client',
  nik: '3201234567890123',
  alamat: 'Jl. Example No. 1',
  telepon: '081234567890',
  jenisLayanan: 'Penghadapan',
  subLayanan: 'Umum',
  status: 'Menunggu',
  catatan: '-'
});
```

---

## ⚠️ TROUBLESHOOTING

### **Error: "API key not valid"**

**Solusi:**
1. Check API key di .env
2. Verify API restrictions
3. Make sure Google Sheets API is enabled

### **Error: "The caller does not have permission"**

**Solusi:**
1. Make sure sheet is shared (Anyone with link)
2. Or share dengan service account email

### **Error: "Requested entity was not found"**

**Solusi:**
1. Check Spreadsheet ID
2. Verify sheet names (case-sensitive)

### **Data tidak sync:**

**Solusi:**
1. Check internet connection
2. Verify .env configuration
3. Check browser console for errors
4. Try manual sync

---

## 📊 MONITORING

### **Sync Logs:**

Query di Supabase:

```sql
SELECT * FROM sync_logs 
ORDER BY synced_at DESC 
LIMIT 10;
```

### **Sync Statistics:**

```sql
SELECT * FROM sync_statistics;
```

### **Last Sync Time:**

```sql
SELECT 
  id, 
  name, 
  last_synced_at 
FROM pk_officers 
ORDER BY last_synced_at DESC;
```

---

## ✅ CHECKLIST

### **Setup:**
```
□ Google Sheets created
□ Master_PK sheet configured
□ Client sheets created for each PK
□ Google Cloud Project created
□ APIs enabled (Sheets, Drive)
□ API key created and restricted
□ Spreadsheet shared
□ Spreadsheet ID copied
□ .env configured
□ Database migration run
□ Test sync successful
```

### **Data Quality:**
```
□ Headers formatted correctly
□ Data validation applied
□ Conditional formatting set
□ Formulas working
□ No duplicate IDs
□ All required fields filled
```

---

## 🎯 BEST PRACTICES

1. **Naming Convention:**
   - PK ID: PK001, PK002, PK003...
   - Sheet names: Klien_PK001, Klien_PK002...
   - Consistent casing

2. **Data Entry:**
   - Always fill required fields
   - Use data validation
   - Avoid special characters in IDs
   - Keep NIK 16 digits

3. **Sync:**
   - Sync before important operations
   - Check sync logs regularly
   - Monitor for errors
   - Keep backup of sheets

4. **Security:**
   - Don't share API key publicly
   - Use environment variables
   - Restrict API key properly
   - Regular audit of access

---

**KIANSANTANG - Kios Antrian Santun dan Tanggap**  
*Sistem Layanan BAPAS Bandung Berbasis Digital*

© 2024 BAPAS Kelas I Bandung
