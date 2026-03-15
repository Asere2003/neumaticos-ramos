import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas estáticas → Prerender (mejor SEO)
  { path: '',          renderMode: RenderMode.Prerender },
  { path: 'servicios', renderMode: RenderMode.Prerender },
  { path: 'contacto',  renderMode: RenderMode.Prerender },

  // Rutas dinámicas → Server (necesitan datos)
  { path: 'reservar',           renderMode: RenderMode.Server },
  { path: 'confirmacion/:id',   renderMode: RenderMode.Server },

  // Admin → Client (no necesita SEO)
  { path: 'admin',              renderMode: RenderMode.Client },
  { path: 'admin/**',           renderMode: RenderMode.Client },

  // Resto → Server
  { path: '**',                 renderMode: RenderMode.Server },
];
