# 🚀 DEPLOYMENT GUIDE - KIANSANTANG ONLINE

## 🌐 **DEPLOY KE WEBSITE - STEP BY STEP**

---

## 📋 **PILIHAN DEPLOYMENT:**

### **Option 1: Netlify (RECOMMENDED)** ⭐
- **Domain Gratis:** `kiansantang-bapas.netlify.app`
- **Custom Domain:** Bisa pakai domain sendiri
- **Cost:** FREE (unlimited)
- **Setup Time:** 5-10 menit

### **Option 2: Vercel**
- **Domain Gratis:** `kiansantang-bapas.vercel.app`
- **Custom Domain:** Bisa pakai domain sendiri
- **Cost:** FREE
- **Setup Time:** 5-10 menit

### **Option 3: Custom Domain + Hosting**
- **Domain:** `.id`, `.com`, `.co.id` (Rp 100k-300k/tahun)
- **Hosting:** VPS atau Shared Hosting
- **Cost:** Rp 300k-1jt/tahun
- **Setup Time:** 30-60 menit

---

## 🚀 **DEPLOYMENT - NETLIFY (EASIEST)**

### **STEP 1: Persiapan**

#### **1.1. Build Project**
```bash
npm run build
```

**Expected Output:**
```
✓ built in 10s
dist/index.html                   5.2 kB
dist/assets/index-abc123.js     250.5 kB
dist/assets/index-def456.css     15.3 kB
```

#### **1.2. Test Build Locally**
```bash
npm run preview
```
Buka http://localhost:4173 dan test semua fitur.

---

### **STEP 2: Deploy ke Netlify**

#### **Method A: Drag & Drop (SUPER MUDAH!)**

1. **Buka** https://app.netlify.com/drop

2. **Drag & Drop** folder `dist` ke area upload

3. **Tunggu** upload selesai (1-2 menit)

4. **DONE!** Website langsung online!

**URL:** `https://random-name-12345.netlify.app`

---

#### **Method B: GitHub + Auto Deploy (RECOMMENDED)**

##### **2.1. Push ke GitHub**

```bash
# Initialize git (jika belum)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - KIANSANTANG"

# Create repo di GitHub
# Buka https://github.com/new
# Nama repo: kiansantang-bapas

# Add remote
git remote add origin https://github.com/USERNAME/kiansantang-bapas.git

# Push
git push -u origin main
```

##### **2.2. Connect ke Netlify**

1. **Login** ke https://app.netlify.com

2. **Klik** "Add new site" → "Import an existing project"

3. **Pilih** "GitHub"

4. **Authorize** Netlify

5. **Pilih** repository `kiansantang-bapas`

6. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

7. **Add Environment Variables:**
   ```
   VITE_SUPABASE_URL=https://kumtbqyeyzvejwxsuier.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_GOOGLE_SPREADSHEET_ID=1P9P_kGuIPrZDm1rBTeG491FfdX2z7jawXW6C4N3dSr0
   VITE_GOOGLE_API_KEY=AIzaSyBlhAbp9EZPnV9O5yh5tL_K9R8axVg5frU
   VITE_ENABLE_AUTO_SYNC=true
   VITE_SYNC_INTERVAL_MINUTES=5
   ```

8. **Klik** "Deploy site"

9. **Tunggu** 2-3 menit

10. **DONE!** Website online!

---

### **STEP 3: Custom Domain (OPTIONAL)**

#### **3.1. Beli Domain**

**Rekomendasi Provider:**
- **Niagahoster:** https://www.niagahoster.co.id
- **Rumahweb:** https://www.rumahweb.com
- **Cloudflare:** https://www.cloudflare.com (cheapest)

**Saran Domain:**
- `kiansantang.id` (Rp 150k/tahun)
- `bapasbandung.id` (Rp 150k/tahun)
- `antrianbapas.com` (Rp 120k/tahun)

#### **3.2. Setup Domain di Netlify**

1. **Buka** Site settings → Domain management

2. **Klik** "Add custom domain"

3. **Masukkan** domain Anda (contoh: `kiansantang.id`)

4. **Klik** "Verify"

5. **Netlify akan kasih DNS records:**
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: kiansantang-bapas.netlify.app
   ```

6. **Buka** DNS management di provider domain Anda

7. **Tambahkan** DNS records dari Netlify

8. **Tunggu** 1-24 jam (propagasi DNS)

9. **DONE!** Domain custom aktif!

---

## 🔒 **SETUP HTTPS (AUTO)**

Netlify otomatis setup HTTPS dengan Let's Encrypt!

**Cek:**
- ✅ Padlock icon di browser
- ✅ URL mulai dengan `https://`
- ✅ Certificate valid

---

## 📊 **POST-DEPLOYMENT CHECKLIST**

### **Test Semua Fitur:**

- [ ] Home page load
- [ ] Service selection works
- [ ] Queue generation works
- [ ] Display page works
- [ ] Video/logo display
- [ ] Operator page works
- [ ] Google Sheets sync works
- [ ] Bimbingan form works
- [ ] Print ticket works
- [ ] Admin login works

