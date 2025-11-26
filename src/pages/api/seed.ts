import type { APIRoute } from 'astro';
import { seedData } from '../../scripts/seed-data';

// Endpoint público para poblar la base de datos (solo para desarrollo)
export const GET: APIRoute = async () => {
  try {
    await seedData();
    return new Response(JSON.stringify({ success: true, message: 'Datos cargados correctamente' }), {
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

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // También permitir POST con autenticación
    const { requireAuth } = await import('../../lib/api-helpers');
    requireAuth({ cookies } as any);
    await seedData();
    return new Response(JSON.stringify({ success: true, message: 'Datos cargados correctamente' }), {
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
