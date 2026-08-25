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
    "path": "M 475.1,228.2 L 486.5,234.8 L 482.4,256.1 L 488.7,260.4 L 483.1,270.2 L 473.0,268.6 L 462.3,234.9 L 475.1,228.2 Z",
    "cx": 478.3,
    "cy": 247.7,
    "labelX": 478.3,
    "labelY": 247.7
  },
  {
    "id": "cabildo",
    "name": "Cabildo",
    "provincia": "Provincia de Petorca",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": true,
    "path": "M 532.5,76.7 L 541.3,93.5 L 536.4,106.0 L 496.9,114.6 L 486.9,140.4 L 460.3,130.5 L 454.7,134.1 L 445.7,148.9 L 459.0,161.4 L 450.9,183.3 L 434.7,177.3 L 421.7,183.4 L 398.6,182.3 L 400.6,162.9 L 383.4,154.0 L 379.5,145.3 L 381.1,133.0 L 390.0,128.2 L 387.6,113.8 L 398.3,119.1 L 414.7,102.1 L 430.5,107.3 L 448.6,88.3 L 462.3,92.7 L 516.3,85.8 L 532.5,76.7 Z",
    "cx": 447.9,
    "cy": 128.5,
    "labelX": 447.9,
    "labelY": 128.5
  },
  {
    "id": "petorca",
    "name": "Petorca",
    "provincia": "Provincia de Petorca",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": true,
    "path": "M 470.7,25.0 L 479.3,34.6 L 486.9,32.4 L 487.6,53.1 L 511.6,63.9 L 514.5,56.8 L 531.3,63.1 L 531.6,73.3 L 516.3,85.8 L 462.3,92.7 L 448.6,88.3 L 430.5,107.3 L 414.7,102.1 L 398.3,119.1 L 387.6,113.8 L 375.9,96.7 L 370.5,62.8 L 404.0,37.3 L 401.7,26.5 L 421.4,30.6 L 426.3,38.8 L 470.7,25.0 Z",
    "cx": 451.9,
    "cy": 65.0,
    "labelX": 451.9,
    "labelY": 65.0
  },
  {
    "id": "panquehue",
    "name": "Panquehue",
    "provincia": "Provincia de San Felipe de Aconcagua",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": false,
    "path": "M 468.1,216.1 L 460.6,235.8 L 422.5,234.5 L 422.3,228.4 L 459.9,210.1 L 468.1,216.1 Z",
    "cx": 450.2,
    "cy": 223.5,
    "labelX": 450.2,
    "labelY": 223.5
  },
  {
    "id": "olmue",
    "name": "Olmué",
    "provincia": "Provincia de Marga Marga",
    "zone": "ZONA CENTRO",
    "colorClass": "zone-centro",
    "hasService": false,
    "path": "M 384.6,269.2 L 404.7,278.0 L 410.7,294.2 L 402.3,306.4 L 380.7,313.0 L 361.5,280.9 L 362.7,273.8 L 384.6,269.2 Z",
    "cx": 386.5,
    "cy": 285.6,
    "labelX": 386.5,
    "labelY": 285.6
  },
  {
    "id": "cartagena",
    "name": "Cartagena",
    "provincia": "Provincia de San Antonio",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": false,
    "path": "M 271.8,427.4 L 277.0,418.3 L 296.7,418.5 L 305.0,406.9 L 313.9,410.6 L 324.0,401.5 L 336.4,401.8 L 332.6,411.5 L 337.9,435.3 L 319.9,442.6 L 271.8,427.4 Z M 274.7,426.7 L 274.7,426.8 L 274.6,426.7 L 274.7,426.7 L 274.7,426.7 Z",
    "cx": 297.5,
    "cy": 421.0,
    "labelX": 297.5,
    "labelY": 421.0
  },
  {
    "id": "catemu",
    "name": "Catemu",
    "provincia": "Provincia de San Felipe de Aconcagua",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": false,
    "path": "M 434.9,177.4 L 450.9,183.3 L 439.5,210.1 L 443.5,220.6 L 422.3,228.4 L 422.5,234.5 L 415.2,228.4 L 410.4,235.7 L 399.0,212.4 L 403.5,194.4 L 398.7,185.5 L 406.5,178.9 L 415.1,183.8 L 434.9,177.4 Z",
    "cx": 421.2,
    "cy": 203.6,
    "labelX": 421.2,
    "labelY": 203.6
  },
  {
    "id": "llaillay",
    "name": "Llaillay",
    "provincia": "Provincia de San Felipe de Aconcagua",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": false,
    "path": "M 418.4,227.8 L 430.0,237.0 L 462.6,234.9 L 471.1,261.0 L 445.9,260.4 L 431.6,264.0 L 424.3,273.7 L 407.7,274.8 L 402.0,237.8 L 418.4,227.8 Z",
    "cx": 431.2,
    "cy": 249.9,
    "labelX": 431.2,
    "labelY": 249.9
  },
  {
    "id": "san-felipe",
    "name": "San Felipe",
    "provincia": "Provincia de San Felipe de Aconcagua",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": true,
    "path": "M 455.6,192.4 L 469.0,200.6 L 467.6,205.6 L 485.4,198.8 L 480.9,221.8 L 491.9,228.3 L 486.5,234.8 L 474.6,232.5 L 474.5,224.7 L 463.6,228.5 L 469.2,217.0 L 462.6,210.5 L 443.5,220.6 L 439.5,209.9 L 449.6,187.9 L 455.6,192.4 Z",
    "cx": 466.9,
    "cy": 212.9,
    "labelX": 466.9,
    "labelY": 212.9
  },
  {
    "id": "santa-maria",
    "name": "Santa María",
    "provincia": "Provincia de San Felipe de Aconcagua",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": false,
    "path": "M 508.7,168.1 L 518.6,176.8 L 506.9,184.6 L 505.7,201.2 L 496.5,208.5 L 498.0,231.7 L 480.9,221.8 L 481.1,214.3 L 494.8,178.3 L 508.7,168.1 Z",
    "cx": 500.0,
    "cy": 195.3,
    "labelX": 500.0,
    "labelY": 195.3
  },
  {
    "id": "villa-alemana",
    "name": "Villa Alemana",
    "provincia": "Provincia de Marga Marga",
    "zone": "ZONA CENTRO",
    "colorClass": "zone-centro",
    "hasService": true,
    "path": "M 322.5,293.1 L 322.4,284.4 L 337.5,292.7 L 345.4,283.9 L 353.2,309.4 L 343.6,312.9 L 331.4,306.9 L 322.5,293.1 Z",
    "cx": 334.8,
    "cy": 297.1,
    "labelX": 334.8,
    "labelY": 295.1
  },
  {
    "id": "santo-domingo",
    "name": "Santo Domingo",
    "provincia": "Provincia de San Antonio",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": false,
    "path": "M 234.6,490.0 L 262.5,471.3 L 271.0,444.4 L 278.0,448.6 L 291.9,479.4 L 287.5,512.6 L 282.1,511.2 L 251.3,535.0 L 244.7,525.5 L 237.7,529.5 L 231.3,522.0 L 225.1,526.4 L 234.6,490.0 Z",
    "cx": 256.3,
    "cy": 498.9,
    "labelX": 256.3,
    "labelY": 498.9
  },
  {
    "id": "san-antonio",
    "name": "San Antonio",
    "provincia": "Provincia de San Antonio",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": true,
    "path": "M 272.2,440.8 L 271.7,427.3 L 319.8,442.6 L 336.6,433.9 L 335.7,442.9 L 313.8,461.3 L 330.4,482.4 L 315.8,490.5 L 294.9,487.3 L 272.2,440.8 Z",
    "cx": 306.3,
    "cy": 455.0,
    "labelX": 306.3,
    "labelY": 455.0
  },
  {
    "id": "el-tabo",
    "name": "El Tabo",
    "provincia": "Provincia de San Antonio",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": false,
    "path": "M 269.9,414.0 L 260.0,399.6 L 271.0,394.6 L 279.4,403.2 L 305.0,406.9 L 297.6,417.8 L 282.8,422.0 L 269.9,414.0 Z",
    "cx": 279.4,
    "cy": 409.0,
    "labelX": 279.4,
    "labelY": 409.0
  },
  {
    "id": "el-quisco",
    "name": "El Quisco",
    "provincia": "Provincia de San Antonio",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": false,
    "path": "M 257.8,397.1 L 253.5,393.6 L 256.7,379.6 L 266.4,387.7 L 280.2,386.8 L 279.9,395.6 L 257.8,397.1 Z",
    "cx": 264.6,
    "cy": 391.1,
    "labelX": 264.6,
    "labelY": 391.1
  },
  {
    "id": "algarrobo",
    "name": "Algarrobo",
    "provincia": "Provincia de San Antonio",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": false,
    "path": "M 257.2,373.1 L 257.1,373.2 L 257.1,373.1 L 257.2,373.1 L 257.2,373.1 Z M 256.9,373.0 L 256.6,372.9 L 256.5,372.7 L 257.0,372.8 L 256.9,373.0 Z M 265.6,359.7 L 267.7,350.5 L 292.6,350.1 L 289.5,385.6 L 266.6,387.7 L 256.8,379.6 L 265.5,374.4 L 265.6,359.7 Z",
    "cx": 263.3,
    "cy": 371.0,
    "labelX": 263.3,
    "labelY": 371.0
  },
  {
    "id": "casablanca",
    "name": "Casablanca",
    "provincia": "Provincia de Valparaíso",
    "zone": "ZONA CENTRO",
    "colorClass": "zone-centro",
    "hasService": true,
    "path": "M 254.9,332.3 L 256.1,322.0 L 272.8,323.0 L 291.9,337.5 L 319.8,336.8 L 329.4,327.4 L 334.2,335.0 L 359.8,344.9 L 367.5,363.3 L 361.4,379.8 L 348.4,389.7 L 334.7,391.0 L 336.3,401.7 L 324.0,401.5 L 313.9,410.6 L 279.4,403.2 L 274.4,397.8 L 281.4,383.9 L 289.5,385.6 L 294.0,351.8 L 278.9,347.6 L 262.7,355.0 L 254.9,332.3 Z M 260.5,350.5 L 260.5,350.5 L 260.5,350.5 L 260.5,350.5 L 260.5,350.5 Z M 254.6,331.4 L 254.7,331.6 L 254.5,331.6 L 254.5,331.5 L 254.6,331.4 Z",
    "cx": 290.8,
    "cy": 356.5,
    "labelX": 290.8,
    "labelY": 356.5
  },
  {
    "id": "valparaiso",
    "name": "Valparaíso",
    "provincia": "Provincia de Valparaíso",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": true,
    "path": "M 280.3,288.9 L 290.3,308.5 L 299.3,306.2 L 306.8,321.6 L 325.1,328.7 L 323.0,334.2 L 291.9,337.5 L 272.8,323.0 L 254.3,321.5 L 245.5,307.3 L 263.1,306.8 L 267.4,286.3 L 273.4,292.2 L 280.3,288.9 Z",
    "cx": 283.8,
    "cy": 310.8,
    "labelX": 281.8,
    "labelY": 310.8
  },
  {
    "id": "vina-del-mar",
    "name": "Viña del Mar",
    "provincia": "Provincia de Valparaíso",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": true,
    "path": "M 289.1,267.2 L 289.5,266.4 L 297.3,270.0 L 312.7,281.4 L 303.5,290.1 L 306.7,298.4 L 301.7,308.5 L 290.3,308.5 L 280.7,288.4 L 288.5,283.0 L 289.1,267.2 Z",
    "cx": 295.4,
    "cy": 284.5,
    "labelX": 293.4,
    "labelY": 284.5
  },
  {
    "id": "concon",
    "name": "Concón",
    "provincia": "Provincia de Valparaíso",
    "zone": "ZONA COSTA",
    "colorClass": "zone-costa",
    "hasService": true,
    "path": "M 298.3,258.6 L 320.3,263.8 L 325.0,273.0 L 312.7,281.4 L 287.9,265.6 L 298.3,258.6 Z",
    "cx": 307.1,
    "cy": 266.8,
    "labelX": 307.1,
    "labelY": 264.8
  },
  {
    "id": "quintero",
    "name": "Quintero",
    "provincia": "Provincia de Valparaíso",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": false,
    "path": "M 294.9,251.4 L 294.9,251.5 L 294.7,251.5 L 294.8,251.4 L 294.9,251.4 Z M 295.7,251.6 L 295.4,252.3 L 294.9,251.6 L 295.6,251.4 L 295.7,251.6 Z M 292.3,222.4 L 292.3,222.4 L 292.2,222.4 L 292.3,222.4 L 292.3,222.4 Z M 291.0,221.0 L 291.1,221.0 L 291.0,221.0 L 291.0,220.9 L 291.0,221.0 Z M 291.3,221.0 L 292.3,218.9 L 296.8,224.0 L 305.3,218.3 L 307.9,228.3 L 318.6,224.1 L 317.3,239.3 L 324.8,243.1 L 310.6,252.1 L 312.0,261.4 L 298.8,260.1 L 291.3,221.0 Z",
    "cx": 298.0,
    "cy": 235.8,
    "labelX": 298.0,
    "labelY": 235.8
  },
  {
    "id": "puchuncavi",
    "name": "Puchuncaví",
    "provincia": "Provincia de Valparaíso",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": false,
    "path": "M 302.3,203.9 L 302.2,203.9 L 302.2,203.8 L 302.3,203.8 L 302.3,203.9 Z M 302.0,203.8 L 302.0,203.8 L 302.0,203.9 L 301.9,203.8 L 302.0,203.8 Z M 312.8,188.6 L 318.7,182.5 L 328.8,195.7 L 349.2,201.2 L 341.4,210.8 L 345.9,223.9 L 328.3,244.6 L 317.3,239.3 L 318.6,224.1 L 307.9,228.3 L 301.0,218.2 L 297.9,204.8 L 306.8,204.5 L 312.8,188.6 Z",
    "cx": 312.9,
    "cy": 208.1,
    "labelX": 312.9,
    "labelY": 208.1
  },
  {
    "id": "zapallar",
    "name": "Zapallar",
    "provincia": "Provincia de Petorca",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": false,
    "path": "M 306.2,151.7 L 307.8,148.6 L 314.8,161.7 L 325.1,163.0 L 344.1,148.6 L 366.3,176.5 L 358.5,177.0 L 342.1,194.6 L 328.8,195.7 L 315.5,183.9 L 306.2,151.7 Z M 309.6,171.4 L 309.7,172.2 L 309.0,171.9 L 309.4,171.4 L 309.6,171.4 Z M 307.6,148.7 L 307.2,148.5 L 307.3,148.2 L 307.6,148.2 L 307.6,148.7 Z",
    "cx": 319.0,
    "cy": 164.5,
    "labelX": 319.0,
    "labelY": 164.5
  },
  {
    "id": "papudo",
    "name": "Papudo",
    "provincia": "Provincia de Petorca",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": false,
    "path": "M 319.9,125.5 L 338.7,123.7 L 348.0,133.7 L 339.7,133.8 L 344.1,148.6 L 325.1,163.0 L 310.5,158.9 L 308.3,149.5 L 314.6,147.7 L 319.9,125.5 Z",
    "cx": 326.9,
    "cy": 141.0,
    "labelX": 326.9,
    "labelY": 141.0
  },
  {
    "id": "la-ligua",
    "name": "La Ligua",
    "provincia": "Provincia de Petorca",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": false,
    "path": "M 293.6,80.1 L 293.6,80.0 L 293.7,79.8 L 293.7,80.0 L 293.6,80.1 Z M 294.0,79.8 L 293.9,79.9 L 293.9,79.8 L 293.9,79.8 L 294.0,79.8 Z M 294.2,79.1 L 294.2,79.2 L 294.1,79.2 L 294.1,79.2 L 294.2,79.1 Z M 292.5,72.7 L 292.3,72.7 L 292.1,72.5 L 292.4,72.5 L 292.5,72.7 Z M 292.2,71.8 L 292.1,71.8 L 292.1,71.7 L 292.2,71.7 L 292.2,71.8 Z M 290.4,70.4 L 290.4,70.3 L 290.6,70.3 L 290.6,70.4 L 290.4,70.4 Z M 290.8,70.4 L 290.7,70.3 L 290.9,70.2 L 291.0,70.3 L 290.8,70.4 Z M 291.3,70.2 L 291.2,70.3 L 291.3,70.1 L 291.4,70.2 L 291.3,70.2 Z M 290.6,69.9 L 290.4,69.9 L 290.3,69.8 L 290.5,69.7 L 290.6,69.9 Z M 304.1,85.2 L 294.3,81.1 L 290.8,64.4 L 299.3,65.4 L 304.9,58.6 L 335.8,71.2 L 365.9,53.0 L 375.9,96.7 L 387.8,110.1 L 390.0,128.2 L 381.1,133.0 L 379.9,146.8 L 400.6,162.9 L 392.9,179.9 L 375.2,173.0 L 366.3,176.5 L 339.9,140.4 L 339.7,133.8 L 347.9,133.7 L 338.7,123.7 L 320.5,123.9 L 306.5,108.4 L 304.1,85.2 Z",
    "cx": 310.1,
    "cy": 87.6,
    "labelX": 310.1,
    "labelY": 87.6
  },
  {
    "id": "limache",
    "name": "Limache",
    "provincia": "Provincia de Marga Marga",
    "zone": "ZONA CENTRO",
    "colorClass": "zone-centro",
    "hasService": true,
    "path": "M 313.5,260.4 L 328.0,259.3 L 337.3,268.2 L 362.7,273.8 L 381.3,317.4 L 367.5,323.7 L 358.4,319.0 L 346.1,298.0 L 345.4,283.9 L 337.5,292.7 L 314.8,281.2 L 325.0,273.0 L 313.5,260.4 Z",
    "cx": 340.8,
    "cy": 285.5,
    "labelX": 340.8,
    "labelY": 285.5
  },
  {
    "id": "quillota",
    "name": "Quillota",
    "provincia": "Provincia de Quillota",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": true,
    "path": "M 345.2,236.3 L 378.6,246.0 L 377.2,262.3 L 384.4,268.9 L 356.5,274.0 L 328.0,259.3 L 312.7,260.5 L 310.6,252.1 L 345.2,236.3 Z",
    "cx": 348.7,
    "cy": 255.1,
    "labelX": 348.7,
    "labelY": 255.1
  },
  {
    "id": "la-calera",
    "name": "La Calera",
    "provincia": "Provincia de Quillota",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": true,
    "path": "M 367.9,232.0 L 359.9,225.2 L 366.9,219.1 L 391.5,215.9 L 386.5,227.3 L 370.9,225.8 L 382.5,240.1 L 378.6,245.9 L 367.9,232.0 Z",
    "cx": 374.7,
    "cy": 229.3,
    "labelX": 374.7,
    "labelY": 229.3
  },
  {
    "id": "nogales",
    "name": "Nogales",
    "provincia": "Provincia de Quillota",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": true,
    "path": "M 376.4,174.8 L 391.2,181.0 L 398.7,175.4 L 400.8,210.9 L 380.9,220.2 L 366.9,219.1 L 357.1,231.2 L 345.5,223.5 L 341.4,210.8 L 349.2,201.2 L 340.2,195.5 L 359.4,176.5 L 376.4,174.8 Z",
    "cx": 368.0,
    "cy": 199.6,
    "labelX": 368.0,
    "labelY": 199.6
  },
  {
    "id": "calle-larga",
    "name": "Calle Larga",
    "provincia": "Provincia de Los Andes",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": false,
    "path": "M 502.0,242.1 L 520.0,249.4 L 542.4,281.2 L 520.0,304.5 L 500.7,267.0 L 486.3,268.7 L 488.7,260.1 L 482.4,256.1 L 486.5,234.8 L 502.0,242.1 Z M 495.2,238.6 L 495.2,238.6 L 495.2,238.6 L 495.2,238.6 L 495.2,238.6 Z",
    "cx": 500.5,
    "cy": 253.3,
    "labelX": 500.5,
    "labelY": 255.3
  },
  {
    "id": "la-cruz",
    "name": "La Cruz",
    "provincia": "Provincia de Quillota",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": true,
    "path": "M 350.5,223.0 L 357.1,231.2 L 359.9,225.2 L 364.0,228.2 L 378.6,246.0 L 338.3,236.6 L 343.3,225.1 L 350.5,223.0 Z",
    "cx": 355.3,
    "cy": 229.8,
    "labelX": 355.3,
    "labelY": 229.8
  },
  {
    "id": "putaendo",
    "name": "Putaendo",
    "provincia": "Provincia de San Felipe de Aconcagua",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": false,
    "path": "M 581.8,130.8 L 575.6,142.2 L 563.6,146.0 L 546.3,176.9 L 541.2,171.4 L 518.7,176.0 L 505.0,167.5 L 490.1,194.3 L 467.8,205.6 L 469.0,200.6 L 450.5,187.4 L 459.0,161.4 L 445.7,148.9 L 454.7,134.1 L 460.2,130.5 L 491.0,138.7 L 496.8,114.6 L 527.0,111.3 L 552.3,84.5 L 583.3,103.3 L 581.8,130.8 Z",
    "cx": 512.4,
    "cy": 150.3,
    "labelX": 512.4,
    "labelY": 150.3
  },
  {
    "id": "san-esteban",
    "name": "San Esteban",
    "provincia": "Provincia de Los Andes",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": false,
    "path": "M 599.9,189.7 L 594.4,220.0 L 552.1,257.1 L 541.6,245.4 L 497.9,231.6 L 496.5,208.5 L 505.7,201.2 L 506.9,184.6 L 524.5,173.6 L 541.2,171.4 L 546.3,176.9 L 563.6,146.0 L 575.6,142.2 L 581.9,130.8 L 602.6,145.9 L 604.6,168.8 L 594.4,181.2 L 599.9,189.7 Z",
    "cx": 557.2,
    "cy": 186.9,
    "labelX": 557.2,
    "labelY": 186.9
  },
  {
    "id": "los-andes",
    "name": "Los Andes",
    "provincia": "Provincia de Los Andes",
    "zone": "ZONA ESTE",
    "colorClass": "zone-este",
    "hasService": true,
    "path": "M 612.1,293.8 L 598.0,310.8 L 588.3,310.3 L 578.5,330.5 L 574.0,329.5 L 572.3,315.7 L 547.1,305.6 L 539.2,287.5 L 542.4,281.2 L 520.1,249.5 L 486.4,233.0 L 492.2,228.3 L 503.0,237.3 L 541.6,245.4 L 552.1,257.1 L 593.8,220.8 L 596.7,212.3 L 599.1,208.7 L 599.8,208.3 L 600.2,208.3 L 600.4,208.3 L 608.6,228.3 L 634.9,254.0 L 628.2,282.8 L 612.1,293.8 Z",
    "cx": 572.8,
    "cy": 261.6,
    "labelX": 572.8,
    "labelY": 261.6
  },
  {
    "id": "hijuelas",
    "name": "Hijuelas",
    "provincia": "Provincia de Quillota",
    "zone": "ZONA NORTE",
    "colorClass": "zone-norte",
    "hasService": true,
    "path": "M 407.3,275.0 L 389.4,275.0 L 379.3,265.3 L 382.5,240.1 L 370.9,225.8 L 386.5,227.3 L 397.7,211.2 L 410.4,235.7 L 402.0,237.8 L 407.3,275.0 Z",
    "cx": 393.3,
    "cy": 246.8,
    "labelX": 393.3,
    "labelY": 246.8
  },
  {
    "id": "quilpue",
    "name": "Quilpué",
    "provincia": "Provincia de Marga Marga",
    "zone": "ZONA CENTRO",
    "colorClass": "zone-centro",
    "hasService": true,
    "path": "M 315.4,281.5 L 322.4,284.4 L 322.0,298.8 L 331.3,306.9 L 351.6,311.8 L 367.0,323.6 L 404.4,303.1 L 411.5,333.2 L 404.7,338.2 L 398.2,335.0 L 394.9,341.9 L 368.9,340.9 L 360.8,346.2 L 334.2,335.0 L 329.4,327.4 L 308.0,322.3 L 302.4,295.2 L 315.4,281.5 Z",
    "cx": 352.4,
    "cy": 317.0,
    "labelX": 352.4,
    "labelY": 321.0
  }
];

