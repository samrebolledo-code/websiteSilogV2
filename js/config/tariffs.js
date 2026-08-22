/**
 * Transportes SIL - Motor de Cálculo Comercial y Tarifario
 * 
 * REGLAS DE NEGOCIO Y PRIVACIDAD DE DATOS:
 * 1. Tarifa por Kilo: $77.78 / kg
 * 2. Tarifa por Volumen: $48.611 / m3
 * 3. Conversión de Unidades de Dimensión:
 *    - Metros (m): factor 1
 *    - Centímetros (cm): factor 0.01 (divide por 100)
 *    - Pulgadas (in): factor 0.0254 (multiplica por 0.0254)
 * 4. Capacidad de Camiones (Full Truckload):
 *    - Se pueden agregar o modificar todos los camiones que quieras en el arreglo 'truckTypes'.
 * 5. Lógica Mixta (Grandes Cargas):
 *    - Si la carga excede la capacidad de un camión completo (en peso, m3 o pallets),
 *      se calcula la cantidad de camiones completos a tarifa plana y el remanente (sobrante)
 *      se cobra como Carga Fraccionada.
 */

export const TARIFF_CONFIG = {
  currency: "CLP",
  ivaRate: 0.19, // 19% IVA en Chile

  fractionalRates: {
    ratePerKg: 77.78,
    ratePerM3: 48611
  },

  // 🚛 CONFIGURACIÓN DE CAMIONES DE LA FLOTA:
  // Puedes agregar, quitar o editar todos los camiones que desees en este arreglo.
  truckTypes: [
    {
      id: "estandar",
      capacityPallets: 10,
      maxVolumeM3: 14.4,
      maxWeightKg: 5000,
      flatPrice: 200000,
      label: "Camión Estándar (10 Pallets / 14.4 m³ / 5.000 kg)"
    },
    {
      id: "grande",
      capacityPallets: 12,
      maxVolumeM3: 17.28,
      maxWeightKg: 9000,
      flatPrice: 350000,
      label: "Camión Grande / Rampla (12 Pallets / 17.28 m³ / 9.000 kg)"
    }
  ]
};

/**
 * Convierte cualquier medida a Metros según la unidad seleccionada.
 * Incluye salvaguarda de sanidad comercial.
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
    // Si la unidad es 'm' pero el valor es mayor a 10 (ej: 120), es claramente en cm
    if (num > 10) {
      meters = num / 100;
    } else {
      meters = num;
    }
  }

  return meters;
}

/**
 * Selecciona automáticamente el mejor tipo de camión de la flota según la carga.
 */
export function getBestTruckTier(pallets) {
  const sortedTrucks = [...TARIFF_CONFIG.truckTypes].sort((a, b) => a.capacityPallets - b.capacityPallets);
  const matched = sortedTrucks.find(t => pallets <= t.capacityPallets);
  return matched || sortedTrucks[sortedTrucks.length - 1] || TARIFF_CONFIG.truckTypes[0];
}

/**
 * Calcula el valor comercial estimado de un envío.
 * 
 * @param {Object} input
 * @param {string} input.origin - Siempre "Santiago"
 * @param {string} input.destination - ID de comuna destino
 * @param {number} input.pallets - Cantidad de pallets
 * @param {number} input.weightKg - Peso total en kg
 * @param {number} input.length - Largo unitario
 * @param {number} input.width - Ancho unitario
 * @param {number} input.height - Alto unitario
 * @param {string} input.unit - Unidad de dimensión ('m', 'cm', 'in')
 * 
 * @returns {Object} Resultado del cálculo o error estructurado
 */
