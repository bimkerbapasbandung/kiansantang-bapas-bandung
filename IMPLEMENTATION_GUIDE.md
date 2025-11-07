# 🚀 IMPLEMENTATION GUIDE - Improvements & New Features

**Panduan Implementasi Perbaikan dan Fitur Baru**

---

## 📦 FILE BARU YANG DITAMBAHKAN

### 1. **Logger Utility** ✅
**File:** `src/lib/logger.ts`

**Fungsi:**
- Conditional logging (hanya di development)
- Mengurangi console logs di production
- Better debugging experience

**Usage:**
```typescript
import { logger } from '@/lib/logger';

// Hanya muncul di development
logger.log('Debug info');
logger.info('Info message');
logger.warn('Warning message');

// Selalu muncul (even in production)
logger.error('Error message');
```

**Benefits:**
- ✅ Cleaner production console
- ✅ Better performance
- ✅ Easier debugging
- ✅ Centralized logging

---

### 2. **Error Boundary** ✅
**File:** `src/components/ErrorBoundary.tsx`

**Fungsi:**
- Catch React errors
- Show user-friendly error page
- Prevent app crash
- Log errors for debugging

**Usage:**
```typescript
// Wrap di App.tsx atau main.tsx
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Features:**
- ✅ User-friendly error UI
- ✅ Reset button
- ✅ Go home button
- ✅ Stack trace (dev only)
- ✅ Support contact info

---

### 3. **Debounce Hook** ✅
**File:** `src/hooks/useDebounce.ts`

**Fungsi:**
- Debounce search input
- Reduce API calls
- Better performance

**Usage:**
```typescript
import { useDebounce } from '@/hooks/useDebounce';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  // API call dengan debounced value
  searchAPI(debouncedSearch);
}, [debouncedSearch]);
```

**Benefits:**
- ✅ Reduce unnecessary renders
- ✅ Reduce API calls
- ✅ Better UX
- ✅ Improved performance

---

### 4. **Loading Components** ✅
**File:** `src/components/LoadingSpinner.tsx`

**Components:**
- `LoadingSpinner` - Basic spinner
- `LoadingPage` - Full page loading
- `LoadingInline` - Inline loading
- `ButtonLoading` - Button loading state

**Usage:**
```typescript
import { LoadingSpinner, LoadingPage, ButtonLoading } from '@/components/LoadingSpinner';

// Full page
<LoadingPage text="Memuat data..." />

// Inline
<LoadingSpinner size="md" text="Loading..." />

// Button
<Button disabled={isLoading}>
  {isLoading && <ButtonLoading />}
  Submit
</Button>
```

---

### 5. **Environment Example** ✅
**File:** `.env.example`

**Fungsi:**
- Template untuk environment variables
- Configuration management
- Feature flags

**Setup:**
```bash
# Copy file
cp .env.example .env

# Edit dengan values yang benar
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

---

## 🔧 CARA IMPLEMENTASI

### Step 1: Setup Environment

```bash
# 1. Copy .env.example
cp .env.example .env

# 2. Edit .env dengan credentials
nano .env

# 3. Install dependencies (jika perlu)
npm install
```

---

### Step 2: Implement Error Boundary

**File:** `src/main.tsx` atau `src/App.tsx`

```typescript
import ErrorBoundary from '@/components/ErrorBoundary';

// Wrap root component
root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
```

---

### Step 3: Replace Console Logs

**Before:**
```typescript
console.log('Debug info');
console.error('Error:', error);
```

**After:**
```typescript
import { logger } from '@/lib/logger';

logger.log('Debug info');
logger.error('Error:', error);
```

**Batch Replace (VS Code):**
```
Find: console\.log
Replace: logger.log

Find: console\.error
Replace: logger.error
```

---

### Step 4: Add Loading States

**Example: Operator.tsx**

```typescript
import { LoadingSpinner } from '@/components/LoadingSpinner';

const [isLoading, setIsLoading] = useState(false);

const callNext = async () => {
  setIsLoading(true);
  try {
    // ... call logic
  } finally {
    setIsLoading(false);
  }
};

return (
  <Button onClick={callNext} disabled={isLoading}>
    {isLoading && <ButtonLoading />}
    Panggil Berikutnya
  </Button>
);
```

---

### Step 5: Implement Debounce Search

**Example: Operator.tsx**

```typescript
import { useDebounce } from '@/hooks/useDebounce';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  // Filter dengan debounced value
  const filtered = queues.filter(q => 
    q.queueNumber.includes(debouncedSearch) ||
    q.clientName.includes(debouncedSearch)
  );
  setFilteredQueues(filtered);
}, [debouncedSearch, queues]);
```

---

## 🎯 FITUR YANG PERLU DIIMPLEMENTASIKAN

### 1. **Auto-Call Feature** 🔄

**File:** `src/pages/Operator.tsx`

