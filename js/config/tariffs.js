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
    includedKm: 260,
    ratePerExcessKm: 1852
  }
};

/**
 * Tabla oficial de vehículos (ordenados por capacidad).
 * Los valores base incluyen hasta 260 km de recorrido (Lampa -> comuna -> Lampa).
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
 * Lógica para Carga Fraccionada:
 * Evaluará si la carga llena vehículos completos + sobrante fraccionado.
 */
function calculateFractionalQuote({ pallets, totalWeightKg, totalVolumeM3 }) {
  const options = [];

  // Opción 1: Carga 100% Fraccionada (Sin vehículos completos)
  const pureFrac = calculateSobranteFraccionado(pallets, totalWeightKg, totalVolumeM3);
  options.push({
    fullVehicles: [],
    sobrante: pureFrac,
    totalPriceNet: pureFrac.valorFraccionado,
    type: "pura_fraccionada"
  });

  // Opción 2: 1 Vehículo Completo único que contiene TODA la carga (si cabe)
  for (const v of EXPRESS_VEHICLES) {
    if (totalWeightKg <= v.maxWeightKg && totalVolumeM3 <= v.maxVolumeM3) {
      if (totalWeightKg >= v.maxWeightKg * 0.70 || totalVolumeM3 >= v.maxVolumeM3 * 0.70) {
        options.push({
          fullVehicles: [v],
          sobrante: null,
          totalPriceNet: v.basePrice,
          type: "vehiculo_unico"
        });
      }
    }
  }

  // Opción 3: Vehículo(s) Completo(s) + Sobrante Fraccionado
  for (const vehicle of EXPRESS_VEHICLES) {
    const maxByWeight = Math.floor(totalWeightKg / vehicle.maxWeightKg);
    const maxByVolume = Math.floor(totalVolumeM3 / vehicle.maxVolumeM3);
    const maxVehicles = Math.min(maxByWeight, maxByVolume);

    for (let numVeh = 1; numVeh <= maxVehicles; numVeh++) {
      const usedWeight = numVeh * vehicle.maxWeightKg;
      const usedVolume = numVeh * vehicle.maxVolumeM3;
      
      const palletsPerVehicle = Math.max(1, Math.floor(vehicle.maxVolumeM3 / 1.44));
      const usedPallets = Math.min(pallets, numVeh * palletsPerVehicle);

      const remWeight = Math.max(0, totalWeightKg - usedWeight);
      const remVolume = Math.max(0, totalVolumeM3 - usedVolume);
      const remPallets = Math.max(0, pallets - usedPallets);

      let sobranteResult = null;
      let sobrantePrice = 0;

      if (remWeight > 0 || remVolume > 0 || remPallets > 0) {
        const effectiveRemPallets = remPallets > 0 ? remPallets : Math.max(1, Math.ceil(remVolume / 1.44));
        sobranteResult = calculateSobranteFraccionado(effectiveRemPallets, remWeight, remVolume);
        sobrantePrice = sobranteResult.valorFraccionado;
      }

      const fullVehiclesList = Array(numVeh).fill(vehicle);
      const fullVehiclesCost = numVeh * vehicle.basePrice;
      const totalPrice = fullVehiclesCost + sobrantePrice;

      options.push({
        fullVehicles: fullVehiclesList,
        sobrante: sobranteResult,
        totalPriceNet: totalPrice,
        type: "mixto"
      });
    }
  }

  // Elegir la opción comercial de menor costo para el cliente
  options.sort((a, b) => a.totalPriceNet - b.totalPriceNet);
  const bestOption = options[0];

  const finalNetCLP = Math.round(bestOption.totalPriceNet / 1000) * 1000;
  const finalIvaCLP = Math.round(finalNetCLP * TARIFF_CONFIG.ivaRate);
  const finalTotalCLP = finalNetCLP + finalIvaCLP;

  return {
    success: true,
    mode: "fraccionada",
    serviceLabel: "Carga Fraccionada",
    pallets,
    realWeightKg: totalWeightKg,
    realVolumeM3: totalVolumeM3.toFixed(2),
    fullVehicles: bestOption.fullVehicles,
    sobrante: bestOption.sobrante,
    optionType: bestOption.type,
    estimatedPriceNet: finalNetCLP,
    estimatedIva: finalIvaCLP,
    estimatedTotal: finalTotalCLP,
    currency: TARIFF_CONFIG.currency,
    formattedNet: formatCLP(finalNetCLP),
    formattedIva: formatCLP(finalIvaCLP),
    formattedTotal: formatCLP(finalTotalCLP)
  };
}

