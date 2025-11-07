import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

interface PKOfficerImport {
  name: string;
  position: string;
  is_active: boolean;
  row: number;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export const PKExcelImport = ({ onImportComplete }: { onImportComplete?: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PKOfficerImport[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStats, setImportStats] = useState<{
    total: number;
    success: number;
    failed: number;
  } | null>(null);

  const downloadTemplate = () => {
    // Create template Excel file
    const templateData = [
      ['Nama PK', 'Jabatan', 'Status Aktif'],
      ['John Doe', 'Pembimbing Kemasyarakatan Ahli Pertama', 'Ya'],
      ['Jane Smith', 'Pembimbing Kemasyarakatan Ahli Muda', 'Ya'],
      ['Bob Johnson', 'Pembimbing Kemasyarakatan Ahli Madya', 'Tidak'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 30 }, // Nama PK
      { wch: 50 }, // Jabatan
      { wch: 15 }, // Status Aktif
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template PK');

    // Download file
    XLSX.writeFile(wb, 'Template_Import_PK_Officers.xlsx');
    toast.success('Template berhasil diunduh!');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.oasis.opendocument.spreadsheet'
    ];

    if (!validTypes.includes(selectedFile.type) && 
        !selectedFile.name.match(/\.(xlsx|xls|ods)$/i)) {
      toast.error('Format file tidak valid. Gunakan .xlsx, .xls, atau .ods');
      return;
    }

    setFile(selectedFile);
    setPreviewData([]);
    setErrors([]);
    setImportStats(null);
    toast.info('File dipilih. Klik "Preview Data" untuk melihat isi file.');
  };

  const parseExcelFile = async () => {
    if (!file) {
      toast.error('Pilih file terlebih dahulu');
      return;
    }

    setIsProcessing(true);
    setErrors([]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Get first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      if (jsonData.length < 2) {
        toast.error('File kosong atau tidak memiliki data');
        setIsProcessing(false);
        return;
      }

      // Parse data (skip header row)
      const parsedData: PKOfficerImport[] = [];
      const validationErrors: ValidationError[] = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const rowNumber = i + 1;

        // Skip empty rows
        if (!row || row.length === 0 || !row[0]) continue;

        const name = row[0]?.toString().trim() || '';
        const position = row[1]?.toString().trim() || '';
        const statusText = row[2]?.toString().trim().toLowerCase() || '';

        // Validate name
        if (!name) {
          validationErrors.push({
            row: rowNumber,
            field: 'Nama',
            message: 'Nama tidak boleh kosong'
          });
        }

        // Validate position
        if (!position) {
          validationErrors.push({
            row: rowNumber,
            field: 'Jabatan',
            message: 'Jabatan tidak boleh kosong'
          });
        }

        // Parse status
        const isActive = ['ya', 'yes', 'y', 'true', '1', 'aktif', 'active'].includes(statusText);

        parsedData.push({
          name,
          position,
          is_active: isActive,
          row: rowNumber
        });
      }

      setPreviewData(parsedData);
      setErrors(validationErrors);

      if (validationErrors.length > 0) {
        toast.warning(`Ditemukan ${validationErrors.length} error validasi. Perbaiki sebelum import.`);
      } else {
        toast.success(`Berhasil memuat ${parsedData.length} data PK. Silakan review dan klik "Import ke Database".`);
      }
    } catch (error) {
      console.error('Error parsing Excel:', error);
      toast.error('Gagal membaca file Excel. Pastikan format file benar.');
    } finally {
      setIsProcessing(false);
    }
  };

  const importToDatabase = async () => {
    if (previewData.length === 0) {
      toast.error('Tidak ada data untuk diimport');
      return;
    }

    if (errors.length > 0) {
      toast.error('Perbaiki error validasi terlebih dahulu');
      return;
    }

    setIsProcessing(true);
    let successCount = 0;
    let failedCount = 0;

    try {
      for (const officer of previewData) {
        try {
          const { error } = await supabase
            .from('pk_officers')
            .insert({
              name: officer.name,
              position: officer.position,
              is_active: officer.is_active
            });

          if (error) {
            console.error(`Error importing row ${officer.row}:`, error);
            failedCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.error(`Error importing row ${officer.row}:`, err);
          failedCount++;
        }
      }

      setImportStats({
        total: previewData.length,
        success: successCount,
        failed: failedCount
      });

      if (failedCount === 0) {
        toast.success(`Berhasil import ${successCount} data PK Officers!`);
        
        // Reset form
        setFile(null);
        setPreviewData([]);
        setErrors([]);
        
        // Callback
        if (onImportComplete) {
          onImportComplete();
        }
      } else {
        toast.warning(`Import selesai: ${successCount} berhasil, ${failedCount} gagal`);
      }
    } catch (error) {
      console.error('Error importing to database:', error);
      toast.error('Gagal import data ke database');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              Import PK Officers dari Excel
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Upload file Excel (.xlsx, .xls) untuk import data PK Officers secara massal
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Template
          </Button>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="excel-file">Pilih File Excel</Label>
          <div className="flex gap-2">
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls,.ods"
              onChange={handleFileChange}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              onClick={parseExcelFile}
              disabled={!file || isProcessing}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {isProcessing ? 'Memproses...' : 'Preview Data'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Format: Kolom 1 = Nama PK, Kolom 2 = Jabatan, Kolom 3 = Status Aktif (Ya/Tidak)
          </p>
        </div>

        {/* Validation Errors */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold mb-2">
                Ditemukan {errors.length} error validasi:
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {errors.slice(0, 10).map((error, idx) => (
                  <div key={idx} className="text-sm">
                    • Baris {error.row} - {error.field}: {error.message}
                  </div>
                ))}
                {errors.length > 10 && (
                  <div className="text-sm italic">
                    ... dan {errors.length - 10} error lainnya
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Preview Data */}
        {previewData.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Preview Data ({previewData.length} baris)</h4>
              <Button
                onClick={importToDatabase}
                disabled={isProcessing || errors.length > 0}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                {isProcessing ? 'Importing...' : 'Import ke Database'}
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Baris</th>
                      <th className="px-4 py-2 text-left font-semibold">Nama PK</th>
                      <th className="px-4 py-2 text-left font-semibold">Jabatan</th>
                      <th className="px-4 py-2 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((officer, idx) => {
                      const hasError = errors.some(e => e.row === officer.row);
                      return (
                        <tr
                          key={idx}
                          className={`border-t ${hasError ? 'bg-red-50' : 'hover:bg-secondary/50'}`}
                        >
                          <td className="px-4 py-2">{officer.row}</td>
                          <td className="px-4 py-2 font-medium">{officer.name}</td>
                          <td className="px-4 py-2">{officer.position}</td>
                          <td className="px-4 py-2">
                            {officer.is_active ? (
                              <span className="inline-flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-gray-500">
                                <XCircle className="w-4 h-4" />
                                Tidak Aktif
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Import Stats */}
        {importStats && (
          <Alert className="bg-blue-50 border-blue-200">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <div className="font-semibold text-blue-900">Import Selesai!</div>
              <div className="text-sm text-blue-800 mt-1">
                Total: {importStats.total} | Berhasil: {importStats.success} | Gagal: {importStats.failed}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">📋 Petunjuk Penggunaan:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Download template Excel dengan klik tombol "Download Template"</li>
            <li>Isi data PK Officers sesuai format template</li>
            <li>Upload file Excel yang sudah diisi</li>
            <li>Klik "Preview Data" untuk melihat dan validasi data</li>
            <li>Jika tidak ada error, klik "Import ke Database"</li>
          </ol>
          <div className="mt-3 text-xs text-blue-700">
            <strong>Format Kolom:</strong>
            <ul className="list-disc list-inside ml-2 mt-1">
              <li><strong>Kolom 1 (Nama PK):</strong> Nama lengkap Pembimbing Kemasyarakatan</li>
              <li><strong>Kolom 2 (Jabatan):</strong> Jabatan/posisi PK</li>
              <li><strong>Kolom 3 (Status Aktif):</strong> Ya/Tidak, Yes/No, 1/0, Aktif/Tidak Aktif</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