export function calculateQuote(input) {
  // 1. Validaciones básicas de entrada
  const origin = (input.origin || "").trim().toLowerCase();
  let destination = (input.destination || "").trim().toLowerCase();
  
  if (!destination || destination === "santiago") {
    destination = "valparaiso"; // Fallback por defecto si no ha seleccionado aún
  }

  const pallets = parseInt(input.pallets, 10);
  const totalWeightKg = parseFloat(input.weightKg);
  const unit = (input.unit || 'm').toLowerCase();

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

  // 2. Cálculo de Volumen Total en m3
  const unitVolumeM3 = lengthM * widthM * heightM;
  const totalVolumeM3 = unitVolumeM3 * pallets;

  // 3. Selección de Tipo de Camión de Referencia de la Flota
  const truckTier = getBestTruckTier(pallets);

  // 4. Evaluar cuántos camiones completos abarca la carga
  const trucksByPallets = Math.floor(pallets / truckTier.capacityPallets);
  const trucksByVolume = Math.floor(totalVolumeM3 / truckTier.maxVolumeM3);
  const trucksByWeight = Math.floor(totalWeightKg / truckTier.maxWeightKg);

  const fullTrucksCount = Math.max(trucksByPallets, trucksByVolume, trucksByWeight);

  let estimatedPriceNet = 0;
  let serviceType = "fraccionada";
  let breakdownDetails = "";
  let fullTrucksSubtotal = 0;
  let overflowSubtotal = 0;

  if (fullTrucksCount > 0) {
    // A) Posee al menos 1 Camión Completo
    fullTrucksSubtotal = fullTrucksCount * truckTier.flatPrice;

    // Calcular Remanente (Sobrante) de la carga que no alcanza a llenar otro camión
    const remPallets = Math.max(0, pallets - (fullTrucksCount * truckTier.capacityPallets));
    const remVolumeM3 = Math.max(0, totalVolumeM3 - (fullTrucksCount * truckTier.maxVolumeM3));
    const remWeightKg = Math.max(0, totalWeightKg - (fullTrucksCount * truckTier.maxWeightKg));

    // Si existe sobrante, se cobra como Carga Fraccionada
    if (remPallets > 0 || remVolumeM3 > 0 || remWeightKg > 0) {
      serviceType = "mixto";

      const fracPriceByWeight = remWeightKg * TARIFF_CONFIG.fractionalRates.ratePerKg;
      const fracPriceByVolume = remVolumeM3 * TARIFF_CONFIG.fractionalRates.ratePerM3;

      overflowSubtotal = Math.max(fracPriceByWeight, fracPriceByVolume);
      estimatedPriceNet = fullTrucksSubtotal + overflowSubtotal;

      breakdownDetails = `${fullTrucksCount} Camión(es) Completo(s) (${formatCLP(fullTrucksSubtotal)}) + Carga Fraccionada Sobrante (${formatCLP(overflowSubtotal)})`;
    } else {
      serviceType = "camion_completo";
      estimatedPriceNet = fullTrucksSubtotal;
      breakdownDetails = `${fullTrucksCount} Camión(es) Completo(s) (${formatCLP(fullTrucksSubtotal)})`;
    }

  } else {
    // B) Carga menor a 1 camión completo: 100% Carga Fraccionada
    serviceType = "fraccionada";

    const priceByWeight = totalWeightKg * TARIFF_CONFIG.fractionalRates.ratePerKg;
    const priceByVolume = totalVolumeM3 * TARIFF_CONFIG.fractionalRates.ratePerM3;

    estimatedPriceNet = Math.max(priceByWeight, priceByVolume);
    breakdownDetails = `Carga Fraccionada basada en ${totalWeightKg} kg / ${totalVolumeM3.toFixed(2)} m³`;
  }

  // Redondeo comercial limpio en CLP
  const finalNetCLP = Math.round(estimatedPriceNet / 1000) * 1000;
  const finalIvaCLP = Math.round(finalNetCLP * TARIFF_CONFIG.ivaRate);
  const finalTotalCLP = finalNetCLP + finalIvaCLP;

  return {
    success: true,
    serviceType,
    fullTrucksCount,
    totalVolumeM3: totalVolumeM3.toFixed(2),
    totalWeightKg,
    breakdownDetails,
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
 * Formatea un número como divisa CLP limpia ($70.000)
 */
export function formatCLP(amount) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(amount);
}
