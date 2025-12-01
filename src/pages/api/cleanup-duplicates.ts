import type { APIRoute } from 'astro';
import { db, initDatabase } from '../../db/index';
import { menuItems } from '../../db/schema';
import { eq, sql } from 'drizzle-orm';
import { requireAuth, jsonResponse, errorResponse } from '../../lib/api-helpers';

// GET - Verificar duplicados
// POST - Limpiar duplicados (requiere autenticación)
export const GET: APIRoute = async () => {
  try {
    await initDatabase();

    // Buscar items duplicados por nombre (case-insensitive)
    const allItems = await db.select().from(menuItems);
    
    // Agrupar por nombre (normalizado)
    const itemsByName = new Map<string, any[]>();
    for (const item of allItems) {
      const normalizedName = item.name.toLowerCase().trim();
      if (!itemsByName.has(normalizedName)) {
        itemsByName.set(normalizedName, []);
      }
      itemsByName.get(normalizedName)!.push(item);
    }

    // Encontrar duplicados
    const duplicates: Array<{ name: string; count: number; ids: number[] }> = [];
    for (const [name, items] of itemsByName.entries()) {
      if (items.length > 1) {
        duplicates.push({
          name,
          count: items.length,
          ids: items.map(i => i.id),
        });
      }
    }

    return jsonResponse({
      totalItems: allItems.length,
      uniqueItems: itemsByName.size,
      duplicatesFound: duplicates.length,
      duplicates: duplicates,
      duplicateCount: allItems.length - itemsByName.size,
    });
  } catch (error: any) {
    console.error('Error checking duplicates:', error);
    return errorResponse('Error al verificar duplicados: ' + (error.message || 'Error desconocido'), 500);
  }
};

export const POST: APIRoute = async ({ cookies }) => {
  try {
    requireAuth({ cookies } as any);

    await initDatabase();

    // Obtener todos los items
    const allItems = await db.select().from(menuItems);
    
    // Agrupar por nombre (normalizado) y categoría
    const itemsByKey = new Map<string, any[]>();
    for (const item of allItems) {
      const key = `${item.name.toLowerCase().trim()}_${item.categoryId || 'null'}`;
      if (!itemsByKey.has(key)) {
        itemsByKey.set(key, []);
      }
      itemsByKey.get(key)!.push(item);
    }

    // Encontrar duplicados y mantener solo el más reciente (o el primero si tienen la misma fecha)
    let deletedCount = 0;
    const duplicatesToDelete: number[] = [];

    for (const [key, items] of itemsByKey.entries()) {
      if (items.length > 1) {
        // Ordenar por ID (el más antiguo primero) y mantener el último
        items.sort((a, b) => a.id - b.id);
        const toKeep = items[items.length - 1]; // Mantener el último (más reciente)
        
        // Marcar los demás para eliminar
        for (const item of items) {
          if (item.id !== toKeep.id) {
            duplicatesToDelete.push(item.id);
          }
        }
      }
    }

    // Eliminar duplicados
    if (duplicatesToDelete.length > 0) {
      for (const id of duplicatesToDelete) {
        await db.delete(menuItems).where(eq(menuItems.id, id));
        deletedCount++;
      }
    }

    // Verificar resultado
    const remainingItems = await db.select().from(menuItems);

    return jsonResponse({
      success: true,
      deletedCount,
      remainingItems: remainingItems.length,
      message: `Se eliminaron ${deletedCount} items duplicados. Quedan ${remainingItems.length} items únicos.`,
    });
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error cleaning duplicates:', error);
    return errorResponse('Error al limpiar duplicados: ' + (error.message || 'Error desconocido'), 500);
  }
};



