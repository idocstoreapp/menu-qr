import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { requireAuth, jsonResponse, errorResponse } from '../../lib/api-helpers';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    requireAuth({ cookies } as any);
    
    const body = await request.json();
    const { imageUrl } = body;
    
    if (!imageUrl) {
      return errorResponse('URL de imagen requerida', 400);
    }
    
    // Extraer nombre del archivo de la URL
    // URL format: https://xxxxx.supabase.co/storage/v1/object/public/menu-images/filename.jpg
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    if (!fileName) {
      return errorResponse('No se pudo extraer el nombre del archivo', 400);
    }
    
    const { error } = await supabase.storage
      .from('menu-images')
      .remove([fileName]);
    
    if (error) {
      console.error('Error eliminando imagen:', error);
      return errorResponse('Error al eliminar imagen: ' + error.message, 500);
    }
    
    return jsonResponse({
      success: true,
      message: 'Imagen eliminada',
    });
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error en delete-image:', error);
    return errorResponse('Error interno: ' + (error.message || 'Desconocido'), 500);
  }
};

