/**
 * Transportes SIL - Módulo de Mapa Interactivo de Cobertura V Región (36 Comunas)
 * 
 * Réplica exacta del diseño vectorial Dark Premium con las 36 comunas de la 5ta Región:
 * - ZONA NORTE: Azul (#1d4ed8)
 * - ZONA CENTRO: Verde (#059669)
 * - ZONA ESTE: Rojo (#dc2626)
 * - ZONA COSTA: Celeste/Cian (#00b4d8)
 */

import { getComunaInfo } from '../config/coverage.js';
import { preselectDestination } from './calculator.js';

let leafletMap = null;
let geojsonLayer = null;
let originMarker = null;
let routeLine = null;
let selectedComunaId = 'casablanca'; // Casablanca seleccionada por defecto como en la referencia

export function initInteractiveMap() {
  const mapContainer = document.getElementById('map-vector-container');
  if (!mapContainer) return;

  // Renderizar la estructura del contenedor con leyenda inferior integrativa
  mapContainer.innerHTML = `
    <div class="sil-map-card">
      <div id="map"></div>
      
      <!-- Texto Océano Pacífico -->
      <div class="ocean-label">OCÉANO PACÍFICO</div>

      <!-- Leyenda de Zonas en la parte inferior del mapa -->
      <div class="sil-map-legend">
        <div class="legend-item"><span class="legend-dot norte"></span> ZONA NORTE</div>
        <div class="legend-item"><span class="legend-dot centro"></span> ZONA CENTRO</div>
        <div class="legend-item"><span class="legend-dot este"></span> ZONA ESTE</div>
        <div class="legend-item"><span class="legend-dot costa"></span> ZONA COSTA</div>
      </div>
    </div>
  `;

  if (window.L) {
    initLeafletGISMap();
  } else {
    window.addEventListener('load', () => {
      if (window.L) initLeafletGISMap();
    });
  }

  // Escuchar clicks en botones "Cotizar mi envío"
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-quote-comuna')) {
      const comunaId = e.target.getAttribute('data-comuna-id');
      if (comunaId) {
        preselectDestination(comunaId);
      }
    }
  });
}

async function initLeafletGISMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  // Coordenadas Origen Santiago (Base Operativa)
  const santiagoCoords = [-33.4489, -70.6693];

  // Inicializar Leaflet sobre fondo azul marino profundo (#060d1e)
  leafletMap = L.map('map', {
    center: [-32.85, -71.10],
    zoom: 8.5,
    zoomControl: false, // Ocultar controles predeterminados para una estética limpia
    attributionControl: false,
    scrollWheelZoom: false
  });

  // Capa Base CartoDB Dark Matter muy tenue para textura discreta
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    opacity: 0.15,
    subdomains: 'abcd'
  }).addTo(leafletMap);

  // Cargar Dataset GeoJSON Real de las 36 Comunas de la 5ta Región
  try {
    const response = await fetch('assets/maps/valparaiso-comunas.geojson?v=1042');
    if (response.ok) {
      const geojsonData = await response.json();
      renderGeoJSONComunas(geojsonData);
    }
  } catch (err) {
    console.warn('Error al cargar GeoJSON:', err);
  }

  // Marcador Origen Santiago (Badge Flotante en la parte inferior derecha)
  const iconOrigin = L.divIcon({
    className: 'sil-origin-wrapper',
    html: `
      <div class="sil-origin-badge">
        <span class="origin-pin">📍</span>
        <div class="origin-text">
          <strong>SANTIAGO</strong>
          <small>(ORIGEN)</small>
        </div>
      </div>
    `,
    iconSize: [140, 44],
    iconAnchor: [70, 22]
  });

  originMarker = L.marker([-33.38, -70.75], { icon: iconOrigin, zIndexOffset: 1000 }).addTo(leafletMap);

  // Seleccionar Casablanca por defecto como en la captura
  const casablancaInfo = getComunaInfo('casablanca');
  if (casablancaInfo) {
    showComunaDetail(casablancaInfo);
    updateRouteLine(santiagoCoords, [-33.32, -71.40]);
  }

  // Ajustar encuadre responsivo para incluir toda la 5ta Región (de Petorca a San Antonio y Cordillera)
  const initialBounds = L.latLngBounds([
    [-32.15, -71.60], // Norte (La Ligua / Petorca / Papudo)
    [-33.85, -70.00]  // Sur / Cordillera (San Antonio / Los Andes)
  ]);
  leafletMap.fitBounds(initialBounds, { padding: [15, 15] });

  setTimeout(() => {
    if (leafletMap) leafletMap.invalidateSize();
  }, 250);

  window.addEventListener('resize', () => {
    if (leafletMap) leafletMap.invalidateSize();
  });
}

