# PubliMax Marketing Digital - Sistema de Gestión

Este proyecto es una aplicación web para la gestión de campañas, entregables y equipo creativo de la agencia PubliMax. Desarrollado con Next.js 16, Prisma y Supabase.

## Stack Tecnológico

- **Frontend/Backend**: Next.js 16.2.3 (App Router, Server Actions)
- **Base de Datos**: PostgreSQL (Supabase)
- **ORM**: Prisma 7.7.0
- **Estilos**: Tailwind CSS 4

## Configuración Inicial

### 1. Clonar el repositorio e instalar dependencias

```bash
npm install
```

### 2. Variables de Entorno

Copia el archivo `.env.example` a `.env` y completa las credenciales de Supabase:

```bash
cp .env.example .env
```

- `DATABASE_URL`: URL de conexión (Transaction Mode, puerto 6543 para Prisma).
- `DIRECT_URL`: URL de conexión directa (Puerto 5432 para migraciones).
- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto en Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon Key de Supabase.

### 3. Base de Datos y Prisma

Genera el cliente de Prisma:

```bash
npx prisma generate
```

Para aplicar cambios en el esquema o sincronizar con la base de datos:

```bash
npx prisma db push # Para desarrollo inicial
# o
npx prisma migrate dev --name init # Para migraciones formales
```

### 4. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver el resultado. El Dashboard mostrará el estado de la conexión a la base de datos.

## Estructura del Proyecto

- `src/app`: Páginas y componentes de la aplicación (Next.js App Router).
- `src/lib`: Clientes de Prisma y Supabase (Singletons).
- `prisma/`: Esquema de la base de datos y migraciones.
