// Lógica del cotizador de envíos y manejo de eventos.

import { getEnabledComunas, getComunaInfo } from '../config/coverage.js';
import { calculateQuote } from '../config/tariffs.js';
import { buildQuoteWhatsAppUrl, openWhatsApp } from './whatsapp.js';

let currentQuoteResult = null;
let currentUnit = 'cm'; // Unidad por defecto: Centímetros (cm)
let currentMode = 'fraccionada'; // Modalidad por defecto: Carga Fraccionada

export function initCalculator() {
  const selectDestination = document.getElementById('calc-destination');
  const calcForm = document.getElementById('calculator-form');
  const resultCard = document.getElementById('calc-result-card');
  const btnWhatsApp = document.getElementById('btn-quote-whatsapp');
  const unitSegmented = document.getElementById('unit-segmented-control');
  const modeSelector = document.getElementById('calc-mode-selector');

  if (!selectDestination || !calcForm) return;

  // 1. Poblar selector de comunas con las habilitadas en V Región
  const enabledComunas = getEnabledComunas();
  selectDestination.innerHTML = '';
  
  enabledComunas.forEach((comuna, idx) => {
    const opt = document.createElement('option');
    opt.value = comuna.id;
    opt.textContent = `${comuna.name} (${comuna.days})`;
    if (comuna.id === 'valparaiso' || idx === 0) {
      opt.selected = true;
    }
    selectDestination.appendChild(opt);
  });

  // 2. Control Segmentado de Modalidad de Despacho (Fraccionada vs Express)
  if (modeSelector) {
    const modeButtons = modeSelector.querySelectorAll('.mode-tab-btn');
    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modeButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        currentMode = btn.getAttribute('data-mode') || 'fraccionada';
      });
    });
  }

  // 3. Control Segmentado de Unidad de Medida (m, cm, in)
  if (unitSegmented) {
    const unitButtons = unitSegmented.querySelectorAll('.unit-btn');
    unitButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        unitButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentUnit = btn.getAttribute('data-unit') || 'cm';
        updateDimensionLabels(currentUnit);
      });
    });
  }

  // 4. Manejo de Envío del Formulario
  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError();

    const activeUnitBtn = document.querySelector('#unit-segmented-control .unit-btn.active');
    const selectedUnit = activeUnitBtn ? activeUnitBtn.getAttribute('data-unit') : 'cm';

    const comunaObj = getComunaInfo(selectDestination.value);

    const inputData = {
      mode: currentMode,
      origin: "Santiago",
      destination: selectDestination.value,
      distanceKm: comunaObj ? comunaObj.distanceKm : undefined,
      pallets: document.getElementById('calc-pallets').value,
      weightKg: document.getElementById('calc-weight').value,
      length: document.getElementById('calc-length').value,
      width: document.getElementById('calc-width').value,
      height: document.getElementById('calc-height').value,
      unit: selectedUnit
    };

    const result = calculateQuote(inputData);

    if (!result.success) {
      showError(result.error);
      if (resultCard) resultCard.classList.add('hidden');
      return;
    }

    currentQuoteResult = {
      ...inputData,
      destinationName: comunaObj?.name || inputData.destination,
      formattedNet: result.formattedNet,
      formattedIva: result.formattedIva,
      formattedTotal: result.formattedTotal,
      mode: result.mode,
      assignedVehicle: result.assignedVehicle
    };

    displayResult(result);
  });

  // 5. Click en Cotizar por WhatsApp
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', () => {
      if (!currentQuoteResult) return;
      const waUrl = buildQuoteWhatsAppUrl(currentQuoteResult);
      openWhatsApp(waUrl);
    });
  }
}

function updateDimensionLabels(unit) {
  const labelLengthText = document.getElementById('label-length-text') || document.getElementById('label-length');
  const labelWidthText = document.getElementById('label-width-text') || document.getElementById('label-width');
  const labelHeightText = document.getElementById('label-height-text') || document.getElementById('label-height');

  const inputLength = document.getElementById('calc-length');
  const inputWidth = document.getElementById('calc-width');
  const inputHeight = document.getElementById('calc-height');

  let unitSuffix = '(m)';
  let placeholderSample = '1.20';

  if (unit === 'cm') {
    unitSuffix = '(cm)';
    placeholderSample = '120';
  } else if (unit === 'in') {
    unitSuffix = '(in)';
    placeholderSample = '47.2';
  }

  if (labelLengthText) labelLengthText.textContent = `Largo por pallet ${unitSuffix}:`;
  if (labelWidthText) labelWidthText.textContent = `Ancho por pallet ${unitSuffix}:`;
  if (labelHeightText) labelHeightText.textContent = `Alto por pallet ${unitSuffix}:`;

  if (inputLength) inputLength.placeholder = placeholderSample;
  if (inputWidth) inputWidth.placeholder = placeholderSample;
  if (inputHeight) inputHeight.placeholder = placeholderSample;
}

