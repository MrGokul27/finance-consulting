document.addEventListener("DOMContentLoaded", () => {
  // ── Preloader (home page only) ────────────────────────────────────────────
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("hide");
      preloader.addEventListener("transitionend", () => preloader.remove(), {
        once: true,
      });
    }, 2000);
  }

  // ── Depth detection ───────────────────────────────────────────────────────
  // Works for: index.html (root), pages/*.html (depth 1), pages/services/*.html (depth 2)
  const inServicesSubpage =
    window.location.pathname.includes("/pages/services/");
  const inPages = window.location.pathname.includes("/pages/");
  const root = inServicesSubpage ? "../../" : inPages ? "../" : ""; // path back to project root
  const pages = inServicesSubpage ? "../" : inPages ? "" : "pages/"; // path forward to /pages/
  const page404 = inServicesSubpage
    ? "../404.html"
    : inPages
      ? "404.html"
      : "pages/404.html";

  // Build a URL for a given page slug and optional hash
  // Services subpages use data-page="services/wealth-management" etc.
  function url(page, hash) {
    let href;
    if (page === "index") {
      href = `${root}index.html`;
    } else if (page.startsWith("services/")) {
      href = `${pages}${page}.html`;
    } else {
      href = `${pages}${page}.html`;
    }
    return hash ? `${href}#${hash}` : href;
  }

  // ── Load components ───────────────────────────────────────────────────────
  loadComponent(
    "header-placeholder",
    `${root}pages/components/header.html`,
    initHeader,
  );
  loadComponent(
    "footer-placeholder",
    `${root}pages/components/footer.html`,
    initFooter,
  );

  function loadComponent(id, src, cb) {
    const el = document.getElementById(id);
    if (!el) return;
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(src);
        return r.text();
      })
      .then((html) => {
        el.innerHTML = html;
        cb && cb();
      })
      .catch((err) => {
        console.error(err);
        el.innerHTML = `<div style="padding:16px;text-align:center;color:var(--text-muted)">Component failed to load.</div>`;
      });
  }

  // ── Resolve all data-page links & logo src ────────────────────────────────
  function resolveLinks(container) {
    if (!container) return;

    // Nav / footer links
    container.querySelectorAll("[data-page]").forEach((el) => {
      const page = el.getAttribute("data-page");
      const hash = el.getAttribute("data-hash") || "";
      el.setAttribute("href", url(page, hash));
    });

    // Logo images
    const logoSrc = `${root}assets/images/logoStackly.webp`;
    ["navLogoImg", "footerLogoImg"].forEach((id) => {
      const img = container.querySelector(`#${id}`);
      if (img) img.setAttribute("src", logoSrc);
    });

    // Home link on logo anchor
    const homeLink = container.querySelector("#navHomeLink");
    if (homeLink) homeLink.setAttribute("href", url("index"));
  }

  // ── Header init ───────────────────────────────────────────────────────────
  function initHeader() {
    const placeholder = document.getElementById("header-placeholder");
    const header = document.getElementById("siteHeader");
    if (!header) return;

    resolveLinks(placeholder);
    highlightActive();

    // Sticky on scroll
    const topbar = document.querySelector(".topbar");
    window.addEventListener("scroll", () => {
      const sticky = window.scrollY > 50;
      header.classList.toggle("is-sticky", sticky);
      document.body.style.paddingTop = sticky
        ? header.offsetHeight + (topbar ? topbar.offsetHeight : 0) + "px"
        : "";
    });
  }

  // ── Footer init ───────────────────────────────────────────────────────────
  function initFooter() {
    const placeholder = document.getElementById("footer-placeholder");
    resolveLinks(placeholder);

    // Footer logo needs the gold filter (it's on dark bg)
    const footerImg = document.getElementById("footerLogoImg");
    if (footerImg) footerImg.classList.add("footer-logo-img");

    // Year
    const yr = document.getElementById("footerYear");
    if (yr) yr.textContent = new Date().getFullYear();

    // Newsletter
    const form = document.querySelector(".newsletter-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const inp = form.querySelector("input[type='email']");
        if (inp && inp.value) {
          window.location.href = page404;
        }
      });
    }

    // Scroll-to-top button
    const btn = document.getElementById("scrollTopBtn");
    if (btn) {
      window.addEventListener("scroll", () => {
        btn.classList.toggle("visible", window.scrollY > 300);
      });
      btn.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" }),
      );
    }
  }

  // ── Active nav highlight ──────────────────────────────────────────────────
  function highlightActive() {
    const path = window.location.pathname;
    const current = path.split("/").pop().replace(".html", "") || "index";
    const isServicesSubpage = path.includes("/pages/services/");
    document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
      link.classList.remove("active");
      const page = link.getAttribute("data-page");
      if (isServicesSubpage && page === "services") {
        link.classList.add("active");
      } else if (page === current || (current === "" && page === "index")) {
        link.classList.add("active");
      }
    });
  }

  // ── Testimonials slider ───────────────────────────────────────────────────
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".nav-dot");
  if (slides.length && dots.length) {
    let cur = 0;
    const show = (i) => {
      slides.forEach((s) => s.classList.remove("active"));
      dots.forEach((d) => d.classList.remove("active"));
      slides[i].classList.add("active");
      dots[i].classList.add("active");
      cur = i;
    };
    dots.forEach((d, i) => d.addEventListener("click", () => show(i)));
    setInterval(() => show((cur + 1) % slides.length), 8000);
  }

  // ── Portfolio filter ──────────────────────────────────────────────────────
  const filterBtns = document.querySelectorAll("[data-filter]");
  const portItems = document.querySelectorAll(".portfolio-item");
  if (filterBtns.length && portItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const val = btn.getAttribute("data-filter");
        portItems.forEach((item) => {
          item.style.display =
            val === "all" || item.getAttribute("data-category") === val
              ? "block"
              : "none";
        });
      });
    });
  }

  // ── Consultation/Contact form ─────────────────────────────────────────────
  const cForm = document.getElementById("contact_form");
  if (cForm) {
    const nameInput = cForm.querySelector("input[name='con_name']");
    if (nameInput) {
      // Prevent typing numbers or special characters in the name field itself
      nameInput.addEventListener("input", (e) => {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const originalValue = e.target.value;
        // Keep only letters (a-z, A-Z) and spaces
        const newValue = originalValue.replace(/[^a-zA-Z\s]/g, "");
        if (originalValue !== newValue) {
          e.target.value = newValue;
          // Restore cursor/selection position
          const diff = originalValue.length - newValue.length;
          e.target.setSelectionRange(start - diff, end - diff);
        }
      });

      // Also prevent the character keydown event directly for standard character-producing keys
      nameInput.addEventListener("keypress", (e) => {
        const char = String.fromCharCode(e.which || e.keyCode);
        if (!/^[a-zA-Z\s]$/.test(char)) {
          e.preventDefault();
        }
      });
    }

    cForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = cForm.querySelector("input[name='con_name']");
      const email = cForm.querySelector("input[name='con_email']");
      const message = cForm.querySelector("textarea[name='con_message']");
      if (
        name &&
        email &&
        message &&
        name.value &&
        email.value &&
        message.value
      ) {
        window.location.href = page404;
      }
    });
  }

  // ── Empty / # link → 404 redirect ──────────────────────────────────────

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (href === "#" || href === "" || href === null) {
      e.preventDefault();
      window.location.href = page404;
    }
  });

  // ── Dashboard chart animation ─────────────────────────────────────────────
  const bars = document.querySelectorAll(".chart-bar");
  if (bars.length) {
    setInterval(() => {
      bars.forEach((b) => {
        b.style.height = `${Math.floor(Math.random() * 80) + 20}%`;
      });
    }, 3000);
  }

  // ── Scroll Reveal Animation System ─────────────────────────────────────────
  const initScrollReveal = () => {
    // Exclude dashboard pages
    const path = window.location.pathname;
    if (
      path.includes("/dashboard.html") ||
      path.includes("/pages/dashboard/")
    ) {
      return;
    }

    const revealElements = document.querySelectorAll(".reveal");
    if (!revealElements.length) return;

    const startRevealObserver = () => {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
              obs.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: "0px 0px -40px 0px",
        },
      );

      revealElements.forEach((el) => observer.observe(el));
    };

    // If preloader is present, wait until it finishes hiding before starting animations
    const preloader = document.getElementById("preloader");
    if (preloader) {
      setTimeout(startRevealObserver, 2300);
    } else {
      // For other pages, start reveal animations immediately
      startRevealObserver();
    }
  };

  initScrollReveal();
});
