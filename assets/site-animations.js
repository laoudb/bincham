
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const revealTargets = document.querySelectorAll(
    '.hero .kicker, .hero h1, .hero .lead, .hero .hero-actions, .hero .pill-row, .hero .panel, .section .panel, .section .card, .section .detail-card, .section .service-card, .section .news-card, .section .step, .section .stat, .section .profile-card, .section .contact-box, .section .alert, .section .success, .section .cta-strip, .band .quote, .band .panel, table'
  );

  revealTargets.forEach((el, index) => {
    el.setAttribute('data-reveal', '');
    el.style.transitionDelay = `${Math.min(index * 35, 260)}ms`;
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 18);
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

  const desktopMenu = document.querySelector('.menu');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const panel = document.querySelector('.mobile-menu-panel');
  const closeBtn = document.querySelector('.mobile-menu-close');
  const mobileNav = document.querySelector('.mobile-menu-nav');

  if (!desktopMenu || !toggle || !panel || !closeBtn || !mobileNav) return;

  const links = [...desktopMenu.querySelectorAll('a')]
    .map((a) => ({
      href: a.getAttribute('href') || '#',
      text: (a.textContent || '').trim(),
      active: a.classList.contains('active')
    }))
    .filter((item) => item.text);

  mobileNav.innerHTML = links
    .map((item) => `<a href="${item.href}"${item.active ? ' class="active"' : ''}>${item.text}</a>`)
    .join('');

  const openMenu = () => {
    document.body.classList.add('mobile-menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
  };

  const closeMenu = () => {
    document.body.classList.remove('mobile-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    toggle.focus();
  };

  toggle.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  panel.addEventListener('click', (event) => {
    if (event.target === panel) closeMenu();
  });
  mobileNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (!document.body.classList.contains('mobile-menu-open')) return;
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) {
      document.body.classList.remove('mobile-menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
    }
  });
});
