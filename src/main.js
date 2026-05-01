/* ═══════════════════════════════════════════════════════
   BREW & SOUL — Main JavaScript
   ═══════════════════════════════════════════════════════ */

import './style.css';

// ─── Preloader Timeline ───
const PRELOADER_DURATION = 5500; // ms — matches CSS animations

function initPreloader() {
  const preloader = document.getElementById('preloader');
  const mainSite = document.getElementById('main-site');

  // Lock scroll during preloader
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    // Fade out preloader
    preloader.classList.add('done');

    // Reveal main site
    mainSite.classList.remove('hidden');
    requestAnimationFrame(() => {
      mainSite.classList.add('visible');
    });

    // Unlock scroll
    document.body.style.overflow = '';

    // Start scroll animations & counters after site is visible
    setTimeout(() => {
      initScrollAnimations();
      initCounters();
    }, 300);
  }, PRELOADER_DURATION);
}

// ─── Scroll-based Reveal Animations ───
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(el);
  });
}

// ─── Animated Counters ───
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          animateCount(el, 0, target, 2000);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}

function animateCount(el, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const current = Math.round(start + (end - start) * eased);
    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ─── Navbar Scroll Effect ───
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      // Animate hamburger
      toggle.classList.toggle('active');
    });

    // Close menu on link click
    links.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ─── Hero Particles ───
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${60 + Math.random() * 40}%`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    particle.style.animationDuration = `${6 + Math.random() * 6}s`;
    particle.style.width = `${2 + Math.random() * 3}px`;
    particle.style.height = particle.style.width;
    particle.style.opacity = `${0.1 + Math.random() * 0.4}`;
    container.appendChild(particle);
  }
}

// ─── Menu Filters ───
function initMenuFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.menu-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.pointerEvents = 'auto';
        } else {
          card.style.opacity = '0.2';
          card.style.transform = 'scale(0.95)';
          card.style.pointerEvents = 'none';
        }
      });
    });
  });
}

// ─── Contact Form ───
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sent! ✓';
    btn.style.background = '#27ae60';
    btn.style.borderColor = '#27ae60';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.borderColor = '';
      form.reset();
    }, 2500);
  });
}

// ─── Smooth Scroll for all anchor links ───
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ─── Parallax Hero ───
function initParallax() {
  const heroBg = document.querySelector('.hero-bg::before');

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const heroHeight = hero.offsetHeight;
    if (scroll < heroHeight) {
      const content = document.querySelector('.hero-content');
      if (content) {
        content.style.transform = `translateY(${scroll * 0.15}px)`;
        content.style.opacity = 1 - scroll / heroHeight * 0.6;
      }
    }
  });
}

// ─── Cart Logic & Item Feedback ───
function initCart() {
  const addBtns = document.querySelectorAll('.card-btn');
  const cartBadge = document.getElementById('cart-badge');
  const notification = document.getElementById('cart-notification');
  let cartCount = 0;

  addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Show loading state
      const originalText = btn.textContent;
      btn.classList.add('loading');

      // Simulate a small delay for "adding"
      setTimeout(() => {
        btn.classList.remove('loading');
        btn.classList.add('success');
        btn.textContent = '✓ Added';

        // 2. Increment count & Update badge
        cartCount++;
        cartBadge.textContent = cartCount;
        cartBadge.style.display = 'flex';

        // 3. Show notification
        showNotification();

        // 4. Reset button after a delay
        setTimeout(() => {
          btn.classList.remove('success');
          btn.textContent = originalText;
        }, 2000);
      }, 600);
    });
  });

  function showNotification() {
    notification.classList.add('visible');
    setTimeout(() => {
      notification.classList.remove('visible');
    }, 3000);
  }
}

// ─── Generic Button Feedback ───
function initButtonFeedback() {
  const allBtns = document.querySelectorAll('.btn, .nav-cta, .filter-btn');

  allBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Don't add feedback if it's an internal link
      if (btn.hasAttribute('href') && btn.getAttribute('href').startsWith('#')) return;

      // Add a subtle ripple effect
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      btn.appendChild(ripple);

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// ─── Init Everything ───
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initParticles();
  initMenuFilters();
  initContactForm();
  initSmoothScroll();
  initParallax();
  initCart();
  initButtonFeedback();
});