```typescript
// Load settings
const [smartSettings, setSmartSettings] = useState<SmartCallSettings>({
  enableAutoCall: false,
  autoCallDelay: 30,
  // ...
});

// Auto-call effect
useEffect(() => {
  if (!smartSettings.enableAutoCall) return;
  if (waitingQueues.length === 0) return;
  if (currentQueue !== null) return; // Sudah ada yang dilayani

  const timer = setTimeout(() => {
    callNext();
  }, smartSettings.autoCallDelay * 1000);

  return () => clearTimeout(timer);
}, [waitingQueues, currentQueue, smartSettings]);
```

**UI Toggle:**
```typescript
<Switch
  checked={smartSettings.enableAutoCall}
  onCheckedChange={(checked) => 
    setSmartSettings({ ...smartSettings, enableAutoCall: checked })
  }
/>
<Label>Auto-Call ({smartSettings.autoCallDelay}s)</Label>
```

---

### 2. **Priority Queue** 🔄

**File:** `src/lib/queueManager.ts`

```typescript
interface QueueItem {
  // ... existing fields
  priority: 'normal' | 'high' | 'urgent';
}

// Sort dengan priority
getWaitingQueues(): QueueItem[] {
  const queues = this.queues.filter(q => q.status === 'waiting');
  
  return queues.sort((a, b) => {
    // Priority first
    const priorityOrder = { urgent: 0, high: 1, normal: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Then by time (FIFO)
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}
```

---

### 3. **Browser Notification** 🔄

**File:** `src/lib/notificationManager.ts`

```typescript
export const notificationManager = {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  async notify(title: string, options?: NotificationOptions) {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/logo.png',
        badge: '/badge.png',
        ...options
      });
    }
  },

  notifyQueueCalled(queueNumber: string, counter: number) {
    this.notify('Antrian Dipanggil', {
      body: `Nomor antrian ${queueNumber} menuju loket ${counter}`,
      tag: 'queue-call',
      requireInteraction: true
    });
  }
};
```

**Usage:**
```typescript
// Request permission saat load
useEffect(() => {
  notificationManager.requestPermission();
}, []);

// Notify saat panggil
const callNext = () => {
  // ... call logic
  
  if (smartSettings.enableNotification) {
    notificationManager.notifyQueueCalled(
      nextQueue.queueNumber,
      counter
    );
  }
};
```

---

### 4. **Statistics Dashboard** 🔄

**File:** `src/pages/Statistics.tsx`

```typescript
import { BarChart, LineChart, PieChart } from 'recharts';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalToday: 0,
    byService: {},
    byPK: {},
    avgWaitTime: 0,
    peakHours: []
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = () => {
    const queues = queueManager.getAllQueues();
    
    // Calculate stats
    const today = queues.filter(q => 
      isToday(q.createdAt)
    );
    
    const byService = groupBy(today, 'serviceType');
    const byPK = groupBy(today, 'pkOfficerId');
    
    // ... more calculations
    
    setStats({
      totalToday: today.length,
      byService,
      byPK,
      avgWaitTime: calculateAvgWaitTime(today),
      peakHours: calculatePeakHours(today)
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard 
          title="Total Hari Ini" 
          value={stats.totalToday}
          icon={<Users />}
        />
        {/* ... more cards */}
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Antrian per Layanan</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={stats.byService} />
        </CardContent>
      </Card>

      {/* ... more charts */}
    </div>
  );
};
```

---

### 5. **Display Settings UI** 🔄

**File:** `src/pages/Settings.tsx`

```typescript
const Settings = () => {
  const [settings, setSettings] = useState<DisplaySettings>({
    running_text: '',
    video_url: null,
    logo_url: null,
    video_column_span: 2,
    queue_column_span: 1,
    institution_name: 'BAPAS Kelas I Bandung'
  });

  const saveSettings = async () => {
    const { error } = await supabase
      .from('display_settings')
      .upsert({
        id: '00000000-0000-0000-0000-000000000001',
        ...settings
      });

    if (error) {
      toast.error('Gagal menyimpan');
    } else {
      toast.success('Berhasil disimpan');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Running Text */}
          <div>
            <Label>Running Text</Label>
            <Input
              value={settings.running_text}
              onChange={(e) => setSettings({
                ...settings,
                running_text: e.target.value
              })}
            />
          </div>

          {/* Video URL */}
          <div>
            <Label>Video URL (YouTube)</Label>
            <Input
              value={settings.video_url || ''}
              onChange={(e) => setSettings({
                ...settings,
                video_url: e.target.value
              })}
              placeholder="https://youtube.com/embed/..."
            />
          </div>

          {/* Logo Upload */}
          <div>
            <Label>Logo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </div>

          {/* Column Spans */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Video Column Span</Label>
              <Slider
                value={[settings.video_column_span]}
                onValueChange={([value]) => setSettings({
                  ...settings,
                  video_column_span: value
                })}
                min={1}
                max={3}
                step={1}
              />
            </div>
            <div>
              <Label>Queue Column Span</Label>
              <Slider
                value={[settings.queue_column_span]}
                onValueChange={([value]) => setSettings({
                  ...settings,
                  queue_column_span: value
                })}
                min={1}
                max={3}
                step={1}
              />
            </div>
          </div>

          <Button onClick={saveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Simpan Pengaturan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
```

