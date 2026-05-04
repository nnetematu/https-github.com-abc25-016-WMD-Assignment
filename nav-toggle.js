document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('nav ul li a');

  if (!nav || !navToggle) return;

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
});
