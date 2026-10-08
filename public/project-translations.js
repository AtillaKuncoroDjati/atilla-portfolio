import { catalog } from './projects.js';

const localized = {
  kozetoon: {
    imageAlt: 'KOZETOON homepage with a purple dark theme, featured stories and a Manga, Manhwa and Manhua catalog',
    summary: 'An Indonesian Manga, Manhwa and Manhua reader with a Laravel website and standalone Android APK, bookmarks, reading history and a local catalog.',
    purpose: 'Makes comics easier to discover and read on PC and Android, with comfortable reading tools and catalog controls without hosting for the APK.',
    features: ['Five automatic or manually selected featured stories, instant search, type and genre filters, authors and synopses.', 'A vertical reader with chapter navigation, image retries, saved width and spacing preferences, and reading position.', 'Library, bookmarks, history, new chapter badges and read markers; phone data is separate from website accounts.', 'A website dashboard for comic and chapter date edits, banners, image health and catalog updates with progress and safe pause.', 'A local Android APK with an initial catalog of 1,572 titles and 149,626 chapters; updates from the source on the phone without a PC server.'],
    approach: 'The website uses Laravel, Blade, JavaScript and SQLite. Python collects and updates the catalog from Shinigami. The APK uses Java, WebView and Python through Chaquopy, with a private SQLite database on the device.',
    usage: ['Android: download APK 0.1.0, install on Android 7.0+ ARM64 and allow at least 1 GB of free space. The catalog is extracted on first launch.', 'Search for a story, read chapters, bookmark it and resume from your last position. Open Manage for catalog updates.', 'Website: install Python and Composer dependencies, copy the environment template, run migrations and import the catalog; start Laravel and the catalog worker separately.'],
    note: 'Metadata and chapter lists are stored locally; images and updates still require internet and an available source. The preview APK has been confirmed to open on a phone; on-device source updates have not been verified. Offline image downloads and cross-device sync are not available yet.',
    gallery: ['Desktop preview of the APK UI: Home and local catalog', 'Desktop preview of the APK UI: Manage catalog and update progress']
  },
  kozenime: {
    imageAlt: 'KOZENIME homepage with anime banners, instant search and catalog navigation',
    summary: 'An Indonesian-subtitled anime platform with instant search, a personal library, discussions, episode servers and an admin dashboard.',
    purpose: 'Brings anime discovery, episode choices and community interaction into an accessible experience while giving administrators control over the catalog.',
    features: [
      'Automatic or manually curated home banners, instant search, genre filters and anime status.',
      'Bookmarks, an account library, profile photo previews and cropping, and password reset by email.',
      'Anime and episode discussions with images, GIFs, stickers, spoiler controls and moderation.',
      'Streaming server choices and downloads grouped by format, resolution and server.',
      'An admin dashboard for anime and episode edits, manual dates, artwork backups and catalog updates with mapping review.'
    ],
    approach: 'Laravel handles accounts, authorization, the canonical database and background jobs. The responsive JavaScript interface supports dark and light themes with KOZENIME’s gold identity. Catalog updates go through staging, validation and review before data is saved.',
    usage: [
      'Install PHP and frontend dependencies, copy the environment template and configure your local database and admin account.',
      'Run migrations, build the interface and start the local server; a separate worker handles catalog updates.',
      'Browse without signing in; log in for bookmarks and discussions. Administrators manage anime, episodes, banners and reviews.'
    ],
    note: 'The application runs locally. The repository provides code and documentation without a production database or videos. Playback depends on the provider, file format and codec.',
    gallery: ['Anime details and episode navigation', 'Downloads grouped by format, resolution and server']
  },
  'anime-scrapper-indonesia': {
    imageAlt: 'Anime Scrapper Indonesia workflow from source discovery to normalization and JSON export',
    summary: 'A Python pipeline for Indonesian anime catalog discovery, episode and link normalization, AniList enrichment and reviewable JSON exports.',
    purpose: 'Turns data from multiple sources into a consistent structure with clear identity and provenance, allowing consumer applications to review and import it safely.',
    features: [
      'Otakudesu, Anoboy and Samehadaku adapters with discovery and parsing capabilities specific to each source.',
      'Indexes with checkpoints and resume, and episode staging separated from database writes.',
      'AniList metadata, canonical episode identity and schedule provenance for multipart anime.',
      'Download format, resolution, size and server when available; valid mirrors do not wait for every mirror to be complete.',
      'Local fixture regression tests and reports separating review, validation and unavailable links.'
    ],
    approach: 'Python, Requests and BeautifulSoup support the source adapters; Playwright handles entry points that require a browser. Other applications consume staging JSON, evidence and progress without the engine accessing MySQL directly.',
    usage: [
      'Create a Python virtual environment and install requirements. Install Playwright Chromium for browser entry points.',
      'Start with limited discovery or staging for one source, then inspect the JSON output and evidence.',
      'Resume checkpoints and review ambiguous AniList mappings before importing through a consumer application.'
    ],
    note: 'Source capabilities vary and not every episode has download links. Production datasets, browser profiles and videos are excluded; historical processing does not run automatically.'
  }
};

export const projectEnglish = {
  'UNDUH APK ANDROID ↓': 'DOWNLOAD ANDROID APK ↓',
  'CARA MENGGUNAKAN': 'HOW TO USE',
  'PANDUAN PENGGUNAAN ↗': 'USAGE GUIDE ↗'
};
for (const [name, translated] of Object.entries(localized)) {
  const source = catalog[name];
  for (const key of ['imageAlt', 'summary', 'purpose', 'approach', 'note']) projectEnglish[source[key]] = translated[key];
  for (const key of ['features', 'usage']) source[key].forEach((text, index) => { projectEnglish[text] = translated[key][index]; });
  source.gallery?.forEach((item, index) => { projectEnglish[item.caption] = translated.gallery[index]; });
}
