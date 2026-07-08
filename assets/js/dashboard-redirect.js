(function () {
  document.addEventListener("DOMContentLoaded", () => {
    // 1. Determine the path to 404 page dynamically based on current folder depth
    let page404 = "404.html";
    const path = window.location.pathname;

    if (
      path.includes("/pages/dashboard/admin/") ||
      path.includes("/pages/dashboard/client/") ||
      path.includes("/pages/dashboard/financial-advisor/") ||
      path.includes("/pages/dashboard/managing-partner/")
    ) {
      page404 = "../../404.html";
    } else if (path.includes("/pages/dashboard/")) {
      page404 = "../404.html";
    } else if (path.includes("/pages/")) {
      page404 = "404.html";
    } else {
      page404 = "pages/404.html";
    }

    // 2. Intercept clicks on empty links, #, or buttons
    document.addEventListener("click", (e) => {
      // A. Check if an anchor link (or its child) was clicked
      const a = e.target.closest("a");
      if (a) {
        const href = a.getAttribute("href");
        if (
          href === "#" ||
          href === "" ||
          href === null ||
          href === undefined ||
          href.trim() === ""
        ) {
          e.preventDefault();
          window.location.href = page404;
          return;
        }
      }

      // B. Check if a button (or its child) was clicked
      const btn =
        e.target.closest("button") ||
        (e.target.closest("[role='button']") && !e.target.closest("a"));
      if (btn) {
        const id = btn.getAttribute("id");
        const hasBsToggle =
          btn.hasAttribute("data-bs-toggle") ||
          btn.hasAttribute("data-bs-dismiss") ||
          btn.hasAttribute("data-bs-target");
        const isCloseBtn =
          btn.classList.contains("btn-close") ||
          btn.classList.contains("close");

        // Keep ONLY the absolute structural system buttons functional:
        // - Logout button (logoutBtn)
        // - Mobile menu controls (menuToggle, sidebarOverlay)
        // - Bootstrap interactive components (dropdown, collapse, modals, dismiss buttons)
        if (
          id === "logoutBtn" ||
          id === "menuToggle" ||
          id === "sidebarOverlay" ||
          hasBsToggle ||
          isCloseBtn
        ) {
          return;
        }

        e.preventDefault();
        window.location.href = page404;
      }
    });
  });
})();
