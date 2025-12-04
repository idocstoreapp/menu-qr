# Menú QR - Gourmet Árabe

Aplicación web moderna para gestión de menú digital con panel de administración, construida con Astro, React, Tailwind CSS y SQLite.

## 🚀 Características

- ✨ **Panel de Administración**: Gestión completa de items del menú, precios, disponibilidad
- 📱 **Vista Pública**: Menú digital elegante con diseño árabe para clientes
- 🎨 **Diseño Árabe**: Colores dorados, tipografía elegante, animaciones suaves
- 💾 **Base de Datos SQLite**: Almacenamiento local con Drizzle ORM
- 🔐 **Autenticación**: Sistema de login seguro para administradores
- 📊 **Gestión Completa**: Items individuales, menús combinados, promociones, menú del día

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Inicializar base de datos:**
La base de datos se inicializa automáticamente al iniciar la aplicación.

3. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

4. **Abrir en el navegador:**
- Vista pública: http://localhost:4321
- Panel admin: http://localhost:4321/admin/login

## 🔑 Credenciales por Defecto

- **Usuario:** `admin`
- **Contraseña:** `admin123`

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer inicio de sesión.

## 📁 Estructura del Proyecto

```
menu-qr/
├── src/
│   ├── components/
│   │   ├── admin/          # Componentes del panel admin
│   │   └── public/         # Componentes de la vista pública
│   ├── db/
│   │   ├── schema.ts       # Esquema de base de datos
│   │   └── index.ts        # Conexión y inicialización
│   ├── layouts/
│   │   ├── AdminLayout.astro
│   │   └── PublicLayout.astro
│   ├── lib/
│   │   ├── auth.ts         # Funciones de autenticación
│   │   └── api-helpers.ts  # Helpers para API
│   └── pages/
│       ├── api/            # Endpoints de la API
│       ├── admin/          # Páginas del panel admin
│       └── index.astro     # Página principal pública
├── astro.config.mjs
├── tailwind.config.mjs
├── drizzle.config.ts
└── package.json
```

## 🎯 Funcionalidades del Admin

### Gestión de Items del Menú
- Crear, editar y eliminar items
- Cambiar precios
- Activar/desactivar disponibilidad
- Marcar items como destacados
- Asignar categorías
- Subir imágenes

### Menús Combinados
- Crear menús para 2, 4, 6, 8 personas
- Definir items incluidos
- Establecer precios

### Promociones
- Crear promociones especiales
- Definir fechas de validez
- Precios con descuento

### Menú del Día
- Configurar menú diario
- Precio especial del día

## 🌐 API Endpoints

### Autenticación
- `POST /api/login` - Iniciar sesión
- `POST /api/logout` - Cerrar sesión

### Items del Menú
- `GET /api/menu-items` - Obtener todos los items
- `POST /api/menu-items` - Crear item (requiere auth)
- `PUT /api/menu-items` - Actualizar item (requiere auth)
- `DELETE /api/menu-items?id=X` - Eliminar item (requiere auth)

### Categorías
- `GET /api/categories` - Obtener categorías
- `POST /api/categories` - Crear categoría (requiere auth)

### Menús Combinados
- `GET /api/combo-menus` - Obtener menús combinados
- `POST /api/combo-menus` - Crear menú (requiere auth)
- `PUT /api/combo-menus` - Actualizar menú (requiere auth)
- `DELETE /api/combo-menus?id=X` - Eliminar menú (requiere auth)

### Promociones
- `GET /api/promotions` - Obtener promociones activas
- `POST /api/promotions` - Crear promoción (requiere auth)
- `PUT /api/promotions` - Actualizar promoción (requiere auth)

### Menú del Día
- `GET /api/daily-menu?date=YYYY-MM-DD` - Obtener menú del día
- `POST /api/daily-menu` - Crear menú del día (requiere auth)
- `PUT /api/daily-menu` - Actualizar menú del día (requiere auth)

## 🎨 Personalización

### Colores
Los colores están definidos en `tailwind.config.mjs`. Puedes modificar:
- `gold`: Colores dorados principales
- `terracotta`: Colores terracota
- `arabic`: Colores oscuros y beige

### Fuentes
- **Cinzel**: Títulos y encabezados
- **Playfair Display**: Texto general

## 🚢 Despliegue

### Vercel (Recomendado)

1. **Subir a GitHub:**
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/menu-qr.git
git push -u origin main
```

2. **Conectar con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub
   - Vercel detectará automáticamente Astro
   - Configura variables de entorno si es necesario
   - Deploy automático

### Variables de Entorno

Crea un archivo `.env` para producción:
```
JWT_SECRET=tu-secret-key-super-seguro-aqui
```

## 📝 Notas

- La base de datos SQLite se crea automáticamente en la raíz del proyecto
- En producción, considera usar una base de datos más robusta (PostgreSQL, MySQL)
- Las imágenes pueden ser URLs externas o subidas a un servicio de almacenamiento
- El JWT_SECRET debe ser cambiado en producción

## 📄 Licencia

Este proyecto es de uso libre para tu restaurante.

---

**Gourmet Árabe** - Sabores Auténticos del Medio Oriente

---

## 👨‍💻 Desarrollador

**Desarrollado por:** [Jonathan Guarirapa](https://jonadevel-portfolio.vercel.app)  
**Desarrollador de aplicaciones y sitios webs**

- 🌐 **Portfolio:** [jonadevel-portfolio.vercel.app](https://jonadevel-portfolio.vercel.app)
- 📱 **WhatsApp:** [+56962614851](https://wa.me/56962614851)
- 📷 **Instagram:** [@jonacrd1](https://instagram.com/jonacrd1)
- 📧 **Email:** [jona.develp@gmail.com](mailto:jona.develp@gmail.com)