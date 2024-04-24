const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Usuario {
    constructor(nombre, email) {
        this.nombre = nombre;
        this.email = email;
    }

    // Método para comparar datos de usuario
    compararDatos(usuario) {
        return this.nombre === usuario.nombre && this.email === usuario.email;
    }
}

class Producto {
    constructor(id, nombre, precio, cantidad) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
    }
}

class Carrito {
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

// Ejemplo de uso

const usuarioAlmacenado = new Usuario("Juan", "1234@gmail.com");
const administrador = new Administrador("drago", "1234@gmail.com");


const carritoUsuario = new Carrito(usuarioAlmacenado);


const producto1 = new Producto(1, "Camiseta", 20, 2);
const producto2 = new Producto(2, "Pantalón", 30, 1);

administrador.agregarProductoEnVenta(producto1);
administrador.agregarProductoEnVenta(producto2);

function ingresarDatosUsuario() {
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
    const usuarioIngresado = await ingresarDatosUsuario();

    if (usuarioAlmacenado.compararDatos(usuarioIngresado)) {
        console.log("¡Bienvenido de nuevo!");
        mostrarMenu(usuarioIngresado);
    } else {
        console.log("Los datos ingresados no coinciden con los almacenados.");
        rl.close();
    }
}
function agregarProductoAlCarrito(producto) {
    carritoUsuario.agregarProducto(producto);
    console.log(`${producto.nombre} agregado al carrito.`);
}

function eliminarProductoDelCarrito(id) {
    const producto = carritoUsuario.productos.find(prod => prod.id === id);
    if (producto) {
        carritoUsuario.eliminarProducto(id);
        console.log(`${producto.nombre} eliminado del carrito.`);
    } else {
        console.log("El producto no está en el carrito.");
    }
}
function mostrarMenuUsuario(usuario) {
    console.log("\n=== Menú Usuario ===");
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
                mostrarMenuUsuario(usuario);
                break;
            case '2':
                carritoUsuario.imprimirResumenCarrito();
                mostrarMenuUsuario(usuario);
                break;
            case '3':
                administrador.consultarProductosEnVenta();
                rl.question("Ingrese el ID del producto que desea agregar al carrito: ", (id) => {
                    const producto = administrador.productosEnVenta.find(prod => prod.id === parseInt(id));
                    if (producto) {
                        agregarProductoAlCarrito(producto);
                    } else {
                        console.log("Producto no encontrado.");
                    }
                    mostrarMenuUsuario(usuario);
                });
                break;
            case '4':
                carritoUsuario.imprimirResumenCarrito();
                rl.question("Ingrese el ID del producto que desea eliminar del carrito: ", (id) => {
                    eliminarProductoDelCarrito(parseInt(id));
                    mostrarMenuUsuario(usuario);
                });
                break;
            case '5':
                if (carritoUsuario.productos.length === 0) {
                    console.log("El carrito de compras está vacío. No se puede generar la factura.");
                    mostrarMenuUsuario(usuario);
                } else {
                    console.log("\nGenerando factura...");
                    carritoUsuario.generarFactura();
                    carritoUsuario.productos = []; // Vaciamos el carrito después de la compra
                    console.log("¡Compra realizada con éxito!");
                    mostrarMenuUsuario(usuario);
                }
                break;
            case '6':
                console.log("Saliendo del programa...");
                rl.close();
                break;
            default:
                console.log("Opción no válida");
                mostrarMenuUsuario(usuario);
                break;
        }
    });
}

function mostrarMenuAdministrador(administrador) {
    console.log("\n=== Menú Administrador ===");
    console.log("1. Agregar producto en venta");
    console.log("2. Consultar productos en venta");
    console.log("3. cerrar sesion");

    rl.question("Seleccione una opción: ", (opcion) => {
        switch (opcion) {
            case '1':
                // Lógica para agregar producto en venta
                rl.question("Ingrese el ID del producto: ", (id) => {
                    rl.question("Ingrese el nombre del producto: ", (nombre) => {
                        rl.question("Ingrese el precio del producto: ", (precio) => {
                            rl.question("Ingrese la cantidad del producto: ", (cantidad) => {
                                administrador.agregarProductoEnVenta(new Producto(parseInt(id), nombre, parseFloat(precio), parseInt(cantidad)));
                                console.log("Producto agregado en venta.");
                                mostrarMenuAdministrador(administrador);
                            });
                        });
                    });
                });
                break;
            case '2':
                administrador.consultarProductosEnVenta();
                mostrarMenuAdministrador(administrador);
                break;
            case '3':
                console.log("cerrando secion...");
                iniciarSesion();

            
                break;
            default:
                console.log("Opción no válida");
                mostrarMenuAdministrador(administrador);
                break;
        }
    });
}

async function iniciarSesion() {
    const usuarioIngresado = await ingresarDatosUsuario();

    if (administrador.nombre === usuarioIngresado.nombre) {

        console.log("¡Bienvenido Administrador!");
        mostrarMenuAdministrador(administrador);
    } else {
        console.log("¡Bienvenido Usuario!");
        mostrarMenuUsuario(usuarioIngresado);
    }
}

iniciarSesion();
