import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { jsonResponse, errorResponse } from '../../lib/api-helpers';

// Función para mapear imágenes basándose en el nombre del item
function getImageUrl(itemName: string, categorySlug: string): string | null {
  const name = itemName.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');

  // Mapeo de imágenes por categoría
  const imageMap: Record<string, Record<string, string>> = {
    'entradas': {
      'hummus-con-pan': '/entradas/hummus-pan.png',
      'baba-ganoush-con-pan': '/entradas/babaGanoush-psn.png',
      'falafel-para-picar-6-und': '/entradas/falafel-6unid.png',
      'kebab-para-picar-2-unid': '/entradas/kebab-picar-2unid.png',
      'kubbeh-5-unid': '/entradas/kubben-5unid.png',
      'hojas-de-parra-vegana-o-carne-12-und': '/entradas/holasDeParra-12unid.png',
      'repollitos-vegano-o-carne-10-unid': '/entradas/repollitos-10unid.png',
    },
    'shawarma': {
      'shawarma-mixto': '/shawarmas/shawarma-mixto.png',
      'shawarma-de-pollo': '/shawarmas/shawarma-pollo.png',
      'shawarma-de-carne': '/shawarmas/shawarma-carne.png',
      'shawarma-de-falafel': '/shawarmas/shawarma-falafel.png',
    },
    'platillos': {
      'chorrillana-con-2-salsas-a-eleccion': '/platillos/chorillana.png',
      'kebbab-fajita': '/platillos/kebab-fajita.png',
      'kebbab-plato-con-arroz': '/platillos/kebbab-arroz.png',
      'kebbab-plato-con-arroz-y-papas-fritas': '/platillos/kebbab.arroz-papas.png',
      'kebbab-plato-con-papas-fritas': '/platillos/kebbab-papas.png',
      'kebbab-guisado': '/platillos/kebbab-guisado.png',
      'kubbeh-plato-con-arroz': '/platillos/kubben-arroz.png',
      'kubbeh-plato-con-arroz-y-papas-fritas': '/platillos/kubben-arroz-papas.png',
      'kubbeh-plato-con-papas-fritas': '/platillos/kubben-papas.png',
      'shawarma-al-plato-pollo-c-arroz': '/platillos/shawarma-plato-arroz.png',
      'shawarma-al-plato-pollo-c-arroz-y-papas-fritas': '/platillos/shawarma-plato-pollo-arros-papa.png',
      'shawarma-al-plato-carne-c-arroz': '/platillos/shawarma-plato-carne.png',
      'shawarma-al-plato-carne-c-arroz-y-papas-fritas': '/platillos/shawarma-plato-carne.png',
      'shawarma-al-plato-mixto-c-arroz': '/platillos/shawarma-plato-mixto.png',
      'shawarma-al-plato-mixto-c-arroz-y-papas-fritas': '/platillos/shawarma-plato-mixto.png',
      'falafel-fajita-vegano': '/platillos/falafel-fajita.png',
      'falafel-al-plato-vegano-c-arroz': '/platillos/falafel-plato-arroz-papas.png',
      'falafel-al-plato-vegano-c-arroz-y-papas-fritas': '/platillos/falafel-plato-arroz-papas.png',
      'falafel-al-plato-vegano-c-papas-fritas': '/platillos/falafel-plato-papas.png',
      'tabla-mixta-carne': '/platillos/tabla-mixta-carne.png',
      'tabla-mixta-vegana': '/platillos/tabla-mixta-vegana.png',
      'musaka': '/platillos/mukasa.png',
      'papas-fritas-individual': '/platillos/papas-personal.png',
      'papas-fritas-para-compartir': '/platillos/papas-compartir.png',
    },
    'promociones': {
      'promo-shawarma-maxi-mixto': '/platillos/promo-shawarma-para1.png',
      'promo-shawarma-duo-clasico-mixto': '/platillos/promo-shawarma-para1.png',
    },
    'menu-del-dia': {
      'pollo-a-la-plancha': '/menu-del.dia/pollo-plancha.png',
      'pollo-a-la-aceituna': '/menu-del.dia/pollo-aceituna.png',
      'pollo-a-la-ciruela': '/menu-del.dia/pollo-ciruleas.png',
      'pollo-arvejado': '/menu-del.dia/pollo-arvejado.png',
      'pollo-guisado-con-verduras': '/menu-del.dia/pollo-verduras.png',
      'pollo-al-coniac': '/menu-del.dia/pollo-coniac.png',
      'pollo-estofado': '/menu-del.dia/pollo-estofado.png',
      'tomatican-de-pollo': '/menu-del.dia/tomatican-pollo.png',
      'guisado-de-3-lentejas': '/menu-del.dia/guisado-3lentejas.png',
      'guisado-de-garbanzos': '/menu-del.dia/guisado-garbanzos.png',
      'guisado-de-berenjena': '/menu-del.dia/guisado-berenjena.png',
      'consome-individual': '/menu-del.dia/consome-arabe.png',
    },
    'menu-fin-de-ano': {
      'menu-para-2-personas': '/menu-fin-de-ano/menu-fin-ano-2pers.png',
      'menu-para-4-personas': '/menu-fin-de-ano/menu-fin-ano-4pers.png',
      'menu-para-6-personas': '/menu-fin-de-ano/menu-fin-ano-6pers.png',
      'menu-para-8-personas': '/menu-fin-de-ano/menu-fin-ano-8.png',
    },
    'acompanamiento-salsas': {
      'salsa-de-ajo': '/acompañamientos/salsa-ajo.png',
      'salsa-de-cilantro': '/acompañamientos/salsa-cilantro.png',
      'salsa-de-albahaca': '/acompañamientos/salsa-albahaca.png',
      'pimenton': '/acompañamientos/salsa-pimenton.png',
      'albahaca': '/acompañamientos/salsa-albahaca.png',
      'yogurt': '/acompañamientos/salsa-yogurt.png',
      'aji-de-oro': '/acompañamientos/salsa-aji-oro.png',
    },
    'bebestibles': {
      'tetera-de-te-verde': '/bebestibles/te-verde.png',
      'tetera-de-te-jamaica-karkade': '/bebestibles/te-karkade.png',
      'cafe-tradicional': '/bebestibles/cafe-tradicional.png',
      'cafe-arabe': '/bebestibles/cafe-arabe.png',
      'cafe-cardamomo': '/bebestibles/cafe-cardamomo.png',
      'bebidas-lata-variedad': '/bebestibles/bebidas-lata.png',
      'agua-mineral-con-gas': '/bebestibles/bebida-agua-gas.png',
      'agua-mineral-sin-gas': '/bebestibles/bebida-agua-sin-gas.png',
      'jugos-naturales-variedad': '/bebestibles/jugos-temporada.png',
      'jugos-natural': '/bebestibles/jugos-temporada.png',
      'limonada': '/bebestibles/jugos-temporada.png',
      'jugos-watt': '/bebestibles/jugos-watts.png',
    },
    'postres': {
      'ceregli': '/postres/postre-ceregli.png',
      'postre-surtido': '/postres/postre-surtido.png',
    },
  };

  const categoryMap = imageMap[categorySlug];
  if (!categoryMap) return null;

  // Buscar coincidencia exacta o parcial
  for (const [key, imagePath] of Object.entries(categoryMap)) {
    if (name.includes(key) || key.includes(name)) {
      return imagePath;
    }
  }

  return null;
}

