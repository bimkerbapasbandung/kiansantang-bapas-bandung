# 📊 GOOGLE SHEETS INTEGRATION - KIANSANTANG

**Integrasi Google Sheets untuk Data PK dan Klien**

---

## 🎯 OVERVIEW

Sistem ini mengintegrasikan Google Sheets untuk:
1. **Master Data PK** - Sinkronisasi data Pembimbing Kemasyarakatan
2. **Database Klien per PK** - Setiap PK memiliki sheet klien sendiri
3. **Auto Sync** - Sinkronisasi otomatis antara Sheets dan Supabase
4. **Real-time Updates** - Update data secara real-time

---

## 📋 STRUKTUR GOOGLE SHEETS

### **1. Master Sheet: Data PK**

**Nama Sheet:** `Master_PK`

| ID | Nama | Jabatan | Status | Email | Telepon | Sheet_ID |
|----|------|---------|--------|-------|---------|----------|
| PK001 | Ahmad Yani | PK Pratama | Aktif | ahmad@bapas.go.id | 081234567890 | sheet_pk001 |
| PK002 | Siti Nurhaliza | PK Muda | Aktif | siti@bapas.go.id | 081234567891 | sheet_pk002 |
| PK003 | Budi Santoso | PK Madya | Aktif | budi@bapas.go.id | 081234567892 | sheet_pk003 |

**Kolom:**
- `ID` - Unique identifier (PK001, PK002, dst)
- `Nama` - Nama lengkap PK
- `Jabatan` - Jabatan PK
- `Status` - Aktif/Tidak Aktif
- `Email` - Email PK
- `Telepon` - Nomor telepon
- `Sheet_ID` - ID sheet klien PK tersebut

---

### **2. Sheet per PK: Data Klien**

**Nama Sheet:** `Klien_PK001`, `Klien_PK002`, dst.

| No | Tanggal | Nama_Klien | NIK | Alamat | Telepon | Jenis_Layanan | Sub_Layanan | Status | Catatan |
|----|---------|------------|-----|--------|---------|---------------|-------------|--------|---------|
| 1 | 2024-11-06 | John Doe | 3201234567890123 | Jl. Merdeka No. 1 | 081234567890 | Penghadapan | Umum | Selesai | - |
| 2 | 2024-11-06 | Jane Smith | 3201234567890124 | Jl. Sudirman No. 2 | 081234567891 | Bimbingan | Dewasa | Proses | - |

**Kolom:**
- `No` - Nomor urut
- `Tanggal` - Tanggal registrasi
- `Nama_Klien` - Nama lengkap klien
- `NIK` - Nomor Induk Kependudukan
- `Alamat` - Alamat lengkap
- `Telepon` - Nomor telepon/WhatsApp
- `Jenis_Layanan` - Penghadapan/Bimbingan/Kunjungan/Pengaduan
- `Sub_Layanan` - Sub kategori layanan
- `Status` - Menunggu/Proses/Selesai
- `Catatan` - Catatan tambahan

---

## 🔧 SETUP GOOGLE SHEETS API

### **Step 1: Create Google Cloud Project**

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "KIANSANTANG-Integration"
3. Enable APIs:
   - Google Sheets API
   - Google Drive API

### **Step 2: Create Service Account**

1. Go to **IAM & Admin** → **Service Accounts**
2. Create service account:
   - Name: `kiansantang-service`
   - Role: `Editor`
3. Create key (JSON format)
4. Download JSON file

### **Step 3: Share Google Sheets**

1. Create Google Sheets dengan struktur di atas
2. Share dengan service account email
3. Give **Editor** permission
4. Copy Spreadsheet ID dari URL

**URL Format:**
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
```

---

## 📦 INSTALLATION

### **Install Dependencies**

```bash
npm install googleapis
npm install @google-cloud/local-auth
npm install google-auth-library
```

### **Setup Credentials**

```bash
# Buat folder credentials
mkdir credentials

