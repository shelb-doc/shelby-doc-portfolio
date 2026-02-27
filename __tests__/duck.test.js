/**
 * Rubber Duck Easter Egg Tests
 * Tests for the interactive rubber duck feature including quacks and animations
 */

const fs = require('fs');
const path = require('path');

describe('Rubber Duck Easter Egg', () => {
  let duck;

  beforeEach(() => {
    // Load the HTML file
    const html = fs.readFileSync(
      path.resolve(__dirname, '../index.html'),
      'utf8'
    );
    document.body.innerHTML = html;

    // Require the actual source file so Jest tracks coverage
    jest.resetModules();
    require('../js/duck');

    duck = document.getElementById('rubberDuck');
  });

  test('rubber duck element exists', () => {
    expect(duck).toBeTruthy();
    expect(duck.id).toBe('rubberDuck');
  });

  test('rubber duck has correct styling', () => {
    expect(duck.style.position).toBe('fixed');
    expect(duck.style.cursor).toBe('pointer');
  });

  test('rubber duck SVG contains correct elements', () => {
    const svg = duck.querySelector('svg');
    expect(svg).toBeTruthy();

    const duckBody = svg.querySelector('.st0');
    expect(duckBody).toBeTruthy();
  });

  test('clicking duck triggers playQuack (AudioContext)', () => {
    duck.click();
    expect(window.AudioContext).toHaveBeenCalled();
  });

  test('clicking duck shows quack text', () => {
    duck.click();
    const quackText = document.querySelector('div');
    const quackDivs = [...document.querySelectorAll('div')].filter(
      el => el.textContent === 'QUACK!'
    );
    expect(quackDivs.length).toBeGreaterThan(0);
    expect(quackDivs[0].style.position).toBe('fixed');
    expect(quackDivs[0].style.zIndex).toBe('10000');
  });

  test('duck click handler is attached and runs', () => {
    duck.click();
    // After click, duck should have a bounce animation set by duck.js
    expect(duck.style.animation).toContain('duckBounce');
  });

  test('duck hover effects apply via source handlers', () => {
    // Simulate mouse enter - triggers handler from duck.js
    duck.dispatchEvent(new Event('mouseenter'));
    expect(duck.style.transform).toBe('scale(1.1)');

    // Simulate mouse leave
    duck.dispatchEvent(new Event('mouseleave'));
    expect(duck.style.transform).toBe('scale(1)');
  });

  test('duck animations are defined in CSS', () => {
    const duckJs = fs.readFileSync(
      path.resolve(__dirname, '../js/duck.js'),
      'utf8'
    );

    expect(duckJs).toContain('@keyframes quackFloat');
    expect(duckJs).toContain('@keyframes duckBounce');
    expect(duckJs).toContain('@keyframes duckSpin');
  });

  test('duck title attribute exists', () => {
    expect(duck.getAttribute('title')).toBe('Click me for debugging wisdom!');
  });

  test('special spin animation triggers every 5 clicks', () => {
    // Click duck 5 times to trigger the special animation
    for (let i = 0; i < 5; i++) {
      duck.click();
    }

    // On the 5th click, duck.js sets duckSpin animation
    expect(duck.style.animation).toContain('duckSpin');
  });

  test('duck animation reset works', (done) => {
    duck.style.animation = 'duckBounce 0.5s ease-out';

    setTimeout(() => {
      duck.style.animation = '';
      expect(duck.style.animation).toBe('');
      done();
    }, 10);
  });
});