export function initInteractiveMap() {
  const mapContainer = document.getElementById('map-vector-container');
  if (!mapContainer) return;

  const geojsonIds = MAP_COMUNAS_DATA.map(c => c.id);
  validateCoverageData(geojsonIds);

  mapContainer.innerHTML = `
    <div class="sil-svg-map-card">
      <div class="sil-svg-wrapper">
        <svg class="sil-coverage-svg" viewBox="0 0 860 560" role="img" aria-label="Mapa de cobertura de Transportes SIL en la Región de Valparaíso">
          <text x="25" y="160" class="ocean-text">OCÉANO PACÍFICO</text>

          <g class="mainland-group">
            ${MAP_COMUNAS_DATA.map(c => {
              const info = getComunaInfo(c.id);
              const colorClass = info ? info.colorClass : c.colorClass;
              const zone = info ? info.zone : c.zone;
              return `
                <path 
                  id="path-${c.id}"
                  class="coverage-comuna ${colorClass} ${c.id === selectedComunaId ? 'selected' : ''}" 
                  data-comuna-id="${c.id}" 
                  data-comuna="${c.id}"
                  data-name="${c.name}"
                  d="${c.path}" 
                >
                  <title>${c.name} (${zone})</title>
                </path>
              `;
            }).join('')}
          </g>

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

          <path id="santiago-route-curve" class="route-connection-line" d="M 540 450 Q 420 440 103.7 285.9" />

          <g class="santiago-marker-group" transform="translate(540, 450)">
            <rect x="-75" y="-16" width="155" height="32" rx="16" class="santiago-pill-bg" />
            <circle cx="-56" cy="0" r="8" class="santiago-pin-circle" />
            <text x="-40" y="4" class="santiago-pill-text">SANTIAGO <tspan class="santiago-sub">(ORIGEN)</tspan></text>
          </g>
        </svg>
      </div>

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
  selectComuna('valparaiso', false);
}

function setupMapInteractions() {
  const mapContainer = document.getElementById('map-vector-container');
  const infoContainer = document.querySelector('.map-info-card-container');

  if (mapContainer) {
    mapContainer.addEventListener('click', (e) => {
      const target = e.target.closest('[data-comuna-id]') || e.target.closest('[data-comuna]');
      if (!target) return;

      const comunaId = target.getAttribute('data-comuna-id') || target.getAttribute('data-comuna');
      if (comunaId) {
        selectComuna(comunaId, false, true);
      }
    });
  }

  if (infoContainer) {
    infoContainer.addEventListener('click', (e) => {
      if (e.target === infoContainer) {
        closeMapPopup();
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-quote-comuna')) {
      const comunaId = e.target.getAttribute('data-comuna-id') || e.target.getAttribute('data-comuna');
      if (comunaId) {
        closeMapPopup();
        preselectDestination(comunaId, true);
      }
    }
  });
}

export function openMapPopup() {
  const infoContainer = document.querySelector('.map-info-card-container');
  if (infoContainer) {
    infoContainer.classList.add('is-open');
  }
}

export function closeMapPopup() {
  const infoContainer = document.querySelector('.map-info-card-container');
  if (infoContainer) {
    infoContainer.classList.remove('is-open');
  }
}

export function selectComuna(comunaId, scrollToCalc = false, isUserClick = false) {
  const info = getComunaInfo(comunaId);
  if (!info) {
    console.error(`No se encontró información para la comuna: ${comunaId}`);
    return;
  }

  selectedComunaId = comunaId;

  document.querySelectorAll('.coverage-comuna').forEach(p => {
    const pId = p.getAttribute('data-comuna-id') || p.getAttribute('data-comuna');
    if (pId === comunaId) {
      p.classList.add('selected');
    } else {
      p.classList.remove('selected');
    }
  });

  updateRouteCurve(comunaId);
  showComunaDetail(info);

  if (isUserClick) {
    openMapPopup();
  }

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

function showComunaDetail(info) {
  const infoCard = document.getElementById('map-info-card');
  if (!infoCard) return;

  const comunaName = (info && info.name) ? info.name : 'Valparaíso';
  const provinciaName = (info && info.provincia) ? info.provincia : 'Provincia de Valparaíso';
  const zoneName = (info && info.zone) ? info.zone : 'ZONA COSTA';
  const isConfigured = !!(info && info.hasService);

  infoCard.innerHTML = `
    <div class="sil-detail-card animate-fade-in">
      <button type="button" class="map-popup-close-btn" id="map-popup-close-btn" aria-label="Cerrar información">&times;</button>
      <div class="sil-detail-header">
        <span class="sil-zone-title ${isConfigured ? 'configured-zone' : 'neutral-zone'}">${zoneName.toUpperCase()}</span>
        <h2 class="sil-comuna-heading">${comunaName}</h2>
        <span class="sil-provincia-subtitle">${provinciaName}</span>
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

  const closeBtn = document.getElementById('map-popup-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMapPopup();
    });
  }
}