function displayResult(result) {
  const resultCard = document.getElementById('calc-result-card');
  const priceDisplay = document.getElementById('calc-price-display');
  const badgeType = document.getElementById('calc-service-badge');
  const breakdownEl = document.getElementById('calc-breakdown-details');

  if (!resultCard || !priceDisplay) return;

  priceDisplay.textContent = `${result.formattedNet} CLP`;
  
  if (badgeType) {
    if (result.mode === 'express') {
      badgeType.textContent = '⚡ Despacho Express / Dedicado';
      badgeType.className = 'badge badge-warning mb-4';
    } else {
      badgeType.textContent = '🚚 Carga Fraccionada';
      badgeType.className = 'badge badge-primary mb-4';
    }
  }

  if (breakdownEl) {
    if (result.mode === 'fraccionada') {
      const tagText = result.chargedBy === 'peso' ? 'Cobro mayor aplicado por PESO' : 'Cobro mayor aplicado por VOLUMEN';
      const tagClass = result.chargedBy === 'peso' ? 'weight' : 'volume';

      breakdownEl.innerHTML = `
        <div class="breakdown-grid">
          <div class="breakdown-item">
            <span class="breakdown-label">Peso Real Total:</span>
            <span class="breakdown-value">${result.realWeightKg.toLocaleString('es-CL')} kg</span>
            <span class="breakdown-label mt-2">Peso Facturable (Mín. 900 kg/pallet):</span>
            <span class="breakdown-value">${result.billableWeightKg.toLocaleString('es-CL')} kg ➔ ${result.formattedPriceByWeight}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Volumen Real Total:</span>
            <span class="breakdown-value">${result.realVolumeM3} m³</span>
            <span class="breakdown-label mt-2">Volumen Facturable (Mín. 1,44 m³/pallet):</span>
            <span class="breakdown-value">${result.billableVolumeM3} m³ ➔ ${result.formattedPriceByVolume}</span>
          </div>
        </div>
        <div style="margin-top: 0.75rem; text-align: center;">
          <span class="breakdown-tag ${tagClass}">${tagText} (${result.formattedNet} CLP Neto)</span>
        </div>
      `;
    } else if (result.mode === 'express') {
      const veh = result.assignedVehicle;
      const tagText = result.chargedBy === 'distancia' 
        ? `Cobro aplicado por DISTANCIA (${result.distanceKm} km × $1.852/km = ${result.formattedDistanceCost})` 
        : `Cobro aplicado por VALOR BASE DEL VEHÍCULO (${veh.formattedBasePrice})`;

      const distLabel = result.hasDistance ? `${result.distanceKm} km` : 'Por definir';

      breakdownEl.innerHTML = `
        <div class="breakdown-grid">
          <div class="breakdown-item">
            <span class="breakdown-label">Vehículo Asignado:</span>
            <span class="breakdown-value">${veh.label}</span>
            <span class="breakdown-label mt-2">Capacidad Máxima del Vehículo:</span>
            <span class="breakdown-value">${veh.maxWeightKg.toLocaleString('es-CL')} kg / ${veh.maxVolumeM3} m³</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Valor Base del Vehículo:</span>
            <span class="breakdown-value">${veh.formattedBasePrice} CLP</span>
            <span class="breakdown-label mt-2">Distancia a Destino (Tarifa $1.852/km):</span>
            <span class="breakdown-value">${distLabel} ➔ ${result.formattedDistanceCost} CLP</span>
          </div>
        </div>
        <div style="margin-top: 0.75rem; text-align: center;">
          <span class="breakdown-tag express">${tagText}</span>
        </div>
      `;
    }
  }

  resultCard.classList.remove('hidden');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showError(msg) {
  const errorElement = document.getElementById('calc-error-message');
  if (errorElement) {
    errorElement.textContent = msg;
    errorElement.classList.remove('hidden');
  }
}

function hideError() {
  const errorElement = document.getElementById('calc-error-message');
  if (errorElement) {
    errorElement.classList.add('hidden');
    errorElement.textContent = '';
  }
}

export function preselectDestination(comunaId, scrollToCalc = false) {
  const selectDestination = document.getElementById('calc-destination');
  const calcSection = document.getElementById('cotizar');

  if (selectDestination) {
    selectDestination.value = comunaId;
    selectDestination.classList.add('highlight-pulse');
    setTimeout(() => selectDestination.classList.remove('highlight-pulse'), 1200);
  }

  if (scrollToCalc && calcSection) {
    calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    setTimeout(() => {
      const palletInput = document.getElementById('calc-pallets');
      if (palletInput) palletInput.focus();
    }, 600);
  }
}
