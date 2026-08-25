// Configuración de comunas y cobertura de la Región de Valparaíso.

export const DEFAULT_SERVICE_DAYS = "Lunes a Viernes";

export const COVERAGE_DATA = {
  region: "V Región de Valparaíso",
  originDefault: "Santiago",
  generalSchedule: DEFAULT_SERVICE_DAYS,
  totalComunasCount: 36,
  comunas: [
    {
      id: "valparaiso",
      name: "Valparaíso",
      provincia: "Provincia de Valparaíso",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Salidas diarias de consolidado",
      hasService: true,
      popular: true,
      distanceKm: undefined
    },
    {
      id: "vina-del-mar",
      name: "Viña del Mar",
      provincia: "Provincia de Valparaíso",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Salidas diarias AM / PM",
      hasService: true,
      popular: true,
      distanceKm: undefined
    },
    {
      id: "concon",
      name: "Concón",
      provincia: "Provincia de Valparaíso",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Ruta diaria sector industrial y comercial",
      hasService: true,
      popular: true,
      distanceKm: undefined
    },
    {
      id: "casablanca",
      name: "Casablanca",
      provincia: "Provincia de Valparaíso",
      zone: "ZONA CENTRO",
      colorClass: "zone-centro",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Paso directo en Ruta 68",
      hasService: true,
      popular: true,
      distanceKm: undefined
    },
    {
      id: "quintero",
      name: "Quintero",
      provincia: "Provincia de Valparaíso",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos y retiros programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "puchuncavi",
      name: "Puchuncaví",
      provincia: "Provincia de Valparaíso",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos y retiros programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "quilpue",
      name: "Quilpué",
      provincia: "Provincia de Marga Marga",
      zone: "ZONA CENTRO",
      colorClass: "zone-centro",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Frecuencia diaria garantizada",
      hasService: true,
      popular: true,
      distanceKm: undefined
    },
    {
      id: "villa-alemana",
      name: "Villa Alemana",
      provincia: "Provincia de Marga Marga",
      zone: "ZONA CENTRO",
      colorClass: "zone-centro",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Frecuencia diaria garantizada",
      hasService: true,
      popular: true,
      distanceKm: undefined
    },
    {
      id: "limache",
      name: "Limache",
      provincia: "Provincia de Marga Marga",
      zone: "ZONA CENTRO",
      colorClass: "zone-centro",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "olmue",
      name: "Olmué",
      provincia: "Provincia de Marga Marga",
      zone: "ZONA CENTRO",
      colorClass: "zone-centro",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "quillota",
      name: "Quillota",
      provincia: "Provincia de Quillota",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos diarios a bodegas y locales",
      hasService: true,
      popular: true,
      distanceKm: undefined
    },
    {
      id: "la-calera",
      name: "La Calera",
      provincia: "Provincia de Quillota",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Frecuencia regular de transporte",
      hasService: true,
      popular: true,
      distanceKm: undefined
    },
    {
      id: "la-cruz",
      name: "La Cruz",
      provincia: "Provincia de Quillota",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "hijuelas",
      name: "Hijuelas",
      provincia: "Provincia de Quillota",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "nogales",
      name: "Nogales",
      provincia: "Provincia de Quillota",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "la-ligua",
      name: "La Ligua",
      provincia: "Provincia de Petorca",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "cabildo",
      name: "Cabildo",
      provincia: "Provincia de Petorca",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "petorca",
      name: "Petorca",
      provincia: "Provincia de Petorca",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "papudo",
      name: "Papudo",
      provincia: "Provincia de Petorca",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "zapallar",
      name: "Zapallar",
      provincia: "Provincia de Petorca",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "san-antonio",
      name: "San Antonio",
      provincia: "Provincia de San Antonio",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Conexión directa puerto y zona industrial",
      hasService: true,
      popular: true,
      distanceKm: undefined
    },
    {
      id: "algarrobo",
      name: "Algarrobo",
      provincia: "Provincia de San Antonio",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "cartagena",
      name: "Cartagena",
      provincia: "Provincia de San Antonio",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "el-quisco",
      name: "El Quisco",
      provincia: "Provincia de San Antonio",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "el-tabo",
      name: "El Tabo",
      provincia: "Provincia de San Antonio",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "santo-domingo",
      name: "Santo Domingo",
      provincia: "Provincia de San Antonio",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "san-felipe",
      name: "San Felipe",
      provincia: "Provincia de San Felipe de Aconcagua",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Ruta cordillerana programada",
      hasService: true,
      popular: true,
      distanceKm: undefined
    },
    {
      id: "catemu",
      name: "Catemu",
      provincia: "Provincia de San Felipe de Aconcagua",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "llaillay",
      name: "Llaillay",
      provincia: "Provincia de San Felipe de Aconcagua",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "panquehue",
      name: "Panquehue",
      provincia: "Provincia de San Felipe de Aconcagua",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "putaendo",
      name: "Putaendo",
      provincia: "Provincia de San Felipe de Aconcagua",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "santa-maria",
      name: "Santa María",
      provincia: "Provincia de San Felipe de Aconcagua",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "los-andes",
      name: "Los Andes",
      provincia: "Provincia de Los Andes",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Ruta cordillerana programada",
      hasService: true,
      popular: true,
      distanceKm: undefined
    },
    {
      id: "calle-larga",
      name: "Calle Larga",
      provincia: "Provincia de Los Andes",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "rinconada",
      name: "Rinconada",
      provincia: "Provincia de Los Andes",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    },
    {
      id: "san-esteban",
      name: "San Esteban",
      provincia: "Provincia de Los Andes",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false,
      distanceKm: undefined
    }
  ]
};

