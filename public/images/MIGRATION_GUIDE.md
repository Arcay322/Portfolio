# 🔄 Guía de Migración: Google Cloud Storage → Imágenes Locales

## 📋 Cambios Necesarios en el Código

### 1. Actualizar `src/lib/projects.ts`

**Antes (Google Cloud Storage):**
```typescript
image: "https://storage.googleapis.com/ticket_world_media/TICKET_WORLD.webp",
media: [
  {
    type: "image",
    src: "https://storage.googleapis.com/ticket_world_media/TICKET_WORLD.webp",
    alt: t('items.ticket_world.media.main'),
  },
  // ...
]
```

**Después (Imágenes locales):**
```typescript
image: "/images/projects/ticket-world/main.webp",
media: [
  {
    type: "image",
    src: "/images/projects/ticket-world/main.webp",
    alt: t('items.ticket_world.media.main'),
  },
  {
    type: "image",
    src: "/images/projects/ticket-world/dashboard.webp",
    alt: t('items.ticket_world.media.dashboard'),
  },
  {
    type: "image",
    src: "/images/projects/ticket-world/map.webp",
    alt: t('items.ticket_world.media.map'),
  },
]
```

### 2. Actualizar `src/app/[locale]/layout.tsx`

**Antes:**
```typescript
url: "https://storage.googleapis.com/ticket_world_media/arcay-dev-portfolio.png"
```

**Después:**
```typescript
url: "/images/profile/foto-portfolio.webp"
```

### 3. Actualizar `src/lib/schema.ts`

**Antes:**
```typescript
image: 'https://storage.googleapis.com/ticket_world_media/foto%20portfolio.png'
```

**Después:**
```typescript
image: '/images/profile/foto-portfolio.webp'
```

### 4. Actualizar `src/lib/metadata.ts`

**Antes:**
```typescript
const defaultImage = "https://storage.googleapis.com/ticket_world_media/arcay-dev-portfolio.png"
```

**Después:**
```typescript
const defaultImage = "/images/profile/foto-portfolio.webp"
```

### 5. Actualizar `src/app/[locale]/about/page.tsx`

**Antes:**
```typescript
src="https://storage.googleapis.com/ticket_world_media/foto%20portfolio.png"
```

**Después:**
```typescript
src="/images/profile/foto-portfolio.webp"
```

## 📁 Estructura Final Esperada

```
public/images/
├── projects/
│   ├── ticket-world/
│   │   ├── main.webp          # Imagen principal del proyecto
│   │   ├── dashboard.webp     # Captura del dashboard
│   │   └── map.webp           # Captura del mapa
│   └── sumaq-uywa/
│       ├── main.webp          # Imagen principal del proyecto
│       ├── dashboard.webp     # Captura del dashboard
│       └── reproduction.webp  # Captura del módulo de reproducción
└── profile/
    └── foto-portfolio.webp     # Foto principal del portafolio
```

## ✅ Checklist de Migración

- [ ] Descargar todas las imágenes desde Google Cloud Storage
- [ ] Optimizar imágenes (WebP, compresión)
- [ ] Colocar imágenes en carpetas correspondientes
- [ ] Actualizar rutas en `projects.ts`
- [ ] Actualizar rutas en `layout.tsx`
- [ ] Actualizar rutas en `schema.ts`
- [ ] Actualizar rutas en `metadata.ts`
- [ ] Actualizar rutas en `about/page.tsx`
- [ ] Remover configuración de Google Cloud de `next.config.ts`
- [ ] Probar que todas las imágenes carguen correctamente
- [ ] Verificar optimización automática de Vercel

## 🚀 Beneficios Después de la Migración

- ✅ **Mejor rendimiento**: CDN de Vercel integrado
- ✅ **Optimización automática**: WebP/AVIF automático
- ✅ **Sin costos**: No hay costos de almacenamiento/transferencia
- ✅ **Versionado**: Imágenes versionadas con Git
- ✅ **SEO mejorado**: Mejor Core Web Vitals