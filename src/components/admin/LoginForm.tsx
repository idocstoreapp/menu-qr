import { useState } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/admin';
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-arabic-dark via-arabic-brown to-terracotta-700">
      <div className="bg-arabic-dark p-8 rounded-lg shadow-2xl border-2 border-gold-600 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cinzel text-gold-400 mb-2">GOURMET ÁRABE</h1>
          <p className="text-beige">Panel de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-600 text-cream p-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gold-400 mb-2">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-arabic-brown text-cream rounded border border-gold-600 focus:border-gold-400 focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-gold-400 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-arabic-brown text-cream rounded border border-gold-600 focus:border-gold-400 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-600 hover:bg-gold-500 text-arabic-dark font-bold py-3 px-4 rounded transition disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="text-beige text-sm text-center mt-6">
          Usuario por defecto: <span className="text-gold-400">admin</span> / 
          Contraseña: <span className="text-gold-400">admin123</span>
        </p>
      </div>
    </div>
  );
}



