// 花屿 · shared motion: section theming, scroll reveals, header behaviour,
// side dots and the following cursor. Everything degrades to a static page.
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const P8 = window.P8Motion = {};

  // Sections declare data-bg (a colour) and data-theme ("dark" | "light").
  // The section crossing the middle of the viewport sets the page colours.
  let themeObserver;
  function applyTheme(section) {
    const bg = section.dataset.bg;
    if (bg) document.body.style.setProperty('--bg', bg);
    document.body.classList.toggle('is-dark', section.dataset.theme === 'dark');
  }
  P8.watchThemes = (scope = document) => {
    const sections = [...scope.querySelectorAll('[data-bg]')];
    if (!sections.length) return;
    if (!('IntersectionObserver' in window)) { applyTheme(sections[0]); return; }
    themeObserver ||= new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) applyTheme(entry.target); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach(section => themeObserver.observe(section));
    applyTheme(sections[0]);
  };

  // Reveal: [data-reveal] fades up; .lines splits into masked rising lines.
  let revealObserver;
  P8.watchReveals = (scope = document) => {
    const items = [...scope.querySelectorAll('[data-reveal], .lines')];
    items.forEach(item => {
      if (item.classList.contains('lines')) {
        [...item.children].forEach((line, index) => line.style.setProperty('--i', index));
      }
    });
    if (reduce || !('IntersectionObserver' in window)) { items.forEach(item => item.classList.add('is-in')); return; }
    revealObserver ||= new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(item => revealObserver.observe(item));
  };

  // Parallax: each [data-parallax] element gets --p, about 1 while its centre is at the bottom of the
  // viewport, 0 at the middle and -1 at the top. CSS turns --p into slower or diagonal drift.
  let parallaxItems = [];
  let parallaxTicking = false;
  const updateParallax = () => {
    const vh = window.innerHeight;
    parallaxItems.forEach(item => {
      if (!item.isConnected || item.offsetParent === null) return;
      const r = item.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      item.style.setProperty('--p', Math.max(-1.2, Math.min(1.2, p)).toFixed(3));
    });
    parallaxTicking = false;
  };
  P8.watchParallax = (scope = document) => {
    if (reduce) return;
    const fresh = [...scope.querySelectorAll('[data-parallax]')].filter(item => !parallaxItems.includes(item));
    if (!parallaxItems.length && fresh.length) {
      window.addEventListener('scroll', () => {
        if (parallaxTicking) return;
        parallaxTicking = true;
        requestAnimationFrame(updateParallax);
      }, { passive: true });
      window.addEventListener('resize', updateParallax);
    }
    parallaxItems = parallaxItems.concat(fresh);
    updateParallax();
  };
  P8.updateParallax = updateParallax;

  // Side dots follow whichever [data-dot] section is in view.
  P8.watchDots = (nav, scope = document) => {
    if (!nav || !('IntersectionObserver' in window)) return;
    const links = [...nav.querySelectorAll('a')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    scope.querySelectorAll('[data-dot]').forEach(section => observer.observe(section));
  };

  // Header hides while scrolling down and returns, solid, when scrolling up.
  const header = document.querySelector('.site-header');
  if (header) {
    let last = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const down = y > last && y > 160;
        header.classList.toggle('is-hidden', down && !header.contains(document.activeElement));
        header.classList.toggle('is-solid', y > 40 && !down);
        last = y;
        ticking = false;
      });
    }, { passive: true });
  }

  // Following cursor; elements with data-cursor="label" show a filled label disc.
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine && !reduce) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    cursor.append(label);
    document.body.append(cursor);
    let x = -100, y = -100, cx = -100, cy = -100;
    window.addEventListener('pointermove', event => {
      x = event.clientX; y = event.clientY;
      cursor.classList.add('is-on');
      const target = event.target.closest?.('[data-cursor], a, button, summary, input, textarea');
      const text = target?.dataset?.cursor;
      cursor.classList.toggle('is-label', Boolean(text));
      cursor.classList.toggle('is-link', Boolean(target) && !text);
      if (text) label.textContent = text;
    }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
    const loop = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  document.addEventListener('DOMContentLoaded', () => {
    P8.watchThemes();
    P8.watchReveals();
    P8.watchParallax();
    P8.watchDots(document.querySelector('.side-dots'));
  });
})();
