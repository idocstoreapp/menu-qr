# 🚀 Configuración para Producción

## ⚠️ PROBLEMA COMÚN: Variables de Entorno No Configuradas

Si el menú no carga en producción y no puedes iniciar sesión, **las variables de entorno no están configuradas** en tu plataforma de deploy.

---

## 📋 Variables de Entorno Requeridas

Necesitas configurar estas **3 variables** en tu plataforma de deploy:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | `https://fpgmuqtwduxbpjapurvs.supabase.co` |
| `PUBLIC_SUPABASE_ANON_KEY` | Clave pública anon de Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `JWT_SECRET` | Clave secreta para autenticación | `gourmet-arabe-2024-secret-key` |

---

## 🔧 Configurar en Vercel

### Paso 1: Ir a Configuración del Proyecto
1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Haz clic en **Settings** (Configuración)
3. Ve a **Environment Variables** (Variables de Entorno)

### Paso 2: Agregar Variables
Para cada variable, haz clic en **Add** y agrega:

**Variable 1:**
- **Name:** `PUBLIC_SUPABASE_URL`
- **Value:** `https://fpgmuqtwduxbpjapurvs.supabase.co`
- **Environment:** Selecciona todas (Production, Preview, Development)

**Variable 2:**
- **Name:** `PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwZ211cXR3ZHV4YnBqYXB1cnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDUwNjUsImV4cCI6MjA4MDE4MTA2NX0.D6Mwtpkk2WaQ202-oAnjkl3XxgR8KMDtRuR-_y6NfqI`
- **Environment:** Selecciona todas

**Variable 3:**
- **Name:** `JWT_SECRET`
- **Value:** `gourmet-arabe-2024-secret-key-muy-segura`
- **Environment:** Selecciona todas

### Paso 3: Redeploy
1. Después de agregar las variables, ve a **Deployments**
2. Haz clic en los **3 puntos** del último deploy
3. Selecciona **Redeploy**
4. Espera a que termine el deploy

---

## 🔧 Configurar en Otras Plataformas

### Netlify
1. Ve a **Site settings** > **Environment variables**
2. Agrega las 3 variables
3. **Redeploy** el sitio

### Railway
1. Ve a **Variables** en tu proyecto
2. Agrega las 3 variables
3. El servicio se reiniciará automáticamente

### Render
1. Ve a **Environment** en tu servicio
2. Agrega las 3 variables
3. **Manual Deploy** si es necesario

---

## ✅ Verificar Configuración

Después de configurar las variables y hacer redeploy, visita:

```
https://tu-dominio.com/api/check-config
```

Deberías ver:
```json
{
  "success": true,
  "message": "✅ Configuración correcta"
}
```

Si ves `"success": false`, revisa que:
1. Las variables estén escritas **exactamente** como se muestra (sin espacios)
2. Los valores sean correctos (copia y pega desde Supabase)
3. Hayas hecho **redeploy** después de agregar las variables

---

## 🔍 Obtener Valores de Supabase

Si no tienes los valores:

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **Project URL** → `PUBLIC_SUPABASE_URL`
   - **anon public** (bajo Project API keys) → `PUBLIC_SUPABASE_ANON_KEY`

---

## 🐛 Solución de Problemas

### El menú no carga
- ✅ Verifica que `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` estén configuradas
- ✅ Verifica que hayas hecho redeploy después de agregar las variables
- ✅ Revisa los logs en tu plataforma de deploy

### No puedo iniciar sesión
- ✅ Verifica que `JWT_SECRET` esté configurada
- ✅ Verifica que el usuario admin exista en Supabase (ejecuta `/api/reset-admin` primero)

### Error 500 en producción
- ✅ Revisa los logs del servidor
- ✅ Verifica que todas las variables estén configuradas
- ✅ Asegúrate de que las tablas existan en Supabase (ejecuta el SQL del schema)

---

## 📞 Checklist de Deploy

Antes de hacer deploy, asegúrate de:

- [ ] Variables de entorno configuradas en la plataforma
- [ ] Tablas creadas en Supabase (ejecutar `supabase-schema.sql`)
- [ ] Bucket `menu-images` creado en Supabase Storage
- [ ] Políticas de Storage configuradas
- [ ] Usuario admin creado (ejecutar `/api/reset-admin` o `/api/seed-menu`)
- [ ] Menú cargado (ejecutar `/api/seed-menu`)

---

## 🎯 Después del Deploy

1. Visita `https://tu-dominio.com/api/check-config` para verificar
2. Visita `https://tu-dominio.com/api/reset-admin` para crear el admin
3. Visita `https://tu-dominio.com/api/seed-menu` para cargar el menú
4. Inicia sesión en `/admin/login` con `admin` / `admin123`

---

**¿Necesitas ayuda?** Revisa los logs de tu plataforma de deploy o los logs en Supabase Dashboard > Logs.



