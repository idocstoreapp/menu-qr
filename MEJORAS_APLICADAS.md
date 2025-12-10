# Mejoras Aplicadas al Menú Digital - Gourmet Árabe

Este documento describe todas las mejoras visuales y de UX aplicadas al proyecto para que puedan ser replicadas en proyectos similares.

## 📋 Índice de Mejoras

1. [Bordes Dorados Elegantes](#1-bordes-dorados-elegantes)
2. [Animaciones de Imágenes con Zoom y Flash](#2-animaciones-de-imágenes-con-zoom-y-flash)
3. [Navbar Mejorado](#3-navbar-mejorado)
4. [Layout de Páginas de Categoría Optimizado](#4-layout-de-páginas-de-categoría-optimizado)
5. [Sincronización y Desincronización de Animaciones](#5-sincronización-y-desincronización-de-animaciones)

---

## 1. Bordes Dorados Elegantes

### Objetivo
Bordes dorados más finos y elegantes con un brillo sutil, sin efectos de reflejo excesivos.

### Implementación CSS

```css
/* Borde dorado fino con brillo elegante */
.border-gold-elegant {
  border: 1px solid rgba(212, 175, 55, 0.6);
  position: relative;
  box-shadow: 
    0 0 10px rgba(212, 175, 55, 0.2),
    inset 0 0 10px rgba(212, 175, 55, 0.1);
}

/* Hover: intensificar el brillo */
.border-gold-elegant:hover {
  border-color: rgba(212, 175, 55, 0.9);
  box-shadow: 
    0 0 20px rgba(212, 175, 55, 0.4),
    inset 0 0 15px rgba(212, 175, 55, 0.2);
}
```

### Notas
- **NO** usar animaciones de brillo en los bordes (eliminar `borderShine` si existe)
- El efecto debe ser sutil y elegante
- Los bordes deben ser de 1px de grosor

---

## 2. Animaciones de Imágenes con Zoom y Flash

### Objetivo
Animaciones automáticas en las imágenes de los items del menú que incluyen:
- Zoom instantáneo a 1.6x cuando aparece un flash diagonal
- Movimiento horizontal suave y lento (de izquierda a derecha) para "apreciar el plato detalle a detalle"
- Flash sincronizado que aparece al 10% y 99% de la animación
- Cada card debe tener su propio timing aleatorio para evitar sincronización

### Estructura HTML Requerida

```html
<div class="menu-image-container">
  <img src="..." alt="..." class="w-full h-full object-cover" />
  <!-- El flash se crea dinámicamente con JavaScript -->
</div>
```

### CSS - Animación Principal (imageSequence)

```css
@keyframes imageSequence {
  /* 0-10%: Imagen normal */
  0%, 10% {
    transform: scale(1) translateX(0);
  }
  /* 10%: Flash a mitad del viewport (50%) → zoom instantáneo y cercano AL MISMO TIEMPO */
  10.1%, 12% {
    transform: scale(1.6) translateX(0);
  }
  /* 12-53%: Movimiento ULTRA FLUIDO sin pausas - fotogramas cada 0.5% para máxima fluidez */
  12% {
    transform: scale(1.6) translateX(0);
  }
  12.5% {
    transform: scale(1.6) translateX(-0.5%);
  }
  13% {
    transform: scale(1.6) translateX(-1%);
  }
  /* ... continuar con incrementos de 0.5% hasta llegar a -10% ... */
  22% {
    transform: scale(1.6) translateX(-10%);
  }
  /* Luego volver gradualmente al centro y luego a +10% */
  32.5% {
    transform: scale(1.6) translateX(0);
  }
  33% {
    transform: scale(1.6) translateX(0.5%);
  }
  /* ... continuar hasta +10% ... */
  42.5% {
    transform: scale(1.6) translateX(10%);
  }
  /* Volver al centro */
  53% {
    transform: scale(1.6) translateX(0);
  }
  54%, 96% {
    transform: scale(1.6) translateX(0);
  }
  /* 99%: Flash sincronizado → vuelve a normal AL MISMO TIEMPO */
  99.1%, 100% {
    transform: scale(1) translateX(0);
  }
}

.menu-image-container img,
.menu-image-container video {
  animation: imageSequence 12s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}
```

### CSS - Animación del Flash (flashReflection)

```css
@keyframes flashReflection {
  /* 0-9%: Sin flash, fuera del viewport */
  0%, 9% {
    left: -200%;
    top: -200%;
    opacity: 0;
  }
  /* 9-10%: Flash rápido cruza hasta llegar al 50% del viewport (mitad) - SINCRONIZADO con zoom a 1.6x */
  9% {
    left: -200%;
    top: -200%;
    opacity: 0;
  }
  9.5% {
    left: -150%;
    top: -150%;
    opacity: 0.6;
  }
  10% {
    /* Flash al 50% del viewport (mitad) - EXACTAMENTE cuando cambia el zoom a 1.6x */
    left: -50%;
    top: -50%;
    opacity: 1;
  }
  10.5% {
    left: 50%;
    top: 50%;
    opacity: 0.6;
  }
  11%, 98% {
    /* Flash sale rápidamente del viewport */
    left: 200%;
    top: 200%;
    opacity: 0;
  }
  /* 98-99%: Flash cruza de nuevo - SINCRONIZADO con cambio a tamaño normal */
  98% {
    left: -200%;
    top: -200%;
    opacity: 0;
  }
  98.5% {
    left: -150%;
    top: -150%;
    opacity: 0.6;
  }
  99% {
    /* Flash al 50% del viewport (mitad) - EXACTAMENTE cuando vuelve a tamaño normal */
    left: -50%;
    top: -50%;
    opacity: 1;
  }
  99.5% {
    left: 50%;
    top: 50%;
    opacity: 0.6;
  }
  99.9%, 100% {
    left: 200%;
    top: 200%;
    opacity: 0;
  }
}
```

### JavaScript - Asignación de Delays Aleatorios

```javascript
// Asignar delays aleatorios a cada card para desincronizar animaciones
function assignRandomDelays() {
  const containers = document.querySelectorAll('.menu-image-container:not([data-delay-assigned])');
  
  containers.forEach((container) => {
    // Marcar como procesado para evitar procesarlo múltiples veces
    container.setAttribute('data-delay-assigned', 'true');
    
    // Generar delay aleatorio entre 0 y 12 segundos
    const randomDelay = Math.random() * 12;
    // Duración aleatoria entre 12 y 15 segundos
    const randomDuration = 12 + Math.random() * 3;
    
    // Aplicar a la imagen o video
    const media = container.querySelector('img, video');
    if (media) {
      media.style.animationDelay = randomDelay + 's';
      media.style.animationDuration = randomDuration + 's';
    }
    
    // Ocultar el ::after original si existe
    const style = document.createElement('style');
    style.textContent = `
      .menu-image-container[data-delay-assigned]::after {
        display: none !important;
      }
    `;
    if (!document.head.querySelector('style[data-flash-override]')) {
      style.setAttribute('data-flash-override', 'true');
      document.head.appendChild(style);
    }
    
    // Crear elemento flash real si no existe - DEBE TENER EXACTAMENTE EL MISMO DELAY Y DURACIÓN
    let flashElement = container.querySelector('.flash-overlay');
    if (!flashElement) {
      flashElement = document.createElement('div');
      flashElement.className = 'flash-overlay';
      flashElement.style.cssText = `
        position: absolute;
        top: -50%;
        left: -200%;
        width: 200%;
        height: 200%;
        pointer-events: none;
        z-index: 10;
        background: linear-gradient(135deg, transparent 0%, transparent 25%, rgba(255, 255, 255, 0.6) 42%, rgba(255, 255, 255, 0.9) 48%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.9) 52%, rgba(255, 255, 255, 0.6) 58%, transparent 75%, transparent 100%);
        transform: rotate(-45deg);
        transform-origin: center center;
        animation: flashReflection ${randomDuration}s ease-in-out infinite;
        animation-delay: ${randomDelay}s;
        opacity: 0;
      `;
      container.appendChild(flashElement);
    } else {
      // Si ya existe, actualizar con los mismos valores
      flashElement.style.animationDelay = randomDelay + 's';
      flashElement.style.animationDuration = randomDuration + 's';
      flashElement.style.animation = 'flashReflection ' + randomDuration + 's ease-in-out infinite';
      // Asegurar que esté oculto inicialmente
      flashElement.style.opacity = '0';
      flashElement.style.left = '-200%';
      flashElement.style.top = '-200%';
    }
  });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', assignRandomDelays);
} else {
  assignRandomDelays();
}

// También ejecutar después de delays para capturar elementos cargados dinámicamente
setTimeout(assignRandomDelays, 100);
setTimeout(assignRandomDelays, 500);
setTimeout(assignRandomDelays, 1000);
setTimeout(assignRandomDelays, 2000);

// Observar cambios en el DOM para elementos que se carguen después
const observer = new MutationObserver(() => {
  assignRandomDelays();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

### Características Clave

1. **Movimiento Ultra Fluido**: Fotogramas cada 0.5% para evitar pausas visibles
2. **Zoom a 1.6x**: Más cercano que el original para mejor detalle
3. **Movimiento Horizontal**: De -10% a +10% de manera muy lenta y suave
4. **Flash Sincronizado**: Aparece exactamente al 10% (zoom in) y 99% (zoom out)
5. **Delays Aleatorios**: Cada card tiene su propio timing (0-12s delay, 12-15s duración)
6. **Flash Oculto Inicialmente**: No se muestra hasta que la animación comience

---

## 3. Navbar Mejorado

### Objetivo
Navbar más discreto, compacto, con scroll horizontal para categorías, y que muestre la categoría activa.

### Estructura del Componente (React/TypeScript)

```tsx
import { useEffect, useState, useRef } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface NavigationMenuProps {
  categories: Category[];
  currentSlug?: string;
}

export default function NavigationMenu({ categories, currentSlug }: NavigationMenuProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Si hay una categoría activa, mostrar el navbar inmediatamente
    if (currentSlug) {
      setIsScrolled(true);
    } else {
      // Verificar estado inicial
      handleScroll();
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSlug]);

  // Scroll automático a la categoría activa al cargar
  useEffect(() => {
    if (currentSlug && menuRef.current) {
      const activeLink = menuRef.current.querySelector(`a[href="/${currentSlug}"]`);
      if (activeLink) {
        setTimeout(() => {
          activeLink.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest', 
            inline: 'center' 
          });
        }, 200);
      }
    }
  }, [currentSlug]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/95 backdrop-blur-md shadow-lg border-b border-gold-600/20 transform ${
        isScrolled || currentSlug ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 py-1.5">
        {/* Logo pequeño y botón imprimir */}
        <div className="flex items-center justify-between mb-1">
          <a
            href="/"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo-cropped.png"
              alt="Gourmet Árabe"
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
            <span className="font-cinzel text-gold-400 text-sm md:text-base font-semibold hidden sm:block">
              GOURMET ÁRABE
            </span>
          </a>
          <a
            href="/print"
            className="text-gold-400/60 hover:text-gold-400 text-xs px-2 py-0.5 border border-gold-600/30 rounded hover:border-gold-600/50 transition-colors"
            title="Versión imprimible"
          >
            📄
          </a>
        </div>

        {/* Menú horizontal con scroll - más compacto */}
        <div className="relative" ref={menuRef}>
          <div 
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="flex gap-1.5 pb-0.5" style={{ minWidth: 'max-content' }}>
              {categories.map((category) => {
                const isActive = currentSlug === category.slug;
                return (
                  <a
                    key={category.id}
                    href={`/${category.slug}`}
                    className={`
                      flex-shrink-0 px-2.5 py-1 rounded text-xs font-medium
                      transition-all duration-200 whitespace-nowrap
                      ${
                        isActive
                          ? 'bg-gold-600 text-black shadow-sm shadow-gold-600/30'
                          : 'bg-gold-600/8 text-gold-300/80 border border-gold-600/15 hover:bg-gold-600/20 hover:border-gold-600/30 hover:text-gold-200'
                      }
                    `}
                  >
                    {category.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
}
```

### Características Clave

1. **Compacto**: Padding reducido (px-3 py-1.5)
2. **Logo Pequeño**: 8x8 en móvil, 10x10 en desktop
3. **Scroll Horizontal**: Categorías se pueden deslizar
4. **Categoría Activa**: Resaltada en dorado (bg-gold-600)
5. **Auto-scroll**: Se desplaza automáticamente para mostrar la categoría activa
6. **Visible en Páginas de Categoría**: Se muestra inmediatamente si hay `currentSlug`

---

## 4. Layout de Páginas de Categoría Optimizado

### Objetivo
Mostrar los platillos directamente al cargar, con menos espacios y elementos más discretos.

### Estructura HTML (Astro)

```astro
---
// ... código del servidor ...
---

<PublicLayout title={`${category.name} - Gourmet Árabe`}>
  <NavigationMenu client:load categories={allCategories} currentSlug={categorySlug} />
  
  {heroImages.length > 0 && (
    <HeroSlider client:load images={heroImages} />
  )}
  
  <div class="min-h-screen bg-[#0a0a0a] relative">
    <div class="absolute inset-0 opacity-10 z-0" style="background-image: url('/fondo.png'); background-size: cover; background-position: center;"></div>
    
    <div class="relative z-10">
      <!-- Header compacto con Logo -->
      <header class="pt-20 pb-2 text-center relative z-30">
        <a href="/" class="inline-block">
          <div class="relative mx-auto w-48 h-48 md:w-56 md:h-56">
            <img 
              src="/logo-cropped.png" 
              alt="Gourmet Árabe" 
              class="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
            />
          </div>
        </a>
      </header>

      <!-- Título de la sección discreto -->
      <div class="px-4 mb-4 relative z-20">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-center font-cinzel text-gold-400 text-lg md:text-xl tracking-wide border-b border-gold-600/30 pb-2">
            {category.name.toUpperCase()}
          </h2>
        </div>
      </div>

      <!-- Grid de productos -->
      <div class="px-4 pb-12">
        <div class="max-w-6xl mx-auto">
          {items && items.length > 0 ? (
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <div class="menu-card group">
                  <div class="relative border-gold-elegant rounded-lg overflow-hidden bg-black/70 backdrop-blur-sm transition-all duration-300">
                    {item.image_url && (
                      <div class="relative h-48 overflow-hidden menu-image-container">
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          class="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {item.is_featured && (
                          <div class="absolute top-3 right-3 bg-gold-500 text-black px-2 py-1 rounded text-xs font-bold">
                            ⭐ DESTACADO
                          </div>
                        )}
                      </div>
                    )}
                    <!-- ... resto del contenido ... -->
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <!-- Mensaje de no items -->
          )}
        </div>
      </div>

      <Footer />
    </div>
  </div>
</PublicLayout>
```

### Características Clave

1. **Logo Grande**: 48x48 en móvil, 56x56 en desktop
2. **Padding Superior**: `pt-20` para evitar que el navbar tape el logo
3. **Sin Nombre del Local**: Eliminado "GOURMET ÁRABE" del header
4. **Título Discreto**: Solo texto con borde inferior, sin cajas decorativas grandes
5. **Menos Espacios**: `mb-4` en lugar de `mb-8` para el título
6. **Grid Directo**: Los platillos se muestran inmediatamente después del título

---

## 5. Sincronización y Desincronización de Animaciones

### Objetivo
Cada card debe tener su propia animación con timing aleatorio para evitar que todas se animen al mismo tiempo.

### Implementación

1. **JavaScript asigna delays aleatorios** (0-12 segundos)
2. **Duraciones aleatorias** (12-15 segundos)
3. **Mismo delay y duración** para imagen y flash en cada card
4. **MutationObserver** para capturar elementos cargados dinámicamente
5. **Múltiples timeouts** para asegurar que todos los elementos sean procesados

### Componente React (MenuItemCard)

Si usas componentes React, también necesitas aplicar los delays:

```tsx
import { useEffect, useRef } from 'react';

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!imageContainerRef.current) return;
    
    const randomDelay = Math.random() * 12;
    const randomDuration = 12 + Math.random() * 3;
    
    const img = imageContainerRef.current.querySelector('img, video');
    if (img) {
      (img as HTMLElement).style.animationDelay = `${randomDelay}s`;
      (img as HTMLElement).style.animationDuration = `${randomDuration}s`;
    }
    
    if (flashRef.current) {
      flashRef.current.style.animationDelay = `${randomDelay}s`;
      flashRef.current.style.animationDuration = `${randomDuration}s`;
      flashRef.current.style.animation = `flashReflection ${randomDuration}s ease-in-out infinite`;
    }
  }, []);

  return (
    <div className="...">
      {(item.videoUrl || item.imageUrl) && (
        <div ref={imageContainerRef} className="h-48 overflow-hidden relative menu-image-container">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
          <div ref={flashRef} className="flash-overlay absolute pointer-events-none" style={{
            top: '-50%',
            left: '-200%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(135deg, transparent 0%, transparent 25%, rgba(255, 255, 255, 0.6) 42%, rgba(255, 255, 255, 0.9) 48%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.9) 52%, rgba(255, 255, 255, 0.6) 58%, transparent 75%, transparent 100%)',
            transform: 'rotate(-45deg)',
            transformOrigin: 'center center',
            animation: 'flashReflection 12s ease-in-out infinite',
            zIndex: 10,
            opacity: 0
          }}></div>
        </div>
      )}
      <!-- ... resto del contenido ... -->
    </div>
  );
}
```

---

## 📝 Resumen de Archivos a Modificar

1. **CSS Global** (`styles.css` o `PublicLayout.astro`):
   - Bordes dorados elegantes
   - Animación `imageSequence`
   - Animación `flashReflection`

2. **JavaScript** (en `PublicLayout.astro` o archivo separado):
   - Función `assignRandomDelays()`
   - MutationObserver
   - Event listeners

3. **Componente Navbar** (`NavigationMenu.tsx`):
   - Estilos compactos
   - Scroll horizontal
   - Lógica de categoría activa

4. **Páginas de Categoría** (`[category].astro`):
   - Header compacto
   - Logo grande con padding superior
   - Título discreto
   - Grid de items

5. **Componente Card** (si usas React):
   - Aplicar delays aleatorios
   - Crear elemento flash

---

## ✅ Checklist de Implementación

- [ ] Bordes dorados finos (1px) con brillo sutil
- [ ] Animación `imageSequence` con zoom a 1.6x
- [ ] Movimiento horizontal fluido (fotogramas cada 0.5%)
- [ ] Animación `flashReflection` sincronizada
- [ ] JavaScript para asignar delays aleatorios
- [ ] Flash oculto inicialmente
- [ ] Navbar compacto con scroll horizontal
- [ ] Categoría activa resaltada
- [ ] Logo grande en páginas de categoría
- [ ] Padding superior suficiente (pt-20)
- [ ] Título de sección discreto
- [ ] Grid de items visible inmediatamente

---

## 🎨 Colores Utilizados

- **Dorado Principal**: `rgba(212, 175, 55, ...)`
- **Fondo**: `#0a0a0a` (negro muy oscuro)
- **Overlay**: `bg-black/70` o `bg-black/95`
- **Texto Dorado**: `text-gold-400` o `text-gold-300`

---

## 📱 Responsive

- **Móvil**: Logo 48x48, navbar más compacto
- **Desktop**: Logo 56x56, navbar con más espacio
- **Scroll horizontal**: Funciona en todos los tamaños

---

**Nota**: Asegúrate de que todas las animaciones tengan `will-change: transform` para mejor rendimiento, y que los elementos tengan `overflow: hidden` en el contenedor para que el zoom no se salga de los límites.

