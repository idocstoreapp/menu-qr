import { useState, useEffect, useRef } from 'react';
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
  const isFetchingRef = useRef(false);
  const lastCategoryIdRef = useRef<number | null>(null);
  const renderCountRef = useRef(0);
  
  // Log cada vez que el componente se renderiza
  renderCountRef.current += 1;
  console.log(`[MenuSection] Render #${renderCountRef.current} - Items en estado: ${items.length}`);

  useEffect(() => {
    // Si category es string (JSON), parsearlo
    if (typeof categoryProp === 'string') {
      try {
        setCategory(JSON.parse(categoryProp));
      } catch {
        return;
      }
    } else {
      setCategory(categoryProp);
    }
  }, [categoryProp]);

  useEffect(() => {
    if (category && category.id !== lastCategoryIdRef.current) {
      lastCategoryIdRef.current = category.id;
      fetchItems();
    }
  }, [category]);

  const fetchItems = async () => {
    if (!category || isFetchingRef.current) {
      console.log(`[MenuSection] Saltando fetch - category: ${category?.id}, isFetching: ${isFetchingRef.current}`);
      return;
    }
    
    isFetchingRef.current = true;
    setLoading(true);
    console.log(`[MenuSection] Iniciando fetch para categoría ${category.id} (${category.name})`);
    
    try {
      const response = await fetch(`/api/menu-items?categoryId=${category.id}&availableOnly=true`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`[MenuSection] Items recibidos del API para ${category.name}:`, data.length);
      
      // Eliminar duplicados basándose en el ID (más robusto)
      if (!Array.isArray(data)) {
        console.warn('⚠️ Los datos recibidos no son un array:', typeof data);
        setItems([]);
        return;
      }
      
      // Usar un objeto simple para deduplicación más eficiente
      const itemsById: Record<number, MenuItem> = {};
      
      for (const item of data) {
        const id = Number(item?.id);
        // Solo agregar si el ID es válido y no lo hemos visto antes
        if (id && id > 0 && !itemsById[id]) {
          itemsById[id] = item as MenuItem;
        }
      }
      
      const uniqueItems = Object.values(itemsById);
      
      if (data.length !== uniqueItems.length) {
        console.warn(`⚠️ [MenuSection] Se encontraron ${data.length - uniqueItems.length} items duplicados en ${category.name}, eliminados.`);
      }
      
      console.log(`[MenuSection] Items únicos después de deduplicación: ${uniqueItems.length} (de ${data.length} recibidos)`);
      setItems(uniqueItems);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      console.log(`[MenuSection] Fetch completado para categoría ${category.id}`);
    }
  };

  if (!category) {
    return null;
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gold-400 text-xl">Cargando...</div>
      </div>
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

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gold-400 text-xl">Cargando items...</div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gold-300 mb-2">No hay items disponibles en esta categoría</p>
          <p className="text-gold-400 text-sm">Categoría ID: {category.id} | Slug: {category.slug}</p>
          <button 
            onClick={() => fetchItems()} 
            className="mt-4 px-4 py-2 bg-gold-600 text-black rounded hover:bg-gold-500 font-bold"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(() => {
            // Log para debugging - verificar si hay duplicados en el render
            const itemIds = items.map(item => item.id);
            const uniqueIds = new Set(itemIds);
            if (itemIds.length !== uniqueIds.size) {
              console.error(`🚨 [MenuSection] ERROR: Se detectaron ${itemIds.length - uniqueIds.size} IDs duplicados en el array de items al renderizar!`);
              console.log('IDs duplicados:', itemIds.filter((id, index) => itemIds.indexOf(id) !== index));
            }
            console.log(`[MenuSection] Renderizando ${items.length} items con IDs:`, itemIds);
            
            // Asegurar que solo renderizamos items únicos
            const seenIds = new Set<number>();
            const uniqueItemsToRender = items.filter(item => {
              if (seenIds.has(item.id)) {
                console.warn(`⚠️ [MenuSection] Filtrando item duplicado con ID ${item.id} durante el render`);
                return false;
              }
              seenIds.add(item.id);
              return true;
            });
            
            if (uniqueItemsToRender.length !== items.length) {
              console.warn(`⚠️ [MenuSection] Se filtraron ${items.length - uniqueItemsToRender.length} items duplicados durante el render`);
            }
            
            return uniqueItemsToRender.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ));
          })()}
        </div>
      )}
    </section>
  );
}

