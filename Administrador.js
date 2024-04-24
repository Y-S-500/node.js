const Categoria = require("./Categoria ");
const Rol = require("./Rol ");
const Usuario = require("./Usuario");

class Administrador extends Usuario {
    constructor(nombre, email) {
        super(nombre, email, Rol.ADMINISTRADOR);
        this.productosEnVenta = [];
        this.categorias = categoriasPorDefecto; // Inicializamos con categorías por defecto
    }
    agregarProductoEnVenta(producto) {
        this.productosEnVenta.push(producto);
    }

    consultarProductosEnVenta() {
        console.log("Productos en venta:");
        for (let producto of this.productosEnVenta) {
            console.log(`ID: ${producto.id} - Nombre: ${producto.nombre} - Precio: ${producto.precio} - Categoría: ${producto.categoria ? producto.categoria.nombre : 'Sin categoría'}`);
        }
    }
    

    agregarCategoria(id, nombre) {
        const nuevaCategoria = new Categoria(id, nombre);
        this.categorias.push(nuevaCategoria);
        console.log(`Categoría "${nombre}" agregada con éxito.`);
    }

    consultarCategorias() {
        console.log("Categorías:");
        for (let categoria of this.categorias) {
            console.log(`${categoria.id} - ${categoria.nombre}`);
        }
    }

    asignarCategoriaAProducto(productoId, categoriaId) {
        const producto = this.productosEnVenta.find(prod => prod.id === productoId);
        const categoria = this.categorias.find(cat => cat.id === categoriaId);
        if (producto && categoria) {
            producto.categoria = categoria; // Asignar la categoría al producto
            console.log(`Producto "${producto.nombre}" asignado a la categoría "${categoria.nombre}".`);
        } else {
            console.log("Producto o categoría no encontrados.");
        }
    }
    
}

module.exports = Administrador;
