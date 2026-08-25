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
      distanceKm: 260,
      name: "Valparaíso",
      provincia: "Provincia de Valparaíso",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Salidas diarias de consolidado",
      hasService: true,
      popular: true
    },
    {
      id: "vina-del-mar",
      distanceKm: 270,
      name: "Viña del Mar",
      provincia: "Provincia de Valparaíso",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Salidas diarias AM / PM",
      hasService: true,
      popular: true
    },
    {
      id: "concon",
      distanceKm: 300,
      name: "Concón",
      provincia: "Provincia de Valparaíso",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Ruta diaria sector industrial y comercial",
      hasService: true,
      popular: true
    },
    {
      id: "casablanca",
      distanceKm: 210,
      name: "Casablanca",
      provincia: "Provincia de Valparaíso",
      zone: "ZONA CENTRO",
      colorClass: "zone-centro",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Paso directo en Ruta 68",
      hasService: true,
      popular: true
    },
    {
      id: "quintero",
      distanceKm: 320,
      name: "Quintero",
      provincia: "Provincia de Valparaíso",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos y retiros programados",
      hasService: true,
      popular: false
    },
    {
      id: "puchuncavi",
      distanceKm: 310,
      name: "Puchuncaví",
      provincia: "Provincia de Valparaíso",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos y retiros programados",
      hasService: true,
      popular: false
    },
    {
      id: "quilpue",
      distanceKm: 250,
      name: "Quilpué",
      provincia: "Provincia de Marga Marga",
      zone: "ZONA CENTRO",
      colorClass: "zone-centro",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Frecuencia diaria garantizada",
      hasService: true,
      popular: true
    },
    {
      id: "villa-alemana",
      distanceKm: 260,
      name: "Villa Alemana",
      provincia: "Provincia de Marga Marga",
      zone: "ZONA CENTRO",
      colorClass: "zone-centro",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Frecuencia diaria garantizada",
      hasService: true,
      popular: true
    },
    {
      id: "limache",
      distanceKm: 230,
      name: "Limache",
      provincia: "Provincia de Marga Marga",
      zone: "ZONA CENTRO",
      colorClass: "zone-centro",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "olmue",
      distanceKm: 230,
      name: "Olmué",
      provincia: "Provincia de Marga Marga",
      zone: "ZONA CENTRO",
      colorClass: "zone-centro",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "quillota",
      distanceKm: 180,
      name: "Quillota",
      provincia: "Provincia de Quillota",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos diarios a bodegas y locales",
      hasService: true,
      popular: true
    },
    {
      id: "la-calera",
      distanceKm: 210,
      name: "La Calera",
      provincia: "Provincia de Quillota",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Frecuencia regular de transporte",
      hasService: true,
      popular: true
    },
    {
      id: "la-cruz",
      distanceKm: 200,
      name: "La Cruz",
      provincia: "Provincia de Quillota",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "hijuelas",
      distanceKm: 230,
      name: "Hijuelas",
      provincia: "Provincia de Quillota",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "nogales",
      distanceKm: 220,
      name: "Nogales",
      provincia: "Provincia de Quillota",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "la-ligua",
      distanceKm: 340,
      name: "La Ligua",
      provincia: "Provincia de Petorca",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "cabildo",
      distanceKm: 390,
      name: "Cabildo",
      provincia: "Provincia de Petorca",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "petorca",
      distanceKm: 430,
      name: "Petorca",
      provincia: "Provincia de Petorca",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "papudo",
      distanceKm: 370,
      name: "Papudo",
      provincia: "Provincia de Petorca",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "zapallar",
      distanceKm: 360,
      name: "Zapallar",
      provincia: "Provincia de Petorca",
      zone: "ZONA NORTE",
      colorClass: "zone-norte",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "san-antonio",
      distanceKm: 260,
      name: "San Antonio",
      provincia: "Provincia de San Antonio",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Conexión directa puerto y zona industrial",
      hasService: true,
      popular: true
    },
    {
      id: "algarrobo",
      distanceKm: 270,
      name: "Algarrobo",
      provincia: "Provincia de San Antonio",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "cartagena",
      distanceKm: 280,
      name: "Cartagena",
      provincia: "Provincia de San Antonio",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "el-quisco",
      distanceKm: 280,
      name: "El Quisco",
      provincia: "Provincia de San Antonio",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "el-tabo",
      distanceKm: 290,
      name: "El Tabo",
      provincia: "Provincia de San Antonio",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "santo-domingo",
      distanceKm: 280,
      name: "Santo Domingo",
      provincia: "Provincia de San Antonio",
      zone: "ZONA COSTA",
      colorClass: "zone-costa",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "san-felipe",
      distanceKm: 210,
      name: "San Felipe",
      provincia: "Provincia de San Felipe de Aconcagua",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Ruta cordillerana programada",
      hasService: true,
      popular: true
    },
    {
      id: "catemu",
      distanceKm: 190,
      name: "Catemu",
      provincia: "Provincia de San Felipe de Aconcagua",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
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
      popular: false
    },
    {
      id: "panquehue",
      distanceKm: 200,
      name: "Panquehue",
      provincia: "Provincia de San Felipe de Aconcagua",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "putaendo",
      distanceKm: 240,
      name: "Putaendo",
      provincia: "Provincia de San Felipe de Aconcagua",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "santa-maria",
      distanceKm: 220,
      name: "Santa María",
      provincia: "Provincia de San Felipe de Aconcagua",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "los-andes",
      distanceKm: 150,
      name: "Los Andes",
      provincia: "Provincia de Los Andes",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Ruta cordillerana programada",
      hasService: true,
      popular: true
    },
    {
      id: "calle-larga",
      distanceKm: 160,
      name: "Calle Larga",
      provincia: "Provincia de Los Andes",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "rinconada",
      distanceKm: 170,
      name: "Rinconada",
      provincia: "Provincia de Los Andes",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
    },
    {
      id: "san-esteban",
      distanceKm: 160,
      name: "San Esteban",
      provincia: "Provincia de Los Andes",
      zone: "ZONA ESTE",
      colorClass: "zone-este",
      days: DEFAULT_SERVICE_DAYS,
      scheduleNote: "Despachos programados",
      hasService: true,
      popular: false
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
