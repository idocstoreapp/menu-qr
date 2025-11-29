import type { APIRoute } from 'astro';
import { staticMenuItems } from '../../data/menu-items';
import { db, initDatabase } from '../../db/index';
import { categories } from '../../db/schema';
import { eq, asc, inArray } from 'drizzle-orm';
import { requireAuth, jsonResponse, errorResponse } from '../../lib/api-helpers';
import { sql } from 'drizzle-orm';

// Cargar precios editados desde la base de datos
const loadPriceOverrides = async (): Promise<Record<number, number>> => {
  try {
    await initDatabase();
    // Crear tabla si no existe
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS price_overrides (
        item_id INTEGER PRIMARY KEY,
        price REAL NOT NULL,
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `);
    
    // Obtener todos los precios editados
    const result = await db.all(sql`SELECT item_id, price FROM price_overrides`);
    const overrides: Record<number, number> = {};
    
    for (const row of result as any[]) {
      overrides[row.item_id] = row.price;
    }
    
    return overrides;
  } catch (error) {
    console.error('Error cargando precios editados:', error);
    return {};
  }
};

// Guardar precio editado en la base de datos
const savePriceOverride = async (itemId: number, price: number): Promise<boolean> => {
  try {
    await initDatabase();
    // Crear tabla si no existe
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS price_overrides (
        item_id INTEGER PRIMARY KEY,
        price REAL NOT NULL,
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `);
    
    // Insertar o actualizar precio
    await db.run(sql`
      INSERT INTO price_overrides (item_id, price, updated_at)
      VALUES (${itemId}, ${price}, unixepoch())
      ON CONFLICT(item_id) DO UPDATE SET
        price = ${price},
        updated_at = unixepoch()
    `);
    
    return true;
  } catch (error) {
    console.error('Error guardando precio:', error);
    return false;
  }
};

// GET - Obtener todos los items (público)
export const GET: APIRoute = async ({ url }) => {
  try {
    const categoryId = url.searchParams.get('categoryId');
    const availableOnly = url.searchParams.get('availableOnly') !== 'false';

    // Inicializar base de datos para obtener categorías
    try {
      await initDatabase();
    } catch (error) {
      console.log('⚠️ Error inicializando BD (puede ser normal):', error);
    }

    // Cargar precios editados
    const priceOverrides = await loadPriceOverrides();

    // Filtrar items estáticos
    let items = staticMenuItems.filter(item => {
      if (availableOnly && !item.isAvailable) return false;
      if (categoryId && item.categoryId !== parseInt(categoryId)) return false;
      return true;
    });

    // Aplicar precios editados
    items = items.map(item => ({
      ...item,
      price: priceOverrides[item.id] !== undefined ? priceOverrides[item.id] : item.price,
    }));

    // Obtener categorías de la base de datos
    const categoryIds = Array.from(new Set(items.map(item => item.categoryId)));
    let categoriesMap = new Map<number, any>();

    try {
      if (categoryIds.length > 0) {
        const allCats = await db.select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        })
        .from(categories)
        .where(inArray(categories.id, categoryIds))
        .orderBy(asc(categories.order), asc(categories.name));

        for (const cat of allCats) {
          categoriesMap.set(cat.id, cat);
        }
      }
    } catch (error) {
      console.warn('⚠️ Error obteniendo categorías, continuando sin ellas:', error);
    }

    // Agregar información de categoría a cada item
    const itemsWithCategories = items
      .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.name.localeCompare(b.name);
      })
      .map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
        imageUrl: item.imageUrl || null,
        videoUrl: item.videoUrl || null,
        isAvailable: item.isAvailable ?? true,
        isFeatured: item.isFeatured ?? false,
        order: item.order,
        category: categoriesMap.has(item.categoryId)
          ? categoriesMap.get(item.categoryId)
          : null,
      }));

    return jsonResponse(itemsWithCategories);
  } catch (error: any) {
    console.error('Error fetching menu items:', error);
    return errorResponse('Error al obtener items del menú: ' + (error.message || 'Error desconocido'), 500);
  }
};

// PUT - Actualizar solo el precio de un item (requiere autenticación)
export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    requireAuth({ cookies } as any);

    const body = await request.json();
    const { id, price } = body;

    if (!id || typeof id !== 'number') {
      return errorResponse('ID de item requerido', 400);
    }

    if (price === undefined || typeof price !== 'number' || price < 0) {
      return errorResponse('Precio válido requerido (número >= 0)', 400);
    }

    // Verificar que el item existe en los datos estáticos
    const item = staticMenuItems.find(i => i.id === id);
    if (!item) {
      return errorResponse('Item no encontrado', 404);
    }

    // Guardar precio en la base de datos
    const saved = await savePriceOverride(id, price);
    if (!saved) {
      return errorResponse('Error al guardar el precio', 500);
    }

    return jsonResponse({
      success: true,
      message: 'Precio actualizado correctamente',
      item: {
        ...item,
        price: price,
      },
    });
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error updating price:', error);
    return errorResponse('Error al actualizar precio: ' + (error.message || 'Error desconocido'), 500);
  }
};

// POST y DELETE están deshabilitados - los items son estáticos
export const POST: APIRoute = async () => {
  return errorResponse('No se pueden agregar items. Los items del menú son estáticos y solo se pueden editar los precios.', 405);
};

export const DELETE: APIRoute = async () => {
  return errorResponse('No se pueden eliminar items. Los items del menú son estáticos y solo se pueden editar los precios.', 405);
};
