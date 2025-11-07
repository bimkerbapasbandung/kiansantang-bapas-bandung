# 🎨 BRANDING GUIDE - KIANSANTANG

**Kios Antrian Santun dan Tanggap**  
Sistem Layanan BAPAS Bandung Berbasis Digital

---

## 📋 IDENTITAS BRAND

### Nama Aplikasi
**KIANSANTANG**

### Kepanjangan
**Kios Antrian Santun dan Tanggap**

### Tagline
"Sistem Layanan BAPAS Bandung Berbasis Digital"

### Institusi
Balai Pemasyarakatan Kelas I Bandung

---

## 🎯 FILOSOFI BRAND

### Makna "KIANSANTANG"

**KIOS** 🏪
- Tempat pelayanan yang mudah diakses
- Simbol keterbukaan dan kemudahan
- Layanan yang dekat dengan masyarakat

**ANTRIAN** 📋
- Sistem terorganisir dan tertib
- Keadilan dalam pelayanan (first come, first served)
- Transparansi proses

**SANTUN** 🤝
- Pelayanan yang ramah dan sopan
- Menghormati hak dan martabat klien
- Komunikasi yang baik

**TANGGAP** ⚡
- Responsif terhadap kebutuhan
- Cepat dan efisien
- Solusi modern dan digital

---

## 🎨 VISUAL IDENTITY

### Color Palette

#### Primary Colors:
```css
Blue:     #2563EB (rgb(37, 99, 235))
Indigo:   #4F46E5 (rgb(79, 70, 229))
Purple:   #7C3AED (rgb(124, 58, 237))
```

**Penggunaan:**
- Header utama
- Branding KIANSANTANG
- Tombol primary
- Accent elements

#### Secondary Colors:
```css
Emerald:  #059669 (rgb(5, 150, 105))
Teal:     #0D9488 (rgb(13, 148, 136))
```

**Penggunaan:**
- Setup Admin button
- Success states
- Positive feedback

#### Accent Colors:
```css
Red:      #DC2626 (rgb(220, 38, 38))
Pink:     #DB2777 (rgb(219, 39, 119))
```

**Penggunaan:**
- Logout button
- Reset button
- Warning/Danger actions

#### Background:
```css
Light Mode:
- from-blue-50 via-indigo-50 to-purple-50

Dark Mode:
- from-gray-900 via-blue-900 to-indigo-900
```

---

### Typography

#### Headings:
```css
Font Family: System UI, -apple-system, sans-serif
Font Weight: 900 (Black) untuk "KIANSANTANG"
Font Weight: 700 (Bold) untuk subheadings
Tracking: Tight (-0.025em)
```

#### Body Text:
```css
Font Family: System UI, -apple-system, sans-serif
Font Weight: 400 (Regular)
Font Weight: 500 (Medium) untuk emphasis
Line Height: 1.5
```

#### Tagline:
```css
Font Weight: 500 (Medium)
Font Size: 0.875rem (14px)
Color: Blue-100 / Blue-200
Tracking: Wide (0.025em)
```

---

### Logo & Icon

#### Icon Utama:
```
Monitor (Lucide React)
- Melambangkan sistem digital
- Teknologi modern
- Display/Interface
```

#### Styling Icon:
```css
Background: white/10 (semi-transparent)
Backdrop Filter: blur-sm
Padding: 0.75rem
Border Radius: 1rem (rounded-2xl)
Size: 2rem - 3rem (w-8 h-8 to w-12 h-12)
```

---

## 🖼️ DESIGN ELEMENTS

### Header Design

#### Desktop:
```
┌─────────────────────────────────────────────────────┐
│  [Icon]  KIANSANTANG                                │
│          Kios Antrian Santun dan Tanggap            │
│                                                     │
│  Sistem Layanan BAPAS Bandung Berbasis Digital     │
│  Balai Pemasyarakatan Kelas I Bandung              │
└─────────────────────────────────────────────────────┘
```

#### Mobile:
```
┌───────────────────────────┐
│  [Icon]  KIANSANTANG      │
│          Kios Antrian...  │
│                           │
│  Sistem Layanan BAPAS...  │
└───────────────────────────┘
```

