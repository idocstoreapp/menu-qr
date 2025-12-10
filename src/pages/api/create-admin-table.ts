import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { jsonResponse, errorResponse } from '../../lib/api-helpers';

// Endpoint para crear la tabla admin_users si no existe
export const GET: APIRoute = async () => {
  try {
    // Intentar crear la tabla usando SQL directo
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Supabase no permite ejecutar CREATE TABLE directamente desde el cliente
    // Necesitas ejecutarlo en el SQL Editor de Supabase
    
    // Verificar si la tabla existe intentando hacer una query
    const { data, error } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1);

    if (error) {
      return jsonResponse({
        success: false,
        error: 'La tabla admin_users no existe en Supabase',
        message: 'Necesitas crear la tabla manualmente en Supabase',
        instructions: {
          step1: 'Ve a tu proyecto en https://supabase.com/dashboard',
          step2: 'Ve a SQL Editor',
          step3: 'Ejecuta este SQL:',
          sql: createTableSQL,
          step4: 'Después ejecuta /api/reset-admin para crear el usuario'
        }
      });
    }

    return jsonResponse({
      success: true,
      message: '✅ La tabla admin_users existe',
      data: data
    });

  } catch (error: any) {
    console.error('Error verificando tabla:', error);
    return errorResponse('Error: ' + (error.message || 'Desconocido'), 500);
  }
};





