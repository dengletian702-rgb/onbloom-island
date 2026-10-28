// 花屿 · comic reader.
// Drawn panels are whole slices of Codex's scroll-remix pages (assets/scroll-remix/panels/), shown at
// their own aspect ratio; the rest are the long scroll or paper, drawn by the page.
// Older panels without `art` fall back to assets/p{page}-{panel}.png, a crop of the second edition, or a sketch.
// All lettering is HTML laid over the art.
(() => {
  'use strict';
  const story = document.getElementById('story');
  const dots = document.getElementById('side-dots');
  const V2 = { w: 1536, h: 1024, gutter: 6 };
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const svgNS = 'http://www.w3.org/2000/svg';
  const flowerPath = 'M12 22V12M12 12c-3-3-3-7 0-10 3 3 3 7 0 10Zm0 0c-4-1-6-4-6-8 4 1 6 4 6 8Zm0 0c4-1 6-4 6-8-4 1-6 4-6 8Z';
  const sketches = {
    road: 'M0 70 C20 58 34 62 50 55 S80 48 100 52 M0 82 C30 74 60 78 100 70 M40 100 C46 86 52 76 58 64 M54 100 C56 88 58 76 60 64 M82 20 a6 6 0 1 0 0.1 0',
    horizon: 'M0 46 H100 M8 46 C14 42 20 44 26 46 M60 100 V40 Q60 30 70 30 Q80 30 80 40 V100 M66 50 h8 M66 58 h8 M66 66 h8',
    wind: 'M10 30 C30 22 50 34 70 26 S90 22 98 28 M4 44 C24 36 46 48 66 40 M16 58 C36 50 56 62 80 54 M20 100 V64 M30 100 V60 M78 100 V62 M88 100 V66',
    step: 'M10 82 H90 M30 82 C30 60 44 48 60 48 C76 48 84 60 84 82 M60 48 V24 Q60 18 66 18 Q72 18 72 24 V48 M18 70 l-8 -4 M18 76 l-10 0',
    shade: 'M0 60 L30 28 L52 46 L70 20 L100 54 M0 60 H100 M30 100 L50 60 M48 100 L50 60 M66 100 V72 h16 v28'
  };

  let finalArt = new Set();
  let panelObserver;
  const cropBoxes = new Map();

  function fitCrop(box, spec) {
    const w = box.clientWidth;
    const h = box.clientHeight;
    if (!w || !h) return;
    const right = spec.q % 2 === 1;
    const bottom = spec.q >= 2;
    const qx0 = right ? V2.w / 2 + V2.gutter : 0;
    const qx1 = right ? V2.w : V2.w / 2 - V2.gutter;
    const qy0 = bottom ? V2.h / 2 + V2.gutter : 0;
    const qy1 = bottom ? V2.h : V2.h / 2 - V2.gutter;
    const qw = qx1 - qx0;
    const qh = qy1 - qy0;
    let rw = qw / (spec.zoom || 1);
    let rh = qh / (spec.zoom || 1);
    const ratio = w / h;
    if (rw / rh > ratio) rw = rh * ratio; else rh = rw / ratio;
    const cx = qx0 + (spec.fx ?? 0.5) * qw;
    const cy = qy0 + (spec.fy ?? 0.5) * qh;
    const x0 = Math.min(Math.max(cx - rw / 2, qx0), qx1 - rw);
    const y0 = Math.min(Math.max(cy - rh / 2, qy0), qy1 - rh);
    const scale = w / rw;
    box.style.backgroundSize = `${V2.w * scale}px ${V2.h * scale}px`;
    box.style.backgroundPosition = `${-x0 * scale}px ${-y0 * scale}px`;
  }
  const cropResize = 'ResizeObserver' in window
    ? new ResizeObserver(entries => entries.forEach(entry => fitCrop(entry.target, cropBoxes.get(entry.target))))
    : null;

  function artLayer(panel, final) {
    if (final) {
      const wrap = node('div', 'art');
      const image = node('img');
      image.alt = '';
      image.decoding = 'async';
      image.dataset.src = panel.art ? `assets/scroll-remix/panels/${panel.art}` : `assets/${final}`;
      if (panel.focus) image.style.objectPosition = `${panel.focus[0] * 100}% ${panel.focus[1] * 100}%`;
      wrap.append(image);
      return { el: wrap, temp: false };
    }
    const tmp = panel.tmp || { kind: 'sketch' };
    let el;
    let tag = '待画';
    if (tmp.kind === 'crop') {
      el = node('div', 'art art-crop is-pending');
      el.dataset.src = `../comic-v2/assets/page-${tmp.page}.png`;
      cropBoxes.set(el, tmp);
      tag = '旧图暂用 · 待重画';
    } else if (tmp.kind === 'scroll') {
      // The long scroll and the notebook are finished as drawn by the page; they carry no "to draw" tag.
      el = node('div', 'art art-scroll');
      tag = '';
    } else if (tmp.kind === 'stone') {
      el = node('div', 'art art-stone');
    } else if (tmp.kind === 'paper') {
      el = node('div', 'art art-paper');
      tag = '';
    } else {
      el = node('div', 'art art-sketch');
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('preserveAspectRatio', 'none');
      svg.setAttribute('aria-hidden', 'true');
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', sketches[tmp.motif] || sketches.road);
      path.setAttribute('vector-effect', 'non-scaling-stroke');
      svg.append(path);
      el.append(svg, node('p', 'scene', panel.scene));
      tag = '分镜草图 · 待画';
    }
    return { el, temp: true, tag };
  }

  function richText(target, text) {
    text.split('\n').forEach((line, index) => {
      if (index) target.append(node('br'));
      line.split(/(~~[^~]+~~)/).forEach(part => {
        if (!part) return;
        if (part.startsWith('~~')) target.append(node('del', '', part.slice(2, -2)));
        else target.append(document.createTextNode(part));
      });
    });
  }

  function bubble(spec, temp, order) {
    const b = temp && spec.tmp ? { ...spec, ...spec.tmp } : spec;
    const type = b.t;
    const el = node('p', `b b-${type} a-${b.a === 'r' ? 'r' : 'l'}`);
    el.style.setProperty('--x', b.x);
    el.style.setProperty('--y', b.y);
    if (b.yb) el.classList.add('from-b');
    el.style.setProperty('--n', order);
    if (b.w) el.style.setProperty('--w', b.w);
    if (b.h) el.style.setProperty('--h', b.h);
    if (b.size) el.style.setProperty('--size', b.size);
    if (b.rot !== undefined) el.style.setProperty('--rot', `${b.rot}deg`);
    if (b.style) el.classList.add(b.style);
    if (b.fresh) el.classList.add('fresh');

    if (type === 'speech' || type === 'thought') {
      el.classList.add(`tail-${b.tail || 'b'}`);
      if (b.whisper) el.classList.add('whisper');
      el.append(node('span', 'sr-only', `${b.by}${type === 'thought' ? '（心里想）' : ''}：`), document.createTextNode(b.text));
    } else if (type === 'name') {
      el.append(node('span', 'who', b.name), node('span', 'desc', b.text));
    } else if (type === 'carve' || type === 'scroll') {
      el.prepend(node('span', 'sr-only', type === 'scroll' ? (b.style === 'label' ? '签条：' : '卷上写着：') : '碑文：'));
      if (b.flower) {
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('class', 'flower');
        svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', flowerPath);
        svg.append(path);
        el.append(svg);
      }
      el.append(node('span', 'words', b.text));
      if (b.place) el.append(node('span', 'place', b.place));
    } else if (type === 'note') {
      el.append(node('span', 'sr-only', '手写：'));
      richText(el, b.text);
    } else if (type === 'sfx') {
      el.setAttribute('aria-hidden', 'true');
      el.textContent = b.text;
    } else {
      el.textContent = b.text;
    }
    return el;
  }

  function panelElement(panel) {
    const [page, index] = panel.id.split('-');
    const figure = node('figure', 'panel');
    figure.id = `p${panel.id}`;
    figure.style.setProperty('--cs', panel.col[0]);
    figure.style.setProperty('--span', panel.col[1]);
    figure.style.setProperty('--ar', panel.aspect);
    if (panel.nudge) figure.style.setProperty('--nudge', `${panel.nudge}px`);
    const finalName = `p${page}-${index}.png`;
    // Scroll and paper panels are always drawn by the page, never swapped for an old single-panel file.
    const final = panel.art || (!/^(scroll|paper)$/.test(panel.tmp?.kind || '') && finalArt.has(finalName) ? finalName : null);
    const art = artLayer(panel, final);
    figure.append(art.el);
    if (art.temp && art.tag) figure.append(node('span', 'art-tag', `${art.tag} · p${panel.id}`));
    const layer = node('div', 'layer');
    (panel.bubbles || []).forEach((spec, order) => layer.append(bubble(spec, art.temp, order)));
    figure.append(layer);
    const caption = node('figcaption', 'sr-only', `画面：${panel.scene}`);
    figure.prepend(caption);
    return figure;
  }

  function pageElement(page, total) {
    const section = node('section', 'page');
    section.id = `page-${page.page}`;
    section.dataset.bg = page.bg;
    section.dataset.theme = page.theme;
    // Pages alternate the two marble tones and meet on slanted seams.
    section.classList.add(page.bg === '#CBDBEA' ? 'tex-blue' : 'tex-flesh', page.page % 2 ? 'cut' : 'cut-r');
    if (page.dot) section.dataset.dot = page.dot;
    section.setAttribute('aria-label', `第 ${page.page} 页 · ${page.chapter} ${page.name}`);
    const inner = node('div', 'page-inner');
    if (!page.continued) {
      const head = node('header', 'chapter-head');
      head.append(node('p', 'cap', page.chapter));
      const title = node('h2', 'chapter-name display lines');
      const line = node('span', 'line');
      line.append(node('span', '', page.name));
      title.append(line);
      head.append(title);
      if (page.sub) {
        const sub = node('p', 'chapter-sub');
        sub.dataset.reveal = '';
        sub.append(node('span', 'u-link', page.sub));
        head.append(sub);
      }
      inner.append(head);
    }
    inner.append(node('p', 'page-label cap', `第 ${page.page} 页 / ${total}`));
    const panels = node('div', 'panels');
    page.panels.forEach(panel => panels.append(panelElement(panel)));
    inner.append(panels);
    section.append(inner);
    return section;
  }

  function buildDots(pages) {
    if (!dots) return;
    const entries = [['cover', '封面'], ...pages.filter(page => page.dot).map(page => [`page-${page.page}`, page.chapter === '序章' ? '序章' : page.chapter === '尾声' ? '尾声' : page.name]), ['afterword', '附页']];
    entries.forEach(([id, label]) => {
      const link = node('a');
      link.href = `#${id}`;
      link.append(node('i'), node('span', '', label));
      dots.append(link);
    });
  }

  function observePanels() {
    const panels = [...document.querySelectorAll('.panel')];
    const load = panel => {
      panel.querySelectorAll('img[data-src]').forEach(image => { image.src = image.dataset.src; image.removeAttribute('data-src'); });
      panel.querySelectorAll('.art-crop[data-src]').forEach(box => {
        const src = box.dataset.src;
        const probe = new Image();
        probe.onload = () => { box.style.backgroundImage = `url("${src}")`; fitCrop(box, cropBoxes.get(box)); box.classList.remove('is-pending'); };
        probe.src = src;
        box.removeAttribute('data-src');
        cropResize?.observe(box);
      });
    };
    if (!('IntersectionObserver' in window)) {
      panels.forEach(panel => { load(panel); panel.classList.add('is-read'); });
      return;
    }
    const near = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      load(entry.target);
      near.unobserve(entry.target);
    }), { rootMargin: '600px 0px' });
    panelObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-read');
      panelObserver.unobserve(entry.target);
    }), { threshold: 0.45 });
    panels.forEach(panel => { near.observe(panel); panelObserver.observe(panel); });
  }

  // Arrow keys move between pages.
  document.addEventListener('keydown', event => {
    if (event.target.closest('input, textarea, [contenteditable]') || event.metaKey || event.ctrlKey || event.altKey) return;
    if (!['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp'].includes(event.key)) return;
    const pages = [...document.querySelectorAll('#cover, .page, #afterword')];
    const current = pages.findIndex(section => section.getBoundingClientRect().bottom > window.innerHeight * 0.4);
    const forward = event.key === 'ArrowRight' || event.key === 'PageDown';
    const target = pages[Math.max(0, Math.min(pages.length - 1, current + (forward ? 1 : -1)))];
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  async function loadStory() {
    story.setAttribute('aria-busy', 'true');
    story.replaceChildren(node('p', 'loading-note', '正在翻开故事……'));
    try {
      const response = await fetch('story.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.pages) || !data.pages.length) throw new Error('没有页面');
      const fragment = document.createDocumentFragment();
      data.pages.forEach(page => fragment.append(pageElement(page, data.pages.length)));
      story.replaceChildren(fragment);
      story.setAttribute('aria-busy', 'false');
      buildDots(data.pages);
      observePanels();
      window.P8Motion?.watchThemes(document);
      window.P8Motion?.watchReveals(story);
      window.P8Motion?.watchDots(dots, document);
      if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
    } catch (error) {
      const box = node('p', 'load-error', '故事没能打开。');
      const retry = node('button', 'btn', '再试一次');
      retry.type = 'button';
      retry.addEventListener('click', loadStory);
      box.append(retry);
      story.replaceChildren(box);
      story.setAttribute('aria-busy', 'false');
    }
  }
  loadStory();
})();
