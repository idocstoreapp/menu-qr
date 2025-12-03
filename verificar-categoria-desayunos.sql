-- Script para verificar la categoría "desayunos" y sus items
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar que la categoría existe y está activa
SELECT 
  id,
  name,
  slug,
  is_active,
  order_num
FROM categories
WHERE LOWER(name) LIKE '%desayuno%' OR LOWER(slug) LIKE '%desayuno%';

-- 2. Verificar items de la categoría "desayunos"
SELECT 
  mi.id,
  mi.name,
  mi.description,
  mi.price,
  mi.category_id,
  mi.is_available,
  mi.image_url,
  c.name as category_name,
  c.slug as category_slug
FROM menu_items mi
LEFT JOIN categories c ON mi.category_id = c.id
WHERE LOWER(c.name) LIKE '%desayuno%' OR LOWER(c.slug) LIKE '%desayuno%'
ORDER BY mi.order_num;

-- 3. Verificar todos los items sin categoría asignada
SELECT 
  id,
  name,
  category_id,
  is_available
FROM menu_items
WHERE category_id IS NULL;

-- 4. Verificar items que no están disponibles
SELECT 
  mi.id,
  mi.name,
  mi.is_available,
  c.name as category_name
FROM menu_items mi
LEFT JOIN categories c ON mi.category_id = c.id
WHERE mi.is_available = false;

