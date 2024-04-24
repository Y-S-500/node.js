class Categoria {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}

const categoriasPorDefecto = [
    new Categoria(1, "Ropa"),
    new Categoria(2, "Electrónica"),
    new Categoria(3, "Hogar")
];

module.exports = Categoria;
