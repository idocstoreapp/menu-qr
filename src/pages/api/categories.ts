import type { APIRoute } from 'astro';
import { db } from '../../db/index';
import { categories } from '../../db/schema';
import { eq, asc } from 'drizzle-orm';
import { requireAuth, jsonResponse, errorResponse } from '../../lib/api-helpers';

export const GET: APIRoute = async () => {
  try {
    const cats = await db.select().from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.order), asc(categories.name));

    return jsonResponse(cats);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return errorResponse('Error al obtener categorías', 500);
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    requireAuth({ cookies } as any);

    const data = await request.json();
    const { name, slug, description, order } = data;

    if (!name || !slug) {
      return errorResponse('Nombre y slug son requeridos', 400);
    }

    const [newCategory] = await db.insert(categories).values({
      name,
      slug,
      description: description || null,
      order: order || 0,
      isActive: true,
      createdAt: new Date(),
    }).returning();

    return jsonResponse(newCategory, 201);
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error creating category:', error);
    return errorResponse('Error al crear categoría', 500);
  }
};


