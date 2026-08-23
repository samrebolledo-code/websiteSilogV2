// Manejo del formulario de contacto.

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertContainer = document.getElementById('contact-alert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value.trim();
    const company = document.getElementById('contact-company')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const phone = document.getElementById('contact-phone')?.value.trim();
    const message = document.getElementById('contact-message')?.value.trim();

    if (!name || !email || !message) {
      showAlert('Por favor completa los campos requeridos (Nombre, Correo y Mensaje).', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando mensaje...';
    }

    setTimeout(() => {
      showAlert(`Gracias, ${name}. Hemos recibido tu mensaje. Te responderemos a la brevedad.`, 'success');
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensaje Comercial';
      }
    }, 1000);
  });
}

function showAlert(message, type = 'success') {
  const alertContainer = document.getElementById('contact-alert');
  if (!alertContainer) return;

  alertContainer.className = `alert alert-${type} animate-fade-in`;
  alertContainer.textContent = message;
  alertContainer.classList.remove('hidden');

  setTimeout(() => {
    alertContainer.classList.add('hidden');
  }, 6000);
}
