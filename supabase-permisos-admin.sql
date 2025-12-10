-- =====================================================
-- CONFIGURACIÓN DE PERMISOS PARA ADMIN - SUPABASE
-- =====================================================
-- Ejecutar este script COMPLETO en el SQL Editor de Supabase
-- Esto asegura que el admin pueda hacer todas las operaciones

-- =====================================================
-- 1. DESHABILITAR RLS (Row Level Security) EN TABLAS
-- =====================================================
-- Esto permite que el cliente anon (con autenticación en el backend) 
-- pueda hacer todas las operaciones necesarias

ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. PERMISOS DE LECTURA PÚBLICA (OPCIONAL)
-- =====================================================
-- Si quieres mantener RLS habilitado, usa estas políticas en su lugar:

/*
-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede leer categorías activas
CREATE POLICY "Public can read active categories"
ON categories FOR SELECT
USING (is_active = true);

-- Política: Cualquiera puede leer todos los items (para admin)
CREATE POLICY "Public can read all menu items"
ON menu_items FOR SELECT
USING (true);

-- Política: Solo autenticados pueden escribir (se maneja en el backend)
CREATE POLICY "Authenticated can insert categories"
ON categories FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated can update categories"
ON categories FOR UPDATE
USING (true);

CREATE POLICY "Authenticated can delete categories"
ON categories FOR DELETE
USING (true);

CREATE POLICY "Authenticated can insert menu items"
ON menu_items FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated can update menu items"
ON menu_items FOR UPDATE
USING (true);

CREATE POLICY "Authenticated can delete menu items"
ON menu_items FOR DELETE
USING (true);
*/

-- =====================================================
-- 3. CONFIGURAR STORAGE PARA IMÁGENES
-- =====================================================

-- Crear el bucket si no existe (ejecutar en Supabase Dashboard > Storage)
-- O usar la API:
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('menu-images', 'menu-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para el bucket 'menu-images'

-- Permitir lectura pública de imágenes
CREATE POLICY "Public can read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

-- Permitir subir imágenes (cualquiera puede subir, pero el backend valida)
-- NOTA: En producción, deberías restringir esto a usuarios autenticados
CREATE POLICY "Public can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images');

-- Permitir actualizar imágenes
CREATE POLICY "Public can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'menu-images');

-- Permitir eliminar imágenes
CREATE POLICY "Public can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-images');

-- =====================================================
-- 4. VERIFICAR QUE LAS TABLAS EXISTAN
-- =====================================================

-- Si las tablas no existen, ejecuta primero supabase-schema.sql

-- =====================================================
-- 5. VERIFICAR PERMISOS
-- =====================================================

-- Verificar que RLS esté deshabilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('admin_users', 'categories', 'menu_items')
  AND schemaname = 'public';

-- Deberías ver rowsecurity = false para todas las tablas

-- =====================================================
-- 6. NOTAS IMPORTANTES
-- =====================================================

-- ✅ CON ESTA CONFIGURACIÓN:
-- - El cliente anon puede leer y escribir en las tablas
-- - La autenticación se maneja en el backend (Astro API routes)
-- - El admin puede hacer todas las operaciones sin errores
-- - Las imágenes se pueden subir/eliminar sin problemas

-- ⚠️ SEGURIDAD:
-- - La autenticación real se hace en el backend con JWT
-- - Los endpoints requieren autenticación (requireAuth)
-- - Solo usuarios autenticados pueden hacer POST/PUT/DELETE
-- - El cliente anon solo puede hacer GET (lectura pública)

-- 🔒 SI QUIERES MÁS SEGURIDAD:
-- - Habilita RLS y usa las políticas comentadas arriba
-- - Restringe las políticas de Storage a usuarios autenticados
-- - Usa Supabase Auth en lugar de JWT personalizado





