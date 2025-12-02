# 🔧 Solución Rápida para Deploy en Vercel

## ⚠️ Si el Build Falla

### Paso 1: Configurar Variables de Entorno

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. **Settings** → **Environment Variables**
3. Agrega estas **3 variables** (IMPORTANTE: sin espacios, copia exacta):

```
PUBLIC_SUPABASE_URL
https://fpgmuqtwduxbpjapurvs.supabase.co
```

```
PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwZ211cXR3ZHV4YnBqYXB1cnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDUwNjUsImV4cCI6MjA4MDE4MTA2NX0.D6Mwtpkk2WaQ202-oAnjkl3XxgR8KMDtRuR-_y6NfqI
```

```
JWT_SECRET
gourmet-arabe-2024-secret-key-muy-segura-y-larga
```

4. **Marca todas las opciones**: Production, Preview, Development
5. **Save**

### Paso 2: Redeploy

1. Ve a **Deployments**
2. Haz clic en los **3 puntos** (⋯) del último deploy
3. Selecciona **Redeploy**
4. Espera a que termine

### Paso 3: Verificar

Después del deploy, visita:
- `https://tu-dominio.com/api/check-config` → Debe mostrar `"success": true`
- `https://tu-dominio.com/api/reset-admin` → Crea el usuario admin
- `https://tu-dominio.com/api/seed-menu` → Carga el menú completo

---

## 🐛 Errores Comunes

### Error: "Variables de entorno no configuradas"
**Solución:** Agrega las 3 variables en Vercel y haz redeploy

### Error: "Cannot connect to Supabase"
**Solución:** 
1. Verifica que las variables estén escritas correctamente
2. Verifica que no haya espacios extra
3. Verifica que hayas seleccionado todas las opciones (Production, Preview, Development)

### Error: "Build failed"
**Solución:**
1. Revisa los logs completos en Vercel
2. Asegúrate de que todas las variables estén configuradas ANTES del build
3. Si el build falla, las variables no se aplican hasta el próximo deploy

---

## ✅ Checklist Pre-Deploy

- [ ] Variables de entorno configuradas en Vercel
- [ ] Tablas creadas en Supabase (ejecutar `supabase-schema.sql`)
- [ ] Bucket `menu-images` creado en Supabase Storage
- [ ] Código commitado y pusheado a GitHub
- [ ] Vercel conectado al repositorio

---

## 📝 Después del Deploy Exitoso

1. **Crear usuario admin:**
   ```
   https://tu-dominio.com/api/reset-admin
   ```

2. **Cargar menú:**
   ```
   https://tu-dominio.com/api/seed-menu
   ```

3. **Iniciar sesión:**
   ```
   https://tu-dominio.com/admin/login
   Usuario: admin
   Contraseña: admin123
   ```

---

## 🔍 Ver Logs de Error

En Vercel:
1. Ve a **Deployments**
2. Haz clic en el deploy fallido
3. Ve a **Function Logs** o **Build Logs**
4. Busca el error específico

---

**¿Sigue fallando?** Comparte el error completo de los logs de Vercel.

