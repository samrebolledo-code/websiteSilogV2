// Cálculo de tarifas para envíos de Carga Fraccionada y Despacho Express / Dedicado.

export const TARIFF_CONFIG = {
  currency: "CLP",
  ivaRate: 0.19, // 19% IVA en Chile

  fractionalRates: {
    ratePerKg: 77.78,
    ratePerM3: 48611,
    minWeightPerPalletKg: 900,
    minVolumePerPalletM3: 1.44
  },

  expressRates: {
    ratePerKm: 1852
  }
};

/**
 * Tabla oficial de vehículos de Despacho Express / Dedicado (ordenados por capacidad).
 */
export const EXPRESS_VEHICLES = [
  {
    id: "furgon_chico",
    label: "Furgón chico",
    maxWeightKg: 650,
    maxVolumeM3: 2.38,
    basePrice: 203885
  },
  {
    id: "furgon_grande",
    label: "Furgón grande",
    maxWeightKg: 800,
    maxVolumeM3: 3.75,
    basePrice: 203885
  },
  {
    id: "camion_5t",
    label: "Camión 5 toneladas",
    maxWeightKg: 5000,
    maxVolumeM3: 21.50,
    basePrice: 187182
  },
  {
    id: "camion_8t",
    label: "Camión 8 toneladas",
    maxWeightKg: 8000,
    maxVolumeM3: 22.91,
    basePrice: 320350
  },
  {
    id: "camion_12t",
    label: "Camión 12 toneladas",
    maxWeightKg: 12000,
    maxVolumeM3: 25.40,
    basePrice: 355000
  },
  {
    id: "camion_15t",
    label: "Camión 15 toneladas",
    maxWeightKg: 15000,
    maxVolumeM3: 28.03,
    basePrice: 367780
  }
];

/**
 * Convierte cualquier medida a Metros según la unidad seleccionada.
 */
export function convertToMeters(value, unit = 'cm') {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return 0;

  const u = (unit || 'cm').toString().trim().toLowerCase();
  let meters = num;

  if (u === 'cm' || u === 'centimetros' || u === 'centímetros') {
    meters = num / 100;
  } else if (u === 'in' || u === 'pulgadas') {
    meters = num * 0.0254;
  } else {
    if (num > 10) {
      meters = num / 100;
    } else {
      meters = num;
    }
  }

  return meters;
}

/**
 * Calcula el valor comercial estimado para Carga Fraccionada o Despacho Express.
 * 
 * @param {Object} input
 * @param {string} input.mode - "fraccionada" | "express"
 * @param {string} input.origin - Siempre "Santiago"
 * @param {string} input.destination - ID de comuna destino
 * @param {number} input.pallets - Cantidad de pallets
 * @param {number} input.weightKg - Peso total real en kg
 * @param {number} input.length - Largo unitario por pallet
 * @param {number} input.width - Ancho unitario por pallet
 * @param {number} input.height - Alto unitario por pallet
 * @param {string} input.unit - Unidad ('m', 'cm', 'in')
 * @param {number} [input.distanceKm] - Distancia en km desde Santiago a la comuna
 */
export function calculateQuote(input) {
  const mode = (input.mode || "fraccionada").toLowerCase();
  const pallets = parseInt(input.pallets, 10);
  const totalWeightKg = parseFloat(input.weightKg);
  const unit = (input.unit || 'cm').toLowerCase();

  const lengthM = convertToMeters(input.length, unit);
  const widthM = convertToMeters(input.width, unit);
  const heightM = convertToMeters(input.height, unit);

  if (isNaN(pallets) || pallets <= 0) {
    return { success: false, error: "Ingresa una cantidad válida de pallets (mínimo 1)." };
  }

  if (isNaN(totalWeightKg) || totalWeightKg <= 0) {
    return { success: false, error: "Ingresa el peso total aproximado de la carga (en kg)." };
  }

  if (lengthM <= 0 || widthM <= 0 || heightM <= 0) {
    return { success: false, error: "Completa dimensiones válidas (Largo, Ancho y Alto por pallet)." };
  }

  const unitVolumeM3 = lengthM * widthM * heightM;
  const totalVolumeM3 = unitVolumeM3 * pallets;

  if (mode === "express") {
    return calculateExpressQuote({
      pallets,
      totalWeightKg,
      totalVolumeM3,
      distanceKm: input.distanceKm
    });
  } else {
    return calculateFractionalQuote({
      pallets,
      totalWeightKg,
      totalVolumeM3
    });
  }
}

/**
 * Lógica para Modalidad 1: Carga Fraccionada
 */
