const Usuario = require('./Usuario');

class Administrador extends Usuario {
    constructor(nombre) {
        super(nombre, ''); // Llamando al constructor de Usuario con nombre y email vacío
        this.productosEnVenta = [];
    }

    agregarProductoEnVenta(producto) {
        this.productosEnVenta.push(producto);
    }

    consultarProductosEnVenta() {
        console.log("Productos en venta:");
        for (let producto of this.productosEnVenta) {
            console.log(`${producto.id} - ${producto.nombre} - Precio: ${producto.precio}`);
        }
    }
}

module.exports = Administrador;
