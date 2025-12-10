-- =====================================================
-- CREAR TABLA admin_users EN SUPABASE
-- =====================================================
-- Copia y pega esto en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verificar que se creó correctamente
SELECT * FROM admin_users;





