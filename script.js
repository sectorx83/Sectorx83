(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.querySelector('.page-progress span');
  const navLinks = [...document.querySelectorAll('nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
  const revealTargets = document.querySelectorAll('.section-heading, .project-card, .about-layout, .stack-list > div, .contact-section, .all-projects');
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    if (element.classList.contains('project-card')) element.dataset.delay = String((index % 2) + 1);
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -45px 0px' });
    revealTargets.forEach(element => observer.observe(element));
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    }), { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  } else {
    revealTargets.forEach(element => element.classList.add('is-visible'));
  }
  document.querySelectorAll('.project-card').forEach(card => card.addEventListener('pointermove', event => {
    if (reduceMotion || event.pointerType === 'touch') return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', (event.clientX - rect.left) + 'px');
    card.style.setProperty('--my', (event.clientY - rect.top) + 'px');
  }));
  const art = document.querySelector('.hero-art');
  if (art && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    art.addEventListener('pointermove', event => {
      const rect = art.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      art.style.transform = 'rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 5) + 'deg)';
    });
    art.addEventListener('pointerleave', () => { art.style.transform = ''; });
  }
})();