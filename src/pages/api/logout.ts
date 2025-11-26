import type { APIRoute } from 'astro';
import { jsonResponse } from '../../lib/api-helpers';

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete('auth-token', { path: '/' });
  return jsonResponse({ success: true });
};


