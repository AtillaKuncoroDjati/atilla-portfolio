// Apply saved appearance before CSS loads to avoid a theme flash.
(() => {
  let theme = 'dark', language = 'id';
  try {
    if (localStorage.getItem('portfolio-theme') === 'light') theme = 'light';
    if (localStorage.getItem('portfolio-language') === 'en') language = 'en';
  } catch { /* The page works without persistent storage. */ }
  document.documentElement.dataset.theme = theme;
  document.documentElement.lang = language;
})();
