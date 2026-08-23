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

configured_comunas = {
    'valparaiso': 'zone-costa', 'vina-del-mar': 'zone-costa', 'concon': 'zone-costa', 'san-antonio': 'zone-costa',
    'quilpue': 'zone-centro', 'villa-alemana': 'zone-centro', 'limache': 'zone-centro', 'casablanca': 'zone-centro',
    'quillota': 'zone-norte', 'la-calera': 'zone-norte',
    'san-felipe': 'zone-este', 'los-andes': 'zone-este'
}

labeled_comuna_ids = [
    'valparaiso', 'vina-del-mar', 'concon', 'quilpue', 'villa-alemana',
    'casablanca', 'san-antonio', 'quillota', 'la-calera', 'limache',
    'san-felipe', 'los-andes'
]

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

# Canvas dimensions (860 x 530) - High Zoom on active V Region corridor
canvas_w, canvas_h = 860, 530
offset_x, offset_y = 20, 15
min_lon, max_lon = -71.76, -70.01
min_lat, max_lat = -33.86, -32.50

scale_x = (canvas_w - 40) / (max_lon - min_lon)
scale_y = (canvas_h - 30) / (max_lat - min_lat)

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
    if cid == 'valparaiso': label_x -= 15; label_y += 8
    elif cid == 'vina-del-mar': label_x += 18; label_y -= 5
    elif cid == 'concon': label_x += 22; label_y -= 10
    elif cid == 'quilpue': label_x += 10; label_y += 5
    elif cid == 'villa-alemana': label_x += 15
    elif cid == 'limache': label_y += 10
    elif cid == 'san-antonio': label_y += 15

    color_cls = configured_comunas.get(cid, 'zone-neutral')
    has_service = cid in configured_comunas

    comunas_data.append({
        'id': cid,
        'name': canonical_names[cid],
        'colorClass': color_cls,
        'hasService': has_service,
        'path': path_d,
        'cx': avg_x,
        'cy': avg_y,
        'labelX': label_x,
        'labelY': label_y,
        'hasLabel': cid in labeled_comuna_ids,
        'isInset': False
    })

