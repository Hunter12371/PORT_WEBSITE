/* ===================================================================
   ALEX MERCER — Main JavaScript
   Interactions, animations, cursor, mega-menu, scroll-driven effects
   =================================================================== */

(function() {
  'use strict';

  // -------- DOM CACHE --------
  const loader       = document.getElementById('loader');
  const cursor       = document.getElementById('cursor');
  const cursorFollow = document.getElementById('cursor-follower');
  const navbar       = document.getElementById('navbar');
  const megaMenu     = document.getElementById('mega-menu');
  const hamburger    = document.getElementById('hamburger-btn');
  const megaClose    = document.getElementById('mega-close-btn');
  const heroParticles= document.getElementById('hero-particles');
  const narrativeWrap= document.getElementById('narrative-wrapper');
  const narrativeTrack=document.getElementById('narrative-track');

  // -------- LOADING SCREEN --------
  function hideLoader() {
    if (loader) {
      loader.classList.add('loaded');
      document.body.style.overflow = '';
    }
  }
  // Block scroll during loading
  document.body.style.overflow = 'hidden';
  window.addEventListener('load', function() {
    setTimeout(hideLoader, 2700);
  });
  // Fallback - force hide after 5s
  setTimeout(hideLoader, 5000);

  // -------- CUSTOM CURSOR --------
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    // Lerp for smooth following
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    followerX += (mouseX - followerX) * 0.08;
    followerY += (mouseY - followerY) * 0.08;

    if (cursor) {
      cursor.style.left = cursorX + 'px';
      cursor.style.top  = cursorY + 'px';
    }
    if (cursorFollow) {
      cursorFollow.style.left = followerX + 'px';
      cursorFollow.style.top  = followerY + 'px';
    }

    requestAnimationFrame(updateCursor);
  }

  // Only run cursor on non-touch devices
  if (window.matchMedia('(pointer: fine)').matches) {
    requestAnimationFrame(updateCursor);

    // Single delegated listener — avoids per-child mouseleave/enter flicker
    var HOVER_SEL = 'a, button, .helmet-card, .product-card, .contact-info-card, .split-panel, .calendar-item';
    document.addEventListener('mouseover', function(e) {
      document.body.classList.toggle('cursor-hover', !!e.target.closest(HOVER_SEL));
    });
  }

  // -------- NAVBAR SCROLL --------
  let lastScroll = 0;
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // -------- MEGA MENU TOGGLE --------
  function openMega() {
    megaMenu.classList.add('open');
    megaMenu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMega() {
    megaMenu.classList.remove('open');
    megaMenu.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', function() {
    if (megaMenu.classList.contains('open')) {
      closeMega();
    } else {
      openMega();
    }
  });

  if (megaClose) megaClose.addEventListener('click', closeMega);

  // Close mega on link click
  document.querySelectorAll('.mega-link').forEach(function(link) {
    link.addEventListener('click', function() {
      closeMega();
    });
  });

  // Desktop: hover on nav-links area to show mega
  // On desktop, clicking hamburger (hidden) is covered; instead use specific trigger
  const navLinksContainer = document.querySelector('.nav-links');
  if (navLinksContainer && window.matchMedia('(min-width: 769px)').matches) {
    // Show mega-menu on any nav link hover with a slight delay
    let megaTimeout;
    navLinksContainer.addEventListener('mouseenter', function() {
      clearTimeout(megaTimeout);
      megaTimeout = setTimeout(function() {
        openMega();
      }, 300);
    });
    navLinksContainer.addEventListener('mouseleave', function() {
      clearTimeout(megaTimeout);
    });
  }

  // ESC to close mega menu
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && megaMenu.classList.contains('open')) {
      closeMega();
    }
  });

  // -------- HERO PARTICLES --------
  function createParticles() {
    if (!heroParticles) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top  = (60 + Math.random() * 40) + '%';
      p.style.width = (1 + Math.random() * 2) + 'px';
      p.style.height = p.style.width;
      p.style.animationDelay = (Math.random() * 8) + 's';
      p.style.animationDuration = (6 + Math.random() * 6) + 's';
      heroParticles.appendChild(p);
    }
  }
  createParticles();

  // -------- GLOBAL POINTER LIGHT --------
  function initPointerLight() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const rootStyle = document.documentElement.style;
    document.addEventListener('mousemove', function(e) {
      rootStyle.setProperty('--mouse-x', e.clientX + 'px');
      rootStyle.setProperty('--mouse-y', e.clientY + 'px');
    });
  }
  initPointerLight();

  // -------- 3D TILT CARDS --------
  function initTiltCards() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tiltTargets = document.querySelectorAll(
      '.split-panel, .helmet-card, .product-card, .contact-form-card, .contact-info-card, .calendar-item'
    );

    tiltTargets.forEach(function(card) {
      card.classList.add('tilt-card');

      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 10;
        const rotateX = (0.5 - py) * 9;

        card.style.setProperty('--ry', rotateY.toFixed(2) + 'deg');
        card.style.setProperty('--rx', rotateX.toFixed(2) + 'deg');
        card.style.setProperty('--mx', (px * 100).toFixed(2) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(2) + '%');
      });

      card.addEventListener('mouseleave', function() {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
      });
    });
  }
  initTiltCards();

  // -------- SCROLL-TRIGGERED FADE-INS --------
  function initFadeIns() {
    const fadeEls = document.querySelectorAll('.fade-in');
    if (!fadeEls.length) return;

    try {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
            setTimeout(function() {
              entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      fadeEls.forEach(function(el) {
        observer.observe(el);
      });
    } catch (error) {
      console.error('Error initializing fade-ins:', error);
    }
  }
  // Init after loader hides
  setTimeout(initFadeIns, 2200);

  // -------- HORIZONTAL SCROLL for NARRATIVE --------
  function initHorizontalScroll() {
    if (!narrativeWrap || !narrativeTrack) return;
    
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded yet, retrying...');
      setTimeout(initHorizontalScroll, 200);
      return;
    }

    try {
      gsap.registerPlugin(ScrollTrigger);

      const trackWidth = narrativeTrack.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = trackWidth - viewportWidth;

      if (scrollDistance <= 0) return; // Not enough content

      // Clear any existing ScrollTriggers for this element
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === narrativeWrap) {
          trigger.kill();
        }
      });

      // Pin the section and scrub horizontal
      gsap.to(narrativeTrack, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: narrativeWrap,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => '+=' + scrollDistance,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onRefresh: () => {
            // Recalculate on window resize
            const newScrollDistance = narrativeTrack.scrollWidth - window.innerWidth;
            return newScrollDistance;
          }
        }
      });
    } catch (error) {
      console.error('Error initializing horizontal scroll:', error);
    }
  }
  
  // Init GSAP after a short delay to let fonts/content load
  window.addEventListener('load', function() {
    setTimeout(initHorizontalScroll, 2500);
  });
  
  // Refresh on window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 250);
  });

  // -------- HELMET CARD HOVER (touch fallback) --------
  document.querySelectorAll('.helmet-card').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      this.classList.add('hovered');
    });
    card.addEventListener('mouseleave', function() {
      this.classList.remove('hovered');
    });
    // Touch: toggle on tap
    card.addEventListener('touchstart', function(e) {
      e.preventDefault();
      this.classList.toggle('hovered');
    }, { passive: false });
  });

  // -------- SMOOTH SCROLL for ANCHOR LINKS --------
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        // Close mega menu if open
        if (megaMenu.classList.contains('open')) closeMega();

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // -------- ACTIVE NAV LINK on SCROLL --------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;
    sections.forEach(function(section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // -------- PAGE TRANSITION EFFECT --------
  // Disabled for hash links but keeping the visual overlay available
  const pageTransition = document.getElementById('page-transition');
  // (Uncomment below if you want wipe effect on real page navigations)
  // document.querySelectorAll('a:not([href^="#"])').forEach(function(link) {
  //   link.addEventListener('click', function(e) {
  //     e.preventDefault();
  //     pageTransition.classList.add('active');
  //     setTimeout(function() { window.location = link.href; }, 600);
  //   });
  // });

  // -------- PARALLAX on HERO NUMBER --------
  const heroNumber = document.querySelector('.hero-number');
  if (heroNumber && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function(e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      heroNumber.style.transform = 'translateY(-50%) translate(' + x + 'px, ' + y + 'px)';
    });
  }

  // -------- 3D MAGNETIC TILT ON ALL CARDS --------
  function enable3DTilt(selector, options) {
    const cfg = Object.assign({
      maxRotateX: 10,
      maxRotateY: 12,
      perspective: 1000,
      speed: 0.09
    }, options);

    document.querySelectorAll(selector).forEach(function(el) {
      var cachedRect = null;  // snapshot ONCE on enter — never re-query during move
      var rafId = null;
      var tRX = 0, tRY = 0; // targets
      var cRX = 0, cRY = 0; // current lerped values

      function frame() {
        rafId = null;
        cRX += (tRX - cRX) * cfg.speed;
        cRY += (tRY - cRY) * cfg.speed;
        el.style.transform =
          'perspective(' + cfg.perspective + 'px) ' +
          'rotateX(' + cRX.toFixed(3) + 'deg) ' +
          'rotateY(' + cRY.toFixed(3) + 'deg)';
        // Keep running only while there's meaningful delta
        if (Math.abs(tRX - cRX) > 0.02 || Math.abs(tRY - cRY) > 0.02) {
          rafId = requestAnimationFrame(frame);
        }
      }

      el.addEventListener('mouseenter', function() {
        // Clear any outgoing transition and snapshot pre-transform rect
        el.style.transition = 'none';
        el.style.transform = '';
        // getBoundingClientRect BEFORE any scale/rotate so center is accurate
        cachedRect = el.getBoundingClientRect();
      });

      el.addEventListener('mousemove', function(e) {
        if (!cachedRect) return;
        var hw = cachedRect.width  * 0.5;
        var hh = cachedRect.height * 0.5;
        // Clamp to [-1, 1] so edges don't over-rotate
        var dx = Math.max(-1, Math.min(1, (e.clientX - cachedRect.left  - hw) / hw));
        var dy = Math.max(-1, Math.min(1, (e.clientY - cachedRect.top   - hh) / hh));
        tRY =  dx * cfg.maxRotateY;
        tRX = -dy * cfg.maxRotateX;
        if (!rafId) rafId = requestAnimationFrame(frame);
      });

      el.addEventListener('mouseleave', function() {
        cachedRect = null;
        tRX = 0; tRY = 0;
        cRX = 0; cRY = 0;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        // CSS transition handles the smooth return — no RAF needed
        el.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)';
        el.style.transform   = '';
        setTimeout(function() { el.style.transition = ''; }, 580);
      });
    });
  }

  // Apply 3D tilt to all interactive cards
  if (window.matchMedia('(pointer: fine)').matches) {
    enable3DTilt('.split-panel',       { maxRotateX: 7,  maxRotateY: 9  });
    enable3DTilt('.helmet-card',       { maxRotateX: 9,  maxRotateY: 11 });
    enable3DTilt('.contact-info-card', { maxRotateX: 7,  maxRotateY: 9  });
    enable3DTilt('.product-card',      { maxRotateX: 7,  maxRotateY: 9  });
    enable3DTilt('.calendar-item',     { maxRotateX: 4,  maxRotateY: 6  });
  }

  // -------- 3D HERO MOUSE PARALLAX --------
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function(e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      heroContent.style.transform =
        'perspective(1200px) rotateY(' + x + 'deg) rotateX(' + (-y) + 'deg)';
    });
  }

  // -------- SVG SIGNATURE RE-ANIMATION on SCROLL --------
  const sigPaths = document.querySelectorAll('.sig-path, .sig-path-2');
  const sigObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'none';
        // Trigger reflow
        void entry.target.offsetWidth;
        entry.target.style.animation = '';
      }
    });
  }, { threshold: 0.5 });
  sigPaths.forEach(function(path) { sigObserver.observe(path); });

  // -------- FINAL SETUP & REFRESH --------
  // After all scripts load, do a final ScrollTrigger refresh
  window.addEventListener('load', function() {
    setTimeout(function() {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh(true);
        console.log('ScrollTrigger refreshed');
      }
    }, 3000);
  });

})();