function calculateFractionalQuote({ pallets, totalWeightKg, totalVolumeM3 }) {
  // Regla de Peso Mínimo Facturable: 900 kg por pallet
  const pesoMinimoFacturable = pallets * TARIFF_CONFIG.fractionalRates.minWeightPerPalletKg;
  const pesoFacturable = Math.max(totalWeightKg, pesoMinimoFacturable);

  // Regla de Volumen Mínimo Facturable: 1,44 m3 por pallet
  const volumenMinimoFacturable = pallets * TARIFF_CONFIG.fractionalRates.minVolumePerPalletM3;
  const volumenFacturable = Math.max(totalVolumeM3, volumenMinimoFacturable);

  // Comparación Peso vs Volumen (Se cobra únicamente el MÁXIMO entre ambos)
  const valorPeso = pesoFacturable * TARIFF_CONFIG.fractionalRates.ratePerKg;
  const valorVolumen = volumenFacturable * TARIFF_CONFIG.fractionalRates.ratePerM3;

  const estimatedPriceNet = Math.max(valorPeso, valorVolumen);
  const chargedBy = valorPeso >= valorVolumen ? "peso" : "volumen";

  const finalNetCLP = Math.round(estimatedPriceNet / 1000) * 1000;
  const finalIvaCLP = Math.round(finalNetCLP * TARIFF_CONFIG.ivaRate);
  const finalTotalCLP = finalNetCLP + finalIvaCLP;

  return {
    success: true,
    mode: "fraccionada",
    serviceLabel: "Carga Fraccionada",
    pallets,
    realWeightKg: totalWeightKg,
    realVolumeM3: totalVolumeM3.toFixed(2),
    billableWeightKg: pesoFacturable,
    billableVolumeM3: volumenFacturable.toFixed(2),
    priceByWeight: valorPeso,
    priceByVolume: valorVolumen,
    chargedBy,
    estimatedPriceNet: finalNetCLP,
    estimatedIva: finalIvaCLP,
    estimatedTotal: finalTotalCLP,
    currency: TARIFF_CONFIG.currency,
    formattedNet: formatCLP(finalNetCLP),
    formattedIva: formatCLP(finalIvaCLP),
    formattedTotal: formatCLP(finalTotalCLP),
    formattedPriceByWeight: formatCLP(Math.round(valorPeso)),
    formattedPriceByVolume: formatCLP(Math.round(valorVolumen))
  };
}

/**
 * Lógica para Modalidad 2: Despacho Express / Dedicado
 */
function calculateExpressQuote({ pallets, totalWeightKg, totalVolumeM3, distanceKm }) {
  // Exceso de capacidad máxima disponible en la flota (15.000 kg o 28,03 m3)
  if (totalWeightKg > 15000 || totalVolumeM3 > 28.03) {
    return {
      success: false,
      isOverCapacity: true,
      error: "Esta carga supera la capacidad disponible. Para cargas de mayor tamaño, comuníquese con un ejecutivo para solicitar una cotización especial."
    };
  }

  // Seleccionar el vehículo más pequeño que satisfaga peso Y volumen simultáneamente
  const assignedVehicle = EXPRESS_VEHICLES.find(v => totalWeightKg <= v.maxWeightKg && totalVolumeM3 <= v.maxVolumeM3);

  if (!assignedVehicle) {
    return {
      success: false,
      isOverCapacity: true,
      error: "Esta carga supera la capacidad disponible. Para cargas de mayor tamaño, comuníquese con un ejecutivo para solicitar una cotización especial."
    };
  }

  const distKm = (typeof distanceKm === 'number' && !isNaN(distanceKm) && distanceKm > 0) ? distanceKm : 0;
  const costoDistancia = distKm * TARIFF_CONFIG.expressRates.ratePerKm;
  const valorBaseVehiculo = assignedVehicle.basePrice;

  // Fórmula Express: MAX(valorBaseVehiculo, distancia * 1852)
  const estimatedPriceNet = Math.max(valorBaseVehiculo, costoDistancia);
  const chargedBy = costoDistancia > valorBaseVehiculo ? "distancia" : "base";

  const finalNetCLP = Math.round(estimatedPriceNet / 1000) * 1000;
  const finalIvaCLP = Math.round(finalNetCLP * TARIFF_CONFIG.ivaRate);
  const finalTotalCLP = finalNetCLP + finalIvaCLP;

  return {
    success: true,
    mode: "express",
    serviceLabel: "Despacho Express / Dedicado",
    pallets,
    realWeightKg: totalWeightKg,
    realVolumeM3: totalVolumeM3.toFixed(2),
    assignedVehicle: {
      id: assignedVehicle.id,
      label: assignedVehicle.label,
      maxWeightKg: assignedVehicle.maxWeightKg,
      maxVolumeM3: assignedVehicle.maxVolumeM3,
      basePrice: assignedVehicle.basePrice,
      formattedBasePrice: formatCLP(assignedVehicle.basePrice)
    },
    distanceKm: distKm,
    hasDistance: distKm > 0,
    costPerKm: TARIFF_CONFIG.expressRates.ratePerKm,
    distanceCost: costoDistancia,
    chargedBy,
    estimatedPriceNet: finalNetCLP,
    estimatedIva: finalIvaCLP,
    estimatedTotal: finalTotalCLP,
    currency: TARIFF_CONFIG.currency,
    formattedNet: formatCLP(finalNetCLP),
    formattedIva: formatCLP(finalIvaCLP),
    formattedTotal: formatCLP(finalTotalCLP),
    formattedDistanceCost: formatCLP(Math.round(costoDistancia))
  };
}

/**
 * Formatea un número como divisa CLP limpia ($70.000)
 */
export function formatCLP(amount) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(amount);
}
