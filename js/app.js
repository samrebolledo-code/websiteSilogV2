// Inicializa los módulos y la navegación principal de la aplicación.

import { initCalculator } from './modules/calculator.js?v=6000';
import { initInteractiveMap } from './modules/map.js?v=6000';
import { initContactForm } from './modules/contactForm.js?v=6000';
import { initInstagramSection } from './modules/instagram.js?v=6000';
import { initWhatsAppChatbot } from './modules/whatsapp.js?v=6000';

function startApp() {
  initCalculator();
  initInteractiveMap();
  initContactForm();
  initInstagramSection();
  initWhatsAppChatbot();

  // Control de tema claro/oscuro
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    const updateTitle = (theme) => {
      const label = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
      themeToggleBtn.setAttribute('title', label);
      themeToggleBtn.setAttribute('aria-label', label);
    };

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateTitle(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('sil-theme', nextTheme);
      updateTitle(nextTheme);
    });
  }

  // Menú de navegación y Dropdown "Más"
  const navToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const dropdownToggle = document.getElementById('dropdown-toggle');
  const navDropdown = document.getElementById('nav-dropdown');

  if (dropdownToggle && navDropdown) {
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const isOpen = navDropdown.classList.toggle('is-open');
      dropdownToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target)) {
        navDropdown.classList.remove('is-open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDropdown.classList.contains('is-open')) {
        navDropdown.classList.remove('is-open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        if (navDropdown) {
          navDropdown.classList.remove('is-open');
          if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Control del Botón Flotante "Volver Arriba" (Scroll to Top)
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
