import { language, locale, t, translateTree } from './i18n.js';

const entries = [
  {
    date: '2026-10-23', category: 'improvement', tag: 'PENYEMPURNAAN',
    title: 'Toolkit dan perangkat kerja diperbarui',
    summary: 'Antigravity ditambahkan ke AI & ML, dan perangkat kerja harian kini ditampilkan dalam bagian khusus.',
    details: ['Informasi Xiaomi 12T dan monitor ASUS dilengkapi spesifikasi dari halaman resmi.'],
  },
  {
    date: '2026-10-23', category: 'feature', tag: 'FITUR BARU',
    title: 'Catatan perubahan menyatu dengan portfolio',
    summary: 'Riwayat pembaruan kini dapat dibaca langsung di halaman utama, lengkap dengan pencarian dan filter kategori.',
    details: ['Telusuri perubahan dari peluncuran awal sampai pembaruan terbaru.', 'Cari berdasarkan judul atau isi, lalu saring fitur, proyek, tampilan, dan penyempurnaan.'],
  },
  {
    date: '2026-10-12', category: 'design', tag: 'TAMPILAN',
    title: 'Pembuka, kartu proyek, dan tautan repositori disempurnakan',
    summary: 'Tampilan portfolio dirapikan agar identitas visual lebih kuat dan navigasi proyek lebih mudah digunakan.',
    details: ['Animasi pembuka mendapat identitas visual baru dan transisi yang lebih halus.', 'Kartu proyek dan latar halaman diperbarui agar lebih konsisten.', 'Tombol semua repositori dibuat lebih jelas dan responsif di layar kecil.'],
  },
  {
    date: '2026-10-11', category: 'improvement', tag: 'PENYEMPURNAAN',
    title: 'Daftar karya publik dikurasi ulang',
    summary: 'Isi portfolio dipilih ulang agar halaman karya hanya menampilkan proyek yang memang ingin diperkenalkan.',
    details: ['Beberapa repositori internal disembunyikan dari daftar karya.', 'Tautan rilis aplikasi dipisahkan dari daftar proyek portfolio.'],
  },
  {
    date: '2026-10-10', category: 'project', tag: 'PROYEK',
    title: 'Panduan dan informasi rilis proyek diperjelas',
    summary: 'Halaman proyek diperbarui dengan petunjuk penggunaan, pratinjau, dan tautan unduh yang lebih mudah ditemukan.',
    details: ['Informasi untuk Bening Studio dilengkapi dengan panduan dan rilis aplikasi.', 'Kartu proyek menampilkan ringkasan manfaat dan teknologi yang digunakan.'],
  },
  {
    date: '2026-09-28', category: 'project', tag: 'PROYEK BARU',
    title: 'Nusa Rasa masuk ke portfolio',
    summary: 'Proyek berbagi resep Nusantara ditambahkan dengan pratinjau dan kredit untuk tim pengembang.',
    details: ['Ringkasan fitur pencarian resep, mode memasak, video, dan ulasan ditampilkan.', 'Peran proyek sebagai karya tim dijelaskan di halaman detail.'],
  },
  {
    date: '2026-09-26', category: 'design', tag: 'TAMPILAN',
    title: 'Pratinjau proyek dan navigasi diperhalus',
    summary: 'Tampilan proyek Restaurant Booking dan eksplorasi data banjir dilengkapi gambar, sementara navigasi dibuat lebih nyaman di berbagai ukuran layar.',
    details: ['Pratinjau proyek membantu pengunjung mengenali hasil sebelum membuka detail.', 'Animasi dan navigasi responsif diperiksa ulang untuk layar kecil.'],
  },
  {
    date: '2026-09-25', category: 'improvement', tag: 'PENYEMPURNAAN',
    title: 'Toolkit, kontak, dan identitas portfolio diperluas',
    summary: 'Daftar teknologi diperbarui, formulir kontak ditambahkan, dan elemen visual portfolio mendapat sentuhan baru.',
    details: ['Toolkit mencakup teknologi pemrograman, AI dan machine learning, serta alat kerja.', 'Formulir kontak menyiapkan pesan email dengan nama dan isi pesan.', 'Progress pembuka, logo AKD, foto profil, dan pratinjau berbagi sosial disempurnakan.'],
  },
  {
    date: '2026-09-24', category: 'feature', tag: 'PELUNCURAN',
    title: 'Portfolio pribadi diluncurkan',
    summary: 'Situs satu halaman dibuat untuk memperkenalkan profil, karya GitHub, pengalaman, dan cara menghubungi Atilla.',
    details: ['Karya publik dimuat dari GitHub dan dapat difilter berdasarkan kategori.', 'Profil, CV, sertifikat, tema terang dan gelap, serta bahasa Indonesia dan Inggris tersedia.', 'Portfolio disiapkan untuk pembaruan otomatis melalui Vercel.'],
  },
];

const list = document.querySelector('#changelog-list');
const result = document.querySelector('#changelog-results');
const search = document.querySelector('#changelog-search');
let activeCategory = 'all';

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase(locale());
  const visible = entries.filter((entry) => {
    const categoryMatches = activeCategory === 'all' || entry.category === activeCategory;
    const searchable = [entry.title, t(entry.title), entry.summary, t(entry.summary), entry.tag, t(entry.tag), ...entry.details.flatMap((detail) => [detail, t(detail)])].join(' ').toLocaleLowerCase(locale());
    return categoryMatches && (!query || searchable.includes(query));
  });

  result.textContent = language() === 'en'
    ? `${visible.length} of ${entries.length} updates shown`
    : `Menampilkan ${visible.length} dari ${entries.length} catatan`;

  if (!visible.length) {
    list.replaceChildren(make('p', 'changelog-empty', t('Tidak ada catatan yang cocok.')));
    return;
  }

  const fragment = document.createDocumentFragment();
  visible.forEach((entry, index) => {
    const article = make('article', 'changelog-entry');
    article.setAttribute('role', 'listitem');

    const date = new Date(`${entry.date}T12:00:00`);
    const dateLabel = make('time', 'changelog-date');
    dateLabel.dateTime = entry.date;
    dateLabel.append(make('strong', '', new Intl.DateTimeFormat(locale(), { day: '2-digit' }).format(date)));
    dateLabel.append(make('span', '', new Intl.DateTimeFormat(locale(), { month: 'short', year: 'numeric' }).format(date).toLocaleUpperCase(locale())));

    const body = make('div', 'changelog-entry-body');
    const meta = make('div', 'changelog-entry-meta');
    meta.append(make('span', 'changelog-tag', t(entry.tag)));
    meta.append(make('time', '', new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'long', year: 'numeric' }).format(date)));
    body.append(meta, make('h3', '', t(entry.title)), make('p', '', t(entry.summary)));
    if (entry.details.length) {
      const details = make('ul');
      entry.details.forEach((detail) => details.append(make('li', '', t(detail))));
      body.append(details);
    }

    article.append(dateLabel, body, make('span', 'changelog-entry-index', String(index + 1).padStart(2, '0')));
    fragment.append(article);
  });
  list.replaceChildren(fragment);
  translateTree(list);
}

document.querySelectorAll('[data-changelog-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.changelogFilter;
    document.querySelectorAll('[data-changelog-filter]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    render();
  });
});

search.addEventListener('input', render);
document.addEventListener('languagechange', render);
render();