// Categorías del menú
const categories = [
  { name: 'Entradas', slug: 'entradas', order_num: 1, description: 'Deliciosas entradas árabes para comenzar' },
  { name: 'Shawarma', slug: 'shawarma', order_num: 2, description: 'Nuestros famosos shawarmas en pan árabe' },
  { name: 'Platillos', slug: 'platillos', order_num: 3, description: 'Platos principales árabes' },
  { name: 'Promociones', slug: 'promociones', order_num: 4, description: 'Ofertas especiales' },
  { name: 'Menú del Día', slug: 'menu-del-dia', order_num: 5, description: 'Platos del día con acompañamiento' },
  { name: 'Menú Fin de Año', slug: 'menu-fin-de-ano', order_num: 6, description: '🎄 Menús especiales para compartir' },
  { name: 'Acompañamiento - Salsas', slug: 'acompanamiento-salsas', order_num: 7, description: 'Salsas caseras' },
  { name: 'Bebestibles', slug: 'bebestibles', order_num: 8, description: 'Bebidas y tés' },
  { name: 'Postres', slug: 'postres', order_num: 9, description: 'Dulces árabes tradicionales' },
];

// Items del menú COMPLETO con imágenes
const menuItems = [
  // ==================== ENTRADAS ====================
  { name: 'Hummus con Pan', description: 'Cremoso hummus tradicional servido con pan árabe fresco', price: 4500, categorySlug: 'entradas', order_num: 1, imageUrl: '/entradas/hummus-pan.png' },
  { name: 'Baba Ganoush con Pan', description: 'Berenjena ahumada con tahini y especias', price: 4500, categorySlug: 'entradas', order_num: 2, imageUrl: '/entradas/babaGanoush-psn.png' },
  { name: 'Falafel para Picar (6 und.)', description: 'Croquetas de garbanzos fritas, crujientes por fuera y suaves por dentro', price: 5000, categorySlug: 'entradas', order_num: 3, imageUrl: '/entradas/falafel-6unid.png' },
  { name: 'Kebab para Picar (2 unid.)', description: 'Brochetas de carne marinada y especiada', price: 6000, categorySlug: 'entradas', order_num: 4, imageUrl: '/entradas/kebab-picar-2unid.png' },
  { name: 'Kubbeh (5 unid.)', description: 'Croquetas de trigo bulgur rellenas de carne y especias', price: 5500, categorySlug: 'entradas', order_num: 5, imageUrl: '/entradas/kubben-5unid.png' },
  { name: 'Hojas de Parra - Vegana ó Carne (12 und.)', description: 'Hojas de parra rellenas, disponibles en versión vegana o con carne', price: 5500, categorySlug: 'entradas', order_num: 6, imageUrl: '/entradas/holasDeParra-12unid.png' },
  { name: 'Repollitos - Vegano ó Carne (10 unid.)', description: 'Repollitos rellenos, opción vegana o con carne', price: 5500, categorySlug: 'entradas', order_num: 7, imageUrl: '/entradas/repollitos-10unid.png' },

  // ==================== SHAWARMA ====================
  { name: 'Shawarma Mixto', description: 'Pan árabe con pollo + carne (vacuno) + vegetales, 1 salsa a elección', price: 8000, categorySlug: 'shawarma', order_num: 1, imageUrl: '/shawarmas/shawarma-mixto.png' },
  { name: 'Shawarma de Pollo', description: 'Pan árabe con pollo + vegetales, 1 salsa a elección', price: 7500, categorySlug: 'shawarma', order_num: 2, imageUrl: '/shawarmas/shawarma-pollo.png' },
  { name: 'Shawarma de Carne', description: 'Pan árabe con carne (vacuno) + vegetales, 1 salsa a elección', price: 10000, categorySlug: 'shawarma', order_num: 3, imageUrl: '/shawarmas/shawarma-carne.png' },
  { name: 'Shawarma de Falafel', description: 'Pan árabe con falafel + vegetales, 1 salsa a elección', price: 7500, categorySlug: 'shawarma', order_num: 4, imageUrl: '/shawarmas/shawarma-falafel.png' },

  // ==================== PLATILLOS ====================
  { name: 'Chorrillana (con 2 salsas a elección)', description: 'Plato abundante estilo chorrillana con ingredientes árabes', price: 15000, categorySlug: 'platillos', order_num: 1, imageUrl: '/platillos/chorillana.png' },
  { name: 'Kebbab - Fajita', description: 'Kebbab servido en fajita', price: 8500, categorySlug: 'platillos', order_num: 2, imageUrl: '/platillos/kebab-fajita.png' },
  { name: 'Kebbab - Plato con Arroz', description: 'Kebbab al plato con arroz árabe', price: 9500, categorySlug: 'platillos', order_num: 3, imageUrl: '/platillos/kebbab-arroz.png' },
  { name: 'Kebbab - Plato con Arroz y Papas Fritas', description: 'Kebbab al plato con arroz árabe y papas fritas', price: 10500, categorySlug: 'platillos', order_num: 4, imageUrl: '/platillos/kebbab.arroz-papas.png' },
  { name: 'Kebbab - Plato con Papas Fritas', description: 'Kebbab al plato con papas fritas', price: 9500, categorySlug: 'platillos', order_num: 5, imageUrl: '/platillos/kebbab-papas.png' },
  { name: 'Kebbab Guisado', description: 'Kebbab guisado con salsa especial', price: 10000, categorySlug: 'platillos', order_num: 6, imageUrl: '/platillos/kebbab-guisado.png' },
  { name: 'Kubbeh - Plato con Arroz', description: 'Kubbeh al plato con arroz árabe', price: 9500, categorySlug: 'platillos', order_num: 7, imageUrl: '/platillos/kubben-arroz.png' },
  { name: 'Kubbeh - Plato con Arroz y Papas Fritas', description: 'Kubbeh al plato con arroz árabe y papas fritas', price: 10500, categorySlug: 'platillos', order_num: 8, imageUrl: '/platillos/kubben-arroz-papas.png' },
  { name: 'Kubbeh - Plato con Papas Fritas', description: 'Kubbeh al plato con papas fritas', price: 9500, categorySlug: 'platillos', order_num: 9, imageUrl: '/platillos/kubben-papas.png' },
  { name: 'Shawarma - Al Plato (Pollo c/ Arroz)', description: 'Shawarma de pollo al plato con arroz árabe', price: 9500, categorySlug: 'platillos', order_num: 10, imageUrl: '/platillos/shawarma-plato-arroz.png' },
  { name: 'Shawarma - Al Plato (Pollo c/ Arroz y Papas Fritas)', description: 'Shawarma de pollo al plato con arroz y papas fritas', price: 10500, categorySlug: 'platillos', order_num: 11, imageUrl: '/platillos/shawarma-plato-pollo-arros-papa.png' },
  { name: 'Shawarma - Al Plato (Carne c/ Arroz)', description: 'Shawarma de carne al plato con arroz árabe', price: 10500, categorySlug: 'platillos', order_num: 12, imageUrl: '/platillos/shawarma-plato-carne.png' },
  { name: 'Shawarma - Al Plato (Carne c/ Arroz y Papas Fritas)', description: 'Shawarma de carne al plato con arroz y papas fritas', price: 11500, categorySlug: 'platillos', order_num: 13, imageUrl: '/platillos/shawarma-plato-carne.png' },
  { name: 'Shawarma - Al Plato (Mixto c/ Arroz)', description: 'Shawarma mixto al plato con arroz árabe', price: 10500, categorySlug: 'platillos', order_num: 14, imageUrl: '/platillos/shawarma-plato-mixto.png' },
  { name: 'Shawarma - Al Plato (Mixto c/ Arroz y Papas Fritas)', description: 'Shawarma mixto al plato con arroz y papas fritas', price: 11500, categorySlug: 'platillos', order_num: 15, imageUrl: '/platillos/shawarma-plato-mixto.png' },
  { name: 'Falafel - Fajita Vegano', description: 'Falafel servido en fajita, opción vegana', price: 7500, categorySlug: 'platillos', order_num: 16, imageUrl: '/platillos/falafel-fajita.png' },
  { name: 'Falafel - Al Plato Vegano (c/ Arroz)', description: 'Falafel al plato con arroz árabe', price: 8500, categorySlug: 'platillos', order_num: 17, imageUrl: '/platillos/falafel-plato-arroz-papas.png' },
  { name: 'Falafel - Al Plato Vegano (c/ Arroz y Papas Fritas)', description: 'Falafel al plato con arroz y papas fritas', price: 9500, categorySlug: 'platillos', order_num: 18, imageUrl: '/platillos/falafel-plato-arroz-papas.png' },
  { name: 'Falafel - Al Plato Vegano (c/ Papas Fritas)', description: 'Falafel al plato con papas fritas', price: 8500, categorySlug: 'platillos', order_num: 19, imageUrl: '/platillos/falafel-plato-papas.png' },
  { name: 'Tabla Mixta - Carne', description: 'Variedad de carnes árabes para compartir', price: 18000, categorySlug: 'platillos', order_num: 20, imageUrl: '/platillos/tabla-mixta-carne.png' },
  { name: 'Tabla Mixta - Vegana', description: 'Variedad de opciones veganas para compartir', price: 16000, categorySlug: 'platillos', order_num: 21, imageUrl: '/platillos/tabla-mixta-vegana.png' },
  { name: 'Musaka', description: 'Tradicional musaka árabe', price: 9500, categorySlug: 'platillos', order_num: 22, imageUrl: '/platillos/mukasa.png' },
  { name: 'Papas Fritas (Individual)', description: 'Porción individual de papas fritas', price: 3500, categorySlug: 'platillos', order_num: 23, imageUrl: '/platillos/papas-personal.png' },
  { name: 'Papas Fritas (Para Compartir)', description: 'Porción grande de papas fritas para compartir', price: 5500, categorySlug: 'platillos', order_num: 24, imageUrl: '/platillos/papas-compartir.png' },
  { name: 'Especial del Día', description: 'Consultar el especial del día', price: 0, categorySlug: 'platillos', order_num: 25 },
  { name: 'Postre del Día', description: 'Consultar el postre del día', price: 0, categorySlug: 'platillos', order_num: 26 },

  // ==================== PROMOCIONES ====================
  { name: 'Promo Shawarma Maxi Mixto', description: 'Para 1 persona. Pan árabe (27cm), pollo + carne + vegetales, 2 falafel, 2 salsas, 1 papas fritas pequeñas', price: 13000, categorySlug: 'promociones', order_num: 1, is_featured: true, imageUrl: '/platillos/promo-shawarma-para1.png' },
  { name: 'Promo Shawarma Duo Clásico Mixto', description: 'Para 2 personas. 2 Shawarma mixto (24cm), 4 falafel, 2 salsas, 1 papas fritas, 2 bebidas a elección', price: 23990, categorySlug: 'promociones', order_num: 2, is_featured: true, imageUrl: '/platillos/promo-shawarma-para1.png' },

  // ==================== MENÚ DEL DÍA ====================
  { name: 'Pollo a la Plancha', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 1, imageUrl: '/menu-del.dia/pollo-plancha.png' },
  { name: 'Pollo a la Aceituna', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 2, imageUrl: '/menu-del.dia/pollo-aceituna.png' },
  { name: 'Pollo a la Ciruela', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 3, imageUrl: '/menu-del.dia/pollo-ciruleas.png' },
  { name: 'Pollo Arvejado', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 4, imageUrl: '/menu-del.dia/pollo-arvejado.png' },
  { name: 'Pollo Guisado con Verduras', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 5, imageUrl: '/menu-del.dia/pollo-verduras.png' },
  { name: 'Pollo al Coñac', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 6, imageUrl: '/menu-del.dia/pollo-coniac.png' },
  { name: 'Pollo Estofado', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 7, imageUrl: '/menu-del.dia/pollo-estofado.png' },
  { name: 'Tomaticán de Pollo', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 8, imageUrl: '/menu-del.dia/tomatican-pollo.png' },
  { name: 'Guisado de 3 Lentejas', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 9, imageUrl: '/menu-del.dia/guisado-3lentejas.png' },
  { name: 'Guisado de Garbanzos', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 10, imageUrl: '/menu-del.dia/guisado-garbanzos.png' },
  { name: 'Guisado de Berenjena', description: 'Con consomé, arroz árabe o cuscús o papas fritas o papas rústicas, postre y té árabe', price: 6900, categorySlug: 'menu-del-dia', order_num: 11, imageUrl: '/menu-del.dia/guisado-berenjena.png' },
  { name: 'Consomé Individual', description: 'Consomé árabe tradicional por separado', price: 2000, categorySlug: 'menu-del-dia', order_num: 12, imageUrl: '/menu-del.dia/consome-arabe.png' },

  // ==================== MENÚ FIN DE AÑO 🎄 ====================
  { 
    name: '🎄 Menú para 2 personas', 
    description: 'Entrada: 12 Falafel | Fondo: 12 hojas de Parra, 5 repollitos rellenos, 5 papas rellenas, 2 salsas a elección | Postre: 4 dulces árabes', 
    price: 31990, 
    categorySlug: 'menu-fin-de-ano', 
    order_num: 1,
    is_featured: true,
    imageUrl: '/menu-fin-de-ano/menu-fin-ano-2pers.png'
  },
  { 
    name: '🎄 Menú para 4 personas', 
    description: 'Entrada: 12 Falafel | Fondo: 24 hojas de Parra, 4 repollitos rellenos, 4 papas rellenas, 4 zapallitos rellenos, 3 salsas a elección | Postre: 8 dulces árabes', 
    price: 46990, 
    categorySlug: 'menu-fin-de-ano', 
    order_num: 2,
    is_featured: true,
    imageUrl: '/menu-fin-de-ano/menu-fin-ano-4pers.png'
  },
  { 
    name: '🎄 Menú para 6 personas', 
    description: 'Entrada: 12 Falafel | Fondo: 24 hojas de Parra, 6 repollitos rellenos, 6 papas rellenas, 6 zapallitos rellenos, 4 salsas a elección | Postre: 12 dulces árabes', 
    price: 60990, 
    categorySlug: 'menu-fin-de-ano', 
    order_num: 3,
    is_featured: true,
    imageUrl: '/menu-fin-de-ano/menu-fin-ano-6pers.png'
  },
  { 
    name: '🎄 Menú para 8 personas', 
    description: 'Entrada: 8 Falafel, 8 Kubbe | Fondo: 16 hojas de Parra, 8 repollitos rellenos, 8 papas rellenas, 8 zapallitos rellenos, 4 ajíes rellenos, 4 pimentón rellenos, 4 salsas a elección | Postre: 16 dulces árabes', 
    price: 82990, 
    categorySlug: 'menu-fin-de-ano', 
    order_num: 4,
    is_featured: true,
    imageUrl: '/menu-fin-de-ano/menu-fin-ano-8.png'
  },

  // ==================== SALSAS ====================
  { name: 'Salsa de Ajo', description: 'Salsa cremosa de ajo', price: 1500, categorySlug: 'acompanamiento-salsas', order_num: 1, imageUrl: '/acompañamientos/salsa-ajo.png' },
  { name: 'Salsa de Cilantro', description: 'Salsa fresca de cilantro', price: 1500, categorySlug: 'acompanamiento-salsas', order_num: 2, imageUrl: '/acompañamientos/salsa-cilantro.png' },
  { name: 'Salsa de Albahaca', description: 'Salsa aromática de albahaca', price: 1500, categorySlug: 'acompanamiento-salsas', order_num: 3, imageUrl: '/acompañamientos/salsa-albahaca.png' },
  { name: 'Pimentón', description: 'Salsa de pimentón', price: 1500, categorySlug: 'acompanamiento-salsas', order_num: 4, imageUrl: '/acompañamientos/salsa-pimenton.png' },
  { name: 'Albahaca', description: 'Salsa de albahaca', price: 1500, categorySlug: 'acompanamiento-salsas', order_num: 5, imageUrl: '/acompañamientos/salsa-albahaca.png' },
  { name: 'Yogurt', description: 'Salsa de yogurt', price: 1500, categorySlug: 'acompanamiento-salsas', order_num: 6, imageUrl: '/acompañamientos/salsa-yogurt.png' },
  { name: 'Ají de Oro', description: 'Salsa de ají de oro', price: 1500, categorySlug: 'acompanamiento-salsas', order_num: 7, imageUrl: '/acompañamientos/salsa-aji-oro.png' },

  // ==================== BEBESTIBLES ====================
  { name: 'Tetera de Té Verde', description: 'Té verde aromático servido en tetera tradicional', price: 3000, categorySlug: 'bebestibles', order_num: 1, imageUrl: '/bebestibles/te-verde.png' },
  { name: 'Tetera de Té Jamaica (Karkadé)', description: 'Té de Jamaica refrescante servido en tetera', price: 3000, categorySlug: 'bebestibles', order_num: 2, imageUrl: '/bebestibles/te-karkade.png' },
  { name: 'Café Tradicional', description: 'Café tradicional', price: 2000, categorySlug: 'bebestibles', order_num: 3, imageUrl: '/bebestibles/cafe-tradicional.png' },
  { name: 'Café Árabe', description: 'Café árabe tradicional preparado a la manera del medio oriente', price: 2500, categorySlug: 'bebestibles', order_num: 4, imageUrl: '/bebestibles/cafe-arabe.png' },
  { name: 'Café Cardamomo', description: 'Café árabe con cardamomo, especiado y aromático', price: 2500, categorySlug: 'bebestibles', order_num: 5, imageUrl: '/bebestibles/cafe-cardamomo.png' },
  { name: 'Bebidas Lata (Variedad)', description: 'Variedad de bebidas en lata', price: 1500, categorySlug: 'bebestibles', order_num: 6, imageUrl: '/bebestibles/bebidas-lata.png' },
  { name: 'Agua Mineral con Gas', description: 'Agua mineral con gas', price: 1500, categorySlug: 'bebestibles', order_num: 7, imageUrl: '/bebestibles/bebida-agua-gas.png' },
  { name: 'Agua Mineral sin Gas', description: 'Agua mineral sin gas', price: 1500, categorySlug: 'bebestibles', order_num: 8, imageUrl: '/bebestibles/bebida-agua-sin-gas.png' },
  { name: 'Jugos Naturales (Fruta de la temporada)', description: 'Jugos naturales frescos de fruta de la temporada', price: 2500, categorySlug: 'bebestibles', order_num: 9, imageUrl: '/bebestibles/jugos-temporada.png' },
  { name: 'Limonada (Menta, Jengibre y otras)', description: 'Limonada refrescante con menta, jengibre y otras hierbas', price: 2500, categorySlug: 'bebestibles', order_num: 10, imageUrl: '/bebestibles/jugos-temporada.png' },
  { name: 'Jugos Watt SIN AZUCAR (Papayas, Naranja Valenciana y otros)', description: 'Jugos Watt naturales sin azúcar añadida. Sabores: Papayas, Naranja Valenciana y otros', price: 2500, categorySlug: 'bebestibles', order_num: 11, imageUrl: '/bebestibles/jugos-watts.png' },

  // ==================== POSTRES ====================
  { name: 'Ceregli - Caja 4 unid.', description: 'Dulces árabes tradicionales. Caja con 4 unidades', price: 12000, categorySlug: 'postres', order_num: 1, imageUrl: '/postres/postre-ceregli.png' },
  { name: 'Ceregli - 1 unidad', description: 'Dulce árabe tradicional. 1 unidad', price: 3500, categorySlug: 'postres', order_num: 2, imageUrl: '/postres/postre-ceregli.png' },
  { name: 'Postre Surtido - Caja 10 unid.', description: 'Variedad de dulces árabes. Caja con 10 unidades', price: 12000, categorySlug: 'postres', order_num: 3, imageUrl: '/postres/postre-surtido.png' },
  { name: 'Postre Surtido - 1 unidad', description: 'Dulce árabe surtido. 1 unidad', price: 1500, categorySlug: 'postres', order_num: 4, imageUrl: '/postres/postre-surtido.png' },
];

