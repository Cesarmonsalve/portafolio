# 📋 CHANGELOG — CM Design Portfolio

Registro cronológico de todas las modificaciones realizadas al proyecto.
Úsalo como referencia para futuras sesiones de desarrollo.

---

## [2026-05-15] — Tipografía, Command Palette & Super-Admin UX

### 🔤 Tipografía
- **Migración de Syne → Outfit**: Fuente principal actualizada a `Outfit` (Google Fonts) en `layout.tsx`, `tailwind.config.js` y `globals.css` (clases `.text-display`, `.text-heading`, `.text-subheading`).
- **text-wrap: balance** añadido a los títulos principales para evitar líneas viudas.

### 🔍 Paleta de Comandos (Cmd+K)
- **Componente**: `src/components/CommandPalette.tsx`
- **Función**: Buscador universal flotante activado con `Ctrl+K` / `Cmd+K`. Permite buscar proyectos y navegar a cualquier sección.
- **Montado globalmente** en `src/app/layout.tsx`.

### 🟢 Indicador de Disponibilidad
- **Ubicación**: `src/components/Navbar.tsx`
- Punto verde con animación `animate-ping` que dice "Disponible" junto al logo.

### 🔔 Sistema de Notificaciones (Toasts)
- **Componente**: `src/components/ui/Toast.tsx`
- **Función**: Burbujas de notificación estilo cristal (glass-premium) con `CustomEvent` para cero dependencias.
- **Integrado en**: AdminProjects, AdminSkills, AdminStore.

### ↕️ Reordenamiento (Admin)
- **Flechas ↑ ↓** añadidas a AdminProjects, AdminSkills y AdminStore para reordenar elementos.

### 👁 Visibilidad de Proyectos (Admin)
- **Botón Ojo** en AdminProjects para ocultar/publicar proyectos sin eliminarlos.
- Propiedad `hidden?: boolean` añadida a la interfaz `Project`.

### 🎨 Glass Premium (Admin)
- Tarjetas de AdminProjects, AdminSkills y AdminStore usan la clase `.glass-premium` para un look de cristal premium.

---

## [2026-05-15] — UI Premium "2026" (Glass 3.0 & Efectos Interactivos)

### 🧲 Botones Magnéticos
- **Componente**: `src/components/ui/MagneticButton.tsx`
- Efecto de atracción al cursor + spotlight interactivo con Vanilla JS.

### 🃏 Tarjetas 3D (Tilt)
- **Componente**: `src/components/ui/TiltCard.tsx`
- Efecto de inclinación 3D en hover. Desactivado en dispositivos táctiles.
- Aplicado en `ProjectsGrid.tsx`.

### ✨ CSS Houdini (Bordes Animados)
- **Clase**: `.moving-border-btn` en `globals.css`
- Usa `@property --border-angle` para animar bordes con conic-gradient fuera del main thread.
- Aplicado en botones "VER TRABAJOS" (Hero) y "TIENDA" (Navbar).

### 🔮 Glassmorphism 3.0
- **Clase**: `.glass-premium` en `globals.css`
- Capas de `backdrop-filter: blur(30px) saturate(150%) brightness(1.15)` con bordes dobles y sombras internas.

---

## [2026-05-15] — Optimización de Rendimiento Crítica

### ⚡ Eliminación de Framer-Motion (Páginas Públicas)
- **Tienda** (`src/app/tienda/page.tsx`): Eliminada completamente la dependencia de `framer-motion`. Reemplazada por clases CSS nativas (`animate-slide-up`, `animate-fade-in`).
- **Footer** (`src/components/Footer.tsx`): Eliminada `motion` completamente. Hover effects ahora son CSS puro.
- **About** (`src/components/About.tsx`): Reemplazadas `motion.div` (whileInView) por `animate-slide-left`, `animate-slide-right`.
- **Skills** (`src/components/Skills.tsx`): Eliminadas animaciones `motion.div` y `motion.div` para barras. Ahora usan `animate-slide-up` y `animate-bar-fill` (CSS).
- **Contact** (`src/components/Contact.tsx`): Eliminadas `motion.div`, `motion.a`, `motion.button` y `AnimatePresence`. Reemplazadas con animaciones CSS.

### 🎨 Sistema de Animaciones CSS (globals.css)
- **Nuevas clases**: `animate-slide-up`, `animate-fade-in`, `animate-slide-left`, `animate-slide-right`, `animate-bar-fill`.
- Todas usan `cubic-bezier(0.16, 1, 0.3, 1)` para curvas orgánicas premium.
- Se ejecutan 100% en el compositor GPU (off-main-thread), no bloquean el rendering.
- Reducción de JS: 5.37kB → 5.15kB (tienda).

### 🔧 Font Loading
- Eliminado `@import` de Google Fonts. Migrado a `next/font/google` con `display: 'swap'`.

### 🐛 Bug Fix — Botón "Comprar"
- **Archivo**: `src/app/tienda/page.tsx`
- **Problema**: El botón "COMPRAR AHORA" en productos de pago sin `paymentUrl` usaba `href="#"`, redirigiendo a la misma página.
- **Solución**: Ahora se muestra un botón deshabilitado "PRÓXIMAMENTE" cuando no hay URL de pago configurada.

---

## Arquitectura y Convenciones

### Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + CSS nativo (Houdini, animaciones)
- **Base de datos**: Neon Postgres (con fallback a `localStorage`)
- **Fuentes**: `Outfit` (display) + `Inter` (body) via `next/font/google`

### Variables de Entorno
- `NEXT_PUBLIC_ADMIN_PASS`: Contraseña del panel admin (default: `cm2026`)
- `DATABASE_URL`: Cadena de conexión a Neon Postgres

### Archivos Clave
| Ruta | Descripción |
|------|-------------|
| `src/app/layout.tsx` | Layout raíz (fuentes, toasts, command palette) |
| `src/app/globals.css` | Sistema de diseño CSS completo |
| `src/app/admin/page.tsx` | Panel de administración |
| `src/components/ui/` | Componentes UI reutilizables (MagneticButton, TiltCard, Toast) |
| `src/lib/SiteConfigContext.tsx` | Estado global y sincronización con DB |
| `src/lib/config.ts` | Tipos e interfaces centrales |
| `tailwind.config.js` | Configuración de colores, fuentes, animaciones |
