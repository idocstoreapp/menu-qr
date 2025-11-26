# Guía de Despliegue - GitHub y Vercel

## Paso 1: Subir a GitHub

### 1.1 Inicializar Git (si no lo has hecho)
```bash
git init
```

### 1.2 Agregar todos los archivos
```bash
git add .
```

### 1.3 Hacer el primer commit
```bash
git commit -m "Initial commit: Menú digital Gourmet Árabe"
```

### 1.4 Crear repositorio en GitHub
1. Ve a [GitHub.com](https://github.com)
2. Haz clic en el botón "+" (arriba a la derecha) → "New repository"
3. Nombre del repositorio: `menu-qr` (o el que prefieras)
4. **NO marques** "Initialize with README" (ya tenemos archivos)
5. Haz clic en "Create repository"

### 1.5 Conectar y subir
GitHub te mostrará comandos, pero aquí están:

```bash
git remote add origin https://github.com/TU_USUARIO/menu-qr.git
git branch -M main
git push -u origin main
```

**Nota:** Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

---

## Paso 2: Desplegar en Vercel

### ⚠️ IMPORTANTE: Base de Datos en Vercel

Vercel usa un sistema de archivos de solo lectura, por lo que SQLite local no funcionará. Tienes dos opciones:

#### Opción 1: Usar Turso (Recomendado - Gratis)

1. Crea una cuenta en [Turso](https://turso.tech)
2. Crea una base de datos nueva
3. Obtén la URL de conexión (formato: `libsql://...`)
4. En Vercel, agrega la variable de entorno:
   - Nombre: `DATABASE_URL`
   - Valor: La URL de Turso

#### Opción 2: Usar SQLite en `/tmp` (Limitado)

La base de datos se reiniciará en cada deploy. Solo para pruebas.

---

### Desplegar en Vercel

### Opción A: Desde GitHub (Recomendado)

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en "Add New Project"
4. Selecciona el repositorio `menu-qr`
5. Vercel detectará automáticamente que es un proyecto Astro
6. **Configuración:**
   - Framework Preset: **Astro** (debería detectarse automáticamente)
   - Build Command: `npm run build` (automático)
   - Output Directory: `.vercel/output` (automático)
   - **Variables de Entorno:**
     - `DATABASE_URL`: URL de tu base de datos Turso (si usas Opción 1)
7. Haz clic en "Deploy"
8. ¡Listo! Vercel te dará una URL como: `menu-qr.vercel.app`

### Opción B: Desde Vercel CLI

```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# En la carpeta del proyecto
vercel

# Sigue las instrucciones:
# - ¿Set up and deploy? → Yes
# - ¿Which scope? → Tu cuenta
# - ¿Link to existing project? → No
# - ¿Project name? → menu-qr (o el que prefieras)
# - ¿Directory? → ./
```

---

## Actualizaciones Futuras

Cada vez que hagas cambios:

### Para GitHub:
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### Para Vercel:
- Si conectaste GitHub, **se actualiza automáticamente** cuando haces push
- Si usaste CLI, ejecuta `vercel --prod` después de hacer push

---

## Ventajas de Vercel

✅ **Gratis** para proyectos personales
✅ **HTTPS automático**
✅ **CDN global** (carga rápida en todo el mundo)
✅ **Deploy automático** desde GitHub
✅ **URL personalizada** (puedes agregar tu dominio después)
✅ **Perfecto para sitios estáticos** como este menú

---

## Notas Importantes

- **Este proyecto usa Astro con modo servidor** (SSR)
- Vercel detecta automáticamente Astro y usa el adaptador correcto
- El sitio se actualiza automáticamente cada vez que haces `git push` (si conectaste GitHub)
- **Base de datos**: En producción, usa Turso o una base de datos en la nube
- Puedes usar la URL de Vercel para generar tu código QR del menú
- El archivo `vercel.json` está configurado para el build correcto

---

## Generar QR Code

Una vez que tengas la URL de Vercel, puedes generar un código QR:

1. Ve a [qr-code-generator.com](https://www.qr-code-generator.com)
2. Pega tu URL de Vercel
3. Descarga el QR code
4. ¡Imprime y ponlo en las mesas de tu restaurante!

