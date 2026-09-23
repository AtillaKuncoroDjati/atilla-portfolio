# Atilla — Portfolio

Portofolio pribadi Atilla Kuncoro Djati, dengan Bening Studio sebagai proyek unggulan dan daftar karya publik yang diambil dari GitHub.

**Website:** [atillakuncorodjati.vercel.app](https://atillakuncorodjati.vercel.app)

## Isi website

- Profil, minat, dan kontak berdasarkan profil GitHub publik.
- Bening Studio dengan pratinjau antarmuka serta tautan rilis terbaru.
- Daftar proyek web, desktop, dan data dari repositori publik.
- Tata letak responsif untuk desktop dan ponsel.
- Data tersimpan sebagai cadangan saat GitHub tidak tersedia.

## Menjalankan secara lokal

Gunakan Node.js 24, kemudian:

```sh
npm run build
npm run dev
```

Buka `http://127.0.0.1:4173`. Proyek tidak memerlukan dependensi aplikasi tambahan. `npm test` menjalankan pemeriksaan penyaringan data publik, penanganan kegagalan, dan cache.

## Publikasi ke Vercel

Import repositori ini ke Vercel. Konfigurasi sudah tersedia di `vercel.json`:

- Framework preset: Other.
- Build command: `npm run build`.
- Output directory: `public`.
- Node.js: 24.x.
- Fungsi server: `/api/github`.

Setelah repositori terhubung, perubahan pada branch produksi dapat diterbitkan otomatis oleh Vercel.

`GITHUB_TOKEN` bersifat opsional untuk menambah kuota permintaan GitHub. Jika digunakan, simpan hanya sebagai environment variable server di Vercel atau lingkungan lokal. Gunakan akses minimum untuk membaca data publik. Jangan masukkan token ke JavaScript browser, commit, atau berkas dalam `public`.

## Cara sinkronisasi

Halaman lebih dahulu memuat `public/data.json`, yang dibuat dari `data/github-snapshot.json` saat build. Setelah itu, halaman meminta data terkini melalui `/api/github`.

Fungsi membaca profil publik, hingga 100 repositori terbaru milik Atilla, serta rilis stabil terbaru Bening Studio. Repositori privat, fork, dan arsip tidak ditampilkan. Repositori profil serta kode website ini disembunyikan dari daftar karya.

Hasil disimpan sementara selama 15 menit. CDN dapat menyajikan hasil sebelumnya sambil memperbarui cache. Jika permintaan GitHub gagal, website memakai salinan tersimpan dan menandainya pada halaman. Tidak diperlukan database.

Nama tampilan dan daftar pengecualian berada di `public/app.js`. Teks profil, kontak, dan gambar unggulan berada di `public/index.html`. Data repositori tetap berasal dari GitHub; memperbarui bio atau kontak di README profil GitHub tidak otomatis mengganti teks editorial di website.

## Struktur

```text
public/       Halaman, gaya, JavaScript browser, dan gambar
api/          Fungsi Vercel untuk data GitHub
lib/          Pembacaan, penyaringan, dan cache data
data/         Salinan data publik sebagai cadangan
scripts/      Build dan server lokal
tests/        Pemeriksaan penanganan data
```

## Kredit aset

Pratinjau Bening Studio berasal dari [repositori Bening Studio](https://github.com/AtillaKuncoroDjati/Bening-Studio). Foto harimau dalam pratinjau berasal dari contoh publik rembg; atribusi dan lisensinya tersedia dalam [catatan gambar Bening](https://github.com/AtillaKuncoroDjati/Bening-Studio/blob/main/docs/images/README.md). Avatar ditampilkan dari profil GitHub publik Atilla. Font DM Sans dan Manrope dimuat dari Google Fonts dengan font sistem sebagai cadangan.
