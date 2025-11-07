import { useState, useEffect } from 'react';
import { googleSheetsManager, PKData, ClientData } from '@/lib/googleSheetsManager';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useGoogleSheets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Auto sync on mount
  useEffect(() => {
    const autoSyncEnabled = import.meta.env.VITE_ENABLE_AUTO_SYNC === 'true';
    if (!autoSyncEnabled) return;

    const intervalMinutes = parseInt(import.meta.env.VITE_SYNC_INTERVAL_MINUTES || '5');
    const interval = setInterval(() => {
      syncAll();
    }, intervalMinutes * 60 * 1000);

    // Initial sync
    syncAll();

    return () => clearInterval(interval);
  }, []);

  // ========== PK OPERATIONS ==========

  const getAllPK = async (): Promise<PKData[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await googleSheetsManager.getAllPK();
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Gagal memuat data PK');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getPKById = async (id: string): Promise<PKData | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await googleSheetsManager.getPKById(id);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addPK = async (pk: Omit<PKData, 'id' | 'sheetId'>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await googleSheetsManager.addPK(pk);
      if (result.success) {
        toast.success(`PK berhasil ditambahkan dengan ID: ${result.id}`);
        toast.info(`Jangan lupa buat sheet: Klien_${result.id}`);
        // Sync to Supabase
        await syncPKToSupabase();
        return true;
      } else {
        toast.error('Gagal menambahkan PK');
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      toast.error('Terjadi kesalahan saat menambahkan PK');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePK = async (id: string, pk: Partial<PKData>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await googleSheetsManager.updatePK(id, pk);
      if (success) {
        toast.success('PK berhasil diupdate');
        await syncPKToSupabase();
        return true;
      } else {
        toast.error('Gagal mengupdate PK');
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      toast.error('Terjadi kesalahan saat mengupdate PK');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ========== CLIENT OPERATIONS ==========

  const getClientsByPK = async (pkId: string): Promise<ClientData[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await googleSheetsManager.getClientsByPK(pkId);
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Gagal memuat data klien');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (pkId: string, client: Omit<ClientData, 'no'>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await googleSheetsManager.addClient(pkId, client);
      if (success) {
        toast.success('Klien berhasil ditambahkan');
        return true;
      } else {
        toast.error('Gagal menambahkan klien');
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      toast.error('Terjadi kesalahan saat menambahkan klien');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (
    pkId: string,
    clientNo: number,
    updates: Partial<ClientData>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await googleSheetsManager.updateClient(pkId, clientNo, updates);
      if (success) {
        toast.success('Data klien berhasil diupdate');
        return true;
      } else {
        toast.error('Gagal mengupdate data klien');
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      toast.error('Terjadi kesalahan saat mengupdate klien');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const searchClients = async (pkId: string, searchTerm: string): Promise<ClientData[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await googleSheetsManager.searchClients(pkId, searchTerm);
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getClientStats = async (pkId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await googleSheetsManager.getClientStats(pkId);
      return stats;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ========== SYNC OPERATIONS ==========

  const syncPKToSupabase = async (): Promise<{ success: boolean; count: number; updated: number; inserted: number }> => {
    try {
      const pkData = await googleSheetsManager.getAllPK();
      let updatedCount = 0;
      let insertedCount = 0;

      for (const pk of pkData) {
        // Cek apakah PK dengan sheet_id ini sudah ada
        const { data: existing } = await supabase
          .from('pk_officers')
          .select('id')
          .eq('sheet_id', pk.sheetId)
          .single();

        if (existing) {
          // Update existing PK
          await supabase
            .from('pk_officers')
            .update({
              name: pk.nama,
              position: pk.jabatan,
              is_active: pk.status === 'Aktif',
              last_synced_at: new Date().toISOString()
            })
            .eq('sheet_id', pk.sheetId);
          updatedCount++;
        } else {
          // Insert new PK
          await supabase
            .from('pk_officers')
            .insert({
              name: pk.nama,
              position: pk.jabatan,
              is_active: pk.status === 'Aktif',
              sheet_id: pk.sheetId,
              last_synced_at: new Date().toISOString()
            });
          insertedCount++;
        }
      }

      return { 
        success: true, 
        count: pkData.length,
        updated: updatedCount,
        inserted: insertedCount
      };
    } catch (error) {
      console.error('Error syncing PK to Supabase:', error);
      return { success: false, count: 0, updated: 0, inserted: 0 };
    }
  };

  const syncClientsToSupabase = async (pkId: string): Promise<boolean> => {
    try {
      const clients = await googleSheetsManager.getClientsByPK(pkId);

      for (const client of clients) {
        await supabase
          .from('bimbingan_clients')
          .upsert({
            client_name: client.namaKlien,
            contact: client.kontak,
            address: client.alamat,
            employment_status: client.statusBekerja,
            job_type: client.jenisPekerjaan,
            reporting_status: client.statusWajibLapor,
            notes: client.catatan,
            pk_officer_id: pkId,
            synced_from_sheets: true,
            sheet_row_number: client.no
          }, {
            onConflict: 'pk_officer_id,sheet_row_number'
          });
      }

      return true;
    } catch (error) {
      console.error('Error syncing clients to Supabase:', error);
      return false;
    }
  };

  const syncAll = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('=== STARTING GOOGLE SHEETS SYNC ===');
      
      // Sync PK
      const pkResult = await syncPKToSupabase();
      console.log('PK Sync Result:', pkResult);

      if (!pkResult.success) {
        throw new Error('Gagal sync data PK');
      }

      // Sync clients for all PK (optional, bisa diaktifkan nanti)
      // const pkData = await googleSheetsManager.getAllPK();
      // for (const pk of pkData) {
      //   await syncClientsToSupabase(pk.id);
      // }

      setLastSync(new Date());
      
      // Toast dengan detail
      const messages = [];
      if (pkResult.inserted > 0) {
        messages.push(`${pkResult.inserted} PK baru ditambahkan`);
      }
      if (pkResult.updated > 0) {
        messages.push(`${pkResult.updated} PK diperbarui`);
      }
      
      const detailMessage = messages.length > 0 ? messages.join(', ') : 'Tidak ada perubahan';
      
      toast.success(
        `✅ Sync berhasil! ${pkResult.count} PK dari Google Sheets\n${detailMessage}`,
        { duration: 5000 }
      );
      
      console.log('=== SYNC COMPLETED ===');
      return true;
    } catch (err: any) {
      console.error('=== SYNC FAILED ===');
      console.error('Error:', err);
      setError(err.message);
      toast.error(`❌ Sync gagal: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const manualSync = async (): Promise<boolean> => {
    return await syncAll();
  };

  return {
    // State
    isLoading,
    error,
    lastSync,

    // PK operations
    getAllPK,
    getPKById,
    addPK,
    updatePK,

    // Client operations
    getClientsByPK,
    addClient,
    updateClient,
    searchClients,
    getClientStats,

    // Sync operations
    manualSync,
    syncPKToSupabase,
    syncClientsToSupabase
  };
};
