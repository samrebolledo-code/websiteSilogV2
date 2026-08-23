// Lógica del mapa interactivo de comunas de la V Región.

import { getComunaInfo, DEFAULT_SERVICE_DAYS, validateCoverageData } from '../config/coverage.js';
import { preselectDestination } from './calculator.js';

let selectedComunaId = 'valparaiso';

const MAP_COMUNAS_DATA = [
  {
    "id": "rinconada",
    "name": "Rinconada",
    "provincia": "Provincia de Los Andes",
    "zone": "Sin Ruta Directa SIL",
    "colorClass": "zone-neutral",
    "hasService": false,
    "path": "M 519.1,228.3 L 542.1,235.4 L 533.9,257.9 L 546.5,262.4 L 535.3,272.9 L 515.0,271.2 L 493.5,235.5 L 519.1,228.3 Z",
    "cx": 525.6,
    "cy": 249.0,
    "labelX": 525.6,
    "labelY": 249.0,
    "isInset": false
  },
  {
    "id": "cabildo",
    "name": "Cabildo",
    "provincia": "Provincia de Petorca",
    "zone": "Sin Ruta Directa SIL",
    "colorClass": "zone-neutral",
    "hasService": false,
    "path": "M 634.7,67.1 L 652.4,85.0 L 642.6,98.4 L 563.0,107.5 L 542.9,135.0 L 489.3,124.5 L 478.1,128.4 L 460.0,144.1 L 486.7,157.4 L 470.5,180.6 L 437.8,174.3 L 411.7,180.8 L 365.2,179.6 L 369.3,158.9 L 334.7,149.5 L 326.7,140.2 L 329.9,127.1 L 347.8,122.0 L 343.0,106.7 L 364.7,112.3 L 397.6,94.2 L 429.5,99.7 L 465.9,79.4 L 493.4,84.2 L 602.1,76.8 L 634.7,67.1 Z",
    "cx": 464.4,
    "cy": 122.3,
    "labelX": 464.4,
    "labelY": 122.3,
    "isInset": false
  },
  {
    "id": "petorca",
    "name": "Petorca",
    "provincia": "Provincia de Petorca",
    "zone": "Sin Ruta Directa SIL",
    "colorClass": "zone-neutral",
    "hasService": false,
    "path": "M 510.4,11.8 L 527.7,22.1 L 542.9,19.7 L 544.4,41.9 L 592.7,53.4 L 598.5,45.8 L 632.3,52.5 L 632.9,63.5 L 602.1,76.8 L 493.4,84.2 L 465.9,79.4 L 429.5,99.7 L 397.6,94.2 L 364.7,112.3 L 343.0,106.7 L 319.6,88.5 L 308.7,52.3 L 376.0,25.1 L 371.5,13.5 L 411.1,17.8 L 420.9,26.6 L 510.4,11.8 Z",
    "cx": 472.6,
    "cy": 54.5,
    "labelX": 472.6,
    "labelY": 54.5,
    "isInset": false
  },
  {
    "id": "panquehue",
    "name": "Panquehue",
    "provincia": "Provincia de San Felipe de Aconcagua",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": false,
    "path": "M 505.1,215.5 L 489.9,236.4 L 413.2,235.0 L 413.0,228.6 L 488.5,209.1 L 505.1,215.5 Z",
    "cx": 469.1,
    "cy": 223.3,
    "labelX": 461.1,
    "labelY": 223.3,
    "isInset": false
  },
  {
    "id": "olmue",
    "name": "Olmué",
    "provincia": "Provincia de Marga Marga",
    "zone": "ZONA CENTRO",
    "colorClass": "zone-centro",
    "hasService": false,
    "path": "M 337.0,271.7 L 377.5,281.1 L 389.5,298.2 L 372.7,311.1 L 329.1,318.1 L 290.6,284.2 L 292.9,276.7 L 337.0,271.7 Z",
    "cx": 340.8,
    "cy": 289.1,
    "labelX": 340.8,
    "labelY": 289.1,
    "isInset": false
  },
  {
    "id": "cartagena",
    "name": "Cartagena",
    "provincia": "Provincia de San Antonio",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": false,
    "path": "M 110.0,438.7 L 120.4,429.1 L 160.0,429.4 L 176.8,417.2 L 194.7,421.1 L 215.0,411.5 L 239.9,411.8 L 232.3,422.0 L 243.0,447.0 L 206.8,454.7 L 110.0,438.7 Z M 115.8,438.1 L 115.8,438.1 L 115.7,438.1 L 115.8,438.0 L 115.8,438.1 Z",
    "cx": 161.7,
    "cy": 432.0,
    "labelX": 155.7,
    "labelY": 432.0,
    "isInset": false
  },
  {
    "id": "catemu",
    "name": "Catemu",
    "provincia": "Provincia de San Felipe de Aconcagua",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": false,
    "path": "M 438.2,174.4 L 470.5,180.6 L 447.4,209.2 L 455.6,220.2 L 413.0,228.6 L 413.3,235.0 L 398.6,228.5 L 388.9,236.2 L 366.1,211.6 L 375.0,192.5 L 365.4,183.0 L 381.1,176.0 L 398.5,181.1 L 438.2,174.4 Z",
    "cx": 410.7,
    "cy": 202.2,
    "labelX": 410.7,
    "labelY": 202.2,
    "isInset": false
  },
  {
    "id": "llaillay",
    "name": "Llaillay",
    "provincia": "Provincia de San Felipe de Aconcagua",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": false,
    "path": "M 405.0,227.9 L 428.5,237.7 L 493.9,235.5 L 511.1,263.1 L 460.4,262.5 L 431.5,266.3 L 417.0,276.6 L 383.5,277.7 L 371.9,238.5 L 405.0,227.9 Z",
    "cx": 430.8,
    "cy": 251.4,
    "labelX": 430.8,
    "labelY": 251.4,
    "isInset": false
  },
  {
    "id": "san-felipe",
    "name": "San Felipe",
    "provincia": "Provincia de San Felipe de Aconcagua",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": true,
    "path": "M 479.9,190.4 L 506.9,199.0 L 504.0,204.3 L 540.0,197.2 L 530.8,221.5 L 553.1,228.4 L 542.1,235.4 L 518.1,232.9 L 518.0,224.6 L 496.1,228.6 L 507.4,216.5 L 494.1,209.5 L 455.6,220.2 L 447.5,209.0 L 467.8,185.5 L 479.9,190.4 Z",
    "cx": 502.6,
    "cy": 212.1,
    "labelX": 502.6,
    "labelY": 212.1,
    "isInset": false
  },
  {
    "id": "santa-maria",
    "name": "Santa María",
    "provincia": "Provincia de San Felipe de Aconcagua",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": false,
    "path": "M 586.9,164.5 L 606.7,173.8 L 583.2,182.0 L 580.7,199.7 L 562.2,207.4 L 565.2,232.1 L 530.8,221.5 L 531.3,213.6 L 558.8,175.3 L 586.9,164.5 Z",
    "cx": 569.3,
    "cy": 193.4,
    "labelX": 569.3,
    "labelY": 193.4,
    "isInset": false
  },
  {
    "id": "villa-alemana",
    "name": "Villa Alemana",
    "provincia": "Provincia de Marga Marga",
    "zone": "ZONA CENTRO",
    "colorClass": "zone-centro",
    "hasService": true,
    "path": "M 212.1,297.1 L 211.7,287.9 L 242.2,296.7 L 258.0,287.4 L 273.9,314.3 L 254.6,318.0 L 229.9,311.7 L 212.1,297.1 Z",
    "cx": 236.8,
    "cy": 301.3,
    "labelX": 246.8,
    "labelY": 301.3,
    "isInset": false
  },
  {
    "id": "santo-domingo",
    "name": "Santo Domingo",
    "provincia": "Provincia de San Antonio",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": false,
    "path": "M 35.1,504.4 L 91.4,484.9 L 108.3,456.6 L 122.4,461.1 L 150.4,493.4 L 141.6,528.2 L 130.7,526.7 L 68.7,551.7 L 55.3,541.7 L 41.2,545.9 L 28.5,538.1 L 15.9,542.7 L 35.1,504.4 Z",
    "cx": 78.8,
    "cy": 513.8,
    "labelX": 78.8,
    "labelY": 513.8,
    "isInset": false
  },
  {
    "id": "san-antonio",
    "name": "San Antonio",
    "provincia": "Provincia de San Antonio",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": true,
    "path": "M 110.8,452.9 L 109.8,438.6 L 206.5,454.8 L 240.3,445.6 L 238.5,455.1 L 194.5,474.4 L 227.9,496.6 L 198.5,505.0 L 156.4,501.7 L 110.8,452.9 Z",
    "cx": 179.4,
    "cy": 467.8,
    "labelX": 179.4,
    "labelY": 475.8,
    "isInset": false
  },
  {
    "id": "el-tabo",
    "name": "El Tabo",
    "provincia": "Provincia de San Antonio",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": false,
    "path": "M 106.2,424.7 L 86.3,409.5 L 108.4,404.2 L 125.2,413.3 L 176.8,417.2 L 162.0,428.7 L 132.1,433.1 L 106.2,424.7 Z",
    "cx": 125.4,
    "cy": 419.4,
    "labelX": 119.4,
    "labelY": 419.4,
    "isInset": false
  },
  {
    "id": "el-quisco",
    "name": "El Quisco",
    "provincia": "Provincia de San Antonio",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": false,
    "path": "M 81.7,406.8 L 73.1,403.1 L 79.6,388.4 L 99.1,396.9 L 127.0,396.0 L 126.3,405.3 L 81.7,406.8 Z",
    "cx": 95.5,
    "cy": 400.5,
    "labelX": 87.5,
    "labelY": 400.5,
    "isInset": false
  },
  {
    "id": "algarrobo",
    "name": "Algarrobo",
    "provincia": "Provincia de San Antonio",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": false,
    "path": "M 80.6,381.6 L 80.4,381.6 L 80.3,381.5 L 80.6,381.5 L 80.6,381.6 Z M 79.9,381.5 L 79.3,381.4 L 79.3,381.2 L 80.1,381.3 L 79.9,381.5 Z M 97.5,367.5 L 101.7,357.7 L 151.8,357.4 L 145.6,394.7 L 99.5,397.0 L 79.7,388.4 L 97.4,383.0 L 97.5,367.5 Z",
    "cx": 92.9,
    "cy": 379.3,
    "labelX": 92.9,
    "labelY": 379.3,
    "isInset": false
  },
  {
    "id": "casablanca",
    "name": "Casablanca",
    "provincia": "Provincia de Valparaíso",
    "zone": "ZONA CENTRO",
    "colorClass": "zone-centro",
    "hasService": true,
    "path": "M 76.0,338.5 L 78.3,327.6 L 111.9,328.7 L 150.4,344.0 L 206.6,343.2 L 225.8,333.4 L 235.5,341.3 L 287.2,351.9 L 302.6,371.2 L 290.4,388.6 L 264.2,399.1 L 236.6,400.5 L 239.8,411.7 L 215.0,411.5 L 194.7,421.1 L 125.2,413.3 L 115.1,407.6 L 129.3,393.0 L 145.6,394.7 L 154.7,359.2 L 124.2,354.7 L 91.7,362.5 L 76.0,338.5 Z M 87.2,357.8 L 87.2,357.8 L 87.2,357.8 L 87.2,357.8 L 87.2,357.8 Z M 75.4,337.6 L 75.6,337.7 L 75.2,337.8 L 75.2,337.7 L 75.4,337.6 Z",
    "cx": 148.2,
    "cy": 364.0,
    "labelX": 148.2,
    "labelY": 364.0,
    "isInset": false
  },
  {
    "id": "valparaiso",
    "name": "Valparaíso",
    "provincia": "Provincia de Valparaíso",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": true,
    "path": "M 127.0,292.7 L 147.2,313.4 L 165.2,310.9 L 180.5,327.2 L 217.3,334.7 L 213.0,340.6 L 150.4,344.0 L 111.9,328.7 L 74.8,327.1 L 57.1,312.1 L 92.5,311.5 L 101.2,289.8 L 113.2,296.1 L 127.0,292.7 Z",
    "cx": 134.2,
    "cy": 315.8,
    "labelX": 122.19999999999999,
    "labelY": 319.8,
    "isInset": false
  },
  {
    "id": "vina-del-mar",
    "name": "Viña del Mar",
    "provincia": "Provincia de Valparaíso",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": true,
    "path": "M 144.8,269.6 L 145.7,268.9 L 161.3,272.6 L 192.3,284.8 L 173.7,294.0 L 180.2,302.7 L 170.1,313.4 L 147.2,313.4 L 127.9,292.1 L 143.5,286.4 L 144.8,269.6 Z",
    "cx": 157.4,
    "cy": 288.0,
    "labelX": 169.4,
    "labelY": 284.0,
    "isInset": false
  },
  {
    "id": "concon",
    "name": "Concón",
    "provincia": "Provincia de Valparaíso",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": true,
    "path": "M 163.3,260.6 L 207.6,266.0 L 217.1,275.9 L 192.3,284.8 L 142.4,268.0 L 163.3,260.6 Z",
    "cx": 181.0,
    "cy": 269.3,
    "labelX": 197.0,
    "labelY": 261.3,
    "isInset": false
  },
  {
    "id": "quintero",
    "name": "Quintero",
    "provincia": "Provincia de Valparaíso",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": false,
    "path": "M 156.5,252.9 L 156.4,253.0 L 156.0,253.0 L 156.2,252.9 L 156.5,252.9 Z M 158.1,253.1 L 157.4,253.9 L 156.5,253.2 L 157.8,252.9 L 158.1,253.1 Z M 151.2,222.2 L 151.1,222.2 L 151.1,222.2 L 151.2,222.2 L 151.2,222.2 Z M 148.7,220.7 L 148.7,220.7 L 148.6,220.7 L 148.6,220.6 L 148.7,220.7 Z M 149.2,220.7 L 151.3,218.4 L 160.4,223.8 L 177.5,217.8 L 182.6,228.5 L 204.2,224.0 L 201.6,240.1 L 216.6,244.2 L 188.1,253.7 L 190.9,263.5 L 164.3,262.1 L 149.2,220.7 Z",
    "cx": 162.6,
    "cy": 236.3,
    "labelX": 162.6,
    "labelY": 236.3,
    "isInset": false
  },
  {
    "id": "puchuncavi",
    "name": "Puchuncaví",
    "provincia": "Provincia de Valparaíso",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": false,
    "path": "M 171.3,202.6 L 171.1,202.6 L 171.1,202.5 L 171.4,202.5 L 171.3,202.6 Z M 170.7,202.4 L 170.8,202.4 L 170.8,202.5 L 170.6,202.5 L 170.7,202.4 Z M 192.4,186.3 L 204.3,179.8 L 224.7,193.8 L 265.8,199.7 L 250.0,209.8 L 259.1,223.8 L 223.6,245.8 L 201.6,240.1 L 204.2,224.0 L 182.6,228.5 L 168.8,217.7 L 162.5,203.4 L 180.5,203.1 L 192.4,186.3 Z",
    "cx": 192.6,
    "cy": 207.0,
    "labelX": 192.6,
    "labelY": 207.0,
    "isInset": false
  },
  {
    "id": "zapallar",
    "name": "Zapallar",
    "provincia": "Provincia de Petorca",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": false,
    "path": "M 179.1,147.1 L 182.4,143.7 L 196.6,157.7 L 217.3,159.0 L 255.6,143.7 L 300.1,173.5 L 284.5,174.0 L 251.5,192.6 L 224.7,193.8 L 197.9,181.3 L 179.1,147.1 Z M 186.0,168.1 L 186.3,168.8 L 184.7,168.6 L 185.6,168.0 L 186.0,168.1 Z M 182.0,143.8 L 181.2,143.7 L 181.4,143.3 L 182.0,143.3 L 182.0,143.8 Z",
    "cx": 205.0,
    "cy": 160.6,
    "labelX": 205.0,
    "labelY": 160.6,
    "isInset": false
  },
  {
    "id": "papudo",
    "name": "Papudo",
    "provincia": "Provincia de Petorca",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": false,
    "path": "M 206.9,119.1 L 244.6,117.3 L 263.3,127.9 L 246.6,128.0 L 255.6,143.7 L 217.3,159.0 L 187.8,154.7 L 183.4,144.7 L 196.2,142.8 L 206.9,119.1 Z",
    "cx": 220.9,
    "cy": 135.6,
    "labelX": 220.9,
    "labelY": 135.6,
    "isInset": false
  },
  {
    "id": "la-ligua",
    "name": "La Ligua",
    "provincia": "Provincia de Petorca",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": false,
    "path": "M 153.9,70.7 L 153.8,70.7 L 154.1,70.4 L 154.1,70.7 L 153.9,70.7 Z M 154.6,70.5 L 154.4,70.5 L 154.4,70.4 L 154.5,70.4 L 154.6,70.5 Z M 155.0,69.7 L 155.1,69.8 L 154.8,69.8 L 154.8,69.7 L 155.0,69.7 Z M 151.5,62.9 L 151.2,62.9 L 150.9,62.6 L 151.4,62.7 L 151.5,62.9 Z M 151.1,61.9 L 150.8,61.9 L 150.8,61.8 L 151.0,61.8 L 151.1,61.9 Z M 147.4,60.4 L 147.5,60.3 L 147.8,60.2 L 147.7,60.4 L 147.4,60.4 Z M 148.2,60.4 L 148.1,60.2 L 148.4,60.1 L 148.6,60.3 L 148.2,60.4 Z M 149.3,60.2 L 149.1,60.2 L 149.2,60.1 L 149.4,60.1 L 149.3,60.2 Z M 147.9,59.8 L 147.4,59.8 L 147.3,59.7 L 147.6,59.6 L 147.9,59.8 Z M 174.9,76.2 L 155.3,71.8 L 148.2,54.0 L 165.3,55.0 L 176.7,47.8 L 238.8,61.2 L 299.3,41.8 L 319.6,88.5 L 343.4,102.8 L 347.8,122.0 L 329.9,127.1 L 327.5,141.8 L 369.3,159.0 L 353.7,177.1 L 318.0,169.7 L 300.1,173.5 L 247.0,135.1 L 246.6,128.0 L 263.2,127.9 L 244.6,117.3 L 208.0,117.5 L 179.8,100.9 L 174.9,76.2 Z",
    "cx": 187.1,
    "cy": 78.7,
    "labelX": 187.1,
    "labelY": 78.7,
    "isInset": false
  },
  {
    "id": "limache",
    "name": "Limache",
    "provincia": "Provincia de Marga Marga",
    "zone": "ZONA CENTRO",
    "colorClass": "zone-centro",
    "hasService": true,
    "path": "M 193.9,262.5 L 223.0,261.3 L 241.8,270.7 L 292.9,276.7 L 330.3,322.8 L 302.5,329.4 L 284.3,324.5 L 259.4,302.2 L 258.0,287.4 L 242.2,296.7 L 196.5,284.5 L 217.1,275.8 L 193.9,262.5 Z",
    "cx": 248.9,
    "cy": 289.0,
    "labelX": 248.9,
    "labelY": 285.0,
    "isInset": false
  },
  {
    "id": "quillota",
    "name": "Quillota",
    "provincia": "Provincia de Quillota",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": true,
    "path": "M 257.7,237.0 L 325.0,247.2 L 322.1,264.5 L 336.5,271.5 L 280.4,276.9 L 223.0,261.3 L 192.2,262.5 L 188.1,253.7 L 257.7,237.0 Z",
    "cx": 264.7,
    "cy": 256.8,
    "labelX": 264.7,
    "labelY": 256.8,
    "isInset": false
  },
  {
    "id": "la-calera",
    "name": "La Calera",
    "provincia": "Provincia de Quillota",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": true,
    "path": "M 303.4,232.4 L 287.2,225.2 L 301.5,218.7 L 350.8,215.3 L 340.8,227.4 L 309.5,225.8 L 332.9,240.9 L 325.0,247.1 L 303.4,232.4 Z",
    "cx": 317.2,
    "cy": 229.5,
    "labelX": 317.2,
    "labelY": 229.5,
    "isInset": false
  },
  {
    "id": "nogales",
    "name": "Nogales",
    "provincia": "Provincia de Quillota",
    "zone": "Sin Ruta Directa SIL",
    "colorClass": "zone-neutral",
    "hasService": false,
    "path": "M 320.6,171.7 L 350.2,178.2 L 365.4,172.2 L 369.7,209.9 L 329.6,219.8 L 301.5,218.7 L 281.7,231.5 L 258.3,223.4 L 250.0,209.8 L 265.8,199.7 L 247.6,193.6 L 286.2,173.4 L 320.6,171.7 Z",
    "cx": 303.6,
    "cy": 198.0,
    "labelX": 303.6,
    "labelY": 198.0,
    "isInset": false
  },
  {
    "id": "calle-larga",
    "name": "Calle Larga",
    "provincia": "Provincia de Los Andes",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": false,
    "path": "M 573.4,243.1 L 609.5,250.8 L 654.6,284.5 L 609.5,309.2 L 570.7,269.5 L 541.7,271.2 L 546.5,262.2 L 533.9,257.9 L 542.1,235.3 L 573.4,243.1 Z M 559.7,239.4 L 559.6,239.4 L 559.6,239.4 L 559.6,239.4 L 559.7,239.4 Z",
    "cx": 570.2,
    "cy": 254.9,
    "labelX": 570.2,
    "labelY": 254.9,
    "isInset": false
  },
  {
    "id": "la-cruz",
    "name": "La Cruz",
    "provincia": "Provincia de Quillota",
    "zone": "Sin Ruta Directa SIL",
    "colorClass": "zone-neutral",
    "hasService": false,
    "path": "M 268.3,222.8 L 281.7,231.5 L 287.2,225.2 L 295.6,228.3 L 325.0,247.2 L 243.9,237.2 L 253.9,225.0 L 268.3,222.8 Z",
    "cx": 278.0,
    "cy": 230.0,
    "labelX": 268.0,
    "labelY": 230.0,
    "isInset": false
  },
  {
    "id": "putaendo",
    "name": "Putaendo",
    "provincia": "Provincia de San Felipe de Aconcagua",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": false,
    "path": "M 734.0,124.8 L 721.5,137.0 L 697.3,141.0 L 662.5,173.8 L 652.1,168.0 L 606.9,172.9 L 579.4,163.8 L 549.3,192.4 L 504.5,204.3 L 506.9,199.0 L 469.6,185.0 L 486.7,157.4 L 460.0,144.1 L 478.1,128.4 L 489.2,124.5 L 551.2,133.2 L 562.8,107.6 L 623.7,104.0 L 674.6,75.5 L 736.9,95.4 L 734.0,124.8 Z",
    "cx": 594.3,
    "cy": 145.6,
    "labelX": 594.3,
    "labelY": 145.6,
    "isInset": false
  },
  {
    "id": "san-esteban",
    "name": "San Esteban",
    "provincia": "Provincia de Los Andes",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": false,
    "path": "M 770.3,187.5 L 759.3,219.7 L 674.2,259.0 L 653.0,246.6 L 565.1,232.0 L 562.2,207.4 L 580.7,199.7 L 583.2,182.0 L 618.6,170.3 L 652.3,168.0 L 662.5,173.8 L 697.3,141.0 L 721.5,137.0 L 734.1,124.8 L 775.8,140.9 L 779.8,165.3 L 759.3,178.4 L 770.3,187.5 Z",
    "cx": 684.4,
    "cy": 184.5,
    "labelX": 684.4,
    "labelY": 184.5,
    "isInset": false
  },
  {
    "id": "los-andes",
    "name": "Los Andes",
    "provincia": "Provincia de Los Andes",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": true,
    "path": "M 795.0,297.8 L 766.6,315.8 L 747.0,315.3 L 727.2,336.6 L 718.2,335.5 L 714.7,321.0 L 664.2,310.4 L 648.3,291.2 L 654.6,284.5 L 609.7,250.9 L 542.0,233.4 L 553.6,228.4 L 575.2,238.0 L 653.0,246.6 L 674.2,259.0 L 758.2,220.4 L 764.0,211.5 L 768.7,207.7 L 770.2,207.3 L 770.9,207.2 L 771.3,207.3 L 788.0,228.4 L 840.9,255.7 L 827.2,286.2 L 795.0,297.8 Z",
    "cx": 715.9,
    "cy": 263.8,
    "labelX": 715.9,
    "labelY": 263.8,
    "isInset": false
  },
  {
    "id": "hijuelas",
    "name": "Hijuelas",
    "provincia": "Provincia de Quillota",
    "zone": "Sin Ruta Directa SIL",
    "colorClass": "zone-neutral",
    "hasService": false,
    "path": "M 382.7,278.0 L 346.6,278.0 L 326.3,267.7 L 332.9,240.9 L 309.5,225.8 L 340.8,227.4 L 363.4,210.3 L 388.9,236.2 L 371.9,238.5 L 382.7,278.0 Z",
    "cx": 354.6,
    "cy": 248.1,
    "labelX": 354.6,
    "labelY": 248.1,
    "isInset": false
  },
  {
    "id": "quilpue",
    "name": "Quilpué",
    "provincia": "Provincia de Marga Marga",
    "zone": "ZONA CENTRO",
    "colorClass": "zone-centro",
    "hasService": true,
    "path": "M 197.7,284.8 L 211.7,287.9 L 210.9,303.1 L 229.7,311.6 L 270.6,316.8 L 301.7,329.4 L 376.9,307.7 L 391.2,339.5 L 377.4,344.8 L 364.4,341.4 L 357.7,348.6 L 305.3,347.6 L 289.2,353.2 L 235.5,341.3 L 225.8,333.4 L 182.8,327.9 L 171.6,299.3 L 197.7,284.8 Z",
    "cx": 272.1,
    "cy": 322.4,
    "labelX": 280.1,
    "labelY": 328.4,
    "isInset": false
  }
];

