import type { APIRoute } from 'astro';
import { db } from '../../db/index';
import { menuItems, categories } from '../../db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { requireAuth, jsonResponse, errorResponse, getAuthUser } from '../../lib/api-helpers';

// GET - Obtener todos los items (público si están disponibles)
export const GET: APIRoute = async ({ url }) => {
  try {
    const categoryId = url.searchParams.get('categoryId');
    const availableOnly = url.searchParams.get('availableOnly') !== 'false';

    // Construir condiciones where
    const conditions = [];
    if (availableOnly) {
      conditions.push(eq(menuItems.isAvailable, true));
    }
    if (categoryId) {
      conditions.push(eq(menuItems.categoryId, parseInt(categoryId)));
    }

    let query = db.select({
      id: menuItems.id,
      name: menuItems.name,
      description: menuItems.description,
      price: menuItems.price,
      categoryId: menuItems.categoryId,
      imageUrl: menuItems.imageUrl,
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
    const { name, description, price, categoryId, imageUrl, isAvailable, isFeatured, order } = data;

    if (!name || !price) {
      return errorResponse('Nombre y precio son requeridos', 400);
    }

    const [newItem] = await db.insert(menuItems).values({
      name,
      description: description || null,
      price: parseFloat(price),
      categoryId: categoryId ? parseInt(categoryId) : null,
      imageUrl: imageUrl || null,
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

    const [updated] = await db.update(menuItems)
      .set({
        ...updates,
        price: updates.price ? parseFloat(updates.price) : undefined,
        categoryId: updates.categoryId ? parseInt(updates.categoryId) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(menuItems.id, id))
      .returning();

    if (!updated) {
      return errorResponse('Item no encontrado', 404);
    }

    return jsonResponse(updated);
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error updating menu item:', error);
    return errorResponse('Error al actualizar item', 500);
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


