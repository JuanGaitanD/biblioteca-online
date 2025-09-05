if (typeof window.db === "undefined") {
    throw new Error("No se pudo conectar a la base de datos.");
} else {
    console.log("Conexión exitosa a la base de datos.");
}

// Capa de Datos - Repositorio de Biblioteca
class BibliotecaRepository {
    constructor(db) {
        this.db = db;
    }

    // Métodos para libros
    async getLibros() {
        try {
            if (window.showLoader) window.showLoader('Cargando libros...');
            const snapshot = await this.db.collection('libros').get();
            const libros = [];
            snapshot.forEach(doc => {
                libros.push({ id: doc.id, ...doc.data() });
            });
            
            // Ordenar en JavaScript para evitar necesidad de índice
            return libros.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } catch (error) {
            console.error('Error al obtener libros:', error);
            throw error;
        } finally {
            if (window.hideLoader) window.hideLoader();
        }
    }

    async addLibro(libro) {
        try {
            if (window.showLoader) window.showLoader('Agregando libro...');
            // Validar datos del libro
            if (!libro.titulo || !libro.autor) {
                throw new Error('Título y autor son requeridos.');
            }

            // Verificar si el libro ya existe
            const existingBooks = await this.db.collection('libros')
                .where('titulo', '==', libro.titulo)
                .where('autor', '==', libro.autor)
                .get();

            if (!existingBooks.empty) {
                throw new Error('Este libro ya existe en la biblioteca.');
            }

            // Agregar fecha de creación
            const libroData = {
                titulo: libro.titulo.trim(),
                autor: libro.autor.trim(),
                fechaCreacion: new Date(),
                disponible: true
            };

            const docRef = await this.db.collection('libros').add(libroData);
            return docRef.id;
        } catch (error) {
            console.error('Error al agregar libro:', error);
            throw error;
        } finally {
            if (window.hideLoader) window.hideLoader();
        }
    }

    async editLibro(id, updatedData) {
        try {
            if (!id || !updatedData) {
                throw new Error('ID y datos actualizados son requeridos.');
            }

            // Validar datos
            if (updatedData.titulo && !updatedData.titulo.trim()) {
                throw new Error('El título no puede estar vacío.');
            }
            if (updatedData.autor && !updatedData.autor.trim()) {
                throw new Error('El autor no puede estar vacío.');
            }

            // Limpiar datos
            const cleanData = {};
            if (updatedData.titulo) cleanData.titulo = updatedData.titulo.trim();
            if (updatedData.autor) cleanData.autor = updatedData.autor.trim();

            await this.db.collection('libros').doc(id).update(cleanData);
            return true;
        } catch (error) {
            console.error('Error al editar libro:', error);
            throw error;
        }
    }

    async deleteLibro(id) {
        try {
            if (!id) {
                throw new Error('ID es requerido.');
            }

            // Verificar si el libro tiene préstamos activos
            const prestamosActivos = await this.db.collection('prestamos')
                .where('libroId', '==', id)
                .where('fechaDevolucion', '==', null)
                .get();

            if (!prestamosActivos.empty) {
                throw new Error('No se puede eliminar un libro que tiene préstamos activos.');
            }

            await this.db.collection('libros').doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error al eliminar libro:', error);
            throw error;
        }
    }

    // Métodos para usuarios
    async getUsuarios() {
        try {
            if (window.showLoader) window.showLoader('Cargando usuarios...');
            const snapshot = await this.db.collection('usuarios').get();
            const usuarios = [];
            snapshot.forEach(doc => {
                usuarios.push({ id: doc.id, ...doc.data() });
            });
            
            // Ordenar en JavaScript para evitar necesidad de índice
            return usuarios.sort((a, b) => a.nombre.localeCompare(b.nombre));
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        } finally {
            if (window.hideLoader) window.hideLoader();
        }
    }

