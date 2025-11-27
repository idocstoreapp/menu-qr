import type { APIRoute } from 'astro';
import { seedData } from '../../scripts/seed-data';

// Endpoint para poblar la base de datos
// GET: Solo carga si no hay datos (público)
// POST: Fuerza limpieza y recarga (requiere autenticación)
export const GET: APIRoute = async () => {
  try {
    await seedData(false); // No forzar limpieza
    return new Response(JSON.stringify({ success: true, message: 'Datos cargados correctamente (solo si no había datos)' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Error seeding data:', error);
    return new Response(JSON.stringify({ error: 'Error al cargar datos', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Requiere autenticación para forzar limpieza
    const { requireAuth } = await import('../../lib/api-helpers');
    requireAuth({ cookies } as any);
    
    // Verificar si se quiere forzar limpieza
    const body = await request.json().catch(() => ({}));
    const forceClean = body.forceClean === true;
    
    await seedData(forceClean);
    return new Response(JSON.stringify({ 
      success: true, 
      message: forceClean 
        ? 'Datos limpiados y recargados correctamente' 
        : 'Datos cargados correctamente (solo si no había datos)' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    if (error.status === 401) return error;
    console.error('Error seeding data:', error);
    return new Response(JSON.stringify({ error: 'Error al cargar datos', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
