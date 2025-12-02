import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { hashPassword } from '../../lib/auth';
import { jsonResponse, errorResponse } from '../../lib/api-helpers';

// Endpoint temporal para crear/resetear el usuario admin
// ELIMINAR DESPUÉS DE USAR
export const GET: APIRoute = async () => {
  try {
    // Primero verificar la conexión con Supabase
    const { data: testConnection, error: connError } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1);

    if (connError) {
      // La tabla no existe, intentar crearla
      console.log('Error de conexión o tabla no existe:', connError.message);
      
      return jsonResponse({
        success: false,
        error: 'Tabla admin_users no existe. Ejecuta el schema SQL en Supabase.',
        details: connError.message
      });
    }

    // Eliminar usuario admin existente
    const { error: deleteError } = await supabase
      .from('admin_users')
      .delete()
      .eq('username', 'admin');

    if (deleteError) {
      console.log('Error eliminando admin:', deleteError.message);
    }

    // Crear hash de la contraseña
    const hashedPassword = await hashPassword('admin123');
    console.log('Hash generado para admin123:', hashedPassword);

    // Crear nuevo usuario admin
    const { data: newUser, error: createError } = await supabase
      .from('admin_users')
      .insert([{
        username: 'admin',
        password_hash: hashedPassword,
      }])
      .select()
      .single();

    if (createError) {
      console.error('Error creando admin:', createError);
      return jsonResponse({
        success: false,
        error: 'Error al crear usuario admin',
        details: createError.message
      });
    }

    return jsonResponse({
      success: true,
      message: '✅ Usuario admin creado/reseteado correctamente',
      user: {
        id: newUser.id,
        username: newUser.username
      },
      credentials: {
        username: 'admin',
        password: 'admin123'
      },
      next_step: 'Ahora puedes hacer login en /admin/login'
    });

  } catch (error: any) {
    console.error('Error en reset-admin:', error);
    return errorResponse('Error: ' + (error.message || 'Desconocido'), 500);
  }
};