export function initInteractiveMap() {
  const mapContainer = document.getElementById('map-vector-container');
  if (!mapContainer) return;

  // Ejecutar validación automática de IDs durante desarrollo
  const geojsonIds = MAP_COMUNAS_DATA.map(c => c.id);
  validateCoverageData(geojsonIds);

  mapContainer.innerHTML = `
    <div class="sil-svg-map-card">
      <div class="sil-svg-wrapper">
        <svg class="sil-coverage-svg" viewBox="0 0 860 560" role="img" aria-label="Mapa de cobertura de Transportes SIL en la Región de Valparaíso">
          <!-- Texto Océano Pacífico -->
          <text x="25" y="160" class="ocean-text">OCÉANO PACÍFICO</text>

          <!-- Grupo de 36 Comunas Continentales de la V Región -->
          <g class="mainland-group">
            ${MAP_COMUNAS_DATA.map(c => `
              <path 
                id="path-${c.id}"
                class="coverage-comuna ${c.colorClass} ${c.id === selectedComunaId ? 'selected' : ''}" 
                data-comuna-id="${c.id}" 
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
                data-comuna-id="${c.id}"
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

  // Seleccionar Valparaíso por defecto inicialmente
  selectComuna('valparaiso', false);
}

function setupMapInteractions() {
  const mapContainer = document.getElementById('map-vector-container');
  if (!mapContainer) return;

  // Delegación de eventos robusta (soporta data-comuna y data-comuna-id)
  mapContainer.addEventListener('click', (e) => {
    const target = e.target.closest('[data-comuna-id]') || e.target.closest('[data-comuna]');
    if (!target) return;

    const comunaId = target.getAttribute('data-comuna-id') || target.getAttribute('data-comuna');
    if (comunaId) {
      selectComuna(comunaId, false);
    }
  });

  // Botones de cotización dentro de la tarjeta
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-quote-comuna')) {
      const comunaId = e.target.getAttribute('data-comuna-id') || e.target.getAttribute('data-comuna');
      if (comunaId) {
        preselectDestination(comunaId, true);
      }
    }
  });
}

