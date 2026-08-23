import urllib.request, json, math

url = 'https://raw.githubusercontent.com/fcortes/Chile-GeoJSON/master/comunas.geojson'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))

name_to_id = {
    'valparaíso': 'valparaiso', 'valparaiso': 'valparaiso',
    'viña del mar': 'vina-del-mar', 'concón': 'concon', 'concon': 'concon',
    'casablanca': 'casablanca', 'quintero': 'quintero', 'puchuncaví': 'puchuncavi', 'puchuncavi': 'puchuncavi',
    'quilpué': 'quilpue', 'quilpue': 'quilpue', 'villa alemana': 'villa-alemana',
    'limache': 'limache', 'olmué': 'olmue', 'olmue': 'olmue',
    'quillota': 'quillota', 'calera': 'la-calera', 'la calera': 'la-calera',
    'la cruz': 'la-cruz', 'hijuelas': 'hijuelas', 'nogales': 'nogales',
    'la ligua': 'la-ligua', 'cabildo': 'cabildo', 'petorca': 'petorca',
    'papudo': 'papudo', 'zapallar': 'zapallar',
    'san antonio': 'san-antonio', 'algarrobo': 'algarrobo', 'cartagena': 'cartagena',
    'el quisco': 'el-quisco', 'el tabo': 'el-tabo', 'santo domingo': 'santo-domingo',
    'san felipe': 'san-felipe', 'catemu': 'catemu', 'llaillay': 'llaillay',
    'panquehue': 'panquehue', 'putaendo': 'putaendo', 'santa maría': 'santa-maria', 'santa maria': 'santa-maria',
    'los andes': 'los-andes', 'calle larga': 'calle-larga', 'rinconada': 'rinconada',
    'san esteban': 'san-esteban'
}

canonical_names = {
    'valparaiso': 'Valparaíso', 'vina-del-mar': 'Viña del Mar', 'concon': 'Concón',
    'casablanca': 'Casablanca', 'quintero': 'Quintero', 'puchuncavi': 'Puchuncaví',
    'quilpue': 'Quilpué', 'villa-alemana': 'Villa Alemana',
    'limache': 'Limache', 'olmue': 'Olmué', 'quillota': 'Quillota', 'la-calera': 'La Calera',
    'la-cruz': 'La Cruz', 'hijuelas': 'Hijuelas', 'nogales': 'Nogales', 'la-ligua': 'La Ligua',
    'cabildo': 'Cabildo', 'petorca': 'Petorca', 'papudo': 'Papudo', 'zapallar': 'Zapallar',
    'san-antonio': 'San Antonio', 'algarrobo': 'Algarrobo', 'cartagena': 'Cartagena',
    'el-quisco': 'El Quisco', 'el-tabo': 'El Tabo', 'santo-domingo': 'Santo Domingo',
    'san-felipe': 'San Felipe', 'catemu': 'Catemu', 'llaillay': 'Llaillay',
    'panquehue': 'Panquehue', 'putaendo': 'Putaendo', 'santa-maria': 'Santa María',
    'los-andes': 'Los Andes', 'calle-larga': 'Calle Larga', 'rinconada': 'Rinconada',
    'san-esteban': 'San Esteban'
}

