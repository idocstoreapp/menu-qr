# Configuración de Base de Datos

## Estado Actual: SQLite Local

El proyecto actualmente usa **SQLite** con `@libsql/client`, que funciona perfectamente para:
- ✅ Desarrollo local
- ✅ Proyectos pequeños/medianos
- ✅ Una sola instancia del servidor

## Opciones para Producción

### Opción 1: Mantener SQLite (Simple)
- Funciona bien si solo tienes una instancia del servidor
- Los datos se guardan en `database.sqlite`
- **Limitación**: En Vercel con múltiples instancias, cada una tendría su propia BD

### Opción 2: Supabase (Recomendado para Producción)
- Base de datos PostgreSQL en la nube
- Gratis hasta 500MB
- Funciona perfectamente con múltiples instancias
- Fácil de escalar

## Cómo Cambiar a Supabase (Si lo Necesitas)

### 1. Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Copia la **Connection String** (URI de PostgreSQL)

### 2. Instalar Dependencias
```bash
npm install postgres
npm install -D @types/pg
```

### 3. Cambiar Configuración
Edita `src/db/index.ts` y cambia de:
```typescript
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
```
A:
```typescript
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
```

### 4. Variables de Entorno
Crea un archivo `.env`:
```
DATABASE_URL=postgresql://usuario:password@host:5432/database
```

## Recomendación

**Para empezar:** Mantén SQLite, funciona perfectamente.

**Para producción con Vercel:** Considera Supabase si:
- Necesitas múltiples instancias del servidor
- Quieres acceso desde múltiples lugares
- Planeas escalar el proyecto

---

**Nota:** El código actual está preparado para SQLite. Si necesitas cambiar a Supabase más adelante, solo necesitas modificar `src/db/index.ts` y el esquema de Drizzle (que es compatible con ambos).