export const GET: APIRoute = async () => {
  try {
    const results: any = {
      categories: { created: 0, updated: 0, errors: [] },
      items: { created: 0, updated: 0, skipped: 0, errors: [] },
    };

    // 1. Obtener categorías existentes
    console.log('📁 Procesando categorías...');
    const { data: existingCats } = await supabase
      .from('categories')
      .select('id, slug, name');
    
    const existingCatsMap = new Map<string, any>();
    if (existingCats) {
      existingCats.forEach(cat => existingCatsMap.set(cat.slug, cat));
    }

    // 2. Crear o actualizar categorías (UPSERT)
    const categoryMap = new Map<string, number>();

    for (const cat of categories) {
      const existing = existingCatsMap.get(cat.slug);
      
      if (existing) {
        // Categoría existe, actualizar (pero mantener is_active si ya está activa)
        const { data, error } = await supabase
          .from('categories')
          .update({
            name: cat.name,
            description: cat.description,
            order_num: cat.order_num,
            // NO sobrescribir is_active si ya existe
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          console.error(`Error actualizando categoría ${cat.name}:`, error);
          results.categories.errors.push({ name: cat.name, error: error.message });
        } else if (data) {
          categoryMap.set(cat.slug, data.id);
          results.categories.updated++;
          console.log(`🔄 Categoría actualizada: ${cat.name} (ID: ${data.id})`);
        }
      } else {
        // Categoría nueva, crear
        const { data, error } = await supabase
          .from('categories')
          .insert([{
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            order_num: cat.order_num,
            is_active: true,
          }])
          .select()
          .single();

        if (error) {
          console.error(`Error creando categoría ${cat.name}:`, error);
          results.categories.errors.push({ name: cat.name, error: error.message });
        } else if (data) {
          categoryMap.set(cat.slug, data.id);
          results.categories.created++;
          console.log(`✅ Categoría creada: ${cat.name} (ID: ${data.id})`);
        }
      }
    }

    // 3. Obtener items existentes para verificar precios
    console.log('🍽️ Procesando items del menú...');
    const { data: existingItems } = await supabase
      .from('menu_items')
      .select('id, name, category_id, price');
    
    const existingItemsMap = new Map<string, any>();
    if (existingItems) {
      existingItems.forEach(item => {
        // Usar nombre + category_id como clave única
        const key = `${item.name.toLowerCase().trim()}_${item.category_id}`;
        existingItemsMap.set(key, item);
      });
    }
    
    for (const item of menuItems) {
      const categoryId = categoryMap.get(item.categorySlug);
      
      if (!categoryId) {
        results.items.errors.push({ name: item.name, error: `Categoría ${item.categorySlug} no encontrada` });
        continue;
      }

      // Usar imageUrl del item o intentar mapear automáticamente
      const imageUrl = (item as any).imageUrl || getImageUrl(item.name, item.categorySlug);
      
      // Verificar si el item ya existe
      const itemKey = `${item.name.toLowerCase().trim()}_${categoryId}`;
      const existing = existingItemsMap.get(itemKey);

      if (existing) {
        // Item existe: actualizar TODO EXCEPTO el precio (respetar precio de la BD)
        const { data, error } = await supabase
          .from('menu_items')
          .update({
            description: item.description,
            // price: NO ACTUALIZAR - mantener el precio existente de la BD
            image_url: imageUrl || existing.image_url, // Actualizar imagen solo si hay nueva
            order_num: item.order_num,
            is_available: true, // Mantener disponible
            is_featured: (item as any).is_featured || false,
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          console.error(`Error actualizando item ${item.name}:`, error);
          results.items.errors.push({ name: item.name, error: error.message });
        } else {
          results.items.updated++;
          console.log(`🔄 ${item.name} - Precio preservado: $${existing.price} (ID: ${existing.id})`);
        }
      } else {
        // Item nuevo: crear con precio del seed
        const { data, error } = await supabase
          .from('menu_items')
          .insert([{
            name: item.name,
            description: item.description,
            price: item.price,
            category_id: categoryId,
            image_url: imageUrl,
            order_num: item.order_num,
            is_available: true,
            is_featured: (item as any).is_featured || false,
          }])
          .select()
          .single();

        if (error) {
          console.error(`Error creando item ${item.name}:`, error);
          results.items.errors.push({ name: item.name, error: error.message });
        } else {
          results.items.created++;
          if (imageUrl) {
            console.log(`✅ ${item.name} - Precio: $${item.price} - Imagen: ${imageUrl}`);
          } else {
            console.log(`✅ ${item.name} - Precio: $${item.price}`);
          }
        }
      }
    }

    console.log('✅ Seed completado!');

    return jsonResponse({
      success: true,
      message: '✅ Menú actualizado correctamente - PRECIOS EXISTENTES PRESERVADOS',
      results: {
        categories: `${results.categories.created} creadas, ${results.categories.updated} actualizadas`,
        items: `${results.items.created} creados, ${results.items.updated} actualizados (precios preservados)`,
        itemsWithImages: menuItems.filter(i => (i as any).imageUrl || getImageUrl(i.name, i.categorySlug)).length,
        errors: results.categories.errors.length + results.items.errors.length > 0 
          ? [...results.categories.errors, ...results.items.errors]
          : 'Ninguno'
      },
      categorias_creadas: categories.map(c => c.name),
      next_step: 'Visita / para ver el menú con imágenes o /admin para administrarlo',
      importante: '⚠️ Los precios editados en el admin panel NO fueron sobrescritos'
    });

  } catch (error: any) {
    console.error('Error en seed:', error);
    return errorResponse('Error: ' + (error.message || 'Desconocido'), 500);
  }
};
