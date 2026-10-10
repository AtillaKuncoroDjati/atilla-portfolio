import { catalog } from './projects.js';

const localized = {
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
