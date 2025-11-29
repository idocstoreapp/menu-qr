interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  videoUrl?: string;
  isAvailable: boolean;
}

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  return (
    <div 
      className="bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-gold-600 hover:border-gold-400 transition-all duration-300 hover:scale-105 hover:shadow-xl" 
      style={{boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)'}}
      data-item-id={item.id}
    >
      {(item.videoUrl || item.imageUrl) && (
        <div className="h-48 overflow-hidden relative">
          {item.videoUrl ? (
            <video
              src={item.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : null}
        </div>
      )}
      <div className="p-4">
        <h3 className="text-gold-400 font-cinzel text-xl font-bold mb-2">{item.name}</h3>
        {item.description && (
          <p className="text-gold-200 text-sm mb-3">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-gold-300 font-bold text-lg">{formatPrice(item.price)}</span>
          {!item.isAvailable && (
            <span className="bg-red-600 text-white px-3 py-1 rounded text-xs">No disponible</span>
          )}
        </div>
      </div>
    </div>
  );
}



