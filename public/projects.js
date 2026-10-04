const OWNER = 'AtillaKuncoroDjati';
const excluded = new Set([OWNER.toLowerCase(), 'atilla-portfolio']);
export const catalog = {
  kozenime: {
    title: 'KOZENIME', category: 'web', art: 'FIND YOUR\nNEXT EPISODE.', stack: ['Laravel', 'PHP', 'MySQL', 'JavaScript'],
    image: '/assets/projects/kozenime-home.jpg', imageAlt: 'Home KOZENIME dengan banner anime, pencarian langsung dan navigasi katalog', imageWidth: 1265, imageHeight: 712,
    summary: 'Platform anime sub Indonesia dengan pencarian langsung, library pribadi, diskusi, pilihan server episode, dan dashboard admin.',
    purpose: 'Menyatukan penemuan anime, pilihan episode dan interaksi komunitas dalam pengalaman yang mudah digunakan, sambil memberi admin kendali atas katalog.',
    features: ['Banner Home otomatis atau pilihan manual, pencarian langsung, filter genre dan status anime.', 'Bookmark, library akun, foto profil dengan preview dan crop, serta reset password melalui email.', 'Diskusi anime dan episode dengan gambar, GIF, stiker, spoiler toggle dan moderasi.', 'Pilihan server streaming dan download yang dikelompokkan berdasarkan format, resolusi dan server.', 'Dashboard admin untuk edit anime/episode, tanggal manual, backup artwork dan Update Katalog dengan review mapping.'],
    approach: 'Laravel menangani akun, otorisasi, database canonical dan pekerjaan latar. Antarmuka responsif memakai JavaScript, tema gelap/terang dan identitas emas KOZENIME. Update Katalog melewati staging, validasi dan review sebelum data disimpan.',
    usage: ['Pasang dependency PHP dan frontend, salin template environment, lalu isi database dan akun admin lokal.', 'Jalankan migration, build tampilan dan server lokal; worker terpisah menangani Update Katalog.', 'Jelajahi katalog tanpa login; masuk untuk bookmark dan diskusi. Admin mengelola anime, episode, banner dan review.'],
    note: 'Aplikasi dijalankan secara lokal; repository menyediakan kode dan panduan, tanpa database produksi atau video. Pemutaran bergantung pada dukungan provider, format dan codec file.',
    documentation: 'https://github.com/AtillaKuncoroDjati/kozenime/blob/main/docs/INSTALLATION.md',
    gallery: [
      { image: '/assets/projects/kozenime-anime.jpg', caption: 'Detail anime dan navigasi episode' },
      { image: '/assets/projects/kozenime-episode.jpg', caption: 'Download berdasarkan format, resolusi dan server' }
    ]
  },
  'anime-scrapper-indonesia': {
    title: 'Anime Scrapper Indonesia', category: 'data', art: 'SOURCE.\nSTRUCTURE.\nSYNC.', stack: ['Python', 'Playwright', 'BeautifulSoup', 'AniList API'],
    image: '/assets/projects/anime-scrapper-indonesia.svg', imageAlt: 'Diagram Anime Scrapper Indonesia dari discovery source hingga normalisasi dan ekspor JSON', imageWidth: 1260, imageHeight: 710,
    summary: 'Pipeline Python untuk discovery katalog anime Indonesia, normalisasi episode dan link, enrichment AniList, serta ekspor JSON yang dapat ditinjau.',
    purpose: 'Mengubah data dari beberapa sumber menjadi struktur konsisten dengan identitas dan provenance yang jelas, agar aplikasi konsumen dapat meninjau dan mengimpor data secara aman.',
    features: ['Adapter Otakudesu, Anoboy dan Samehadaku dengan kemampuan discovery dan parsing sesuai masing-masing source.', 'Indeks dengan checkpoint/resume dan staging episode yang terpisah dari penulisan database.', 'Metadata AniList, identitas episode canonical dan provenance jadwal untuk anime multipart.', 'Format, resolusi, ukuran dan server download bila tersedia; mirror valid tidak menunggu semua mirror lengkap.', 'Regression tests berbasis fixture lokal dan laporan hasil yang membedakan review, validasi serta link yang belum tersedia.'],
    approach: 'Python, Requests dan BeautifulSoup digunakan untuk adapter source; Playwright menangani entry point yang membutuhkan browser. Output staging JSON, evidence dan progress dikonsumsi aplikasi lain, tanpa akses langsung ke MySQL.',
    usage: ['Buat virtual environment Python dan pasang requirements. Install Chromium Playwright bila memakai entry point browser.', 'Mulai discovery atau staging terbatas pada satu source, lalu periksa output JSON dan evidence.', 'Lanjutkan checkpoint dengan resume; tinjau mapping AniList yang ambigu sebelum import melalui aplikasi konsumen.'],
    note: 'Setiap source memiliki kemampuan berbeda dan tidak semua episode menyediakan download. Dataset produksi, profil browser dan video tidak disertakan; proses histori tidak dijalankan otomatis.',
    documentation: 'https://github.com/AtillaKuncoroDjati/anime-scrapper-indonesia/blob/main/docs/USAGE.md'
  },
  'Nusa-Rasa': {
    image: '/assets/projects/nusa-rasa.jpg', imageAlt: 'Beranda Nusa Rasa dengan inspirasi Karedok Spesial, pencarian bahan, dan koleksi resep Nusantara', imageWidth: 873, imageHeight: 672,
    title: 'Nusa Rasa', category: 'web', art: 'LOCAL TASTE.\nSHARED STORIES.', stack: ['React', 'Node.js', 'MySQL', 'Express', 'Vite'],
    summary: 'Platform berbagi resep Nusantara oleh Tim Nusa Rasa, dengan pencarian bahan, video resep, mode memasak, dan ulasan pengguna.',
    purpose: 'Membantu pengguna menemukan masakan sesuai bahan dan waktu yang tersedia, mengikuti langkah memasak, serta berbagi kreasi dari dapur sendiri.',
    features: ['Pencarian resep berdasarkan judul, bahan, daerah, dan durasi memasak.', 'Akun pengguna, pengelolaan resep, suka, penanda, dan notifikasi.', 'Unggah foto sampul dan video resep MP4 atau WebM hingga 50 MB.', 'Mode memasak langkah demi langkah dengan timer yang dapat dijeda.', 'Ulasan bintang dan foto hasil masakan yang dapat diperbarui atau dihapus.'],
    approach: 'Dikembangkan oleh Tim Nusa Rasa dari desain Figma, menggunakan React dan Vite untuk antarmuka, Node.js dan Express untuk layanan aplikasi, serta MySQL/MariaDB melalui XAMPP untuk penyimpanan data.',
    note: 'Aplikasi dijalankan secara lokal dengan Node.js dan MySQL/XAMPP. Panduan pemasangan tersedia di repositori GitHub.'
  },
  'Bening-Studio': {
    title: 'Bening Studio', category: 'desktop', art: 'MAKE IT\nBENING.', stack: ['C#', 'WPF', '.NET', 'ONNX Runtime'],
    summary: 'Aplikasi Windows portable untuk menghapus background, mengubah ukuran, dan menyimpan gambar transparan secara offline.',
    purpose: 'Menyederhanakan alur pengolahan gambar: buka gambar, atur hasil, proses, lalu simpan di komputer pengguna.',
    features: ['Penghapusan background dan ekspor PNG transparan.', 'Pembesaran serta pengecilan gambar dengan pilihan ukuran 2x, 4x, dan 8x.', 'Pratinjau gambar asli dan hasil secara berdampingan.', 'Pilihan pemrosesan GPU atau CPU, tema terang/gelap, dan pengaturan pembersihan tepi.'],
    approach: 'Antarmuka dibangun dengan C# dan WPF. ONNX Runtime dan DirectML menangani pemrosesan model, sedangkan SkiaSharp digunakan untuk pengolahan gambar. Paket portable menyertakan model dan runtime.',
    note: 'Pemrosesan berjalan secara lokal. Detail hasil pembesaran merupakan perkiraan, dan objek rumit masih dapat memerlukan penyuntingan tambahan.',
    image: '/assets/bening-studio.png', imageAlt: 'Pratinjau antarmuka Bening Studio'
  },
  EduSkillWebsite: {
    image: '/assets/projects/eduskill-dashboard.png', imageAlt: 'Dashboard administrator EduSkill dengan statistik kursus, pengguna, enrollment, dan notifikasi kuis', imageWidth: 1919, imageHeight: 943,
    title: 'EduSkill', category: 'web', art: 'LEARN.\nREPEAT.', stack: ['Laravel', 'PHP', 'Blade', 'MySQL', 'JavaScript'],
    summary: 'Platform pembelajaran dengan kursus bertahap, materi, kuis, progres belajar, dan sertifikat penyelesaian.',
    purpose: 'Menghubungkan pengelolaan materi oleh admin dengan alur belajar peserta yang terstruktur, dari pendaftaran kursus sampai penyelesaian modul.',
    features: ['Pengelolaan kursus, modul, materi teks/PDF, dan peserta.', 'Prasyarat kursus serta pembukaan konten secara berurutan.', 'Kuis pilihan ganda dan esai dengan penilaian otomatis atau manual.', 'Dashboard admin dan pengguna, progres belajar, serta unduh sertifikat.', 'Quiz Integrity Mode untuk mencatat perpindahan tab, kehilangan fokus browser, dan pelanggaran selama kuis.'],
    approach: 'Laravel dan Blade digunakan untuk alur aplikasi, MySQL untuk penyimpanan data, serta JavaScript, jQuery, dan AJAX untuk interaksi. Dokumentasi repositori menjelaskan aturan progres dan proses penilaian.'
  },
  Dentist_Appointment_System: {
    image: '/assets/projects/dentist-appointment.png', imageAlt: 'Halaman utama Dentist Appointment Kanna Dentist dengan informasi layanan dan tombol pemesanan janji temu', imageWidth: 720, imageHeight: 360,
    title: 'Dentist Appointment', category: 'web', art: 'BOOK.\nSMILE.', stack: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS'],
    summary: 'Sistem penjadwalan janji temu dokter gigi, umpan balik pasien, dan pengelolaan layanan melalui dashboard.',
    purpose: 'Mempermudah penjadwalan kunjungan dan komunikasi antara pasien dengan administrator layanan.',
    features: ['Pemesanan janji temu dokter gigi secara online.', 'Pengumpulan umpan balik setelah layanan.', 'Pengelolaan janji temu dan evaluasi masukan oleh administrator.', 'Dashboard untuk melihat data dan tren layanan.'],
    approach: 'Aplikasi menggunakan Laravel, PHP, dan MySQL/MariaDB, dengan Vite serta Tailwind CSS untuk kebutuhan antarmuka.'
  },
  'Restaurant-Table-Booking-System': {
    image: '/assets/projects/restaurant-booking.png', imageAlt: 'Halaman utama Imperial Dimsum Palace dengan pencarian menu dan tombol reservasi meja', imageWidth: 1599, imageHeight: 732,
    title: 'Restaurant Booking', category: 'web', art: 'SAVE\nA SEAT.', stack: ['Laravel', 'PHP', 'Blade'],
    summary: 'Sistem reservasi meja untuk membantu restoran dan pelanggan mengelola jadwal kunjungan.',
    purpose: 'Menyederhanakan proses pemesanan meja dan pengelolaan jadwal restoran.',
    features: ['Alur reservasi meja restoran.', 'Pengelolaan jadwal pemesanan.', 'Antarmuka utama Imperial Dimsum.'],
    approach: 'Dibangun menggunakan Laravel. Ringkasan proyek dan pratinjau halaman utama tersedia pada repositori.'
  },
  'Manajemen-Pertandingan-Sepak-Bola': {
    image: '/assets/projects/manajemen-sepak-bola.png', imageAlt: 'Dashboard Manajemen Pertandingan Sepak Bola dengan jumlah pemain, pertandingan, gol, dan grafik bulanan', imageWidth: 1430, imageHeight: 736,
    title: 'Manajemen Sepak Bola', category: 'web', art: 'PLAY.\nORGANIZE.', stack: ['Laravel', 'PHP'],
    summary: 'Pengelolaan pertandingan untuk pelatih dan admin, mulai dari jadwal hingga catatan gol serta laporan.',
    purpose: 'Membantu pengelolaan informasi pertandingan tim sepak bola dalam satu sistem.',
    features: ['Pengelolaan jadwal pertandingan.', 'Pencatatan jumlah gol pemain.', 'Laporan terkait pertandingan untuk pelatih dan admin.'],
    approach: 'Repositori menggunakan Laravel dan PHP. Informasi fitur dirangkum dari deskripsi publik proyek.'
  },
  'PWE_Dashboard-Penjualan': {
    image: '/assets/projects/dashboard-penjualan.png', imageAlt: 'Halaman daftar produk Dashboard Penjualan dengan fitur tambah, edit, dan hapus produk', imageWidth: 1917, imageHeight: 1020,
    title: 'Dashboard Penjualan', category: 'web', art: 'TRACK.\nGROW.', stack: ['Laravel', 'PHP', 'MySQL'],
    summary: 'Dashboard pengelolaan produk dan penjualan dengan operasi CRUD, statistik, serta laporan PDF.',
    purpose: 'Memusatkan pengelolaan produk dan laporan penjualan untuk pengguna serta administrator.',
    features: ['Daftar produk, penambahan, dan perubahan data produk.', 'Login dan registrasi pengguna.', 'Penyimpanan data menggunakan MySQL.', 'Ringkasan laporan yang dapat diekspor ke PDF.'],
    approach: 'Proyek tugas Pemrograman Web Enterprise berbasis Laravel. Dokumentasi menyertakan tangkapan layar alur produk, autentikasi, database, dan laporan.'
  },
  'Flood-Data-Classification-and-Prediction-in-Jakarta-Districts-Using-the-Naive-Bayes-Method': {
    image: '/assets/projects/flood-data-jakarta.png', imageAlt: 'Notebook pengolahan data banjir Jakarta dengan pemeriksaan data kosong, encoding kategori, dan pembagian data latih serta data uji', imageWidth: 1145, imageHeight: 744,
    title: 'Eksplorasi Data Banjir Jakarta', category: 'data', art: 'READ THE\nPATTERN.', stack: ['Python', 'Jupyter Notebook', 'Naïve Bayes'],
    summary: 'Eksplorasi prediksi dan klasifikasi banjir Jakarta menggunakan Naïve Bayes serta visualisasi data.',
    purpose: 'Mempelajari pola data banjir dan menyajikan hasil klasifikasi dalam bentuk yang lebih mudah dipahami.',
    features: ['Prediksi dan klasifikasi menggunakan algoritma Naïve Bayes.', 'Confusion matrix untuk evaluasi hasil model.', 'Diagram pai untuk distribusi kategori data.', 'Pemetaan geografis wilayah terdampak di Jakarta.'],
    approach: 'Eksplorasi disusun dalam Jupyter Notebook. Repositori memuat proses analisis, pemodelan, serta visualisasi hasil.'
  }
};
export const categoryLabels = { web: 'WEB APPLICATION', desktop: 'DESKTOP APPLICATION', data: 'DATA EXPLORATION', other: 'EXPLORATION' };

