import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface NavigationMenuProps {
  categories: Category[];
  currentSlug?: string;
}

export default function NavigationMenu({ categories, currentSlug }: NavigationMenuProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/90 backdrop-blur-md shadow-lg border-b border-gold-600/30 transform ${
        isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        {/* Logo pequeño y título */}
        <div className="flex items-center justify-between mb-1.5">
          <a
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo-cropped.png"
              alt="Gourmet Árabe"
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
            <span className="font-cinzel text-gold-400 text-base md:text-lg font-semibold hidden sm:block">
              GOURMET ÁRABE
            </span>
          </a>
          <a
            href="/print"
            className="text-gold-400/70 hover:text-gold-400 text-xs font-semibold px-3 py-1 border border-gold-600/40 rounded hover:border-gold-600 transition-colors"
            title="Versión imprimible"
          >
            📄 Imprimir
          </a>
        </div>

        {/* Menú horizontal con scroll */}
        <div className="relative group">
          <div 
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="flex gap-2 pb-1" style={{ minWidth: 'max-content' }}>
              {categories.map((category) => {
                const isActive = currentSlug === category.slug;
                return (
                  <a
                    key={category.id}
                    href={`/${category.slug}`}
                    className={`
                      flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-semibold
                      transition-all duration-200 whitespace-nowrap
                      ${
                        isActive
                          ? 'bg-gold-600 text-black shadow-md shadow-gold-600/40 scale-105'
                          : 'bg-gold-600/10 text-gold-300/90 border border-gold-600/20 hover:bg-gold-600/25 hover:border-gold-600/40 hover:text-gold-200'
                      }
                    `}
                  >
                    {category.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
}

