/**
 * Script untuk Export Data PK dari Google Sheets ke SQL
 * 
 * Cara Pakai:
 * 1. Buka Google Sheets Anda
 * 2. Extensions → Apps Script
 * 3. Paste script ini
 * 4. Ubah konfigurasi di bawah sesuai sheets Anda
 * 5. Run function "generateSQL"
 * 6. Lihat hasil di Logger (View → Logs)
 * 7. Copy SQL dan jalankan di Supabase
 */

// ====================================
// KONFIGURASI (SESUAIKAN DENGAN SHEETS ANDA!)
// ====================================

const CONFIG = {
  sheetName: 'DATABASE KLIEN BIMBINGAN TAHUN 2025',  // Nama sheet yang berisi data PK
  startRow: 2,                 // Baris mulai data (skip header)
  columnName: 'B',             // Kolom B berisi NAMA PK
  columnPosition: 'C',         // Kolom C berisi JENJANG/JABATAN
  columnNIP: '',               // Tidak ada kolom NIP
  columnPhone: '',             // Tidak ada kolom Telepon
  columnEmail: ''              // Tidak ada kolom Email
};

// ====================================
// FUNGSI UTAMA
// ====================================

function generateSQL() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.sheetName);
  
  if (!sheet) {
    Logger.log('❌ Sheet tidak ditemukan: ' + CONFIG.sheetName);
    return;
  }
  
  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(CONFIG.startRow, 1, lastRow - CONFIG.startRow + 1, 10).getValues();
  
  let sqlStatements = [];
  let count = 0;
  
  Logger.log('📊 Membaca data dari baris ' + CONFIG.startRow + ' sampai ' + lastRow);
  Logger.log('');
  
  data.forEach((row, index) => {
    const name = getColumnValue(row, CONFIG.columnName);
    const position = getColumnValue(row, CONFIG.columnPosition);
    const nip = getColumnValue(row, CONFIG.columnNIP);
    const phone = getColumnValue(row, CONFIG.columnPhone);
    const email = getColumnValue(row, CONFIG.columnEmail);
    
    // Skip baris kosong
    if (!name || name.toString().trim() === '') {
      return;
    }
    
    // Generate SQL INSERT
    const values = [
      `'${escapeSql(name)}'`,                                    // name
      nip ? `'${escapeSql(nip)}'` : 'NULL',                     // nip
      position ? `'${escapeSql(position)}'` : `'Staff'`,        // position
      phone ? `'${escapeSql(phone)}'` : 'NULL',                 // phone
      email ? `'${escapeSql(email)}'` : 'NULL',                 // email
      'true'                                                     // is_active
    ];
    
    sqlStatements.push(`  (${values.join(', ')})`);
    count++;
  });
  
  if (sqlStatements.length === 0) {
    Logger.log('❌ Tidak ada data yang ditemukan!');
    Logger.log('Periksa konfigurasi kolom dan baris mulai.');
    return;
  }
  
  // Generate SQL lengkap
  const sql = `-- Generated SQL for ${count} PK Officers
-- Copy dan paste ke Supabase SQL Editor

INSERT INTO public.pk_officers (name, nip, position, phone, email, is_active)
VALUES
${sqlStatements.join(',\n')};

-- Selesai! ${count} data PK siap di-import.
`;
  
  Logger.log('✅ SQL berhasil di-generate!');
  Logger.log('');
  Logger.log('📋 COPY SQL DI BAWAH INI:');
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log(sql);
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log('');
  Logger.log('📌 Total: ' + count + ' data PK');
  Logger.log('');
  Logger.log('🚀 Cara Pakai:');
  Logger.log('1. Copy SQL di atas');
  Logger.log('2. Buka Supabase Dashboard → SQL Editor');
  Logger.log('3. Paste dan Run');
  Logger.log('4. Refresh halaman PK Management');
}

// ====================================
// HELPER FUNCTIONS
// ====================================

function getColumnValue(row, columnLetter) {
  if (!columnLetter) return null;
  const columnIndex = columnLetter.charCodeAt(0) - 'A'.charCodeAt(0);
  return row[columnIndex] || null;
}

function escapeSql(value) {
  if (!value) return '';
  return value.toString().replace(/'/g, "''").trim();
}

// ====================================
// FUNGSI PREVIEW (untuk testing)
// ====================================

function previewData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.sheetName);
  const lastRow = Math.min(sheet.getLastRow(), CONFIG.startRow + 4); // Preview 5 rows
  const data = sheet.getRange(CONFIG.startRow, 1, lastRow - CONFIG.startRow + 1, 10).getValues();
  
  Logger.log('📋 PREVIEW DATA (5 baris pertama):');
  Logger.log('════════════════════════════════════════');
  
  data.forEach((row, index) => {
    const name = getColumnValue(row, CONFIG.columnName);
    const position = getColumnValue(row, CONFIG.columnPosition);
    
    Logger.log(`${index + 1}. Nama: ${name} | Jabatan: ${position}`);
  });
  
  Logger.log('════════════════════════════════════════');
  Logger.log('');
  Logger.log('💡 Jika data sudah benar, jalankan function "generateSQL"');
}

// ====================================
// MENU CUSTOM (Opsional)
// ====================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔄 Export PK')
    .addItem('📋 Preview Data', 'previewData')
    .addItem('🚀 Generate SQL', 'generateSQL')
    .addToUi();
}
