-- =====================================================
-- ESQUEMA DE BASE DE DATOS PARA MENÚ QR - SUPABASE
-- =====================================================
-- Ejecutar este script en el SQL Editor de Supabase

-- Tabla de usuarios admin
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de categorías del menú
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  order_num INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de items del menú
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_num);
CREATE INDEX IF NOT EXISTS idx_menu_items_order ON menu_items(order_num);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- El usuario admin se crea automáticamente al primer login
-- Credenciales: admin / admin123
-- El sistema creará el hash correcto de bcrypt automáticamente

-- Categorías por defecto
INSERT INTO categories (name, slug, order_num, is_active) VALUES
  ('Entradas', 'entradas', 1, true),
  ('Shawarma', 'shawarma', 2, true),
  ('Promociones', 'promociones', 3, true),
  ('Menú del Día', 'menu-del-dia', 4, true),
  ('Acompañamiento - Salsas', 'acompanamiento-salsas', 5, true),
  ('Bebestibles', 'bebestibles', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- CONFIGURACIÓN DE STORAGE (ejecutar en Supabase Dashboard)
-- =====================================================
-- 1. Ir a Storage en el dashboard de Supabase
-- 2. Crear un nuevo bucket llamado 'menu-images'
-- 3. Configurar como público (Public bucket)
-- 4. Políticas de acceso:

-- Para permitir subir imágenes (autenticado o con token)
-- CREATE POLICY "Allow public uploads" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'menu-images');

-- Para permitir leer imágenes públicamente
-- CREATE POLICY "Allow public reads" ON storage.objects
-- FOR SELECT USING (bucket_id = 'menu-images');

-- Para permitir eliminar imágenes (autenticado o con token)
-- CREATE POLICY "Allow authenticated deletes" ON storage.objects
-- FOR DELETE USING (bucket_id = 'menu-images');

-- =====================================================
-- DATOS DE EJEMPLO DEL MENÚ (OPCIONAL)
-- =====================================================
-- Descomenta las siguientes líneas para insertar datos de ejemplo

/*
-- Entradas
INSERT INTO menu_items (name, description, price, category_id, order_num, is_available) VALUES
  ('Hummus con Pan', 'Cremoso hummus tradicional servido con pan árabe fresco', 4500, 1, 1, true),
  ('Baba Ganoush con Pan', 'Berenjena ahumada con tahini y especias', 4500, 1, 2, true),
  ('Falafel para Picar (6 und.)', 'Croquetas de garbanzos fritas, crujientes por fuera y suaves por dentro', 5000, 1, 3, true),
  ('Kebab para Picar (2 unid.)', 'Brochetas de carne marinada y especiada', 6000, 1, 4, true),
  ('Kubbeh (5 unid.)', 'Croquetas de trigo bulgur rellenas de carne y especias', 5500, 1, 5, true);

-- Shawarma
INSERT INTO menu_items (name, description, price, category_id, order_num, is_available) VALUES
  ('Shawarma Mixto', 'Pan árabe con pollo + carne (vacuno) + vegetales, 1 salsa a elección', 8000, 2, 1, true),
  ('Shawarma de Pollo', 'Pan árabe con pollo + vegetales, 1 salsa a elección', 7500, 2, 2, true),
  ('Shawarma de Carne', 'Pan árabe con carne (vacuno) + vegetales, 1 salsa a elección', 10000, 2, 3, true),
  ('Shawarma de Falafel', 'Pan árabe con falafel + vegetales, 1 salsa a elección', 7500, 2, 4, true);

-- Promociones
INSERT INTO menu_items (name, description, price, category_id, order_num, is_available, is_featured) VALUES
  ('Promo Shawarma Maxi Mixto', 'Para 1 persona. Pan árabe (27cm), pollo + carne + vegetales, 2 falafel, 2 salsas, 1 papas fritas pequeñas', 13000, 3, 1, true, true),
  ('Promo Shawarma Duo Clásico', 'Para 2 personas. 2 Shawarma mixto, 4 falafel, 2 salsas, 1 papas fritas, 2 bebidas', 23990, 3, 2, true, true);

-- Bebestibles
INSERT INTO menu_items (name, description, price, category_id, order_num, is_available) VALUES
  ('Tetera de Té Verde', 'Té verde aromático servido en tetera tradicional', 3000, 6, 1, true),
  ('Café Árabe', 'Café árabe tradicional preparado a la manera del medio oriente', 2500, 6, 2, true),
  ('Bebidas Lata', 'Variedad de bebidas en lata', 1500, 6, 3, true);
*/

