const OWNER = 'AtillaKuncoroDjati';
const excluded = new Set([OWNER.toLowerCase(), 'atilla-portfolio']);
export const catalog = {
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
    title: 'EduSkill', category: 'web', art: 'LEARN.\nREPEAT.', stack: ['Laravel', 'PHP', 'Blade', 'MySQL', 'JavaScript'],
    summary: 'Platform pembelajaran dengan kursus bertahap, materi, kuis, progres belajar, dan sertifikat penyelesaian.',
    purpose: 'Menghubungkan pengelolaan materi oleh admin dengan alur belajar peserta yang terstruktur, dari pendaftaran kursus sampai penyelesaian modul.',
    features: ['Pengelolaan kursus, modul, materi teks/PDF, dan peserta.', 'Prasyarat kursus serta pembukaan konten secara berurutan.', 'Kuis pilihan ganda dan esai dengan penilaian otomatis atau manual.', 'Dashboard admin dan pengguna, progres belajar, serta unduh sertifikat.'],
    approach: 'Laravel dan Blade digunakan untuk alur aplikasi, MySQL untuk penyimpanan data, serta JavaScript, jQuery, dan AJAX untuk interaksi. Dokumentasi repositori menjelaskan aturan progres dan proses penilaian.'
  },
  Dentist_Appointment_System: {
    title: 'Dentist Appointment', category: 'web', art: 'BOOK.\nSMILE.', stack: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS'],
    summary: 'Sistem penjadwalan janji temu dokter gigi, umpan balik pasien, dan pengelolaan layanan melalui dashboard.',
    purpose: 'Mempermudah penjadwalan kunjungan dan komunikasi antara pasien dengan administrator layanan.',
    features: ['Pemesanan janji temu dokter gigi secara online.', 'Pengumpulan umpan balik setelah layanan.', 'Pengelolaan janji temu dan evaluasi masukan oleh administrator.', 'Dashboard untuk melihat data dan tren layanan.'],
    approach: 'Aplikasi menggunakan Laravel, PHP, dan MySQL/MariaDB, dengan Vite serta Tailwind CSS untuk kebutuhan antarmuka.'
  },
  'Restaurant-Table-Booking-System': {
    title: 'Restaurant Booking', category: 'web', art: 'SAVE\nA SEAT.', stack: ['Laravel', 'PHP', 'Blade'],
    summary: 'Sistem reservasi meja untuk membantu restoran dan pelanggan mengelola jadwal kunjungan.',
    purpose: 'Menyederhanakan proses pemesanan meja dan pengelolaan jadwal restoran.',
    features: ['Alur reservasi meja restoran.', 'Pengelolaan jadwal pemesanan.', 'Antarmuka utama Imperial Dimsum.'],
    approach: 'Dibangun menggunakan Laravel. Ringkasan proyek dan pratinjau halaman utama tersedia pada repositori.'
  },
  'Manajemen-Pertandingan-Sepak-Bola': {
    title: 'Manajemen Sepak Bola', category: 'web', art: 'PLAY.\nORGANIZE.', stack: ['Laravel', 'PHP'],
    summary: 'Pengelolaan pertandingan untuk pelatih dan admin, mulai dari jadwal hingga catatan gol serta laporan.',
    purpose: 'Membantu pengelolaan informasi pertandingan tim sepak bola dalam satu sistem.',
    features: ['Pengelolaan jadwal pertandingan.', 'Pencatatan jumlah gol pemain.', 'Laporan terkait pertandingan untuk pelatih dan admin.'],
    approach: 'Repositori menggunakan Laravel dan PHP. Informasi fitur dirangkum dari deskripsi publik proyek.'
  },
  'PWE_Dashboard-Penjualan': {
    title: 'Dashboard Penjualan', category: 'web', art: 'TRACK.\nGROW.', stack: ['Laravel', 'PHP', 'MySQL'],
    summary: 'Dashboard pengelolaan produk dan penjualan dengan operasi CRUD, statistik, serta laporan PDF.',
    purpose: 'Memusatkan pengelolaan produk dan laporan penjualan untuk pengguna serta administrator.',
    features: ['Daftar produk, penambahan, dan perubahan data produk.', 'Login dan registrasi pengguna.', 'Penyimpanan data menggunakan MySQL.', 'Ringkasan laporan yang dapat diekspor ke PDF.'],
    approach: 'Proyek tugas Pemrograman Web Enterprise berbasis Laravel. Dokumentasi menyertakan tangkapan layar alur produk, autentikasi, database, dan laporan.'
  },
  'Flood-Data-Classification-and-Prediction-in-Jakarta-Districts-Using-the-Naive-Bayes-Method': {
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
