# Guía: Agregar Videos a los Platillos

Esta guía te explica cómo agregar videos cortos (3 segundos) a los platillos del menú desde el panel de administración.

## ✅ ¿Funciona con la Base de Datos Actual?

**Sí, funciona perfectamente.** La base de datos SQLite/Turso puede almacenar URLs de videos. Los videos deben estar alojados en un servicio de almacenamiento en la nube (no se guardan directamente en la base de datos).

## 📹 Cómo Funciona

1. **Subes el video** a un servicio de almacenamiento (Cloudinary, Vercel Blob, YouTube, etc.)
2. **Obtienes la URL** del video
3. **Pegas la URL** en el campo "URL de Video" del formulario admin
4. **El video se reproduce automáticamente** en el menú público

## 🎬 Opciones para Subir Videos

### Opción 1: Cloudinary (Recomendado - Gratis)

1. **Crear cuenta:**
   - Ve a [cloudinary.com](https://cloudinary.com)
   - Crea una cuenta gratuita (25 GB de almacenamiento)

2. **Subir video:**
   - Ve a "Media Library"
   - Haz clic en "Upload"
   - Sube tu video (máximo 3 segundos recomendado)
   - Espera a que se procese

3. **Obtener URL:**
   - Haz clic en el video subido
   - Copia la URL (formato: `https://res.cloudinary.com/.../video/upload/...`)
   - Esta URL es la que pegarás en el admin

**Ventajas:**
- ✅ Gratis hasta 25 GB
- ✅ Optimización automática de videos
- ✅ CDN global (carga rápida)
- ✅ Conversión automática de formatos

### Opción 2: Vercel Blob Storage

Si ya usas Vercel, puedes usar su almacenamiento:

1. **Instalar Vercel Blob:**
   ```bash
   npm install @vercel/blob
   ```

2. **Configurar:**
   - Agrega la variable de entorno `BLOB_READ_WRITE_TOKEN` en Vercel
   - Crea un endpoint para subir videos

**Ventajas:**
- ✅ Integrado con Vercel
- ✅ Gratis hasta cierto límite

### Opción 3: YouTube (Gratis)

1. **Subir a YouTube:**
   - Sube el video como "No listado" o "Privado"
   - Obtén el ID del video

2. **Usar URL embebida:**
   - URL formato: `https://www.youtube.com/embed/VIDEO_ID?autoplay=1&loop=1&mute=1&controls=0`
   - O usar la URL directa del video

**Ventajas:**
- ✅ Completamente gratis
- ✅ Sin límites de almacenamiento

**Desventajas:**
- ⚠️ Puede mostrar controles de YouTube
- ⚠️ Menos control sobre la reproducción

### Opción 4: Otros Servicios

- **Imgur:** Para videos GIF
- **Giphy:** Para videos cortos animados
- **AWS S3:** Si tienes cuenta AWS
- **Google Drive:** Con enlace público

## 📝 Pasos para Agregar Video desde el Admin

1. **Inicia sesión en el panel admin:**
   - Ve a `/admin/login`
   - Ingresa tus credenciales

2. **Edita un item del menú:**
   - Haz clic en "Editar" en el item que quieres modificar
   - O crea un nuevo item

3. **Agrega la URL del video:**
   - En el campo "URL de Video (3 seg)", pega la URL del video
   - El campo "URL de Imagen" se usará como respaldo si no hay video

4. **Guarda:**
   - Haz clic en "Guardar"
   - El video aparecerá automáticamente en el menú público

## 🎥 Características del Video en el Menú

- **Reproducción automática:** El video se reproduce automáticamente
- **Loop infinito:** El video se repite continuamente
- **Sin sonido:** El video está silenciado por defecto
- **Prioridad:** Si hay video, se muestra en lugar de la imagen
- **Fallback:** Si no hay video, se muestra la imagen

## 💡 Recomendaciones

1. **Duración:** Videos de 2-3 segundos funcionan mejor
2. **Tamaño:** Comprime los videos antes de subirlos (máximo 5-10 MB)
3. **Formato:** MP4 es el formato más compatible
4. **Resolución:** 720p o 1080p es suficiente
5. **Contenido:** Muestra el platillo de forma atractiva

## 🔧 Solución de Problemas

### El video no se reproduce
- Verifica que la URL sea correcta y accesible
- Asegúrate de que el video esté en formato MP4
- Verifica que el servicio de hosting permita acceso público

### El video es muy pesado
- Comprime el video antes de subirlo
- Usa un servicio como Cloudinary que optimiza automáticamente
- Considera reducir la resolución o duración

### El video no se muestra en móviles
- Verifica que el servicio de hosting sea compatible con móviles
- Asegúrate de usar `playsInline` (ya está incluido en el código)

## 📱 Ejemplo de Uso

1. Grabas un video de 3 segundos del platillo
2. Lo subes a Cloudinary
3. Copias la URL
4. La pegas en el admin panel
5. Los clientes ven el video en el menú digital

---

**Nota:** Los videos se almacenan como URLs en la base de datos, no como archivos. Esto es más eficiente y permite usar servicios especializados en hosting de videos.

