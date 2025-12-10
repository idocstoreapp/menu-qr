interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  videoUrl?: string;
  isAvailable: boolean;
}

import { useEffect, useRef } from 'react';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  
  // Generar delay aleatorio único para cada card (0-12 segundos)
  useEffect(() => {
    if (!imageContainerRef.current) return;
    
    // Delay aleatorio entre 0 y 12 segundos
    const randomDelay = Math.random() * 12;
    // Duración aleatoria entre 12 y 15 segundos
    const randomDuration = 12 + Math.random() * 3;
    
    // Aplicar delay y duración a la imagen
    const img = imageContainerRef.current.querySelector('img, video');
    if (img) {
      (img as HTMLElement).style.animationDelay = `${randomDelay}s`;
      (img as HTMLElement).style.animationDuration = `${randomDuration}s`;
    }
    
    // Aplicar EXACTAMENTE el mismo delay y duración al flash para sincronización perfecta
    if (flashRef.current) {
      flashRef.current.style.animationDelay = `${randomDelay}s`;
      flashRef.current.style.animationDuration = `${randomDuration}s`;
      flashRef.current.style.animation = `flashReflection ${randomDuration}s ease-in-out infinite`;
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  return (
    <div 
      className="bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden border-gold-elegant transition-all duration-300 hover:scale-105 hover:shadow-xl" 
      data-item-id={item.id}
    >
      {(item.videoUrl || item.imageUrl) && (
        <div ref={imageContainerRef} className="h-48 overflow-hidden relative menu-image-container">
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
          <div ref={flashRef} className="flash-overlay absolute pointer-events-none" style={{
            top: '-50%',
            left: '-200%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(135deg, transparent 0%, transparent 25%, rgba(255, 255, 255, 0.6) 42%, rgba(255, 255, 255, 0.9) 48%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.9) 52%, rgba(255, 255, 255, 0.6) 58%, transparent 75%, transparent 100%)',
            transform: 'rotate(-45deg)',
            transformOrigin: 'center center',
            animation: 'flashReflection 12s ease-in-out infinite',
            zIndex: 10,
            opacity: 0
          }}></div>
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