    async addUsuario(usuario) {
        try {
            if (window.showLoader) window.showLoader('Agregando usuario...');
            if (!usuario.nombre || !usuario.email) {
                throw new Error('Nombre y email son requeridos.');
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(usuario.email)) {
                throw new Error('El formato del email no es válido.');
            }

            // Verificar si el email ya existe
            const existingUsers = await this.db.collection('usuarios')
                .where('email', '==', usuario.email.toLowerCase())
                .get();

            if (!existingUsers.empty) {
                throw new Error('Ya existe un usuario con este email.');
            }

            const usuarioData = {
                nombre: usuario.nombre.trim(),
                email: usuario.email.toLowerCase().trim(),
                fechaRegistro: new Date(),
                activo: true
            };

            const docRef = await this.db.collection('usuarios').add(usuarioData);
            return docRef.id;
        } catch (error) {
            console.error('Error al agregar usuario:', error);
            throw error;
        } finally {
            if (window.hideLoader) window.hideLoader();
        }
    }

    async editUsuario(id, updatedData) {
        try {
            if (!id || !updatedData) {
                throw new Error('ID y datos actualizados son requeridos.');
            }

            // Validar datos
            if (updatedData.nombre && !updatedData.nombre.trim()) {
                throw new Error('El nombre no puede estar vacío.');
            }
            if (updatedData.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(updatedData.email)) {
                    throw new Error('El formato del email no es válido.');
                }
            }

            // Limpiar datos
            const cleanData = {};
            if (updatedData.nombre) cleanData.nombre = updatedData.nombre.trim();
            if (updatedData.email) cleanData.email = updatedData.email.toLowerCase().trim();

            await this.db.collection('usuarios').doc(id).update(cleanData);
            return true;
        } catch (error) {
            console.error('Error al editar usuario:', error);
            throw error;
        }
    }

    async deleteUsuario(id) {
        try {
            if (!id) {
                throw new Error('ID es requerido.');
            }

            // Verificar si el usuario tiene préstamos activos
            const prestamosActivos = await this.db.collection('prestamos')
                .where('usuarioId', '==', id)
                .where('fechaDevolucion', '==', null)
                .get();

            if (!prestamosActivos.empty) {
                throw new Error('No se puede eliminar un usuario que tiene préstamos activos.');
            }

            await this.db.collection('usuarios').doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    }

    // Métodos para préstamos
    async getPrestamosActivos() {
        try {
            if (window.showLoader) window.showLoader('Cargando préstamos activos...');
            const snapshot = await this.db.collection('prestamos')
                .where('fechaDevolucion', '==', null)
                .get();
            
            const prestamos = [];
            snapshot.forEach(doc => {
                prestamos.push({ id: doc.id, ...doc.data() });
            });
            
            // Ordenar en JavaScript para evitar necesidad de índice compuesto
            return prestamos.sort((a, b) => {
                const fechaA = a.fechaPrestamo?.seconds || 0;
                const fechaB = b.fechaPrestamo?.seconds || 0;
                return fechaB - fechaA; // Orden descendente
            });
        } catch (error) {
            console.error('Error al obtener préstamos activos:', error);
            throw error;
        } finally {
            if (window.hideLoader) window.hideLoader();
        }
    }

    async getHistorialPrestamos() {
        try {
            if (window.showLoader) window.showLoader('Cargando historial de préstamos...');
            const snapshot = await this.db.collection('prestamos')
                .where('fechaDevolucion', '!=', null)
                .get();
            
            const prestamos = [];
            snapshot.forEach(doc => {
                prestamos.push({ id: doc.id, ...doc.data() });
            });
            
            // Ordenar en JavaScript para evitar necesidad de índice compuesto
            return prestamos.sort((a, b) => {
                const fechaA = a.fechaDevolucion?.seconds || 0;
                const fechaB = b.fechaDevolucion?.seconds || 0;
                return fechaB - fechaA; // Orden descendente
            });
        } catch (error) {
            console.error('Error al obtener historial de préstamos:', error);
            throw error;
        } finally {
            if (window.hideLoader) window.hideLoader();
        }
    }

    async addPrestamo(prestamo) {
        try {
            if (window.showLoader) window.showLoader('Registrando préstamo...');
            if (!prestamo.libroId || !prestamo.usuarioId) {
                throw new Error('ID del libro y usuario son requeridos.');
            }

            // Verificar que el libro existe y está disponible
            const libroDoc = await this.db.collection('libros').doc(prestamo.libroId).get();
            if (!libroDoc.exists) {
                throw new Error('El libro no existe.');
            }

            // Verificar que el usuario existe
            const usuarioDoc = await this.db.collection('usuarios').doc(prestamo.usuarioId).get();
            if (!usuarioDoc.exists) {
                throw new Error('El usuario no existe.');
            }

            // Verificar si el libro ya está prestado
            const prestamosActivos = await this.db.collection('prestamos')
                .where('libroId', '==', prestamo.libroId)
                .where('fechaDevolucion', '==', null)
                .get();

            if (!prestamosActivos.empty) {
                throw new Error('Este libro ya está prestado.');
            }

            const libroData = libroDoc.data();
            const usuarioData = usuarioDoc.data();

            const prestamoData = {
                libroId: prestamo.libroId,
                usuarioId: prestamo.usuarioId,
                libroTitulo: libroData.titulo,
                libroAutor: libroData.autor,
                usuarioNombre: usuarioData.nombre,
                usuarioEmail: usuarioData.email,
                fechaPrestamo: new Date(),
                fechaDevolucion: null,
                estado: 'activo'
            };

            const docRef = await this.db.collection('prestamos').add(prestamoData);
            return docRef.id;
        } catch (error) {
            console.error('Error al agregar préstamo:', error);
            throw error;
        } finally {
            if (window.hideLoader) window.hideLoader();
        }
    }

    async devolverPrestamo(prestamoId) {
        try {
            if (window.showLoader) window.showLoader('Devolviendo libro...');
            if (!prestamoId) {
                throw new Error('ID del préstamo es requerido.');
            }

            const prestamoDoc = await this.db.collection('prestamos').doc(prestamoId).get();
            if (!prestamoDoc.exists) {
                throw new Error('El préstamo no existe.');
            }

            const prestamoData = prestamoDoc.data();
            if (prestamoData.fechaDevolucion !== null) {
                throw new Error('Este préstamo ya fue devuelto.');
            }

            await this.db.collection('prestamos').doc(prestamoId).update({
                fechaDevolucion: new Date(),
                estado: 'devuelto'
            });

            return true;
        } catch (error) {
            console.error('Error al devolver préstamo:', error);
            throw error;
        } finally {
            if (window.hideLoader) window.hideLoader();
        }
    }

    async deletePrestamo(id) {
        try {
            if (!id) {
                throw new Error('ID es requerido.');
            }

            await this.db.collection('prestamos').doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error al eliminar préstamo:', error);
            throw error;
        }
    }

    // Métodos auxiliares
    async getLibrosDisponibles() {
        try {
            if (window.showLoader) window.showLoader('Cargando libros disponibles...');
            const snapshot = await this.db.collection('libros')
                .where('disponible', '==', true)
                .get();
            
            const libros = [];
            snapshot.forEach(doc => {
                libros.push({ id: doc.id, ...doc.data() });
            });
            
            // Ordenar en JavaScript para evitar necesidad de índice compuesto
            return libros.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } catch (error) {
            console.error('Error al obtener libros disponibles:', error);
            throw error;
        } finally {
            if (window.hideLoader) window.hideLoader();
        }
    }

    async getUsuariosActivos() {
        try {
            if (window.showLoader) window.showLoader('Cargando usuarios activos...');
            const snapshot = await this.db.collection('usuarios')
                .where('activo', '==', true)
                .get();
            
            const usuarios = [];
            snapshot.forEach(doc => {
                usuarios.push({ id: doc.id, ...doc.data() });
            });
            
            // Ordenar en JavaScript para evitar necesidad de índice compuesto
            return usuarios.sort((a, b) => a.nombre.localeCompare(b.nombre));
        } catch (error) {
            console.error('Error al obtener usuarios activos:', error);
            throw error;
        } finally {
            if (window.hideLoader) window.hideLoader();
        }
    }
}

// Instancia global del repositorio
window.bibliotecaRepository = new BibliotecaRepository(db);
