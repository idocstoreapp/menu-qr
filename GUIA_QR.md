# Guía: Generar Código QR para el Menú

Esta guía te ayudará a crear un código QR que los clientes puedan escanear para acceder directamente al menú digital.

## 📱 Paso 1: Obtener la URL de tu Menú

1. **Si ya desplegaste en Vercel:**
   - Ve a tu proyecto en [vercel.com](https://vercel.com)
   - Copia la URL de producción (ejemplo: `https://menu-qr.vercel.app`)

2. **Si estás en desarrollo local:**
   - La URL sería: `http://localhost:4321`
   - ⚠️ **Nota:** Esta URL solo funciona en tu red local, no es útil para clientes

## 🎯 Paso 2: Generar el Código QR

### Opción A: Generador Online (Recomendado - Gratis)

1. **QR Code Generator:**
   - Ve a [qr-code-generator.com](https://www.qr-code-generator.com)
   - O [qrcode.tec-it.com](https://qrcode.tec-it.com/es)
   - O [qrcode-monkey.com](https://www.qrcode-monkey.com)

2. **Pasos:**
   - Selecciona "URL" o "Website"
   - Pega la URL de tu menú (ej: `https://menu-qr.vercel.app`)
   - Personaliza el diseño (opcional):
     - Colores (puedes usar dorado #D4AF37 para que coincida con tu tema)
     - Logo en el centro (opcional)
     - Formato del código
   - Haz clic en "Generar" o "Download"
   - Descarga el código QR en formato PNG o SVG

### Opción B: Generador con Logo

1. **QR Code Monkey (Recomendado para logos):**
   - Ve a [qrcode-monkey.com](https://www.qrcode-monkey.com)
   - Ingresa tu URL
   - Haz clic en "Logo" para agregar tu logo en el centro
   - Personaliza colores y estilo
   - Descarga el código QR

### Opción C: Generar desde el Código (Avanzado)

Si quieres generar el QR automáticamente en tu sitio, puedes usar una librería como `qrcode`:

```bash
npm install qrcode
```

Luego crear un endpoint o componente que genere el QR dinámicamente.

## 🖨️ Paso 3: Imprimir y Colocar

1. **Imprime el código QR:**
   - Tamaño recomendado: mínimo 5x5 cm (2x2 pulgadas)
   - Usa papel de buena calidad
   - Asegúrate de que el contraste sea bueno (negro sobre blanco funciona mejor)

2. **Coloca los códigos QR:**
   - En cada mesa del restaurante
   - En la entrada del local
   - En las ventanas
   - En los menús físicos (si los tienes)

## 📋 Paso 4: Probar el Código QR

1. **Antes de imprimir:**
   - Escanea el código QR con tu teléfono
   - Verifica que abra correctamente el menú
   - Prueba en diferentes dispositivos (iPhone, Android)

2. **Después de imprimir:**
   - Escanea el código impreso
   - Verifica que funcione correctamente

## 🎨 Diseño Recomendado

Para que el QR coincida con el tema de tu restaurante:

- **Color principal:** Dorado (#D4AF37) o similar
- **Color de fondo:** Blanco o negro
- **Logo:** Agrega tu logo en el centro (opcional)
- **Tamaño:** Mínimo 5x5 cm para fácil escaneo

## 🔗 URLs Útiles

- **Generador QR simple:** [qr-code-generator.com](https://www.qr-code-generator.com)
- **QR con logo:** [qrcode-monkey.com](https://www.qrcode-monkey.com)
- **QR avanzado:** [qrcode.tec-it.com](https://qrcode.tec-it.com/es)

## 💡 Consejos

1. **Mantén la URL corta:** Si tu URL es muy larga, considera usar un acortador de URLs como [bit.ly](https://bit.ly) o [tinyurl.com](https://tinyurl.com)

2. **Prueba regularmente:** Verifica que el código QR siga funcionando después de actualizaciones

3. **Ten respaldo:** Imprime varios códigos QR por si alguno se daña

4. **Instrucciones claras:** Considera agregar texto cerca del QR como "Escanee para ver el menú" o "Menú Digital"

## 🆘 Solución de Problemas

### El QR no se escanea
- Verifica que el tamaño sea suficiente (mínimo 5x5 cm)
- Asegúrate de que haya buen contraste
- Limpia la superficie del código

### El QR abre pero muestra error
- Verifica que la URL sea correcta
- Asegúrate de que el sitio esté desplegado y funcionando
- Prueba la URL directamente en el navegador

### El QR es muy grande/complejo
- Usa un acortador de URLs para reducir la complejidad
- Simplifica el diseño del QR

---

## 📱 Ejemplo de Uso

1. Cliente escanea el QR con su teléfono
2. Se abre automáticamente el menú en el navegador
3. Cliente navega por las categorías
4. Cliente puede ver precios, descripciones y hacer su pedido

¡Listo! Ahora tus clientes pueden acceder fácilmente al menú digital escaneando el código QR.

