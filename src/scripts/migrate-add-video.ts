// Script para agregar el campo video_url a la tabla menu_items existente
// Ejecutar solo si ya tienes datos en la base de datos
import { db } from '../db/index';
import { initDatabase } from '../db/index';

export async function migrateAddVideo() {
  await initDatabase();
  
  try {
    // Agregar columna video_url si no existe
    await db.execute(`
      ALTER TABLE menu_items 
      ADD COLUMN video_url TEXT
    `);
    console.log('✅ Campo video_url agregado correctamente');
  } catch (error: any) {
    if (error.message?.includes('duplicate column') || error.message?.includes('already exists')) {
      console.log('ℹ️ El campo video_url ya existe en la tabla');
    } else {
      console.error('❌ Error agregando campo video_url:', error.message);
      throw error;
    }
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateAddVideo().catch(console.error);
}

