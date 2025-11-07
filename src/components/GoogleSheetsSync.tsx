import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, AlertCircle, Clock, Database } from 'lucide-react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { toast } from 'sonner';

export const GoogleSheetsSync = () => {
  const { manualSync, isLoading, lastSync } = useGoogleSheets();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  const handleSync = async () => {
    setSyncStatus('syncing');
    const success = await manualSync();
    setSyncStatus(success ? 'success' : 'error');

    // Reset status after 3 seconds
    setTimeout(() => {
      setSyncStatus('idle');
    }, 3000);
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Belum pernah sync';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;
    
    return date.toLocaleString('id-ID');
  };

  return (
    <Card className="border-2 border-green-200 dark:border-green-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
            <img 
              src="https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png" 
              alt="Google Sheets" 
              className="w-6 h-6"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              Google Sheets Integration
              {syncStatus === 'success' && (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Synced
                </Badge>
              )}
              {syncStatus === 'error' && (
                <Badge variant="destructive">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Error
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-normal mt-1">
              Sinkronisasi data PK dan Klien
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Last Sync Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Terakhir sync:</span>
          </div>
          <span className="font-medium">{formatLastSync(lastSync)}</span>
        </div>

        {/* Sync Button */}
        <Button 
          onClick={handleSync} 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          size="lg"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <Database className="w-4 h-4 mr-2" />
              Sync Now
            </>
          )}
        </Button>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-xs space-y-1">
          <p className="font-semibold text-blue-900 dark:text-blue-100">
            ℹ️ Informasi Sync
          </p>
          <ul className="text-blue-700 dark:text-blue-300 space-y-1 ml-4 list-disc">
            <li>Auto sync setiap 5 menit (jika diaktifkan)</li>
            <li>Data PK dari sheet "Master_PK"</li>
            <li>Data Klien dari sheet "Klien_[PK_ID]"</li>
            <li>Sync ke database Supabase</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Compact version for toolbar
export const GoogleSheetsSyncButton = () => {
  const { manualSync, isLoading, lastSync } = useGoogleSheets();

  const handleSync = async () => {
    const success = await manualSync();
    if (!success) {
      toast.error('Sync gagal. Periksa koneksi dan konfigurasi.');
    }
  };

  return (
    <Button 
      onClick={handleSync} 
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="border-green-200 hover:bg-green-50"
    >
      {isLoading ? (
        <>
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          Syncing...
        </>
      ) : (
        <>
          <img 
            src="https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png" 
            alt="Sheets" 
            className="w-4 h-4 mr-2"
          />
          Sync Sheets
        </>
      )}
    </Button>
  );
};