# Zone mapping matching reference image exactly
zone_mapping = {
    'valparaiso': ('ZONA COSTA', 'zone-costa', True),
    'vina-del-mar': ('ZONA COSTA', 'zone-costa', True),
    'concon': ('ZONA COSTA', 'zone-costa', True),
    'san-antonio': ('ZONA COSTA', 'zone-costa', True),
    'algarrobo': ('ZONA COSTA', 'zone-costa', False),
    'el-quisco': ('ZONA COSTA', 'zone-costa', False),
    'el-tabo': ('ZONA COSTA', 'zone-costa', False),
    'cartagena': ('ZONA COSTA', 'zone-costa', False),
    'santo-domingo': ('ZONA COSTA', 'zone-costa', False),
    
    'quilpue': ('ZONA CENTRO', 'zone-centro', True),
    'villa-alemana': ('ZONA CENTRO', 'zone-centro', True),
    'limache': ('ZONA CENTRO', 'zone-centro', True),
    'casablanca': ('ZONA CENTRO', 'zone-centro', True),
    'olmue': ('ZONA CENTRO', 'zone-centro', False),
    
    'quillota': ('ZONA NORTE', 'zone-norte', True),
    'la-calera': ('ZONA NORTE', 'zone-norte', True),
    'la-ligua': ('ZONA NORTE', 'zone-norte', False),
    'papudo': ('ZONA NORTE', 'zone-norte', False),
    'zapallar': ('ZONA NORTE', 'zone-norte', False),
    'puchuncavi': ('ZONA NORTE', 'zone-norte', False),
    'quintero': ('ZONA NORTE', 'zone-norte', False),
    
    'san-felipe': ('ZONA ESTE', 'zone-este', True),
    'los-andes': ('ZONA ESTE', 'zone-este', True),
    'catemu': ('ZONA ESTE', 'zone-este', False),
    'putaendo': ('ZONA ESTE', 'zone-este', False),
    'llaillay': ('ZONA ESTE', 'zone-este', False),
    'panquehue': ('ZONA ESTE', 'zone-este', False),
    'santa-maria': ('ZONA ESTE', 'zone-este', False),
    'calle-larga': ('ZONA ESTE', 'zone-este', False),
    'san-esteban': ('ZONA ESTE', 'zone-este', False),

    'petorca': ('Sin Ruta Directa SIL', 'zone-neutral', False),
    'cabildo': ('Sin Ruta Directa SIL', 'zone-neutral', False),
    'hijuelas': ('Sin Ruta Directa SIL', 'zone-neutral', False),
    'la-cruz': ('Sin Ruta Directa SIL', 'zone-neutral', False),
    'nogales': ('Sin Ruta Directa SIL', 'zone-neutral', False),
    'rinconada': ('Sin Ruta Directa SIL', 'zone-neutral', False),
}

provincias_mapping = {
    'valparaiso': 'Provincia de Valparaíso',
    'vina-del-mar': 'Provincia de Valparaíso',
    'concon': 'Provincia de Valparaíso',
    'casablanca': 'Provincia de Valparaíso',
    'quintero': 'Provincia de Valparaíso',
    'puchuncavi': 'Provincia de Valparaíso',
    'quilpue': 'Provincia de Marga Marga',
    'villa-alemana': 'Provincia de Marga Marga',
    'limache': 'Provincia de Marga Marga',
    'olmue': 'Provincia de Marga Marga',
    'quillota': 'Provincia de Quillota',
    'la-calera': 'Provincia de Quillota',
    'la-cruz': 'Provincia de Quillota',
    'hijuelas': 'Provincia de Quillota',
    'nogales': 'Provincia de Quillota',
    'la-ligua': 'Provincia de Petorca',
    'cabildo': 'Provincia de Petorca',
    'petorca': 'Provincia de Petorca',
    'papudo': 'Provincia de Petorca',
    'zapallar': 'Provincia de Petorca',
    'san-antonio': 'Provincia de San Antonio',
    'algarrobo': 'Provincia de San Antonio',
    'cartagena': 'Provincia de San Antonio',
    'el-quisco': 'Provincia de San Antonio',
    'el-tabo': 'Provincia de San Antonio',
    'santo-domingo': 'Provincia de San Antonio',
    'san-felipe': 'Provincia de San Felipe de Aconcagua',
    'catemu': 'Provincia de San Felipe de Aconcagua',
    'llaillay': 'Provincia de San Felipe de Aconcagua',
    'panquehue': 'Provincia de San Felipe de Aconcagua',
    'putaendo': 'Provincia de San Felipe de Aconcagua',
    'santa-maria': 'Provincia de San Felipe de Aconcagua',
    'los-andes': 'Provincia de Los Andes',
    'calle-larga': 'Provincia de Los Andes',
    'rinconada': 'Provincia de Los Andes',
    'san-esteban': 'Provincia de Los Andes'
}

continental = []

