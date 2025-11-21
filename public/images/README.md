# 📁 Estructura de Imágenes del Portafolio

Esta carpeta contiene todas las imágenes optimizadas del portafolio, organizadas por categorías.

## 📂 Estructura de Carpetas

```
public/images/
├── projects/                    # Imágenes de proyectos
│   ├── ticket-world/           # Imágenes del proyecto Ticket World
│   │   ├── main.webp          # Imagen principal del proyecto
│   │   ├── dashboard.webp     # Captura del dashboard
│   │   └── map.webp           # Captura del mapa
│   └── sumaq-uywa/            # Imágenes del proyecto Sumaq Uywa
│       ├── main.webp          # Imagen principal del proyecto
│       ├── dashboard.webp     # Captura del dashboard
│       └── reproduction.webp  # Captura del módulo de reproducción
└── profile/                    # Imágenes de perfil/autor
    └── foto-portfolio.webp     # Foto principal del portafolio
```

## 🖼️ Especificaciones de Imágenes

### Formatos Recomendados
- **WebP**: Formato principal (mejor compresión)
- **JPEG**: Para fotos con muchos detalles
- **PNG**: Para gráficos con transparencias

### Tamaños y Resoluciones
- **Imágenes principales de proyecto**: 1200-1920px ancho, máximo 300KB
- **Capturas de pantalla**: 800-1200px ancho, máximo 200KB
- **Foto de perfil**: 400-800px ancho, máximo 150KB

### Nombres de Archivos
- Usar minúsculas y guiones: `mi-imagen.webp`
- Nombres descriptivos: `dashboard-main.webp`, `login-form.webp`

## ⚡ Optimización Automática

Vercel optimiza automáticamente todas las imágenes servidas desde `/images/`:
- Conversión automática a WebP/AVIF
- Compresión inteligente
- Lazy loading automático
- CDN global integrado

## 📝 Notas Importantes

- Todas las imágenes deben estar optimizadas antes de subir
- Mantener el tamaño total del proyecto bajo 100MB (límite Vercel Hobby)
- Usar herramientas como TinyPNG, Squoosh o ImageOptim para optimizar
- Las imágenes quedan versionadas con Git

## 🔄 Migración desde Google Cloud Storage

Para migrar las imágenes actuales:
1. Descargar todas las imágenes desde Google Cloud Storage
2. Optimizarlas usando las especificaciones arriba
3. Colocarlas en las carpetas correspondientes
4. Actualizar las rutas en el código (remover `storage.googleapis.com`)
5. Probar que todas las imágenes carguen correctamente