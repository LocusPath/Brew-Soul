/* ═══════════════════════════════════════════════════════
   BREW & SOUL — Main JavaScript
   ═══════════════════════════════════════════════════════ */

import './style.css';

// ─── Preloader Timeline ───
const PRELOADER_DURATION = 5500; // ms — matches original CSS animations

function initPreloader() {
  const preloader = document.getElementById('preloader');
  const mainSite = document.getElementById('main-site');

  // Skip preloader if already seen in current browser session
  if (sessionStorage.getItem('brew_soul_preloader_seen')) {
    if (preloader) {
      preloader.style.display = 'none';
      preloader.classList.add('done');
    }
    if (mainSite) {
      mainSite.classList.remove('hidden');
      mainSite.classList.add('visible');
    }
    document.body.style.overflow = '';
    initScrollAnimations();
    initCounters();
    return;
  }

  // Lock scroll during preloader
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    // Fade out preloader
    if (preloader) preloader.classList.add('done');

    // Reveal main site
    if (mainSite) {
      mainSite.classList.remove('hidden');
      requestAnimationFrame(() => {
        mainSite.classList.add('visible');
      });
    }

    // Unlock scroll
    document.body.style.overflow = '';

    // Mark preloader as seen for current session
    sessionStorage.setItem('brew_soul_preloader_seen', 'true');

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
      let staggerIndex = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          
          // Apply stagger delay only to elements entering viewport simultaneously
          if (!el.style.transitionDelay) {
            el.style.transitionDelay = `${staggerIndex * 0.1}s`;
            staggerIndex++;
          }
          
          el.classList.add('in-view');
          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => {
    // Clear any pre-assigned global transition delays
    el.style.transitionDelay = '';
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
          animateCount(el, 0, target, 1200); // 1.2s for snappier counters
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

// ─── Custom Premium Toast Notification Helper ───
function showToast(message) {
  let toast = document.getElementById('custom-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <span class="notification-icon">☕</span>
      <span class="notification-text" id="custom-toast-text"></span>
    `;
    document.body.appendChild(toast);
  }
  document.getElementById('custom-toast-text').textContent = message;
  
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 3000);
}

// ─── Cart Logic & Item Feedback ───
function initCart() {
  const addBtns = document.querySelectorAll('.card-btn');
  const cartBadge = document.getElementById('cart-badge');
  const notification = document.getElementById('cart-notification');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-drawer-backdrop');
  const cartClose = document.getElementById('cart-drawer-close');
  const cartIcon = document.getElementById('cart-icon-wrapper');
  const cartItemsContainer = document.getElementById('cart-drawer-items');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const clearBtn = document.getElementById('cart-clear-btn');
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  const orderNowNav = document.querySelector('.nav-cta');

  let cart = JSON.parse(localStorage.getItem('brew_soul_cart')) || [];

  function saveCart() {
    localStorage.setItem('brew_soul_cart', JSON.stringify(cart));
    updateCartUI();
  }

  function updateCartUI() {
    // 1. Update Badge
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'flex' : 'none';

    // 2. Render Drawer Items
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-cart-icon">☕</div>
          <div class="empty-cart-text">
            <h4>Your Cart is Empty</h4>
            <p>Add some signature brews to get started!</p>
          </div>
        </div>
      `;
    } else {
      cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-details">
            <span class="cart-item-title">${item.name}</span>
            <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            <div class="cart-item-controls">
              <div class="cart-item-qty">
                <button class="qty-btn minus-qty" data-id="${item.id}">&minus;</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn plus-qty" data-id="${item.id}">+</button>
              </div>
              <button class="cart-item-remove" data-id="${item.id}">Remove</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    // 3. Update Subtotal
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  }

  // Initial UI render
  updateCartUI();

  // Add Item Click
  addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.menu-card');
      const name = card.querySelector('.card-title').textContent.trim();
      const priceText = card.querySelector('.card-price').textContent.trim();
      const price = parseFloat(priceText.replace('$', ''));
      const image = card.querySelector('.card-image img').getAttribute('src');
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Add loading state
      const originalText = btn.textContent;
      btn.classList.add('loading');

      setTimeout(() => {
        btn.classList.remove('loading');
        btn.classList.add('success');
        btn.textContent = '✓ Added';

        // Update cart array
        const existing = cart.find(item => item.id === id);
        if (existing) {
          existing.quantity++;
        } else {
          cart.push({ id, name, price, image, quantity: 1 });
        }
        saveCart();

        // Show toast notification
        notification.classList.add('visible');
        setTimeout(() => {
          notification.classList.remove('visible');
        }, 3000);

        setTimeout(() => {
          btn.classList.remove('success');
          btn.textContent = originalText;
        }, 2000);
      }, 600);
    });
  });

  // Drawer Toggle
  function openDrawer() {
    if (cartDrawer && cartBackdrop) {
      cartDrawer.classList.add('open');
      cartBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    }
  }

  function closeDrawer() {
    if (cartDrawer && cartBackdrop) {
      cartDrawer.classList.remove('open');
      cartBackdrop.classList.remove('open');
      document.body.style.overflow = ''; // Unlock scroll
    }
  }

  if (cartIcon) cartIcon.addEventListener('click', openDrawer);
  if (cartClose) cartClose.addEventListener('click', closeDrawer);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeDrawer);

  // Cart quantity adjustments / removals via event delegation
  cartItemsContainer.addEventListener('click', (e) => {
    const target = e.target;
    const itemId = target.getAttribute('data-id');
    if (!itemId) return;

    if (target.classList.contains('plus-qty')) {
      const item = cart.find(i => i.id === itemId);
      if (item) {
        item.quantity++;
        saveCart();
      }
    } else if (target.classList.contains('minus-qty')) {
      const item = cart.find(i => i.id === itemId);
      if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
          cart = cart.filter(i => i.id !== itemId);
        }
        saveCart();
      }
    } else if (target.classList.contains('cart-item-remove')) {
      cart = cart.filter(i => i.id !== itemId);
      saveCart();
    }
  });

  // Clear Cart Button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      cart = [];
      saveCart();
      showToast('Cart cleared!');
    });
  }

  // Handle Checkout & Order Now clicks with validation
  function handleCheckoutRedirect(e) {
    if (cart.length === 0) {
      e.preventDefault();
      openDrawer();
      showToast('Your cart is empty! Add some brews first.');
    }
  }

  if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckoutRedirect);
  if (orderNowNav) orderNowNav.addEventListener('click', handleCheckoutRedirect);
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

// ─── Social Links Handler ───
function initSocialLinks() {
  const socialLinks = document.querySelectorAll('.social-link');
  socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const label = link.getAttribute('aria-label') || 'Social Media';
      showToast(`Opening our ${label} page...`);
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
