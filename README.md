# NONTONTEROSS

**Streaming Anime Sub Indo**  
Owner: **jiyyad tools**

Web nonton anime memakai scraper AnimeIndo (`ww2.animeindo.pro`).

## Fitur
- Cari anime
- Detail + daftar episode
- Streaming via iframe (multi server)
- Link download (jika ada)

---

## 1. Jalanin Lokal

```bash
cd nontonteross
PORT=3456 node server.js
```

Buka: http://localhost:3456

---

## 2. Deploy ke Vercel (gratis)

### Cara cepat (via GitHub)
1. Buat repo GitHub baru, upload semua file folder `nontonteross`
2. Buka [vercel.com](https://vercel.com) → Login → **Add New Project**
3. Import repo tersebut
4. Framework Preset: **Other**
5. Root Directory: biarkan `.` (atau isi `nontonteross` kalau di subfolder)
6. Klik **Deploy**

Setelah selesai, kamu dapat link seperti:
`https://nontonteross-xxxx.vercel.app`

### Via CLI (opsional)
```bash
npm i -g vercel
cd nontonteross
vercel
```

> **Catatan Vercel:**  
> - Timeout maksimal ~30 detik (sudah diset di `vercel.json`).  
> - Kalau scrape lambat kadang error timeout → coba lagi / pilih platform di bawah.

---

## 3. Deploy ke Render.com (rekomendasi, lebih stabil)

1. Buka [render.com](https://render.com) → Sign up
2. **New +** → **Web Service**
3. Connect repo GitHub (atau upload)
4. Setting:
   - **Runtime**: Node
   - **Build Command**: (kosongkan)
   - **Start Command**: `node server.js`
   - **Instance Type**: Free
5. Deploy

Render cocok karena long-running process (bukan serverless).

---

## 4. Deploy ke Railway

1. Buka [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Pilih repo → Railway otomatis deteksi `node server.js`
4. Generate Domain

---

## 5. VPS / Self-host (paling bebas)

Contoh di Ubuntu:
```bash
# install node 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# clone / upload project
cd nontonteross
PORT=3000 node server.js

# atau pakai pm2 biar selalu nyala
npm i -g pm2
pm2 start server.js --name nontonteross
pm2 save
pm2 startup
```

Lalu pasang Nginx + domain + SSL (opsional).

---

## Struktur File

```
nontonteross/
├── api/                 ← untuk Vercel serverless
│   ├── search.js
│   ├── detail.js
│   └── watch.js
├── public/
│   └── index.html       ← Frontend
├── scraper.js           ← Scraper AnimeIndo
├── server.js            ← Server biasa (Render / Railway / VPS)
├── vercel.json
├── package.json
└── README.md
```

## API Endpoints
- `GET /api/search?q=judul`
- `GET /api/detail?url=...`
- `GET /api/watch?url=...`

---

**NONTONTEROSS** by **jiyyad tools**
