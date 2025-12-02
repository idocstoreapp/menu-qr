import type { APIRoute } from 'astro';
import { jsonResponse } from '../lib/api-helpers';

// Endpoint para verificar configuración en producción
export const GET: APIRoute = async () => {
  const config = {
    supabase: {
      url: import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || 'NO CONFIGURADA',
      anonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || 'NO CONFIGURADA',
      hasUrl: !!(import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL),
      hasKey: !!(import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY),
    },
    jwt: {
      secret: import.meta.env.JWT_SECRET ? 'CONFIGURADA' : 'NO CONFIGURADA',
      hasSecret: !!import.meta.env.JWT_SECRET,
    },
    environment: import.meta.env.MODE,
    isProduction: import.meta.env.PROD,
  };

  return jsonResponse({
    success: config.supabase.hasUrl && config.supabase.hasKey && config.jwt.hasSecret,
    config,
    message: config.supabase.hasUrl && config.supabase.hasKey && config.jwt.hasSecret
      ? '✅ Configuración correcta'
      : '❌ Faltan variables de entorno. Revisa la guía de configuración.',
    instructions: !config.supabase.hasUrl || !config.supabase.hasKey || !config.jwt.hasSecret
      ? {
          title: 'Configura las siguientes variables de entorno en tu plataforma de deploy:',
          variables: [
            { name: 'PUBLIC_SUPABASE_URL', required: true, example: 'https://xxxxx.supabase.co' },
            { name: 'PUBLIC_SUPABASE_ANON_KEY', required: true, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            { name: 'JWT_SECRET', required: true, example: 'una-clave-secreta-larga' },
          ],
        }
      : null,
  });
};

