import type { APIRoute } from 'astro';
import { db, initDatabase } from '../../db/index';
import { menuItems, categories } from '../../db/schema';
import { eq, and, asc, inArray } from 'drizzle-orm';
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
      // Obtener items sin join para evitar duplicados
      const baseQuery = db.select({
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
      })
      .from(menuItems);

      // Construir la consulta con condiciones
      const queryWithConditions = conditions.length > 0
        ? (conditions.length === 1
            ? baseQuery.where(conditions[0])
            : baseQuery.where(and(...conditions)))
        : baseQuery;

      const items = await queryWithConditions.orderBy(asc(menuItems.order), asc(menuItems.name));
      
      // Verificar si hay items con el mismo nombre (duplicados reales en la BD)
      const itemsByName = new Map<string, any[]>();
      for (const item of items) {
        const key = `${item.name.toLowerCase().trim()}_${item.categoryId || 'null'}`;
        if (!itemsByName.has(key)) {
          itemsByName.set(key, []);
        }
        itemsByName.get(key)!.push(item);
      }
      
      // Si hay duplicados por nombre, loguear advertencia
      const duplicateNames: string[] = [];
      for (const entry of Array.from(itemsByName.entries())) {
        const [key, itemsList] = entry;
        if (itemsList.length > 1) {
          duplicateNames.push(`${itemsList[0].name} (${itemsList.length} veces)`);
        }
      }
      
      if (duplicateNames.length > 0) {
        console.warn(`⚠️ [API] Se encontraron items duplicados en la base de datos por nombre:`, duplicateNames);
        console.warn(`⚠️ [API] Usa POST /api/cleanup-duplicates para limpiarlos`);
      }
      
      // Eliminar duplicados por ID usando Map (más robusto)
      const itemsMap = new Map<number, any>();
      const seenIds = new Set<number>();
      
      for (const item of items) {
        const id = Number(item.id);
        // Solo agregar si el ID es válido y no lo hemos visto antes
        if (id && id > 0 && !seenIds.has(id)) {
          seenIds.add(id);
          itemsMap.set(id, item);
        }
      }
      
      const uniqueItems = Array.from(itemsMap.values());
      
      // Log para debugging
      if (items.length !== uniqueItems.length) {
        console.log(`⚠️ [API] Se encontraron ${items.length - uniqueItems.length} items con IDs duplicados en la consulta, eliminados.`);
      }
      
      // Obtener todas las categorías necesarias de una vez
      const categoryIds = uniqueItems
        .map(item => item.categoryId)
        .filter((id): id is number => id !== null && id !== undefined);
      
      const categoriesMap = new Map<number, any>();
      if (categoryIds.length > 0) {
        // Eliminar duplicados de categoryIds
        const uniqueCategoryIds = Array.from(new Set(categoryIds));
        
        // Obtener todas las categorías de una vez
        const allCats = await db.select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        })
        .from(categories)
        .where(inArray(categories.id, uniqueCategoryIds));
        
        for (const cat of allCats) {
          categoriesMap.set(cat.id, cat);
        }
      }
      
      // Combinar items con sus categorías
      const itemsWithCategories = uniqueItems.map((item: any) => ({
        ...item,
        category: item.categoryId && categoriesMap.has(item.categoryId)
          ? categoriesMap.get(item.categoryId)
          : null,
      }));
      
      // Última verificación de duplicados antes de enviar
      const finalItemsMap = new Map<number, any>();
      for (const item of itemsWithCategories) {
        const id = Number(item.id);
        if (id && id > 0 && !finalItemsMap.has(id)) {
          finalItemsMap.set(id, item);
        }
      }
      const finalItems = Array.from(finalItemsMap.values());
      
      console.log(`[API] Devolviendo ${finalItems.length} items únicos (de ${items.length} consultados, ${itemsWithCategories.length} después de categorías) para categoría ${categoryId || 'todas'}`);
      return jsonResponse(finalItems);
    } catch (drizzleError: any) {
      // Si falla por columna video_url, usar SQL directo sin esa columna
      if (drizzleError.message?.includes('video_url') || drizzleError.message?.includes('no such column')) {
        console.log('⚠️ Columna video_url no existe, usando consulta SQL directa...');
        
        const { createClient } = await import('@libsql/client');
        // Acceder a variables de entorno - Astro usa import.meta.env
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error - import.meta.env es válido en Astro runtime
        const isProduction = import.meta.env.PROD;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error - import.meta.env es válido en Astro runtime
        const databaseUrl = import.meta.env.DATABASE_URL || 
          (isProduction ? 'file:/tmp/database.sqlite' : 'file:./database.sqlite');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error - import.meta.env es válido en Astro runtime
        const authToken = import.meta.env.TURSO_AUTH_TOKEN;
        
        const client = createClient({
          url: databaseUrl,
          ...(authToken && { authToken }),
        });

        // Usar DISTINCT para evitar duplicados desde la consulta SQL
        let sql = `
          SELECT DISTINCT
            mi.id,
            mi.name,
            mi.description,
            mi.price,
            mi.category_id as categoryId,
            mi.image_url as imageUrl,
            mi.is_available as isAvailable,
            mi.is_featured as isFeatured,
            mi."order"
          FROM menu_items mi
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
        
        // Crear un Map para eliminar duplicados por ID (más robusto)
        const itemsMap = new Map<number, any>();
        const seenIds = new Set<number>();
        
        for (const row of result.rows) {
          // Acceder a los campos usando el alias o el nombre de columna original
          const id = Number(row.id || (row as any).id);
          const categoryId = Number(row.categoryId || (row as any).category_id || 0);
          // Manejar campos booleanos de forma más robusta
          const isAvailableRaw = row.isAvailable !== undefined ? row.isAvailable : (row as any).is_available;
          const isAvailable = isAvailableRaw === 1 || isAvailableRaw === true || String(isAvailableRaw) === '1';
          
          const isFeaturedRaw = row.isFeatured !== undefined ? row.isFeatured : (row as any).is_featured;
          const isFeatured = isFeaturedRaw === 1 || isFeaturedRaw === true || String(isFeaturedRaw) === '1';
          
          // Solo agregar si no hemos visto este ID antes
          if (id && !seenIds.has(id)) {
            seenIds.add(id);
            itemsMap.set(id, {
              id: id,
              name: String(row.name || (row as any).name || ''),
              description: (row.description || (row as any).description) ? String(row.description || (row as any).description) : null,
              price: Number(row.price || (row as any).price || 0),
              categoryId: categoryId || null,
              imageUrl: (row.imageUrl || (row as any).image_url) ? String(row.imageUrl || (row as any).image_url) : null,
              videoUrl: null,
              isAvailable: isAvailable,
              isFeatured: isFeatured,
              order: Number(row.order || (row as any).order || 0),
            });
          }
        }
        
        const items = Array.from(itemsMap.values());
        
        // Obtener todas las categorías necesarias de una vez (más eficiente)
        const categoryIds = items
          .map((item: any) => item.categoryId)
          .filter((id: any): id is number => id !== null && id !== undefined && id > 0);
        
        const categoriesMap = new Map<number, any>();
        if (categoryIds.length > 0) {
          // Eliminar duplicados de categoryIds
          const uniqueCategoryIds = Array.from(new Set(categoryIds));
          
          // Obtener todas las categorías en una consulta
          const placeholders = uniqueCategoryIds.map(() => '?').join(',');
          const categoryResult = await client.execute({
            sql: `SELECT id, name, slug FROM categories WHERE id IN (${placeholders})`,
            args: uniqueCategoryIds,
          });
          
          for (const catRow of categoryResult.rows) {
            const catId = Number(catRow.id || (catRow as any).id);
            categoriesMap.set(catId, {
              id: catId,
              name: String(catRow.name || (catRow as any).name || ''),
              slug: String(catRow.slug || (catRow as any).slug || ''),
            });
          }
        }
        
        // Combinar items con sus categorías
        const itemsWithCategories = items.map((item: any) => ({
          ...item,
          category: item.categoryId && categoriesMap.has(item.categoryId)
            ? categoriesMap.get(item.categoryId)
            : null,
        }));
        
        // Última verificación de duplicados antes de enviar
        const finalItemsMap = new Map<number, any>();
        for (const item of itemsWithCategories) {
          const id = Number(item.id);
          if (id && id > 0 && !finalItemsMap.has(id)) {
            finalItemsMap.set(id, item);
          }
        }
        const finalItems = Array.from(finalItemsMap.values());
        
        console.log(`[API SQL] Devolviendo ${finalItems.length} items únicos (de ${result.rows.length} filas, ${items.length} después de deduplicación, ${itemsWithCategories.length} después de categorías) para categoría ${categoryId || 'todas'}`);
        return jsonResponse(finalItems);
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

    if (!categoryId) {
      return errorResponse('La categoría (sección) es requerida', 400);
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
    if (updates.categoryId !== undefined) {
      if (!updates.categoryId) {
        return errorResponse('La categoría (sección) es requerida', 400);
      }
      updateData.categoryId = parseInt(updates.categoryId);
    }
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


