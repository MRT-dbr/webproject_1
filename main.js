/**
 * NovaSphere — main interactions
 * Sections: loader, theme, nav, particles, cursor, scroll animations,
 * counters, parallax, chatbot UI, forms, easter eggs.
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prefersFinePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Loader ---------- */
  const loader = document.getElementById("loader");
  const body = document.body;

  function hideLoader() {
    if (!loader) return;
    loader.classList.add("is-done");
    loader.setAttribute("aria-busy", "false");
    body.classList.remove("is-loading");
    requestAnimationFrame(() => {
      document.body.classList.add("cursor-ready");
    });
  }

  body.classList.add("is-loading");
  window.addEventListener("load", () => {
    const delay = prefersReducedMotion ? 100 : 900;
    window.setTimeout(hideLoader, delay);
  });

  /* ---------- Theme (dark / light) ---------- */
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;

  function getStoredTheme() {
    try {
      return localStorage.getItem("novasphere-theme");
    } catch {
      return null;
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("novasphere-theme", theme);
    } catch {
      /* ignore */
    }
  }

  const stored = getStoredTheme();
  if (stored === "light" || stored === "dark") {
    applyTheme(stored);
  } else {
    applyTheme("dark");
  }

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
  });

  /* ---------- Floating nav + mobile menu ---------- */
  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!header || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > lastScrollY && y > 120) header.classList.add("is-hidden");
        else header.classList.remove("is-hidden");
        lastScrollY = y;
        ticking = false;
      });
    },
    { passive: true }
  );

  navToggle?.addEventListener("click", () => {
    const open = navMenu?.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Particle canvas (hero) ---------- */
  const canvas = document.getElementById("particle-canvas");

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationId;

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      initParticles();
    }

    function initParticles() {
      const count = Math.min(90, Math.floor((canvas.width * canvas.height) / 14000));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 2 + 0.6,
          hue: Math.random() > 0.5 ? 200 : 280,
        });
      }
    }

    function draw() {
      const isDark = root.getAttribute("data-theme") !== "light";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `hsla(${p.hue}, 85%, 70%, 0.55)` : `hsla(220, 70%, 45%, 0.35)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = isDark ? `rgba(120, 180, 255, ${0.12 * (1 - dist / 110)})` : `rgba(0, 80, 180, ${0.08 * (1 - dist / 110)})`;
            ctx.stroke();
          }
        }
      });
      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(animationId);
      else draw();
    });
  }

  /* ---------- Custom cursor ---------- */
  const ring = document.getElementById("cursor-ring");
  const dot = document.getElementById("cursor-dot");

  if (prefersReducedMotion || !prefersFinePointer) {
    document.body.classList.add("reduce-cursor");
  } else {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (dot) {
          dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        }
      },
      { passive: true }
    );

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ring) {
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = "a, button, input, textarea, .feature-card, .gallery-item, .news-card";
    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener("mouseenter", () => ring?.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring?.classList.remove("is-hover"));
    });
  }

  /* ---------- Scroll reveal ---------- */
  const animated = document.querySelectorAll("[data-animate]");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
  );
  animated.forEach((el) => io.observe(el));

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll(".counter");

  function animateCounter(el) {
    const target = Number(el.getAttribute("data-target")) || 0;
    const duration = prefersReducedMotion ? 0 : 1400;
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(eased * target);
      el.textContent = val.toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterIo = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c) => counterIo.observe(c));

  /* ---------- Subtle parallax ---------- */
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  if (!prefersReducedMotion && parallaxEls.length) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        parallaxEls.forEach((el) => {
          const factor = Number(el.getAttribute("data-parallax")) || 0.1;
          el.style.transform = `translateY(${y * factor * -0.08}px)`;
        });
      },
      { passive: true }
    );
  }

  /* ---------- Chatbot panel ---------- */
  const chatToggle = document.getElementById("chatbot-toggle");
  const chatPanel = document.getElementById("chatbot-panel");

  chatToggle?.addEventListener("click", () => {
    const open = chatPanel?.hasAttribute("hidden");
    if (open) {
      chatPanel.removeAttribute("hidden");
      chatToggle.setAttribute("aria-expanded", "true");
    } else {
      chatPanel?.setAttribute("hidden", "");
      chatToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Contact / newsletter forms ---------- */
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      if (formStatus) formStatus.textContent = "Please fill all fields.";
      return;
    }
    if (formStatus) formStatus.textContent = "Transmission received — we’ll route your signal shortly.";
    contactForm.reset();
  });

  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterStatus = document.getElementById("newsletter-status");

  newsletterForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(newsletterForm);
    const email = fd.get("newsletter");
    if (!email) return;
    newsletterStatus.textContent = `Subscribed: ${email}`;
    newsletterForm.reset();
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Live discussion topic rotation ---------- */
  const topicEl = document.getElementById("discussion-topic");
  const topics = [
    "Thread: Best prompting stacks for 2035?",
    "Thread: Glass UI without performance debt?",
    "Thread: Quantum-friendly CI pipelines?",
    "Thread: Community-built model benchmarks?",
  ];
  let topicIdx = 0;

  if (topicEl && !prefersReducedMotion) {
    window.setInterval(() => {
      topicIdx = (topicIdx + 1) % topics.length;
      topicEl.style.opacity = "0";
      window.setTimeout(() => {
        topicEl.textContent = topics[topicIdx];
        topicEl.style.opacity = "1";
      }, 280);
    }, 5200);
    topicEl.style.transition = "opacity 0.28s ease";
  }

  /* ---------- Easter eggs ---------- */
  const eggToast = document.getElementById("egg-toast");

  function showEgg(message) {
    if (!eggToast) return;
    eggToast.hidden = false;
    eggToast.textContent = message;
    eggToast.classList.add("is-visible");
    document.body.classList.add("nova-mode");
    window.setTimeout(() => {
      eggToast.classList.remove("is-visible");
      window.setTimeout(() => {
        eggToast.hidden = true;
      }, 400);
    }, 3200);
  }

  /* Konami code */
  const konami = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let kIdx = 0;

  window.addEventListener("keydown", (e) => {
    if (e.altKey && (e.key === "n" || e.key === "N")) {
      document.body.classList.toggle("nova-mode");
      return;
    }

    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const expected = konami[kIdx];
    const ok = key === expected;
    if (ok) {
      kIdx++;
      if (kIdx === konami.length) {
        kIdx = 0;
        showEgg("Nova Protocol unlocked — cinematic mode engaged.");
      }
    } else {
      kIdx = key === "ArrowUp" ? 1 : 0;
    }
  });

  /* Triple-click brand logo area */
  const brand = document.querySelector(".nav__brand");
  let brandClicks = 0;
  let brandTimer = null;

  brand?.addEventListener("click", (e) => {
    brandClicks++;
    window.clearTimeout(brandTimer);
    brandTimer = window.setTimeout(() => {
      brandClicks = 0;
    }, 500);
    if (brandClicks >= 3) {
      e.preventDefault();
      brandClicks = 0;
      showEgg("Hidden constellation synced — welcome, Architect.");
    }
  });

})();
