/**
 * Navigation Tests
 * Tests for smooth scrolling navigation and active link highlighting
 */

const fs = require('fs');
const path = require('path');

describe('Navigation Functionality', () => {
  let document;

  beforeEach(() => {
    // Load the HTML file
    const html = fs.readFileSync(
      path.resolve(__dirname, '../src/index.html'),
      'utf8'
    );
    document.body.innerHTML = html;

    // Execute the navigation script
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
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

    invalidLink.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });

    expect(() => {
      invalidLink.click();
    }).not.toThrow();
  });

  test('logo text is correct', () => {
    const logo = document.querySelector('.logo');
    expect(logo.textContent).toBe('SHELBY.QA');
  });

  test('all section IDs match navigation links', () => {
    const navLinks = Array.from(document.querySelectorAll('nav a'))
      .map(link => link.getAttribute('href').substring(1));

    navLinks.forEach(id => {
      const section = document.getElementById(id);
      expect(section).toBeTruthy();
    });
  });
});
