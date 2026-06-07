/* ── Mobile menu ── */
const hamburger = document.querySelector('.navbar__hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.querySelector('i').className = isOpen ? 'ti ti-x' : 'ti ti-menu-2';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      hamburger.querySelector('i').className = 'ti ti-menu-2';
    });
  });
}

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 16);
}, { passive: true });

/* ── Scroll-reveal ── */
const io = ('IntersectionObserver' in window)
  ? new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
  : null;

document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
  io ? io.observe(el) : el.classList.add('visible');
});

/* ── Animated counters ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  if (isNaN(target)) return;
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = Math.round(eased * target) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statsEl = document.querySelector('.hero__stats');
if (statsEl) {
  let done = false;
  const sio = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !done) {
      done = true;
      statsEl.querySelectorAll('[data-target]').forEach(animateCounter);
      sio.disconnect();
    }
  }, { threshold: 0.4 });
  sio.observe(statsEl);
}

/* ── Parallax on bg word cloud (mouse, desktop only) ── */
const bgCloud = document.getElementById('bgCloud');
if (bgCloud && window.matchMedia('(pointer: fine)').matches) {
  let raf;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  const update = () => {
    const vw = window.innerWidth / 2;
    const vh = window.innerHeight / 2;
    tx += ((cx - vw) / vw * 14 - tx) * 0.06;
    ty += ((cy - vh) / vh * 9  - ty) * 0.06;
    bgCloud.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
    raf = requestAnimationFrame(update);
  };
  document.addEventListener('mousemove', (e) => { cx = e.clientX; cy = e.clientY; }, { passive: true });
  raf = requestAnimationFrame(update);
}

/* ── Benefit cards grid border fix on hover ──
   The gap-as-border technique needs no JS — handled in CSS */