---

### 6. **WhatsApp Integration** 🔄

**File:** `src/lib/whatsappManager.ts`

```typescript
// Using Fonnte API or Twilio
export const whatsappManager = {
  async sendNotification(phone: string, message: string) {
    try {
      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': import.meta.env.VITE_FONNTE_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          target: phone,
          message: message,
          countryCode: '62'
        })
      });

      return await response.json();
    } catch (error) {
      console.error('WhatsApp error:', error);
      return null;
    }
  },

  async notifyQueueCalled(phone: string, queueNumber: string, counter: number) {
    const message = `
🔔 *KIANSANTANG - Panggilan Antrian*

Nomor antrian Anda: *${queueNumber}*
Silakan menuju ke: *Loket ${counter}*

Terima kasih.
_BAPAS Kelas I Bandung_
    `.trim();

    return await this.sendNotification(phone, message);
  },

  async notifyQueueRegistered(phone: string, queueNumber: string, estimatedTime: string) {
    const message = `
✅ *KIANSANTANG - Pendaftaran Berhasil*

Nomor antrian Anda: *${queueNumber}*
Estimasi waktu tunggu: *${estimatedTime}*

Mohon tunggu panggilan Anda.
_BAPAS Kelas I Bandung_
    `.trim();

    return await this.sendNotification(phone, message);
  }
};
```

**Usage:**
```typescript
// Saat daftar
if (whatsappNumber) {
  whatsappManager.notifyQueueRegistered(
    whatsappNumber,
    queue.queueNumber,
    '15 menit'
  );
}

// Saat panggil
if (nextQueue.whatsappNumber) {
  whatsappManager.notifyQueueCalled(
    nextQueue.whatsappNumber,
    nextQueue.queueNumber,
    counter
  );
}
```

---

## 📊 TESTING GUIDE

### Unit Tests (Vitest)

```typescript
// tests/queueManager.test.ts
import { describe, it, expect } from 'vitest';
import { queueManager } from '@/lib/queueManager';

describe('queueManager', () => {
  it('should create queue with correct format', () => {
    const queue = queueManager.createQueue(
      'penghadapan',
      'umum',
      'Test User',
      '1',
      'PK Name',
      'Position'
    );

    expect(queue.queueNumber).toMatch(/PH-\d{3}/);
    expect(queue.serviceType).toBe('penghadapan');
    expect(queue.status).toBe('waiting');
  });

  it('should get waiting queues in FIFO order', () => {
    // ... test
  });
});
```

### Integration Tests

```typescript
// tests/integration/queue-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Index } from '@/pages/Index';

describe('Queue Registration Flow', () => {
  it('should complete registration successfully', async () => {
    render(<Index />);

    // Select service
    fireEvent.click(screen.getByText('Penghadapan'));

    // Fill form
    fireEvent.change(screen.getByLabelText('Nama Lengkap'), {
      target: { value: 'Test User' }
    });

    // Submit
    fireEvent.click(screen.getByText('Daftar Antrian'));

    // Check success
    await waitFor(() => {
      expect(screen.getByText(/berhasil/i)).toBeInTheDocument();
    });
  });
});
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment:
```
□ Run tests: npm test
□ Build: npm run build
□ Check bundle size
□ Test production build locally
□ Verify environment variables
□ Check database migrations
□ Test on different browsers
□ Test on mobile devices
□ Run lighthouse audit
□ Check console for errors
□ Verify all features work
□ Update documentation
```

### Deployment:
```
□ Deploy to staging first
□ Test on staging
□ Deploy to production
□ Monitor errors
□ Check analytics
□ Verify backups
```

### Post-Deployment:
```
□ Smoke test critical flows
□ Monitor error logs
□ Check performance metrics
□ Verify user feedback
□ Document any issues
```

---

## ✅ SUMMARY

### Files Added:
1. ✅ `src/lib/logger.ts` - Conditional logging
2. ✅ `src/components/ErrorBoundary.tsx` - Error handling
3. ✅ `src/hooks/useDebounce.ts` - Debounce hook
4. ✅ `src/components/LoadingSpinner.tsx` - Loading states
5. ✅ `.env.example` - Environment template

### Features to Implement:
1. 🔄 Auto-call feature
2. 🔄 Priority queue
3. 🔄 Browser notifications
4. 🔄 Statistics dashboard
5. 🔄 Display settings UI
6. 🔄 WhatsApp integration

### Testing:
1. 🔄 Unit tests
2. 🔄 Integration tests
3. 🔄 E2E tests

### Documentation:
1. ✅ BUG_FIXES_AND_IMPROVEMENTS.md
2. ✅ IMPLEMENTATION_GUIDE.md

---

**Next Steps:**
1. Implement Error Boundary di main.tsx
2. Replace console logs dengan logger
3. Add loading states
4. Implement auto-call feature
5. Add statistics dashboard
6. Write tests

**KIANSANTANG - Kios Antrian Santun dan Tanggap**  
*Sistem Layanan BAPAS Bandung Berbasis Digital*