for f in data.get('features', []):
    props = f.get('properties', {})
    region = str(props.get('Region') or props.get('REGION') or '')
    code = str(props.get('COD_REGION') or props.get('Region_cod') or '')
    if 'valpara' in region.lower() or code == '5':
        raw_name = (props.get('Comuna') or '').strip()
        cid = name_to_id.get(raw_name.lower())
        if cid and cid not in ['juan-fernandez', 'isla-de-pascua']:
            continental.append((cid, f))

# Canvas 860 x 560 for max 85%-90% usage
canvas_w, canvas_h = 860, 560
offset_x, offset_y = 15, 10
min_lon, max_lon = -71.84, -69.98
min_lat, max_lat = -33.95, -32.02

scale_x = (canvas_w - 30) / (max_lon - min_lon)
scale_y = (canvas_h - 20) / (max_lat - min_lat)

def project(lon, lat):
    x = offset_x + (lon - min_lon) * scale_x
    y = offset_y + (max_lat - lat) * scale_y
    return round(x, 1), round(y, 1)

def coords_to_path(coords):
    if not coords: return ''
    if isinstance(coords[0][0], (int, float)):
        pts = [project(pt[0], pt[1]) for pt in coords]
        return 'M ' + ' L '.join(f'{p[0]},{p[1]}' for p in pts) + ' Z'
    else:
        return ' '.join(coords_to_path(sub) for sub in coords)

comunas_data = []

for cid, f in continental:
    geom = f['geometry']
    gtype = geom['type']
    c_data = geom['coordinates']
    if gtype == 'Polygon': path_d = coords_to_path(c_data)
    elif gtype == 'MultiPolygon': path_d = ' '.join(coords_to_path(poly) for poly in c_data)
    
    all_pts = []
    def extract_pts(c):
        if isinstance(c[0], (int, float)): all_pts.append(project(c[0], c[1]))
        else:
            for sub in c: extract_pts(sub)
    extract_pts(c_data)
    
    avg_x, avg_y = 0, 0
    if all_pts:
        avg_x = round(sum(p[0] for p in all_pts) / len(all_pts), 1)
        avg_y = round(sum(p[1] for p in all_pts) / len(all_pts), 1)

    label_x, label_y = avg_x, avg_y
    
    # Label offsets fine-tuned for legibility matching reference image
    if cid == 'valparaiso': label_x -= 12; label_y += 4
    elif cid == 'vina-del-mar': label_x += 12; label_y -= 4
    elif cid == 'concon': label_x += 16; label_y -= 8
    elif cid == 'quilpue': label_x += 8; label_y += 6
    elif cid == 'villa-alemana': label_x += 10
    elif cid == 'limache': label_y -= 4
    elif cid == 'san-antonio': label_y += 8
    elif cid == 'el-quisco': label_x -= 8
    elif cid == 'el-tabo': label_x -= 6
    elif cid == 'cartagena': label_x -= 6
    elif cid == 'la-cruz': label_x -= 10
    elif cid == 'panquehue': label_x -= 8

    zone_info = zone_mapping.get(cid, ('Sin Ruta Directa SIL', 'zone-neutral', False))
    zone_name, color_cls, has_service = zone_info

    comunas_data.append({
        'id': cid,
        'name': canonical_names[cid],
        'provincia': provincias_mapping.get(cid, 'Provincia de Valparaíso'),
        'zone': zone_name,
        'colorClass': color_cls,
        'hasService': has_service,
        'path': path_d,
        'cx': avg_x,
        'cy': avg_y,
        'labelX': label_x,
        'labelY': label_y,
        'isInset': False
    })

