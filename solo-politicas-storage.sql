-- =====================================================
-- SOLO POLÍTICAS DE STORAGE (si el bucket ya existe)
-- =====================================================
-- Ejecutar este script si el bucket ya existe pero las políticas dan error

-- Eliminar TODAS las políticas existentes relacionadas con menu-images
DO $$ 
BEGIN
    -- Eliminar políticas existentes si existen
    DROP POLICY IF EXISTS "Public can read images" ON storage.objects;
    DROP POLICY IF EXISTS "Public can upload images" ON storage.objects;
    DROP POLICY IF EXISTS "Public can update images" ON storage.objects;
    DROP POLICY IF EXISTS "Public can delete images" ON storage.objects;
    
    -- También eliminar otras posibles variaciones
    DROP POLICY IF EXISTS "Permitir lectura publica" ON storage.objects;
    DROP POLICY IF EXISTS "Permitir subida" ON storage.objects;
    DROP POLICY IF EXISTS "Permitir eliminacion" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;
END $$;

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

-- Verificar que las políticas se crearon correctamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'objects' 
  AND policyname LIKE '%images%'
ORDER BY policyname;


