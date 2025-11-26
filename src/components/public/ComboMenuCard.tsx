import { useState, useEffect } from 'react';

interface ComboMenu {
  id: number;
  name: string;
  description?: string;
  price: number;
  servings: number;
  items: string; // JSON string
  imageUrl?: string;
  isAvailable: boolean;
}

interface ComboMenuCardProps {
  combo: ComboMenu;
}

export default function ComboMenuCard({ combo }: ComboMenuCardProps) {
  const [items, setItems] = useState<any>(null);

  useEffect(() => {
    try {
      setItems(JSON.parse(combo.items));
    } catch {
      setItems(null);
    }
  }, [combo.items]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border-2 border-gold-600 hover:border-gold-400 transition-all duration-300 hover:scale-105 hover:shadow-xl" style={{boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)'}}>
      {combo.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={combo.imageUrl}
            alt={combo.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gold-400 font-cinzel text-2xl font-bold">{combo.name}</h3>
          <span className="bg-gold-600 text-black px-3 py-1 rounded text-sm font-bold">
            {combo.servings} personas
          </span>
        </div>
        
        {combo.description && (
          <p className="text-gold-200 text-sm mb-4 italic">{combo.description}</p>
        )}

        {items && (
          <div className="space-y-3 mb-4">
            {items.entrada && (
              <div>
                <h4 className="text-gold-300 font-semibold mb-1">Entrada:</h4>
                <p className="text-gold-200 text-sm">
                  {Array.isArray(items.entrada) ? items.entrada.join(', ') : items.entrada}
                </p>
              </div>
            )}
            
            {items.fondo && (
              <div>
                <h4 className="text-gold-300 font-semibold mb-1">Fondo:</h4>
                <ul className="text-gold-200 text-sm list-disc list-inside space-y-1">
                  {Array.isArray(items.fondo) ? (
                    items.fondo.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))
                  ) : (
                    <li>{items.fondo}</li>
                  )}
                </ul>
              </div>
            )}
            
            {items.postre && (
              <div>
                <h4 className="text-gold-300 font-semibold mb-1">Postre:</h4>
                <p className="text-gold-200 text-sm">
                  {Array.isArray(items.postre) ? items.postre.join(', ') : items.postre}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gold-600">
          <span className="text-gold-300 font-bold text-2xl">{formatPrice(combo.price)}</span>
          {!combo.isAvailable && (
            <span className="bg-red-600 text-white px-3 py-1 rounded text-xs">No disponible</span>
          )}
        </div>
      </div>
    </div>
  );
}


