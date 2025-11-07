import { QueueItem, ServiceType, SERVICE_CODES } from '@/types/queue';

const QUEUE_STORAGE_KEY = 'bapas_queue_data';
const COUNTER_STORAGE_KEY = 'bapas_queue_counters';
const HISTORY_STORAGE_KEY = 'bapas_queue_history';

export const queueManager = {
  getQueues(): QueueItem[] {
    const data = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!data) return [];
    const queues = JSON.parse(data);
    return queues.map((q: any) => ({
      ...q,
      createdAt: new Date(q.createdAt),
      calledAt: q.calledAt ? new Date(q.calledAt) : undefined,
      completedAt: q.completedAt ? new Date(q.completedAt) : undefined,
    }));
  },

  saveQueues(queues: QueueItem[]): void {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queues));
    window.dispatchEvent(new CustomEvent('queueUpdate'));
  },

  getCounters(): Record<ServiceType, number> {
    const data = localStorage.getItem(COUNTER_STORAGE_KEY);
    if (!data) {
      return {
        penghadapan: 0,
        bimbingan: 0,
        kunjungan: 0,
        pengaduan: 0,
      };
    }
    return JSON.parse(data);
  },

  saveCounters(counters: Record<ServiceType, number>): void {
    localStorage.setItem(COUNTER_STORAGE_KEY, JSON.stringify(counters));
  },

  generateQueueNumber(serviceType: ServiceType): string {
    const counters = this.getCounters();
    counters[serviceType] += 1;
    this.saveCounters(counters);
    const code = SERVICE_CODES[serviceType];
    const number = counters[serviceType].toString().padStart(3, '0');
    return `${code}-${number}`;
  },

  createQueue(
    serviceType: ServiceType, 
    subService: string,
    clientName: string,
    pkOfficerId: string,
    pkOfficerName: string,
    pkOfficerPosition: string
  ): QueueItem {
    const queues = this.getQueues();
    const newQueue: QueueItem = {
      id: `${Date.now()}-${Math.random()}`,
      queueNumber: this.generateQueueNumber(serviceType),
      serviceType,
      subService,
      clientName,
      pkOfficerId,
      pkOfficerName,
      pkOfficerPosition,
      status: 'waiting',
      createdAt: new Date(),
    };
    queues.push(newQueue);
    this.saveQueues(queues);
    return newQueue;
  },

  callQueue(queueId: string, counter: number): void {
    const queues = this.getQueues();
    const queue = queues.find(q => q.id === queueId);
    if (queue && queue.status === 'waiting') {
      queue.status = 'serving';
      queue.calledAt = new Date();
      queue.counter = counter;
      this.saveQueues(queues);
    }
  },

  completeQueue(queueId: string): void {
    const queues = this.getQueues();
    const queue = queues.find(q => q.id === queueId);
    if (queue) {
      queue.status = 'completed';
      queue.completedAt = new Date();
      this.saveQueues(queues);
    }
  },

  getWaitingQueues(): QueueItem[] {
    return this.getQueues().filter(q => q.status === 'waiting');
  },

  getCurrentlyServing(): QueueItem | null {
    const serving = this.getQueues().filter(q => q.status === 'serving');
    return serving.length > 0 ? serving[serving.length - 1] : null;
  },

  resetCounters(): void {
    const today = new Date().toISOString().split('T')[0];
    const history = this.getHistory();
    
    // Simpan data hari ini ke history jika ada
    if (this.getQueues().length > 0) {
      history[today] = this.getQueues();
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    }
    
    this.saveCounters({
      penghadapan: 0,
      bimbingan: 0,
      kunjungan: 0,
      pengaduan: 0,
    });
  },

  getHistory(): Record<string, QueueItem[]> {
    const data = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!data) return {};
    return JSON.parse(data);
  },

  getQueuesByDate(date: string): QueueItem[] {
    const allQueues = this.getQueues();
    const today = new Date().toISOString().split('T')[0];
    
    if (date === today) {
      return allQueues;
    }
    
    const history = this.getHistory();
    return history[date] || [];
  },

  getStatistics(): {
    totalToday: number;
    completedToday: number;
    waitingToday: number;
    servingToday: number;
  } {
    const queues = this.getQueues();
    return {
      totalToday: queues.length,
      completedToday: queues.filter(q => q.status === 'completed').length,
      waitingToday: queues.filter(q => q.status === 'waiting').length,
      servingToday: queues.filter(q => q.status === 'serving').length,
    };
  },
};