---

### Gradient Patterns

#### Header Gradient:
```css
background: linear-gradient(to right, 
  #2563EB,  /* Blue-600 */
  #4F46E5,  /* Indigo-600 */
  #7C3AED   /* Purple-600 */
);
```

#### Background Gradient:
```css
/* Light Mode */
background: linear-gradient(to bottom right,
  #EFF6FF,  /* Blue-50 */
  #EEF2FF,  /* Indigo-50 */
  #FAF5FF   /* Purple-50 */
);

/* Dark Mode */
background: linear-gradient(to bottom right,
  #111827,  /* Gray-900 */
  #1E3A8A,  /* Blue-900 */
  #312E81   /* Indigo-900 */
);
```

---

### Button Styles

#### Primary Button:
```css
background: linear-gradient(to right, #2563EB, #4F46E5);
hover: linear-gradient(to right, #1D4ED8, #4338CA);
```

#### Success Button:
```css
background: linear-gradient(to right, #059669, #0D9488);
hover: linear-gradient(to right, #047857, #0F766E);
```

#### Danger Button:
```css
background: linear-gradient(to right, #DC2626, #DB2777);
hover: linear-gradient(to right, #B91C1C, #BE185D);
```

#### Outline Button:
```css
border: 2px solid #BFDBFE; /* Blue-200 */
hover: background-color: #EFF6FF; /* Blue-50 */
```

---

### Card Styles

#### Modern Card:
```css
background: rgba(255, 255, 255, 0.8); /* white/80 */
backdrop-filter: blur(12px);
border-radius: 1rem; /* rounded-2xl */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

#### Announcement Card:
```css
background: linear-gradient(to right, 
  #EFF6FF,  /* Blue-50 */
  #EEF2FF   /* Indigo-50 */
);
border: 2px solid #60A5FA; /* Blue-400 */
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints:
```css
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

### Font Sizes:

| Element | Mobile | Desktop |
|---------|--------|---------|
| H1 (KIANSANTANG) | 1.875rem (30px) | 3rem (48px) |
| Tagline | 0.75rem (12px) | 0.875rem (14px) |
| Body | 0.875rem (14px) | 1rem (16px) |
| Button | 0.875rem (14px) | 0.875rem (14px) |

---

## 🎭 ANIMATION & EFFECTS

### Pulse Animation:
```css
/* LIVE Indicator */
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

### Bounce Animation:
```css
/* Volume Icon */
animation: bounce 1s infinite;
```

### Backdrop Blur:
```css
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
```

### Gradient Text:
```css
background: linear-gradient(to right, #2563EB, #4F46E5);
background-clip: text;
-webkit-background-clip: text;
color: transparent;
```

---

## 📐 SPACING & LAYOUT

### Container:
```css
max-width: 1280px; /* 7xl */
margin: 0 auto;
padding: 1.5rem; /* p-6 */
```

### Gap Sizes:
```css
Small:  0.5rem  (gap-2)
Medium: 0.75rem (gap-3)
Large:  1rem    (gap-4)
XLarge: 1.5rem  (gap-6)
```

### Border Radius:
```css
Small:  0.5rem  (rounded-lg)
Medium: 0.75rem (rounded-xl)
Large:  1rem    (rounded-2xl)
```

---

## 🌓 DARK MODE

### Implementation:
```css
/* Light Mode (default) */
.light-mode {
  background: from-blue-50 via-indigo-50 to-purple-50;
  text: gray-900;
}

/* Dark Mode */
.dark-mode {
  background: from-gray-900 via-blue-900 to-indigo-900;
  text: gray-100;
}
```

### Auto Detection:
```css
@media (prefers-color-scheme: dark) {
  /* Dark mode styles */
}
```

---

## 💬 TONE OF VOICE

### Komunikasi:
- **Ramah** - Gunakan bahasa yang hangat dan sopan
- **Jelas** - Instruksi yang mudah dipahami
- **Profesional** - Tetap formal namun tidak kaku
- **Membantu** - Fokus pada solusi

### Contoh Pesan:

