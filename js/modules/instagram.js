// Galería de fotos con novedades y operaciones.

export function initInstagramSection() {
  const container = document.getElementById('instagram-feed-grid');
  if (!container) return;

  const posts = [
    {
      id: 1,
      caption: "Carga fraccionada palletizada lista para salir desde Santiago hacia Viña del Mar y Valparaíso. #TransportesSIL #LogisticaChile",
      image: "assets/images/warehouse.jpg",
      tag: "Despacho Diario",
      date: "Hace 2 días"
    },
    {
      id: 2,
      caption: "Unidad de flota propia en ruta V Región. Salidas de lunes a viernes. #CargaPalletizada",
      image: "assets/images/hero-truck.jpg",
      tag: "Flota Propia",
      date: "Hace 4 días"
    },
    {
      id: 3,
      caption: "Consolidación de carga palletizada en bodegas de Santiago. #LogisticaChile",
      image: "assets/images/warehouse.jpg",
      tag: "Operaciones",
      date: "Hace 1 semana"
    }
  ];

  container.innerHTML = posts.map(post => `
    <article class="insta-card">
      <div class="insta-card-img-wrapper">
        <img src="${post.image}" alt="Transportes SIL - Operación de transporte" loading="lazy" class="insta-card-img" />
        <span class="insta-tag-badge">${post.tag}</span>
      </div>
      <div class="insta-card-content">
        <div class="insta-card-header">
          <span class="insta-user">@transportes_sil</span>
          <span class="insta-date">${post.date}</span>
        </div>
        <p class="insta-caption">${post.caption}</p>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="insta-link">
          Ver en Instagram ↗
        </a>
      </div>
    </article>
  `).join('');
}
