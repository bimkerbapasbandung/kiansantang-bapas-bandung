export type ServiceType = 'penghadapan' | 'bimbingan' | 'kunjungan' | 'pengaduan';

export type SubService = {
  penghadapan: 'lapas' | 'rutan' | 'lpka';
  bimbingan: 'pb' | 'cb' | 'cmb' | 'asimilasi';
  kunjungan: 'individu' | 'instansi';
  pengaduan: 'umum';
};

export interface QueueItem {
  id: string;
  queueNumber: string;
  serviceType: ServiceType;
  subService: string;
  status: 'waiting' | 'serving' | 'completed';
  createdAt: Date;
  calledAt?: Date;
  completedAt?: Date;
  counter?: number;
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
    lapas: 'Lapas',
    rutan: 'Rutan',
    lpka: 'LPKA',
  },
  bimbingan: {
    pb: 'Wajib Lapor PB',
    cb: 'Wajib Lapor CB',
    cmb: 'Wajib Lapor CMB',
    asimilasi: 'Asimilasi',
  },
  kunjungan: {
    individu: 'Kunjungan Individu',
    instansi: 'Kunjungan Instansi',
  },
  pengaduan: {
    umum: 'Pengaduan Umum',
  },
} as const;
