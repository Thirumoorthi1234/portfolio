// ═══════════════════════════════════════════════════
// ── GEOMETRIC BACKGROUND ANIMATION ──
// ═══════════════════════════════════════════════════
(function () {
  const canvas = document.getElementById('geo-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Palette — matches the original yellow/blue theme
  const COLORS = ['#6082b6', '#4a6fa5', '#1e2d4a', '#6082b6', '#8aaad4'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---- helpers ---- */
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function pickColor(a) {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    return hexToRgba(c, a);
  }
  function hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  /* ---- draw primitives ---- */
  function drawTriangle(x, y, size, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.866, size * 0.5);
    ctx.lineTo(-size * 0.866, size * 0.5);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function drawHexagon(x, y, size, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      const px = size * Math.cos(a);
      const py = size * Math.sin(a);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function drawDiamond(x, y, size, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.6, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.6, 0);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function drawCircleOutline(x, y, size, color) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  /* ---- dot grid ---- */
  function drawDotGrid() {
    const spacing = 60;
    const dotR = 1.2;
    ctx.fillStyle = 'rgba(96,130,182,0.18)';
    for (let x = spacing / 2; x < canvas.width; x += spacing) {
      for (let y = spacing / 2; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /* ---- particle/shape system ---- */
  const SHAPES = [];
  const SHAPE_COUNT = 28;

  function createShape() {
    const types = ['triangle', 'hexagon', 'diamond', 'circle'];
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      type,
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      size: rand(14, 42),
      angle: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.004, 0.004),
      vx: rand(-0.18, 0.18),
      vy: rand(-0.18, 0.18),
      color: pickColor(rand(0.12, 0.30)),
    };
  }

  for (let i = 0; i < SHAPE_COUNT; i++) SHAPES.push(createShape());

  /* ---- connecting lines between close shapes ---- */
  function drawConnections() {
    const maxDist = 180;
    for (let i = 0; i < SHAPES.length; i++) {
      for (let j = i + 1; j < SHAPES.length; j++) {
        const dx = SHAPES[i].x - SHAPES[j].x;
        const dy = SHAPES[i].y - SHAPES[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.09;
          ctx.beginPath();
          ctx.moveTo(SHAPES[i].x, SHAPES[i].y);
          ctx.lineTo(SHAPES[j].x, SHAPES[j].y);
          ctx.strokeStyle = `rgba(96,130,182,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  /* ---- main loop ---- */
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Static dot grid
    drawDotGrid();

    // Connections
    drawConnections();

    // Animate & draw shapes
    SHAPES.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.angle += s.rotSpeed;

      // Wrap around edges
      if (s.x < -50) s.x = canvas.width + 50;
      if (s.x > canvas.width + 50) s.x = -50;
      if (s.y < -50) s.y = canvas.height + 50;
      if (s.y > canvas.height + 50) s.y = -50;

      switch (s.type) {
        case 'triangle': drawTriangle(s.x, s.y, s.size, s.angle, s.color); break;
        case 'hexagon': drawHexagon(s.x, s.y, s.size, s.angle, s.color); break;
        case 'diamond': drawDiamond(s.x, s.y, s.size, s.angle, s.color); break;
        case 'circle': drawCircleOutline(s.x, s.y, s.size, s.color); break;
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
})();

// ═══════════════════════════════════════════════════

const projects = [

  {
    title: "BMI Calculator",
    desc: "An easy-to-navigate platform for calculating Body Mass Index (BMI), an essential metric for evaluating if an individual's weight is suitable for their height. Users simply enter their height and weight to swiftly obtain their BMI value, along with an interpretation indicating whether they are underweight, within a healthy weight range, overweight, or classified as obese.",
    tags: ["HTML", "CSS", "JavaScript", "Netlify"],
    slides: ["⚖️", "📊", "💪"],
    demo: "https://bmicalculator-thiru.netlify.app/",
    github: "https://github.com/Thirumoorthi1234"
  },
  {
    title: "Full Stack Training Platform",
    desc: "Academic training program delivered to undergraduate students at Hindustan Arts and Science College, covering the complete MERN stack. Real-time projects, assessments, and hands-on workshops helped bridge the gap between academic learning and industry expectations.",
    tags: ["React.js", "Node.js", "MongoDB", "Express.js", "Git"],
    slides: ["🎓", "📚", "💡"],
    demo: null,
    github: "https://github.com/Thirumoorthi1234"
  },
  {
    title: "Portfolio Website",
    desc: "A premium, fully responsive personal portfolio website featuring dark/light mode toggle, smooth scroll animations, modal project showcases, contact form with validation, and an elegant visual identity. Built from scratch with pure HTML, CSS, and JavaScript.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    slides: ["🌐", "🎨", "✨"],
    demo: null,
    github: "https://github.com/Thirumoorthi1234"
  }
];

// ── SCROLL PROGRESS BAR ──
const scrollProgress = document.getElementById('scroll-progress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}

// ── CUSTOM CURSOR ──
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor hover effect on interactive elements
document.querySelectorAll('a, button, .project-card, .skill-cat, .stat-item, .value-chip, .edu-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity = '1';
  cursorRing.style.opacity = '1';
});



// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  updateScrollProgress();
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  // active links
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', top < 150 && top > -sec.offsetHeight + 150);
  });
});

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mm-link').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── MODAL ──
const overlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTags = document.getElementById('modalTags');
const modalLinks = document.getElementById('modalLinks');
const carouselCounter = document.getElementById('carouselCounter');
let currentSlide = 0;
let slides = [];

function openModal(idx) {
  const p = projects[idx];
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.desc;
  modalTags.innerHTML = p.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
  modalLinks.innerHTML = '';
  if (p.demo) modalLinks.innerHTML += `<a href="${p.demo}" target="_blank" class="btn-primary" style="font-size:0.85rem;padding:0.6rem 1.4rem;">Live Demo ↗</a>`;
  if (p.github) modalLinks.innerHTML += `<a href="${p.github}" target="_blank" class="btn-secondary" style="font-size:0.85rem;padding:0.6rem 1.4rem;">GitHub ↗</a>`;

  const slideEls = [document.getElementById('slide0'), document.getElementById('slide1'), document.getElementById('slide2')];
  slideEls.forEach((el, i) => { el.textContent = p.slides[i] || ''; });
  slides = p.slides;
  currentSlide = 0;
  updateCarousel();

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function updateCarousel() {
  [document.getElementById('slide0'), document.getElementById('slide1'), document.getElementById('slide2')].forEach((el, i) => {
    el.classList.toggle('active', i === currentSlide);
  });
  carouselCounter.textContent = `${currentSlide + 1} / ${slides.length}`;
}

document.getElementById('carouselPrev').addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateCarousel();
});
document.getElementById('carouselNext').addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarousel();
});

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => openModal(+card.dataset.project));
  card.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(+card.dataset.project); });
  card.setAttribute('tabindex', '0');
});

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (overlay.classList.contains('open')) {
    if (e.key === 'ArrowLeft') { currentSlide = (currentSlide - 1 + slides.length) % slides.length; updateCarousel(); }
    if (e.key === 'ArrowRight') { currentSlide = (currentSlide + 1) % slides.length; updateCarousel(); }
  }
});

// ── SWIPE SUPPORT ──
let touchStartX = 0;
document.getElementById('modalCarousel').addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
document.getElementById('modalCarousel').addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    currentSlide = diff > 0 ? (currentSlide + 1) % slides.length : (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
  }
});

// ── EMAILJS SETUP ──
// ⚠️  FILL IN YOUR 3 IDs BELOW (see README steps):
//  1. https://www.emailjs.com → Sign up → Add Email Service (Gmail) → copy Service ID
//  2. Create Email Template with {{from_name}}, {{from_email}}, {{message}} → copy Template ID
//  3. Account → API Keys → copy Public Key
const EMAILJS_PUBLIC_KEY = 'xJxGAWYvV4U4Xx-Lo';   // e.g. 'aBcDeFgHiJ'
const EMAILJS_SERVICE_ID = 'service_xwekdvc';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_rqukwke';  // ✅ correct template ID

emailjs.init(EMAILJS_PUBLIC_KEY);

// ── CONTACT FORM ──
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  let valid = true;
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const msgEl = document.getElementById('message');
  const btn = this.querySelector('.submit-btn');
  const success = document.getElementById('formSuccess');

  // Clear previous state
  document.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
  success.classList.remove('show');

  // Validate
  if (!nameEl.value.trim()) { document.getElementById('nameErr').classList.add('show'); valid = false; }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(emailEl.value)) { document.getElementById('emailErr').classList.add('show'); valid = false; }
  if (!msgEl.value.trim()) { document.getElementById('msgErr').classList.add('show'); valid = false; }
  if (!valid) return;

  // Loading state
  const originalText = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  // Inject current time for {{time}} template variable
  let timeInput = this.querySelector('input[name="time"]');
  if (!timeInput) {
    timeInput = document.createElement('input');
    timeInput.type = 'hidden';
    timeInput.name = 'time';
    this.appendChild(timeInput);
  }
  timeInput.value = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  // sendForm reads the form's name="" attributes directly — no variable mismatch possible
  emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
    .then(() => {
      success.textContent = '✓ Message sent! I\'ll get back to you soon.';
      success.style.cssText = 'display:block; background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.3); color:#16a34a; border-radius:12px; padding:1rem; text-align:center; font-size:0.875rem;';
      success.classList.add('show');
      this.reset();
      setTimeout(() => success.classList.remove('show'), 6000);
    })
    .catch(err => {
      console.error('EmailJS error status:', err.status, '| text:', err.text);
      success.textContent = '✗ Failed to send. Please email thirugst7@gmail.com directly.';
      success.style.cssText = 'display:block; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#dc2626; border-radius:12px; padding:1rem; text-align:center; font-size:0.875rem;';
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 8000);
    })
    .finally(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '';
    });
});

// ── SCROLL ANIMATIONS (IntersectionObserver) ──
const animObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Don't unobserve — keep visible once shown
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in').forEach(el => animObserver.observe(el));

// ── STAGGERED CHILDREN DELAY ──
// Give each child inside grids a small delay for a wave effect
document.querySelectorAll('.skills-grid, .projects-grid, .edu-list').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.transitionDelay = (i * 0.12) + 's';
  });
});

// ── COUNTER ANIMATION for stat numbers ──
function animateCounter(el, target, suffix) {
  const isFloat = target % 1 !== 0;
  const duration = 1500;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = eased * target;
    el.textContent = isFloat ? current.toFixed(1) + suffix : Math.floor(current) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Observe stat numbers
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const raw = el.textContent.trim();
      if (raw === '∞') return;
      const num = parseFloat(raw);
      const suffix = raw.replace(/[\d.]/g, '');
      if (!isNaN(num)) animateCounter(el, num, suffix);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

// ── TILT EFFECT on hero card ──
const heroCard = document.querySelector('.hero-card');
if (heroCard) {
  heroCard.addEventListener('mousemove', e => {
    const rect = heroCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroCard.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-10px)`;
  });
  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = '';
  });
}
