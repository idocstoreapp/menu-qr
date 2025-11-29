import { useState, useEffect, useMemo, useRef } from 'react';
import MenuItemCard from './MenuItemCard';

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId?: number;
  imageUrl?: string;
  isAvailable: boolean;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface MenuSectionProps {
  category: Category | string;
}

export default function MenuSection({ category: categoryProp }: MenuSectionProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const fetchInProgress = useRef(false);
  const mountedRef = useRef(true);

  // Parsear categoría
  useEffect(() => {
    if (typeof categoryProp === 'string') {
      try {
        const parsed = JSON.parse(categoryProp);
        setCategory(parsed);
      } catch {
        setCategory(null);
      }
    } else {
      setCategory(categoryProp);
    }
  }, [categoryProp]);

  // Fetch items
  useEffect(() => {
    if (!category || fetchInProgress.current) return;

    const fetchItems = async () => {
      if (!mountedRef.current || fetchInProgress.current) return;
      
      fetchInProgress.current = true;
      setLoading(true);

      try {
        const response = await fetch(`/api/menu-items?categoryId=${category.id}&availableOnly=true`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          setItems([]);
          return;
        }

        // Deduplicación final usando objeto simple
        const uniqueItemsMap: Record<number, MenuItem> = {};
        for (const item of data) {
          const id = Number(item?.id);
          if (id && id > 0 && !uniqueItemsMap[id]) {
            uniqueItemsMap[id] = item as MenuItem;
          }
        }

        const uniqueItems = Object.values(uniqueItemsMap);
        
        if (mountedRef.current) {
          setItems(uniqueItems);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        if (mountedRef.current) {
          setItems([]);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          fetchInProgress.current = false;
        }
      }
    };

    fetchItems();

    return () => {
      mountedRef.current = false;
    };
  }, [category]);

  // Memoizar items únicos para evitar re-renders innecesarios
  const uniqueItems = useMemo(() => {
    const seen = new Set<number>();
    return items.filter(item => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  }, [items]);

  if (!category) {
    return null;
  }

  if (loading) {
    return (
      <section id={category.slug} className="mb-16 scroll-mt-20">
        <div className="text-center py-12">
          <div className="text-gold-400 text-xl">Cargando...</div>
        </div>
      </section>
    );
  }

  return (
    <section id={category.slug} className="mb-16 scroll-mt-20">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-cinzel text-gold-400 mb-4 relative inline-block px-8 py-4 bg-black/80 backdrop-blur-md rounded-lg border-2 border-gold-600" style={{textShadow: '0 0 10px rgba(212, 175, 55, 0.6), 2px 2px 4px rgba(0, 0, 0, 0.8)'}}>
          <span className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 text-2xl text-gold-400 opacity-90">✦</span>
          {category.name.toUpperCase()}
          <span className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 text-2xl text-gold-400 opacity-90">✦</span>
        </h2>
        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-gold-600 to-transparent mx-auto mt-2"></div>
      </div>

      {uniqueItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gold-300 mb-2">No hay items disponibles en esta categoría</p>
          <p className="text-gold-400 text-sm">Categoría ID: {category.id} | Slug: {category.slug}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueItems.map((item) => (
            <MenuItemCard key={`item-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
