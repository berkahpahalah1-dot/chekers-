# Gmail Checker Massal

Website statis sederhana untuk memeriksa format alamat `@gmail.com` dan menemukan duplikat. Daftar email diproses di browser, tidak dikirim ke server aplikasi.

## Yang dilakukan
- Menerima banyak email, dipisahkan baris baru, koma, titik koma, atau spasi.
- Memeriksa format dasar alamat Gmail.
- Menandai alamat duplikat.
- Menyalin semua email berformat valid atau menyalin hasil pemeriksaan.

## Yang tidak dilakukan
Google tidak menyediakan API publik untuk memastikan apakah alamat Gmail sembarang sudah terdaftar. Aplikasi ini tidak dan tidak bisa menyimpulkan status "terpakai/belum terpakai" dari format email.

## Deploy ke Vercel dari GitHub
1. Ekstrak ZIP ini.
2. Buat repository baru di GitHub.
3. Unggah semua isi folder proyek (folder `public`, `package.json`, `server.js`, `vercel.json`, `.gitignore`, dan `README.md`) ke repository.
4. Di Vercel, pilih **Add New → Project**, lalu impor repository GitHub tersebut.
5. Tekan **Deploy**. Untuk proyek sederhana ini, tidak ada API key atau kata sandi yang diperlukan.

Jika konfigurasi build Vercel yang digunakan akunmu tidak menerima `vercel.json` ini, hapus `vercel.json` dan impor sebagai proyek static dengan output directory `public`.

## Menjalankan lokal (opsional)
Memerlukan Node.js:
```bash
npm install
npm start
```
Lalu buka `http://localhost:3000`.
