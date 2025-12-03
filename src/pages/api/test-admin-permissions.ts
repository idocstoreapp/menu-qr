import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { requireAuth, jsonResponse, errorResponse } from '../../lib/api-helpers';

// Endpoint para probar que el admin tiene todos los permisos necesarios
export const GET: APIRoute = async ({ cookies }) => {
  try {
    // Verificar autenticación
    requireAuth({ cookies } as any);

    const tests: any = {
      read_categories: { success: false, error: null },
      read_items: { success: false, error: null },
      create_category: { success: false, error: null },
      create_item: { success: false, error: null },
      update_item: { success: false, error: null },
      delete_test_data: { success: false, error: null },
    };

    // Test 1: Leer categorías
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      tests.read_categories = { success: true };
    } catch (error: any) {
      tests.read_categories = { success: false, error: error.message };
    }

    // Test 2: Leer items
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      tests.read_items = { success: true };
    } catch (error: any) {
      tests.read_items = { success: false, error: error.message };
    }

    // Test 3: Crear categoría de prueba
    let testCategoryId: number | null = null;
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: 'TEST_CATEGORY_DELETE_ME',
          slug: 'test-category-delete-me-' + Date.now(),
          is_active: false,
        }])
        .select()
        .single();
      
      if (error) throw error;
      testCategoryId = data.id;
      tests.create_category = { success: true, id: data.id };
    } catch (error: any) {
      tests.create_category = { success: false, error: error.message };
    }

    // Test 4: Crear item de prueba
    let testItemId: number | null = null;
    if (testCategoryId) {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .insert([{
            name: 'TEST_ITEM_DELETE_ME',
            description: 'Item de prueba',
            price: 0,
            category_id: testCategoryId,
            is_available: false,
          }])
          .select()
          .single();
        
        if (error) throw error;
        testItemId = data.id;
        tests.create_item = { success: true, id: data.id };
      } catch (error: any) {
        tests.create_item = { success: false, error: error.message };
      }
    }

    // Test 5: Actualizar item
    if (testItemId) {
      try {
        const { error } = await supabase
          .from('menu_items')
          .update({ name: 'TEST_ITEM_UPDATED' })
          .eq('id', testItemId);
        
        if (error) throw error;
        tests.update_item = { success: true };
      } catch (error: any) {
        tests.update_item = { success: false, error: error.message };
      }
    }

    // Test 6: Limpiar datos de prueba
    try {
      if (testItemId) {
        await supabase.from('menu_items').delete().eq('id', testItemId);
      }
      if (testCategoryId) {
        await supabase.from('categories').delete().eq('id', testCategoryId);
      }
      tests.delete_test_data = { success: true };
    } catch (error: any) {
      tests.delete_test_data = { success: false, error: error.message };
    }

    // Calcular resultado general
    const allTestsPassed = Object.values(tests).every((test: any) => test.success);
    const passedCount = Object.values(tests).filter((test: any) => test.success).length;
    const totalCount = Object.keys(tests).length;

    return jsonResponse({
      success: allTestsPassed,
      message: allTestsPassed
        ? '✅ Todos los permisos están configurados correctamente'
        : `⚠️ ${passedCount}/${totalCount} tests pasaron. Revisa los errores.`,
      tests,
      summary: {
        passed: passedCount,
        failed: totalCount - passedCount,
        total: totalCount,
      },
      next_steps: allTestsPassed
        ? 'Puedes usar el panel de admin sin problemas'
        : 'Ejecuta el script supabase-permisos-admin.sql en Supabase SQL Editor',
    });

  } catch (error: any) {
    if (error.status === 401) {
      return errorResponse('No autenticado. Inicia sesión primero.', 401);
    }
    return errorResponse('Error: ' + (error.message || 'Desconocido'), 500);
  }
};



