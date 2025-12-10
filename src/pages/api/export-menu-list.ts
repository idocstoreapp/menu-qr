import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { jsonResponse, errorResponse } from '../../lib/api-helpers';

// Endpoint para exportar la lista completa del menú con precios actuales
export const GET: APIRoute = async () => {
  try {
    // Obtener todas las categorías activas ordenadas
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('order_num', { ascending: true });

    if (catError) {
      console.error('Error obteniendo categorías:', catError);
      return errorResponse('Error al obtener categorías: ' + catError.message, 500);
    }

    // Obtener todos los items del menú con sus categorías
    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .order('order_num', { ascending: true });

    if (itemsError) {
      console.error('Error obteniendo items:', itemsError);
      return errorResponse('Error al obtener items: ' + itemsError.message, 500);
    }

    // Formatear precio
    const formatPrice = (price: number) => {
      if (price === 0) return 'Consultar';
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
      }).format(price);
    };

    // Organizar items por categoría
    const menuByCategory: Record<string, any[]> = {};
    
    // Inicializar todas las categorías
    if (categories) {
      categories.forEach(cat => {
        menuByCategory[cat.name] = [];
      });
    }

    // Agrupar items por categoría
    if (items) {
      items.forEach((item: any) => {
        const categoryName = item.category?.name || 'Sin categoría';
        if (!menuByCategory[categoryName]) {
          menuByCategory[categoryName] = [];
        }
        menuByCategory[categoryName].push({
          nombre: item.name,
          descripcion: item.description || '',
          precio: item.price,
          precio_formateado: formatPrice(item.price),
          destacado: item.is_featured || false,
          disponible: item.is_available !== false,
          orden: item.order_num,
        });
      });
    }

    // Generar lista en formato texto plano
    let textList = '📋 LISTA COMPLETA DEL MENÚ - GOURMET ÁRABE\n';
    textList += '='.repeat(50) + '\n\n';
    textList += `Fecha de exportación: ${new Date().toLocaleString('es-CL')}\n\n`;

    let totalItems = 0;

    // Iterar por categorías en orden
    if (categories) {
      categories.forEach(category => {
        const categoryItems = menuByCategory[category.name] || [];
        if (categoryItems.length > 0) {
          textList += `\n## ${category.name.toUpperCase()}\n\n`;
          textList += '| Item | Descripción | Precio |\n';
          textList += '|------|-------------|--------|\n';
          
          categoryItems.forEach(item => {
            const destacado = item.destacado ? ' ⭐' : '';
            const disponible = item.disponible ? '' : ' (No disponible)';
            textList += `| ${item.nombre}${destacado}${disponible} | ${item.descripcion} | ${item.precio_formateado} |\n`;
            totalItems++;
          });
          
          textList += `\n**Total items en ${category.name}: ${categoryItems.length}**\n`;
          textList += '---\n';
        }
      });
    }

    textList += `\n## 📊 RESUMEN\n\n`;
    textList += `**Total de items en el menú: ${totalItems}**\n\n`;
    textList += `**Total de categorías: ${categories?.length || 0}**\n\n`;

    // Retornar en múltiples formatos
    return jsonResponse({
      success: true,
      fecha_exportacion: new Date().toISOString(),
      resumen: {
        total_items: totalItems,
        total_categorias: categories?.length || 0,
      },
      menu_por_categoria: menuByCategory,
      lista_texto: textList,
      items_completos: items?.map((item: any) => ({
        id: item.id,
        nombre: item.name,
        descripcion: item.description,
        precio: item.price,
        precio_formateado: formatPrice(item.price),
        categoria: item.category?.name || 'Sin categoría',
        destacado: item.is_featured || false,
        disponible: item.is_available !== false,
        imagen: item.image_url || null,
        orden: item.order_num,
      })) || [],
    });
  } catch (error: any) {
    console.error('Error exportando menú:', error);
    return errorResponse('Error al exportar menú: ' + (error.message || 'Desconocido'), 500);
  }
};

