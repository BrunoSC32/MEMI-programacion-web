// App bootstrap: load header/footer partials and init navigation behavior

(function () {
  const includePartials = () => {
    const slots = document.querySelectorAll('[data-include]');
    return Promise.all(
      Array.from(slots).map(async (el) => {
        const url = el.getAttribute('data-include');
        try {
          const res = await fetch(url, { cache: 'no-cache' });
          el.innerHTML = await res.text();
        } catch (e) {
          el.innerHTML = '<!-- include failed: ' + url + ' -->';
        }
      })
    );
  };

  const initHeader = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('#primary-navigation');
    const list = header.querySelector('.nav-list');
    if (!toggle || !nav || !list) return;

    const breakpoint = window.matchMedia('(min-width: 768px)');

    const setExpanded = (expanded) => {
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.setAttribute('aria-label', expanded ? 'Cerrar men\u00fa' : 'Abrir men\u00fa');
      nav.classList.toggle('is-open', expanded);
    };

    setExpanded(false);

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setExpanded(!isOpen);
      if (!isOpen) {
        // Move focus to first link when opening
        const firstLink = list.querySelector('a');
        firstLink && firstLink.focus();
      }
    });

    nav.addEventListener('click', (event) => {
      if (!breakpoint.matches && event.target.closest('a')) {
        setExpanded(false);
      }
    });

    const handleBreakpoint = () => setExpanded(false);
    if (typeof breakpoint.addEventListener === 'function') {
      breakpoint.addEventListener('change', handleBreakpoint);
    } else {
      breakpoint.addListener(handleBreakpoint);
    }

    // Close on Escape key when focus is within nav
    nav.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setExpanded(false);
        toggle.focus();
      }
    });
  };

  const setYear = () => {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  };

  // Load partials, then init components that depend on them
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      await includePartials();
      initHeader();
      setYear();
    });
  } else {
    (async () => { await includePartials(); initHeader(); setYear(); })();
  }
})();

