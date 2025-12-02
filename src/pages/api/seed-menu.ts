import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { jsonResponse, errorResponse } from '../../lib/api-helpers';

// Categorías del menú
const categories = [
  { name: 'Entradas', slug: 'entradas', order_num: 1, description: 'Deliciosas entradas árabes para comenzar' },
  { name: 'Shawarma', slug: 'shawarma', order_num: 2, description: 'Nuestros famosos shawarmas en pan árabe' },
  { name: 'Platillos', slug: 'platillos', order_num: 3, description: 'Platos principales árabes' },
  { name: 'Promociones', slug: 'promociones', order_num: 4, description: 'Ofertas especiales' },
  { name: 'Menú del Día', slug: 'menu-del-dia', order_num: 5, description: 'Platos del día con acompañamiento' },
  { name: 'Menú Fin de Año', slug: 'menu-fin-de-ano', order_num: 6, description: '🎄 Menús especiales para compartir' },
  { name: 'Acompañamiento - Salsas', slug: 'acompanamiento-salsas', order_num: 7, description: 'Salsas caseras' },
  { name: 'Bebestibles', slug: 'bebestibles', order_num: 8, description: 'Bebidas y tés' },
];

// Items del menú COMPLETO
const menuItems = [
  // ==================== ENTRADAS ====================
  { name: 'Hummus con Pan', description: 'Cremoso hummus tradicional servido con pan árabe fresco', price: 4500, categorySlug: 'entradas', order_num: 1 },
  { name: 'Baba Ganoush con Pan', description: 'Berenjena ahumada con tahini y especias', price: 4500, categorySlug: 'entradas', order_num: 2 },
  { name: 'Falafel para Picar (6 und.)', description: 'Croquetas de garbanzos fritas, crujientes por fuera y suaves por dentro', price: 5000, categorySlug: 'entradas', order_num: 3 },
  { name: 'Kebab para Picar (2 unid.)', description: 'Brochetas de carne marinada y especiada', price: 6000, categorySlug: 'entradas', order_num: 4 },
  { name: 'Kubbeh (5 unid.)', description: 'Croquetas de trigo bulgur rellenas de carne y especias', price: 5500, categorySlug: 'entradas', order_num: 5 },
  { name: 'Hojas de Parra - Vegana ó Carne (12 und.)', description: 'Hojas de parra rellenas, disponibles en versión vegana o con carne', price: 5500, categorySlug: 'entradas', order_num: 6 },
  { name: 'Repollitos - Vegano ó Carne (10 unid.)', description: 'Repollitos rellenos, opción vegana o con carne', price: 5500, categorySlug: 'entradas', order_num: 7 },

  // ==================== SHAWARMA ====================
  { name: 'Shawarma Mixto', description: 'Pan árabe con pollo + carne (vacuno) + vegetales, 1 salsa a elección', price: 8000, categorySlug: 'shawarma', order_num: 1 },
  { name: 'Shawarma de Pollo', description: 'Pan árabe con pollo + vegetales, 1 salsa a elección', price: 7500, categorySlug: 'shawarma', order_num: 2 },
  { name: 'Shawarma de Carne', description: 'Pan árabe con carne (vacuno) + vegetales, 1 salsa a elección', price: 10000, categorySlug: 'shawarma', order_num: 3 },
  { name: 'Shawarma de Falafel', description: 'Pan árabe con falafel + vegetales, 1 salsa a elección', price: 7500, categorySlug: 'shawarma', order_num: 4 },

  // ==================== PLATILLOS ====================
  { name: 'Chorrillana (con 2 salsas a elección)', description: 'Plato abundante estilo chorrillana con ingredientes árabes', price: 15000, categorySlug: 'platillos', order_num: 1 },
  
  // Kebbab
  { name: 'Kebbab - Fajita', description: 'Kebbab servido en fajita', price: 8500, categorySlug: 'platillos', order_num: 2 },
  { name: 'Kebbab - Plato con Arroz', description: 'Kebbab al plato con arroz árabe', price: 9500, categorySlug: 'platillos', order_num: 3 },
  { name: 'Kebbab - Plato con Arroz y Papas Fritas', description: 'Kebbab al plato con arroz árabe y papas fritas', price: 10500, categorySlug: 'platillos', order_num: 4 },
  { name: 'Kebbab - Plato con Papas Fritas', description: 'Kebbab al plato con papas fritas', price: 9500, categorySlug: 'platillos', order_num: 5 },
  { name: 'Kebbab Guisado', description: 'Kebbab guisado con salsa especial', price: 10000, categorySlug: 'platillos', order_num: 6 },
  
  // Kubbeh
  { name: 'Kubbeh - Plato con Arroz', description: 'Kubbeh al plato con arroz árabe', price: 9500, categorySlug: 'platillos', order_num: 7 },
  { name: 'Kubbeh - Plato con Arroz y Papas Fritas', description: 'Kubbeh al plato con arroz árabe y papas fritas', price: 10500, categorySlug: 'platillos', order_num: 8 },
  { name: 'Kubbeh - Plato con Papas Fritas', description: 'Kubbeh al plato con papas fritas', price: 9500, categorySlug: 'platillos', order_num: 9 },
  
  // Shawarma al Plato (solo los que son AL PLATO, no fajita/pan que ya están en sección Shawarma)
  { name: 'Shawarma - Al Plato (Pollo c/ Arroz)', description: 'Shawarma de pollo al plato con arroz árabe', price: 9500, categorySlug: 'platillos', order_num: 10 },
  { name: 'Shawarma - Al Plato (Pollo c/ Arroz y Papas Fritas)', description: 'Shawarma de pollo al plato con arroz y papas fritas', price: 10500, categorySlug: 'platillos', order_num: 11 },
  { name: 'Shawarma - Al Plato (Carne c/ Arroz)', description: 'Shawarma de carne al plato con arroz árabe', price: 10500, categorySlug: 'platillos', order_num: 12 },
  { name: 'Shawarma - Al Plato (Carne c/ Arroz y Papas Fritas)', description: 'Shawarma de carne al plato con arroz y papas fritas', price: 11500, categorySlug: 'platillos', order_num: 13 },
  { name: 'Shawarma - Al Plato (Mixto c/ Arroz)', description: 'Shawarma mixto al plato con arroz árabe', price: 10500, categorySlug: 'platillos', order_num: 14 },
  { name: 'Shawarma - Al Plato (Mixto c/ Arroz y Papas Fritas)', description: 'Shawarma mixto al plato con arroz y papas fritas', price: 11500, categorySlug: 'platillos', order_num: 15 },
  
  // Falafel al Plato
  { name: 'Falafel - Fajita Vegano', description: 'Falafel servido en fajita, opción vegana', price: 7500, categorySlug: 'platillos', order_num: 16 },
  { name: 'Falafel - Al Plato Vegano (c/ Arroz)', description: 'Falafel al plato con arroz árabe', price: 8500, categorySlug: 'platillos', order_num: 17 },
  { name: 'Falafel - Al Plato Vegano (c/ Arroz y Papas Fritas)', description: 'Falafel al plato con arroz y papas fritas', price: 9500, categorySlug: 'platillos', order_num: 18 },
  { name: 'Falafel - Al Plato Vegano (c/ Papas Fritas)', description: 'Falafel al plato con papas fritas', price: 8500, categorySlug: 'platillos', order_num: 19 },
  
  // Tablas y otros
  { name: 'Tabla Mixta - Carne', description: 'Variedad de carnes árabes para compartir', price: 18000, categorySlug: 'platillos', order_num: 20 },
  { name: 'Tabla Mixta - Vegana', description: 'Variedad de opciones veganas para compartir', price: 16000, categorySlug: 'platillos', order_num: 21 },
  { name: 'Musaka', description: 'Tradicional musaka árabe', price: 9500, categorySlug: 'platillos', order_num: 22 },
  { name: 'Papas Fritas (Individual)', description: 'Porción individual de papas fritas', price: 3500, categorySlug: 'platillos', order_num: 23 },
  { name: 'Papas Fritas (Para Compartir)', description: 'Porción grande de papas fritas para compartir', price: 5500, categorySlug: 'platillos', order_num: 24 },
  { name: 'Especial del Día', description: 'Consultar el especial del día', price: 0, categorySlug: 'platillos', order_num: 25 },
  { name: 'Postre del Día', description: 'Consultar el postre del día', price: 0, categorySlug: 'platillos', order_num: 26 },

  // ==================== PROMOCIONES ====================
  { name: 'Promo Shawarma Maxi Mixto', description: 'Para 1 persona. Pan árabe (27cm), pollo + carne + vegetales, 2 falafel, 2 salsas, 1 papas fritas pequeñas', price: 13000, categorySlug: 'promociones', order_num: 1, is_featured: true },
  { name: 'Promo Shawarma Duo Clásico Mixto', description: 'Para 2 personas. 2 Shawarma mixto (24cm), 4 falafel, 2 salsas, 1 papas fritas, 2 bebidas a elección', price: 23990, categorySlug: 'promociones', order_num: 2, is_featured: true },

  // ==================== MENÚ DEL DÍA ====================
  { name: 'Pollo a la Plancha', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 1 },
  { name: 'Pollo a la Aceituna', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 2 },
  { name: 'Pollo a la Ciruela', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 3 },
  { name: 'Pollo Arvejado', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 4 },
  { name: 'Pollo Guisado con Verduras', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 5 },
  { name: 'Tomaticán de Pollo', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 6 },
  { name: 'Guisado de 3 Lentejas', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 7 },
  { name: 'Guisado de Garbanzos', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 8 },
  { name: 'Guisado de Berenjena', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 9 },
  { name: 'Consomé Individual', description: 'Consomé árabe tradicional por separado', price: 2000, categorySlug: 'menu-del-dia', order_num: 10 },

  // ==================== MENÚ FIN DE AÑO 🎄 ====================
  { 
    name: '🎄 Menú para 2 personas', 
    description: 'Entrada: 12 Falafel | Fondo: 12 hojas de Parra, 5 repollitos rellenos, 5 papas rellenas, 2 salsas a elección | Postre: 4 dulces árabes', 
    price: 31990, 
    categorySlug: 'menu-fin-de-ano', 
    order_num: 1,
    is_featured: true 
  },
  { 
    name: '🎄 Menú para 4 personas', 
    description: 'Entrada: 12 Falafel | Fondo: 24 hojas de Parra, 4 repollitos rellenos, 4 papas rellenas, 4 zapallitos rellenos, 3 salsas a elección | Postre: 8 dulces árabes', 
    price: 46990, 
    categorySlug: 'menu-fin-de-ano', 
    order_num: 2,
    is_featured: true 
  },
  { 
    name: '🎄 Menú para 6 personas', 
    description: 'Entrada: 12 Falafel | Fondo: 24 hojas de Parra, 6 repollitos rellenos, 6 papas rellenas, 6 zapallitos rellenos, 4 salsas a elección | Postre: 12 dulces árabes', 
    price: 60990, 
    categorySlug: 'menu-fin-de-ano', 
    order_num: 3,
    is_featured: true 
  },
  { 
    name: '🎄 Menú para 8 personas', 
    description: 'Entrada: 8 Falafel, 8 Kubbe | Fondo: 16 hojas de Parra, 8 repollitos rellenos, 8 papas rellenas, 8 zapallitos rellenos, 4 ajíes rellenos, 4 pimentón rellenos, 4 salsas a elección | Postre: 16 dulces árabes', 
    price: 82990, 
    categorySlug: 'menu-fin-de-ano', 
    order_num: 4,
    is_featured: true 
  },

  // ==================== SALSAS ====================
  { name: 'Salsa de Ajo', description: 'Salsa cremosa de ajo', price: 1500, categorySlug: 'acompanamiento-salsas', order_num: 1 },
  { name: 'Salsa de Cilantro', description: 'Salsa fresca de cilantro', price: 1500, categorySlug: 'acompanamiento-salsas', order_num: 2 },
  { name: 'Salsa de Albahaca', description: 'Salsa aromática de albahaca', price: 1500, categorySlug: 'acompanamiento-salsas', order_num: 3 },

  // ==================== BEBESTIBLES ====================
  { name: 'Tetera de Té Verde', description: 'Té verde aromático servido en tetera tradicional', price: 3000, categorySlug: 'bebestibles', order_num: 1 },
  { name: 'Tetera de Té Jamaica (Karkadé)', description: 'Té de Jamaica refrescante servido en tetera', price: 3000, categorySlug: 'bebestibles', order_num: 2 },
  { name: 'Café Tradicional', description: 'Café tradicional', price: 2000, categorySlug: 'bebestibles', order_num: 3 },
  { name: 'Café Árabe', description: 'Café árabe tradicional preparado a la manera del medio oriente', price: 2500, categorySlug: 'bebestibles', order_num: 4 },
  { name: 'Café Cardamomo', description: 'Café árabe con cardamomo, especiado y aromático', price: 2500, categorySlug: 'bebestibles', order_num: 5 },
  { name: 'Bebidas Lata (Variedad)', description: 'Variedad de bebidas en lata', price: 1500, categorySlug: 'bebestibles', order_num: 6 },
  { name: 'Agua Mineral con Gas', description: 'Agua mineral con gas', price: 1500, categorySlug: 'bebestibles', order_num: 7 },
  { name: 'Agua Mineral sin Gas', description: 'Agua mineral sin gas', price: 1500, categorySlug: 'bebestibles', order_num: 8 },
  { name: 'Jugos Naturales (Variedad)', description: 'Jugos naturales frescos en variedad de sabores', price: 2500, categorySlug: 'bebestibles', order_num: 9 },
];

