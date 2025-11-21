# 📸 Lista de Imágenes a Agregar al Portafolio

> **Fecha:** 5 de Octubre, 2025  
> **Propósito:** Guía para agregar imágenes faltantes al portafolio

---

## 🖼️ IMÁGENES REQUERIDAS

### 1. Testimonios (PRIORIDAD ALTA) 🌟

**Directorio:** `/public/testimonials/`

Crea esta carpeta si no existe:
```bash
mkdir public/testimonials
```

**Imágenes necesarias:**

1. **maria.jpg**
   - Ruta: `/public/testimonials/maria.jpg`
   - Descripción: Foto de María González (Product Manager)
   - Tamaño recomendado: 200x200px (cuadrada)
   - Formato: JPG, PNG o WebP
   - Tip: Puedes usar una foto de perfil de LinkedIn o una imagen placeholder

2. **carlos.jpg**
   - Ruta: `/public/testimonials/carlos.jpg`
   - Descripción: Foto de Carlos Rodríguez (CEO)
   - Tamaño recomendado: 200x200px (cuadrada)
   - Formato: JPG, PNG o WebP

3. **ana.jpg**
   - Ruta: `/public/testimonials/ana.jpg`
   - Descripción: Foto de Ana Martínez (Lead Developer)
   - Tamaño recomendado: 200x200px (cuadrada)
   - Formato: JPG, PNG o WebP

**Alternativas si no tienes fotos reales:**
- Usar servicios como: https://i.pravatar.cc/200 (genera avatares aleatorios)
- Usar iniciales con fondo de color (ya implementado como fallback)
- Usar ilustraciones de https://www.manypixels.co/gallery

---

### 2. Curriculum Vitae (PRIORIDAD ALTA) 📄

**Directorio:** `/public/cv/`

Crea esta carpeta si no existe:
```bash
mkdir public/cv
```

**Archivo necesario:**

1. **Arnie_Calderon_CV.pdf**
   - Ruta: `/public/cv/Arnie_Calderon_CV.pdf`
   - Descripción: Tu CV en formato PDF
   - Tamaño máximo recomendado: 2MB
   - Formato: PDF
   - Nombre del archivo: Exactamente `Arnie_Calderon_CV.pdf`

**Cómo crear tu CV:**
- Herramientas online: https://www.canva.com/
- Templates profesionales: https://www.overleaf.com/gallery/tagged/cv
- Google Docs con plantillas de CV

---

### 3. Proyectos (YA CONFIGURADOS) ✅

**Nota:** Actualmente usas imágenes de Google Storage, pero están dando error 404.

**Imágenes actuales (con errores):**
- https://storage.googleapis.com/ticket_world_media/TICKET_WORLD.webp ❌
- https://storage.googleapis.com/ticket_world_media/SUMAQ%20UYWA.webp ❌

**Opciones para solucionar:**

#### Opción A: Mover a `/public/projects/`
```bash
mkdir public/projects
```

Luego descarga tus imágenes y colócalas en:
- `/public/projects/ticket-world.webp`
- `/public/projects/sumaq-uywa.webp`

Después actualiza `src/lib/projects.ts`:
```typescript
image: "/projects/ticket-world.webp",
image: "/projects/sumaq-uywa.webp",
```

#### Opción B: Arreglar permisos de Google Storage
- Ve a Google Cloud Console
- Verifica que los archivos sean públicos
- Actualiza las URLs si cambiaron

#### Opción C: Usar capturas de pantalla locales
1. Toma capturas de pantalla de tus proyectos
2. Optimízalas con: https://squoosh.app/
3. Guárdalas en formato WebP
4. Colócalas en `/public/projects/`

---

### 4. Favicon y Logo (OPCIONAL) 🎨

**Directorio:** `/public/`

**Archivos opcionales para personalizar:**

1. **favicon.ico**
   - Ruta: `/public/favicon.ico` (ya existe por defecto)
   - Descripción: Icono del sitio
   - Tamaño: 32x32px o 16x16px
   - Herramienta: https://favicon.io/

2. **logo.png**
   - Ruta: `/public/logo.png`
   - Descripción: Logo del portafolio
   - Tamaño recomendado: 512x512px
   - Formato: PNG con transparencia

3. **og-image.png**
   - Ruta: `/public/og-image.png`
   - Descripción: Imagen para Open Graph (cuando compartes en redes sociales)
   - Tamaño: 1200x630px
   - Formato: PNG o JPG

---

## 📐 ESPECIFICACIONES TÉCNICAS

### Tamaños Recomendados:

| Tipo de Imagen | Tamaño | Formato | Ubicación |
|----------------|---------|---------|-----------|
| Avatar/Testimonios | 200x200px | WebP/JPG | `/public/testimonials/` |
| Proyecto Desktop | 1920x1080px | WebP | `/public/projects/` |
| Proyecto Mobile | 750x1334px | WebP | `/public/projects/mobile/` |
| CV | N/A (PDF) | PDF | `/public/cv/` |
| Favicon | 32x32px | ICO | `/public/` |
| Open Graph | 1200x630px | PNG/JPG | `/public/` |

