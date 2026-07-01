/**
 * @typedef {Object} Usuario
 * @property {number} id
 * @property {string} nombre
 * @property {string} email
 * @property {string} password
 * @property {string} rol
 * @property {string} [dni]
 * @property {string} [direccion]
 * @property {string} [fecha_registro]
 * @property {string} [numero_telefono]
 */

/**
 * @typedef {Object} Perfil
 * @property {number} id
 * @property {string} [avatar_url]
 * @property {string} [biografia]
 * @property {number} usuario_id
 */

/**
 * @typedef {Object} Categoria
 * @property {number} id
 * @property {string} nombre
 * @property {string} [descripcion]
 */

/**
 * @typedef {Object} Etiqueta
 * @property {number} id
 * @property {string} nombre
 */

/**
 * @typedef {Object} Producto
 * @property {number} id
 * @property {string} nombre
 * @property {string} [descripcion]
 * @property {number} precio
 * @property {number} stock
 * @property {string} [marca]
 * @property {string} [imagen_url]
 * @property {number} categoria_id
 * @property {Categoria} [categorias]
 */

/**
 * @typedef {Object} ProductoEtiqueta
 * @property {number} producto_id
 * @property {number} etiqueta_id
 */

/**
 * @typedef {Object} Venta
 * @property {number} id
 * @property {string} fecha
 * @property {number} total
 * @property {number} cantidad_items
 * @property {number} usuario_id
 * @property {string} numero_orden
 */

/**
 * @typedef {Object} DetalleVenta
 * @property {number} id
 * @property {number} venta_id
 * @property {number} producto_id
 * @property {number} cantidad
 * @property {number} precio_unitario
 * @property {number} subtotal
 */

export {}