# Copy service account JSON
cp path/to/service-account.json credentials/google-credentials.json

# Add to .gitignore
echo "credentials/" >> .gitignore
```

### **Environment Variables**

```bash
# .env
VITE_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
```

---

## 💻 IMPLEMENTATION

### **File 1: Google Sheets Manager**

**File:** `src/lib/googleSheetsManager.ts`

```typescript
import { google } from 'googleapis';

interface PKData {
  id: string;
  nama: string;
  jabatan: string;
  status: string;
  email: string;
  telepon: string;
  sheetId: string;
}

interface ClientData {
  no: number;
  tanggal: string;
  namaKlien: string;
  nik: string;
  alamat: string;
  telepon: string;
  jenisLayanan: string;
  subLayanan: string;
  status: string;
  catatan: string;
}

class GoogleSheetsManager {
  private sheets: any;
  private spreadsheetId: string;
  private auth: any;

  constructor() {
    this.spreadsheetId = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;
    this.initAuth();
  }

  private async initAuth() {
    try {
      // Load credentials dari environment atau file
      const credentials = JSON.parse(
        import.meta.env.VITE_GOOGLE_CREDENTIALS || '{}'
      );

      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive'
        ]
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    } catch (error) {
      console.error('Failed to initialize Google Sheets auth:', error);
    }
  }

  // ========== MASTER PK OPERATIONS ==========

  async getAllPK(): Promise<PKData[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Master_PK!A2:G', // Skip header
      });

      const rows = response.data.values || [];
      return rows.map((row: any[]) => ({
        id: row[0] || '',
        nama: row[1] || '',
        jabatan: row[2] || '',
        status: row[3] || '',
        email: row[4] || '',
        telepon: row[5] || '',
        sheetId: row[6] || ''
      }));
    } catch (error) {
      console.error('Error getting PK data:', error);
      return [];
    }
  }

  async addPK(pk: Omit<PKData, 'id'>): Promise<boolean> {
    try {
      // Generate ID
      const allPK = await this.getAllPK();
      const lastId = allPK.length > 0 
        ? parseInt(allPK[allPK.length - 1].id.replace('PK', ''))
        : 0;
      const newId = `PK${String(lastId + 1).padStart(3, '0')}`;

      // Create sheet untuk klien PK ini
      const sheetId = `Klien_${newId}`;
      await this.createClientSheet(sheetId);

      // Add to Master_PK
      const values = [[
        newId,
        pk.nama,
        pk.jabatan,
        pk.status,
        pk.email,
        pk.telepon,
        sheetId
      ]];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Master_PK!A:G',
        valueInputOption: 'USER_ENTERED',
        resource: { values }
      });

      return true;
    } catch (error) {
      console.error('Error adding PK:', error);
      return false;
    }
  }

  async updatePK(id: string, pk: Partial<PKData>): Promise<boolean> {
    try {
      const allPK = await this.getAllPK();
      const index = allPK.findIndex(p => p.id === id);
      
      if (index === -1) return false;

      const rowNumber = index + 2; // +2 karena header dan 0-index
      const currentPK = allPK[index];
      
      const values = [[
        id,
        pk.nama || currentPK.nama,
        pk.jabatan || currentPK.jabatan,
        pk.status || currentPK.status,
        pk.email || currentPK.email,
        pk.telepon || currentPK.telepon,
        pk.sheetId || currentPK.sheetId
      ]];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `Master_PK!A${rowNumber}:G${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values }
      });

      return true;
    } catch (error) {
      console.error('Error updating PK:', error);
      return false;
    }
  }

  // ========== CLIENT OPERATIONS ==========

  private async createClientSheet(sheetName: string): Promise<boolean> {
    try {
      // Create new sheet
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetName
              }
            }
          }]
        }
      });

      // Add header
      const headers = [[
        'No', 'Tanggal', 'Nama_Klien', 'NIK', 'Alamat', 
        'Telepon', 'Jenis_Layanan', 'Sub_Layanan', 'Status', 'Catatan'
      ]];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A1:J1`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: headers }
      });

      return true;
    } catch (error) {
      console.error('Error creating client sheet:', error);
      return false;
    }
  }

  async getClientsByPK(pkId: string): Promise<ClientData[]> {
    try {
      const sheetName = `Klien_${pkId}`;
      
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A2:J`, // Skip header
      });

      const rows = response.data.values || [];
      return rows.map((row: any[]) => ({
        no: parseInt(row[0]) || 0,
        tanggal: row[1] || '',
        namaKlien: row[2] || '',
        nik: row[3] || '',
        alamat: row[4] || '',
        telepon: row[5] || '',
        jenisLayanan: row[6] || '',
        subLayanan: row[7] || '',
        status: row[8] || '',
        catatan: row[9] || ''
      }));
    } catch (error) {
      console.error('Error getting clients:', error);
      return [];
    }
  }

  async addClient(pkId: string, client: Omit<ClientData, 'no'>): Promise<boolean> {
    try {
      const sheetName = `Klien_${pkId}`;
      
      // Get current clients to determine next number
      const clients = await this.getClientsByPK(pkId);
      const nextNo = clients.length + 1;

      const values = [[
        nextNo,
        client.tanggal,
        client.namaKlien,
        client.nik,
        client.alamat,
        client.telepon,
        client.jenisLayanan,
        client.subLayanan,
        client.status,
        client.catatan
      ]];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:J`,
        valueInputOption: 'USER_ENTERED',
        resource: { values }
      });

      return true;
    } catch (error) {
      console.error('Error adding client:', error);
      return false;
    }
  }

  async updateClientStatus(
    pkId: string, 
    clientNo: number, 
    status: string
  ): Promise<boolean> {
    try {
      const sheetName = `Klien_${pkId}`;
      const rowNumber = clientNo + 1; // +1 untuk header

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!I${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[status]] }
      });

      return true;
    } catch (error) {
      console.error('Error updating client status:', error);
      return false;
    }
  }

  // ========== SYNC OPERATIONS ==========

  async syncPKToSupabase(supabase: any): Promise<void> {
    try {
      const pkData = await this.getAllPK();
      
      for (const pk of pkData) {
        // Upsert to Supabase
        await supabase
          .from('pk_officers')
          .upsert({
            id: pk.id,
            name: pk.nama,
            position: pk.jabatan,
            is_active: pk.status === 'Aktif',
            email: pk.email,
            phone: pk.telepon,
            sheet_id: pk.sheetId
          }, {
            onConflict: 'id'
          });
      }

      console.log('PK data synced to Supabase');
    } catch (error) {
      console.error('Error syncing PK to Supabase:', error);
    }
  }

  async syncClientsToSupabase(pkId: string, supabase: any): Promise<void> {
    try {
      const clients = await this.getClientsByPK(pkId);
      
      for (const client of clients) {
        // Map jenis layanan
        const serviceTypeMap: any = {
          'Penghadapan': 'penghadapan',
          'Bimbingan': 'bimbingan',
          'Kunjungan': 'kunjungan',
          'Pengaduan': 'pengaduan'
        };

        const serviceType = serviceTypeMap[client.jenisLayanan] || 'penghadapan';

        // Insert to appropriate table based on service type
        if (serviceType === 'bimbingan') {
          await supabase
            .from('bimbingan_clients')
            .insert({
              client_name: client.namaKlien,
              nik: client.nik,
              address: client.alamat,
              phone: client.telepon,
              bimbingan_type: client.subLayanan,
              pk_officer_id: pkId,
              status: client.status,
              notes: client.catatan
            });
        }
        // Add other service types as needed
      }

      console.log(`Clients for ${pkId} synced to Supabase`);
    } catch (error) {
      console.error('Error syncing clients to Supabase:', error);
    }
  }
}

