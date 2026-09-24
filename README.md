# Atilla — Portfolio

Portofolio pribadi Atilla Kuncoro Djati, dengan Bening Studio sebagai proyek unggulan dan daftar karya publik yang diambil dari GitHub. Tampilan merah, hitam, dan putih mengambil inspirasi dari bahasa visual Persona 5: tipografi tebal, komposisi poster, bentuk miring, serta tekstur komik.

**Website:** [atillakuncorodjati.vercel.app](https://atillakuncorodjati.vercel.app)

## Isi website

- Profil, minat, dan kontak berdasarkan profil GitHub publik.
- Bening Studio dengan pratinjau antarmuka serta tautan rilis terbaru.
- Daftar proyek web, desktop, dan data dari repositori publik.
- Filter kategori dan pencarian berdasarkan nama, deskripsi, serta teknologi.
- Detail proyek berisi tujuan, fitur, teknologi, dan tautan dokumentasi. Tautan seperti `/#proyek/Bening-Studio` dapat dibagikan langsung.
- Kelompok kemampuan Web, Desktop, dan Data, dengan contoh proyek terkait.
- Ringkasan jumlah karya, bahasa utama repositori, dan stars berdasarkan data publik.
- Tata letak responsif untuk desktop dan ponsel.
- Menu ponsel, dialog dengan dukungan keyboard, serta pengurangan animasi mengikuti preferensi perangkat.
- Data tersimpan sebagai cadangan saat GitHub tidak tersedia.
- Dukungan data CV, pendidikan, pengalaman, dan sertifikat melalui `public/profile.json`.

## Menjalankan secara lokal

Gunakan Node.js 24, kemudian:

```sh
npm run build
npm run dev
```

Buka `http://127.0.0.1:4173`. Proyek tidak memerlukan dependensi aplikasi tambahan. `npm test` menjalankan pemeriksaan penyaringan data publik, penanganan kegagalan, cache, pencarian, kategori, statistik, dan validasi tautan.

## Publikasi ke Vercel

Repositori ini terhubung ke proyek `atilla-portfolio` di Vercel. Push ke branch `main` memicu build dan penerbitan otomatis ke [website publik](https://atillakuncorodjati.vercel.app).

Untuk memakai proyek ini di akun lain, import repositorinya ke Vercel. Konfigurasi sudah tersedia di `vercel.json`:

- Framework preset: Other.
- Build command: `npm run build`.
- Output directory: `public`.
- Node.js: 24.x.
- Fungsi server: `/api/github`.

Status build dapat diperiksa melalui daftar deployment di Vercel atau pemeriksaan commit di GitHub. Sinkronisasi data repositori melalui `/api/github` berjalan terpisah dari penerbitan perubahan kode website.

`GITHUB_TOKEN` bersifat opsional untuk menambah kuota permintaan GitHub. Jika digunakan, simpan hanya sebagai environment variable server di Vercel atau lingkungan lokal. Gunakan akses minimum untuk membaca data publik. Jangan masukkan token ke JavaScript browser, commit, atau berkas dalam `public`.

## Cara sinkronisasi

Halaman lebih dahulu memuat `public/data.json`, yang dibuat dari `data/github-snapshot.json` saat build. Setelah itu, halaman meminta data terkini melalui `/api/github`.

Fungsi membaca profil publik, hingga 100 repositori terbaru milik Atilla, serta rilis stabil terbaru Bening Studio. Repositori privat, fork, dan arsip tidak ditampilkan. Repositori profil serta kode website ini disembunyikan dari daftar karya.

Hasil disimpan sementara selama 15 menit. CDN dapat menyajikan hasil sebelumnya sambil memperbarui cache. Jika permintaan GitHub gagal, website memakai salinan tersimpan dan menandainya pada halaman. Tidak diperlukan database.

Nama tampilan, kategori, dan cerita proyek berada di `public/projects.js`, dirangkum dari README dan deskripsi publik repositori. Proyek baru yang belum memiliki cerita khusus tetap ditampilkan menggunakan data GitHub. Teks profil, kontak, dan gambar unggulan berada di `public/index.html`. Memperbarui bio atau kontak di README profil GitHub tidak otomatis mengganti teks editorial di website.

Jumlah bahasa pada bagian GitHub menghitung bahasa utama yang berbeda di repositori karya, bukan tingkat penguasaan. Tahun pada kartu adalah tahun pembaruan repositori, bukan klaim tahun penyelesaian proyek.

## Menambahkan CV dan rekam jejak

Isi `public/profile.json` setelah bahan pribadi tersedia. Nilai awal sengaja kosong; tombol CV dan bagian rekam jejak baru muncul ketika ada data, sehingga website tidak menampilkan informasi contoh sebagai fakta.

- `resume`: alamat PDF, misalnya `/documents/atilla-cv.pdf`.
- `experience`: daftar pengalaman dengan `title`, `organization`, `period`, dan `description`.
- `education`: daftar pendidikan dengan field yang sama.
- `certificates`: daftar sertifikat dengan `title`, `organization`, `period`, serta `image` dan `url` jika tersedia.

Contoh format satu entri sertifikat (ganti seluruh isinya dengan data sebenarnya):

```json
{
  "title": "Nama sertifikat",
  "organization": "Nama penerbit",
  "period": "Bulan dan tahun terbit",
  "description": "Ringkasan kompetensi yang dipelajari",
  "image": "/assets/certificates/nama-sertifikat.png",
  "url": "https://alamat-verifikasi-sertifikat"
}
```

Simpan PDF dalam `public/documents/` dan gambar dalam `public/assets/`. Gunakan materi yang memang ingin ditampilkan secara publik. Bagian yang belum memiliki isi tidak ditampilkan. Foto/ilustrasi pribadi nantinya dapat menggantikan monogram AKD pada bagian Tentang.

## Pemeriksaan tampilan

Periksa filter Web/Desktop/Data, kombinasi kata kunci, hasil pencarian kosong, detail proyek dari tautan langsung, tombol Escape, dan navigasi ponsel. Dialog menggunakan elemen HTML native agar fokus keyboard tetap di dalamnya. Semua isi dari data ditampilkan sebagai teks, bukan HTML mentah.

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

Pratinjau Bening Studio berasal dari [repositori Bening Studio](https://github.com/AtillaKuncoroDjati/Bening-Studio). Foto harimau dalam pratinjau berasal dari contoh publik rembg; atribusi dan lisensinya tersedia dalam [catatan gambar Bening](https://github.com/AtillaKuncoroDjati/Bening-Studio/blob/main/docs/images/README.md). Font DM Sans dan Barlow Condensed dimuat dari Google Fonts dengan font sistem sebagai cadangan.

Bentuk bintang, monogram AKD, pola titik, dan ilustrasi tipografi dibuat dengan CSS/SVG untuk portofolio ini. Persona 5 menjadi referensi gaya visual. Struktur studi kasus dan penyajian profil juga mendapat inspirasi dari portofolio [Muhammad Danu Setiawan](https://muhammaddanusetiawan.vercel.app/) dan [Mochammad Irsyad Kurniawan](https://mochammadirsyadkurniawan-portfolio.vercel.app/).
