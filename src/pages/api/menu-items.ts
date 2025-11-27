import type { APIRoute } from 'astro';
import { db, initDatabase } from '../../db/index';
import { menuItems, categories } from '../../db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { requireAuth, jsonResponse, errorResponse, getAuthUser } from '../../lib/api-helpers';

// GET - Obtener todos los items (público si están disponibles)
export const GET: APIRoute = async ({ url }) => {
  try {
    const categoryId = url.searchParams.get('categoryId');
    const availableOnly = url.searchParams.get('availableOnly') !== 'false';

    // Asegurar que la base de datos esté migrada antes de consultar
    try {
      await initDatabase();
    } catch (migrationError: any) {
      console.log('⚠️ Error en migración (puede ser normal):', migrationError.message);
      // Continuar aunque falle la migración
    }

    // Construir condiciones where
    const conditions = [];
    if (availableOnly) {
      conditions.push(eq(menuItems.isAvailable, true));
    }
    if (categoryId) {
      conditions.push(eq(menuItems.categoryId, parseInt(categoryId)));
    }

    // Intentar consulta con Drizzle primero
    try {
      let query = db.select({
        id: menuItems.id,
        name: menuItems.name,
        description: menuItems.description,
        price: menuItems.price,
        categoryId: menuItems.categoryId,
        imageUrl: menuItems.imageUrl,
        videoUrl: menuItems.videoUrl,
        isAvailable: menuItems.isAvailable,
        isFeatured: menuItems.isFeatured,
        order: menuItems.order,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(menuItems)
      .leftJoin(categories, eq(menuItems.categoryId, categories.id));

      if (conditions.length > 0) {
        if (conditions.length === 1) {
          query = query.where(conditions[0]);
        } else {
          query = query.where(and(...conditions));
        }
      }

      const items = await query.orderBy(asc(menuItems.order), asc(menuItems.name));
      
      console.log(`API: Devolviendo ${items.length} items para categoría ${categoryId || 'todas'}`);
      return jsonResponse(items);
    } catch (drizzleError: any) {
      // Si falla por columna video_url, usar SQL directo sin esa columna
      if (drizzleError.message?.includes('video_url') || drizzleError.message?.includes('no such column')) {
        console.log('⚠️ Columna video_url no existe, usando consulta SQL directa...');
        
        const { createClient } = await import('@libsql/client');
        const isProduction = import.meta.env.PROD;
        const databaseUrl = import.meta.env.DATABASE_URL || 
          (isProduction ? 'file:/tmp/database.sqlite' : 'file:./database.sqlite');
        const authToken = import.meta.env.TURSO_AUTH_TOKEN;
        
        const client = createClient({
          url: databaseUrl,
          ...(authToken && { authToken }),
        });

        let sql = `
          SELECT 
            mi.id,
            mi.name,
            mi.description,
            mi.price,
            mi.category_id as categoryId,
            mi.image_url as imageUrl,
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
          id: Number(row.id),
          name: String(row.name || ''),
          description: row.description ? String(row.description) : null,
          price: Number(row.price || 0),
          categoryId: row.categoryId ? Number(row.categoryId) : null,
          imageUrl: row.imageUrl ? String(row.imageUrl) : null,
          videoUrl: null, // No existe aún
          isAvailable: row.isAvailable === 1 || row.isAvailable === true,
          isFeatured: row.isFeatured === 1 || row.isFeatured === true,
          order: Number(row.order || 0),
          category: row.category_id ? {
            id: Number(row.category_id),
            name: String(row.category_name || ''),
            slug: String(row.category_slug || ''),
          } : null,
        }));
        
        console.log(`API: Devolviendo ${items.length} items para categoría ${categoryId || 'todas'} (SQL directo)`);
        return jsonResponse(items);
      } else {
        throw drizzleError;
      }
    }
  } catch (error: any) {
    console.error('Error fetching menu items:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return errorResponse(
      `Error al obtener items del menú: ${error.message || 'Error desconocido'}`,
      500
    );
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


