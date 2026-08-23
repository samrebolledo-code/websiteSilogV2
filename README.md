# Transportes SIL

Sitio web oficial de Transportes SIL, empresa especializada en transporte de carga fraccionada palletizada desde Santiago hacia la Región de Valparaíso.

## Funciones

- Calculadora para obtener el valor estimado de envíos palletizados desde Santiago a la V Región.
- Mapa interactivo con las 36 comunas de la Región de Valparaíso y sus zonas de atención.
- Formulario de contacto directo y botón para cotizar por WhatsApp.
- Galería de fotos con operaciones reales de la empresa.

## Estructura del proyecto

```text
transportes-sil/
├── index.html           # Estructura principal de la página
├── css/
│   ├── main.css         # Estilos generales y variables
│   ├── components.css   # Estilos de componentes (mapa, cotizador, header, etc.)
│   └── utilities.css    # Clases de utilidad
├── js/
│   ├── config/
│   │   ├── coverage.js  # Datos de comunas y días de despacho
│   │   └── tariffs.js   # Reglas de tarifas y cálculo
│   ├── modules/
│   │   ├── calculator.js  # Lógica del cotizador
│   │   ├── map.js         # Lógica e interacción del mapa
│   │   ├── whatsapp.js    # Generación de mensajes para WhatsApp
│   │   ├── contactForm.js # Manejo del formulario de contacto
│   │   └── instagram.js   # Galería de imágenes
│   └── app.js           # Inicialización de la aplicación
└── assets/              # Logo e imágenes del sitio
```

## Ejecutar localmente

1. Abre una terminal en la carpeta del proyecto.
2. Ejecuta un servidor local con Python:
   ```bash
   python -m http.server 3000
   ```
3. Abre en tu navegador `http://localhost:3000`.

También puedes abrir directamente el archivo `index.html` en cualquier navegador.

## Configuración

### Tarifas y cálculo (`js/config/tariffs.js`)
En este archivo puedes modificar los precios base por pallet, recargos por peso adicional y valores para camión completo.

### Comunas y zonas (`js/config/coverage.js`)
Aquí se definen las comunas disponibles, provincias, zonas y días de atención.

### WhatsApp y datos de contacto (`js/modules/whatsapp.js` e `index.html`)
Para actualizar el número de WhatsApp al que llegan las cotizaciones, modifica la propiedad `phone` en `js/modules/whatsapp.js`. Los datos visibles de la empresa (correo, teléfonos) se editan en `index.html`.

## Despliegue

Al ser un sitio estático, puede alojarse en cualquier servidor web o plataforma de hosting como Cloudflare Pages, Netlify o Vercel.
