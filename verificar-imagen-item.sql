-- Script para verificar si las imágenes se están guardando correctamente
-- Ejecutar en Supabase SQL Editor

-- 1. Ver todos los items con sus imágenes
SELECT 
  id,
  name,
  image_url,
  category_id,
  is_available,
  updated_at
FROM menu_items
ORDER BY updated_at DESC
LIMIT 20;

-- 2. Ver items que tienen image_url pero puede que la URL esté mal
SELECT 
  id,
  name,
  image_url,
  LENGTH(image_url) as url_length,
  CASE 
    WHEN image_url LIKE 'http%' THEN 'URL completa'
    WHEN image_url LIKE '/%' THEN 'Ruta relativa'
    ELSE 'Formato desconocido'
  END as url_type
FROM menu_items
WHERE image_url IS NOT NULL
ORDER BY updated_at DESC;

-- 3. Verificar que las URLs de Supabase Storage sean accesibles
-- (Las URLs deberían empezar con tu URL de Supabase + /storage/v1/object/public/menu-images/)
SELECT 
  id,
  name,
  image_url,
  CASE 
    WHEN image_url LIKE '%supabase.co%' THEN '✅ URL de Supabase'
    WHEN image_url LIKE '%storage%' THEN '✅ URL de Storage'
    ELSE '⚠️ URL desconocida'
  END as url_status
FROM menu_items
WHERE image_url IS NOT NULL
ORDER BY updated_at DESC;

-- 4. Ver el item más reciente actualizado
SELECT 
  mi.id,
  mi.name,
  mi.image_url,
  mi.updated_at,
  c.name as categoria
FROM menu_items mi
LEFT JOIN categories c ON mi.category_id = c.id
ORDER BY mi.updated_at DESC
LIMIT 5;

