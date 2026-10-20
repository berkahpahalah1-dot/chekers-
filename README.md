# Email Verifier

Web app sederhana untuk memverifikasi 1-100 email sekaligus, menggunakan [Abstract API Email Validation](https://www.abstractapi.com/api/email-verification-validation-api).

## Menjalankan di lokal

1. Install dependency:
   ```
   npm install
   ```
2. Salin `.env.example` menjadi `.env.local`, lalu isi dengan API key Abstract API kamu:
   ```
   ABSTRACT_API_KEY=xxxxxxxxxxxxxxxxxxxx
   ```
3. Jalankan:
   ```
   npm run dev
   ```
4. Buka `http://localhost:3000`.

## Deploy ke GitHub + Vercel

1. Push project ini ke repository GitHub baru (jangan commit `.env.local` — sudah masuk `.gitignore`).
2. Buka [vercel.com](https://vercel.com), klik **Add New Project**, lalu import repository GitHub tadi.
3. Di langkah konfigurasi, buka **Environment Variables**, tambahkan:
   - Key: `ABSTRACT_API_KEY`
   - Value: API key dari Abstract API
4. Klik **Deploy**. Setelah selesai, web kamu sudah live di domain `*.vercel.app`.

## Catatan

- Free tier Abstract API: 100 permintaan/bulan. Kalau kebutuhan verifikasi lebih besar, upgrade paket atau ganti provider lain (Emailable, MailboxValidator, dll) — tinggal ganti bagian `verifyOne()` di `pages/api/verify.js`.
- API key hanya dipakai di sisi server (`pages/api/verify.js`), tidak pernah dikirim ke browser, jadi aman.
