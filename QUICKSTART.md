# 🚀 Inicio Rápido - Menú QR Gourmet Árabe

## Instalación en 3 pasos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor
```bash
npm run dev
```

### 3. Abrir en el navegador
- **Vista pública (clientes):** http://localhost:4321
- **Panel admin:** http://localhost:4321/admin/login

## 🔑 Credenciales de Acceso

**Usuario:** `admin`  
**Contraseña:** `admin123`

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer inicio de sesión.

## 📝 Primeros Pasos

1. **Inicia sesión en el panel admin**
2. **Agrega items al menú:**
   - Haz clic en "+ Agregar Item"
   - Completa el formulario
   - Guarda

3. **Carga datos iniciales (opcional):**
   - Desde el panel admin, puedes hacer POST a `/api/seed` para cargar items de ejemplo

## 🎨 Personalización

### Cambiar colores
Edita `tailwind.config.mjs` y modifica los colores en la sección `theme.extend.colors`

### Agregar categorías
Las categorías se crean automáticamente, pero puedes agregar más desde el panel admin o directamente en la base de datos.

## 📱 Generar QR Code

Una vez desplegado en producción:

1. Obtén la URL pública (ej: `https://tu-dominio.vercel.app`)
2. Genera un QR code con esa URL
3. Imprime y colócalo en las mesas

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de base de datos
```bash
# Elimina la base de datos y reinicia
rm database.sqlite
npm run dev
```

### Puerto ocupado
El servidor usa el puerto 4321 por defecto. Si está ocupado, Astro te sugerirá otro puerto.

## 📚 Documentación Completa

Ver `README.md` para documentación completa y detalles avanzados.

---

¡Listo para usar! 🎉




