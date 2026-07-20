/* ═══════════════════════════════════════════════════════════════
   PKK SUNGGINGAN WEBSITE - MAIN.JS
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  console.log('PKK Sunggingan website initialized.');

  initMobileMenu();
  initSmoothScroll();
});

/* ───────────────────────────────────────────────────────────────
   MOBILE MENU TOGGLE (Sidebar)
   ─────────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const backdrop = document.querySelector('.mobile-menu-backdrop');
  const body = document.body;

  if (!toggle || !menu || !backdrop) return;

  // Toggle menu open/close
  toggle.addEventListener('click', function() {
    const isOpen = menu.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking backdrop
  backdrop.addEventListener('click', closeMenu);

  // Close menu when clicking a link
  const navLinks = menu.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');
  navLinks.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  function openMenu() {
    menu.classList.add('is-open');
    backdrop.classList.add('is-open');
    toggle.classList.add('is-active');
    body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-label', 'Tutup menu');
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggle.classList.remove('is-active');
    body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-label', 'Buka menu');
  }
}

/* ───────────────────────────────────────────────────────────────
   SMOOTH SCROLL (Anchor Links)
   ─────────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');

  anchors.forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
      const targetPosition = target.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}