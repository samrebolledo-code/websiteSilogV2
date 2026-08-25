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
      let fullVehiclesHtml = '';
      if (result.fullVehicles && result.fullVehicles.length > 0) {
        const fullVehiclesListText = result.fullVehicles.map(v => `${v.label} ($${v.basePrice.toLocaleString('es-CL')})`).join(', ');
        fullVehiclesHtml = `
          <div class="breakdown-item">
            <span class="breakdown-label">Vehículo(s) Completo(s):</span>
            <span class="breakdown-value">${fullVehiclesListText}</span>
          </div>
        `;
      } else {
        fullVehiclesHtml = `
          <div class="breakdown-item">
            <span class="breakdown-label">Vehículo Completo:</span>
            <span class="breakdown-value">No aplica (Carga 100% fraccionada)</span>
          </div>
        `;
      }

      let sobranteHtml = '';
      if (result.sobrante) {
        const s = result.sobrante;
        const tagClass = s.chargedBy === 'peso' ? 'weight' : 'volume';
        const tagText = s.chargedBy === 'peso' ? 'Cobro mayor del sobrante por PESO' : 'Cobro mayor del sobrante por VOLUMEN';

        sobranteHtml = `
          <div class="breakdown-item">
            <span class="breakdown-label">Carga Sobrante (${s.pallets} pallet/bulto):</span>
            <span class="breakdown-value">${s.realWeightKg} kg real (${s.billableWeightKg} kg fact.) / ${s.realVolumeM3} m³ real (${s.billableVolumeM3} m³ fact.)</span>
            <span class="breakdown-label mt-2">Valor del Sobrante Fraccionado:</span>
            <span class="breakdown-value">${s.formattedValorFraccionado} CLP</span>
          </div>
        `;
      } else {
        sobranteHtml = `
          <div class="breakdown-item">
            <span class="breakdown-label">Carga Sobrante:</span>
            <span class="breakdown-value">Sin sobrante (100% en vehículo completo)</span>
          </div>
        `;
      }

      breakdownEl.innerHTML = `
        <div class="breakdown-grid">
          ${fullVehiclesHtml}
          ${sobranteHtml}
        </div>
        <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed rgba(255,255,255,0.15); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <span style="font-size: 0.85rem; color: var(--text-soft);">Neto: <strong>${result.formattedNet} CLP</strong> | IVA 19%: <strong>${result.formattedIva} CLP</strong></span>
          <span style="font-size: 1rem; font-weight: 700; color: #38bdf8;">Total Final: ${result.formattedTotal} CLP</span>
        </div>
      `;
    } else if (result.mode === 'express') {
      const veh = result.assignedVehicle;
      const distLabel = `${result.distanceKm} km (Recorrido iday vuelta)`;
      const excessKmLabel = result.excessKm > 0 ? `${result.excessKm} km` : '0 km (Dentro de los 260 km incluidos)';
      const excessCostLabel = result.excessKm > 0 ? `+ ${result.formattedExcessCost} CLP (${result.excessKm} km × $1.852/km)` : '$0 CLP (Incluido en valor base)';

      breakdownEl.innerHTML = `
        <div class="breakdown-grid">
          <div class="breakdown-item">
            <span class="breakdown-label">Vehículo Seleccionado:</span>
            <span class="breakdown-value">${veh.label} (${veh.maxWeightKg.toLocaleString('es-CL')} kg / ${veh.maxVolumeM3} m³)</span>
            <span class="breakdown-label mt-2">Valor Base (Incluye 260 km):</span>
            <span class="breakdown-value">${veh.formattedBasePrice} CLP</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">Distancia Comercial Total:</span>
            <span class="breakdown-value">${distLabel}</span>
            <span class="breakdown-label mt-2">Km Excedentes (>260 km):</span>
            <span class="breakdown-value">${excessKmLabel} ➔ ${excessCostLabel}</span>
          </div>
        </div>
        <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed rgba(255,255,255,0.15); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <span style="font-size: 0.85rem; color: var(--text-soft);">Neto: <strong>${result.formattedNet} CLP</strong> | IVA 19%: <strong>${result.formattedIva} CLP</strong></span>
          <span style="font-size: 1rem; font-weight: 700; color: #fbbf24;">Total Final Express: ${result.formattedTotal} CLP</span>
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
