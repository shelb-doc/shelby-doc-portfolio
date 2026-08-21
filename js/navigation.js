/**
 * Navigation Module
 * Handles smooth scrolling and active link highlighting
 */

function initNavigation(doc = document, win = window) {
  if (!doc || !win || !doc.body) {
    return;
  }

  const navLinks = Array.from(doc.querySelectorAll("nav a"));
  const sectionIds = navLinks
    .map((link) => link.getAttribute("href"))
    .filter((href) => href && href.startsWith("#"))
    .map((href) => href.slice(1));

  // Smooth scrolling for in-page links.
  doc.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = doc.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  let ticking = false;
  const updateActiveNav = () => {
    let current = "";

    sectionIds.forEach((id) => {
      const section = doc.getElementById(id);
      if (!section) {
        return;
      }

      if (win.scrollY >= section.offsetTop - 200) {
        current = id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "nav-link-active",
        link.getAttribute("href") === `#${current}`,
      );
    });
  };

  win.addEventListener("scroll", () => {
    if (ticking) {
      return;
    }

    ticking = true;
    win.requestAnimationFrame(() => {
      updateActiveNav();
      ticking = false;
    });
  });

  updateActiveNav();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { initNavigation };
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      initNavigation(document, window),
    );
  } else {
    initNavigation(document, window);
  }
}
