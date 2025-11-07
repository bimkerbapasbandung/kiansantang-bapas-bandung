export type ServiceType = 'penghadapan' | 'bimbingan' | 'kunjungan' | 'pengaduan';

export type SubService = {
  penghadapan: 'umum'; // Tidak ada sub menu, langsung pilih PK
  bimbingan: 'wajib_lapor' | 'kepribadian' | 'kemandirian';
  kunjungan: 'individu' | 'instansi';
  pengaduan: 'umum';
};

export interface QueueItem {
  id: string;
  queueNumber: string;
  serviceType: ServiceType;
  subService: string;
  clientName: string;
  pkOfficerId: string;
  pkOfficerName: string;
  pkOfficerPosition: string;
  whatsappNumber?: string;
  status: 'waiting' | 'serving' | 'completed';
  createdAt: Date;
  calledAt?: Date;
  completedAt?: Date;
  counter?: number;
}

export interface PKOfficer {
  id: string;
  name: string;
  position: string;
  is_active: boolean;
}

export const SERVICE_CODES = {
  penghadapan: 'PH',
  bimbingan: 'BM',
  kunjungan: 'KJ',
  pengaduan: 'PG',
} as const;

export const SERVICE_NAMES = {
  penghadapan: 'Penghadapan',
  bimbingan: 'Bimbingan',
  kunjungan: 'Kunjungan',
  pengaduan: 'Pengaduan',
} as const;

export const SUB_SERVICE_NAMES = {
  penghadapan: {
    umum: 'Penghadapan', // Langsung ke form, pilih PK dari database
  },
  bimbingan: {
    wajib_lapor: 'Wajib Lapor',
    kepribadian: 'Kepribadian',
    kemandirian: 'Kemandirian',
  },
  kunjungan: {
    individu: 'Kunjungan Individu',
    instansi: 'Kunjungan Instansi',
  },
  pengaduan: {
    umum: 'Pengaduan Umum',
  },
} as const;
