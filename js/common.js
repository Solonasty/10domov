async function inject(part, selector) {
  const base = `components/${part}/${part}`;
  try {
    // 1) HTML
    const r = await fetch(`${base}.html`, { credentials: 'same-origin' });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    const html = await r.text();
    const mount = document.querySelector(selector);
    if (!mount) throw new Error(`Selector not found: ${selector}`);
    mount.innerHTML = html;

    // 2) CSS
    const cssHref = `${base}.css`;
    if (![...document.styleSheets].some(s => s.href && s.href.includes(cssHref))) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssHref;
      document.head.appendChild(link);
    }
  } catch (e) {
    console.warn('Не удалось загрузить компонент', part, e);
  }
}

function highlightActive() {

  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.site-nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('?')[0].split('#')[0].toLowerCase();
    if (href === file) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  await inject('header', '#app-header');
  await inject('footer', '#app-footer');
  highlightActive();
});