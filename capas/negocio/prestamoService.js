// Capa de Negocio - Servicio de Préstamos
class PrestamoService {
    constructor(repository) {
        this.repository = repository;
    }

    // Validaciones de negocio para préstamos
    validarPrestamo(prestamo) {
        const errores = [];

        if (!prestamo.libroId) {
            errores.push('ID del libro es requerido');
        }

        if (!prestamo.usuarioId) {
            errores.push('ID del usuario es requerido');
        }

        return errores;
    }

    // Reglas de negocio para préstamos
    async aplicarReglasNegocio(prestamo) {
        try {
            // Verificar que el libro existe
            const libros = await this.repository.getLibros();
            const libro = libros.find(l => l.id === prestamo.libroId);
            
            if (!libro) {
                throw new Error('El libro no existe');
            }

            // Verificar que el usuario existe
            const usuarios = await this.repository.getUsuarios();
            const usuario = usuarios.find(u => u.id === prestamo.usuarioId);
            
            if (!usuario) {
                throw new Error('El usuario no existe');
            }

            // Verificar que el libro está disponible
            if (!libro.disponible) {
                throw new Error('El libro no está disponible');
            }

            // Verificar si el libro ya está prestado
            const prestamosActivos = await this.repository.getPrestamosActivos();
            const libroYaPrestado = prestamosActivos.some(p => p.libroId === prestamo.libroId);
            
            if (libroYaPrestado) {
                throw new Error('Este libro ya está prestado');
            }

            // Verificar límite de préstamos por usuario (regla de negocio)
            const prestamosUsuario = prestamosActivos.filter(p => p.usuarioId === prestamo.usuarioId);
            const limitePrestamos = 5; // Regla de negocio: máximo 5 préstamos por usuario
            
            if (prestamosUsuario.length >= limitePrestamos) {
                throw new Error(`El usuario ya tiene el máximo de préstamos permitidos (${limitePrestamos})`);
            }

            return {
                libro,
                usuario,
                prestamosUsuario: prestamosUsuario.length
            };
        } catch (error) {
            throw new Error(`Error en reglas de negocio: ${error.message}`);
        }
    }

    // Procesar datos antes de guardar
    procesarPrestamo(prestamo, libro, usuario) {
        return {
            libroId: prestamo.libroId,
            usuarioId: prestamo.usuarioId,
            libroTitulo: libro.titulo,
            libroAutor: libro.autor,
            usuarioNombre: usuario.nombre,
            usuarioEmail: usuario.email,
            fechaPrestamo: new Date(),
            fechaDevolucion: null,
            estado: 'activo'
        };
    }

    // Obtener préstamos activos
    async obtenerPrestamosActivos() {
        try {
            return await this.repository.getPrestamosActivos();
        } catch (error) {
            throw new Error(`Error al obtener préstamos activos: ${error.message}`);
        }
    }

    // Obtener historial de préstamos
    async obtenerHistorialPrestamos() {
        try {
            return await this.repository.getHistorialPrestamos();
        } catch (error) {
            throw new Error(`Error al obtener historial de préstamos: ${error.message}`);
        }
    }

    // Agregar nuevo préstamo
    async agregarPrestamo(prestamo) {
        try {
            // Validaciones de negocio
            const errores = this.validarPrestamo(prestamo);
            if (errores.length > 0) {
                throw new Error(errores.join(', '));
            }

            // Aplicar reglas de negocio
            const { libro, usuario } = await this.aplicarReglasNegocio(prestamo);

            // Procesar datos
            const prestamoProcesado = this.procesarPrestamo(prestamo, libro, usuario);

            // Guardar en repositorio
            return await this.repository.addPrestamo(prestamoProcesado);
        } catch (error) {
            throw new Error(`Error al agregar préstamo: ${error.message}`);
        }
    }

    // Devolver préstamo
    async devolverPrestamo(prestamoId) {
        try {
            if (!prestamoId) {
                throw new Error('ID del préstamo es requerido');
            }

            // Verificar que el préstamo existe y está activo
            const prestamosActivos = await this.repository.getPrestamosActivos();
            const prestamo = prestamosActivos.find(p => p.id === prestamoId);
            
            if (!prestamo) {
                throw new Error('El préstamo no existe o ya fue devuelto');
            }

            // Aplicar reglas de negocio para devolución
            const fechaPrestamo = new Date(prestamo.fechaPrestamo.seconds * 1000);
            const fechaActual = new Date();
            const diasPrestado = Math.floor((fechaActual - fechaPrestamo) / (1000 * 60 * 60 * 24));
            const limiteDias = 30; // Regla de negocio: máximo 30 días

            if (diasPrestado > limiteDias) {
                console.warn(`Préstamo devuelto con ${diasPrestado} días de retraso (límite: ${limiteDias} días)`);
            }

            // Devolver en repositorio
            return await this.repository.devolverPrestamo(prestamoId);
        } catch (error) {
            throw new Error(`Error al devolver préstamo: ${error.message}`);
        }
    }

    // Eliminar préstamo
    async eliminarPrestamo(id) {
        try {
            if (!id) {
                throw new Error('ID del préstamo es requerido');
            }

            // Verificar reglas de negocio antes de eliminar
            const prestamosActivos = await this.repository.getPrestamosActivos();
            const prestamo = prestamosActivos.find(p => p.id === id);
            
            if (!prestamo) {
                throw new Error('El préstamo no existe');
            }

            // Eliminar del repositorio
            return await this.repository.deletePrestamo(id);
        } catch (error) {
            throw new Error(`Error al eliminar préstamo: ${error.message}`);
        }
    }

    // Obtener estadísticas de préstamos
    async obtenerEstadisticas() {
        try {
            const prestamosActivos = await this.repository.getPrestamosActivos();
            const historial = await this.repository.getHistorialPrestamos();
            
            return {
                prestamosActivos: prestamosActivos.length,
                totalPrestamos: prestamosActivos.length + historial.length,
                prestamosVencidos: prestamosActivos.filter(p => {
                    const fechaPrestamo = new Date(p.fechaPrestamo.seconds * 1000);
                    const diasPrestado = Math.floor((new Date() - fechaPrestamo) / (1000 * 60 * 60 * 24));
                    return diasPrestado > 30;
                }).length
            };
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }

    // Buscar préstamos por libro o usuario
    async buscarPrestamos(termino) {
        try {
            const prestamosActivos = await this.repository.getPrestamosActivos();
            const historial = await this.repository.getHistorialPrestamos();
            const todosPrestamos = [...prestamosActivos, ...historial];
            
            const terminoLower = termino.toLowerCase();
            
            return todosPrestamos.filter(prestamo => 
                prestamo.libroTitulo.toLowerCase().includes(terminoLower) ||
                prestamo.usuarioNombre.toLowerCase().includes(terminoLower)
            );
        } catch (error) {
            throw new Error(`Error al buscar préstamos: ${error.message}`);
        }
    }
}

// Instancia global del servicio
window.prestamoService = new PrestamoService(window.bibliotecaRepository);
