# ⚡ QUICK DEPLOY - 10 MENIT ONLINE!

## 🚀 **CARA TERCEPAT: NETLIFY DROP**

### **STEP 1: BUILD (2 menit)**

```bash
npm run build
```

**Tunggu sampai selesai:**
```
✓ built in 10s
dist/index.html
dist/assets/...
```

---

### **STEP 2: DEPLOY (3 menit)**

1. **Buka:** https://app.netlify.com/drop

2. **Drag folder `dist`** ke area upload

3. **Tunggu upload** (1-2 menit)

4. **DONE!** ✅

**URL:** `https://random-name-12345.netlify.app`

---

### **STEP 3: SETUP ENVIRONMENT (3 menit)**

1. **Klik** "Site settings"

2. **Klik** "Environment variables"

3. **Add variables:**

```
VITE_SUPABASE_URL
https://kumtbqyeyzvejwxsuier.supabase.co

VITE_SUPABASE_PUBLISHABLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1bXRicXlleXp2ZWp3eHN1aWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzU0NTQsImV4cCI6MjA3Nzc1MTQ1NH0.iN6AOQNP3_5hpks0W8pfpsg1I-5_vNfMFKD4x5mDRQM

VITE_GOOGLE_SPREADSHEET_ID
1P9P_kGuIPrZDm1rBTeG491FfdX2z7jawXW6C4N3dSr0

VITE_GOOGLE_API_KEY
AIzaSyBlhAbp9EZPnV9O5yh5tL_K9R8axVg5frU

VITE_ENABLE_AUTO_SYNC
true

VITE_SYNC_INTERVAL_MINUTES
5
```

4. **Klik** "Save"

5. **Klik** "Trigger deploy" → "Deploy site"

---

### **STEP 4: TEST (2 menit)**

1. **Buka** URL website

2. **Test:**
   - [ ] Home page load
   - [ ] Pilih layanan
   - [ ] Generate antrian
   - [ ] Display page
   - [ ] Operator page

3. **DONE!** 🎉

---

## 🌐 **CUSTOM DOMAIN (OPTIONAL)**

### **Rekomendasi Domain:**

**Budget Friendly:**
- `kiansantang.id` - Rp 150k/tahun
- `bapasbandung.id` - Rp 150k/tahun
- `antrianbapas.com` - Rp 120k/tahun

**Where to Buy:**
- **Niagahoster:** https://www.niagahoster.co.id
- **Rumahweb:** https://www.rumahweb.com
- **Cloudflare:** https://www.cloudflare.com

### **Setup:**

1. **Beli domain**

2. **Di Netlify:** Site settings → Domain management → Add custom domain

3. **Copy DNS records** dari Netlify

4. **Paste di DNS management** provider domain

5. **Tunggu** 1-24 jam

6. **DONE!**

---

## 📊 **TOTAL TIME:**

```
Build:        2 menit
Deploy:       3 menit
Setup Env:    3 menit
Test:         2 menit
--------------------------
TOTAL:       10 MENIT! ⚡
```

---

## ✅ **CHECKLIST:**

- [ ] `npm run build` berhasil
- [ ] Upload `dist` folder ke Netlify
- [ ] Add environment variables
- [ ] Trigger deploy
- [ ] Test website online
- [ ] All features working
- [ ] Share URL dengan tim

---

## 🎯 **URL EXAMPLES:**

**Free Netlify:**
```
https://kiansantang-bapas.netlify.app
```

**Custom Domain:**
```
https://kiansantang.id
https://bapasbandung.id
https://antrian.bapas-bandung.go.id
```

---

## 🚨 **TROUBLESHOOTING:**

### **Build Failed?**
```bash
rm -rf node_modules dist
npm install
npm run build
```

### **Website Blank?**
- Check environment variables
- Check console errors (F12)
- Redeploy site

### **Features Not Working?**
- Check Supabase URL correct
- Check API keys correct
- Check RLS policies

---

## 📞 **NEED HELP?**

**Netlify Docs:** https://docs.netlify.com
**Netlify Status:** https://www.netlifystatus.com

---

**KIANSANTANG - Ready to Go Live!** 🚀

**Next:** Share URL dengan tim dan mulai gunakan! 🎉
