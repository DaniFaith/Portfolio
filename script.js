// Daniel Faith portfolio interactions
"use strict";

// Dark/light theme. Dark mode is the default.
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (themeIcon) themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  themeToggle?.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  try { localStorage.setItem("theme", theme); } catch (_) { /* Storage may be unavailable. */ }
}

let initialTheme = "dark";
try {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") initialTheme = savedTheme;
} catch (_) { /* Keep dark mode if storage is unavailable. */ }
applyTheme(initialTheme);

themeToggle?.addEventListener("click", () => {
  applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// Terminal typing effect
const typedText = document.getElementById("typed-text");
const phrases = [
  'echo "Building ideas into projects."',
  'git status: always learning',
  'print("Future full-stack developer")',
  'git commit -m "keep improving"'
];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typedText) return;
  const phrase = phrases[phraseIndex];
  typedText.textContent = phrase.slice(0, charIndex);

  if (!deleting && charIndex < phrase.length) {
    charIndex++;
    window.setTimeout(typeLoop, 58);
  } else if (!deleting) {
    deleting = true;
    window.setTimeout(typeLoop, 1500);
  } else if (charIndex > 0) {
    charIndex--;
    window.setTimeout(typeLoop, 28);
  } else {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    window.setTimeout(typeLoop, 350);
  }
}
if (typedText) typeLoop();

// Project filters
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    projectCards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !show);
    });
  });
});

// Mobile navigation
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("open") ?? false;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  menuToggle.textContent = isOpen ? "✕" : "☰";
});
navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation menu");
    if (menuToggle) menuToggle.textContent = "☰";
  });
});

// Current year in footer
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Highlight the navigation item for the section in view
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-links a");
if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => navObserver.observe(section));
}
