/**
 * Rubber Duck Easter Egg Module
 * Interactive rubber duck debugging companion with sound effects
 */

let audioContextInstance = null;

function getAudioContext(win = window) {
  if (!audioContextInstance) {
    const AudioContextConstructor =
      win.AudioContext ||
      win.webkitAudioContext ||
      (typeof globalThis !== "undefined"
        ? globalThis.AudioContext
        : undefined) ||
      (typeof globalThis !== "undefined"
        ? globalThis.webkitAudioContext
        : undefined);
    if (!AudioContextConstructor) {
      return null;
    }

    audioContextInstance = new AudioContextConstructor();
  }

  return audioContextInstance;
}

// Quack sounds (using Web Audio API to generate duck-like sounds)
function playQuack(win = window) {
  const audioContext = getAudioContext(win);
  if (!audioContext) {
    return;
  }

  if (
    audioContext.state === "suspended" &&
    typeof audioContext.resume === "function"
  ) {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Duck-like quack frequency
  oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    200,
    audioContext.currentTime + 0.1,
  );

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.2,
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
}

// Show quack text
function showQuackText(doc = document) {
  const quackText = doc.createElement("div");
  quackText.className = "duck-quack-text";
  quackText.textContent = "QUACK!";

  doc.body.appendChild(quackText);

  setTimeout(() => {
    quackText.remove();
  }, 800);
}

function initDuck(doc = document, win = window) {
  if (!doc || !doc.body) {
    return;
  }

  const duck = doc.getElementById("rubberDuck");
  if (!duck) {
    return;
  }

  let quackCount = 0;
  let animationResetTimer = null;

  duck.addEventListener("click", function (e) {
    e.preventDefault();
    quackCount++;

    playQuack(win);
    showQuackText(doc);

    duck.classList.remove("duck--bouncing", "duck--spinning");
    if (quackCount % 5 === 0) {
      duck.classList.add("duck--spinning");
    } else {
      duck.classList.add("duck--bouncing");
    }

    if (animationResetTimer) {
      clearTimeout(animationResetTimer);
    }

    animationResetTimer = setTimeout(() => {
      duck.classList.remove("duck--bouncing", "duck--spinning");
    }, 1000);
  });

  duck.addEventListener("mouseenter", function () {
    this.classList.add("duck--hovered");
  });

  duck.addEventListener("mouseleave", function () {
    this.classList.remove("duck--hovered");
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { initDuck, playQuack, showQuackText };
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      initDuck(document, window),
    );
  } else {
    initDuck(document, window);
  }
}
