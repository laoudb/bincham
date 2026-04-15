
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const revealTargets = document.querySelectorAll(
    '.hero .kicker, .hero h1, .hero .lead, .hero .hero-actions, .hero .pill-row, .hero .panel, .section .panel, .section .card, .section .detail-card, .section .service-card, .section .news-card, .section .step, .section .stat, .section .profile-card, .section .contact-box, .section .alert, .section .success, .section .cta-strip, .band .quote, .band .panel, table'
  );

  revealTargets.forEach((el, index) => {
    el.setAttribute('data-reveal', '');
    el.style.transitionDelay = `${Math.min(index * 35, 260)}ms`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach((el) => io.observe(el));

  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 18) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const tiltTargets = document.querySelectorAll('.service-card, .detail-card, .news-card, .profile-card, .contact-box, .mini-card, .stat, .step');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    tiltTargets.forEach((card) => {
      card.setAttribute('data-tilt', '');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 5;
        const ry = (px - 0.5) * 7;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  const hero = document.querySelector('.hero');
  if (hero && !prefersReducedMotion) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty('--hero-shift-x', `${x * 10}px`);
      hero.style.setProperty('--hero-shift-y', `${y * 10}px`);
      hero.style.backgroundPosition = `${50 + x * 2}% ${50 + y * 2}%`;
    });
  }
});
