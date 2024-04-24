class Usuario {
    constructor(nombre, email) {
        this.nombre = nombre;
        this.email = email;
    }

    compararDatos(usuario) {
        return this.nombre === usuario.nombre && this.email === usuario.email;
    }
}

module.exports = Usuario;
