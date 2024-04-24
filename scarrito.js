const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Rol {
    static ADMINISTRADOR = 'Administrador';
    static USUARIO = 'Usuario';
}

class Usuario {
    constructor(nombre, email, rol) {
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
    }
}

class Producto {

    static contadorId = 1;

    constructor(nombre, precio, cantidad) {
        this.id =  Producto.contadorId++;
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

    imprimirResumenCarrito(usuario) {
        console.log(`Resumen del carrito para ${usuario.nombre}:`); 
        for (let producto of this.productos) {
            console.log(`${producto.nombre} - Cantidad: ${producto.cantidad} - Precio unitario: ${producto.precio} - Total: ${producto.precio * producto.cantidad}`);
        }
        console.log(`Total del carrito: ${this.calcularTotalCarrito()}`);
    }
    
    generarFactura(usuario) {
        console.log(`Factura para ${usuario.nombre}:`); 
        this.imprimirResumenCarrito(usuario);
        console.log("¡Gracias por su compra!");
    }
}

// class Administrador extends Usuario {
//     constructor(nombre, email) {
//         super(nombre, email, Rol.ADMINISTRADOR);
//         this.productosEnVenta = [];
//         this.categorias = categoriasPorDefecto;

//     }
//     agregarCategoria(categoria) {
//         this.categorias.push(categoria);
//     }
//     agregarProductoEnVenta(producto) {
//         this.productosEnVenta.push(producto);
//     }
//     asignarCategoriaAProducto(producto, categoriaId) {
//         const categoriaSeleccionada = this.categorias.find(cat => cat.id === categoriaId);
//         if (categoriaSeleccionada) {
//             producto.categoria = categoriaSeleccionada;
//             this.productosEnVenta.push(producto);
//             console.log(`Producto "${producto.nombre}" agregado a la categoría "${categoriaSeleccionada.nombre}" con éxito.`);
//         } else {
//             console.log("Categoría no encontrada.");
//         }
//     }

//     consultarProductosEnVenta() {
//         console.log("Productos en venta:");
//         for (let producto of this.productosEnVenta) {
//             console.log(`${producto.id} - ${producto.nombre} - Precio: ${producto.precio}`);
//         }
//     }
// }

class Categoria {
    static contadorId = 1;

    constructor(nombre) {
        this.id = Categoria.contadorId++;
        this.nombre = nombre;
    }
}

// categorías por defecto
const categoriasPorDefecto = [
    new Categoria( "Ropa"),
    new Categoria( "Electrónica"),
    new Categoria( "Hogar")
];

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
    

    agregarCategoria( nombre) {
        const nuevaCategoria = new Categoria( nombre);
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


const usuarioAlmacenado = new Usuario();
const administrador = new Administrador("drago", "1234@gmail.com", Rol.ADMINISTRADOR);
const usuarios = [];
const carritoUsuario = new Carrito(usuarioAlmacenado);
const producto1 = new Producto( "Camiseta", 20, 1);
const producto2 = new Producto( "Pantalón", 30, 1);

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
}async function iniciarSesion() {
    rl.question("¿Tiene una cuenta? (s/n): ", async (respuesta) => {
        if (respuesta.toLowerCase() === 's') {
            const usuarioIngresado = await ingresarDatosUsuario();

            if (administrador.nombre === usuarioIngresado.nombre && administrador.email === usuarioIngresado.email) {
                console.log("¡Bienvenido Administrador!");
                mostrarMenuAdministrador(administrador);
            } else {
                // Si no es administrador, verifica si es un usuario existente
                const usuarioExistente = usuarios.find(u => u.nombre === usuarioIngresado.nombre && u.email === usuarioIngresado.email);
                if (usuarioExistente) {
                    console.log("¡Bienvenido Usuario!");
                    mostrarMenuUsuario(usuarioExistente);
                } else {
                    console.log("Usuario no encontrado. Por favor, cree una cuenta.");
                    iniciarSesion();
                    
                    // O podrías mostrar un mensaje de error y cerrar la sesión
                    // rl.close();
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
                carritoUsuario.imprimirResumenCarrito(usuario);
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
                        carritoUsuario.generarFactura(usuario); // Pasa el usuario como argumento
                        carritoUsuario.productos = []; // Vacía el carrito después de la compra
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

// function mostrarMenuAdministrador(administrador) {
//     console.log("\n=== Menú Administrador ===");
//     console.log("1. Agregar producto en venta");
//     console.log("2. Consultar productos en venta");
//     console.log("3. Cerrar sesión");

//     rl.question("Seleccione una opción: ", (opcion) => {
//         switch (opcion) {
//             case '1':
//                 rl.question("Ingrese el ID del producto: ", (id) => {
//                     rl.question("Ingrese el nombre del producto: ", (nombre) => {
//                         rl.question("Ingrese el precio del producto: ", (precio) => {
//                             rl.question("Ingrese la cantidad del producto: ", (cantidad) => {
//                                 administrador.agregarProductoEnVenta(new Producto(parseInt(id), nombre, parseFloat(precio), parseInt(cantidad)));
//                                 console.log("Producto agregado en venta.");
//                                 mostrarMenuAdministrador(administrador);
//                             });
//                         });
//                     });
//                 });
//                 break;
//             case '2':
//                 administrador.consultarProductosEnVenta();
//                 mostrarMenuAdministrador(administrador);
//                 break;
//             case '3':
//                 console.log("Cerrando sesión...");
//                 iniciarSesion();
//                 break;
//             default:
//                 console.log("Opción no válida");
//                 mostrarMenuAdministrador(administrador);
//                 break;
//         }
//     });
// }
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
                            
                            const producto = new Producto(nombre, parseFloat(precio), parseInt(cantidad));
                            
                            // Agregar el producto a la lista de productos en venta
                            administrador.agregarProductoEnVenta(producto);
            
                            // Consultar los productos en venta para obtener el ID del producto recién agregado
                            administrador.consultarProductosEnVenta();
                            rl.question("Seleccione el ID del producto que desea asignar una categoría: ", (productoId) => {
                                // Consultar las categorías disponibles
                                administrador.consultarCategorias();
                                rl.question("Seleccione el ID de la categoría del producto: ", (categoriaId) => {
                                    // Asignar la categoría al producto
                                    administrador.asignarCategoriaAProducto(parseInt(productoId), parseInt(categoriaId));
                                    
                                    // Mostrar el menú del administrador
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
                
                    rl.question("Ingrese el nombre de la categoría: ", (nombre) => {
                        administrador.agregarCategoria(nombre);

                        mostrarMenuAdministrador(administrador);
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
