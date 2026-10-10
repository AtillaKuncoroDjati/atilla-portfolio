const hiddenNames = new Set(['kozetoon', 'kozenime', 'anime-scrapper-indonesia']);

export function isProjectVisible(name) {
  return typeof name === 'string' && !hiddenNames.has(name.toLowerCase());
}
