/**
 * Transportes SIL - Módulo de Mapa Interactivo de Cobertura V Región (Leaflet GIS Real GeoJSON)
 * 
 * Carga geometrías GeoJSON reales de las comunas de la V Región de Valparaíso
 * con marcadores personalizados (A: Santiago Origen / B: Destino seleccionado)
 * y trazado sutil de ruta.
 */

import { getComunaInfo } from '../config/coverage.js';
import { preselectDestination } from './calculator.js';

let leafletMap = null;
let geojsonLayer = null;
let originMarker = null;
let destMarker = null;
let routeLine = null;
let selectedComunaId = null;

// Mapa de colores temáticos corporativos por zona de cobertura
const ZONE_COLORS = {
  'Costa': '#0284c7',       // Valparaíso, Viña del Mar, Concón (Azul Oceánico)
  'Marga Marga': '#06b6d4', // Quilpué, Villa Alemana, Limache (Cian)
  'Interior': '#3b82f6',    // Quillota, La Calera (Azul Corporativo)
  'Valparaíso': '#10b981',   // Casablanca (Verde Logística)
  'Costa Sur': '#10b981',   // San Antonio (Verde Puerto)
  'Aconcagua': '#6366f1'    // San Felipe, Los Andes (Índigo)
};

export function initInteractiveMap() {
  const mapContainer = document.getElementById('map-vector-container');
  if (!mapContainer) return;

  // Renderizar la estructura del contenedor de Leaflet con dimensiones explícitas
  mapContainer.innerHTML = `
    <div class="map-card-wrapper">
      <div id="map"></div>
    </div>
  `;

  // Asegurar que Leaflet.js esté listo
  if (window.L) {
    initLeafletGISMap();
  } else {
    // Si Leaflet no ha terminado de cargar, esperar al evento load
    window.addEventListener('load', () => {
      if (window.L) initLeafletGISMap();
    });
  }

  // Escuchar eventos globales de selección desde botones externos ("Cotizar mi envío a...")
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-quote-comuna')) {
      const comunaId = e.target.getAttribute('data-comuna-id');
      if (comunaId) {
        preselectDestination(comunaId);
      }
    }
  });
}

/**
 * Inicializa el mapa Leaflet GIS con GeoJSON Real de la V Región + Santiago (Origen A)
 */
async function initLeafletGISMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  // Evitar duplicación de mapa si ya existe una instancia activa
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  // Coordenadas Origen Santiago (Base Operativa)
  const santiagoCoords = [-33.4489, -70.6693];

  // Instanciar mapa con centro hacia el corredor Santiago — Valparaíso
  leafletMap = L.map('map', {
    center: [-33.10, -71.10],
    zoom: 9,
    zoomControl: true,
    attributionControl: false,
    scrollWheelZoom: false // Evitar captura accidental del scroll de página
  });

  // Capa Base CartoDB Dark Matter (Estética "Dark Premium" limpia con baja distracción visual)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    subdomains: 'abcd'
  }).addTo(leafletMap);

  // Marcador A: Santiago (Origen Fijo de Todos los Despachos)
  const iconOriginA = L.divIcon({
    className: 'sil-marker-wrapper',
    html: `
      <div class="sil-map-badge badge-origin">
        <span class="badge-letter">A</span>
        <span class="badge-title">Santiago (Origen)</span>
      </div>
    `,
    iconSize: [150, 36],
    iconAnchor: [75, 18]
  });

  originMarker = L.marker(santiagoCoords, { icon: iconOriginA, zIndexOffset: 1000 }).addTo(leafletMap);
  originMarker.bindTooltip('📍 Santiago — Base Operativa de Salidas Diarias', { direction: 'top', offset: [0, -10] });

  // Cargar Dataset GeoJSON Real de las 12 Comunas de Cobertura V Región
  try {
    let geojsonData = null;
    const response = await fetch('assets/maps/valparaiso-comunas.geojson?v=1036');
    if (response.ok) {
      geojsonData = await response.json();
    }

    if (geojsonData) {
      renderGeoJSONComunas(geojsonData);
    }
  } catch (err) {
    console.warn('Cargando mapa GeoJSON desde dataset alternativo...', err);
  }

  // Ajustar vista inicial para abarcar Santiago + V Región
  const initialBounds = L.latLngBounds([
    [-32.55, -71.75], // Noroeste (Costa V Región)
    [-33.60, -70.30]  // Sudeste (Santiago / Los Andes)
  ]);
  leafletMap.fitBounds(initialBounds, { padding: [20, 20] });

  // Forzar cálculo de dimensiones de Leaflet para garantizar renderizado perfecto
  setTimeout(() => {
    if (leafletMap) leafletMap.invalidateSize();
  }, 250);

  // Re-calcular dimensiones si la ventana cambia de tamaño
  window.addEventListener('resize', () => {
    if (leafletMap) leafletMap.invalidateSize();
  });
}

/**
 * Renderiza los polígonos GeoJSON de las comunas en el mapa
 */
