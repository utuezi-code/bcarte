/* ── Mobile menu ── */
const hamburger = document.querySelector('.navbar__hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    hamburger.querySelector('i').className = open ? 'ti ti-x' : 'ti ti-menu-2';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      hamburger.querySelector('i').className = 'ti ti-menu-2';
    });
  });
}

/* ── Navbar shadow on scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

/* ── Scroll reveal ── */
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
  : null;

document.querySelectorAll('.reveal-up, .reveal-right').forEach(el =>
  io ? io.observe(el) : el.classList.add('visible')
);

/* ── Animated counters ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  if (isNaN(target)) return;
  const start = performance.now();
  const dur = 1400;
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statsEl = document.querySelector('.hero__stats');
if (statsEl) {
  let done = false;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !done) {
      done = true;
      statsEl.querySelectorAll('[data-target]').forEach(animateCounter);
    }
  }, { threshold: 0.5 }).observe(statsEl);
}

/* ── Smooth parallax on bg word cloud (desktop, pointer: fine) ── */
const bgCloud = document.getElementById('bgCloud');
if (bgCloud && window.matchMedia('(pointer: fine)').matches) {
  let tx = 0, ty = 0, mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  (function loop() {
    const vw = innerWidth / 2, vh = innerHeight / 2;
    tx += ((mx - vw) / vw * 14 - tx) * 0.055;
    ty += ((my - vh) / vh *  9 - ty) * 0.055;
    bgCloud.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px)`;
    requestAnimationFrame(loop);
  })();
}
