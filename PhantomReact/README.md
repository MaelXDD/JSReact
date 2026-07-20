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

```
tienda-online/
├── src/
│   ├── lib/
│   │   └── supabaseClient.ts       Instancia única del cliente Supabase
│   ├── domain/
│   │   └── entities.ts              Definiciones JSDoc (Usuario, Producto, Venta, etc.)
│   ├── contexts/
│   │   ├── AuthContext.tsx          Sesión, perfil, rol, login/logout
│   │   └── CartContext.tsx          Estado global del carrito (useReducer)
│   │   └── ToastContext.tsx         
│   ├── repositories/                Acceso directo a Supabase (una tabla por archivo)
│   │   ├── productosRepository.ts
│   │   ├── categoriasRepository.ts
│   │   ├── ventasRepository.ts
│   │   └── detalleVentasRepository.ts
│   ├── services/                    Reglas de negocio sobre los repositorios
│   │   ├── productoService.ts
│   │   ├── categoriaService.ts
│   │   ├── ventaService.ts
│   │   └── usuarioService.ts
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── StorePage.tsx            Catálogo con búsqueda y filtro (vista cliente)
│   │   ├── CartPage.tsx             Carrito y checkout
│   │   └── AdminPage.tsx            CRUD de productos (vista administrador)
│   ├── components/
│   │   ├── shared/Navbar.tsx
│   │   ├── shared/Footer.tsx
│   │   ├── client/ProductCard.tsx
│   │   └── common/SmartImage.tsx    Imagen con placeholder y manejo de error
│   ├── App.tsx                      Rutas protegidas por sesión y rol
│   ├── main.tsx                     Providers (Router, Auth, Cart)
│   └── index.css                    Tailwind y clases utilitarias (.btn-primary, .card, etc.)
├── Imagenes/                        Recursos estáticos de productos usados como demostración
├── .env.local                       Credenciales de Supabase (ver nota de la sección 1)
├── vite.config.ts
├── tailwind.config.js
└── package.json
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