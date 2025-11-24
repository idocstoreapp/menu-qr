# Menú Digital - Gourmet Árabe

Un menú digital elegante y moderno con diseño inspirado en la cultura árabe, con animaciones suaves y múltiples secciones.

## Características

- ✨ **Diseño Árabe Auténtico**: Colores dorados, patrones geométricos y tipografía elegante
- 🎨 **Animaciones Suaves**: Efectos de hover, transiciones y animaciones al hacer scroll
- 📱 **Responsive**: Se adapta perfectamente a dispositivos móviles, tablets y escritorio
- 🖼️ **Imágenes Ilustrativas**: Cada plato tiene su imagen asociada
- 🧭 **Navegación Intuitiva**: Botones de navegación para cambiar entre secciones
- ⚡ **Rendimiento Optimizado**: Lazy loading de imágenes y animaciones eficientes

## Estructura del Proyecto

```
menu-qr/
├── index.html      # Estructura HTML del menú
├── styles.css      # Estilos con diseño árabe y animaciones
├── script.js       # JavaScript para navegación y animaciones
└── README.md       # Este archivo
```

## Secciones del Menú

1. **Entradas**: Aperitivos y platos para compartir
2. **Platillos**: Platos principales del restaurante
3. **Acompañamiento - Salsas**: Salsas y acompañamientos
4. **Bebestibles**: Bebidas calientes y frías

## Cómo Usar

1. Abre el archivo `index.html` en tu navegador web
2. Navega entre las diferentes secciones usando los botones en la parte superior
3. Las imágenes se cargan automáticamente desde Unsplash (puedes reemplazarlas con tus propias imágenes)

## Personalización

### Reemplazar Imágenes

Para usar tus propias imágenes, reemplaza las URLs en el atributo `src` de las etiquetas `<img>` en `index.html`. Las imágenes deben tener un tamaño recomendado de 400x300px para mejor visualización.

Ejemplo:
```html
<img src="ruta/a/tu/imagen.jpg" alt="Nombre del plato" loading="lazy">
```

### Modificar Colores

Los colores están definidos como variables CSS en `styles.css`. Puedes modificarlos en la sección `:root`:

```css
:root {
    --gold: #D4AF37;           /* Color dorado principal */
    --terracotta: #C17A4A;     /* Color terracota */
    --beige: #F5E6D3;          /* Color beige */
    /* ... más colores */
}
```

### Agregar o Modificar Platos

Simplemente copia y pega un bloque de `.menu-item` en la sección correspondiente y modifica el contenido:

```html
<div class="menu-item" data-aos="fade-up">
    <div class="item-image">
        <img src="imagen.jpg" alt="Nombre" loading="lazy">
        <div class="image-overlay"></div>
    </div>
    <div class="item-content">
        <h3 class="item-name">NOMBRE DEL PLATO</h3>
        <p class="item-description">Descripción del plato</p>
    </div>
</div>
```

## Tecnologías Utilizadas

- HTML5
- CSS3 (con animaciones y gradientes)
- JavaScript (Vanilla JS, sin dependencias)
- Google Fonts (Cinzel y Playfair Display)

## Navegadores Compatibles

- Chrome (últimas versiones)
- Firefox (últimas versiones)
- Safari (últimas versiones)
- Edge (últimas versiones)

## Notas

- Las imágenes actuales son placeholders de Unsplash. Reemplázalas con imágenes reales de tus platos para mejor presentación.
- El diseño es completamente responsive y se adapta a diferentes tamaños de pantalla.
- Las animaciones están optimizadas para un rendimiento fluido.

## Licencia

Este proyecto es de uso libre para tu restaurante.

---

**Gourmet Árabe** - Sabores Auténticos del Medio Oriente

