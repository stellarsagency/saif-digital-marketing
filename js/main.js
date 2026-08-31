// ==================== HEADER SCROLL ====================
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ==================== MEGA MENU ====================
const megaTriggers = document.querySelectorAll('[data-mega-trigger]');
const megaPanels = document.querySelectorAll('[data-mega-panel]');
const megaOverlay = document.getElementById('megaOverlay');
let activeMega = null;

function closeMegaMenu() {
  megaPanels.forEach(p => p.classList.remove('active'));
  megaOverlay.classList.remove('active');
  document.querySelectorAll('.header-nav-item').forEach(i => i.classList.remove('open'));
  activeMega = null;
}

megaTriggers.forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.innerWidth <= 992) return;
    const panelId = trigger.getAttribute('data-mega-trigger');
    const panel = document.getElementById('mega-' + panelId);
    if (activeMega === panel) { closeMegaMenu(); } else {
      closeMegaMenu();
      panel.classList.add('active');
      megaOverlay.classList.add('active');
      trigger.closest('.header-nav-item').classList.add('open');
      activeMega = panel;
    }
  });
});

document.addEventListener('click', (e) => {
  if (activeMega && !e.target.closest('.header-nav-item') && !e.target.closest('.header-mega-panel')) closeMegaMenu();
});
document.querySelectorAll('.header-mega-child-link').forEach(link => {
  link.addEventListener('click', () => closeMegaMenu());
});
megaOverlay.addEventListener('click', closeMegaMenu);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMegaMenu(); });

// ==================== MOBILE MENU ====================
const hamburger = document.getElementById('hamburgerBtn');
const mobilePanel = document.getElementById('header-mobile-panel');
hamburger.addEventListener('click', () => {
  const isOpen = mobilePanel.classList.toggle('active');
  hamburger.classList.toggle('active');
  document.body.style.overflow = isOpen ? 'hidden' : '';
  document.body.classList.toggle('has-open-mobile-menu', isOpen);
  closeMegaMenu();
});
document.querySelectorAll('[data-mobile-trigger]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const target = trigger.getAttribute('data-mobile-trigger');
    const dropdown = document.getElementById('mobile-' + target);
    trigger.classList.toggle('active');
    dropdown.classList.toggle('active');
  });
});
document.querySelectorAll('.header-mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobilePanel.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('has-open-mobile-menu');
  });
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 992 && mobilePanel.classList.contains('active')) {
    hamburger.classList.remove('active');
    mobilePanel.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('has-open-mobile-menu');
  }
});

// ==================== TYPEWRITER ====================
const typewriterElement = document.getElementById('banner-typewriter');
const wordsData = typewriterElement ? typewriterElement.dataset.words : null;
const typeWords = wordsData ? JSON.parse(wordsData) : ['Search Rankings', 'Social Presence', 'Conversion Rates', 'Brand Authority'];
let wordIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;
function typeWriter() {
  const currentWord = typeWords[wordIndex];
  if (isDeleting) {
    typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--; typingSpeed = 50;
  } else {
    typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++; typingSpeed = 100;
  }
  if (!isDeleting && charIndex === currentWord.length) { isDeleting = true; typingSpeed = 2000; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % typeWords.length; typingSpeed = 500; }
  setTimeout(typeWriter, typingSpeed);
}
document.addEventListener('DOMContentLoaded', () => { if (typewriterElement) setTimeout(typeWriter, 600); });

// ==================== COUNTER ANIMATION ====================
function animateCounters() {
  document.querySelectorAll('.stat-box .stat-value, .home-stat-num').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target') || counter.parentElement.getAttribute('data-value'));
    if (!target || counter.dataset.animated) return;
    counter.dataset.animated = 'true';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
      current += step;
      if (current < target) { counter.textContent = Math.floor(current); requestAnimationFrame(update); }
      else { counter.textContent = target; }
    };
    update();
  });
}

// ==================== SCROLL REVEAL ====================
function setupScrollReveal() {
  const els = document.querySelectorAll('.award-card, .contact-info-card, .experience-grid > div, .stat-box, .home-service-card, .home-portfolio-card, .blog-card');
  els.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

// ==================== STATS ON SCROLL ====================
function setupStatsCounter() {
  const statsSection = document.querySelector('.experience-stats-grid, .home-stats-grid');
  let counted = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting && !counted) { counted = true; animateCounters(); } });
  }, { threshold: 0.3 });
  if (statsSection) observer.observe(statsSection);
}

// ==================== TESTIMONIALS SWIPER ====================
function setupTestimonialsSwiper() {
  if (typeof Swiper === 'undefined') return;
  new Swiper('.testimonials-swiper', {
    slidesPerView: 1, spaceBetween: 24, loop: true,
    autoplay: { delay: 5000, disableOnOperation: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
  });
}

// ==================== SMOOTH SCROLL ====================
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });
}

// ==================== GSAP ANIMATIONS ====================
function setupGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.global-banner__tagline', { opacity: 0, y: 25, duration: 0.7, delay: 0.2 });
  gsap.from('.headline', { opacity: 0, y: 25, duration: 0.7, delay: 0.4 });
  gsap.from('.global-banner__description', { opacity: 0, y: 25, duration: 0.7, delay: 0.6 });
  gsap.from('.global-banner__cta', { opacity: 0, y: 25, duration: 0.7, delay: 0.8 });
  gsap.from('.global-banner__img-wrap', { opacity: 0, scale: 0.9, duration: 0.9, delay: 0.5 });
  gsap.utils.toArray('.insight-section-title').forEach(title => {
    gsap.from(title, { scrollTrigger: { trigger: title, start: 'top 88%' }, opacity: 0, y: 30, duration: 0.7 });
  });
  gsap.utils.toArray('.awards-cards-grid').forEach(grid => {
    gsap.from(grid.children, { scrollTrigger: { trigger: grid, start: 'top 88%' }, opacity: 0, y: 30, duration: 0.5, stagger: 0.12 });
  });
}

// ==================== FORMS ====================
function setupForms() {
  const contactForm = document.getElementById('contactForm');
  const newsletterForm = document.getElementById('newsletterForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => { e.preventDefault(); alert('Thank you for your message! We will get back to you soon.'); contactForm.reset(); });
  }
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => { e.preventDefault(); alert('Thank you for subscribing!'); newsletterForm.reset(); });
  }
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
  setupScrollReveal(); setupStatsCounter(); setupTestimonialsSwiper(); setupSmoothScroll(); setupGSAPAnimations(); setupForms();
});
