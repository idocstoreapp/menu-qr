# 🔐 Guía del Panel de Administración

## Cómo Iniciar Sesión

1. **Ve a la página de login:**
   - URL: `http://localhost:4321/admin/login`
   - O desde la página principal, haz clic en "Panel Admin"

2. **Credenciales por defecto:**
   - **Usuario:** `admin`
   - **Contraseña:** `admin123`

3. **⚠️ IMPORTANTE:** Cambia la contraseña después del primer inicio de sesión.

---

## Funcionalidades del Panel Admin

### 1. Gestión de Items del Menú

**Agregar un nuevo item:**
1. Haz clic en el botón **"+ Agregar Item"**
2. Completa el formulario:
   - **Nombre** (requerido)
   - **Descripción** (opcional)
   - **Precio** en CLP (requerido)
   - **Categoría** (selecciona de la lista)
   - **URL de Imagen** (opcional)
   - **Orden** (para ordenar los items)
   - **Disponible** (checkbox para activar/desactivar)
   - **Destacado** (checkbox para marcar como destacado)
3. Haz clic en **"Guardar"**

**Editar un item existente:**
1. En la lista de items, haz clic en el botón **"Editar"** del item que quieres modificar
2. Modifica los campos que necesites (nombre, precio, descripción, etc.)
3. Haz clic en **"Guardar"**

**Eliminar un item:**
1. Haz clic en el botón **"Eliminar"** del item
2. Confirma la eliminación

**Cambiar precio:**
- Simplemente edita el item y cambia el campo "Precio"
- El precio se guarda en pesos chilenos (CLP)

**Activar/Desactivar items:**
- Usa el checkbox "Disponible" al editar un item
- Los items no disponibles no aparecerán en la vista pública

---

## Navegación del Panel

El panel tiene varias secciones (algunas aún en desarrollo):

- **Items del Menú** - Gestión completa de items individuales
- **Menús Combinados** - Gestión de menús para 2, 4, 6, 8 personas
- **Promociones** - Crear y gestionar promociones especiales
- **Menú del Día** - Configurar el menú diario

---

## Cambiar Contraseña

Actualmente la contraseña se guarda en la base de datos. Para cambiarla:

1. Ve al panel admin
2. (Funcionalidad de cambio de contraseña pendiente - puedes hacerlo directamente en la base de datos por ahora)

---

## Tips

- **Precios:** Ingresa los precios sin puntos ni comas (ej: 8000, 46990)
- **Imágenes:** Puedes usar URLs de imágenes externas (ej: Unsplash, Imgur)
- **Orden:** Los items se ordenan primero por el campo "Orden", luego alfabéticamente
- **Categorías:** Asegúrate de seleccionar la categoría correcta para que el item aparezca en la sección adecuada

---

## Solución de Problemas

**No puedo iniciar sesión:**
- Verifica que estés usando `admin` / `admin123`
- Revisa la consola del navegador (F12) para ver errores

**Los cambios no se guardan:**
- Verifica que estés autenticado (deberías ver "Cerrar Sesión" en el panel)
- Revisa la consola del navegador para errores

**No veo los items:**
- Asegúrate de que los items estén marcados como "Disponible"
- Verifica que tengan una categoría asignada

---

¿Necesitas ayuda? Revisa los logs en la consola del navegador (F12).


