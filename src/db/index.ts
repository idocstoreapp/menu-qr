import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Usar variable de entorno para la URL de la base de datos
// En desarrollo: file:./database.sqlite
// En producción (Vercel): usar Turso o variable de entorno
// Fallback en Vercel: usar /tmp (se perderá en cada deploy)
const isProduction = import.meta.env.PROD;
const databaseUrl = import.meta.env.DATABASE_URL || 
  (isProduction ? 'file:/tmp/database.sqlite' : 'file:./database.sqlite');

// Token de autenticación para Turso (opcional, puede venir en la URL)
const authToken = import.meta.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: databaseUrl,
  ...(authToken && { authToken }),
});

export const db = drizzle(client, { schema });

// Inicializar base de datos si no existe
export async function initDatabase() {
  // Crear tablas si no existen - ejecutar cada una por separado
  const createTables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category_id INTEGER,
      image_url TEXT,
      is_available INTEGER NOT NULL DEFAULT 1,
      is_featured INTEGER NOT NULL DEFAULT 0,
      "order" INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`,
    `CREATE TABLE IF NOT EXISTS combo_menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      servings INTEGER NOT NULL,
      items TEXT NOT NULL,
      image_url TEXT,
      is_available INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      original_price REAL,
      discount_price REAL NOT NULL,
      items TEXT NOT NULL,
      image_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      valid_from INTEGER,
      valid_until INTEGER,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS daily_menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      items TEXT NOT NULL,
      price REAL NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL
    )`,
  ];

  // Ejecutar cada CREATE TABLE por separado
  for (const sql of createTables) {
    await client.execute(sql);
  }

  // Crear usuario admin por defecto (password: admin123)
  // Nota: En producción, cambiar esta contraseña
  const bcrypt = await import('bcryptjs');
  const defaultPassword = await bcrypt.default.hash('admin123', 10);
  
  await client.execute({
    sql: `INSERT OR IGNORE INTO users (username, password, created_at) 
          VALUES (?, ?, ?)`,
    args: ['admin', defaultPassword, Date.now()],
  });

  // Crear categorías por defecto
  const defaultCategories = [
    { name: 'Entradas', slug: 'entradas', order: 1 },
    { name: 'Platillos', slug: 'platillos', order: 2 },
    { name: 'Shawarma', slug: 'shawarma', order: 3 },
    { name: 'Menú del Día', slug: 'menu-del-dia', order: 4 },
    { name: 'Menús Combinados', slug: 'menus-combinados', order: 5 },
    { name: 'Promociones', slug: 'promociones', order: 6 },
    { name: 'Acompañamiento - Salsas', slug: 'acompanamiento-salsas', order: 7 },
    { name: 'Bebestibles', slug: 'bebestibles', order: 8 },
  ];

  for (const cat of defaultCategories) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO categories (name, slug, "order", is_active, created_at) 
            VALUES (?, ?, ?, 1, ?)`,
      args: [cat.name, cat.slug, cat.order, Date.now()],
    });
  }
}

