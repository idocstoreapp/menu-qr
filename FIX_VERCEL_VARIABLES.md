# 🔧 SOLUCIÓN: Variables de Entorno Mal Configuradas en Vercel

## ⚠️ PROBLEMA DETECTADO

El error muestra que `PUBLIC_SUPABASE_ANON_KEY` tiene valores concatenados:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\nJWT_SECRET=gourmet-arabe-menu-secret-2024-secure-key-random
```

Esto significa que en Vercel las variables están **mal configuradas** - probablemente copiaste todo el contenido del `.env` en una sola variable.

---

## ✅ SOLUCIÓN PASO A PASO

### 1. Eliminar Variables Actuales

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Settings** → **Environment Variables**
2. **ELIMINA** todas las variables que empiecen con:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `JWT_SECRET`

### 2. Agregar Variables CORRECTAMENTE (UNA POR UNA)

**Variable 1:**
- **Name:** `PUBLIC_SUPABASE_URL`
- **Value:** `https://fpgmuqtwduxbpjapurvs.supabase.co`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- **Save**

**Variable 2:**
- **Name:** `PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwZ211cXR3ZHV4YnBqYXB1cnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDUwNjUsImV4cCI6MjA4MDE4MTA2NX0.D6Mwtpkk2WaQ202-oAnjkl3XxgR8KMDtRuR-_y6NfqI`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- **Save**

**Variable 3:**
- **Name:** `JWT_SECRET`
- **Value:** `gourmet-arabe-2024-secret-key-muy-segura`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- **Save**

### 3. IMPORTANTE: Verificar que NO haya espacios

Cada variable debe tener:
- ✅ **Solo el valor**, sin espacios al inicio o final
- ✅ **Sin saltos de línea** (`\n`)
- ✅ **Sin otros valores concatenados**

### 4. Redeploy

1. Ve a **Deployments**
2. Haz clic en los **3 puntos** (⋯) del último deploy
3. **Redeploy**
4. Espera a que termine

### 5. Verificar

Visita: `https://tu-dominio.com/api/check-config`

Deberías ver:
```json
{
  "success": true,
  "config": {
    "supabase": {
      "url": "https://fpgmuqtwduxbpjapurvs.supabase.co",
      "anonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "hasUrl": true,
      "hasKey": true
    }
  }
}
```

**Si el `anonKey` todavía tiene valores concatenados, las variables siguen mal configuradas.**

---

## 🗄️ CREAR TABLA admin_users EN SUPABASE

Después de corregir las variables:

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard/project/fpgmuqtwduxbpjapurvs)
2. Ve a **SQL Editor**
3. Ejecuta este SQL:

```sql
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. Después ejecuta: `https://tu-dominio.com/api/reset-admin`

---

## 📋 CHECKLIST FINAL

- [ ] Variables eliminadas y recreadas correctamente en Vercel
- [ ] Cada variable tiene SOLO su valor (sin concatenaciones)
- [ ] Redeploy completado
- [ ] `/api/check-config` muestra `success: true` y valores correctos
- [ ] Tabla `admin_users` creada en Supabase
- [ ] `/api/reset-admin` ejecutado exitosamente
- [ ] Login funciona con `admin` / `admin123`

---

**¿Sigue sin funcionar?** Comparte el resultado de `/api/check-config` después de corregir las variables.





