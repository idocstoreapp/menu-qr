# Guía: Configurar Turso para Vercel

Esta guía te ayudará a configurar Turso (base de datos SQLite en la nube) para tu proyecto en Vercel.

## 📋 Paso 1: Crear cuenta en Turso

1. Ve a [https://turso.tech](https://turso.tech)
2. Haz clic en **"Sign Up"** o **"Get Started"**
3. Puedes registrarte con:
   - GitHub (recomendado)
   - Email
4. Confirma tu email si usas registro por email

---

## 🗄️ Paso 2: Crear una base de datos

1. Una vez dentro de Turso, haz clic en **"Create Database"** o **"New Database"**
2. **Nombre de la base de datos**: `menu-qr` (o el que prefieras)
3. **Selecciona una región** cercana a ti (ej: `us-east-1`, `eu-west-1`)
4. Haz clic en **"Create"**

---

## 🔑 Paso 3: Obtener la URL de conexión

1. En el dashboard de Turso, selecciona tu base de datos
2. Ve a la pestaña **"Connect"** o **"Connection"**
3. Verás una sección llamada **"Connection String"** o **"LibSQL URL"**
4. Copia la URL que se ve así:
   ```
   libsql://tu-db-nombre-xxxxx.turso.io
   ```
5. **IMPORTANTE**: También necesitarás un **token de autenticación**:
   - Ve a la sección **"Tokens"** o **"Auth Tokens"**
   - Haz clic en **"Create Token"**
   - Copia el token (solo se muestra una vez, guárdalo bien)

---

## ⚙️ Paso 4: Configurar en Vercel

### Opción A: Desde el Dashboard de Vercel (Recomendado)

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Selecciona tu proyecto `menu-qr`
3. Ve a **Settings** → **Environment Variables**
4. Agrega las siguientes variables:

   **Variable 1:**
   - **Name**: `DATABASE_URL`
   - **Value**: `libsql://tu-db-nombre-xxxxx.turso.io?authToken=TU_TOKEN_AQUI`
     - Reemplaza `TU_TOKEN_AQUI` con el token que copiaste
   - **Environments**: Marca todas (Production, Preview, Development)
   - Haz clic en **"Save"**

   **O si prefieres separar el token:**

   **Variable 1:**
   - **Name**: `DATABASE_URL`
   - **Value**: `libsql://tu-db-nombre-xxxxx.turso.io`
   - **Environments**: Todas

   **Variable 2:**
   - **Name**: `TURSO_AUTH_TOKEN`
   - **Value**: Tu token de Turso
   - **Environments**: Todas

5. **Redeploy** tu proyecto:
   - Ve a **Deployments**
   - Haz clic en los tres puntos (⋯) del último deploy
   - Selecciona **"Redeploy"**

### Opción B: Desde Vercel CLI

```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Agregar variable de entorno
vercel env add DATABASE_URL

# Te pedirá el valor, pega: libsql://tu-db-nombre-xxxxx.turso.io?authToken=TU_TOKEN

# Para producción
vercel env add DATABASE_URL production

# Redeploy
vercel --prod
```

---

## 🧪 Paso 5: Verificar que funciona

1. Después del redeploy, visita tu sitio en Vercel
2. Deberías poder ver el menú cargado
3. Si hay errores, revisa los logs en Vercel:
   - Ve a **Deployments** → Selecciona el deploy → **"View Function Logs"**

---

## 🔄 Paso 6: Sincronizar datos locales (Opcional)

Si ya tienes datos en tu base de datos local (`database.sqlite`), puedes sincronizarlos con Turso:

```bash
# Instalar Turso CLI
npm i -g @libsql/client

# O usar el cliente de Turso directamente desde su dashboard
# Ve a "Data" → "Import" y sube tu archivo SQLite
```

O usa el script de seed que ya tienes:
1. Accede a tu sitio en Vercel
2. Ve a `/api/seed` (si tienes ese endpoint)
3. O ejecuta el seed manualmente desde el admin panel

---

## ✅ Listo

Tu proyecto ahora está usando Turso en producción. Los datos se guardarán permanentemente y no se perderán en cada deploy.

---

## 🆘 Solución de Problemas

### Error: "Database not found"
- Verifica que la URL de conexión sea correcta
- Asegúrate de que el token esté incluido en la URL o como variable separada

### Error: "Authentication failed"
- Verifica que el token sea correcto
- Los tokens expiran, crea uno nuevo si es necesario

### La base de datos está vacía
- Ejecuta el script de seed desde el admin panel
- O importa datos manualmente desde el dashboard de Turso

---

## 📚 Recursos

- [Documentación de Turso](https://docs.turso.tech)
- [Turso Dashboard](https://turso.tech/dashboard)
- [Guía de conexión](https://docs.turso.tech/libsql/connect)

