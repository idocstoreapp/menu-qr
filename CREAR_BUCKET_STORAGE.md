# 🪣 Crear Bucket de Storage en Supabase

## ⚠️ ERROR: "bucket not found"

Este error significa que el bucket `menu-images` no existe en Supabase Storage.

---

## ✅ SOLUCIÓN: Crear el Bucket

### Opción 1: Crear desde el Dashboard (RECOMENDADO)

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Haz clic en **Storage** en el menú izquierdo
3. Haz clic en el botón **"New bucket"** (o "Crear bucket")
4. Completa el formulario:
   - **Name**: `menu-images` (EXACTO, sin espacios ni mayúsculas)
   - **Public bucket**: ✅ **MARCAR ESTA OPCIÓN** (MUY IMPORTANTE)
   - **File size limit**: Dejar en blanco o poner 52428800 (50MB)
   - **Allowed MIME types**: Dejar en blanco o poner `image/*`
5. Haz clic en **"Create bucket"** (o "Crear bucket")

### Opción 2: Crear desde SQL (Alternativa)

Si no puedes crear el bucket desde el dashboard, ejecuta esto en **SQL Editor**:

```sql
-- Crear el bucket menu-images como público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images',
  'menu-images',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;
```

---

## 🔐 CONFIGURAR POLÍTICAS DE STORAGE

Después de crear el bucket, **DEBES** configurar las políticas. Ejecuta esto en **SQL Editor**:

```sql
-- Eliminar políticas existentes si hay conflictos
DROP POLICY IF EXISTS "Public can read images" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public can update images" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete images" ON storage.objects;

-- Política 1: Lectura pública
CREATE POLICY "Public can read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

-- Política 2: Subida pública
CREATE POLICY "Public can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images');

-- Política 3: Actualización
CREATE POLICY "Public can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'menu-images');

-- Política 4: Eliminación
CREATE POLICY "Public can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-images');
```

---

## ✅ VERIFICAR QUE FUNCIONA

1. Ve a **Storage** en Supabase Dashboard
2. Deberías ver el bucket **`menu-images`** en la lista
3. Haz clic en el bucket para ver su contenido (debería estar vacío)
4. Verifica que dice **"Public"** al lado del nombre del bucket
5. Ve a `/admin/menu` y intenta subir una imagen
6. Si funciona, deberías ver la imagen cargada

---

## 🐛 SI SIGUE DANDO ERROR

### Error: "permission denied"
**Solución:** Ejecuta las políticas de Storage (ver arriba)

### Error: "bucket already exists"
**Solución:** El bucket ya existe, solo necesitas configurar las políticas

### Error: "invalid bucket name"
**Solución:** El nombre debe ser exactamente `menu-images` (sin espacios, sin mayúsculas)

---

## 📝 NOTAS IMPORTANTES

- ✅ El bucket **DEBE ser público** para que las imágenes se muestren en el menú
- ✅ El nombre **DEBE ser exactamente** `menu-images` (sin espacios)
- ✅ Las políticas **DEBEN estar configuradas** para permitir subir/leer/eliminar

---

**¿Sigue sin funcionar?** Revisa los logs en Supabase Dashboard > Logs para ver el error específico.



