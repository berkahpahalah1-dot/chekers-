# Gmail Checker Massal — 4 indikator
Antarmuka checker massal dengan indikator Format, Professional, Domain status, dan Mailbox.
- Format: pemeriksaan sintaks alamat `@gmail.com`.
- Professional: kategori umum sederhana, bukan hasil verifikasi akun.
- Domain status: pemeriksaan DNS MX via DNS-over-HTTPS Cloudflare.
- Mailbox: Unknown; Google tidak menyediakan API publik untuk memastikan pendaftaran mailbox Gmail massal.

## Deploy gratis ke Vercel
1. Ekstrak ZIP.
2. Buat repository GitHub dan unggah folder `public` ke root repository (isi foldernya: `index.html`, `style.css`, `app.js`).
3. Impor repository ke Vercel sebagai proyek static, Framework Preset `Other`, tanpa build command dan output directory `.`.
4. Deploy. Tidak perlu API key atau OAuth.

DNS query bergantung pada akses jaringan browser. Jika diblokir, status domain tampil Unknown. Status mailbox tidak membuktikan akun terdaftar, menerima email, atau sedang login.