export function safeGitHubUrl(value, fallback = 'https://github.com/' + OWNER) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && url.hostname === 'github.com'
      && url.pathname.split('/')[1]?.toLowerCase() === OWNER.toLowerCase() ? url.href : fallback;
  } catch { return fallback; }
}
export function safePublicUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  if (/^\/(?:assets|documents)\//.test(value) && !value.includes('\\') && !/(?:\.\.|%2e|%2f|%5c)/i.test(value)) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
function inferCategory(language) {
  if (['C#', 'C++', 'Rust'].includes(language)) return 'desktop';
  if (['Jupyter Notebook', 'Python', 'R'].includes(language)) return 'data';
  if (['JavaScript', 'TypeScript', 'HTML', 'CSS', 'PHP', 'Blade'].includes(language)) return 'web';
  return 'other';
}
export function getProjects(repos) {
  if (!Array.isArray(repos)) return [];
  return repos.filter(repo => repo && typeof repo.name === 'string' && !repo.private && !repo.fork && !repo.archived && !excluded.has(repo.name.toLowerCase()))
    .map(repo => {
      const custom = catalog[repo.name];
      return { ...repo, title: repo.name.replace(/[-_]/g, ' '), category: inferCategory(repo.language),
        summary: repo.description || 'Kode dan dokumentasi tersedia pada repositori GitHub.', stack: repo.language ? [repo.language] : [],
        art: 'NEXT\nIDEA.', ...custom, url: safeGitHubUrl(repo.html_url),
        stars: Number.isFinite(repo.stargazers_count) ? Math.max(0, Math.floor(repo.stargazers_count)) : 0
      };
    }).sort((a, b) => (a.name === 'Bening-Studio' ? -1 : b.name === 'Bening-Studio' ? 1 : 0));
}
export function filterProjects(projects, category = 'all', query = '') {
  const terms = query.trim().toLocaleLowerCase('id-ID').split(/\s+/).filter(Boolean);
  return projects.filter(project => {
    if (category !== 'all' && project.category !== category) return false;
    const haystack = [project.name, project.title, project.summary, project.language, ...project.stack].join(' ').toLocaleLowerCase('id-ID');
    return terms.every(term => haystack.includes(term));
  });
}
export function summarizeProjects(projects) {
  return { count: projects.length, languages: new Set(projects.map(project => project.language).filter(Boolean)).size,
    stars: projects.reduce((total, project) => total + project.stars, 0) };
}
