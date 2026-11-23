(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (!window.gsap) { $('#loader')?.remove(); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Lottie (animasi dibuat langsung dalam JSON) ---------------- */
  const hex = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255, 1]; };
  const E1 = { i: { x: [.5], y: [1] }, o: { x: [.5], y: [0] } };
  const E3 = { i: { x: [.5, .5, .5], y: [1, 1, 1] }, o: { x: [.5, .5, .5], y: [0, 0, 0] } };
  const L1 = { i: { x: [1], y: [1] }, o: { x: [0], y: [0] } };
  const st = k => ({ a: 0, k });
  const an = (frames, linear) => ({
    a: 1,
    k: frames.map(([t, s], i) => i === frames.length - 1 ? { t, s } : { t, s, ...(linear ? L1 : s.length === 3 ? E3 : E1) })
  });
  const tr = () => ({ ty: 'tr', p: st([0, 0]), a: st([0, 0]), s: st([100, 100]), r: st(0), o: st(100) });
  const grp = items => ({ ty: 'gr', it: [...items, tr()], nm: 'g' });
  const fill = c => ({ ty: 'fl', c: st(hex(c)), o: st(100), r: 1 });
  const stroke = (c, w) => ({ ty: 'st', c: st(hex(c)), o: st(100), w: st(w), lc: 2, lj: 2 });
  const ell = (x, y, w, h) => ({ ty: 'el', p: st([x, y]), s: st([w, h]) });
  const layer = (ks, shapes) => ({
    ddd: 0, ind: 1, ty: 4, nm: 'l', sr: 1, ao: 0, ip: 0, op: 60, st: 0, bm: 0, shapes,
    ks: { o: st(100), r: st(0), p: st([100, 100, 0]), a: st([0, 0, 0]), s: st([100, 100, 100]), ...ks }
  });
  const comp = l => ({ v: '5.7.0', fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: 'a', ddd: 0, assets: [], layers: [l] });

  const LOTTIE = {
    star: c => comp(layer({
      r: an([[0, [0]], [60, [360]]], true),
      s: an([[0, [100, 100, 100]], [15, [118, 118, 100]], [30, [100, 100, 100]], [45, [118, 118, 100]], [60, [100, 100, 100]]])
    }, [
      grp([ell(0, 0, 44, 44), fill('#ffffff'), stroke('#04210f', 6)]),
      grp([{ ty: 'sr', sy: 1, d: 1, pt: st(10), p: st([0, 0]), r: st(0), ir: st(58), is: st(0), or: st(88), os: st(0), nm: 'star' }, fill(c), stroke('#04210f', 6)])
    ])),
    smile: c => comp(layer({
      p: an([[0, [100, 110, 0]], [15, [100, 84, 0]], [30, [100, 110, 0]], [45, [100, 90, 0]], [60, [100, 110, 0]]]),
      r: an([[0, [-8]], [30, [8]], [60, [-8]]]),
      s: an([[0, [104, 94, 100]], [15, [96, 104, 100]], [30, [104, 94, 100]], [45, [97, 103, 100]], [60, [104, 94, 100]]])
    }, [
      grp([ell(-24, -14, 13, 20), fill('#04210f')]),
      grp([ell(24, -14, 13, 20), fill('#04210f')]),
      grp([{ ty: 'sh', ks: st({ c: false, v: [[-28, 12], [28, 12]], i: [[0, 0], [0, 22]], o: [[0, 22], [0, 0]] }) }, stroke('#04210f', 8)]),
      grp([ell(0, 0, 150, 150), fill(c), stroke('#04210f', 6)])
    ]))
  };
  $$('[data-lottie]').forEach(el => {
    const i = el.dataset.lottie.indexOf(':');
    const name = el.dataset.lottie.slice(0, i), color = el.dataset.lottie.slice(i + 1);
    if (!window.lottie) return;
    lottie.loadAnimation({ container: el, renderer: 'svg', loop: true, autoplay: !reduce, animationData: LOTTIE[name](color) });
  });

  /* ---------------- smooth scroll ---------------- */
  let lenis;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(id) : $(id)?.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------------- mouse state ---------------- */
  const mouse = { x: innerWidth / 2, y: innerHeight / 2, moved: false };

  /* ---------------- custom cursor ---------------- */
  if (fine) {
    const cur = $('#cursor'), label = $('.cursor__label', cur);
    gsap.set(cur, { xPercent: -50, yPercent: -50 });
    const cx = gsap.quickTo(cur, 'x', { duration: .25, ease: 'power3' });
    const cy = gsap.quickTo(cur, 'y', { duration: .25, ease: 'power3' });
    addEventListener('pointermove', e => { cur.classList.add('is-on'); cx(e.clientX); cy(e.clientY); });
    document.addEventListener('pointerover', e => {
      const t = e.target.closest?.('[data-cursor]');
      cur.classList.toggle('is-active', !!t);
      if (t) label.textContent = t.dataset.cursor;
    });
    document.documentElement.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
  }

  /* ---------------- pixel trail ---------------- */
  const cv = $('#trail'), ctx = cv.getContext('2d');
  const CELL = 28, cells = new Map();
  let lastKey = '', trailColor = '#0f7d3f';
  const sizeTrail = () => {
    const d = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * d; cv.height = innerHeight * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  sizeTrail();
  addEventListener('resize', sizeTrail);
  if (fine && !reduce) {
    addEventListener('pointermove', e => {
      const gx = Math.floor(e.clientX / CELL), gy = Math.floor(e.clientY / CELL), k = gx + ',' + gy;
      if (k === lastKey) return;
      lastKey = k;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      trailColor = el?.closest('[data-trail]')?.dataset.trail || trailColor;
      cells.set(k, { x: gx * CELL, y: gy * CELL, a: 1, c: trailColor });
      if (Math.random() < .55) {
        const nx = gx + (Math.random() < .5 ? -1 : 1), ny = gy + (Math.random() < .5 ? -1 : 1);
        cells.set(nx + ',' + ny, { x: nx * CELL, y: ny * CELL, a: .8, c: trailColor });
      }
    });
    gsap.ticker.add(() => {
      if (!cells.size) return;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      cells.forEach((c, k) => {
        ctx.globalAlpha = c.a; ctx.fillStyle = c.c; ctx.fillRect(c.x, c.y, CELL, CELL);
        c.a -= .022;
        if (c.a <= 0) cells.delete(k);
      });
      ctx.globalAlpha = 1;
    });
  }

  /* ---------------- split chars + proximity wobble ---------------- */
  function splitChars(root) {
    $$('.split', root).forEach(node => {
      const words = node.textContent.split(' ');
      node.textContent = '';
      words.forEach((word, wi) => {
        const w = document.createElement('span');
        w.className = 'w';
        [...word].forEach(c => {
          const ch = document.createElement('span'); ch.className = 'ch';
          const ci = document.createElement('span'); ci.className = 'ci'; ci.textContent = c;
          ch.appendChild(ci); w.appendChild(ch);
        });
        node.appendChild(w);
        if (wi < words.length - 1) { const sp = document.createElement('span'); sp.className = 'sp'; node.appendChild(sp); }
      });
    });
    return $$('.ch', root);
  }

  const proximityGroups = [];
  function proximity(root, chars, radius = 240) {
    let centers = [];
    const measure = () => {
      centers = chars.map(c => { const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2 + scrollX, y: r.top + r.height / 2 + scrollY }; });
    };
    measure();
    ScrollTrigger.addEventListener('refresh', measure);
    const q = chars.map(c => ({
      y: gsap.quickTo(c, 'y', { duration: .5, ease: 'power3' }),
      s: gsap.quickTo(c, 'scale', { duration: .5, ease: 'power3' }),
      r: gsap.quickTo(c, 'rotation', { duration: .5, ease: 'power3' })
    }));
    proximityGroups.push(() => {
      const b = root.getBoundingClientRect();
      if (b.bottom < -radius || b.top > innerHeight + radius) return;
      const mx = mouse.x + scrollX, my = mouse.y + scrollY;
      chars.forEach((_, i) => {
        const dx = mx - centers[i].x, dy = my - centers[i].y;
        const k = Math.max(0, 1 - Math.hypot(dx, dy) / radius);
        q[i].y(-k * radius * .14); q[i].s(1 + k * .2); q[i].r(-dx / radius * k * 9);
      });
    });
  }

  const heroChars = splitChars($('.hero__title'));
  const footChars = splitChars($('.contact__title'));
  if (fine && !reduce) {
    proximity($('.hero__title'), heroChars);
    proximity($('.contact__title'), footChars);
    gsap.ticker.add(() => { if (mouse.moved) proximityGroups.forEach(f => f()); });
  }

  /* ---------------- mouse parallax: stickers & chip ---------------- */
  const depthEls = $$('[data-depth]').map(el => ({
    d: parseFloat(el.dataset.depth),
    x: gsap.quickTo(el, 'x', { duration: .9, ease: 'power3' }),
    y: gsap.quickTo(el, 'y', { duration: .9, ease: 'power3' }),
    r: el.classList.contains('chip') ? gsap.quickTo(el, 'rotation', { duration: 1, ease: 'power3' }) : null
  }));
  addEventListener('pointermove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.moved = true;
    if (reduce) return;
    const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
    depthEls.forEach(o => { o.x(nx * o.d * 90); o.y(ny * o.d * 90); o.r?.(nx * 14); });
  });

  /* ---------------- magnetic ---------------- */
  if (fine) $$('[data-magnetic]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .35, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4, ease: 'power3' });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1,.4)' }));
  });

  /* ---------------- click: pixel confetti ---------------- */
  const palette = ['#19e784', '#ff6fd8', '#ffd426', '#1236d1', '#f3efe2'];
  if (!reduce) addEventListener('pointerdown', e => {
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('i');
      p.className = 'px';
      p.style.background = palette[i % palette.length];
      p.style.left = e.clientX - 6 + 'px'; p.style.top = e.clientY - 6 + 'px';
      document.body.appendChild(p);
      const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 90;
      gsap.to(p, { x: Math.cos(a) * d, y: Math.sin(a) * d + 30, rotation: Math.random() * 180, opacity: 0, scale: .3, duration: .8 + Math.random() * .4, ease: 'power2.out', onComplete: () => p.remove() });
    }
  });

  /* ---------------- scroll progress ---------------- */
  gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

  /* ---------------- hero extras ---------------- */
  $$('.pixels i').forEach(p => gsap.to(p, { opacity: 'random(.1,1)', duration: .5, repeat: -1, repeatRefresh: true, repeatDelay: .2, ease: 'steps(1)' }));
  if (!reduce) gsap.to('.hero__inner', { yPercent: -12, opacity: .25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* ---------------- story ---------------- */
  if ($('.story__title')) {
    gsap.set('.mi', { yPercent: 110 });
    gsap.to('.mi', { yPercent: 0, duration: 1, ease: 'power4.out', stagger: .07, scrollTrigger: { trigger: '.story__title', start: 'top 75%' } });
    gsap.from('.paren, .bubble', { scale: 0, duration: .8, ease: 'back.out(2.4)', stagger: .1, scrollTrigger: { trigger: '.story__title', start: 'top 60%' } });
    gsap.from('.sticker--bag', { scale: 0, rotation: -90, duration: 1, ease: 'elastic.out(1,.5)', scrollTrigger: { trigger: '.story__title', start: 'top 50%' } });
  }

  const lead = $('[data-scrub]');
  if (lead) {
    lead.innerHTML = lead.textContent.split(' ').map(w => `<span class="sw">${w}</span>`).join(' ');
    gsap.fromTo($$('.sw', lead), { opacity: .18 }, { opacity: 1, stagger: .12, ease: 'none', scrollTrigger: { trigger: lead, start: 'top 85%', end: 'bottom 55%', scrub: true } });
  }

  $$('[data-count]').forEach(el => {
    const o = { v: 0 }, target = +el.dataset.count;
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: target, duration: 1.8, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v) + (target > 100 ? '+' : '') }) });
  });

  /* ---------------- scene: pixel dissolve + parallax ---------------- */
  const pv = $('#pixelReveal'), pctx = pv?.getContext('2d');
  const PC = 52;
  let order = [], cols = 0, rows = 0, revealP = 0;
  const drawReveal = () => {
    const w = pv.clientWidth, h = pv.clientHeight, d = Math.min(devicePixelRatio || 1, 2);
    if (pv.width !== w * d) { pv.width = w * d; pv.height = h * d; }
    pctx.setTransform(d, 0, 0, d, 0, 0);
    pctx.clearRect(0, 0, w, h);
    pctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--peri');
    const gone = Math.floor(revealP * order.length);
    for (let i = gone; i < order.length; i++) {
      const n = order[i];
      pctx.fillRect((n % cols) * PC, Math.floor(n / cols) * PC, PC + 1, PC + 1);
    }
  };
  const buildReveal = () => {
    cols = Math.ceil(pv.clientWidth / PC); rows = Math.ceil(pv.clientHeight / PC);
    order = gsap.utils.shuffle([...Array(cols * rows).keys()]);
    drawReveal();
  };
  if (pv) { buildReveal(); addEventListener('resize', buildReveal); }
  if (pv) ScrollTrigger.create({ trigger: '.scene', start: 'top 92%', end: 'top 15%', scrub: true, onUpdate: s => { revealP = s.progress; drawReveal(); } });

  if (!reduce && pv) {
    const sc = { trigger: '.scene', start: 'top bottom', end: 'bottom top', scrub: true };
    gsap.fromTo('.scene__inner', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: sc });
    gsap.to('.sc-fore--l', { x: 90, ease: 'none', scrollTrigger: sc });
    gsap.to('.sc-fore--r', { x: -90, ease: 'none', scrollTrigger: sc });
    gsap.fromTo('.sc-sign', { rotation: -16 }, { rotation: -4, ease: 'none', scrollTrigger: sc });
    gsap.fromTo('.sc-door', { scale: .9 }, { scale: 1.08, transformOrigin: '50% 100%', ease: 'none', scrollTrigger: sc });
  }

  /* ---------------- work cards ---------------- */
  $$('.card-wrap').forEach(wrap => {
    const r = +wrap.dataset.r, y = +wrap.dataset.y, card = $('.card', wrap);
    gsap.fromTo(wrap, { y: 240, rotation: r * 2.6, opacity: 0 }, { y, rotation: r, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: '.cards', start: 'top 92%', end: 'top 40%', scrub: .8 } });
    if (!fine) return;
    gsap.set(card, { transformPerspective: 900 });
    const rx = gsap.quickTo(card, 'rotationX', { duration: .5, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: .5, ease: 'power3' });
    card.addEventListener('pointerenter', () => { wrap.style.zIndex = 5; gsap.to(card, { rotation: -r, scale: 1.07, duration: .6, ease: 'back.out(2)' }); });
    card.addEventListener('pointermove', e => {
      const b = card.getBoundingClientRect(), px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height;
      ry((px - .5) * 16); rx(-(py - .5) * 16);
      card.style.setProperty('--mx', px * 100 + '%'); card.style.setProperty('--my', py * 100 + '%');
    });
    card.addEventListener('pointerleave', () => { wrap.style.zIndex = ''; rx(0); ry(0); gsap.to(card, { rotation: 0, scale: 1, duration: .6, ease: 'power3' }); });
  });
  if ($('.work__head')) gsap.from('.work__head h2, .work__head p', { y: 60, opacity: 0, duration: 1, ease: 'power3.out', stagger: .15, scrollTrigger: { trigger: '.work__head', start: 'top 85%' } });

  /* ---------------- marquee (kecepatan & arah ikut scroll) ---------------- */
  const rows2 = $$('.marquee__row').map(row => {
    const inner = $('.marquee__inner', row), set = inner.firstElementChild;
    inner.appendChild(set.cloneNode(true));
    return { inner, dir: +row.dataset.dir, x: 0, w: set.offsetWidth };
  });
  addEventListener('resize', () => rows2.forEach(r => r.w = r.inner.firstElementChild.offsetWidth));
  document.fonts?.ready.then(() => rows2.forEach(r => r.w = r.inner.firstElementChild.offsetWidth));
  let lastY = scrollY, vel = 0;
  gsap.ticker.add(() => {
    vel += ((scrollY - lastY) - vel) * .1; lastY = scrollY;
    rows2.forEach(r => {
      r.x = gsap.utils.wrap(-r.w, 0, r.x - r.dir * (1.4 + vel * .45));
      gsap.set(r.inner, { x: r.x, skewX: reduce ? 0 : gsap.utils.clamp(-10, 10, -vel * r.dir * .2) });
    });
  });

  /* ---------------- contact ---------------- */
  gsap.from('.sticker--smile2', { scale: 0, rotation: 60, duration: 1.1, ease: 'elastic.out(1,.5)', scrollTrigger: { trigger: '.contact', start: 'top 60%' } });
  gsap.from('.contact__cta, .contact__meta', { y: 50, opacity: 0, duration: .9, ease: 'power3.out', stagger: .15, scrollTrigger: { trigger: '.contact__cta', start: 'top 92%' } });
  const clock = $('#clock');
  const tick = () => clock.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' });
  tick(); setInterval(tick, 20000);

  /* ---------------- loader + intro ---------------- */
  const heroCi = $$('.ci', $('.hero__title'));
  const footCi = $$('.ci', $('.contact__title'));
  gsap.set(heroCi, { yPercent: 115 });
  gsap.set(footCi, { yPercent: 115 });
  gsap.set(['.chip', '.sticker--star', '.sticker--smile', '.sticker--badge'], { scale: 0 });
  gsap.set(['.hero__sub', '.hero .btn'], { y: 30, opacity: 0 });
  gsap.set('.nav', { yPercent: -100 });

  gsap.to(footCi, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: .035, scrollTrigger: { trigger: '.contact__title', start: 'top 80%' } });

  const intro = () => {
    lenis?.start();
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to(heroCi, { yPercent: 0, duration: 1.1, stagger: .04 })
      .to('.nav', { yPercent: 0, duration: .9 }, .2)
      .to(['.chip', '.sticker--star', '.sticker--smile', '.sticker--badge'], { scale: 1, duration: 1.2, ease: 'elastic.out(1,.55)', stagger: .12 }, .5)
      .to(['.hero__sub', '.hero .btn'], { y: 0, opacity: 1, duration: .9, stagger: .12 }, .7);
  };
  const loader = $('#loader'), num = $('#loadNum'), o = { v: 0 };
  gsap.to(o, {
    v: 100, duration: reduce ? .2 : 1.8, ease: 'power2.inOut',
    onUpdate: () => num.textContent = Math.round(o.v),
    onComplete: () => {
      gsap.to(loader, { yPercent: -100, duration: .9, ease: 'power4.inOut', onComplete: () => loader.remove() });
      gsap.delayedCall(.4, intro);
    }
  });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
