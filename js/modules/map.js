/**
 * Transportes SIL - Módulo de Mapa Interactivo de Cobertura V Región
 * 
 * Renderiza la visualización de mapa GIS Coroplético de la V Región de Valparaíso
 * con marcadores dinámicos Leaflet.js para Origen (A) y Destino (B).
 */

import { COVERAGE_DATA, getComunaInfo } from '../config/coverage.js';
import { preselectDestination } from './calculator.js';

export function initInteractiveMap() {
  const mapContainer = document.getElementById('map-vector-container');
  const tooltip = document.getElementById('map-tooltip');

  if (!mapContainer) return;

  // Cargar mapa interactivo Leaflet.js o SVG Coroplético
  if (window.L) {
    initLeafletGISMap(mapContainer);
  } else {
    mapContainer.innerHTML = createVectorChoroplethSVGMap();
    bindSVGMapEvents(mapContainer, tooltip);
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

/**
 * Inicializa el mapa GIS interactivo Leaflet con marcadores personalizados (A: Santiago / B: Destino)
 */
function initLeafletGISMap(container) {
  container.innerHTML = `
    <div class="map-card">
      <div id="map"></div>
    </div>
  `;

  const map = L.map('map', {
    center: [-33.15, -71.2],
    zoom: 9,
    zoomControl: true,
    attributionControl: false
  });

  // Capa Base CartoDB Dark Matter
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    subdomains: 'abcd'
  }).addTo(map);

  // Iconos Personalizados Leaflet
  const silIcon = L.divIcon({
    className: "sil-marker",
    html: `<div class="sil-marker-dot"></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

  const originIcon = L.divIcon({
    className: "map-marker",
    html: `<div class="marker-origin">A</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

  const destinationIcon = L.divIcon({
    className: "map-marker",
    html: `<div class="marker-destination">B</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

  // Marcador Origen A: Santiago
  const originMarker = L.marker([-33.4489, -70.6693], { icon: originIcon }).addTo(map);
  originMarker.bindPopup(`<strong>📍 Origen: Santiago</strong><br/><small>Base Operativa de Retiros</small>`);

  // Marcador Destino B: Valparaíso (Puerto)
  const destMarker = L.marker([-33.0472, -71.6127], { icon: destinationIcon }).addTo(map);
  destMarker.bindPopup(`<strong>📍 Destino: Valparaíso</strong><br/><small>Despachos Diarios Lun-Vie</small>`);

  // GeoJSON Dataset de Comunas V Región
  const comunaFeatures = [
    { id: 'valparaiso', name: 'Valparaíso', color: '#0077b6', coords: [[-33.02, -71.65], [-33.00, -71.61], [-33.05, -71.55], [-33.15, -71.48], [-33.22, -71.58], [-33.15, -71.68]] },
    { id: 'vina-del-mar', name: 'Viña del Mar', color: '#00b4d8', coords: [[-32.95, -71.57], [-32.93, -71.52], [-33.00, -71.45], [-33.08, -71.48], [-33.05, -71.55], [-33.00, -71.61]] },
    { id: 'concon', name: 'Concón', color: '#90e0ef', coords: [[-32.88, -71.55], [-32.87, -71.50], [-32.93, -71.45], [-32.93, -71.52], [-32.95, -71.57]] },
    { id: 'quilpue', name: 'Quilpué', color: '#0096c7', coords: [[-33.08, -71.48], [-33.00, -71.45], [-33.02, -71.30], [-33.12, -71.25], [-33.20, -71.38], [-33.15, -71.48]] },
    { id: 'villa-alemana', name: 'Villa Alemana', color: '#48cae4', coords: [[-33.02, -71.28], [-33.01, -71.18], [-33.10, -71.15], [-33.12, -71.25]] },
    { id: 'limache', name: 'Limache', color: '#03045e', coords: [[-32.95, -71.30], [-32.92, -71.20], [-33.00, -71.12], [-33.10, -71.15], [-33.02, -71.28]] },
    { id: 'quillota', name: 'Quillota', color: '#023e8a', coords: [[-32.82, -71.35], [-32.80, -71.20], [-32.92, -71.15], [-32.95, -71.30], [-32.93, -71.45]] },
    { id: 'la-calera', name: 'La Calera', color: '#0077b6', coords: [[-32.75, -71.22], [-32.72, -71.10], [-32.82, -71.05], [-32.80, -71.20]] },
    { id: 'casablanca', name: 'Casablanca', color: '#0096c7', coords: [[-33.22, -71.58], [-33.15, -71.48], [-33.12, -71.25], [-33.28, -71.08], [-33.45, -71.15], [-33.48, -71.42], [-33.38, -71.60]] },
    { id: 'san-antonio', name: 'San Antonio', color: '#00b4d8', coords: [[-33.52, -71.65], [-33.38, -71.60], [-33.48, -71.42], [-33.68, -71.35], [-33.72, -71.62]] },
    { id: 'san-felipe', name: 'San Felipe', color: '#023e8a', coords: [[-32.70, -71.02], [-32.65, -70.68], [-32.80, -70.62], [-32.82, -71.00]] },
    { id: 'los-andes', name: 'Los Andes', color: '#03045e', coords: [[-32.65, -70.68], [-32.60, -70.35], [-32.88, -70.32], [-32.80, -70.62]] }
  ];

  comunaFeatures.forEach(item => {
    const polygon = L.polygon(item.coords, {
      color: '#081c36',
      weight: 1.5,
      fillColor: item.color,
      fillOpacity: 0.75
    }).addTo(map);

    const info = getComunaInfo(item.id);
    const popupContent = `<strong>${item.name}</strong><br/><small>Días: ${info?.days || 'Consulte'}</small>`;

    polygon.bindPopup(popupContent);
    polygon.bindTooltip(item.name, { sticky: true });

    polygon.on('mouseover', function () {
      this.setStyle({ fillOpacity: 0.95, weight: 2.5, color: '#00ffff' });
    });

    polygon.on('mouseout', function () {
      this.setStyle({ fillOpacity: 0.75, weight: 1.5, color: '#081c36' });
    });

    polygon.on('click', function () {
      if (info) showComunaDetail(info);
    });
  });
}

function bindSVGMapEvents(mapContainer, tooltip) {
  const comunaPaths = mapContainer.querySelectorAll('.map-comuna-path');
  comunaPaths.forEach(path => {
    const comunaId = path.getAttribute('data-comuna-id');
    const info = getComunaInfo(comunaId);

    if (!info) return;

    path.addEventListener('mouseenter', () => {
      if (tooltip) {
        tooltip.innerHTML = `<strong>${info.name}</strong><br/><small>Días: ${info.days}</small>`;
        tooltip.classList.remove('hidden');
      }
    });

    path.addEventListener('mousemove', (e) => {
      if (tooltip) {
        const rect = mapContainer.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - rect.left + 15}px`;
        tooltip.style.top = `${e.clientY - rect.top - 10}px`;
      }
    });

    path.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.classList.add('hidden');
    });

    path.addEventListener('click', () => {
      comunaPaths.forEach(p => p.classList.remove('active'));
      path.classList.add('active');
      showComunaDetail(info);
    });
  });
}

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
          <span class="detail-label">🚚 Frecuencia:</span>
          <span class="detail-value">${info.scheduleNote}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">📍 Cobertura:</span>
          <span class="detail-value">Habilitado para retiro en Santiago y entrega directa</span>
        </div>
      </div>
      <button class="btn btn-primary btn-block btn-quote-comuna mt-4" data-comuna-id="${info.id}">
        Cotizar mi envío a ${info.name} →
      </button>
    </div>
  `;

  infoCard.classList.remove('hidden');
}

/**
 * Genera el mapa vectorial coroplético SVG (Choropleth GIS)
 */
function createVectorChoroplethSVGMap() {
  return `
    <svg viewBox="0 0 880 540" class="svg-map-element" xmlns="http://www.w3.org/2000/svg" style="background: #060b17; border-radius: 12px;">
      <defs>
        <linearGradient id="deepOcean" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#040814" />
          <stop offset="100%" stop-color="#0a1226" />
        </linearGradient>

        <linearGradient id="santiagoBadgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#d97706" />
        </linearGradient>
      </defs>

      <rect width="880" height="540" fill="url(#deepOcean)" rx="16" />
      <path d="M 0,0 L 175,0 L 130,540 L 0,540 Z" fill="#02040a" opacity="0.9" />
      <text x="30" y="270" fill="#1e293b" font-size="13" font-weight="700" transform="rotate(-90 30 270)" letter-spacing="5">OCÉANO PACÍFICO</text>

      <g transform="translate(60, 60)" opacity="0.4">
        <circle cx="0" cy="0" r="18" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="2,2"/>
        <polygon points="0,-22 4,-6 0,0 -4,-6" fill="#38bdf8"/>
        <polygon points="0,22 4,6 0,0 -4,6" fill="#64748b"/>
        <text x="-4" y="-26" fill="#38bdf8" font-size="9" font-weight="800">N</text>
      </g>

      <g class="comunas-choropleth-group" stroke="#050e1f" stroke-width="1.5" stroke-linejoin="round">
        <g class="map-comuna-path" data-comuna-id="valparaiso">
          <polygon points="140,240 160,225 185,220 205,245 220,270 210,310 175,340 145,315 130,275" fill="#0077b6" fill-opacity="0.85" />
          <text x="175" y="280" fill="#ffffff" font-size="12" font-weight="800" text-anchor="middle" stroke="none">Valparaíso</text>
        </g>
        <g class="map-comuna-path" data-comuna-id="vina-del-mar">
          <polygon points="185,220 215,195 255,200 270,225 245,255 205,245" fill="#00b4d8" fill-opacity="0.85" />
          <text x="230" y="228" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle" stroke="none">Viña del Mar</text>
        </g>
        <g class="map-comuna-path" data-comuna-id="concon">
          <polygon points="215,195 245,170 280,160 300,185 270,225 255,200" fill="#90e0ef" fill-opacity="0.9" />
          <text x="258" y="192" fill="#03045e" font-size="11" font-weight="800" text-anchor="middle" stroke="none">Concón</text>
        </g>
        <g class="map-comuna-path" data-comuna-id="quilpue">
          <polygon points="270,225 300,185 365,195 390,225 375,275 320,285 245,255" fill="#0096c7" fill-opacity="0.85" />
          <text x="325" y="240" fill="#ffffff" font-size="12" font-weight="800" text-anchor="middle" stroke="none">Quilpué</text>
        </g>
        <g class="map-comuna-path" data-comuna-id="villa-alemana">
          <polygon points="390,225 435,215 460,230 445,270 375,275" fill="#48cae4" fill-opacity="0.85" />
          <text x="420" y="246" fill="#03045e" font-size="11" font-weight="800" text-anchor="middle" stroke="none">Villa Alemana</text>
        </g>
        <g class="map-comuna-path" data-comuna-id="limache">
          <polygon points="435,215 480,205 520,215 530,250 490,285 445,270 460,230" fill="#03045e" fill-opacity="0.85" />
          <text x="480" y="246" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle" stroke="none">Limache</text>
        </g>
        <g class="map-comuna-path" data-comuna-id="quillota">
          <polygon points="300,185 340,140 420,125 465,145 445,185 435,215 365,195" fill="#023e8a" fill-opacity="0.85" />
          <text x="385" y="165" fill="#ffffff" font-size="12" font-weight="800" text-anchor="middle" stroke="none">Quillota</text>
        </g>
        <g class="map-comuna-path" data-comuna-id="la-calera">
          <polygon points="465,145 525,130 570,140 560,185 500,200 445,185" fill="#0077b6" fill-opacity="0.85" />
          <text x="510" y="162" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle" stroke="none">La Calera</text>
        </g>
        <g class="map-comuna-path" data-comuna-id="casablanca">
          <polygon points="175,340 210,310 320,285 445,270 490,285 460,345 410,430 310,460 215,440 160,390" fill="#0096c7" fill-opacity="0.85" />
          <text x="315" y="375" fill="#ffffff" font-size="14" font-weight="800" text-anchor="middle" stroke="none">Casablanca</text>
        </g>
        <g class="map-comuna-path" data-comuna-id="san-antonio">
          <polygon points="160,390 215,440 310,460 260,515 170,520 130,460 140,410" fill="#00b4d8" fill-opacity="0.85" />
          <text x="195" y="465" fill="#ffffff" font-size="13" font-weight="800" text-anchor="middle" stroke="none">San Antonio</text>
        </g>
        <g class="map-comuna-path" data-comuna-id="san-felipe">
          <polygon points="570,140 645,125 715,135 710,185 640,200 560,185" fill="#023e8a" fill-opacity="0.85" />
          <text x="635" y="162" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle" stroke="none">San Felipe</text>
        </g>
        <g class="map-comuna-path" data-comuna-id="los-andes">
          <polygon points="715,135 795,120 835,140 820,205 750,220 710,185" fill="#03045e" fill-opacity="0.85" />
          <text x="765" y="170" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle" stroke="none">Los Andes</text>
        </g>

        <g class="santiago-origin-node" transform="translate(640, 460)" stroke="none">
          <rect x="-100" y="-18" width="200" height="36" rx="18" fill="url(#santiagoBadgeGrad)" stroke="#f59e0b" stroke-width="1.5" />
          <text x="0" y="5" fill="#ffffff" font-size="12" font-weight="800" text-anchor="middle">📍 SANTIAGO (ORIGEN)</text>
        </g>
      </g>
    </svg>
  `;
}
