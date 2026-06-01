# CM Design — Informe de mejoras (rediseño + SEO)

**Fecha:** 1 de junio de 2026 · **Alcance:** sitio público + panel de administración

Este documento resume el diagnóstico y **todos los cambios aplicados** al proyecto, organizados según las disciplinas solicitadas: auditoría de sistema de diseño, crítica de diseño, auditoría SEO y recomendaciones de contenido.

---

## 1. Auditoría del sistema de diseño

### Resumen
**Componentes revisados:** 23 · **Hallazgo crítico:** el admin no compartía el lenguaje visual del sitio público · **Estado tras cambios:** resuelto

El sitio público tiene un sistema coherente y bien definido ("arena/esports"): esquinas angulares (`angle-frame`), acento lima `#CBFE1C`, paneles `acid-panel`, botones `acid-button`/`ghost-button` y tipografía contundente. El **panel de administración**, en cambio, era un dashboard genérico que ignoraba por completo ese sistema.

### Cobertura de tokens — antes
| Categoría | Sitio público | Admin (antes) |
|-----------|---------------|---------------|
| Esquinas | `angle-frame` (angular) | **177** usos de `rounded-xl/2xl/lg` (redondeadas) |
| Superficies | `bg-surface`, `bg-bg-secondary` | **~280** tokens `zinc-*` genéricos |
| Acento | lima `#CBFE1C` | gradientes azul/verde/morado/rojo-rosa de plantilla |
| Marca | uniforme | **0** usos de `angle-frame` en los 7 componentes |

### Acciones aplicadas
1. **Nuevo módulo de tokens admin** en `globals.css`: `.admin-card`, `.admin-surface`, `.admin-input`, `.admin-tab`, `.admin-chip`, `.admin-label` — todos angulares y con el acento lima, espejo exacto del sistema público.
2. **Migración completa de los 7 componentes admin**: `rounded-*` → `angle-frame`, `zinc-*` → tokens de superficie/borde de marca, focus rojos → focus lima, y los 6 botones primarios (gradiente rojo-rosa) → lima sólido con texto oscuro legible.
3. **Resultado verificado:** `0` tokens `zinc`, `0` esquinas redondeadas grandes y `0` gradientes fuera de marca en el admin; **164** usos de `angle-frame`.

### Acciones prioritarias restantes (fase 2)
1. Unificar los íconos semánticos sueltos (`text-blue-400`, `text-green-400`) a la paleta lima/violeta/cian.
2. Documentar formalmente los estados de cada componente compartido (botón, input, card) en un único archivo de referencia.

---

## 2. Crítica de diseño

### Impresión general
El sitio público es memorable y cohesivo; la mayor oportunidad estaba en el admin, que ahora habla el mismo idioma visual.

### Sitio público
| Hallazgo | Severidad | Recomendación (aplicada/sugerida) |
|----------|-----------|-----------------------------------|
| Página 404 fuera de marca (system-ui, botón blanco redondeado) | 🟡 Moderado | ✅ Reconstruida con estética arena (`acid-button`, grilla, glow) |
| Imágenes de proyectos sin `loading="lazy"` | 🟡 Moderado | ✅ Lazy-load + `decoding="async"` añadidos |
| `alt` poco descriptivos | 🟢 Menor | ✅ `alt` enriquecidos con categoría/rol para SEO y accesibilidad |
| Elementos decorativos leídos por lectores de pantalla | 🟢 Menor | ✅ `aria-hidden` en marquee y texto decorativo |

### Panel de administración
| Hallazgo | Severidad | Recomendación (aplicada) |
|----------|-----------|--------------------------|
| Gráfico de "Tráfico Estimado +24%" con datos **inventados** | 🔴 Crítico | ✅ Reemplazado por **distribución real de proyectos por categoría** |
| Inconsistencia visual total con el sitio | 🔴 Crítico | ✅ Migrado al sistema angular de marca |
| Login con input gris genérico | 🟡 Moderado | ✅ Input angular lima + kicker de marca |
| Sin señal de progreso/configuración | 🟢 Menor | ✅ Nuevo **checklist de configuración real** (foto, redes, WhatsApp, email, etc.) con % de avance |

