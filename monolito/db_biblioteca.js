if (typeof window.db === "undefined") {
    throw new Error("No se pudo conectar a la base de datos.");
} else {
    console.log("Conexión exitosa a la base de datos.");
}

class FirebaseService {
    constructor(db) {
        this.db = db;
    }

    // Métodos para libros
    getLibros() {
        return this.db.collection('libros').get().then(snapshot => {
            const libros = [];
            snapshot.forEach(doc => {
                libros.push({ id: doc.id, ...doc.data() });
            });
            return libros;
        });
    }

    addLibro(libro) {
        // Libro must be and object with title, author
        if (!libro.title || !libro.author) {
            throw new Error('Title and author are required.');
        }

        return this.db.collection('libros').add(libro);
    }

    editLibro(id, updatedData) {
        if (!id || !updatedData) {
            throw new Error('ID and updated data are required.');
        }

        return this.db.collection('libros').doc(id).update(updatedData);
    }

    deleteLibro(id) {
        if (!id) {
            throw new Error('ID is required.');
        }

        if (confirm("¿Estás seguro de que deseas eliminar este libro?")) {
            return this.db.collection('libros').doc(id).delete();
        } else {
            return Promise.resolve(); // No action taken
        }
    }


    // Métodos para usuarios
    getUsuarios() {
        return this.db.collection('usuarios').get().then(snapshot => {
            const usuarios = [];
            snapshot.forEach(doc => {
                usuarios.push({ id: doc.id, ...doc.data() });
            });
            return usuarios;
        });
    }

    addUsuario(usuario) {
        if (!usuario.nombre || !usuario.email) {
            throw new Error('Nombre y email son requeridos.');
        }
        return this.db.collection('usuarios').add(usuario);
    }

    editUsuario(id, updatedData) {
        if (!id || !updatedData) {
            throw new Error('ID y datos actualizados son requeridos.');
        }
        return this.db.collection('usuarios').doc(id).update(updatedData);
    }

    deleteUsuario(id) {
        if (!id) {
            throw new Error('ID es requerido.');
        }
        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            return this.db.collection('usuarios').doc(id).delete();
        } else {
            return Promise.resolve();
        }
    }

    // Métodos para préstamos
    getPrestamos() {
        return this.db.collection('prestamos').get().then(snapshot => {
            const prestamos = [];
            snapshot.forEach(doc => {
                prestamos.push({ id: doc.id, ...doc.data() });
            });
            return prestamos;
        });
    }

    addPrestamo(prestamo) {
        if (!prestamo.libroId || !prestamo.usuarioId || !prestamo.fechaPrestamo || !prestamo.libroTitulo || !prestamo.usuarioNombre) {
            throw new Error('Datos de préstamo incompletos.');
        }

        return this.db.collection('prestamos').add(prestamo);
    }

    editPrestamo(id, updatedData) {
        if (!id || !updatedData) {
            throw new Error('ID y datos actualizados son requeridos.');
        }
        return this.db.collection('prestamos').doc(id).update(updatedData);
    }

    deletePrestamo(id) {
        if (!id) {
            throw new Error('ID es requerido.');
        }
        if (confirm("¿Estás seguro de que deseas eliminar este préstamo?")) {
            return this.db.collection('prestamos').doc(id).delete();
        } else {
            return Promise.resolve();
        }
    }

}