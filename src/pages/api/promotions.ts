import type { APIRoute } from 'astro';
import { db } from '../../db/index';
import { promotions } from '../../db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { requireAuth, jsonResponse, errorResponse } from '../../lib/api-helpers';

export const GET: APIRoute = async () => {
  try {
    const now = new Date();
    const activePromos = await db.select().from(promotions)
      .where(
        and(
          eq(promotions.isActive, true),
          gte(promotions.validUntil || now, now)
        )
      )
      .orderBy(promotions.createdAt);

    return jsonResponse(activePromos);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return errorResponse('Error al obtener promociones', 500);
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    requireAuth({ cookies } as any);

    const data = await request.json();
    const { name, description, originalPrice, discountPrice, items, imageUrl, validFrom, validUntil } = data;

    if (!name || !discountPrice || !items) {
      return errorResponse('Datos incompletos', 400);
    }

    const [newPromo] = await db.insert(promotions).values({
      name,
      description: description || null,
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      discountPrice: parseFloat(discountPrice),
      items: JSON.stringify(items),
      imageUrl: imageUrl || null,
      isActive: true,
      validFrom: validFrom ? new Date(validFrom) : null,
      validUntil: validUntil ? new Date(validUntil) : null,
      createdAt: new Date(),
    }).returning();

    return jsonResponse(newPromo, 201);
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error creating promotion:', error);
    return errorResponse('Error al crear promoción', 500);
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

    const [updated] = await db.update(promotions)
      .set(updates)
      .where(eq(promotions.id, id))
      .returning();

    if (!updated) {
      return errorResponse('Promoción no encontrada', 404);
    }

    return jsonResponse(updated);
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error updating promotion:', error);
    return errorResponse('Error al actualizar promoción', 500);
  }
};


