import { useState, useEffect } from 'react';
import ComboMenuCard from './ComboMenuCard';

interface ComboMenu {
  id: number;
  name: string;
  description?: string;
  price: number;
  servings: number;
  items: string;
  imageUrl?: string;
  isAvailable: boolean;
}

export default function ComboMenusSection() {
  const [combos, setCombos] = useState<ComboMenu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      const response = await fetch('/api/combo-menus?availableOnly=true');
      const data = await response.json();
      setCombos(data);
    } catch (error) {
      console.error('Error fetching combo menus:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gold-400 text-xl">Cargando menús combinados...</div>
      </div>
    );
  }

  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-cinzel text-gold-400 mb-4 relative inline-block">
          <span className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 text-2xl opacity-70">✦</span>
          MENÚS COMBINADOS
          <span className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 text-2xl opacity-70">✦</span>
        </h2>
        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-gold-600 to-transparent mx-auto"></div>
      </div>

      {combos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gold-300">No hay menús combinados disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {combos.map((combo) => (
            <ComboMenuCard key={combo.id} combo={combo} />
          ))}
        </div>
      )}
    </section>
  );
}


