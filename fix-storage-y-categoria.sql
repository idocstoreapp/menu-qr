-- =====================================================
-- SOLUCIÓN COMPLETA: Storage y Categoría Desayunos
-- =====================================================
-- Ejecutar este script COMPLETO en Supabase SQL Editor

-- =====================================================
-- 1. CONFIGURAR POLÍTICAS DE STORAGE
-- =====================================================

-- Eliminar políticas existentes si hay conflictos (opcional)
DROP POLICY IF EXISTS "Public can read images" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public can update images" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete images" ON storage.objects;

-- Crear políticas de Storage para el bucket 'menu-images'

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

-- =====================================================
-- 2. VERIFICAR CATEGORÍA "DESAYUNOS"
-- =====================================================

-- Ver todas las categorías que contengan "desayuno"
SELECT 
  id,
  name,
  slug,
  is_active,
  order_num,
  created_at
FROM categories
WHERE LOWER(name) LIKE '%desayuno%' 
   OR LOWER(slug) LIKE '%desayuno%'
ORDER BY created_at DESC;

-- =====================================================
-- 3. VERIFICAR ITEMS DE "DESAYUNOS"
-- =====================================================

-- Ver items de la categoría desayunos
SELECT 
  mi.id,
  mi.name,
  mi.description,
  mi.price,
  mi.category_id,
  mi.is_available,
  mi.image_url,
  mi.order_num,
  c.name as category_name,
  c.slug as category_slug,
  c.is_active as category_is_active
FROM menu_items mi
LEFT JOIN categories c ON mi.category_id = c.id
WHERE (LOWER(c.name) LIKE '%desayuno%' OR LOWER(c.slug) LIKE '%desayuno%')
   OR mi.category_id IN (
     SELECT id FROM categories 
     WHERE LOWER(name) LIKE '%desayuno%' OR LOWER(slug) LIKE '%desayuno%'
   )
ORDER BY mi.order_num;

-- =====================================================
-- 4. VERIFICAR ITEMS SIN CATEGORÍA O NO DISPONIBLES
-- =====================================================

-- Items sin categoría asignada
SELECT 
  id,
  name,
  category_id,
  is_available,
  created_at
FROM menu_items
WHERE category_id IS NULL
ORDER BY created_at DESC;

-- Items que no están disponibles
SELECT 
  mi.id,
  mi.name,
  mi.is_available,
  c.name as category_name
FROM menu_items mi
LEFT JOIN categories c ON mi.category_id = c.id
WHERE mi.is_available = false
ORDER BY mi.created_at DESC;

-- =====================================================
-- 5. CORREGIR ITEMS (si es necesario)
-- =====================================================

-- Si encuentras items sin categoría, puedes asignarlos manualmente:
-- UPDATE menu_items
-- SET category_id = (SELECT id FROM categories WHERE slug = 'desayunos')
-- WHERE id = [ID_DEL_ITEM];

-- Si encuentras items no disponibles, puedes activarlos:
-- UPDATE menu_items
-- SET is_available = true
-- WHERE id = [ID_DEL_ITEM];

-- =====================================================
-- 6. VERIFICAR BUCKET DE STORAGE
-- =====================================================

-- Verificar que el bucket existe (ejecutar en Supabase Dashboard > Storage)
-- Si no existe, créalo manualmente:
-- 1. Ve a Storage
-- 2. Haz clic en "New bucket"
-- 3. Nombre: menu-images
-- 4. Marca "Public bucket"
-- 5. Crea el bucket

