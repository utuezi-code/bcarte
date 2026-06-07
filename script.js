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

/* ── Navbar scroll shadow ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 16);
}, { passive: true });

/* ── Scroll-reveal with IntersectionObserver ── */
const revealEls = document.querySelectorAll('.reveal-up');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

/* ── Animated counters ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  if (isNaN(target)) return;
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsSection = document.querySelector('.hero__stats');
if (statsSection && 'IntersectionObserver' in window) {
  let counted = false;
  const statsIO = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      statsSection.querySelectorAll('[data-target]').forEach(animateCounter);
      statsIO.disconnect();
    }
  }, { threshold: 0.5 });
  statsIO.observe(statsSection);
}

/* ── Parallax on background word cloud (mouse move) ── */
const bgCloud = document.getElementById('bgCloud');
if (bgCloud && window.matchMedia('(pointer: fine)').matches) {
  let raf;
  document.addEventListener('mousemove', (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;  // -1 … 1
      const dy = (e.clientY - cy) / cy;
      bgCloud.style.transform = `translate(${dx * 12}px, ${dy * 8}px)`;
    });
  });
}