#### Success:
```
✅ "Pendaftaran berhasil! Nomor antrian Anda: PH-001"
✅ "Pengaturan berhasil disimpan!"
✅ "Selamat datang di KIANSANTANG"
```

#### Error:
```
❌ "Mohon lengkapi semua field yang diperlukan"
❌ "Koneksi terputus. Silakan coba lagi"
❌ "Data PK belum tersedia. Silakan hubungi admin"
```

#### Info:
```
ℹ️ "Silakan tunggu, antrian Anda akan segera dipanggil"
ℹ️ "Estimasi waktu tunggu: 15 menit"
ℹ️ "Pengumuman akan diulang 2x secara otomatis"
```

---

## 🎯 BRAND APPLICATIONS

### Halaman Utama:
- Header dengan branding KIANSANTANG
- Gradient background
- Modern navigation bar
- Service cards dengan icon

### Dashboard Operator:
- Header dengan nama KIANSANTANG
- Subtitle: "Dashboard Operator - Loket X"
- Modern card layout
- Gradient buttons

### Display TV:
- Header besar dengan KIANSANTANG
- Tagline dan institusi
- Real-time queue display
- Professional layout

---

## 📊 USAGE GUIDELINES

### DO ✅

- Gunakan gradient untuk header
- Konsisten dengan color palette
- Maintain spacing dan alignment
- Use backdrop blur untuk modern effect
- Responsive di semua device
- Accessible (contrast ratio min 4.5:1)

### DON'T ❌

- Jangan ubah nama "KIANSANTANG"
- Jangan gunakan warna di luar palette
- Jangan terlalu banyak animasi
- Jangan compress logo terlalu kecil
- Jangan gunakan font lain
- Jangan abaikan dark mode

---

## 🔄 BRAND CONSISTENCY

### Checklist:

```
□ Nama "KIANSANTANG" di semua halaman
□ Tagline konsisten
□ Color palette sesuai guideline
□ Typography konsisten
□ Gradient pattern sama
□ Icon style uniform
□ Spacing proporsional
□ Responsive di mobile & desktop
□ Dark mode support
□ Accessibility compliant
```

---

## 📝 BRAND ASSETS

### File Locations:

```
/index.html           - Meta tags & title
/src/pages/Index.tsx  - Homepage branding
/src/pages/Display.tsx - Display branding
/src/pages/Operator.tsx - Operator branding
```

### Meta Tags:
```html
<title>KIANSANTANG - Kios Antrian Santun dan Tanggap | BAPAS Bandung</title>
<meta name="description" content="KIANSANTANG (Kios Antrian Santun dan Tanggap) - Sistem Layanan BAPAS Bandung Berbasis Digital" />
<meta name="keywords" content="KIANSANTANG, Antrian BAPAS, BAPAS Bandung, Layanan Digital" />
```

---

## 🎨 DESIGN SYSTEM

### Components:

#### Header Component:
```tsx
<div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
  <div className="flex items-center gap-4">
    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
      <Monitor className="w-8 h-8" />
    </div>
    <div>
      <h1 className="text-5xl font-black">KIANSANTANG</h1>
      <p className="text-sm text-blue-100">Kios Antrian Santun dan Tanggap</p>
    </div>
  </div>
</div>
```

#### Button Component:
```tsx
<Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
  Action
</Button>
```

#### Card Component:
```tsx
<Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl">
  Content
</Card>
```

---

## 📞 CONTACT & SUPPORT

**Brand Manager:** Tim IT BAPAS Bandung  
**Email:** it@bapas-bandung.kemenkumham.go.id  
**Website:** https://bapas-bandung.kemenkumham.go.id

---

## 📅 VERSION HISTORY

### Version 2.0 (November 2024)
- ✅ Rebranding ke KIANSANTANG
- ✅ Modern gradient design
- ✅ Improved typography
- ✅ Enhanced color palette
- ✅ Responsive layout
- ✅ Dark mode support

### Version 1.0 (Oktober 2024)
- Initial branding
- Basic color scheme
- Simple layout

---

**KIANSANTANG - Kios Antrian Santun dan Tanggap**  
*Sistem Layanan BAPAS Bandung Berbasis Digital*

© 2024 BAPAS Kelas I Bandung. All rights reserved.
