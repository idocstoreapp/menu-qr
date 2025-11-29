// Script para poblar la base de datos con datos iniciales del menú
import { db } from '../db/index';
import { menuItems, categories, comboMenus, dailyMenu } from '../db/schema';
import { initDatabase } from '../db/index';

export async function seedData(forceClean: boolean = false) {
  await initDatabase();
  
  // Verificar si ya hay datos
  const existingItemsCheck = await db.select().from(menuItems).limit(1);
  const hasData = existingItemsCheck.length > 0;
  
  // Solo limpiar si se fuerza o si no hay datos
  if (forceClean || !hasData) {
    if (forceClean && hasData) {
      console.log('🧹 Limpiando datos existentes (modo forzado)...');
      try {
        await db.delete(menuItems);
        await db.delete(comboMenus);
        console.log('✅ Datos anteriores eliminados');
      } catch (error) {
        console.log('⚠️ Error eliminando datos:', error);
      }
    } else if (hasData) {
      console.log('ℹ️ Ya hay datos en la base de datos. Usa forceClean=true para reemplazarlos.');
      return;
    }
  }
  
  // Obtener categorías
  const cats = await db.select().from(categories);
  const catMap: Record<string, number> = {};
  cats.forEach(cat => {
    catMap[cat.slug] = cat.id;
  });
  
  if (Object.keys(catMap).length === 0) {
    console.error('❌ No se encontraron categorías. Asegúrate de que las categorías estén creadas.');
    return;
  }
  
  console.log('📦 Categorías encontradas:', Object.keys(catMap).length);

  // Items del menú basados en las imágenes
  const items = [
    // Entradas
    { name: 'Hummus con Pan', description: 'Cremoso hummus tradicional servido con pan árabe fresco', price: 0, categoryId: catMap['entradas'], order: 1 },
    { name: 'Baba Ganoush con Pan', description: 'Berenjena ahumada con tahini y especias', price: 0, categoryId: catMap['entradas'], order: 2 },
    { name: 'Falafel para Picar (6 und.)', description: 'Croquetas de garbanzos fritas, crujientes por fuera y suaves por dentro', price: 0, categoryId: catMap['entradas'], order: 3 },
    { name: 'Kebab para Picar (2 unidades)', description: 'Brochetas de carne marinada y especiada', price: 0, categoryId: catMap['entradas'], order: 4 },
    { name: 'Kubbeh (5 unid.)', description: 'Croquetas de trigo bulgur rellenas de carne y especias', price: 0, categoryId: catMap['entradas'], order: 5 },
    { name: 'Hojas de Parra - Vegana ó Carne (12 und.)', description: 'Hojas de parra rellenas, disponibles en versión vegana o con carne', price: 0, categoryId: catMap['entradas'], order: 6 },
    { name: 'Repollitos - Vegano ó Carne (10 unid.)', description: 'Repollitos rellenos, opción vegana o con carne', price: 0, categoryId: catMap['entradas'], order: 7 },

    // Shawarma Individual
    { name: 'Shawarma Mixto', description: 'Pan árabe con pollo + carne (vacuno) + vegetales, 1 salsa a elección', price: 8000, categoryId: catMap['shawarma'], order: 1 },
    { name: 'Shawarma de Pollo', description: 'Pan árabe con pollo + vegetales, 1 salsa a elección', price: 7500, categoryId: catMap['shawarma'], order: 2 },
    { name: 'Shawarma de Carne', description: 'Pan árabe con carne (vacuno) + vegetales, 1 salsa a elección', price: 10000, categoryId: catMap['shawarma'], order: 3 },
    { name: 'Shawarma de Falafel', description: 'Pan árabe con falafel + vegetales, 1 salsa a elección', price: 7500, categoryId: catMap['shawarma'], order: 4 },

    // Promociones Shawarma
    { name: 'Promo Shawarma Maxi Mixto', description: 'Para 1 persona. Pan árabe (27cm), pollo + carne (vacuno) + vegetales, 2 falafel, 2 salsas, 1 papas fritas pequeñas', price: 13000, categoryId: catMap['promociones'], order: 1, isFeatured: true },
    { name: 'Promo Shawarma Duo Clásico Mixto', description: 'Para 2 personas. Pan árabe (24cm), pollo + carne (vacuno) + vegetales, 4 falafel, 2 salsas, 1 papas fritas pequeñas, 2 bebidas a elección', price: 23990, categoryId: catMap['promociones'], order: 2, isFeatured: true },

    // Menú del Día - Pollo
    { name: 'Pollo a la Plancha', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: catMap['menu-del-dia'], order: 1 },
    { name: 'Pollo a la Aceituna', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: catMap['menu-del-dia'], order: 2 },
    { name: 'Pollo a la Ciruela', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: catMap['menu-del-dia'], order: 3 },
    { name: 'Pollo Arvejado', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: catMap['menu-del-dia'], order: 4 },
    { name: 'Pollo Guisado de Verduras', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: catMap['menu-del-dia'], order: 5 },
    { name: 'Tomatican de Pollo', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: catMap['menu-del-dia'], order: 6 },

    // Menú del Día - Guisos
    { name: 'Guisado de Lentejas', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: catMap['menu-del-dia'], order: 7 },
    { name: 'Guisado de Garbanzos', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: catMap['menu-del-dia'], order: 8 },
    { name: 'Guisado de Berenjena', description: 'Con consomé, ensalada, postre, arroz árabe o papas fritas, y té árabe', price: 6900, categoryId: catMap['menu-del-dia'], order: 9 },
    { name: 'Consomé Individual', description: 'Consomé por separado', price: 2000, categoryId: catMap['menu-del-dia'], order: 10 },

    // Acompañamiento - Salsas
    { name: 'Salsa de Ajo', description: 'Salsa cremosa de ajo', price: 0, categoryId: catMap['acompanamiento-salsas'], order: 1 },
    { name: 'Salsa de Cilantro', description: 'Salsa fresca de cilantro', price: 0, categoryId: catMap['acompanamiento-salsas'], order: 2 },
    { name: 'Salsa de Albahaca', description: 'Salsa aromática de albahaca', price: 0, categoryId: catMap['acompanamiento-salsas'], order: 3 },

    // Bebestibles
    { name: 'Tetera de Té Verde', description: 'Té verde aromático servido en tetera tradicional', price: 0, categoryId: catMap['bebestibles'], order: 1 },
    { name: 'Tetera de Té Jamaica', description: 'Té de jamaica refrescante servido en tetera', price: 0, categoryId: catMap['bebestibles'], order: 2 },
    { name: 'Café Tradicional', description: 'Café árabe tradicional preparado a la manera clásica', price: 0, categoryId: catMap['bebestibles'], order: 3 },
    { name: 'Café Cardamomo', description: 'Café árabe con cardamomo, especiado y aromático', price: 0, categoryId: catMap['bebestibles'], order: 4 },
    { name: 'Bebidas Lata (Variedad)', description: 'Variedad de bebidas en lata', price: 0, categoryId: catMap['bebestibles'], order: 5 },
    { name: 'Agua Mineral con Gas', description: 'Agua mineral con gas', price: 0, categoryId: catMap['bebestibles'], order: 6 },
    { name: 'Agua Mineral sin Gas', description: 'Agua mineral sin gas', price: 0, categoryId: catMap['bebestibles'], order: 7 },
    { name: 'Jugos Naturales (Variedad de Sabores)', description: 'Jugos naturales frescos en variedad de sabores', price: 0, categoryId: catMap['bebestibles'], order: 8 },
  ];

  // Obtener items existentes para evitar duplicados
  const existingItems = await db.select({ name: menuItems.name }).from(menuItems);
  const existingNames = new Set(existingItems.map(item => item.name.toLowerCase().trim()));
  
  // Insertar items
  let insertedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const item of items) {
    try {
      if (!item.categoryId) {
        console.warn(`⚠️ Item sin categoría: ${item.name}`);
        errorCount++;
        continue;
      }
      
      // Verificar si el item ya existe
      const itemNameLower = item.name.toLowerCase().trim();
      if (existingNames.has(itemNameLower)) {
        skippedCount++;
        continue; // Saltar si ya existe
      }
      
      await db.insert(menuItems).values({
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
        isAvailable: true,
        isFeatured: item.isFeatured || false,
        order: item.order,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      insertedCount++;
      existingNames.add(itemNameLower); // Agregar a la lista para evitar duplicados en la misma ejecución
    } catch (error: any) {
      // Si el error es por duplicado, ignorarlo
      if (error.message?.includes('UNIQUE') || error.message?.includes('duplicate')) {
        skippedCount++;
        continue;
      }
      console.error(`❌ Error insertando ${item.name}:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`✅ Items insertados: ${insertedCount} de ${items.length}`);
  if (skippedCount > 0) {
    console.log(`ℹ️ Items omitidos (ya existen): ${skippedCount}`);
  }
  if (errorCount > 0) {
    console.warn(`⚠️ Errores: ${errorCount}`);
  }

  // Menús Combinados
  const combos = [
    {
      name: 'Menú para 2',
      description: 'Ideal para compartir',
      price: 31990,
      servings: 2,
      items: JSON.stringify({
        entrada: '12 Falafel',
        fondo: [
          '12 hojas de Parra',
          '5 repollitos rellenos',
          '5 papas rellenas',
          '2 salsas a elección'
        ],
        postre: '4 dulces árabes'
      }),
    },
    {
      name: 'Menú para 4',
      description: 'Perfecto para familias',
      price: 46990,
      servings: 4,
      items: JSON.stringify({
        entrada: '12 Falafel',
        fondo: [
          '24 hojas de Parra',
          '4 repollitos rellenos',
          '4 papas rellenas',
          '4 zapallitos rellenos',
          '3 salsas a elección'
        ],
        postre: '8 dulces árabes'
      }),
    },
    {
      name: 'Menú para 6',
      description: 'Para grupos grandes',
      price: 60990,
      servings: 6,
      items: JSON.stringify({
        entrada: '12 Falafel',
        fondo: [
          '24 hojas de Parra',
          '6 repollitos rellenos',
          '6 papas rellenas',
          '6 zapallitos rellenos',
          '4 salsas a elección'
        ],
        postre: '12 dulces árabes'
      }),
    },
    {
      name: 'Menú para 8',
      description: 'Fiesta completa',
      price: 82990,
      servings: 8,
      items: JSON.stringify({
        entrada: [
          '8 Falafel',
          '8 Kubbe'
        ],
        fondo: [
          '16 hojas de Parra',
          '8 repollitos rellenos',
          '8 papas rellenas',
          '8 zapallitos rellenos',
          '4 ajíes rellenos',
          '4 pimentón relleno',
          '4 salsas a elección'
        ],
        postre: '16 dulces árabes'
      }),
    },
  ];

  // Obtener combos existentes para evitar duplicados
  const existingCombos = await db.select({ name: comboMenus.name }).from(comboMenus);
  const existingComboNames = new Set(existingCombos.map(combo => combo.name.toLowerCase().trim()));
  
  let comboCount = 0;
  let comboSkipped = 0;
  for (const combo of combos) {
    try {
      // Verificar si el combo ya existe
      const comboNameLower = combo.name.toLowerCase().trim();
      if (existingComboNames.has(comboNameLower)) {
        comboSkipped++;
        continue; // Saltar si ya existe
      }
      
      await db.insert(comboMenus).values({
        ...combo,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      comboCount++;
      existingComboNames.add(comboNameLower); // Agregar a la lista para evitar duplicados en la misma ejecución
    } catch (error: any) {
      // Si el error es por duplicado, ignorarlo
      if (error.message?.includes('UNIQUE') || error.message?.includes('duplicate')) {
        comboSkipped++;
        continue;
      }
      console.error(`❌ Error insertando combo ${combo.name}:`, error.message);
    }
  }
  
  console.log(`✅ Menús combinados insertados: ${comboCount} de ${combos.length}`);
  if (comboSkipped > 0) {
    console.log(`ℹ️ Combos omitidos (ya existen): ${comboSkipped}`);
  }
  console.log('✅ Datos iniciales cargados correctamente');
  
  // Verificar que los datos se insertaron
  const totalItems = await db.select().from(menuItems);
  console.log(`📊 Total de items en la base de datos: ${totalItems.length}`);
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData().catch(console.error);
}
