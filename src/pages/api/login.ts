import type { APIRoute } from 'astro';
import { db } from '../../db/index';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, generateToken } from '../../lib/auth';
import { jsonResponse, errorResponse } from '../../lib/api-helpers';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return errorResponse('Usuario y contraseña requeridos', 400);
    }

    const user = await db.select().from(users).where(eq(users.username, username)).limit(1);

    if (user.length === 0) {
      return errorResponse('Credenciales inválidas', 401);
    }

    const isValid = await verifyPassword(password, user[0].password);

    if (!isValid) {
      return errorResponse('Credenciales inválidas', 401);
    }

    const token = generateToken(user[0].id);

    cookies.set('auth-token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: import.meta.env.PROD,
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return jsonResponse({ success: true, token });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Error en el servidor', 500);
  }
};


