import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { verifyPassword, generateToken, hashPassword } from '../../lib/auth';
import { jsonResponse, errorResponse } from '../../lib/api-helpers';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return errorResponse('Usuario y contraseña requeridos', 400);
    }

    // Buscar usuario en Supabase
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();

    // Si no existe el usuario admin, crearlo automáticamente
    if (error || !user) {
      if (username === 'admin' && password === 'admin123') {
        // Crear usuario admin por defecto
        const hashedPassword = await hashPassword('admin123');
        const { data: newUser, error: createError } = await supabase
          .from('admin_users')
          .insert([{
            username: 'admin',
            password_hash: hashedPassword,
          }])
          .select()
          .single();

        if (createError || !newUser) {
          console.error('Error creando usuario admin:', createError);
          return errorResponse('Error al crear usuario admin', 500);
        }

        // Login exitoso con nuevo usuario
        const token = generateToken(newUser.id);
        cookies.set('auth-token', token, {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: import.meta.env.PROD,
          maxAge: 60 * 60 * 24 * 7, // 7 días
        });

        return jsonResponse({ success: true, message: 'Usuario admin creado y autenticado' });
      }
      
      return errorResponse('Credenciales inválidas', 401);
    }

    // Verificar contraseña
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      return errorResponse('Credenciales inválidas', 401);
    }

    const token = generateToken(user.id);

    cookies.set('auth-token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: import.meta.env.PROD,
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return jsonResponse({ success: true, token });
  } catch (error: any) {
    console.error('Login error:', error);
    return errorResponse('Error en el servidor: ' + (error.message || 'Desconocido'), 500);
  }
};
