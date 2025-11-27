import type { APIRoute } from 'astro';
import { db } from '../../db/index';
import { menuItems, categories } from '../../db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { requireAuth, jsonResponse, errorResponse, getAuthUser } from '../../lib/api-helpers';
import { createClient } from '@libsql/client';

// GET - Obtener todos los items (público si están disponibles)
export const GET: APIRoute = async ({ url }) => {
  try {
    const categoryId = url.searchParams.get('categoryId');
    const availableOnly = url.searchParams.get('availableOnly') !== 'false';

    // Asegurar que la base de datos esté migrada antes de consultar
    const { initDatabase } = await import('../../db/index');
    try {
      await initDatabase();
    } catch (migrationError: any) {
      console.log('⚠️ Error en migración (puede ser normal):', migrationError.message);
      // Continuar aunque falle la migración
    }

    // Usar SQL directo para ser más robusto con columnas opcionales
    const isProduction = import.meta.env.PROD;
    const databaseUrl = import.meta.env.DATABASE_URL || 
      (isProduction ? 'file:/tmp/database.sqlite' : 'file:./database.sqlite');
    const authToken = import.meta.env.TURSO_AUTH_TOKEN;
    
    const client = createClient({
      url: databaseUrl,
      ...(authToken && { authToken }),
    });

    // Verificar si existe la columna video_url
    const tableInfo = await client.execute({
      sql: `PRAGMA table_info(menu_items)`,
    });
    const hasVideoUrl = tableInfo.rows.some((row: any) => row.name === 'video_url');
    
    let sql = `
      SELECT 
        mi.id,
        mi.name,
        mi.description,
        mi.price,
        mi.category_id as categoryId,
        mi.image_url as imageUrl,
        ${hasVideoUrl ? 'mi.video_url as videoUrl,' : 'NULL as videoUrl,'}
        mi.is_available as isAvailable,
        mi.is_featured as isFeatured,
        mi."order",
        c.id as category_id,
        c.name as category_name,
        c.slug as category_slug
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE 1=1
    `;
    
    const args: any[] = [];
    if (availableOnly) {
      sql += ` AND mi.is_available = 1`;
    }
    if (categoryId) {
      sql += ` AND mi.category_id = ?`;
      args.push(parseInt(categoryId));
    }
    
    sql += ` ORDER BY mi."order" ASC, mi.name ASC`;
    
    const result = await client.execute({ sql, args });
    const items = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      categoryId: row.categoryId,
      imageUrl: row.imageUrl,
      videoUrl: row.videoUrl || null,
      isAvailable: row.isAvailable === 1,
      isFeatured: row.isFeatured === 1,
      order: row.order,
      category: row.category_id ? {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
      } : null,
    }));
    
    console.log(`API: Devolviendo ${items.length} items para categoría ${categoryId || 'todas'}`);

    return jsonResponse(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return errorResponse('Error al obtener items del menú', 500);
  }
};

// POST - Crear nuevo item (solo admin)
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    requireAuth({ cookies } as any);

    const data = await request.json();
    const { name, description, price, categoryId, imageUrl, videoUrl, isAvailable, isFeatured, order } = data;

    if (!name || !price) {
      return errorResponse('Nombre y precio son requeridos', 400);
    }

    const [newItem] = await db.insert(menuItems).values({
      name,
      description: description || null,
      price: parseFloat(price),
      categoryId: categoryId ? parseInt(categoryId) : null,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
      isAvailable: isAvailable !== false,
      isFeatured: isFeatured || false,
      order: order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return jsonResponse(newItem, 201);
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error creating menu item:', error);
    return errorResponse('Error al crear item', 500);
  }
};

// PUT - Actualizar item (solo admin)
export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    requireAuth({ cookies } as any);

    const data = await request.json();
    const { id, ...updates } = data;

    if (!id) {
      return errorResponse('ID es requerido', 400);
    }

    // Construir objeto de actualización solo con los campos presentes
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description || null;
    if (updates.price !== undefined) updateData.price = parseFloat(updates.price);
    if (updates.categoryId !== undefined) updateData.categoryId = updates.categoryId ? parseInt(updates.categoryId) : null;
    if (updates.imageUrl !== undefined) updateData.imageUrl = updates.imageUrl || null;
    if (updates.videoUrl !== undefined) updateData.videoUrl = updates.videoUrl || null;
    if (updates.isAvailable !== undefined) updateData.isAvailable = updates.isAvailable;
    if (updates.isFeatured !== undefined) updateData.isFeatured = updates.isFeatured;
    if (updates.order !== undefined) updateData.order = parseInt(updates.order) || 0;

    const [updated] = await db.update(menuItems)
      .set(updateData)
      .where(eq(menuItems.id, parseInt(id)))
      .returning();

    if (!updated) {
      return errorResponse('Item no encontrado', 404);
    }

    return jsonResponse(updated);
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error updating menu item:', error);
    return errorResponse('Error al actualizar item: ' + (error.message || 'Error desconocido'), 500);
  }
};

// DELETE - Eliminar item (solo admin)
export const DELETE: APIRoute = async ({ url, cookies }) => {
  try {
    requireAuth({ cookies } as any);

    const id = url.searchParams.get('id');
    if (!id) {
      return errorResponse('ID es requerido', 400);
    }

    await db.delete(menuItems).where(eq(menuItems.id, parseInt(id)));

    return jsonResponse({ success: true });
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error deleting menu item:', error);
    return errorResponse('Error al eliminar item', 500);
  }
};