### Optimización de Imágenes:

**Herramientas recomendadas:**
1. **Squoosh** (https://squoosh.app/) - Compresión online
2. **TinyPNG** (https://tinypng.com/) - Para PNG/JPG
3. **ImageOptim** (macOS) - Aplicación local
4. **Sharp CLI** - Comando de terminal:
   ```bash
   npm install -g sharp-cli
   sharp -i input.jpg -o output.webp -f webp
   ```

### Conversión a WebP:

Si tienes imágenes en JPG o PNG, conviértelas a WebP:

```bash
# Con ffmpeg (si está instalado)
ffmpeg -i input.jpg -quality 85 output.webp

# Online
https://cloudconvert.com/jpg-to-webp
```

---

## 🚀 COMANDOS RÁPIDOS

### Crear todas las carpetas necesarias:
```bash
cd U:/Portfolio/Portfolio/public
mkdir testimonials cv projects
```

### Verificar estructura:
```bash
ls -R public/
```

**Estructura esperada:**
```
public/
├── cv/
│   └── Arnie_Calderon_CV.pdf
├── testimonials/
│   ├── maria.jpg
│   ├── carlos.jpg
│   └── ana.jpg
├── projects/
│   ├── ticket-world.webp
│   └── sumaq-uywa.webp
└── (otros archivos de Next.js)
```

---

## ✅ CHECKLIST DE IMÁGENES

### Prioridad ALTA (Necesario ahora):
- [ ] `/public/testimonials/maria.jpg`
- [ ] `/public/testimonials/carlos.jpg`
- [ ] `/public/testimonials/ana.jpg`
- [ ] `/public/cv/Arnie_Calderon_CV.pdf`

### Prioridad MEDIA (Mejorar experiencia):
- [ ] Arreglar o reemplazar imágenes de proyectos
- [ ] Agregar más capturas de pantalla de proyectos
- [ ] Crear versiones móviles de proyectos

### Prioridad BAJA (Pulir detalles):
- [ ] Favicon personalizado
- [ ] Logo personalizado
- [ ] Open Graph image
- [ ] Iconos de redes sociales personalizados

---

## 📝 NOTAS IMPORTANTES

### Para las Imágenes de Testimonios:

Si no tienes testimonios reales todavía, puedes:

1. **Usar avatares genéricos temporales:**
   ```typescript
   // En Testimonials.tsx, cambia las rutas por:
   image: "https://i.pravatar.cc/200?img=1",  // María
   image: "https://i.pravatar.cc/200?img=12", // Carlos
   image: "https://i.pravatar.cc/200?img=5",  // Ana
   ```

2. **O dejar solo las iniciales** (ya funciona como fallback):
   - El componente ya muestra las iniciales si no hay imagen
   - Puedes eliminar temporalmente las imágenes

3. **Crear ilustraciones:**
   - Usa https://www.manypixels.co/gallery
   - Descarga avatares de ilustración gratuitos

### Para el CV:

**Contenido sugerido:**
- Datos personales (nombre, email, LinkedIn, GitHub)
- Resumen profesional
- Educación (7mo ciclo Ingeniería de Software)
- Proyectos destacados (Ticket World, Sumaq Uywa)
- Habilidades técnicas
- Idiomas

**Templates gratuitos:**
- Canva: https://www.canva.com/templates/resumes/
- Overleaf: https://www.overleaf.com/latex/templates/tagged/cv
- Novo Resume: https://novoresume.com/

---

## 🎯 DESPUÉS DE AGREGAR LAS IMÁGENES

1. **Reinicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Verifica que se vean correctamente:**
   - Testimonios: http://localhost:3000/
   - CV: Click en "Descargar CV"
   - Proyectos: http://localhost:3000/projects

3. **Build de producción:**
   ```bash
   npm run build
   ```

---

## 💡 TIPS FINALES

1. **Nombres de archivos:**
   - Usa minúsculas
   - Sin espacios (usa guiones: `my-image.jpg`)
   - Sin caracteres especiales

2. **Compresión:**
   - Mantén imágenes web bajo 500KB
   - Usa WebP cuando sea posible (mejor compresión)
   - Next.js optimizará automáticamente con el componente Image

3. **Respaldo:**
   - Guarda las imágenes originales en alta resolución
   - Sube las optimizadas al proyecto

4. **Git:**
   - Las imágenes se subirán a GitHub con el proyecto
   - Asegúrate de que no sean muy pesadas

---

**¿Necesitas ayuda para crear o conseguir las imágenes?**
- Placeholder avatares: https://i.pravatar.cc/
- Imágenes stock: https://unsplash.com/
- Generador de avatares: https://www.dicebear.com/
- Compresión: https://squoosh.app/

---

**Generado:** 5 de Octubre, 2025  
**Estado:** 📋 PENDIENTE - Agregar imágenes  
**Prioridad:** 🔴 ALTA (para testimonios y CV)
