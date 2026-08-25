// Inicializa los módulos y la navegación principal de la aplicación.

import { initCalculator } from './modules/calculator.js?v=3200';
import { initInteractiveMap } from './modules/map.js?v=3200';
import { initContactForm } from './modules/contactForm.js?v=3200';
import { initInstagramSection } from './modules/instagram.js?v=3200';
import { initWhatsAppChatbot } from './modules/whatsapp.js?v=3200';

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

  // Menú de navegación en móviles
  const navToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
