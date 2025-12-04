# 🔐 Configurar Permisos de Admin en Supabase

## ⚠️ PROBLEMA COMÚN

Si el admin no puede agregar/editar/eliminar items o categorías, es porque **Supabase tiene Row Level Security (RLS) habilitado** por defecto, lo que bloquea las operaciones.

---

## ✅ SOLUCIÓN RÁPIDA

### Paso 1: Ejecutar Script SQL

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **SQL Editor** → **New query**
3. Copia y pega el contenido completo del archivo `supabase-permisos-admin.sql`
4. Haz clic en **Run**
5. Verifica que no haya errores

### Paso 2: Configurar Storage (si no está configurado)

1. Ve a **Storage** en el dashboard
2. Si no existe el bucket `menu-images`:
   - Haz clic en **New bucket**
   - Nombre: `menu-images`
   - Marca **Public bucket**
   - Crea el bucket
3. Las políticas de Storage se crean automáticamente con el script SQL

---

## 🔍 VERIFICAR QUE FUNCIONA

### Test 1: Verificar RLS Deshabilitado

Ejecuta en SQL Editor:
```sql
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('admin_users', 'categories', 'menu_items')
  AND schemaname = 'public';
```

Deberías ver `rowsecurity = false` para todas las tablas.

### Test 2: Probar Operaciones desde el Admin

1. Inicia sesión en `/admin/login`
2. Intenta:
   - ✅ Agregar un nuevo item
   - ✅ Editar un precio
   - ✅ Subir una imagen
   - ✅ Crear una categoría
   - ✅ Ocultar/mostrar un item
   - ✅ Eliminar un item

Si todas funcionan, **¡está configurado correctamente!**

---

## 🐛 SI SIGUE SIN FUNCIONAR

### Error: "new row violates row-level security policy"

**Solución:** Ejecuta el script SQL nuevamente y verifica que RLS esté deshabilitado.

### Error: "permission denied for table"

**Solución:** Verifica que estés usando la clave `anon` correcta en las variables de entorno.

### Error: "bucket not found" al subir imágenes

**Solución:** 
1. Ve a Storage → Crea el bucket `menu-images` como público
2. Ejecuta el script SQL nuevamente para crear las políticas

### Error: "permission denied for storage.objects"

**Solución:** Las políticas de Storage no se crearon. Ejecuta esta parte del script manualmente:

```sql
CREATE POLICY "Public can read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

CREATE POLICY "Public can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Public can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-images');
```

---

## 🔒 OPCIÓN ALTERNATIVA: RLS HABILITADO

Si prefieres mantener RLS habilitado (más seguro), descomenta las políticas en el script SQL:

```sql
-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Crear políticas permisivas...
```

**Nota:** Con RLS habilitado, necesitarás configurar políticas más específicas. El script incluye ejemplos comentados.

---

## ✅ CHECKLIST FINAL

- [ ] Script SQL ejecutado sin errores
- [ ] RLS deshabilitado en las 3 tablas
- [ ] Bucket `menu-images` creado y configurado como público
- [ ] Políticas de Storage creadas
- [ ] Admin puede agregar items sin errores
- [ ] Admin puede editar precios sin errores
- [ ] Admin puede subir imágenes sin errores
- [ ] Admin puede crear categorías sin errores
- [ ] Admin puede ocultar/mostrar items sin errores
- [ ] Admin puede eliminar items sin errores

---

## 📝 NOTAS DE SEGURIDAD

**¿Es seguro deshabilitar RLS?**

- ✅ **Sí, en este caso**, porque:
  - La autenticación se maneja en el backend (Astro API routes)
  - Los endpoints requieren autenticación JWT (`requireAuth`)
  - Solo usuarios autenticados pueden hacer POST/PUT/DELETE
  - El cliente anon solo puede hacer GET (lectura pública)
  - La clave `anon` no permite operaciones peligrosas sin autenticación

**¿Qué pasa si alguien obtiene la clave anon?**

- La clave anon solo permite leer datos públicos (GET)
- No puede modificar nada sin autenticación
- La autenticación se valida en el backend antes de cualquier operación

---

**¿Necesitas ayuda?** Revisa los logs en Supabase Dashboard > Logs para ver errores específicos.