/**
 * Función ÚNICA centralizada de selección de comuna
 */
export function selectComuna(comunaId, scrollToCalc = false) {
  const info = getComunaInfo(comunaId);
  if (!info) {
    console.error(`No se encontró información para la comuna: ${comunaId}`);
    return;
  }

  selectedComunaId = comunaId;

  // 1. Quitar selección anterior y seleccionar la nueva comuna exactamente
  document.querySelectorAll('.coverage-comuna').forEach(p => {
    const pId = p.getAttribute('data-comuna-id') || p.getAttribute('data-comuna');
    if (pId === comunaId) {
      p.classList.add('selected');
    } else {
      p.classList.remove('selected');
    }
  });

  // 2. Actualizar curva decorativa hacia Santiago
  updateRouteCurve(comunaId);

  // 3. Actualizar TODA la tarjeta derecha con la nueva información
  showComunaDetail(info);

  // 4. Actualizar destino en la calculadora (sin scroll si es clic directo en mapa)
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
 * Reconstruye la tarjeta derecha garantizando que no queden datos de selecciones anteriores
 * y sin mostrar jamás 'undefined' ni 'null'.
 */
function showComunaDetail(info) {
  const infoCard = document.getElementById('map-info-card');
  if (!infoCard) return;

  const comunaName = (info && info.name) ? info.name : 'Valparaíso';
  const provinciaName = (info && info.provincia) ? info.provincia : 'Provincia de Valparaíso';
  const zoneName = (info && info.zone) ? info.zone : 'ZONA COSTA';
  const daysText = (info && info.days) ? info.days : DEFAULT_SERVICE_DAYS;
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
        <button class="btn btn-primary btn-block btn-quote-comuna sil-action-btn" data-comuna-id="${info.id}" data-comuna="${info.id}">
          Cotizar mi envío a ${comunaName} →
        </button>
      ` : `
        <a href="#contacto" class="btn btn-secondary btn-block sil-action-btn neutral-btn" data-comuna-id="${info.id}">
          Consultar disponibilidad en ${comunaName} →
        </a>
      `}
    </div>
  `;
}
