/* ===================================
   RUSTOMJEE OZONE PHASE 2 – SCRIPT.JS
   =================================== */

// ==================== AOS INIT ====================
document.addEventListener('DOMContentLoaded', function () {
  AOS.init({
    duration: 700,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
  });
});

// ==================== NAVBAR SCROLL ====================
const navbar = document.getElementById('mainNavbar');
window.addEventListener('scroll', function () {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  toggleBackToTop();
});

// ==================== SMOOTH SCROLL FOR NAV LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 85;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      // Close mobile menu
      const navCollapse = document.getElementById('navMenu');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    }
  });
});

// ==================== HIGHLIGHTS SWIPER ====================
new Swiper('.highlights-swiper', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: { delay: 3500, disableOnInteraction: false },
  pagination: {
    el: '.highlights-pagination',
    clickable: true,
  },
  navigation: {
    prevEl: '.highlights-prev',
    nextEl: '.highlights-next',
  },
  breakpoints: {
    576: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
  },
});

// ==================== AMENITY SWIPER ====================
new Swiper('.amenity-swiper', {
  slidesPerView: 1.15,
  spaceBetween: 20,
  loop: true,
  autoplay: { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
  pagination: {
    el: '.amenity-pagination',
    clickable: true,
  },
  navigation: {
    prevEl: '.amenity-prev',
    nextEl: '.amenity-next',
  },
  breakpoints: {
    576:  { slidesPerView: 1.5, spaceBetween: 20 },
    768:  { slidesPerView: 2.2, spaceBetween: 22 },
    1024: { slidesPerView: 3, spaceBetween: 24 },
    1280: { slidesPerView: 3.5, spaceBetween: 24 },
  },
});

// ==================== COUNTER ANIMATION ====================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  });
}

// Trigger counter when stats bar enters view
const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(statsBar);
}

// ==================== FLOATING PARTICLES ====================
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 12 : 22;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 4 + 2) + 'px';
    particle.style.height = particle.style.width;
    particle.style.opacity = Math.random() * 0.4 + 0.1;
    particle.style.animationDuration = (Math.random() * 12 + 8) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(particle);
  }
}
createParticles();

// ==================== FORM HANDLER ====================
function handleForm(event, formId) {
  event.preventDefault();
  const form = document.getElementById(formId);
  const btn = form.querySelector('button[type="submit"]');

  // Validate phone number
  const phoneInput = form.querySelector('input[type="tel"]');
  if (phoneInput) {
    const phone = phoneInput.value.replace(/\D/g, '');
    if (phone.length < 10) {
      showToast('Please enter a valid 10-digit phone number.', 'error');
      return;
    }
  }

  // Show loading
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
  btn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    form.reset();

    // Show success modal
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
  }, 1800);
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'info') {
  const existing = document.querySelector('.luxury-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'luxury-toast';
  toast.style.cssText = `
    position: fixed; top: 100px; right: 20px; z-index: 99999;
    background: ${type === 'error' ? 'rgba(220,38,38,0.95)' : 'rgba(69,26,3,0.97)'};
    border: 1px solid ${type === 'error' ? 'rgba(220,38,38,0.5)' : 'rgba(245,158,11,0.5)'};
    color: #fff; padding: 14px 20px; border-radius: 12px;
    font-size: 14px; font-weight: 500; max-width: 320px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    backdrop-filter: blur(10px);
    animation: slideInRight 0.3s ease;
    display: flex; align-items: center; gap: 10px;
  `;
  toast.innerHTML = `
    <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"
       style="color: ${type === 'error' ? '#ff6b6b' : '#F59E0B'}; font-size: 18px;"></i>
    ${message}
  `;

  // Add keyframe
  if (!document.getElementById('toastKeyframes')) {
    const style = document.createElement('style');
    style.id = 'toastKeyframes';
    style.textContent = `@keyframes slideInRight { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==================== BACK TO TOP ====================
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn?.classList.add('show');
  } else {
    backToTopBtn?.classList.remove('show');
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== MOBILE STICKY BAR ====================
function handleMobileStickyBar() {
  if (window.innerWidth < 992) {
    document.body.classList.add('has-mobile-bar');
  } else {
    document.body.classList.remove('has-mobile-bar');
  }
}
handleMobileStickyBar();
window.addEventListener('resize', handleMobileStickyBar);

// ==================== ACTIVE NAV LINK ON SCROLL ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');

window.addEventListener('scroll', () => {
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
});

// ==================== PHONE INPUT FORMATTER ====================
document.querySelectorAll('input[type="tel"]').forEach(input => {
  input.addEventListener('input', function () {
    let val = this.value.replace(/\D/g, '');
    if (val.length > 10) val = val.slice(0, 10);
    this.value = val;
  });
});

// ==================== LAZY IMAGE OBSERVER ====================
const images = document.querySelectorAll('img[loading="lazy"]');
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imgObserver.unobserve(img);
      }
    });
  });
  images.forEach(img => imgObserver.observe(img));
}

// ==================== HIGHLIGHT CARD GLOW ON HOVER ====================
document.querySelectorAll('.highlight-card, .config-card, .landmark-card, .payment-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(245,158,11,0.08) 0%, rgba(255,255,255,0.03) 60%)`;
  });

  card.addEventListener('mouseleave', function () {
    this.style.background = '';
  });
});

// ==================== CONSOLE BRAND ====================
console.log(
  '%c🏙 RUSTOMJEE OZONE PHASE 2 %c\n%cGoregaon West | Ultra-Luxury High-Rise',
  'background: linear-gradient(135deg, #451A03, #9A3412); color: #F59E0B; padding: 8px 16px; font-size: 16px; font-weight: bold; border-radius: 4px 4px 0 0;',
  '',
  'color: #9A3412; font-size: 12px;'
);
