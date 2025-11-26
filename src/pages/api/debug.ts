import type { APIRoute } from 'astro';
import { db } from '../../db/index';
import { menuItems, categories } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { jsonResponse } from '../../lib/api-helpers';

export const GET: APIRoute = async () => {
  try {
    const allCategories = await db.select().from(categories);
    const allItems = await db.select().from(menuItems);
    
    const itemsByCategory: Record<string, any[]> = {};
    
    for (const category of allCategories) {
      const items = await db.select()
        .from(menuItems)
        .where(eq(menuItems.categoryId, category.id));
      itemsByCategory[category.name] = items;
    }
    
    return jsonResponse({
      totalCategories: allCategories.length,
      totalItems: allItems.length,
      categories: allCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        itemCount: itemsByCategory[cat.name]?.length || 0
      })),
      itemsByCategory
    });
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
};