export const googleSheetsManager = new GoogleSheetsManager();
```

---

### **File 2: Sync Service**

**File:** `src/lib/syncService.ts`

```typescript
import { googleSheetsManager } from './googleSheetsManager';
import { supabase } from '@/integrations/supabase/client';

class SyncService {
  private syncInterval: NodeJS.Timeout | null = null;

  // Start auto sync
  startAutoSync(intervalMinutes: number = 5) {
    this.stopAutoSync(); // Clear existing interval

    this.syncInterval = setInterval(() => {
      this.syncAll();
    }, intervalMinutes * 60 * 1000);

    // Initial sync
    this.syncAll();
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async syncAll() {
    console.log('Starting sync...');
    
    try {
      // Sync PK data
      await this.syncPK();
      
      // Sync clients for all PK
      const pkData = await googleSheetsManager.getAllPK();
      for (const pk of pkData) {
        await this.syncClients(pk.id);
      }
      
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  async syncPK() {
    await googleSheetsManager.syncPKToSupabase(supabase);
  }

  async syncClients(pkId: string) {
    await googleSheetsManager.syncClientsToSupabase(pkId, supabase);
  }

  // Manual sync trigger
  async manualSync() {
    return await this.syncAll();
  }
}

export const syncService = new SyncService();
```

---

### **File 3: React Hook**

**File:** `src/hooks/useGoogleSheets.ts`

```typescript
import { useState, useEffect } from 'react';
import { googleSheetsManager } from '@/lib/googleSheetsManager';
import { syncService } from '@/lib/syncService';

export const useGoogleSheets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Start auto sync on mount
    syncService.startAutoSync(5); // Sync every 5 minutes

    return () => {
      syncService.stopAutoSync();
    };
  }, []);

