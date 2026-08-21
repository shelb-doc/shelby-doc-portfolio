/**
 * Animations Module
 * Handles scroll-triggered fade-in animations using IntersectionObserver
 */

const initializedDocuments = new WeakSet();

function initAnimations(doc = document, win = window) {
  if (!doc || !win || !doc.body) {
    return;
  }

  if (initializedDocuments.has(doc)) {
    return;
  }
  initializedDocuments.add(doc);

  const IntersectionObserverConstructor =
    win.IntersectionObserver ||
    (typeof globalThis !== "undefined"
      ? globalThis.IntersectionObserver
      : undefined);

  if (typeof IntersectionObserverConstructor === "undefined") {
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserverConstructor((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  doc.querySelectorAll(".fade-in").forEach((element) => {
    observer.observe(element);
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { initAnimations };
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      initAnimations(document, window),
    );
  } else {
    initAnimations(document, window);
  }
}
