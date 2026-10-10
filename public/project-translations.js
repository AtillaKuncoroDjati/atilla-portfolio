import { catalog } from './projects.js';

const localized = {
  kozetoon: {
    imageAlt: 'KOZETOON homepage with a purple dark theme, featured stories and a Manga, Manhwa and Manhua catalog',
    summary: 'An Indonesian Manga, Manhwa and Manhua reader with a Laravel website and standalone Android APK, bookmarks, reading history and a local catalog.',
    purpose: 'Makes comics easier to discover and read on PC and Android, with comfortable reading tools and catalog controls without hosting for the APK.',
    features: ['Five automatic or manually selected featured stories, instant search, multiple genre filters, Manga/Manhwa/Manhua types, and grid or list layouts.', 'A fullscreen reader with tap controls, chapter selection, four auto-scroll speeds, image retries and saved reading position.', 'A Library with bookmarks, history, unread chapters and completed markers; phone data is separate from website accounts.', 'Offline chapter downloads with progress, pause/resume and deletion; up to 20 chapters per batch and 1 GB of offline storage.', 'Profile photos with crop/zoom, local metadata edits, Ongoing/Completed/Hiatus status and cache cleanup that preserves the Library.', 'Pull down to refresh every page while preserving search, genres, layout and page selection.', 'On-device catalog updates with progress and safe pause, plus APK update suggestions from official GitHub releases.', 'A website dashboard for comic edits, chapter dates, banners, image health and catalog updates. Initial APK catalog: 1,572 titles / 149,626 chapters.'],
    approach: 'The website uses Laravel, Blade, JavaScript and SQLite. Python collects and updates the catalog from Shinigami. The APK uses Java, WebView and Python through Chaquopy, with a private SQLite database on the device.',
    usage: ['Download APK 1.0.4 from GitHub releases. Android 7.0+ ARM64, about 135 MB, with at least 1 GB of free space. Install as an update if KOZETOON is already installed; do not uninstall or clear app data.', 'Explore: search by title, select a type and multiple genres, then use grid or list view. Open a story and bookmark it to resume later.', 'Reader: tap the image to show/hide controls. Select chapters from the title or menu; the play button opens auto-scroll options. Pull from the top to refresh.', 'Offline: story → Download → select chapters → Download. Wait for Ready offline in Library → Offline before disconnecting. Resume paused downloads there.', 'Profile: avatar → Choose photo → pan/crop/zoom → Use photo → Save profile. Manage includes catalog updates, cache cleanup, home banners and APK version checks.', 'Website: follow the README for Python/Composer dependencies, environment, migrations and catalog import; run Laravel and the catalog worker separately.'],
    note: 'The APK runs locally on the phone without hosting or a PC server. Images that have not been downloaded and source updates require internet. Bookmarks, history, profiles and downloads survive upgrades with the same identity/signature; uninstalling or clearing data can remove them. Cross-device sync is not available. 73 automated tests passed; 1.0.4 gestures have not been tested directly on a Xiaomi 12T.',
    gallery: ['Desktop preview of the APK UI: Home with pull-to-refresh indicator', 'Desktop preview of the APK UI: genre filters and list layout', 'Desktop preview of the APK UI: offline chapter downloads']
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
