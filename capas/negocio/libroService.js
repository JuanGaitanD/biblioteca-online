// Capa de Negocio - Servicio de Libros
class LibroService {
    constructor(repository) {
        this.repository = repository;
    }

    // Validaciones de negocio para libros
    validarLibro(libro) {
        const errores = [];

        if (!libro.titulo || libro.titulo.trim().length === 0) {
            errores.push('El título es requerido');
        } else if (libro.titulo.trim().length < 2) {
            errores.push('El título debe tener al menos 2 caracteres');
        } else if (libro.titulo.trim().length > 200) {
            errores.push('El título no puede exceder 200 caracteres');
        }

        if (!libro.autor || libro.autor.trim().length === 0) {
            errores.push('El autor es requerido');
        } else if (libro.autor.trim().length < 2) {
            errores.push('El autor debe tener al menos 2 caracteres');
        } else if (libro.autor.trim().length > 100) {
            errores.push('El autor no puede exceder 100 caracteres');
        }

        // Validar caracteres especiales
        const tituloRegex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ.,;:()\-'"]+$/;
        if (libro.titulo && !tituloRegex.test(libro.titulo)) {
            errores.push('El título contiene caracteres no válidos');
        }

        if (libro.autor && !tituloRegex.test(libro.autor)) {
            errores.push('El autor contiene caracteres no válidos');
        }

        return errores;
    }

    // Procesar datos antes de guardar
    procesarLibro(libro) {
        return {
            titulo: libro.titulo.trim(),
            autor: libro.autor.trim(),
            fechaCreacion: new Date(),
            disponible: true
        };
    }

    // Obtener todos los libros
    async obtenerLibros() {
        try {
            return await this.repository.getLibros();
        } catch (error) {
            throw new Error(`Error al obtener libros: ${error.message}`);
        }
    }

    // Agregar nuevo libro
    async agregarLibro(libro) {
        try {
            // Validaciones de negocio
            const errores = this.validarLibro(libro);
            if (errores.length > 0) {
                throw new Error(errores.join(', '));
            }

            // Procesar datos
            const libroProcesado = this.procesarLibro(libro);

            // Guardar en repositorio
            return await this.repository.addLibro(libroProcesado);
        } catch (error) {
            throw new Error(`Error al agregar libro: ${error.message}`);
        }
    }

    // Editar libro existente
    async editarLibro(id, datosActualizados) {
        try {
            if (!id) {
                throw new Error('ID del libro es requerido');
            }

            // Validaciones de negocio
            const errores = this.validarLibro(datosActualizados);
            if (errores.length > 0) {
                throw new Error(errores.join(', '));
            }

            // Procesar datos
            const datosProcesados = this.procesarLibro(datosActualizados);

            // Actualizar en repositorio
            return await this.repository.editLibro(id, datosProcesados);
        } catch (error) {
            throw new Error(`Error al editar libro: ${error.message}`);
        }
    }

    // Eliminar libro
    async eliminarLibro(id) {
        try {
            if (!id) {
                throw new Error('ID del libro es requerido');
            }

            // Verificar reglas de negocio antes de eliminar
            const libros = await this.repository.getLibros();
            const libro = libros.find(l => l.id === id);
            
            if (!libro) {
                throw new Error('El libro no existe');
            }

            // Eliminar del repositorio
            return await this.repository.deleteLibro(id);
        } catch (error) {
            throw new Error(`Error al eliminar libro: ${error.message}`);
        }
    }

    // Obtener libros disponibles
    async obtenerLibrosDisponibles() {
        try {
            return await this.repository.getLibrosDisponibles();
        } catch (error) {
            throw new Error(`Error al obtener libros disponibles: ${error.message}`);
        }
    }

    // Buscar libros por título o autor
    async buscarLibros(termino) {
        try {
            const libros = await this.repository.getLibros();
            const terminoLower = termino.toLowerCase();
            
            return libros.filter(libro => 
                libro.titulo.toLowerCase().includes(terminoLower) ||
                libro.autor.toLowerCase().includes(terminoLower)
            );
        } catch (error) {
            throw new Error(`Error al buscar libros: ${error.message}`);
        }
    }
}

// Instancia global del servicio
window.libroService = new LibroService(window.bibliotecaRepository);
