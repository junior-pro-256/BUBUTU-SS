/* =========================================================
  BUBUTU SECONDARY SCHOOL — SITE SCRIPT
  Handles: hamburger/sidebar nav, active-link highlight,
  scroll-reveal animation, and contact form validation.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Hamburger / sidebar navigation ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var navLinks = document.querySelector('.nav-links');
  var overlay = document.querySelector('.nav-overlay');

  function openMenu () {
    navLinks.classList.add('is-open');
    overlay.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu () {
    navLinks.classList.remove('is-open');
    overlay.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (toggle && navLinks && overlay) {
    toggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // Reset drawer state if the viewport grows back to desktop size
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ---------- Highlight the current page in the nav ---------- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var rawHref = link.getAttribute('href');
    var href = rawHref.split('#')[0];
    // Skip in-page anchor links (e.g. "index.html#contact") so they
    // don't falsely light up alongside the real Home link.
    if (rawHref.indexOf('#') !== -1) return;
    if (href === currentPage) {
      link.classList.add('current');
    }
  });

  /* ---------- Scroll-reveal for sections/cards ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');

    var validators = {
      fullName: function (v) {
        return v.trim().length >= 3 ? '' : 'Please enter your full name.';
      },
      email: function (v) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(v.trim()) ? '' : 'Please enter a valid email address.';
      },
      contact: function (v) {
        var re = /^[0-9+\-\s()]{7,20}$/;
        return re.test(v.trim()) ? '' : 'Please enter a valid phone number.';
      },
      reason: function (v) {
        return v.trim().length >= 10 ? '' : 'Please tell us your reason for contacting us (10+ characters).';
      }
    };

    function showFieldError (fieldName, message) {
      var row = form.querySelector('[data-field="' + fieldName + '"]');
      var errorEl = row.querySelector('.form-error');
      if (message) {
        row.classList.add('has-error');
        errorEl.textContent = message;
      } else {
        row.classList.remove('has-error');
        errorEl.textContent = '';
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      var data = new FormData(form);
      var isValid = true;

      Object.keys(validators).forEach(function (fieldName) {
        var value = data.get(fieldName) || '';
        var message = validators[fieldName](value);
        showFieldError(fieldName, message);
        if (message) isValid = false;
      });

      if (!isValid) {
        status.classList.add('is-error');
        status.textContent = 'Please fix the highlighted fields and try again.';
        return;
      }

      // No backend is connected yet, so we confirm locally.
      // To go live: point this form at your backend/Formspree
      // endpoint and swap this block for a real fetch() call.
      status.classList.add('is-success');
      status.textContent = 'Thank you, ' + data.get('fullName').split(' ')[0] +
        '! Your message has been received. We will get back to you soon.';
      form.reset();
    });

    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('blur', function () {
        if (validators[el.name]) {
          showFieldError(el.name, validators[el.name](el.value));
        }
      });
    });
  }

});
