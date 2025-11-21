# 🔍 Debug: Cambio de Idioma

## Estado Actual del Componente LanguageSwitcher

El componente está correctamente implementado y debería funcionar. El terminal muestra que `/en/contact` se está cargando correctamente.

## 🐛 Posibles Problemas

### 1. Caché del Navegador
El navegador puede estar cacheando la versión en español. Intenta:
- **Ctrl + Shift + R** (Windows) para hard refresh
- O **Ctrl + F5**
- O abre en ventana privada/incógnito

### 2. Detección Automática de Idioma
El middleware está configurado con `localeDetection: true`, lo que significa que detecta automáticamente el idioma del navegador basado en el header `Accept-Language`.

**Si tu navegador está configurado en español**, el middleware te redirigirá automáticamente a la versión en español.

#### Cómo verificarlo:
1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. Recarga la página
4. Busca el primer request (documento HTML)
5. Ve a los headers de respuesta
6. Busca si hay un redirect

### 3. Verificar que el Locale Cambie

Agrega esto temporalmente al Header para ver el locale actual:

En `src/components/Header.tsx`, después del import de `useTranslations`:

```typescript
const locale = useLocale();
console.log('Current locale:', locale);
```

### 4. Verificar las URLs Manualmente

Prueba acceder directamente a estas URLs:

- `http://localhost:3000/` → Debe cargar en Español
- `http://localhost:3000/en` → Debe cargar en English
- `http://localhost:3000/about` → Sobre Mí (ES)
- `http://localhost:3000/en/about` → About (EN)

Si estas URLs funcionan manualmente, el problema es el componente LanguageSwitcher.

## 🔧 Solución Alternativa: Usar Link de next-intl

Si el router.push no funciona bien, podemos usar el componente Link de next-intl:

```typescript
import {Link} from 'next-intl';

// En lugar de onClick con router.push, usar Link
<Link href={pathname} locale={language.code}>
  <DropdownMenuItem>
    <span className="mr-2">{language.flag}</span>
    <span>{language.name}</span>
  </DropdownMenuItem>
</Link>
```

## 🧪 Test Manual

1. Abre DevTools Console (F12 → Console)
2. Escribe:
```javascript
document.querySelector('[aria-label="Cambiar idioma"]').click()
```
3. Luego selecciona "English"
4. Observa si la URL cambia en la barra de direcciones
5. Observa si hay algún error en la consola

## 📝 Logs de Debug

Agrega estos logs temporales en `LanguageSwitcher.tsx`:

```typescript
const handleLanguageChange = (newLocale: string) => {
  console.log('=== Language Change Debug ===');
  console.log('Current locale:', locale);
  console.log('New locale:', newLocale);
  console.log('Current pathname:', pathname);
  
  startTransition(() => {
    let cleanPathname = pathname;
    if (pathname.startsWith('/es/')) {
      cleanPathname = pathname.substring(3);
    } else if (pathname.startsWith('/en/')) {
      cleanPathname = pathname.substring(3);
    } else if (pathname === '/es' || pathname === '/en') {
      cleanPathname = '/';
    }
    
    console.log('Clean pathname:', cleanPathname);
    
    let newUrl;
    if (newLocale === 'es') {
      newUrl = cleanPathname;
    } else {
      newUrl = `/${newLocale}${cleanPathname}`;
    }
    
    console.log('New URL:', newUrl);
    console.log('Navigating to:', newUrl);
    
    router.push(newUrl);
    router.refresh();
  });
};
```

Luego revisa la consola para ver qué está pasando.

## ✅ Confirmación de que Funciona

Si ves en el terminal:
```
GET /en/contact 200 in 395ms
```

Significa que el middleware y las rutas SÍ están funcionando. El problema puede ser solo visual o de caché.

## 🎯 Prueba Definitiva

1. Abre ventana incógnito
2. Ve a `http://localhost:3000/en`
3. Deberías ver "Home" en lugar de "Inicio" en el Header
4. La URL debe decir `/en`

Si esto funciona, el sistema i18n está bien y solo necesitamos ajustar el LanguageSwitcher.
