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
  // Works for: index.html (root), pages/*.html (depth 1)
  const inPages = window.location.pathname.includes("/pages/");
  const root = inPages ? "../" : ""; // path back to project root
  const pages = inPages ? "" : "pages/"; // path forward to /pages/

  // Build a URL for a given page slug and optional hash
  function url(page, hash) {
    const href =
      page === "index" ? `${root}index.html` : `${pages}${page}.html`;
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
          alert(
            `Thank you for subscribing! We'll send insights to ${inp.value}.`,
          );
          inp.value = "";
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
    const current =
      window.location.pathname.split("/").pop().replace(".html", "") || "index";
    document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
      link.classList.remove("active");
      const page = link.getAttribute("data-page");
      if (page === current || (current === "" && page === "index")) {
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

  // ── Consultation form ─────────────────────────────────────────────────────
  const cForm = document.getElementById("contact_form");
  if (cForm) {
    cForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = cForm.querySelector("input[name='con_name']");
      const email = cForm.querySelector("input[name='con_email']");
      const message = cForm.querySelector("textarea[name='con_message']");
      const fb =
        cForm.querySelector(".con_message") || document.createElement("div");
      if (name.value && email.value && message.value) {
        fb.style.display = "block";
        fb.className = "form-feedback success text-success fw-bold mt-2";
        fb.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, ${name.value}! A senior advisor will contact you within 24 hours.`;
        cForm.reset();
        setTimeout(() => {
          fb.style.display = "none";
        }, 8000);
      }
    });
  }

  // ── Dashboard chart animation ─────────────────────────────────────────────
  const bars = document.querySelectorAll(".chart-bar");
  if (bars.length) {
    setInterval(() => {
      bars.forEach((b) => {
        b.style.height = `${Math.floor(Math.random() * 80) + 20}%`;
      });
    }, 3000);
  }
});
