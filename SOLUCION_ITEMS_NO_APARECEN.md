# 🔍 Solución: Items o Categorías No Aparecen en el Menú

## ✅ PROBLEMA RESUELTO

He actualizado el código para que **TODAS las categorías activas** se muestren en el menú, incluso si aún no tienen items.

---

## 🔍 VERIFICAR QUE TODO ESTÉ CONFIGURADO CORRECTAMENTE

### 1. Verificar la Categoría

En el panel de admin (`/admin/menu`), verifica que tu nueva categoría tenga:

- ✅ **Nombre**: Debe tener un nombre
- ✅ **Slug**: Debe tener un slug único (se genera automáticamente)
- ✅ **Activa**: El toggle "Activa" debe estar **ENCENDIDO** (verde)
- ✅ **Orden**: Debe tener un número de orden (0, 1, 2, etc.)

**Si la categoría no está activa, no aparecerá en el menú.**

### 2. Verificar el Item

En el panel de admin, verifica que tu nuevo item tenga:

- ✅ **Nombre**: Debe tener un nombre
- ✅ **Categoría**: Debe estar asignado a la categoría correcta (seleccionada en el dropdown)
- ✅ **Disponible**: El toggle "Disponible" debe estar **ENCENDIDO** (verde)
- ✅ **Precio**: Debe tener un precio (puede ser 0 si es "Consultar")
- ✅ **Orden**: Debe tener un número de orden

**Si el item no está disponible o no tiene categoría asignada, no aparecerá.**

---

## 🐛 SI AÚN NO APARECE

### Paso 1: Verificar en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **Table Editor** → **categories**
3. Busca tu categoría nueva
4. Verifica que:
   - `is_active` = `true` (debe estar marcado)
   - `slug` tiene un valor (ej: "mi-nueva-categoria")

5. Ve a **Table Editor** → **menu_items**
6. Busca tu item nuevo
7. Verifica que:
   - `is_available` = `true` (debe estar marcado)
   - `category_id` tiene el ID correcto de tu categoría
   - `name` tiene un valor

### Paso 2: Limpiar Caché

1. **En el navegador**: Presiona `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac) para recargar sin caché
2. **En Vercel** (si estás en producción): 
   - Ve a tu proyecto en Vercel
   - Haz un nuevo deploy o espera unos minutos para que se actualice

### Paso 3: Verificar en el Admin

1. Ve a `/admin/menu`
2. Verifica que:
   - La categoría aparece en la lista de categorías
   - El item aparece en la lista de items
   - Ambos tienen los toggles correctos activados

### Paso 4: Probar la URL Directa

Intenta acceder directamente a la categoría:
- Si el slug es `mi-nueva-categoria`, ve a: `https://tu-dominio.com/mi-nueva-categoria`
- Si no carga, verifica que el slug sea correcto

---

## 📝 CHECKLIST RÁPIDO

- [ ] Categoría tiene `is_active = true`
- [ ] Categoría tiene un `slug` válido
- [ ] Item tiene `is_available = true`
- [ ] Item tiene `category_id` asignado correctamente
- [ ] Limpié la caché del navegador
- [ ] Verifiqué en Supabase que los datos estén correctos
- [ ] Probé la URL directa de la categoría

---

## 🔧 CAMBIOS REALIZADOS

He modificado `src/pages/index.astro` para que:

1. **Muestre TODAS las categorías activas**, no solo las que tienen items
2. Esto permite que categorías nuevas aparezcan inmediatamente
3. Los items aparecerán cuando estén marcados como disponibles

---

## 💡 CONSEJOS

- **Siempre activa la categoría** antes de crear items
- **Asigna la categoría correcta** al crear un item
- **Marca los items como disponibles** para que aparezcan
- **Usa números de orden** para controlar el orden de aparición

---

**¿Sigue sin aparecer?** Revisa los logs de la consola del navegador (F12) para ver si hay errores.


