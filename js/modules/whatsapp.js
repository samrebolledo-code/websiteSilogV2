// Integración con WhatsApp para cotización y contacto directo.

export const WHATSAPP_CONFIG = {
  phone: "+56912345678",
  companyName: "Transportes SIL",
  subTitle: "En línea",
  welcomeMessage: "Hola, bienvenido a Transportes SIL.\nRealizamos despachos diarios entre Santiago y la V Región.\n\n¿En qué podemos ayudarte?"
};

export function initWhatsAppChatbot() {
  const floatingBtn = document.getElementById('floating-whatsapp');
  const chatbotModal = document.getElementById('whatsapp-chatbot-modal');
  const closeBtn = document.getElementById('chatbot-close-btn');

  if (!floatingBtn || !chatbotModal) return;

  floatingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    chatbotModal.classList.toggle('active');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatbotModal.classList.remove('active');
    });
  }

  chatbotModal.querySelectorAll('.chatbot-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      handleChatbotAction(action);
      chatbotModal.classList.remove('active');
    });
  });
}

function handleChatbotAction(action) {
  let message = "";

  switch (action) {
    case 'ejecutivo':
      message = "Hola, quisiera hablar con un ejecutivo de Transportes SIL.";
      break;
    case 'especial':
      message = "Hola, quisiera cotizar un flete especial o carga fuera de medida.";
      break;
    case 'consulta':
      message = "Hola, quisiera hacer una consulta sobre la cobertura y despachos.";
      break;
    default:
      message = "Hola, quisiera solicitar información sobre los servicios de despacho.";
  }

  const url = `https://wa.me/${WHATSAPP_CONFIG.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  openWhatsApp(url);
}

export function buildQuoteWhatsAppUrl(data) {
  const unitLabel = data.unit || 'cm';
  const modeLabel = data.mode === 'express' ? '⚡ Despacho Express / Dedicado' : '🚚 Carga Fraccionada';

  let detailExtra = '';
  if (data.mode === 'express' && data.assignedVehicle) {
    detailExtra = `\nVehículo asignado: ${data.assignedVehicle.label}`;
  }

  const text = `Hola, quisiera cotizar un despacho.

Modalidad: ${modeLabel}
Origen: ${data.origin || 'Santiago'}
Destino: ${data.destinationName}
Pallets: ${data.pallets}
Peso total real: ${data.weightKg} kg
Medidas por pallet (${unitLabel}): ${data.length} x ${data.width} x ${data.height}${detailExtra}

El valor estimado en el cotizador web es ${data.formattedNet} + IVA (Total con IVA: ${data.formattedTotal}).

Quisiera confirmar disponibilidad.`;

  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${WHATSAPP_CONFIG.phone.replace(/[^0-9]/g, '')}?text=${encodedText}`;
}

export function openWhatsApp(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
