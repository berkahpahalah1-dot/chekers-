# Gmail Checker Massal — Full Project

## Struktur yang benar
```text
public/
  index.html
  style.css
  app.js
README.md
```

## Deploy ke Vercel
1. Ekstrak ZIP ini.
2. Di repository GitHub, pastikan tiga file (`index.html`, `style.css`, `app.js`) berada bersama-sama di dalam folder `public`.
3. Buka Vercel dan impor repository GitHub.
4. Settings → Build and Deployment:
   - Framework Preset: `Other`
   - Build Command: kosong
   - Output Directory: `public`
5. Save, lalu Deploy atau Redeploy.

Jika kamu mengunggah isi folder `public` langsung ke root repository (sehingga `index.html` ada di root), atur Output Directory menjadi `.`.

## Batasan
Website ini memeriksa format Gmail, menghitung hingga 50 alamat, dan memeriksa DNS MX domain Gmail. Indikator Mailbox selalu `Unknown` karena tidak ada API publik Google untuk memeriksa massal apakah alamat Gmail sembarang sudah terdaftar. Ini juga tidak memeriksa status login perangkat.
