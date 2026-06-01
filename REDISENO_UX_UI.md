# CM Design — Rediseño UX/UI inspirado en estética esports

## Objetivo

Esta versión conserva la lógica del portafolio original y transforma completamente su lenguaje visual. La referencia estética fue el segundo proyecto entregado: fondos oscuros, acento lima de alto contraste, marcos angulares, bloques tipo arena competitiva y jerarquía tipográfica contundente.

No se trasladó el contenido comercial ni las imágenes del template gaming. El rediseño se construyó sobre el contenido, las rutas y el sistema editable de CM Design.

## Qué se mantiene

- Aplicación Next.js 14 con App Router.
- Panel administrativo personalizado.
- Configuración editable mediante `localStorage` y sincronización preparada con API.
- Proyectos, categorías, tarjetas y páginas de detalle.
- Galería completa con filtros por formato y categoría.
- Tienda de recursos con búsqueda, filtros y enlaces de descarga o compra.
- Mensajes, skills, redes sociales, fondos por sección, partículas y efectos configurables.
- Integración preparada con Neon Postgres y Vercel Blob.

## Qué se rediseñó

### Sistema visual

- Nueva base cromática: fondo `#0B0E13`, superficies `#10151D` y `#151A22`, acento lima `#CBFE1C`, violeta `#8B5CF6` y cian `#00E5FF`.
- Reemplazo de bordes redondeados genéricos por marcos angulares inspirados en interfaces esports.
- Fondos con grillas, puntos técnicos, brillos controlados y paneles de contraste alto.
- Botones primarios y secundarios con estados hover más claros.
- Eliminación de la descarga obligatoria de Google Fonts durante el build. El proyecto ahora compila sin depender de fuentes remotas.

### Portada

- Hero completamente reconstruido con jerarquía editorial, panel “Creative Loadout”, estadísticas y CTA prioritarios.
- Navegación superior más compacta, numerada y orientada a rutas clave.
- Menú móvil rediseñado para navegación táctil.
- Sección de proyectos convertida en una cuadrícula filtrable. Se eliminó la dependencia de un carrusel automático para mejorar exploración y legibilidad.
- Nuevas secciones de perfil, skills, contacto y footer bajo el mismo lenguaje visual.

### Rutas secundarias

- Galería alineada con la estética arena y conservando filtros y lightbox.
- Tienda alineada con la nueva portada, con corrección del enlace interno de contacto.
- Página de detalle de proyecto reconstruida para presentar media, cliente, etiquetas y CTA de forma más ordenada.
- Acceso y shell principal del administrador adaptados al nuevo sistema visual.

## Instalación

```bash
npm install
npm run dev
```

Abrir en el navegador:

```text
http://localhost:3000
```

## Compilación para producción

```bash
npm run build
npm run start
```

## Rutas principales

```text
/                  Portada
/galeria           Galería completa
/tienda            Tienda de recursos
/projects/[id]      Detalle de proyecto
/admin              Panel administrativo
```

## Variables de entorno opcionales

```text
DATABASE_URI
BLOB_READ_WRITE_TOKEN
PAYLOAD_SECRET
NEXT_PUBLIC_ADMIN_PASS
ADMIN_PASSWORD
```

El proyecto mantiene los fallbacks locales del original cuando las variables de entorno no están configuradas.


## Acceso administrativo local

El fallback original del panel se conserva para desarrollo local: `cm2026`. Antes de publicar, define `NEXT_PUBLIC_ADMIN_PASS` y ajusta el flujo de autenticación según el nivel de seguridad requerido.

## Nota sobre la API de datos

Las páginas públicas pueden abrirse sin servicios externos. La ruta `/api/data` conserva la integración del proyecto original y requiere configurar `DATABASE_URI` para operar con datos persistentes en un despliegue real.