### **Performance Check:**

- [ ] Page load < 3 seconds
- [ ] Images optimized
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All links work

### **Security Check:**

- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] No API keys in code
- [ ] RLS policies active
- [ ] Admin protected

---

## 🎯 **DOMAIN SUGGESTIONS**

### **Option 1: Subdomain Gratis**
```
kiansantang-bapas.netlify.app
```
- ✅ FREE
- ✅ Instant
- ✅ HTTPS auto
- ❌ Panjang

### **Option 2: Domain .ID**
```
kiansantang.id
bapasbandung.id
antrianbapas.id
```
- ✅ Professional
- ✅ Short
- ✅ Local (.id)
- 💰 Rp 150k/tahun

### **Option 3: Domain .COM**
```
kiansantang.com
bapasbandung.com
antrianbapas.com
```
- ✅ International
- ✅ Trusted
- 💰 Rp 120k/tahun

### **Option 4: Subdomain Instansi**
```
antrian.bapas-bandung.go.id
kiansantang.bapas-bandung.go.id
```
- ✅ Official
- ✅ FREE (jika ada akses)
- ⏳ Perlu koordinasi IT

---

## 🔧 **TROUBLESHOOTING**

### **Problem: Build Failed**

**Solution:**
```bash
# Clear cache
rm -rf node_modules
rm -rf dist
npm install
npm run build
```

### **Problem: Environment Variables Not Working**

**Solution:**
1. Check spelling
2. Restart build
3. Check Netlify dashboard → Site settings → Environment variables

### **Problem: Domain Not Working**

**Solution:**
1. Check DNS propagation: https://dnschecker.org
2. Wait 24 hours
3. Clear browser cache
4. Try incognito mode

### **Problem: 404 on Refresh**

**Solution:**
Check `netlify.toml` has redirect rules (already included!)

---

## 📱 **MONITORING & ANALYTICS**

### **Netlify Analytics (Optional - Paid)**
- Visitor stats
- Page views
- Performance metrics

### **Google Analytics (FREE)**

Add to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🎊 **DEPLOYMENT CHECKLIST**

### **Pre-Deployment:**
- [ ] Test locally (`npm run dev`)
- [ ] Build successfully (`npm run build`)
- [ ] Preview build (`npm run preview`)
- [ ] All features working
- [ ] No console errors
- [ ] Environment variables ready

### **Deployment:**
- [ ] Push to GitHub
- [ ] Connect to Netlify
- [ ] Add environment variables
- [ ] Deploy
- [ ] Check deployment logs
- [ ] Test live site

### **Post-Deployment:**
- [ ] Test all features online
- [ ] Check mobile responsive
- [ ] Test on different browsers
- [ ] Setup custom domain (optional)
- [ ] Enable HTTPS
- [ ] Add to Google Search Console
- [ ] Share with team

---

## 💰 **COST ESTIMATION**

### **FREE Option:**
```
Netlify Hosting:        FREE
Netlify Domain:         FREE (.netlify.app)
Supabase:              FREE (up to 500MB)
Google Sheets API:     FREE
Total:                 Rp 0/month
```

### **Custom Domain Option:**
```
Netlify Hosting:        FREE
Custom Domain (.id):    Rp 150k/year
Supabase:              FREE
Google Sheets API:     FREE
Total:                 Rp 12.5k/month
```

### **Premium Option:**
```
Netlify Pro:           $19/month
Custom Domain (.id):    Rp 150k/year
Supabase Pro:          $25/month
Total:                 ~Rp 700k/month
```

**RECOMMENDATION: Start with FREE option!**

---

## 🚀 **QUICK START COMMANDS**

```bash
# 1. Build
npm run build

# 2. Test build
npm run preview

# 3. Deploy (if using Netlify CLI)
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod

# 4. Done!
```

---

## 📞 **SUPPORT**

### **Netlify Support:**
- Docs: https://docs.netlify.com
- Community: https://answers.netlify.com
- Status: https://www.netlifystatus.com

### **Domain Support:**
- Niagahoster: https://www.niagahoster.co.id/support
- Rumahweb: https://www.rumahweb.com/support

---

## 🎯 **RECOMMENDED SETUP**

### **For Testing/Development:**
```
Platform: Netlify
Domain: kiansantang-bapas.netlify.app (FREE)
Cost: Rp 0
Time: 10 minutes
```

### **For Production:**
```
Platform: Netlify
Domain: kiansantang.id (custom)
Cost: Rp 150k/year
Time: 30 minutes
```

---

**KIANSANTANG - Kios Antrian Santun dan Tanggap**
*Deployment Guide - Go Live in 10 Minutes!*

© 2024 BAPAS Kelas I Bandung

---

## ✅ **NEXT STEPS:**

1. **Build project:** `npm run build`
2. **Choose deployment method** (Drag & Drop or GitHub)
3. **Deploy to Netlify**
4. **Test live site**
5. **Setup custom domain** (optional)
6. **Share with team!**

**Ready to go live?** 🚀
