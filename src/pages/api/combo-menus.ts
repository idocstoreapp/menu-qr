import type { APIRoute } from 'astro';
import { db } from '../../db/index';
import { comboMenus } from '../../db/schema';
import { eq, asc } from 'drizzle-orm';
import { requireAuth, jsonResponse, errorResponse, getAuthUser } from '../../lib/api-helpers';

export const GET: APIRoute = async ({ url }) => {
  try {
    const availableOnly = url.searchParams.get('availableOnly') !== 'false';

    let query = db.select().from(comboMenus);

    if (availableOnly) {
      query = query.where(eq(comboMenus.isAvailable, true)) as any;
    }

    const menus = await query.orderBy(asc(comboMenus.servings));

    return jsonResponse(menus);
  } catch (error) {
    console.error('Error fetching combo menus:', error);
    return errorResponse('Error al obtener menús combinados', 500);
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    requireAuth({ cookies } as any);

    const data = await request.json();
    const { name, description, price, servings, items, imageUrl, isAvailable } = data;

    if (!name || !price || !servings || !items) {
      return errorResponse('Datos incompletos', 400);
    }

    const [newMenu] = await db.insert(comboMenus).values({
      name,
      description: description || null,
      price: parseFloat(price),
      servings: parseInt(servings),
      items: JSON.stringify(items),
      imageUrl: imageUrl || null,
      isAvailable: isAvailable !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return jsonResponse(newMenu, 201);
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error creating combo menu:', error);
    return errorResponse('Error al crear menú combinado', 500);
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    requireAuth({ cookies } as any);

    const data = await request.json();
    const { id, ...updates } = data;

    if (!id) {
      return errorResponse('ID es requerido', 400);
    }

    if (updates.items) {
      updates.items = JSON.stringify(updates.items);
    }

    const [updated] = await db.update(comboMenus)
      .set({
        ...updates,
        price: updates.price ? parseFloat(updates.price) : undefined,
        servings: updates.servings ? parseInt(updates.servings) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(comboMenus.id, id))
      .returning();

    if (!updated) {
      return errorResponse('Menú no encontrado', 404);
    }

    return jsonResponse(updated);
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error updating combo menu:', error);
    return errorResponse('Error al actualizar menú', 500);
  }
};

export const DELETE: APIRoute = async ({ url, cookies }) => {
  try {
    requireAuth({ cookies } as any);

    const id = url.searchParams.get('id');
    if (!id) {
      return errorResponse('ID es requerido', 400);
    }

    await db.delete(comboMenus).where(eq(comboMenus.id, parseInt(id)));

    return jsonResponse({ success: true });
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error deleting combo menu:', error);
    return errorResponse('Error al eliminar menú', 500);
  }
};


