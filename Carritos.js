class Carritos {
    constructor(usuario) {
        this.usuario = usuario;
        this.productos = [];
    }

    agregarProducto(producto) {
        this.productos.push(producto);
    }

    eliminarProducto(id) {
        this.productos = this.productos.filter(producto => producto.id !== id);
    }

    calcularTotalCarrito() {
        let total = 0;
        for (let producto of this.productos) {
            total += producto.precio * producto.cantidad;
        }
        return total;
    }

    imprimirResumenCarrito() {
        console.log(`Resumen del carrito para ${this.usuario.nombre}:`);
        for (let producto of this.productos) {
            console.log(`${producto.nombre} - Cantidad: ${producto.cantidad} - Precio unitario: ${producto.precio} - Total: ${producto.precio * producto.cantidad}`);
        }
        console.log(`Total del carrito: ${this.calcularTotalCarrito()}`);
    }

    generarFactura() {
        console.log(`Factura para ${this.usuario.nombre}:`);
        this.imprimirResumenCarrito();
        console.log("¡Gracias por su compra!");
    }
}

module.exports = Carritos;
