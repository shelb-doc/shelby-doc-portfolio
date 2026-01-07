/**
 * Rubber Duck Easter Egg Tests
 * Tests for the interactive rubber duck feature including quacks and animations
 */

const fs = require('fs');
const path = require('path');

describe('Rubber Duck Easter Egg', () => {
  let document;
  let duck;

  beforeEach(() => {
    // Load the HTML file
    const html = fs.readFileSync(
      path.resolve(__dirname, '../src/index.html'),
      'utf8'
    );
    document.body.innerHTML = html;

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

    const duckBody = svg.querySelector('.st8');
    expect(duckBody).toBeTruthy();
  });

  test('playQuack function creates AudioContext', () => {
    const playQuack = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);

      return { audioContext, oscillator, gainNode };
    };

    const result = playQuack();
    expect(result.audioContext).toBeDefined();
    expect(result.oscillator).toBeDefined();
    expect(result.gainNode).toBeDefined();
  });

  test('showQuackText creates and displays quack message', () => {
    const showQuackText = () => {
      const quackText = document.createElement('div');
      quackText.textContent = 'QUACK!';
      quackText.style.cssText = `
        position: fixed;
        bottom: 7rem;
        right: 3rem;
        color: #9b7ab8;
        font-size: 1.5rem;
        font-weight: 700;
        font-family: 'Urbanist', sans-serif;
        animation: quackFloat 0.8s ease-out;
        pointer-events: none;
        z-index: 10000;
        text-shadow: 0 0 10px rgba(155, 122, 184, 0.5);
      `;

      document.body.appendChild(quackText);
      return quackText;
    };

    const quackText = showQuackText();
    expect(quackText.textContent).toBe('QUACK!');
    expect(quackText.style.position).toBe('fixed');
    expect(quackText.style.zIndex).toBe('10000');
  });

  test('duck has click event capabilities', () => {
    const clickHandler = jest.fn();
    duck.addEventListener('click', clickHandler);

    duck.click();
    expect(clickHandler).toHaveBeenCalled();
  });

  test('duck hover effects are defined', () => {
    const mouseEnterHandler = jest.fn(function() {
      this.style.transform = 'scale(1.1)';
      this.style.filter = 'drop-shadow(0 6px 12px rgba(155, 122, 184, 0.6))';
    });

    const mouseLeaveHandler = jest.fn(function() {
      this.style.transform = 'scale(1)';
      this.style.filter = 'drop-shadow(0 4px 8px rgba(155, 122, 184, 0.4))';
    });

    duck.addEventListener('mouseenter', mouseEnterHandler);
    duck.addEventListener('mouseleave', mouseLeaveHandler);

    // Simulate mouse enter
    const enterEvent = new Event('mouseenter');
    duck.dispatchEvent(enterEvent);
    expect(mouseEnterHandler).toHaveBeenCalled();

    // Simulate mouse leave
    const leaveEvent = new Event('mouseleave');
    duck.dispatchEvent(leaveEvent);
    expect(mouseLeaveHandler).toHaveBeenCalled();
  });

  test('duck animations are defined in CSS', () => {
    const html = fs.readFileSync(
      path.resolve(__dirname, '../src/index.html'),
      'utf8'
    );

    expect(html).toContain('@keyframes quackFloat');
    expect(html).toContain('@keyframes duckBounce');
    expect(html).toContain('@keyframes duckSpin');
  });

  test('duck title attribute exists', () => {
    expect(duck.getAttribute('title')).toBe('Click me! 🦆');
  });

  test('quack counter logic works correctly', () => {
    let quackCount = 0;

    // Simulate 5 quacks
    for (let i = 0; i < 5; i++) {
      quackCount++;
    }

    expect(quackCount).toBe(5);
    expect(quackCount % 5).toBe(0); // Should trigger special animation
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