function renderGeoJSONComunas(geojsonData) {
  if (!leafletMap) return;

  geojsonLayer = L.geoJSON(geojsonData, {
    style: (feature) => {
      const zone = feature.properties.zone || 'Costa';
      const baseColor = ZONE_COLORS[zone] || '#3b82f6';

      return {
        fillColor: baseColor,
        fillOpacity: 0.38,
        color: '#38bdf8',
        weight: 1.5,
        opacity: 0.8
      };
    },

    onEachFeature: (feature, layer) => {
      const props = feature.properties;
      const comunaId = props.id;
      const comunaName = props.name;

      // 1. Etiqueta de Texto Fija sobre el Centroide de la Comuna
      const centerLatLng = getFeatureCenter(layer);
      if (centerLatLng) {
        const labelIcon = L.divIcon({
          className: 'comuna-label-wrapper',
          html: `<span class="comuna-map-label">${comunaName.toUpperCase()}</span>`,
          iconSize: [120, 20],
          iconAnchor: [60, 10]
        });

        const labelMarker = L.marker(centerLatLng, {
          icon: labelIcon,
          interactive: false,
          zIndexOffset: 100
        }).addTo(leafletMap);
      }

      // 2. Efecto Hover en Polígonos
      layer.on('mouseover', function (e) {
        if (selectedComunaId !== comunaId) {
          this.setStyle({
            fillOpacity: 0.68,
            color: '#ffffff',
            weight: 2.5
          });
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            this.bringToFront();
          }
        }
      });

      layer.on('mouseout', function () {
        if (selectedComunaId !== comunaId) {
          geojsonLayer.resetStyle(this);
        }
      });

      // 3. Selección de Comuna al hacer Clic
      layer.on('click', function (e) {
        selectComunaOnMap(comunaId, comunaName, centerLatLng, this);
      });
    }
  }).addTo(leafletMap);
}

/**
 * Selecciona una comuna en el mapa, actualiza los marcadores, la ruta y el panel contextual
 */
function selectComunaOnMap(comunaId, comunaName, centerLatLng, layerInstance) {
  selectedComunaId = comunaId;

  // Restablecer estilos de todas las comunas
  if (geojsonLayer) {
    geojsonLayer.eachLayer(l => geojsonLayer.resetStyle(l));
  }

  // Destacar el polígono seleccionado
  if (layerInstance) {
    layerInstance.setStyle({
      fillOpacity: 0.85,
      color: '#60a5fa',
      weight: 3.5
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layerInstance.bringToFront();
    }
  }

  const santiagoCoords = [-33.4489, -70.6693];
  const destCoords = centerLatLng || layerInstance.getBounds().getCenter();

  // 1. Crear o actualizar Marcador B (Destino)
  const iconDestB = L.divIcon({
    className: 'sil-marker-wrapper',
    html: `
      <div class="sil-map-badge badge-dest animate-pop">
        <span class="badge-letter">B</span>
        <span class="badge-title">${comunaName}</span>
      </div>
    `,
    iconSize: [160, 36],
    iconAnchor: [80, 18]
  });

  if (destMarker) {
    destMarker.setLatLng(destCoords);
    destMarker.setIcon(iconDestB);
  } else {
    destMarker = L.marker(destCoords, { icon: iconDestB, zIndexOffset: 2000 }).addTo(leafletMap);
  }

  // 2. Crear o actualizar la línea de conexión sutil Santiago -> Destino
  if (routeLine) {
    routeLine.setLatLngs([santiagoCoords, destCoords]);
  } else {
    routeLine = L.polyline([santiagoCoords, destCoords], {
      color: '#38bdf8',
      weight: 2,
      dashArray: '6, 8',
      opacity: 0.75
    }).addTo(leafletMap);
  }

  // 3. Ajustar vista suavemente para encuadrar Origen A y Destino B
  const routeBounds = L.latLngBounds([santiagoCoords, destCoords]);
  leafletMap.fitBounds(routeBounds, { padding: [60, 60], maxZoom: 11 });

  // 4. Mostrar información contextual en el panel lateral
  const info = getComunaInfo(comunaId);
  if (info) {
    showComunaDetail(info);
  }
}

/**
 * Calcula el centroide geográfico o centro de límites de una capa GeoJSON
 */
function getFeatureCenter(layer) {
  if (layer.getBounds) {
    return layer.getBounds().getCenter();
  }
  return null;
}

/**
 * Muestra los detalles de la comuna en el card de información lateral
 */
function showComunaDetail(info) {
  const infoCard = document.getElementById('map-info-card');
  if (!infoCard) return;

  infoCard.innerHTML = `
    <div class="comuna-detail-inner animate-fade-in">
      <div class="comuna-detail-header">
        <span class="comuna-zone-badge">${info.zone}</span>
        <h3>${info.name}</h3>
      </div>
      <div class="comuna-detail-body">
        <div class="detail-item">
          <span class="detail-label">🗓️ Días de atención:</span>
          <span class="detail-value highlight-text">${info.days}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">🚚 Frecuencia de salida:</span>
          <span class="detail-value">${info.scheduleNote || 'Salidas diarias Lunes a Viernes'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">📍 Cobertura:</span>
          <span class="detail-value">Habilitado para retiros en Santiago y entrega directa en ${info.name}</span>
        </div>
      </div>
      <button class="btn btn-primary btn-block btn-quote-comuna mt-4" data-comuna-id="${info.id}">
        Cotizar mi envío a ${info.name} →
      </button>
    </div>
  `;

  infoCard.classList.remove('hidden');
}
