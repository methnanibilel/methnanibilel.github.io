/* ================================================================
   BILEL METHNANI — AURORA THEME SCRIPTS
   ================================================================ */

/* ── 1. THEME ────────────────────────────────────────────────────── */
(function () {
  const html  = document.documentElement;
  const btn   = document.getElementById('themeToggle');
  const icon  = document.getElementById('themeIcon');
  const DARK  = 'dark';
  const LIGHT = 'light';

  function applyTheme(theme) {
    html.dataset.theme = theme;
    if (icon) icon.className = theme === DARK ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('portfolio-theme', theme);
  }
  applyTheme(localStorage.getItem('portfolio-theme') || DARK);

  if (btn) btn.addEventListener('click', () => {
    applyTheme(html.dataset.theme === DARK ? LIGHT : DARK);
  });
})();

/* ── 2. CUSTOM CURSOR ────────────────────────────────────────────── */
(function () {
  const dot    = document.getElementById('cursorDot');
  const circle = document.getElementById('cursorCircle');
  if (!dot || !circle) return;

  let mx = -300, my = -300, cx = -300, cy = -300;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function loopCircle() {
    cx += (mx - cx) * .11;
    cy += (my - cy) * .11;
    circle.style.left = cx + 'px';
    circle.style.top  = cy + 'px';
    requestAnimationFrame(loopCircle);
  })();

  document.querySelectorAll('a, button, .skill-card, .project-card, .tl-card').forEach(el => {
    el.addEventListener('mouseenter', () => circle.classList.add('hover'));
    el.addEventListener('mouseleave', () => circle.classList.remove('hover'));
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; circle.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; circle.style.opacity = '1'; });
})();

/* ── 3. AURORA HERO PARTICLES ────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let mouse = { x: -9999, y: -9999 };

  const COUNT   = 65;
  const CONNECT = 125;
  const SPEED   = 0.3;

  /* Aurora particle palette */
  const COLORS = [
    [147,51,234],   /* purple */
    [236,72,153],   /* pink */
    [6,182,212],    /* cyan */
    [192,132,252],  /* light purple */
    [249,168,212],  /* light pink */
    [103,232,249],  /* light cyan */
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function makeParticle() {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: rand(0, W), y: rand(0, H),
      vx: rand(-SPEED, SPEED), vy: rand(-SPEED, SPEED),
      r: rand(1.2, 2.6),
      col: c,
    };
  }

  function init() {
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(makeParticle());
  }

  function isDark() { return document.documentElement.dataset.theme !== 'light'; }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const alpha = isDark() ? 0.65 : 0.5;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      /* mouse repel */
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        const f = (90 - dist) / 90 * 0.55;
        p.vx += (dx / dist) * f;
        p.vy += (dy / dist) * f;
      }

      p.vx *= 0.994; p.vy *= 0.994;
      if (Math.abs(p.vx) < 0.04) p.vx = rand(-SPEED, SPEED) * 0.3;
      if (Math.abs(p.vy) < 0.04) p.vy = rand(-SPEED, SPEED) * 0.3;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      /* dot */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${alpha})`;
      ctx.fill();

      /* connections */
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx2 = p.x - q.x, dy2 = p.y - q.y;
        const d2  = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (d2 < CONNECT) {
          const a = (1 - d2 / CONNECT) * 0.22;
          /* gradient line between two particle colors */
          const grad = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
          grad.addColorStop(0, `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${a})`);
          grad.addColorStop(1, `rgba(${q.col[0]},${q.col[1]},${q.col[2]},${a})`);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }
  }

  (function loop() { draw(); requestAnimationFrame(loop); })();
  resize(); init();
  window.addEventListener('resize', () => { resize(); init(); });

  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  }
})();

/* ── 4. TYPED TEXT ───────────────────────────────────────────────── */
(function () {
  const el = document.getElementById('typedText');
  if (!el) return;

  const roles = [
    'Full-Stack Developer',
    'Odoo Technical Expert',
    'Angular Developer',
    'Flutter Developer',
    'ERP Consultant',
    'Python Developer',
  ];

  let ri = 0, ci = 0, deleting = false, waiting = false;

  function tick() {
    if (waiting) return;
    const role = roles[ri];
    if (!deleting) {
      el.textContent = role.slice(0, ci + 1);
      ci++;
      if (ci === role.length) { waiting = true; setTimeout(() => { waiting = false; deleting = true; tick(); }, 2400); return; }
    } else {
      el.textContent = role.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 50 : 95);
  }
  setTimeout(tick, 1000);
})();

/* ── 5. NAVBAR — scroll, spy, mobile ────────────────────────────── */
(function () {
  const nav     = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const links   = document.getElementById('navLinks');
  const stBtn   = document.getElementById('scrollTop');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    if (stBtn) stBtn.classList.toggle('visible', window.scrollY > 400);

    /* scroll spy */
    let current = '';
    document.querySelectorAll('section[id]').forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (menuBtn && links) {
    menuBtn.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

/* ── 6. SCROLL REVEAL ────────────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ── 7. COUNTER ANIMATION ────────────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const dur = 1800, start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + '+';
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ── 8. SCROLL TO TOP ────────────────────────────────────────────── */
(function () {
  const btn = document.getElementById('scrollTop');
  if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── 9. CONTACT FORM — EMAILJS ───────────────────────────────────── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  if (window.emailjs) emailjs.init({ publicKey: 'YOUR_PUBLIC_KEY' });

  const submitBtn = form.querySelector('.form-submit');
  const msgEl     = document.getElementById('formMsg');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) { showMsg('error', 'Please fill in all fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showMsg('error', 'Please enter a valid email address.'); return; }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    try {
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', { from_name: name, from_email: email, subject, message });
      showMsg('success', 'Message sent! I\'ll get back to you soon.');
      form.reset();
    } catch (err) {
      console.error(err);
      showMsg('error', 'Something went wrong. Please try emailing me directly.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
  });

  function showMsg(type, text) {
    if (!msgEl) return;
    msgEl.className = 'form-msg ' + type;
    msgEl.textContent = text;
    setTimeout(() => { msgEl.className = 'form-msg'; }, 6000);
  }
})();

/* ── 10. AURORA BLOB MOUSE PARALLAX (subtle) ─────────────────────── */
(function () {
  const blobs = document.querySelectorAll('.aurora-blob');
  if (!blobs.length) return;
  let ticking = false;
  document.addEventListener('mousemove', e => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const xRatio = (e.clientX / window.innerWidth  - .5) * 2;
      const yRatio = (e.clientY / window.innerHeight - .5) * 2;
      blobs.forEach((b, i) => {
        const strength = (i + 1) * 10;
        b.style.transform = `translate(${xRatio * strength}px, ${yRatio * strength}px)`;
      });
      ticking = false;
    });
  });
})();