# Write js/modules/map.js
js_content = '''/**
 * Transportes SIL - Módulo de Mapa Interactivo de Cobertura V Región (Ilustración Vectorial 36 Comunas)
 * 
 * Recrea exactamente el diseño infográfico cartográfico de referencia.
 * Las 36 comunas continentales son 100% interactivas y seleccionables.
 */

import { getComunaInfo } from '../config/coverage.js';
import { preselectDestination } from './calculator.js';

let selectedComunaId = 'valparaiso';

const MAP_COMUNAS_DATA = ''' + json.dumps(comunas_data, ensure_ascii=False, indent=2) + ''';

export function initInteractiveMap() {
  const mapContainer = document.getElementById('map-vector-container');
  if (!mapContainer) return;

  mapContainer.innerHTML = `
    <div class="sil-svg-map-card">
      <div class="sil-svg-wrapper">
        <svg class="sil-coverage-svg" viewBox="0 0 860 560" role="img" aria-label="Mapa de cobertura de Transportes SIL en la Región de Valparaíso">
          <!-- Texto Océano Pacífico (Indicado verticalmente a la izquierda) -->
          <text x="25" y="160" class="ocean-text">OCÉANO PACÍFICO</text>

          <!-- Grupo de 36 Comunas Continentales de la V Región -->
          <g class="mainland-group">
            ${MAP_COMUNAS_DATA.map(c => `
              <path 
                id="path-${c.id}"
                class="coverage-comuna ${c.colorClass} ${c.id === selectedComunaId ? 'selected' : ''}" 
                data-comuna="${c.id}" 
                data-name="${c.name}"
                d="${c.path}" 
              >
                <title>${c.name} (${c.zone})</title>
              </path>
            `).join('')}
          </g>

          <!-- Nombres de TODAS las Comunas directamente sobre el mapa -->
          <g class="labels-group">
            ${MAP_COMUNAS_DATA.map(c => `
              <text 
                x="${c.labelX}" 
                y="${c.labelY}" 
                class="map-svg-label label-${c.id}" 
                data-comuna="${c.id}"
              >${c.name}</text>
            `).join('')}
          </g>

          <!-- Línea Curva Punteada Decorativa desde Santiago -->
          <path id="santiago-route-curve" class="route-connection-line" d="M 540 450 Q 420 440 103.7 285.9" />

          <!-- Marcador Santiago Origen fuera de la región -->
          <g class="santiago-marker-group" transform="translate(540, 450)">
            <rect x="-75" y="-16" width="155" height="32" rx="16" class="santiago-pill-bg" />
            <circle cx="-56" cy="0" r="8" class="santiago-pin-circle" />
            <text x="-40" y="4" class="santiago-pill-text">SANTIAGO <tspan class="santiago-sub">(ORIGEN)</tspan></text>
          </g>
        </svg>
      </div>

      <!-- Leyenda Horizontal en la parte inferior -->
      <div class="sil-map-legend">
        <div class="legend-item"><span class="legend-dot norte"></span> ZONA NORTE</div>
        <div class="legend-item"><span class="legend-dot centro"></span> ZONA CENTRO</div>
        <div class="legend-item"><span class="legend-dot este"></span> ZONA ESTE</div>
        <div class="legend-item"><span class="legend-dot costa"></span> ZONA COSTA</div>
        <div class="legend-item"><span class="legend-dot neutral"></span> OTRAS COMUNAS</div>
      </div>
    </div>
  `;

  setupMapInteractions();

  // Seleccionar Valparaíso por defecto
  selectComuna('valparaiso', false);
}

function setupMapInteractions() {
  const mapContainer = document.getElementById('map-vector-container');
  if (!mapContainer) return;

  // Delegación de eventos directa sobre el contenedor (Garantiza respuesta al clic en polígono o etiqueta)
  mapContainer.addEventListener('click', (e) => {
    const target = e.target.closest('[data-comuna]');
    if (!target) return;

    const comunaId = target.getAttribute('data-comuna');
    if (comunaId) {
      selectComuna(comunaId, false);
    }
  });

  // Botones de cotización dentro de la tarjeta
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-quote-comuna')) {
      const comunaId = e.target.getAttribute('data-comuna-id');
      if (comunaId) {
        preselectDestination(comunaId, true);
      }
    }
  });
}

export function selectComuna(comunaId, scrollToCalc = false) {
  const info = getComunaInfo(comunaId);
  if (!info) return;

  selectedComunaId = comunaId;

  // Actualizar selección visual en polígonos
  document.querySelectorAll('.coverage-comuna').forEach(p => {
    if (p.getAttribute('data-comuna') === comunaId) {
      p.classList.add('selected');
    } else {
      p.classList.remove('selected');
    }
  });

  // Actualizar curva de ruta hacia Santiago
  updateRouteCurve(comunaId);

  // Actualizar tarjeta derecha
  showComunaDetail(info);

  // Sincronizar cotizador
  if (info.hasService) {
    preselectDestination(comunaId, scrollToCalc);
  }
}

function updateRouteCurve(comunaId) {
  const curveEl = document.getElementById('santiago-route-curve');
  if (!curveEl) return;

  const targetData = MAP_COMUNAS_DATA.find(c => c.id === comunaId);
  if (!targetData) return;

  const startX = 540, startY = 450;
  const endX = targetData.cx, endY = targetData.cy;
  const controlX = (startX + endX) / 2 + 20;
  const controlY = (startY + endY) / 2 - 15;

  curveEl.setAttribute('d', `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`);
}

/**
 * Muestra la información de la comuna seleccionada en la tarjeta derecha
 * Estructura idéntica al diseño de referencia
 */
function showComunaDetail(info) {
  const infoCard = document.getElementById('map-info-card');
  if (!infoCard) return;

  const comunaName = (info && info.name) ? info.name : 'Valparaíso';
  const provinciaName = (info && info.provincia) ? info.provincia : 'Provincia de Valparaíso';
  const zoneName = (info && info.zone) ? info.zone : 'ZONA COSTA';
  const daysText = (info && info.days) ? info.days : 'Lunes a Viernes';
  const isConfigured = !!(info && info.hasService);

  infoCard.innerHTML = `
    <div class="sil-detail-card animate-fade-in">
      <div class="sil-detail-header">
        <span class="sil-zone-title ${isConfigured ? 'configured-zone' : 'neutral-zone'}">${zoneName.toUpperCase()}</span>
        <h2 class="sil-comuna-heading">${comunaName}</h2>
        <span class="sil-provincia-subtitle">${provinciaName}</span>
      </div>

      <div class="sil-detail-divider"></div>

      <div class="sil-detail-list">
        <!-- Item 1: DÍAS DE ATENCIÓN -->
        <div class="sil-detail-row">
          <div class="sil-detail-icon">
            <svg class="detail-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div class="sil-detail-text">
            <span class="sil-detail-label">DÍAS DE ATENCIÓN</span>
            <span class="sil-detail-value blue-highlight">${daysText}</span>
          </div>
        </div>

        <!-- Item 2: TIEMPO DE ENTREGA -->
        <div class="sil-detail-row">
          <div class="sil-detail-icon">
            <svg class="detail-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="sil-detail-text">
            <span class="sil-detail-label">TIEMPO DE ENTREGA</span>
            <span class="sil-detail-value">24 a 48 horas hábiles desde retiro en Santiago</span>
          </div>
        </div>

        <!-- Item 3: MODALIDAD DE ENVÍO -->
        <div class="sil-detail-row">
          <div class="sil-detail-icon">
            <svg class="detail-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
          <div class="sil-detail-text">
            <span class="sil-detail-label">MODALIDAD DE ENVÍO</span>
            <span class="sil-detail-value">Carga fraccionada y completa</span>
          </div>
        </div>

        <!-- Item 4: COBERTURA -->
        <div class="sil-detail-row">
          <div class="sil-detail-icon">
            <svg class="detail-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div class="sil-detail-text">
            <span class="sil-detail-label">COBERTURA</span>
            <span class="sil-detail-value">
              ${isConfigured 
                ? `Habilitado para retiros en Santiago y entrega directa en ${comunaName}.`
                : `Comuna territorial de la V Región. Consulta disponibilidad comercial.`}
            </span>
          </div>
        </div>
      </div>

      ${isConfigured ? `
        <button class="btn btn-primary btn-block btn-quote-comuna sil-action-btn" data-comuna-id="${info.id}">
          Cotizar mi envío a ${comunaName} →
        </button>
      ` : `
        <a href="#contacto" class="btn btn-secondary btn-block sil-action-btn neutral-btn">
          Consultar disponibilidad en ${comunaName} →
        </a>
      `}
    </div>
  `;
}
'''

with open('js/modules/map.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print('Successfully generated js/modules/map.js matching reference image!')
