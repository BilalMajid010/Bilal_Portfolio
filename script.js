document.documentElement.classList.add('js');

/* ---------- Mobile nav ---------- */
const toggle = document.getElementById('navToggle');
const nav = document.getElementById('primaryNav');

function setNav(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
}
toggle.addEventListener('click', () => setNav(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.closest('a')) setNav(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setNav(false); });

/* ---------- Header shadow on scroll ---------- */
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Active link while scrolling ---------- */
const links = [...nav.querySelectorAll('a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));

    /* ---------- Reveal on scroll ---------- */
    const reveal = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));
} else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

/* ---------- Typing effect ---------- */
const typed = document.getElementById('typed');
const phrases = ['responsive websites', 'clean user interfaces', 'interactive web apps', 'things I\'m proud of'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {
    typed.textContent = phrases[0];
} else {
    let p = 0, i = 0, deleting = false;
    (function tick() {
        const word = phrases[p];
        typed.textContent = word.slice(0, i);
        let delay = deleting ? 40 : 85;
        if (!deleting && i === word.length) { deleting = true; delay = 1600; }
        else if (deleting && i === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 350; }
        i += deleting ? -1 : 1;
        setTimeout(tick, delay);
    })();
}

/* ---------- Contact form validation ---------- */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

const rules = {
    name:    v => v.trim().length >= 2 ? '' : 'Please enter your name.',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
    phone:   v => !v.trim() || /^[+\d][\d\s().-]{6,}$/.test(v.trim()) ? '' : 'Please enter a valid phone number.',
    message: v => v.trim().length >= 10 ? '' : 'Your message should be at least 10 characters.'
};

function validate(input) {
    const msg = rules[input.name](input.value);
    const field = input.closest('.field');
    field.classList.toggle('invalid', !!msg);
    field.querySelector('.error').textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
}

form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('blur', () => validate(el));
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('invalid')) validate(el); });
});

form.addEventListener('submit', e => {
    e.preventDefault();
    status.textContent = '';
    const inputs = [...form.querySelectorAll('input, textarea')];
    const results = inputs.map(validate);
    const firstBad = inputs[results.indexOf(false)];
    if (firstBad) { firstBad.focus(); return; }

    // No backend is connected yet. Hook this up to a service (Formspree, EmailJS, your own API)
    // by sending `new FormData(form)` here.
    status.textContent = 'Thanks! Your message is sent.';
    form.reset();
});

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
