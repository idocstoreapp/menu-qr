import type { APIContext } from 'astro';
import { verifyToken } from './auth';

export function getAuthUser(context: APIContext): { userId: number } | null {
  const token = context.cookies.get('auth-token')?.value;
  if (!token) return null;

  return verifyToken(token);
}

export function requireAuth(context: APIContext): { userId: number } {
  const user = getAuthUser(context);
  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }
  return user;
}

export function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status);
}


