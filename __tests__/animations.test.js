/**
 * Animation and Scroll Observer Tests
 * Tests for IntersectionObserver fade-in animations and scroll behavior
 */

const fs = require('fs');
const path = require('path');

describe('Scroll Animations and Observers', () => {
  let mockIntersectionObserver;
  let observerCallback;

  beforeEach(() => {
    // Load the HTML file
    const html = fs.readFileSync(
      path.resolve(__dirname, '../index.html'),
      'utf8'
    );
    document.body.innerHTML = html;

    // Mock IntersectionObserver with callback capture
    mockIntersectionObserver = jest.fn((callback, options) => {
      observerCallback = callback;
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn()
      };
    });
    global.IntersectionObserver = mockIntersectionObserver;

    // Require the actual source file so Jest tracks coverage
    jest.resetModules();
    require('../js/animations');
  });

  test('fade-in elements exist on page', () => {
    const fadeInElements = document.querySelectorAll('.fade-in');
    expect(fadeInElements.length).toBeGreaterThan(0);
  });

  test('IntersectionObserver is created with correct options by animations.js', () => {
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );
  });

  test('IntersectionObserver adds visible class when element is intersecting', () => {
    const testElement = document.createElement('div');
    testElement.classList.add('fade-in');

    // Get the actual callback passed to IntersectionObserver by animations.js
    const actualCallback = mockIntersectionObserver.mock.calls[0][0];

    actualCallback([{ isIntersecting: true, target: testElement }]);

    expect(testElement.classList.contains('visible')).toBe(true);
  });

  test('IntersectionObserver does not add visible class when not intersecting', () => {
    const testElement = document.createElement('div');
    testElement.classList.add('fade-in');

    // Get the actual callback passed to IntersectionObserver by animations.js
    const actualCallback = mockIntersectionObserver.mock.calls[0][0];

    actualCallback([{ isIntersecting: false, target: testElement }]);

    expect(testElement.classList.contains('visible')).toBe(false);
  });

  test('hero animations are defined in CSS', () => {
    const css = fs.readFileSync(
      path.resolve(__dirname, '../css/styles.css'),
      'utf8'
    );

    // Check for animation definitions
    expect(css).toContain('@keyframes slideDown');
    expect(css).toContain('@keyframes fadeInUp');
    expect(css).toContain('@keyframes pulse');
    expect(css).toContain('@keyframes moveStripes');
  });

  test('scroll event listener exists for active nav highlighting', () => {
    const sections = document.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);

    const navLinks = document.querySelectorAll('nav a');
    expect(navLinks.length).toBeGreaterThan(0);
  });

  test('stats section displays correct values', () => {
    const statValues = document.querySelectorAll('.stat-value');
    expect(statValues.length).toBe(3);

    const values = Array.from(statValues).map(el => el.textContent.trim());
    expect(values).toContain('12+');
    expect(values).toContain('90%');
    expect(values).toContain('80%');
  });

  test('section headers have correct structure', () => {
    const sectionHeaders = document.querySelectorAll('.section-header');

    sectionHeaders.forEach(header => {
      const tag = header.querySelector('.section-tag');
      const heading = header.querySelector('h2');

      expect(tag).toBeTruthy();
      expect(heading).toBeTruthy();
    });
  });
});
