const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

const setActive = () => {
  let current = '';
  sections.forEach(section => {
    const top = window.scrollY;
    const offset = section.offsetTop - 120;
    const height = section.offsetHeight;
    if (top >= offset && top < offset + height) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', setActive);
setActive();
