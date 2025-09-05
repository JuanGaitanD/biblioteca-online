// Capa de Aplicación - Coordinador de la Biblioteca
class BibliotecaApp {
    constructor() {
        this.libroService = window.libroService;
        this.usuarioService = window.usuarioService;
        this.prestamoService = window.prestamoService;
    }

    // Método para mostrar mensajes de éxito/error
    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Coordinación de operaciones de libros
    async cargarLibros() {
        try {
            return await this.libroService.obtenerLibros();
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async agregarLibro(datosLibro) {
        try {
            const id = await this.libroService.agregarLibro(datosLibro);
            this.showMessage('Libro agregado exitosamente');
            return id;
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async editarLibro(id, datosLibro) {
        try {
            await this.libroService.editarLibro(id, datosLibro);
            this.showMessage('Libro actualizado exitosamente');
            return true;
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async eliminarLibro(id) {
        try {
            await this.libroService.eliminarLibro(id);
            this.showMessage('Libro eliminado exitosamente');
            return true;
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async obtenerLibrosDisponibles() {
        try {
            return await this.libroService.obtenerLibrosDisponibles();
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    // Coordinación de operaciones de usuarios
    async cargarUsuarios() {
        try {
            return await this.usuarioService.obtenerUsuarios();
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async agregarUsuario(datosUsuario) {
        try {
            const id = await this.usuarioService.agregarUsuario(datosUsuario);
            this.showMessage('Usuario registrado exitosamente');
            return id;
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async editarUsuario(id, datosUsuario) {
        try {
            await this.usuarioService.editarUsuario(id, datosUsuario);
            this.showMessage('Usuario actualizado exitosamente');
            return true;
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async eliminarUsuario(id) {
        try {
            await this.usuarioService.eliminarUsuario(id);
            this.showMessage('Usuario eliminado exitosamente');
            return true;
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async obtenerUsuariosActivos() {
        try {
            return await this.usuarioService.obtenerUsuariosActivos();
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    // Coordinación de operaciones de préstamos
    async cargarPrestamosActivos() {
        try {
            return await this.prestamoService.obtenerPrestamosActivos();
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async cargarHistorialPrestamos() {
        try {
            return await this.prestamoService.obtenerHistorialPrestamos();
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async agregarPrestamo(datosPrestamo) {
        try {
            const id = await this.prestamoService.agregarPrestamo(datosPrestamo);
            this.showMessage('Préstamo registrado exitosamente');
            return id;
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async devolverPrestamo(prestamoId) {
        try {
            await this.prestamoService.devolverPrestamo(prestamoId);
            this.showMessage('Libro devuelto exitosamente');
            return true;
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async eliminarPrestamo(id) {
        try {
            await this.prestamoService.eliminarPrestamo(id);
            this.showMessage('Préstamo eliminado exitosamente');
            return true;
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    // Operaciones complejas que involucran múltiples servicios
    async obtenerDatosCompletos() {
        try {
            const [libros, usuarios, prestamosActivos, historial] = await Promise.all([
                this.cargarLibros(),
                this.cargarUsuarios(),
                this.cargarPrestamosActivos(),
                this.cargarHistorialPrestamos()
            ]);

            return {
                libros,
                usuarios,
                prestamosActivos,
                historial,
                estadisticas: await this.prestamoService.obtenerEstadisticas()
            };
        } catch (error) {
            this.showMessage('Error al cargar datos completos', 'error');
            throw error;
        }
    }

    async refrescarDatosPrestamos() {
        try {
            const [prestamosActivos, historial, librosDisponibles, usuariosActivos] = await Promise.all([
                this.cargarPrestamosActivos(),
                this.cargarHistorialPrestamos(),
                this.obtenerLibrosDisponibles(),
                this.obtenerUsuariosActivos()
            ]);

            return {
                prestamosActivos,
                historial,
                librosDisponibles,
                usuariosActivos
            };
        } catch (error) {
            this.showMessage('Error al refrescar datos de préstamos', 'error');
            throw error;
        }
    }

    // Operaciones de búsqueda
    async buscarLibros(termino) {
        try {
            return await this.libroService.buscarLibros(termino);
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async buscarUsuarios(termino) {
        try {
            return await this.usuarioService.buscarUsuarios(termino);
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    async buscarPrestamos(termino) {
        try {
            return await this.prestamoService.buscarPrestamos(termino);
        } catch (error) {
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    // Validaciones de integridad
    async validarIntegridadDatos() {
        try {
            const datos = await this.obtenerDatosCompletos();
            const problemas = [];

            // Verificar libros sin préstamos activos pero marcados como no disponibles
            const librosNoDisponibles = datos.libros.filter(l => !l.disponible);
            const librosConPrestamosActivos = datos.prestamosActivos.map(p => p.libroId);
            
            librosNoDisponibles.forEach(libro => {
                if (!librosConPrestamosActivos.includes(libro.id)) {
                    problemas.push(`Libro "${libro.titulo}" marcado como no disponible pero sin préstamos activos`);
                }
            });

            // Verificar usuarios inactivos con préstamos activos
            const usuariosInactivos = datos.usuarios.filter(u => !u.activo);
            const usuariosConPrestamos = datos.prestamosActivos.map(p => p.usuarioId);
            
            usuariosInactivos.forEach(usuario => {
                if (usuariosConPrestamos.includes(usuario.id)) {
                    problemas.push(`Usuario "${usuario.nombre}" inactivo pero con préstamos activos`);
                }
            });

            return {
                valido: problemas.length === 0,
                problemas
            };
        } catch (error) {
            this.showMessage('Error al validar integridad de datos', 'error');
            throw error;
        }
    }
}

// Instancia global de la aplicación
window.bibliotecaApp = new BibliotecaApp();
