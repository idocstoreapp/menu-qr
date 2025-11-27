# Solución: Error 404 en Vercel

Si estás viendo un error 404 al desplegar en Vercel, sigue estos pasos:

## ✅ Cambios Realizados

1. **Cambiado adaptador a `nodejs`**: Más estable que `serverless`
2. **Mejorado manejo de errores**: La página se renderiza aunque falle la BD
3. **Eliminado `vercel.json`**: Vercel detecta Astro automáticamente

## 🔧 Pasos para Solucionar

### 1. Verificar Configuración en Vercel

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Ve a **Settings** → **General**
3. Verifica:
   - **Framework Preset**: Debe ser `Astro` (o `Other`)
   - **Build Command**: `npm run build`
   - **Output Directory**: Debe estar vacío (Vercel lo maneja automáticamente)
   - **Install Command**: `npm install`

### 2. Verificar Variables de Entorno

1. Ve a **Settings** → **Environment Variables**
2. Si usas Turso, asegúrate de tener:
   - `DATABASE_URL` con la URL de Turso
   - `TURSO_AUTH_TOKEN` (opcional, si no está en la URL)

### 3. Revisar Logs de Build

1. Ve a **Deployments**
2. Selecciona el último deploy
3. Revisa los **Build Logs** para ver si hay errores
4. Busca mensajes como:
   - "Build completed"
   - "Error: ..."
   - "404 Not Found"

### 4. Forzar Nuevo Deploy

1. En **Deployments**, haz clic en los tres puntos (⋯)
2. Selecciona **"Redeploy"**
3. Espera a que termine el build

### 5. Verificar que el Build Funciona Localmente

```bash
# Limpiar build anterior
rm -rf .vercel dist node_modules/.vite

# Reinstalar dependencias
npm install

# Hacer build
npm run build

# Verificar que se creó .vercel/output
ls -la .vercel/output
```

Si el build local funciona pero Vercel no, el problema está en la configuración de Vercel.

## 🐛 Problemas Comunes

### Error: "Cannot find module"
- **Solución**: Verifica que todas las dependencias estén en `package.json`
- Ejecuta `npm install` localmente y verifica que no haya errores

### Error: "Database connection failed"
- **Solución**: Verifica que `DATABASE_URL` esté configurada en Vercel
- Si usas Turso, verifica que la URL y el token sean correctos

### Error: "404 Not Found" en todas las rutas
- **Solución**: 
  1. Verifica que `astro.config.mjs` use el adaptador correcto
  2. Asegúrate de que `output: 'server'` esté configurado
  3. Elimina `vercel.json` si existe (Vercel detecta Astro automáticamente)

### La página carga pero está en blanco
- **Solución**: Revisa los logs de función en Vercel
- Puede ser un error en el código que impide el renderizado

## 📝 Configuración Correcta

### `astro.config.mjs`
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/nodejs';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'server',
  adapter: vercel()
});
```

### `package.json` - Scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

## 🆘 Si Nada Funciona

1. **Verifica los logs completos** en Vercel
2. **Prueba hacer un build local** y verifica errores
3. **Crea un nuevo proyecto** en Vercel desde cero
4. **Contacta soporte de Vercel** con los logs del build

## ✅ Checklist Final

- [ ] `astro.config.mjs` usa `@astrojs/vercel/nodejs`
- [ ] `output: 'server'` está configurado
- [ ] No existe `vercel.json` (o está vacío)
- [ ] Build funciona localmente (`npm run build`)
- [ ] Variables de entorno están configuradas en Vercel
- [ ] Framework Preset en Vercel es `Astro`
- [ ] Build Command es `npm run build`
- [ ] Output Directory está vacío

---

Si después de seguir estos pasos sigue el 404, comparte:
1. Los logs completos del build en Vercel
2. El mensaje de error exacto que ves
3. La URL de tu proyecto en Vercel

