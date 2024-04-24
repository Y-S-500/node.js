

const readline = require('readline');
const Usuario = require('./Usuario');
const Administrador = require('./Administrador');
const Carrito = require('./Carritos');
const Producto = require('./Producto');
const Categoria = require("./Categoria");


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const usuarioAlmacenado = new Usuario("Juan", "1234@gmail.com", Rol.USUARIO);
const administrador = new Administrador("drago", "1234@gmail.com", Rol.ADMINISTRADOR);
const usuarios = [];


const carritoUsuario = new Carrito(usuarioAlmacenado);
const producto1 = new Producto(1, "Camiseta", 20, 1);
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
    rl.question("¿Tiene una cuenta? (s/n): ", async (respuesta) => {
        if (respuesta.toLowerCase() === 's') {
            const usuarioIngresado = await ingresarDatosUsuario();

            if (administrador.nombre === usuarioIngresado.nombre && administrador.email === usuarioIngresado.email) {
                console.log("¡Bienvenido Administrador!");
                mostrarMenuAdministrador(administrador);
            } else {
                const usuarioExistente = usuarios.find(u => u.nombre === usuarioIngresado.nombre && u.email === usuarioIngresado.email);
                if (usuarioExistente) {
                    console.log("¡Bienvenido Usuario!");
                    mostrarMenuUsuario(usuarioExistente);
                } else {
                    console.log("Usuario no encontrado. Por favor, cree una cuenta.");
                    iniciarSesion();
                }
            }
        } else if (respuesta.toLowerCase() === 'n') {
            console.log("Creando cuenta...");
            const nuevoUsuarioIngresado = await ingresarDatosUsuario();
            const nuevoUsuario = new Usuario(nuevoUsuarioIngresado.nombre, nuevoUsuarioIngresado.email);
            console.log("¡Cuenta creada con éxito! Como usuario estándar.");
            mostrarMenuUsuario(nuevoUsuario);
        } else {
            console.log("Respuesta no válida.");
            rl.close();
        }
    });
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
    console.log("3. Agregar categoría");
    console.log("4. Asignar categoría a producto");
    console.log("5. Cerrar sesión");

    rl.question("Seleccione una opción: ", (opcion) => {
        switch (opcion) {
            case '1':
                rl.question("Ingrese el nombre del producto: ", (nombre) => {
                    rl.question("Ingrese el precio del producto: ", (precio) => {
                        rl.question("Ingrese la cantidad del producto: ", (cantidad) => {
                            rl.question("Seleccione la categoría del producto:\n", () => {
                                administrador.consultarCategorias();
                                rl.question("Ingrese el ID de la categoría: ", (categoriaId) => {
                                    const producto = new Producto(administrador.productosEnVenta.length + 1, nombre, parseFloat(precio), parseInt(cantidad));
                                    administrador.asignarCategoriaAProducto(producto, parseInt(categoriaId));
                                    mostrarMenuAdministrador(administrador);
                                });
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
                rl.question("Ingrese el ID de la categoría: ", (id) => {
                    rl.question("Ingrese el nombre de la categoría: ", (nombre) => {
                        administrador.agregarCategoria(parseInt(id), nombre);
                        mostrarMenuAdministrador(administrador);
                    });
                });
                break;
            case '4':
                administrador.consultarProductosEnVenta();
                administrador.consultarCategorias();
                rl.question("Ingrese el ID del producto: ", (productoId) => {
                    rl.question("Ingrese el ID de la categoría: ", (categoriaId) => {
                        administrador.asignarCategoriaAProducto(parseInt(productoId), parseInt(categoriaId));
                        mostrarMenuAdministrador(administrador);
                    });
                });
                break;
            case '5':
                console.log("Cerrando sesión...");
                iniciarSesion();
                break;
            default:
                console.log("Opción no válida");
                mostrarMenuAdministrador(administrador);
                break;
        }
    });
}

iniciarSesion();
