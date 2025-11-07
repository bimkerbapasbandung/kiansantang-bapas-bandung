/**
 * Google Sheets Manager
 * Mengelola integrasi dengan Google Sheets untuk data PK dan Klien
 */

interface PKData {
  id: string;
  nama: string;
  jabatan: string;
  status: string;
  sheetId: string;
}

interface ClientData {
  no: number;
  tanggal: string;
  namaKlien: string;
  kontak: string;
  alamat: string;
  statusBekerja: string; // 'Bekerja' atau 'Tidak Bekerja'
  jenisPekerjaan: string;
  statusWajibLapor: string; // 'Wajib Lapor' atau 'Tidak Wajib Lapor'
  catatan: string;
}

class GoogleSheetsManager {
  private spreadsheetId: string;
  private apiKey: string;
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

  constructor() {
    this.spreadsheetId = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID || '';
    this.apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
  }

  // ========== HELPER METHODS ==========

  private async fetchSheetData(range: string): Promise<any[][]> {
    try {
      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${range}?key=${this.apiKey}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API Response data:', data);
      return data.values || [];
    } catch (error) {
      console.error('=== ERROR FETCHING SHEET DATA ===');
      console.error('Error:', error);
      return [];
    }
  }

  private async appendSheetData(range: string, values: any[][]): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values })
      });

      return response.ok;
    } catch (error) {
      console.error('Error appending sheet data:', error);
      return false;
    }
  }

  private async updateSheetData(range: string, values: any[][]): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED&key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values })
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating sheet data:', error);
      return false;
    }
  }

  // ========== MASTER PK OPERATIONS ==========

  async getAllPK(): Promise<PKData[]> {
    console.log('=== FETCHING PK FROM GOOGLE SHEETS ===');
    console.log('Spreadsheet ID:', this.spreadsheetId);
    console.log('API Key:', this.apiKey ? '✓ Set' : '✗ Not set');
    
    const rows = await this.fetchSheetData('Master_PK!A2:D');
    console.log('Rows fetched:', rows.length);
    console.log('Raw data:', rows);
    
    const pkData = rows.map((row: any[]) => {
      const id = row[0] || '';
      return {
        id: id,
        nama: row[1] || '',
        jabatan: row[2] || '',
        status: row[3] || 'Aktif', // Default ke Aktif jika kosong
        sheetId: id // Gunakan ID langsung sebagai sheetId (PK001, PK002, dst)
      };
    });
    
    console.log('Parsed PK data:', pkData);
    return pkData;
  }

  async getPKById(id: string): Promise<PKData | null> {
    const allPK = await this.getAllPK();
    return allPK.find(pk => pk.id === id) || null;
  }

  async addPK(pk: Omit<PKData, 'id' | 'sheetId'>): Promise<{ success: boolean; id?: string }> {
    try {
      // Generate ID
      const allPK = await this.getAllPK();
      const lastId = allPK.length > 0 
        ? parseInt(allPK[allPK.length - 1].id.replace('PK', ''))
        : 0;
      const newId = `PK${String(lastId + 1).padStart(3, '0')}`;

      // Add to Master_PK (hanya nama dan jabatan)
      const values = [[
        newId,
        pk.nama,
        pk.jabatan,
        pk.status
      ]];

      const success = await this.appendSheetData('Master_PK!A:D', values);
      
      if (success) {
        console.log(`PK ${newId} added. Please create sheet: Klien_${newId}`);
        return { success: true, id: newId };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Error adding PK:', error);
      return { success: false };
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
        pk.status || currentPK.status
      ]];

      return await this.updateSheetData(`Master_PK!A${rowNumber}:D${rowNumber}`, values);
    } catch (error) {
      console.error('Error updating PK:', error);
      return false;
    }
  }

  // ========== CLIENT OPERATIONS ==========

  async getClientsByPK(pkId: string): Promise<ClientData[]> {
    const sheetName = `Klien_${pkId}`;
    const rows = await this.fetchSheetData(`${sheetName}!A2:I`);
    
    return rows.map((row: any[]) => ({
      no: parseInt(row[0]) || 0,
      tanggal: row[1] || '',
      namaKlien: row[2] || '',
      kontak: row[3] || '',
      alamat: row[4] || '',
      statusBekerja: row[5] || '',
      jenisPekerjaan: row[6] || '',
      statusWajibLapor: row[7] || '',
      catatan: row[8] || ''
    }));
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
        client.kontak,
        client.alamat,
        client.statusBekerja,
        client.jenisPekerjaan,
        client.statusWajibLapor,
        client.catatan
      ]];

      return await this.appendSheetData(`${sheetName}!A:I`, values);
    } catch (error) {
      console.error('Error adding client:', error);
      return false;
    }
  }

  async updateClient(pkId: string, clientNo: number, updates: Partial<ClientData>): Promise<boolean> {
    try {
      const sheetName = `Klien_${pkId}`;
      const clients = await this.getClientsByPK(pkId);
      const client = clients.find(c => c.no === clientNo);
      
      if (!client) return false;

      const rowNumber = clientNo + 1; // +1 untuk header
      
      const values = [[
        clientNo,
        updates.tanggal || client.tanggal,
        updates.namaKlien || client.namaKlien,
        updates.kontak || client.kontak,
        updates.alamat || client.alamat,
        updates.statusBekerja || client.statusBekerja,
        updates.jenisPekerjaan || client.jenisPekerjaan,
        updates.statusWajibLapor || client.statusWajibLapor,
        updates.catatan || client.catatan
      ]];

      return await this.updateSheetData(`${sheetName}!A${rowNumber}:I${rowNumber}`, values);
    } catch (error) {
      console.error('Error updating client:', error);
      return false;
    }
  }

  // ========== BATCH OPERATIONS ==========

  async batchAddClients(pkId: string, clients: Omit<ClientData, 'no'>[]): Promise<boolean> {
    try {
      const sheetName = `Klien_${pkId}`;
      const existingClients = await this.getClientsByPK(pkId);
      let nextNo = existingClients.length + 1;

      const values = clients.map(client => [
        nextNo++,
        client.tanggal,
        client.namaKlien,
        client.kontak,
        client.alamat,
        client.statusBekerja,
        client.jenisPekerjaan,
        client.statusWajibLapor,
        client.catatan
      ]);

      return await this.appendSheetData(`${sheetName}!A:I`, values);
    } catch (error) {
      console.error('Error batch adding clients:', error);
      return false;
    }
  }

  // ========== SEARCH & FILTER ==========

  async searchClients(pkId: string, searchTerm: string): Promise<ClientData[]> {
    const clients = await this.getClientsByPK(pkId);
    const term = searchTerm.toLowerCase();

    return clients.filter(client =>
      client.namaKlien.toLowerCase().includes(term) ||
      client.kontak.includes(term) ||
      client.alamat.toLowerCase().includes(term)
    );
  }

  async getClientsByEmploymentStatus(pkId: string, statusBekerja: string): Promise<ClientData[]> {
    const clients = await this.getClientsByPK(pkId);
    return clients.filter(client => client.statusBekerja === statusBekerja);
  }

  async getClientsByReportingStatus(pkId: string, statusWajibLapor: string): Promise<ClientData[]> {
    const clients = await this.getClientsByPK(pkId);
    return clients.filter(client => client.statusWajibLapor === statusWajibLapor);
  }

  // ========== STATISTICS ==========

  async getClientStats(pkId: string): Promise<{
    total: number;
    byEmploymentStatus: Record<string, number>;
    byReportingStatus: Record<string, number>;
    byJobType: Record<string, number>;
  }> {
    const clients = await this.getClientsByPK(pkId);

    const byEmploymentStatus: Record<string, number> = {};
    const byReportingStatus: Record<string, number> = {};
    const byJobType: Record<string, number> = {};

    clients.forEach(client => {
      byEmploymentStatus[client.statusBekerja] = (byEmploymentStatus[client.statusBekerja] || 0) + 1;
      byReportingStatus[client.statusWajibLapor] = (byReportingStatus[client.statusWajibLapor] || 0) + 1;
      if (client.jenisPekerjaan) {
        byJobType[client.jenisPekerjaan] = (byJobType[client.jenisPekerjaan] || 0) + 1;
      }
    });

    return {
      total: clients.length,
      byEmploymentStatus,
      byReportingStatus,
      byJobType
    };
  }
}

export const googleSheetsManager = new GoogleSheetsManager();
export type { PKData, ClientData };
