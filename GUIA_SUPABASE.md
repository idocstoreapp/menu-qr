# 🚀 Guía de Configuración de Supabase

Esta guía te ayudará a configurar Supabase como backend para tu menú digital.

## 1️⃣ Crear un Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta (es gratis)
2. Haz clic en "New Project"
3. Elige un nombre para tu proyecto (ej: "menu-gourmet-arabe")
4. Genera una contraseña segura para la base de datos
5. Selecciona la región más cercana (ej: São Paulo para Chile)
6. Haz clic en "Create new project" y espera unos minutos

## 2️⃣ Crear las Tablas

1. En tu proyecto de Supabase, ve a **SQL Editor** (icono de código en el menú izquierdo)
2. Haz clic en "New query"
3. Copia y pega el contenido del archivo `supabase-schema.sql` de este proyecto
4. Haz clic en "Run" para ejecutar el script
5. Verifica que se crearon las tablas en la sección **Table Editor**

## 3️⃣ Configurar Storage para Imágenes

1. Ve a **Storage** en el menú izquierdo
2. Haz clic en "New bucket"
3. Nombre: `menu-images`
4. Marca la opción **Public bucket**
5. Haz clic en "Create bucket"

### Políticas de Acceso para Storage

En la sección de Storage > Policies del bucket `menu-images`, agrega estas políticas:

**Permitir lectura pública:**
```sql
CREATE POLICY "Permitir lectura publica"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');
```

**Permitir subida (con clave anon):**
```sql
CREATE POLICY "Permitir subida"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images');
```

**Permitir eliminación:**
```sql
CREATE POLICY "Permitir eliminacion"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-images');
```

## 4️⃣ Obtener las Credenciales

1. Ve a **Settings** (icono de engranaje) > **API**
2. Copia estos valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** (bajo "Project API keys")

## 5️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
# Supabase
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT para autenticación del admin
JWT_SECRET=una-clave-muy-larga-y-segura-de-al-menos-32-caracteres
```

## 6️⃣ Instalar Dependencias

```bash
npm install
```

## 7️⃣ Ejecutar el Proyecto

```bash
npm run dev
```

## 8️⃣ Acceder al Panel de Admin

1. Ve a `http://localhost:4321/admin/login`
2. Credenciales por defecto:
   - Usuario: `admin`
   - Contraseña: `admin123`

**⚠️ IMPORTANTE**: Cambia la contraseña del admin en producción.

---

## 📸 Subir Imágenes

Las imágenes se suben automáticamente a Supabase Storage cuando:
1. Agregas un nuevo item del menú
2. Editas un item existente y cambias la imagen

Las imágenes se optimizan y sirven desde el CDN de Supabase, lo que garantiza carga rápida.

**Formatos soportados**: JPG, PNG, WebP, GIF
**Tamaño máximo**: 5MB por imagen

---

## 🔄 Migrar Datos Existentes

Si ya tenías datos en la base de datos anterior (SQLite/Turso), puedes:

1. Exportar los datos actuales
2. Insertar manualmente en Supabase usando el SQL Editor
3. O usar el panel admin para recrear los items

---

## 🌐 Deploy en Vercel

1. Sube tu proyecto a GitHub
2. Importa el repositorio en [vercel.com](https://vercel.com)
3. Agrega las variables de entorno:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `JWT_SECRET`
4. Deploy!

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en la consola del navegador (F12)
2. Revisa los logs en Supabase Dashboard > Logs
3. Verifica que las variables de entorno estén correctas