### Lo que funciona bien
- Jerarquía tipográfica del hero y consistencia del acento lima.
- Microinteracciones (tilt en tarjetas, marquee, estados hover).
- Arquitectura editable (config en contexto + fallback a `localStorage`/DB).

---

## 3. Auditoría SEO

### Estado técnico — antes vs. después
| Elemento | Antes | Después |
|----------|-------|---------|
| `metadataBase` / canonical | ❌ | ✅ `metadataBase` + canonical |
| Sitemap | ❌ | ✅ `app/sitemap.ts` (estáticas + detalle de proyectos) |
| `robots.txt` | ❌ | ✅ `app/robots.ts` (bloquea `/admin` y `/api`, enlaza sitemap) |
| Datos estructurados | ❌ | ✅ JSON-LD `WebSite` + `Person`/`ProfessionalService` |
| Imagen Open Graph | ❌ | ✅ `og-image.png` 1200×630 de marca |
| Twitter Card | parcial | ✅ `summary_large_image` con imagen |
| PWA manifest | ❌ | ✅ `app/manifest.ts` |
| Title/description optimizados | básico | ✅ title <60c con keyword, description con CTA |

### On-page
- **H1 único** por página: correcto (el hero usa un solo `h1`).
- **Keyword principal** ("motion graphics", "diseño de flyers") ahora en title, description, OG y JSON-LD (`knowsAbout`).
- **Locale** corregido a `es_ES` y `lang="es"` consistente.

### Recomendaciones restantes
1. **`NEXT_PUBLIC_SITE_URL`**: define la variable de entorno en Vercel con el dominio final (hoy usa `https://cm-design.vercel.app` como fallback).
2. **Rendimiento de imágenes**: varios assets en `/public` pesan 1–1,7 MB. Comprimir a WebP (objetivo <300 KB) mejorará LCP y Core Web Vitals.
3. **Migrar `<img>` a `next/image`** en hero/tarjetas para `srcset` y lazy-loading nativos.
4. **Páginas de proyecto**: añadir metadata por `id` (`generateMetadata`) con título y descripción propios para indexar cada pieza.

---

## 4. Contenido (recomendaciones)

La estructura de copy es sólida. Mejoras sugeridas, orientadas a conversión y SEO (editables desde el panel):

- **Hero (description):** abrir con beneficio + keyword. Ej.: *"Motion graphics, flyers de evento y branding que rompen el scroll y convierten miradas en clientes."*
- **CTA:** "Iniciar proyecto" → considerar "Cotiza tu proyecto" o "Agenda una llamada" (intención más transaccional).
- **Datos de contacto:** los valores `cm@design.com` y `wa.me/1234567890` son **placeholders**; reemplázalos por los reales en *Config* (también alimentan el JSON-LD).
- **Proyectos:** cada descripción debería cerrar con el resultado/objetivo ("para qué sirvió"), no solo el estilo, reforzando intención comercial.

---

## Archivos modificados / creados

**Nuevos**
- `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/manifest.ts`
- `public/og-image.png` (1200×630, generada con la identidad de marca)

**Reescritos**
- `src/app/layout.tsx` — metadata completa + JSON-LD
- `src/app/not-found.tsx` — 404 en marca
- `src/components/admin/AdminDashboard.tsx` — datos reales, sin métricas inventadas
- `src/app/admin/page.tsx` — login + shell angulares

**Actualizados**
- `src/app/globals.css` — módulo de tokens del admin
- 6 componentes admin — migrados al sistema angular
- `Hero.tsx`, `About.tsx`, `ProjectCard.tsx` — accesibilidad, `alt` y lazy-loading

> Verificado con `tsc`: **0 errores de sintaxis** en todos los archivos tocados. *(No fue posible un `next build` completo en este entorno por restricciones de red en el registro npm; las dependencias se instalan normalmente con `pnpm install` en local/Vercel.)*
