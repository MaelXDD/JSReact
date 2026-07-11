# PhantomStore — Tienda Online con React y Supabase

Aplicación de comercio electrónico para artículos de tecnología y gaming (consolas, sillas, periféricos, videojuegos), con catálogo de productos, carrito de compras, proceso de checkout y panel de administración.

**Stack tecnológico:** React 18, Vite, Tailwind CSS, React Router 6, Supabase (Autenticación y Base de Datos Postgres)

---

## 1. Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar credenciales de Supabase
# Crear/editar el archivo .env.local en la raíz del proyecto con:
VITE_SUPABASE_URL=https://qmtjbyuhiedqudpvfgzc.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_lVQ1ToFTc5aR2TKaxJY6WQ_5SfzqBUp

# 3. Levantar el servidor de desarrollo
npm run dev
```

Scripts adicionales: `npm run build` genera el build de producción y `npm run preview` lo sirve localmente.

Nota: actualmente el archivo `.env.local` se encuentra versionado en el repositorio (no existe un archivo `.gitignore`). Se recomienda excluirlo del control de versiones y rotar las claves de Supabase antes de compartir el repositorio de forma pública.

---

## 2. Configuración de Supabase

### 2.1 Autenticación por correo electrónico

En el proyecto de Supabase, ir a Authentication > Providers > Email y verificar que esté habilitado.

### 2.2 Row Level Security (RLS)

Se configuro en supabase ROW LEVEL SECURITY para que los usuarios anonimos puedan acceder a hacer cambios en la base de datos agregando políticas restrictivas por rol.

### 2.3 Creación de un usuario administrador

No existe una interfaz para promover un usuario a administrador. Después de registrarse normalmente, ejecutar en el SQL Editor de Supabase:

```sql
UPDATE usuarios SET rol = 'ADMIN' WHERE email = 'tu@email.com';
```

---

## 3. Estructura del proyecto

```
tienda-online/
├── src/
│   ├── lib/
│   │   └── supabaseClient.js        Instancia única del cliente Supabase
│   ├── domain/
│   │   └── entities.js              Definiciones JSDoc (Usuario, Producto, Venta, etc.)
│   ├── contexts/
│   │   ├── AuthContext.jsx          Sesión, perfil, rol, login/logout
│   │   └── CartContext.jsx          Estado global del carrito (useReducer)
│   ├── repositories/                Acceso directo a Supabase (una tabla por archivo)
│   │   ├── productosRepository.js
│   │   ├── categoriasRepository.js
│   │   ├── ventasRepository.js
│   │   └── detalleVentasRepository.js
│   ├── services/                    Reglas de negocio sobre los repositorios
│   │   ├── productoService.js
│   │   ├── categoriaService.js
│   │   ├── ventaService.js
│   │   └── usuarioService.js
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── StorePage.jsx            Catálogo con búsqueda y filtro (vista cliente)
│   │   ├── CartPage.jsx             Carrito y checkout
│   │   └── AdminPage.jsx            CRUD de productos (vista administrador)
│   ├── components/
│   │   ├── shared/Navbar.jsx
│   │   ├── client/ProductCard.jsx
│   │   └── common/SmartImage.jsx    Imagen con placeholder y manejo de error
│   ├── App.jsx                      Rutas protegidas por sesión y rol
│   ├── main.jsx                     Providers (Router, Auth, Cart)
│   └── index.css                    Tailwind y clases utilitarias (.btn-primary, .card, etc.)
├── Imagenes/                        Recursos estáticos de productos usados como demostración
├── .env.local                       Credenciales de Supabase (ver nota de la sección 1)
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 4. Roles y control de acceso

| Rol en `usuarios.rol` | Acceso |
|---|---|
| `USER` (asignado por defecto al registrarse) | Catálogo, carrito, checkout |
| `ADMIN` (asignado manualmente en la base de datos) | Panel CRUD de productos en `/admin` |

El rol se obtiene de la tabla `usuarios`, filtrando por el correo electrónico del usuario autenticado en Supabase Auth (`AuthContext.fetchProfile`). El componente `App.jsx` protege las rutas mediante dos componentes: `PrivateRoute` (requiere sesión activa) y `AdminRoute` (requiere sesión activa y rol de administrador).

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

## 7. Funciones de desarrollo futuras

A continuación se listan hallazgos del análisis del código, considerados relevantes para la evaluación del proyecto y para una eventual mejora posterior a la entrega:

- **Archivo de entorno versionado en git.** `.env.local` está incluido en el control de versiones (no existe `.gitignore`).
- **Contraseña almacenada en texto plano.** En `RegisterPage.jsx`, el campo `password` se guarda sin cifrar directamente en la tabla `usuarios`, además de registrarse en Supabase Auth.
- **Capa de servicios subutilizada.** Existen módulos en `services/` (`productoService`, `categoriaService`, `ventaService`, `usuarioService`) pensados para encapsular reglas de negocio, pero las páginas `StorePage`, `AdminPage` y `CartPage` acceden directamente a los módulos de `repositories/`, sin pasar por dicha capa.
- **Lógica de filtrado duplicada.** En `StorePage.jsx`, las variables `filtered`, `displayedByCategory` y `displayed` repiten el mismo criterio de filtrado y pueden unificarse.
- **Manejo de errores no centralizado.** Los errores devueltos por Supabase se muestran mediante `alert()` en distintos puntos (`CartPage`, `AdminPage`), en lugar de un componente de notificación común.
- **Pruebas automatizadas** y de configuración de linter en `package.json`.

Estas son funciones que aun faltan implementar en el proyecto y se incorporaran para la entrega final