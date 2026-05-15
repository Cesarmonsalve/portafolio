# CM Design - Portafolio

**Fecha de actualización:** 11 de Mayo 2026

## 🚀 Descripción del Proyecto

Portafolio profesional de **CM Design** (Motion Graphics & Visual Design) con:
- Diseño oscuro y moderno con animaciones (Framer Motion)
- Secciones: Hero, Sobre mí, Proyectos, Arsenal, Contacto
- **Panel de Administración custom** con login por contraseña
- Formulario de contacto funcional

## 📦 Stack Técnico Actual

- **Next.js** 14.2.35 (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** + **Lucide React**
- **Lottie** para animaciones
- **Custom Admin Panel** (con autenticación simple por env.local)
- **Vercel** (deploy + Blob Storage)
- **Neon Postgres** (base de datos)

**Payload CMS** fue instalado pero actualmente está **deshabilitado** por incompatibilidad de versión con `@payloadcms/next@latest`.

## ✅ Estado Actual (11 Mayo 2026)

- ✅ Build compilando correctamente
- ✅ Admin Panel custom desplegado y funcionando
- ✅ Formulario de contacto envía mensajes (usa stubs por ahora)
- ✅ Proyectos cargados desde `src/data/projects.ts`
- ⚠️ Payload CMS deshabilitado temporalmente (causaba errores de tipo en build)

## 📁 Estructura de Carpetas

```
src/
├── app/
│   ├── admin/                 # Panel de administración custom
│   ├── page.tsx               # Home del portafolio
│   ├── projects/[id]/page.tsx
│   └── layout.tsx
├── components/
│   ├── ProjectCard.tsx
│   ├── Contact.tsx
│   ├── LottieRenderer.tsx
│   └── ...
├── lib/
│   └── config.ts              # Funciones getProjects, getMessages, sendMessage, etc.
├── data/
│   └── projects.ts            # Datos iniciales de proyectos
└── payload.config.ts        # (Eliminado temporalmente - causaba errores)
```

## 🔧 Variables de Entorno (Vercel)

- `DATABASE_URI` → Neon Postgres
- `BLOB_READ_WRITE_TOKEN` → Vercel Blob
- `PAYLOAD_SECRET` (si se usa Payload)
- Contraseña del admin en `.env.local` (solo local)

## 📝 Historial de lo que se hizo

1. Se intentó integrar **Payload CMS completo** (colecciones Projects, Media, Messages)
2. Se corrigieron errores de dependencias (`framer-motion`, `lucide-react`)
3. Se agregaron funciones faltantes en `lib/config.ts` (`getMessages`, `sendMessage`)
4. Se probó `withPayload`, alias `@payload-config`, handlers, etc.
5. Payload causó errores de tipo repetidos → se eliminó temporalmente
6. Se restauró el **Admin Panel custom** bonito con logo CM

## 🚧 Roadmap / Ideas Futuras

- [ ] Conectar admin custom con datos reales (Neon DB)
- [ ] Intentar Payload CMS con versión específica (ej. 3.0.0 o compatible)
- [ ] Formulario de contacto que guarde mensajes reales en DB
- [ ] Subida de proyectos + imágenes desde el admin
- [ ] Autenticación real (NextAuth o similar)
- [ ] SEO + Analytics + Sitemap
- [ ] Modo oscuro/claro o más temas

## 🤖 Cómo usar este archivo con otra IA

Copia **todo** este archivo + el enlace de tu repo y pega en otra IA con este prompt:

```
Eres un desarrollador senior de Next.js 14 + TypeScript.

Este es mi proyecto actual:

[PEGA TODO EL CONTENIDO DE PROYECTO.md AQUÍ]

Mi repo: https://github.com/Cesarmonsalve/portafolio

Ayúdame a: [tu objetivo aquí, ejemplo: "mejorar el admin para que guarde proyectos reales en Neon"]
```

---

**Creado para CM Design** | Motion Graphics & Visual Design
