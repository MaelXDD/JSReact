# 🛍️ PhantomStore — Tienda Online con React + Supabase

Stack: **React 18 + Vite + Tailwind CSS + React Icons + Supabase JS**

---

## 🚀 Instalación rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar credenciales de Supabase
cp .env.local .env.local
# Edita .env.local con tu VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
# (las encuentras en Supabase Dashboard → Project Settings → API)

# 3. Levantar servidor de desarrollo
npm run dev
```

---

## ⚙️ Configuración de Supabase

### 1. Habilitar autenticación por Email

En tu proyecto Supabase → **Authentication → Providers → Email**, asegúrate de que esté activado.

### 2. Row Level Security (RLS)

Para que el cliente anon pueda leer productos y categorías, ejecuta en el **SQL Editor** de Supabase:

```sql
-- Lectura pública de productos y categorías
ALTER TABLE productos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE etiquetas  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de productos"
  ON productos FOR SELECT USING (true);

CREATE POLICY "Lectura pública de categorías"
  ON categorias FOR SELECT USING (true);

-- Usuarios: solo pueden leer/editar su propio perfil
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden leer su propio perfil"
  ON usuarios FOR SELECT USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Usuarios pueden insertar su perfil"
  ON usuarios FOR INSERT WITH CHECK (true);

-- Ventas: solo el propio usuario
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insertar ventas propias"
  ON ventas FOR INSERT WITH CHECK (usuario_id = (
    SELECT id FROM usuarios WHERE email = auth.jwt() ->> 'email'
  ));

ALTER TABLE detalle_ventas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insertar detalle de ventas"
  ON detalle_ventas FOR INSERT WITH CHECK (true);
```

> **Nota:** Para el panel admin (CRUD de productos) deberías agregar políticas restrictivas por rol. Por simplicidad académica, también puedes **desactivar RLS** durante el desarrollo.

---

## 📁 Estructura del proyecto

```
tienda-online/
├── src/
│   ├── lib/
│   │   └── supabaseClient.js       ← instancia única del cliente Supabase
│   ├── contexts/
│   │   ├── AuthContext.jsx         ← sesión, rol, login/logout
│   │   └── CartContext.jsx         ← estado global del carrito
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── StorePage.jsx           ← catálogo (vista cliente)
│   │   ├── CartPage.jsx            ← carrito + checkout
│   │   └── AdminPage.jsx           ← CRUD productos (vista admin)
│   ├── components/
│   │   ├── shared/
│   │   │   └── Navbar.jsx
│   │   └── client/
│   │       └── ProductCard.jsx
│   ├── App.jsx                     ← rutas protegidas por rol
│   ├── main.jsx
│   └── index.css
├── .env.example
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🔐 Roles

| Rol en `usuarios.rol` | Acceso |
|---|---|
| `Cliente` | Catálogo, carrito, checkout |
| `Administrador` | Panel CRUD de productos |

El rol se lee desde la tabla `usuarios` filtrando por el email del usuario autenticado en Supabase Auth.

---

## 📊 Operaciones Supabase implementadas

| Operación | Tabla | Dónde |
|---|---|---|
| SELECT + JOIN | `productos` ← `categorias` | StorePage, AdminPage |
| INSERT | `ventas` + `detalle_ventas` | CartPage (checkout) |
| INSERT | `usuarios` | RegisterPage |
| UPDATE | `productos`, `stock` | CartPage, AdminPage |
| DELETE | `productos` | AdminPage |
