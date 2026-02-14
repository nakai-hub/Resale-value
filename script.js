(function () {
  'use strict';

  const header = document.getElementById('header');
  let lastScrollY = window.scrollY;
  const scrollThreshold = 80;

  // Header: hide on scroll down, show on scroll up
  function onScroll() {
    const y = window.scrollY;
    if (y <= 60) {
      header.classList.remove('hidden');
      return;
    }
    if (y > lastScrollY && y > scrollThreshold) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    lastScrollY = y;
  }

  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Intersection Observer for [data-inview]
  const inviewOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: [0, 0.1, 0.25, 0.5]
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('inview');
        // Optional: unobserve after once
        // observer.unobserve(entry.target);
      }
    });
  }, inviewOptions);

  document.querySelectorAll('[data-inview]').forEach(function (el) {
    observer.observe(el);
  });

  // Hero: when hero section is in view, trigger title/cta animation (they use .inview too)
  const hero = document.getElementById('hero');
  if (hero) {
    const heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          hero.querySelectorAll('.hero-label, .hero-title, .hero-desc, .hero-cta').forEach(function (child) {
            child.classList.add('inview');
          });
        }
      });
    }, { threshold: 0.2 });
    heroObserver.observe(hero);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // Mobile menu toggle
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('open');
      document.body.classList.toggle('menu-open', !expanded);
    });
  }
})();