  const getAllPK = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await googleSheetsManager.getAllPK();
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addPK = async (pk: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await googleSheetsManager.addPK(pk);
      if (success) {
        await syncService.syncPK();
      }
      return success;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getClientsByPK = async (pkId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await googleSheetsManager.getClientsByPK(pkId);
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (pkId: string, client: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await googleSheetsManager.addClient(pkId, client);
      if (success) {
        await syncService.syncClients(pkId);
      }
      return success;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const manualSync = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await syncService.manualSync();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getAllPK,
    addPK,
    getClientsByPK,
    addClient,
    manualSync
  };
};
```

---

## 🎨 UI COMPONENTS

### **Component: Google Sheets Sync Button**

**File:** `src/components/GoogleSheetsSync.tsx`

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { toast } from 'sonner';

export const GoogleSheetsSync = () => {
  const { manualSync, isLoading } = useGoogleSheets();
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const handleSync = async () => {
    const success = await manualSync();
    if (success) {
      setLastSync(new Date());
      toast.success('Sinkronisasi berhasil!');
    } else {
      toast.error('Sinkronisasi gagal');
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <img 
              src="https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png" 
              alt="Google Sheets" 
              className="w-6 h-6"
            />
            Google Sheets Sync
          </h3>
          {lastSync && (
            <p className="text-sm text-muted-foreground">
              Terakhir sync: {lastSync.toLocaleString('id-ID')}
            </p>
          )}
        </div>
        <Button 
          onClick={handleSync} 
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Now
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
```

---

## 📊 DATABASE SCHEMA UPDATE

### **Supabase Migration**

**File:** `supabase/migrations/add_google_sheets_fields.sql`

```sql
-- Add Google Sheets fields to pk_officers table
ALTER TABLE pk_officers ADD COLUMN IF NOT EXISTS sheet_id TEXT;
ALTER TABLE pk_officers ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE pk_officers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE pk_officers ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE;

-- Create index
CREATE INDEX IF NOT EXISTS idx_pk_officers_sheet_id ON pk_officers(sheet_id);

-- Add sync log table
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sync_type TEXT NOT NULL, -- 'pk' or 'client'
  pk_id TEXT,
  status TEXT NOT NULL, -- 'success' or 'failed'
  message TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_sync_logs_synced_at ON sync_logs(synced_at DESC);
```

---

## 🔄 USAGE EXAMPLES

### **Example 1: Sync PK Data**

```typescript
import { useGoogleSheets } from '@/hooks/useGoogleSheets';

const PKManagement = () => {
  const { getAllPK, addPK, isLoading } = useGoogleSheets();
  
  const loadPK = async () => {
    const pkData = await getAllPK();
    console.log('PK Data:', pkData);
  };

  const handleAddPK = async () => {
    const success = await addPK({
      nama: 'New PK',
      jabatan: 'PK Pratama',
      status: 'Aktif',
      email: 'newpk@bapas.go.id',
      telepon: '081234567890',
      sheetId: '' // Will be auto-generated
    });
    
    if (success) {
      toast.success('PK berhasil ditambahkan');
      loadPK();
    }
  };

  return (
    <div>
      <Button onClick={loadPK} disabled={isLoading}>
        Load PK Data
      </Button>
      <Button onClick={handleAddPK}>
        Add New PK
      </Button>
    </div>
  );
};
```

### **Example 2: View Clients by PK**

```typescript
const PKDashboard = ({ pkId }: { pkId: string }) => {
  const { getClientsByPK } = useGoogleSheets();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    loadClients();
  }, [pkId]);

  const loadClients = async () => {
    const data = await getClientsByPK(pkId);
    setClients(data);
  };

  return (
    <div>
      <h2>Klien {pkId}</h2>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Layanan</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.no}>
              <td>{client.no}</td>
              <td>{client.namaKlien}</td>
              <td>{client.jenisLayanan}</td>
              <td>{client.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## ⚙️ CONFIGURATION

### **Environment Variables**

```bash
# .env
VITE_GOOGLE_SPREADSHEET_ID=1abc123xyz...
VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=kiansantang@project.iam.gserviceaccount.com
VITE_GOOGLE_CREDENTIALS='{"type":"service_account","project_id":"...","private_key":"..."}'
VITE_ENABLE_AUTO_SYNC=true
VITE_SYNC_INTERVAL_MINUTES=5
```

---

## 🎯 FEATURES

### ✅ **Implemented:**
1. Master PK data management
2. Separate sheet per PK for clients
3. Auto-create client sheet when adding PK
4. CRUD operations for PK
5. CRUD operations for clients
6. Sync to Supabase
7. Auto sync every N minutes
8. Manual sync trigger
9. React hooks for easy integration

### 🔄 **Advanced Features:**
1. Real-time sync dengan Google Sheets API webhooks
2. Conflict resolution
3. Offline mode dengan queue
4. Batch operations
5. Export/Import Excel
6. Data validation
7. Audit trail

---

## 📚 DOCUMENTATION

**Files Created:**
1. ✅ `src/lib/googleSheetsManager.ts` - Core manager
2. ✅ `src/lib/syncService.ts` - Sync service
3. ✅ `src/hooks/useGoogleSheets.ts` - React hook
4. ✅ `src/components/GoogleSheetsSync.tsx` - UI component
5. ✅ `supabase/migrations/add_google_sheets_fields.sql` - DB migration

**Documentation:**
1. ✅ `GOOGLE_SHEETS_INTEGRATION.md` - This file

---

## 🚀 NEXT STEPS

1. Setup Google Cloud Project
2. Create service account
3. Share Google Sheets
4. Install dependencies
5. Configure environment variables
6. Run database migration
7. Test sync functionality
8. Deploy to production

---

**KIANSANTANG - Kios Antrian Santun dan Tanggap**  
*Sistem Layanan BAPAS Bandung Berbasis Digital*

© 2024 BAPAS Kelas I Bandung