export function getEnabledComunas() {
  return COVERAGE_DATA.comunas.filter(c => c.hasService);
}

export function getAllComunas() {
  return COVERAGE_DATA.comunas;
}

/**
 * Normaliza una cadena de texto (sin acentos, minúsculas, sin caracteres especiales)
 */
function normalizeId(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/_/g, "-");
}

/**
 * Búsqueda unificada y robusta de comuna por ID o Nombre
 */
export function getComunaInfo(idOrName) {
  if (!idOrName) return null;
  const searchNorm = normalizeId(idOrName);

  const found = COVERAGE_DATA.comunas.find(c => {
    const cIdNorm = normalizeId(c.id);
    const cNameNorm = normalizeId(c.name);
    return cIdNorm === searchNorm || cNameNorm === searchNorm;
  });

  if (!found) {
    console.error(`No se encontró información para la comuna: ${idOrName}`);
  }

  return found || null;
}

/**
 * Validación automática requerida entre IDs de comunas y datos de cobertura
 */
export function validateCoverageData(geojsonIds = []) {
  const covIds = COVERAGE_DATA.comunas.map(c => c.id);
  const covSet = new Set(covIds);
  const duplicates = covIds.filter((item, index) => covIds.indexOf(item) !== index);
  
  let correctCount = 0;
  let missingCount = 0;

  geojsonIds.forEach(gid => {
    if (covSet.has(gid)) {
      correctCount++;
    } else {
      missingCount++;
      console.error(`ID de GeoJSON sin datos en coverage.js: ${gid}`);
    }
  });

  console.log("=== VALIDACIÓN DE COBERTURA ===");
  console.log(`Comunas geográficas: ${geojsonIds.length}`);
  console.log(`Comunas con datos: ${covIds.length}`);
  console.log(`Coincidencias correctas: ${correctCount}`);
  console.log(`Sin información: ${missingCount}`);
  console.log(`IDs duplicados: ${duplicates.length}`);

  return {
    geographic: geojsonIds.length,
    withData: covIds.length,
    matched: correctCount,
    missing: missingCount,
    duplicates: duplicates.length
  };
}
