import type { APIRoute } from 'astro';
import { db } from '../../db/index';
import { dailyMenu } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth, jsonResponse, errorResponse } from '../../lib/api-helpers';

export const GET: APIRoute = async ({ url }) => {
  try {
    const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

    const [menu] = await db.select().from(dailyMenu)
      .where(eq(dailyMenu.date, date))
      .limit(1);

    return jsonResponse(menu || null);
  } catch (error) {
    console.error('Error fetching daily menu:', error);
    return errorResponse('Error al obtener menú del día', 500);
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    requireAuth({ cookies } as any);

    const data = await request.json();
    const { date, items, price, isActive } = data;

    if (!date || !items || !price) {
      return errorResponse('Fecha, items y precio son requeridos', 400);
    }

    const [newMenu] = await db.insert(dailyMenu).values({
      date,
      items: JSON.stringify(items),
      price: parseFloat(price),
      isActive: isActive !== false,
      createdAt: new Date(),
    }).returning();

    return jsonResponse(newMenu, 201);
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error creating daily menu:', error);
    return errorResponse('Error al crear menú del día', 500);
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

    const [updated] = await db.update(dailyMenu)
      .set(updates)
      .where(eq(dailyMenu.id, id))
      .returning();

    if (!updated) {
      return errorResponse('Menú no encontrado', 404);
    }

    return jsonResponse(updated);
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error updating daily menu:', error);
    return errorResponse('Error al actualizar menú', 500);
  }
};


