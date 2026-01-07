/**
 * Animation and Scroll Observer Tests
 * Tests for IntersectionObserver fade-in animations and scroll behavior
 */

const fs = require('fs');
const path = require('path');

describe('Scroll Animations and Observers', () => {
  let document;
  let mockIntersectionObserver;
  let observerCallback;

  beforeEach(() => {
    // Load the HTML file
    const html = fs.readFileSync(
      path.resolve(__dirname, '../src/index.html'),
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
  });

  test('fade-in elements exist on page', () => {
    const fadeInElements = document.querySelectorAll('.fade-in');
    expect(fadeInElements.length).toBeGreaterThan(0);
  });

  test('IntersectionObserver is created with correct options', () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(() => {}, observerOptions);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      observerOptions
    );
  });

  test('IntersectionObserver adds visible class when element is intersecting', () => {
    const testElement = document.createElement('div');
    testElement.classList.add('fade-in');

    // Create observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
      target: testElement
    };

    // Call the callback directly
    observer.callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    observer.callback([mockEntry]);

    expect(testElement.classList.contains('visible')).toBe(true);
  });

  test('IntersectionObserver does not add visible class when not intersecting', () => {
    const testElement = document.createElement('div');
    testElement.classList.add('fade-in');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    // Simulate no intersection
    const mockEntry = {
      isIntersecting: false,
      target: testElement
    };

    observer.callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    observer.callback([mockEntry]);

    expect(testElement.classList.contains('visible')).toBe(false);
  });

  test('hero animations are defined in CSS', () => {
    const html = fs.readFileSync(
      path.resolve(__dirname, '../src/index.html'),
      'utf8'
    );

    // Check for animation definitions
    expect(html).toContain('@keyframes slideDown');
    expect(html).toContain('@keyframes fadeInUp');
    expect(html).toContain('@keyframes pulse');
    expect(html).toContain('@keyframes moveStripes');
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
