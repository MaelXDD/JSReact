# PhantomStore — Tienda electronica Online con React y Supabase

Aplicación de comercio electrónico para artículos de tecnología y gaming (consolas, sillas, periféricos, videojuegos), con catálogo de productos, carrito de compras, proceso de checkout y panel de administración.

**Stack tecnológico:** React 18, TypeScript, Vite, Tailwind CSS, React Router 6, Supabase (Autenticación y Base de Datos Postgres)

---

## 1. Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar credenciales de Supabase
# Crear/editar el archivo .env.local en la raíz del proyecto con las credenciales que le hemos brindado en los comentarios del utp+ class

# 3. Levantar el servidor de desarrollo
npm run dev
```

Scripts adicionales: `npm run build` compila TypeScript (`tsc --noEmit`) y genera el build de producción, `npm run preview` lo sirve localmente, y `npm run typecheck` corre solo la verificación de tipos sin compilar.

El archivo `.env.local` ya está excluido del control de versiones mediante `.gitignore` (junto con `node_modules`, `dist` y `*.tsbuildinfo`).

---

## 2. Configuración de Supabase

### 2.1 Autenticación por correo electrónico

En el proyecto de Supabase, ir a Authentication > Providers > Email y verificar que esté habilitado.

### 2.2 Row Level Security (RLS)

Se configuro en supabase ROW LEVEL SECURITY para que los usuarios anonimos puedan acceder a hacer cambios en la base de datos agregando políticas restrictivas por rol.

### 2.3 Creación de un usuario administrador

No existe una interfaz para promover un usuario a administrador. Después de registrarse normalmente, ejecutar en el SQL Editor de Supabase:


UPDATE usuarios SET rol = 'ADMIN' WHERE email = 'tu@email.com';
```

---

## 3. Estructura del proyecto