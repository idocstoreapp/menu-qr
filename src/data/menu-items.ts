// Archivo estático con todos los items del menú
// Solo se pueden editar los precios desde el panel admin

export interface StaticMenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  order: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  imageUrl?: string;
  videoUrl?: string;
}

// IDs de categorías (deben coincidir con la base de datos)
// 1: entradas, 2: desayunos, 3: shawarma, 4: menu-del-dia, 5: menus-combinados, 6: promociones, 7: acompanamiento-salsas, 8: bebestibles

export const staticMenuItems: StaticMenuItem[] = [
  // Entradas (categoryId: 1)
  { id: 1, name: 'Hummus con Pan', description: 'Cremoso hummus tradicional servido con pan árabe fresco', price: 0, categoryId: 1, order: 1, isAvailable: true },
  { id: 2, name: 'Baba Ganoush con Pan', description: 'Berenjena ahumada con tahini y especias', price: 0, categoryId: 1, order: 2, isAvailable: true },
  { id: 3, name: 'Falafel para Picar (6 und.)', description: 'Croquetas de garbanzos fritas, crujientes por fuera y suaves por dentro', price: 0, categoryId: 1, order: 3, isAvailable: true },
  { id: 4, name: 'Kebab para Picar (2 unidades)', description: 'Brochetas de carne marinada y especiada', price: 0, categoryId: 1, order: 4, isAvailable: true },
  { id: 5, name: 'Kubbeh (5 unid.)', description: 'Croquetas de trigo bulgur rellenas de carne y especias', price: 0, categoryId: 1, order: 5, isAvailable: true },
  { id: 6, name: 'Hojas de Parra - Vegana ó Carne (12 und.)', description: 'Hojas de parra rellenas, disponibles en versión vegana o con carne', price: 0, categoryId: 1, order: 6, isAvailable: true },
  { id: 7, name: 'Repollitos - Vegano ó Carne (10 unid.)', description: 'Repollitos rellenos, opción vegana o con carne', price: 0, categoryId: 1, order: 7, isAvailable: true },

  // Shawarma (categoryId: 3)
  { id: 8, name: 'Shawarma Mixto', description: 'Pan árabe con pollo + carne (vacuno) + vegetales, 1 salsa a elección', price: 8000, categoryId: 3, order: 1, isAvailable: true },
  { id: 9, name: 'Shawarma de Pollo', description: 'Pan árabe con pollo + vegetales, 1 salsa a elección', price: 7500, categoryId: 3, order: 2, isAvailable: true },
  { id: 10, name: 'Shawarma de Carne', description: 'Pan árabe con carne (vacuno) + vegetales, 1 salsa a elección', price: 10000, categoryId: 3, order: 3, isAvailable: true },
  { id: 11, name: 'Shawarma de Falafel', description: 'Pan árabe con falafel + vegetales, 1 salsa a elección', price: 7500, categoryId: 3, order: 4, isAvailable: true },

  // Promociones (categoryId: 6)
  { id: 12, name: 'Promo Shawarma Maxi Mixto', description: 'Para 1 persona. Pan árabe (27cm), pollo + carne (vacuno) + vegetales, 2 falafel, 2 salsas, 1 papas fritas pequeñas', price: 13000, categoryId: 6, order: 1, isAvailable: true, isFeatured: true },
  { id: 13, name: 'Promo Shawarma Duo Clásico Mixto', description: 'Para 2 personas. Pan árabe (24cm), pollo + carne (vacuno) + vegetales, 4 falafel, 2 salsas, 1 papas fritas pequeñas, 2 bebidas a elección', price: 23990, categoryId: 6, order: 2, isAvailable: true, isFeatured: true },

  // Menú del Día - Pollo (categoryId: 4)
  { id: 14, name: 'Pollo a la Plancha', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: 4, order: 1, isAvailable: true },
  { id: 15, name: 'Pollo a la Aceituna', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: 4, order: 2, isAvailable: true },
  { id: 16, name: 'Pollo a la Ciruela', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: 4, order: 3, isAvailable: true },
  { id: 17, name: 'Pollo Arvejado', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: 4, order: 4, isAvailable: true },
  { id: 18, name: 'Pollo Guisado de Verduras', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: 4, order: 5, isAvailable: true },
  { id: 19, name: 'Tomatican de Pollo', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: 4, order: 6, isAvailable: true },

  // Menú del Día - Guisos (categoryId: 4)
  { id: 20, name: 'Guisado de Lentejas', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: 4, order: 7, isAvailable: true },
  { id: 21, name: 'Guisado de Garbanzos', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: 4, order: 8, isAvailable: true },
  { id: 22, name: 'Guisado de Berenjena', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: 4, order: 9, isAvailable: true },
  { id: 23, name: 'Consomé Individual', description: 'Consomé por separado', price: 2000, categoryId: 4, order: 10, isAvailable: true },

  // Acompañamiento - Salsas (categoryId: 7)
  { id: 24, name: 'Salsa de Ajo', description: 'Salsa cremosa de ajo', price: 0, categoryId: 7, order: 1, isAvailable: true },
  { id: 25, name: 'Salsa de Cilantro', description: 'Salsa fresca de cilantro', price: 0, categoryId: 7, order: 2, isAvailable: true },
  { id: 26, name: 'Salsa de Albahaca', description: 'Salsa aromática de albahaca', price: 0, categoryId: 7, order: 3, isAvailable: true },

  // Bebestibles (categoryId: 8)
  { id: 27, name: 'Tetera de Té Verde', description: 'Té verde aromático servido en tetera tradicional', price: 0, categoryId: 8, order: 1, isAvailable: true },
  { id: 28, name: 'Tetera de Té Jamaica', description: 'Té de jamaica refrescante servido en tetera', price: 0, categoryId: 8, order: 2, isAvailable: true },
  { id: 29, name: 'Café Tradicional', description: 'Café árabe tradicional preparado a la manera clásica', price: 0, categoryId: 8, order: 3, isAvailable: true },
  { id: 30, name: 'Café Cardamomo', description: 'Café árabe con cardamomo, especiado y aromático', price: 0, categoryId: 8, order: 4, isAvailable: true },
  { id: 31, name: 'Bebidas Lata (Variedad)', description: 'Variedad de bebidas en lata', price: 0, categoryId: 8, order: 5, isAvailable: true },
  { id: 32, name: 'Agua Mineral con Gas', description: 'Agua mineral con gas', price: 0, categoryId: 8, order: 6, isAvailable: true },
  { id: 33, name: 'Agua Mineral sin Gas', description: 'Agua mineral sin gas', price: 0, categoryId: 8, order: 7, isAvailable: true },
  { id: 34, name: 'Jugos Naturales (Variedad de Sabores)', description: 'Jugos naturales frescos en variedad de sabores', price: 0, categoryId: 8, order: 8, isAvailable: true },
];

