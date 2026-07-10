/* ============================================================
   NextCV – Landing Page Scripts
   Author: Empire Softtech
   ============================================================ */

'use strict';

/* ── Sticky header ────────────────────────────────────────── */
const header = document.getElementById('header');

function handleScroll() {
  const scrolled = window.scrollY > 50;
  header.classList.toggle('scrolled', scrolled);

  // back-to-top visibility
  backToTop.classList.toggle('visible', window.scrollY > 400);

  // active nav link highlighting
  highlightNavLink();
}

window.addEventListener('scroll', handleScroll, { passive: true });

/* ── Mobile nav toggle ───────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a link is clicked
navMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (!header.contains(e.target)) {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ── Active nav link ─────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

function highlightNavLink() {
  // No scroll-spy sections on this page (e.g. templates.html/template.html) —
  // leave whichever nav link is already marked active (server-rendered for
  // the current page) alone instead of clearing it.
  if (!sections.length) return;

  const scrollMid = window.scrollY + window.innerHeight / 3;
  let current = '';
  sections.forEach(sec => {
    if (sec.offsetTop <= scrollMid) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ── Animated counters ───────────────────────────────────── */
function animateCounter(el) {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const step = 16;
  const steps = duration / step;
  const increment = target / steps;
  let current = 0;

  const tick = () => {
    current = Math.min(current + increment, target);
    el.textContent = (target >= 1000
      ? Math.round(current).toLocaleString()
      : Math.round(current)) + suffix;
    if (current < target) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

// Trigger counters when stats section enters viewport
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

/* ── Scroll-reveal animation ─────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = Array.from(entry.target.parentElement.children)
        .filter(el => el.classList.contains('reveal'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Generic slider engine (screenshots + templates) ─────── */
function initSlider({ trackId, prevId, nextId, dotsId, autoSlideMs = 4000 }) {
  const track         = document.getElementById(trackId);
  const prevBtn       = document.getElementById(prevId);
  const nextBtn       = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);

  if (!track || !track.children.length) return;

  const slides = Array.from(track.children);
  let current  = 0;
  let autoSlideTimer;

  // How many slides are visible at once (responsive)
  function getVisible() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function totalPositions() {
    return Math.max(0, slides.length - getVisible());
  }

  // Build dots
  function buildDots() {
    dotsContainer.innerHTML = '';
    const count = totalPositions() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.setAttribute('role', 'tab');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, totalPositions()));

    // Calculate slide width including gap
    const slideEl  = slides[0];
    const style    = getComputedStyle(track);
    const gap      = parseFloat(style.gap) || 32;
    const slideW   = slideEl.offsetWidth + gap;

    track.style.transform = `translateX(-${current * slideW}px)`;

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= totalPositions();
    updateDots();
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoSlide(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoSlide(); });

  // Auto-advance
  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      goTo(current >= totalPositions() ? 0 : current + 1);
    }, autoSlideMs);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAutoSlide();
    }
  }, { passive: true });

  // Rebuild on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(Math.min(current, totalPositions()));
    }, 200);
  });

  // Init
  buildDots();
  goTo(0);
  startAutoSlide();
}

initSlider({ trackId: 'sliderTrack', prevId: 'sliderPrev', nextId: 'sliderNext', dotsId: 'sliderDots' });
initSlider({ trackId: 'tmplSliderTrack', prevId: 'tmplSliderPrev', nextId: 'tmplSliderNext', dotsId: 'tmplSliderDots' });

/* ── FAQ accordion ───────────────────────────────────────── */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn    = item.querySelector('.faq-q');
  const answer = item.querySelector('.faq-a');
  const inner  = item.querySelector('.faq-a-inner');

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      openItem.querySelector('.faq-a').style.maxHeight = '0';
    });

    // Open this one (if it was closed)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = inner.scrollHeight + 'px';
    }
  });
});

/* ── ATS ring animation ──────────────────────────────────── */
const atsSection = document.querySelector('.ats-section');
if (atsSection) {
  const atsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      // bars animate via CSS; ring fill already set via stroke-dashoffset
      atsSection.querySelectorAll('.ats-bar-fill').forEach((fill, i) => {
        fill.style.animationDelay = `${i * 0.15}s`;
      });
      atsObserver.unobserve(atsSection);
    }
  }, { threshold: 0.2 });
  atsObserver.observe(atsSection);
}

/* ── Smooth scroll for anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 80; // header height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Back to top ─────────────────────────────────────────── */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Template card hover effect ─────────────────────────── */
document.querySelectorAll('.tmpl-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'all 0.25s ease';
  });
});

/* ── Keyboard accessibility for FAQ ─────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

/* ── Init ────────────────────────────────────────────────── */
handleScroll();
