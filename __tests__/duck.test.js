/**
 * Rubber Duck Easter Egg Tests
 * Tests for the interactive rubber duck feature including quacks and animations
 */

const fs = require("fs");
const path = require("path");

describe("Rubber Duck Easter Egg", () => {
  let duck;

  beforeEach(() => {
    // Load the HTML file
    const html = fs.readFileSync(
      path.resolve(__dirname, "../index.html"),
      "utf8",
    );
    document.body.innerHTML = html;

    // Require the actual source file so Jest tracks coverage
    jest.resetModules();
    const { initDuck } = require("../js/duck");
    initDuck(document, window);

    duck = document.getElementById("rubberDuck");
  });

  test("rubber duck element exists", () => {
    expect(duck).toBeTruthy();
    expect(duck.id).toBe("rubberDuck");
  });

  test("rubber duck has correct styling", () => {
    expect(duck.classList.contains("rubber-duck")).toBe(true);
    const svg = duck.querySelector("svg");
    expect(svg.classList.contains("rubber-duck-svg")).toBe(true);
  });

  test("rubber duck SVG contains correct elements", () => {
    const svg = duck.querySelector("svg");
    expect(svg).toBeTruthy();

    const duckBody = svg.querySelector(".st0");
    expect(duckBody).toBeTruthy();
  });

  test("clicking duck triggers playQuack (AudioContext)", () => {
    duck.click();
    expect(window.AudioContext).toHaveBeenCalled();
  });

  test("clicking duck shows quack text", () => {
    duck.click();
    const quackDivs = [...document.querySelectorAll(".duck-quack-text")].filter(
      (el) => el.textContent === "QUACK!",
    );
    expect(quackDivs.length).toBeGreaterThan(0);
    expect(quackDivs[0].classList.contains("duck-quack-text")).toBe(true);
  });

  test("duck click handler is attached and runs", () => {
    duck.click();
    // After click, duck should have a bounce animation set by duck.js
    expect(duck.classList.contains("duck--bouncing")).toBe(true);
  });

  test("duck hover effects apply via source handlers", () => {
    // Simulate mouse enter - triggers handler from duck.js
    duck.dispatchEvent(new Event("mouseenter"));
    expect(duck.classList.contains("duck--hovered")).toBe(true);

    // Simulate mouse leave
    duck.dispatchEvent(new Event("mouseleave"));
    expect(duck.classList.contains("duck--hovered")).toBe(false);
  });

  test("duck animations are defined in CSS", () => {
    const css = fs.readFileSync(
      path.resolve(__dirname, "../css/styles.css"),
      "utf8",
    );

    expect(css).toContain("@keyframes quackFloat");
    expect(css).toContain("@keyframes duckBounce");
    expect(css).toContain("@keyframes duckSpin");
  });

  test("duck title attribute exists", () => {
    expect(duck.getAttribute("title")).toBe("Click me for debugging wisdom!");
  });

  test("special spin animation triggers every 5 clicks", () => {
    // Click duck 5 times to trigger the special animation
    for (let i = 0; i < 5; i++) {
      duck.click();
    }

    // On the 5th click, duck.js sets duckSpin animation
    expect(duck.classList.contains("duck--spinning")).toBe(true);
  });

  test("duck animation reset works", () => {
    jest.useFakeTimers();

    duck.click();
    expect(duck.classList.contains("duck--bouncing")).toBe(true);

    jest.advanceTimersByTime(1000);

    expect(duck.classList.contains("duck--bouncing")).toBe(false);
    expect(duck.classList.contains("duck--spinning")).toBe(false);

    jest.useRealTimers();
  });

  test("initDuck exits safely if duck element is missing", () => {
    document.body.innerHTML = "<div></div>";
    const { initDuck } = require("../js/duck");
    expect(() => initDuck(document, window)).not.toThrow();
  });

  test("initDuck guard handles invalid document safely", () => {
    const { initDuck } = require("../js/duck");
    expect(() => initDuck(null, window)).not.toThrow();
  });

  test("playQuack exits safely when AudioContext is unavailable", () => {
    const { playQuack } = require("../js/duck");
    const originalAudioContext = window.AudioContext;
    const originalWebkitAudioContext = window.webkitAudioContext;
    const originalGlobalAudioContext = global.AudioContext;
    const originalGlobalWebkitAudioContext = global.webkitAudioContext;

    window.AudioContext = undefined;
    window.webkitAudioContext = undefined;
    global.AudioContext = undefined;
    global.webkitAudioContext = undefined;

    expect(() => playQuack(window)).not.toThrow();

    window.AudioContext = originalAudioContext;
    window.webkitAudioContext = originalWebkitAudioContext;
    global.AudioContext = originalGlobalAudioContext;
    global.webkitAudioContext = originalGlobalWebkitAudioContext;
  });

  test("AudioContext is reused across multiple clicks", () => {
    duck.click();
    duck.click();

    expect(window.AudioContext).toHaveBeenCalledTimes(1);
  });

  test("playQuack resumes suspended audio context", () => {
    jest.resetModules();
    const { playQuack } = require("../js/duck");

    const oscillator = {
      connect: jest.fn(),
      frequency: {
        setValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
      },
      start: jest.fn(),
      stop: jest.fn(),
    };

    const gainNode = {
      connect: jest.fn(),
      gain: {
        setValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
      },
    };

    const audioContext = {
      state: "suspended",
      resume: jest.fn(),
      createOscillator: jest.fn(() => oscillator),
      createGain: jest.fn(() => gainNode),
      destination: {},
      currentTime: 0,
    };

    const mockWin = {
      AudioContext: jest.fn(() => audioContext),
    };

    playQuack(mockWin);
    expect(audioContext.resume).toHaveBeenCalled();
  });

  test("module defers duck initialization until DOMContentLoaded when document is loading", () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      document,
      "readyState",
    );
    const addEventListenerSpy = jest.spyOn(document, "addEventListener");

    Object.defineProperty(document, "readyState", {
      configurable: true,
      value: "loading",
    });

    jest.resetModules();
    require("../js/duck");

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "DOMContentLoaded",
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
    if (originalDescriptor) {
      Object.defineProperty(document, "readyState", originalDescriptor);
    }
  });

  test("DOMContentLoaded callback runs deferred duck initialization", () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      document,
      "readyState",
    );
    const addEventListenerSpy = jest.spyOn(document, "addEventListener");

    Object.defineProperty(document, "readyState", {
      configurable: true,
      value: "loading",
    });

    jest.resetModules();
    require("../js/duck");

    const domReadyCall = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "DOMContentLoaded",
    );
    expect(domReadyCall).toBeTruthy();

    const callback = domReadyCall[1];
    callback();

    const duckElement = document.getElementById("rubberDuck");
    duckElement.click();
    expect(window.AudioContext).toHaveBeenCalled();

    addEventListenerSpy.mockRestore();
    if (originalDescriptor) {
      Object.defineProperty(document, "readyState", originalDescriptor);
    }
  });
});