function renderGeoJSONComunas(geojsonData) {
  if (!leafletMap) return;

  geojsonLayer = L.geoJSON(geojsonData, {
    style: (feature) => {
      const comunaId = feature.properties.id;
      const color = feature.properties.color || '#00b4d8';
      const isSelected = comunaId === selectedComunaId;

      return {
        fillColor: color,
        fillOpacity: isSelected ? 0.95 : 0.72,
        color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
        weight: isSelected ? 3.5 : 1.5,
        opacity: 1
      };
    },

    onEachFeature: (feature, layer) => {
      const comunaId = feature.properties.id;
      const comunaName = feature.properties.name;

      // 1. Etiqueta de Texto Fija sobre el polígono en mayúsculas
      const centerPos = layer.getBounds ? layer.getBounds().getCenter() : null;
      if (centerPos) {
        const labelIcon = L.divIcon({
          className: 'comuna-label-wrapper',
          html: `<span class="comuna-text-bold">${comunaName.toUpperCase()}</span>`,
          iconSize: [120, 20],
          iconAnchor: [60, 10]
        });

        L.marker(centerPos, { icon: labelIcon, interactive: false, zIndexOffset: 200 }).addTo(leafletMap);
      }

      // 2. Hover en Polígono
      layer.on('mouseover', function () {
        if (selectedComunaId !== comunaId) {
          this.setStyle({
            fillOpacity: 0.9,
            color: '#ffffff',
            weight: 2.5
          });
        }
      });

      layer.on('mouseout', function () {
        if (selectedComunaId !== comunaId) {
          geojsonLayer.resetStyle(this);
        }
      });

      // 3. Click en Polígono
      layer.on('click', function () {
        selectedComunaId = comunaId;
        
        // Resetear estilos y aplicar estilo a la seleccionada
        geojsonLayer.eachLayer(l => geojsonLayer.resetStyle(l));
        this.setStyle({
          fillOpacity: 0.95,
          color: '#ffffff',
          weight: 3.5
        });

        const destPos = centerPos || this.getBounds().getCenter();
        updateRouteLine([-33.38, -70.75], destPos);

        const info = getComunaInfo(comunaId);
        if (info) {
          showComunaDetail(info);
        }
      });
    }
  }).addTo(leafletMap);
}

/**
 * Dibuja la curva discontinua desde Santiago al destino seleccionado
 */
function updateRouteLine(startCoords, endCoords) {
  if (!leafletMap) return;

  const midLat = (startCoords[0] + endCoords[0]) / 2 + 0.04;
  const midLng = (startCoords[1] + endCoords[1]) / 2 - 0.04;
  const curvePoints = [startCoords, [midLat, midLng], endCoords];

  if (routeLine) {
    routeLine.setLatLngs(curvePoints);
  } else {
    routeLine = L.polyline(curvePoints, {
      color: '#38bdf8',
      weight: 2.5,
      dashArray: '6, 8',
      opacity: 0.85
    }).addTo(leafletMap);
  }
}

/**
 * Renderiza el card lateral exacto a la captura de referencia
 */
function showComunaDetail(info) {
  const infoCard = document.getElementById('map-info-card');
  if (!infoCard) return;

  const displayZone = info.zone || 'V REGIÓN';

  infoCard.innerHTML = `
    <div class="sil-detail-card animate-fade-in">
      <div class="sil-detail-header">
        <span class="sil-zone-title">${displayZone}</span>
        <h2 class="sil-comuna-heading">${info.name}</h2>
      </div>

      <div class="sil-detail-divider"></div>

      <div class="sil-detail-list">
        <div class="sil-detail-row">
          <div class="sil-detail-icon">📅</div>
          <div class="sil-detail-text">
            <span class="sil-detail-label">DÍAS DE ATENCIÓN</span>
            <span class="sil-detail-value blue-highlight">${info.days}</span>
          </div>
        </div>

        <div class="sil-detail-row">
          <div class="sil-detail-icon">🚚</div>
          <div class="sil-detail-text">
            <span class="sil-detail-label">FRECUENCIA</span>
            <span class="sil-detail-value">${info.scheduleNote || 'Salidas diarias Lunes a Viernes'}</span>
          </div>
        </div>

        <div class="sil-detail-row">
          <div class="sil-detail-icon">📍</div>
          <div class="sil-detail-text">
            <span class="sil-detail-label">COBERTURA</span>
            <span class="sil-detail-value">Habilitado para retiro en Santiago y entrega directa en ${info.name}</span>
          </div>
        </div>
      </div>

      <button class="btn btn-primary btn-block btn-quote-comuna sil-action-btn" data-comuna-id="${info.id}">
        Cotizar mi envío a ${info.name} →
      </button>
    </div>
  `;
}