export const GET: APIRoute = async () => {
  try {
    const results: any = {
      categories: { created: 0, errors: [] },
      items: { created: 0, errors: [] },
    };

    // 1. Limpiar tablas existentes
    console.log('🗑️ Limpiando datos existentes...');
    await supabase.from('menu_items').delete().neq('id', 0);
    await supabase.from('categories').delete().neq('id', 0);

    // 2. Crear categorías
    console.log('📁 Creando categorías...');
    const categoryMap = new Map<string, number>();

    for (const cat of categories) {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          order_num: cat.order_num,
          is_active: true,
        }])
        .select()
        .single();

      if (error) {
        console.error(`Error creando categoría ${cat.name}:`, error);
        results.categories.errors.push({ name: cat.name, error: error.message });
      } else if (data) {
        categoryMap.set(cat.slug, data.id);
        results.categories.created++;
        console.log(`✅ Categoría creada: ${cat.name} (ID: ${data.id})`);
      }
    }

    // 3. Crear items del menú
    console.log('🍽️ Creando items del menú...');
    
    for (const item of menuItems) {
      const categoryId = categoryMap.get(item.categorySlug);
      
      if (!categoryId) {
        results.items.errors.push({ name: item.name, error: `Categoría ${item.categorySlug} no encontrada` });
        continue;
      }

      const { data, error } = await supabase
        .from('menu_items')
        .insert([{
          name: item.name,
          description: item.description,
          price: item.price,
          category_id: categoryId,
          order_num: item.order_num,
          is_available: true,
          is_featured: (item as any).is_featured || false,
        }])
        .select()
        .single();

      if (error) {
        console.error(`Error creando item ${item.name}:`, error);
        results.items.errors.push({ name: item.name, error: error.message });
      } else {
        results.items.created++;
      }
    }

    console.log('✅ Seed completado!');

    return jsonResponse({
      success: true,
      message: '✅ Menú COMPLETO cargado correctamente',
      results: {
        categories: `${results.categories.created} categorías creadas`,
        items: `${results.items.created} items creados`,
        errors: results.categories.errors.length + results.items.errors.length > 0 
          ? [...results.categories.errors, ...results.items.errors]
          : 'Ninguno'
      },
      categorias_creadas: categories.map(c => c.name),
      next_step: 'Visita / para ver el menú o /admin para administrarlo'
    });

  } catch (error: any) {
    console.error('Error en seed:', error);
    return errorResponse('Error: ' + (error.message || 'Desconocido'), 500);
  }
};