/**
 * Calcula el valor de una carga fraccionada sobrante aplicando los mínimos de 900 kg y 1,44 m3 por pallet.
 */
function calculateSobranteFraccionado(pallets, weightKg, volumeM3) {
  const pMin = pallets * TARIFF_CONFIG.fractionalRates.minWeightPerPalletKg;
  const pFact = Math.max(weightKg, pMin);

  const vMin = pallets * TARIFF_CONFIG.fractionalRates.minVolumePerPalletM3;
  const vFact = Math.max(volumeM3, vMin);

  const valorPeso = pFact * TARIFF_CONFIG.fractionalRates.ratePerKg;
  const valorVolumen = vFact * TARIFF_CONFIG.fractionalRates.ratePerM3;

  const valorFraccionado = Math.max(valorPeso, valorVolumen);
  const chargedBy = valorPeso >= valorVolumen ? "peso" : "volumen";

  return {
    pallets,
    realWeightKg: weightKg,
    realVolumeM3: volumeM3.toFixed(2),
    billableWeightKg: pFact,
    billableVolumeM3: vFact.toFixed(2),
    valorPeso,
    valorVolumen,
    valorFraccionado,
    chargedBy,
    formattedValorPeso: formatCLP(Math.round(valorPeso)),
    formattedValorVolumen: formatCLP(Math.round(valorVolumen)),
    formattedValorFraccionado: formatCLP(Math.round(valorFraccionado))
  };
}

/**
 * Lógica para Despacho Express / Dedicado:
 * Selecciona 1 solo vehículo completo + aplica 260 km base e incrementos por km excedente @ $1.852/km.
 */
function calculateExpressQuote({ pallets, totalWeightKg, totalVolumeM3, distanceKm }) {
  if (totalWeightKg > 15000 || totalVolumeM3 > 28.03) {
    return {
      success: false,
      isOverCapacity: true,
      error: "Esta carga supera la capacidad disponible. Para cargas de mayor tamaño, comuníquese con un ejecutivo para solicitar una cotización especial."
    };
  }

  const assignedVehicle = EXPRESS_VEHICLES.find(v => totalWeightKg <= v.maxWeightKg && totalVolumeM3 <= v.maxVolumeM3);

  if (!assignedVehicle) {
    return {
      success: false,
      isOverCapacity: true,
      error: "Esta carga supera la capacidad disponible. Para cargas de mayor tamaño, comuníquese con un ejecutivo para solicitar una cotización especial."
    };
  }

  const hasDistance = typeof distanceKm === 'number' && !isNaN(distanceKm) && distanceKm > 0;
  const totalDistanceKm = hasDistance ? distanceKm : 260;
  const includedKm = TARIFF_CONFIG.expressRates.includedKm;

  const excessKm = Math.max(0, totalDistanceKm - includedKm);
  const excessDistanceCost = excessKm * TARIFF_CONFIG.expressRates.ratePerExcessKm;
  const basePrice = assignedVehicle.basePrice;

  // Fórmula Express: valorBase + Math.max(0, distanceKm - 260) * 1852
  const estimatedPriceNet = basePrice + excessDistanceCost;

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
    distanceKm: totalDistanceKm,
    hasDistance,
    includedKm,
    excessKm,
    excessDistanceCost,
    estimatedPriceNet: finalNetCLP,
    estimatedIva: finalIvaCLP,
    estimatedTotal: finalTotalCLP,
    currency: TARIFF_CONFIG.currency,
    formattedNet: formatCLP(finalNetCLP),
    formattedIva: formatCLP(finalIvaCLP),
    formattedTotal: formatCLP(finalTotalCLP),
    formattedExcessCost: formatCLP(Math.round(excessDistanceCost))
  };
}

export function formatCLP(amount) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(amount);
}
