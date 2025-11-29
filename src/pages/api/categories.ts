import type { APIRoute } from 'astro';
import { db } from '../../db/index';
import { categories, menuItems } from '../../db/schema';
import { eq, asc, inArray } from 'drizzle-orm';
import { requireAuth, jsonResponse, errorResponse } from '../../lib/api-helpers';

export const GET: APIRoute = async ({ url }) => {
  try {
    const onlyWithItems = url.searchParams.get('onlyWithItems') === 'true';
    
    if (onlyWithItems) {
      // Devolver solo categorías que tienen items disponibles
      // Primero obtener los IDs de categorías con items disponibles
      const itemsWithCategories = await db
        .selectDistinct({ categoryId: menuItems.categoryId })
        .from(menuItems)
        .where(eq(menuItems.isAvailable, true));
      
      const categoryIds = itemsWithCategories
        .map(item => item.categoryId)
        .filter(id => id !== null) as number[];
      
      if (categoryIds.length === 0) {
        return jsonResponse([]);
      }
      
      // Luego obtener las categorías
      const catsWithItems = await db.select().from(categories)
        .where(eq(categories.isActive, true))
        .where(inArray(categories.id, categoryIds))
        .orderBy(asc(categories.order), asc(categories.name));

      return jsonResponse(catsWithItems);
    } else {
      // Devolver todas las categorías activas (para el panel admin)
      const cats = await db.select().from(categories)
        .where(eq(categories.isActive, true))
        .orderBy(asc(categories.order), asc(categories.name));

      return jsonResponse(cats);
    }
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


