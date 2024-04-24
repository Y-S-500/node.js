const readline = require('readline');
const Usuario = require('./Usuario');
const Administrador = require('./Administrador');
const Carrito = require('./Carritos');
const Producto = require('./Producto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function ingresarDatosUsuario() {
    return new Promise((resolve, reject) => {
        rl.question("Ingrese su nombre: ", (nombre) => {
            rl.question("Ingrese su email: ", (email) => {
                const usuarioIngresado = new Usuario(nombre, email);
                resolve(usuarioIngresado);
            });
        });
    });
}

async function iniciarSesion() {
    const usuarioAlmacenado = new Usuario("Juan", "1234@gmail.com");
    const administrador = new Administrador("drago", "1234@gmail.com");
    const usuarioIngresado = await ingresarDatosUsuario();

    if (usuarioAlmacenado.compararDatos(usuarioIngresado)) {
        console.log("¡Bienvenido de nuevo!");
        mostrarMenu(usuarioIngresado);
    } else {
        console.log("Los datos ingresados no coinciden con los almacenados.");
        rl.close();
    }
}

function agregarProductoAlCarrito(producto, carritoUsuario) {
    carritoUsuario.agregarProducto(producto);
    console.log(`${producto.nombre} agregado al carrito.`);
}

function eliminarProductoDelCarrito(id, carritoUsuario) {
    const producto = carritoUsuario.productos.find(prod => prod.id === id);
    if (producto) {
        carritoUsuario.eliminarProducto(id);
        console.log(`${producto.nombre} eliminado del carrito.`);
    } else {
        console.log("El producto no está en el carrito.");
    }
}

function mostrarMenu(usuario) {
    const usuarioAlmacenado = new Usuario("Juan", "1234@gmail.com");
    const administrador = new Administrador("drago", "1234@gmail.com");
    const carritoUsuario = new Carrito(usuarioAlmacenado);
    console.log("Bienvenido Usuario!");
    console.log("=== Menú Usuario ===");
    console.log("1. Ver productos en venta");
    console.log("2. Ver carrito de compras");
    console.log("3. Agregar producto al carrito");
    console.log("4. Eliminar producto del carrito");
    console.log("5. Comprar");
    console.log("6. Salir");

    rl.question("Seleccione una opción: ", (opcion) => {
        switch (opcion) {
            case '1':
                administrador.consultarProductosEnVenta();
                mostrarMenu(usuario);
                break;
            case '2':
                carritoUsuario.imprimirResumenCarrito();
                mostrarMenu(usuario);
                break;
            case '3':
                administrador.consultarProductosEnVenta();
                rl.question("Ingrese el ID del producto que desea agregar al carrito: ", (id) => {
                    const producto = administrador.productosEnVenta.find(prod => prod.id === parseInt(id));
                    if (producto) {
                        agregarProductoAlCarrito(producto, carritoUsuario);
                    } else {
                        console.log("Producto no encontrado.");
                    }
                    mostrarMenu(usuario);
                });
                break;
            case '4':
                carritoUsuario.imprimirResumenCarrito();
                rl.question("Ingrese el ID del producto que desea eliminar del carrito: ", (id) => {
                    eliminarProductoDelCarrito(parseInt(id), carritoUsuario);
                    mostrarMenu(usuario);
                });
                break;
            case '5':
                if (carritoUsuario.productos.length === 0) {
                    console.log("El carrito de compras está vacío. No se puede generar la factura.");
                    mostrarMenu(usuario);
                } else {
                    console.log("\nGenerando factura...");
                    carritoUsuario.generarFactura();
                    carritoUsuario.productos = []; // Vaciamos el carrito después de la compra
                    console.log("¡Compra realizada con éxito!");
                    mostrarMenu(usuario);
                }
                break;
            case '6':
                console.log("Saliendo del programa...");
                rl.close();
                break;
            default:
                console.log("Opción no válida");
                mostrarMenu(usuario);
                break;
        }
    });
}

async function iniciarPrograma() {
    await iniciarSesion();
}

iniciarPrograma();