# Write js/modules/map.js
js_content = '''/**
 * Transportes SIL - Módulo de Mapa Interactivo de Cobertura V Región (Zoom Ampliado)
 * 
 * Delegación de eventos robusta sobre #map-vector-container para actualización inmediata al clic,
 * sin desplazar la pantalla.
 */

import { getComunaInfo } from '../config/coverage.js';
import { preselectDestination } from './calculator.js';

let selectedComunaId = 'valparaiso';

const MAP_COMUNAS_DATA = ''' + json.dumps(comunas_data, ensure_ascii=False, indent=2) + ''';

export function initInteractiveMap() {
  const mapContainer = document.getElementById('map-vector-container');
  if (!mapContainer) return;

  // Renderizar la estructura del mapa SVG vectorial limpio
  mapContainer.innerHTML = `
    <div class="sil-svg-map-card">
      <div class="sil-svg-wrapper">
        <svg class="sil-coverage-svg" viewBox="0 0 860 530" role="img" aria-label="Mapa de cobertura exclusivo de Transportes SIL en la V Región de Valparaíso">
          <!-- Texto Océano Pacífico -->
          <text x="22" y="140" class="ocean-text">OCÉANO PACÍFICO</text>

          <!-- Grupo de Comunas Continentales de la V Región -->
          <g class="mainland-group">
            ${MAP_COMUNAS_DATA.map(c => `
              <path 
                id="path-${c.id}"
                class="coverage-comuna ${c.colorClass} ${c.hasService ? 'selectable-comuna' : 'non-selectable-comuna'} ${c.id === selectedComunaId ? 'selected' : ''}" 
                data-comuna="${c.id}" 
                data-name="${c.name}"
                d="${c.path}" 
              >
                <title>${c.name} ${c.hasService ? '(Cobertura SIL)' : ''}</title>
              </path>
            `).join('')}
          </g>

          <!-- Etiquetas Fijas Dinámicas para las 12 Comunas Cobertura SIL -->
          <g class="labels-group">
            ${MAP_COMUNAS_DATA.filter(c => c.hasLabel).map(c => `
              <text x="${c.labelX}" y="${c.labelY}" class="map-svg-label" data-comuna="${c.id}">${c.name.toUpperCase()}</text>
            `).join('')}
          </g>

          <!-- Línea Curva Decorativa Sutil de Ruta desde Santiago -->
          <path id="santiago-route-curve" class="route-connection-line" d="M 560 430 Q 420 420 135 362" />

          <!-- Marcador Santiago Origen Holgado -->
          <g class="santiago-marker-group" transform="translate(560, 430)">
            <rect x="-75" y="-16" width="155" height="32" rx="16" class="santiago-pill-bg" />
            <circle cx="-56" cy="0" r="8" class="santiago-pin-circle" />
            <text x="-40" y="4" class="santiago-pill-text">SANTIAGO <tspan class="santiago-sub">(ORIGEN)</tspan></text>
          </g>
        </svg>
      </div>
    </div>
  `;

  setupMapInteractions();

  // Seleccionar Valparaíso por defecto inicialmente en la tarjeta
  selectComuna('valparaiso', false);
}

function setupMapInteractions() {
  const mapContainer = document.getElementById('map-vector-container');
  if (!mapContainer) return;

  // Delegación de eventos global sobre el contenedor del mapa (Clic 100% garantizado)
  mapContainer.addEventListener('click', (e) => {
    const target = e.target.closest('[data-comuna]');
    if (!target) return;

    const comunaId = target.getAttribute('data-comuna');
    if (comunaId) {
      selectComuna(comunaId, false); // false = no desplazar la pantalla al cotizador
    }
  });

  // Escuchar botones de cotización del mapa (al presionar el botón de la tarjeta, sí realiza scroll al cotizador)
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-quote-comuna')) {
      const comunaId = e.target.getAttribute('data-comuna-id');
      if (comunaId) {
        preselectDestination(comunaId, true); // true = desplazar suavemente al cotizador
      }
    }
  });
}

export function selectComuna(comunaId, scrollToCalc = false) {
  const info = getComunaInfo(comunaId);
  if (!info || !info.hasService) return;

  selectedComunaId = comunaId;

  // Actualizar clases de selección en polígonos SVG
  document.querySelectorAll('.coverage-comuna').forEach(p => {
    if (p.getAttribute('data-comuna') === comunaId) {
      p.classList.add('selected');
    } else {
      p.classList.remove('selected');
    }
  });

  // Actualizar curva de ruta
  updateRouteCurve(comunaId);

  // Mostrar información en la tarjeta derecha
  showComunaDetail(info);

  // Preseleccionar en la calculadora de envíos (sin scroll si es por clic en mapa)
  preselectDestination(comunaId, scrollToCalc);
}

function updateRouteCurve(comunaId) {
  const curveEl = document.getElementById('santiago-route-curve');
  if (!curveEl) return;

  const targetData = MAP_COMUNAS_DATA.find(c => c.id === comunaId);
  if (!targetData) return;

  const startX = 560, startY = 430;
  const endX = targetData.cx, endY = targetData.cy;
  const controlX = (startX + endX) / 2 + 20;
  const controlY = (startY + endY) / 2 - 15;

  curveEl.setAttribute('d', `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`);
}

/**
 * Muestra la información de la comuna seleccionada en la tarjeta derecha
 */
function showComunaDetail(info) {
  const infoCard = document.getElementById('map-info-card');
  if (!infoCard) return;

  const comunaName = (info && info.name) ? info.name : 'Valparaíso';
  const provinciaName = (info && info.provincia) ? info.provincia : 'Provincia de Valparaíso';
  const zoneName = (info && info.zone) ? info.zone : 'ZONA COSTA';
  const daysText = (info && info.days) ? info.days : 'Lunes a Viernes';

  infoCard.innerHTML = `
    <div class="sil-detail-card animate-fade-in">
      <div class="sil-detail-header">
        <span class="sil-zone-title configured-zone">${zoneName}</span>
        <h2 class="sil-comuna-heading">${comunaName}</h2>
        <span class="sil-provincia-subtitle">${provinciaName}</span>
      </div>

      <div class="sil-detail-divider"></div>

      <div class="sil-detail-list">
        <!-- Ficha DÍAS DE ATENCIÓN -->
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

        <!-- Ficha TIEMPO DE ENTREGA -->
        <div class="sil-detail-row">
          <div class="sil-detail-icon">
            <svg class="detail-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="sil-detail-text">
            <span class="sil-detail-label">TIEMPO DE ENTREGA</span>
            <span class="sil-detail-value">24 horas hábiles desde retiro en Santiago</span>
          </div>
        </div>

        <!-- Ficha MODALIDAD DE SERVICIO -->
        <div class="sil-detail-row">
          <div class="sil-detail-icon">
            <svg class="detail-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div class="sil-detail-text">
            <span class="sil-detail-label">MODALIDAD SIL</span>
            <span class="sil-detail-value">Carga fraccionada palletizada directa</span>
          </div>
        </div>
      </div>

      <button class="btn btn-primary btn-block btn-quote-comuna sil-action-btn" data-comuna-id="${info.id}">
        Cotizar mi envío a ${comunaName} →
      </button>
    </div>
  `;
}
'''

with open('js/modules/map.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print('Successfully regenerated map.js with fixed scroll prevention and zoomed projection!')
