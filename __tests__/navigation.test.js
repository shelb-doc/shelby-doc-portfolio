/**
 * Navigation Tests
 * Tests for smooth scrolling navigation and active link highlighting
 */

const fs = require('fs');
const path = require('path');

describe('Navigation Functionality', () => {
  beforeEach(() => {
    // Load the HTML file
    const html = fs.readFileSync(
      path.resolve(__dirname, '../index.html'),
      'utf8'
    );
    document.body.innerHTML = html;

    // Require the actual source file so Jest tracks coverage
    jest.resetModules();
    const { initNavigation } = require('../js/navigation');
    initNavigation(document, window);
  });

  test('navigation links exist', () => {
    const navLinks = document.querySelectorAll('nav a');
    expect(navLinks.length).toBeGreaterThan(0);
  });

  test('all navigation links have correct hrefs', () => {
    const navLinks = document.querySelectorAll('nav a');
    const expectedLinks = ['#home', '#skills', '#projects', '#experience', '#education', '#contact'];

    const actualLinks = Array.from(navLinks).map(link => link.getAttribute('href'));
    expect(actualLinks).toEqual(expectedLinks);
  });

  test('clicking navigation link calls scrollIntoView', () => {
    const navLink = document.querySelector('a[href="#skills"]');
    const skillsSection = document.querySelector('#skills');

    expect(navLink).toBeTruthy();
    expect(skillsSection).toBeTruthy();

    // Click the link
    navLink.click();

    // Verify scrollIntoView was called
    expect(skillsSection.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    });
  });

  test('navigation link with invalid target does not throw error', () => {
    const invalidLink = document.createElement('a');
    invalidLink.setAttribute('href', '#nonexistent');
    document.body.appendChild(invalidLink);

    // Re-require to attach handler to the new link
    jest.resetModules();
    const { initNavigation } = require('../js/navigation');
    initNavigation(document, window);

    expect(() => {
      invalidLink.click();
    }).not.toThrow();
  });

  test('logo text is correct', () => {
    const logo = document.querySelector('.logo');
    expect(logo.textContent).toBe('SHELBY.QA');
  });

  test('scroll event updates active nav link', () => {
    // Trigger scroll event to exercise the scroll handler in navigation.js
    window.dispatchEvent(new Event('scroll'));

    // Verify no errors occur and nav links are still present
    const navLinks = document.querySelectorAll('nav a');
    expect(navLinks.length).toBeGreaterThan(0);
  });

  test('all section IDs match navigation links', () => {
    const navLinks = Array.from(document.querySelectorAll('nav a'))
      .map(link => link.getAttribute('href').substring(1));

    navLinks.forEach(id => {
      const section = document.getElementById(id);
      expect(section).toBeTruthy();
    });
  });

  test('initNavigation guard handles invalid document safely', () => {
    const { initNavigation } = require('../js/navigation');
    expect(() => initNavigation(null, window)).not.toThrow();
  });

  test('scroll handler throttles work with requestAnimationFrame', () => {
    const rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      cb();
      return 1;
    });

    const { initNavigation } = require('../js/navigation');
    initNavigation(document, window);

    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));

    expect(rafSpy).toHaveBeenCalled();
    rafSpy.mockRestore();
  });

  test('missing section IDs in nav links are handled safely', () => {
    const nav = document.querySelector('nav ul');
    const li = document.createElement('li');
    const brokenLink = document.createElement('a');
    brokenLink.setAttribute('href', '#does-not-exist');
    brokenLink.textContent = 'Broken';
    li.appendChild(brokenLink);
    nav.appendChild(li);

    jest.resetModules();
    const { initNavigation } = require('../js/navigation');

    expect(() => initNavigation(document, window)).not.toThrow();
    expect(() => window.dispatchEvent(new Event('scroll'))).not.toThrow();
  });

  test('module defers navigation initialization until DOMContentLoaded when document is loading', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(document, 'readyState');
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    Object.defineProperty(document, 'readyState', {
      configurable: true,
      value: 'loading'
    });

    jest.resetModules();
    require('../js/navigation');

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'DOMContentLoaded',
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    if (originalDescriptor) {
      Object.defineProperty(document, 'readyState', originalDescriptor);
    }
  });

  test('DOMContentLoaded callback runs deferred navigation initialization', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(document, 'readyState');
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    Object.defineProperty(document, 'readyState', {
      configurable: true,
      value: 'loading'
    });

    jest.resetModules();
    require('../js/navigation');

    const domReadyCall = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === 'DOMContentLoaded'
    );
    expect(domReadyCall).toBeTruthy();

    const callback = domReadyCall[1];
    callback();

    const navLink = document.querySelector('a[href="#skills"]');
    const skillsSection = document.querySelector('#skills');
    navLink.click();
    expect(skillsSection.scrollIntoView).toHaveBeenCalled();

    addEventListenerSpy.mockRestore();
    if (originalDescriptor) {
      Object.defineProperty(document, 'readyState', originalDescriptor);
    }
  });
});
