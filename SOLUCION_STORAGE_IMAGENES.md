# 🔧 Solución: Error al Subir Imágenes a Supabase Storage

## ⚠️ PROBLEMA

Al intentar subir imágenes desde el panel de admin, aparece un error. Esto generalmente se debe a **permisos de Storage no configurados correctamente**.

---

## ✅ SOLUCIÓN PASO A PASO

### Paso 1: Verificar que el Bucket Existe

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **Storage** en el menú izquierdo
3. Verifica que existe un bucket llamado **`menu-images`**
4. Si NO existe:
   - Haz clic en **"New bucket"**
   - Nombre: `menu-images`
   - **Marca la opción "Public bucket"** (MUY IMPORTANTE)
   - Haz clic en **"Create bucket"**

### Paso 2: Configurar Políticas de Storage

1. En Storage, haz clic en el bucket **`menu-images`**
2. Ve a la pestaña **"Policies"**
3. Verifica que existen estas políticas:

#### Política 1: Lectura Pública
```sql
CREATE POLICY "Public can read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');
```

#### Política 2: Subida Pública
```sql
CREATE POLICY "Public can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images');
```

#### Política 3: Actualización
```sql
CREATE POLICY "Public can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'menu-images');
```

#### Política 4: Eliminación
```sql
CREATE POLICY "Public can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-images');
```

### Paso 3: Crear las Políticas (si no existen)

Si no ves estas políticas, créalas:

1. Ve a **SQL Editor** en Supabase
2. Ejecuta este script completo:

```sql
-- Política de lectura pública
CREATE POLICY "Public can read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

-- Política de subida pública
CREATE POLICY "Public can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images');

-- Política de actualización
CREATE POLICY "Public can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'menu-images');

-- Política de eliminación
CREATE POLICY "Public can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-images');
```

### Paso 4: Verificar Variables de Entorno

Asegúrate de que en Vercel (o tu plataforma de deploy) estén configuradas:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

---

## 🔍 VERIFICAR QUE FUNCIONA

1. Ve a `/admin/menu`
2. Intenta subir una imagen a un item
3. Si funciona, deberías ver la imagen cargada
4. Si sigue dando error, revisa la consola del navegador (F12) para ver el error específico

---

## 🐛 ERRORES COMUNES

### Error: "new row violates row-level security policy"
**Solución:** Ejecuta el script de políticas de Storage (Paso 3)

### Error: "bucket not found"
**Solución:** Crea el bucket `menu-images` como público (Paso 1)

### Error: "permission denied"
**Solución:** Verifica que las políticas de Storage estén creadas (Paso 2 y 3)

### Error: "Invalid API key"
**Solución:** Verifica que `PUBLIC_SUPABASE_ANON_KEY` esté correctamente configurada

---

## 📝 NOTA IMPORTANTE

El bucket **DEBE ser público** para que las imágenes se puedan mostrar en el menú. Si el bucket es privado, las imágenes no se mostrarán aunque se suban correctamente.

---

**¿Sigue sin funcionar?** Revisa los logs en Supabase Dashboard > Logs para ver errores específicos.

