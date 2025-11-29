import { useState, useEffect } from 'react';

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId?: number;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  order: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface MenuItemListProps {
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
}

export default function MenuItemList({ onEdit, onDelete }: MenuItemListProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/menu-items?availableOnly=false');
      const data = await response.json();
      
      // Eliminar duplicados basándose en el ID
      const uniqueItems = Array.isArray(data) 
        ? Array.from(
            new Map(data.map((item: MenuItem) => [item.id, item])).values()
          )
        : [];
      
      setItems(uniqueItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  if (loading) {
    return <div className="text-gold-400 text-center py-8">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-arabic-dark p-4 rounded-lg border border-gold-600 hover:border-gold-400 transition"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-gold-400 font-bold text-lg">{item.name}</h3>
                {!item.isAvailable && (
                  <span className="bg-red-600 text-cream px-2 py-1 rounded text-xs whitespace-nowrap">No disponible</span>
                )}
                {item.isFeatured && (
                  <span className="bg-gold-600 text-arabic-dark px-2 py-1 rounded text-xs whitespace-nowrap">⭐ Destacado</span>
                )}
              </div>
              {item.description && (
                <p className="text-gold-200 text-sm mb-2">{item.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-gold-300 font-bold">{formatPrice(item.price)}</span>
                {item.category && (
                  <span className="text-gold-200">Categoría: {item.category.name}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 md:ml-4 flex-shrink-0">
              <button
                onClick={() => onEdit(item)}
                className="bg-gold-600 hover:bg-gold-500 text-arabic-dark px-4 py-2 rounded transition whitespace-nowrap"
              >
                Editar Precio
              </button>
            </div>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-center text-gold-200 py-8">No hay items en el menú</div>
      )}
    </div>
  );
}




