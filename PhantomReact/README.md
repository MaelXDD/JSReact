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

```
## 3. Estructura del proyecto

```
PhantomReact/
├── Imagenes/                       # Imágenes estáticas del catálogo, banners y branding (57 archivos)
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminMetrics.tsx    # Métricas/indicadores del panel de administración
│   │   ├── client/
│   │   │   ├── ProductCard.tsx     # Tarjeta de producto en el catálogo
│   │   │   └── WelcomeBanner.tsx   # Banner de bienvenida en la tienda
│   │   ├── common/
│   │   │   └── SmartImage.tsx      # Componente de imagen con manejo de fallback/carga
│   │   └── shared/
│   │       ├── Footer.tsx          # Pie de página común
│   │       └── Navbar.tsx          # Barra de navegación común
│   ├── contexts/
│   │   ├── AuthContext.tsx         # Estado global de autenticación y rol de usuario
│   │   ├── CartContext.tsx         # Estado global del carrito de compras
│   │   └── ToastContext.tsx        # Notificaciones tipo toast
│   ├── domain/
│   │   └── entities.ts             # Tipos/entidades del dominio (Producto, Usuario, Venta, etc.)
│   ├── hooks/
│   │   ├── useAddToCart.ts         # Lógica para agregar productos al carrito
│   │   ├── useAdminProducts.ts     # CRUD de productos para el panel admin
│   │   ├── useCheckout.ts          # Lógica del proceso de checkout
│   │   ├── useDashboardStats.ts    # Estadísticas del dashboard admin
│   │   ├── useLoginForm.ts         # Lógica del formulario de inicio de sesión
│   │   ├── useLogout.ts            # Lógica de cierre de sesión
│   │   ├── useRegisterForm.ts      # Lógica del formulario de registro
│   │   └── useStoreCatalog.ts      # Lógica de listado/búsqueda/filtro del catálogo
│   ├── lib/
│   │   └── supabaseClient.ts       # Instancia y configuración del cliente de Supabase
│   ├── pages/
│   │   ├── AdminPage.tsx           # Panel de administración (CRUD de productos)
│   │   ├── CartPage.tsx            # Carrito y checkout
│   │   ├── LoginPage.tsx           # Inicio de sesión
│   │   ├── RegisterPage.tsx        # Registro de usuarios
│   │   └── StorePage.tsx           # Catálogo de productos
│   ├── repositories/
│   │   ├── categoriasRepository.ts     # Acceso a datos de la tabla `categorias`
│   │   ├── detalleVentasRepository.ts  # Acceso a datos de la tabla `detalle_ventas`
│   │   ├── productosRepository.ts      # Acceso a datos de la tabla `productos`
│   │   └── ventasRepository.ts         # Acceso a datos de la tabla `ventas`
│   ├── services/
│   │   ├── categoriaService.ts     # Lógica de negocio sobre categorías
│   │   ├── productoService.ts      # Lógica de negocio sobre productos
│   │   ├── usuarioService.ts       # Lógica de negocio sobre usuarios
│   │   └── ventaService.ts         # Lógica de negocio sobre ventas
│   ├── utils/
│   │   └── isSupabaseError.ts      # Helper para detectar errores de Supabase
│   ├── App.tsx                     # Definición de rutas y componentes de protección (PrivateRoute/AdminRoute)
│   ├── index.css                   # Estilos globales (Tailwind)
│   ├── main.tsx                    # Punto de entrada de la aplicación
│   └── vite-env.d.ts                # Tipado de variables de entorno de Vite
├── .env.local                      # Credenciales de Supabase (excluido de git)
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Roles y control de acceso

| Rol en `usuarios.rol` | Acceso |
|---|---|
| `USER` (asignado por defecto al registrarse) | Catálogo, carrito, checkout |
| `ADMIN` (asignado manualmente en la base de datos) | Panel CRUD de productos en `/admin` |

El rol se obtiene de la tabla `usuarios`, filtrando por el correo electrónico del usuario autenticado en Supabase Auth (`AuthContext.fetchProfile`). El componente `App.tsx` protege las rutas mediante dos componentes: `PrivateRoute` (requiere sesión activa) y `AdminRoute` (requiere sesión activa y rol de administrador).

---

## 5. Operaciones sobre Supabase

| Operación | Tabla | Ubicación |
|---|---|---|
| SELECT con JOIN | `productos` relacionado con `categorias` | StorePage, AdminPage |
| SELECT | `categorias` | StorePage, AdminPage |
| INSERT | `ventas` y `detalle_ventas` | CartPage (checkout) |
| INSERT | `usuarios` (Auth y tabla propia) | RegisterPage |
| UPDATE | `productos.stock` | CartPage (posterior al checkout), AdminPage |
| UPDATE / INSERT | `productos` | AdminPage (creación y edición) |
| DELETE | `productos` | AdminPage |

---

## 6. Flujo funcional

1. Registro e inicio de sesión mediante Supabase Auth (correo electrónico y contraseña).
2. Catálogo (ruta `/`): listado de productos con búsqueda por nombre y filtro por categoría.
3. Carrito (ruta `/cart`): agregar y quitar productos, ajustar cantidades, iniciar checkout.
4. Checkout: crea un registro en `ventas`, sus líneas de detalle en `detalle_ventas`, y descuenta el stock de cada producto.
5. Panel de administración (ruta `/admin`, solo rol `ADMIN`): tabla de productos con alta, edición y baja mediante ventana modal.

---


## Pruebas de seguridad

- Se ejecutó `npm audit` sobre las dependencias del proyecto, detectando 2 vulnerabilidades (1 moderada, 1 alta), ambas originadas en la misma causa: una versión desactualizada de `esbuild`, utilizada internamente por Vite en el servidor de desarrollo. Esta vulnerabilidad afecta únicamente al entorno de desarrollo local (`npm run dev`), no a la aplicación en producción.
- No se aplicó la corrección disponible (`npm audit fix --force`), ya que requiere actualizar Vite a una versión mayor con posibles cambios incompatibles. Reporte completo: `Reporte_Pruebas_Seguridad_PhantomStore.pdf`.