const hiddenNames = new Set(['kozetoon', 'kozetoon-releases', 'kozenime', 'anime-scrapper-indonesia']);

export function isProjectVisible(name) {
  return typeof name === 'string' && !hiddenNames.has(name.toLowerCase());
}
