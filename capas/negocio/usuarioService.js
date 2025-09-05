// Capa de Negocio - Servicio de Usuarios
class UsuarioService {
    constructor(repository) {
        this.repository = repository;
    }

    // Validaciones de negocio para usuarios
    validarUsuario(usuario) {
        const errores = [];

        if (!usuario.nombre || usuario.nombre.trim().length === 0) {
            errores.push('El nombre es requerido');
        } else if (usuario.nombre.trim().length < 2) {
            errores.push('El nombre debe tener al menos 2 caracteres');
        } else if (usuario.nombre.trim().length > 100) {
            errores.push('El nombre no puede exceder 100 caracteres');
        }

        if (!usuario.email || usuario.email.trim().length === 0) {
            errores.push('El email es requerido');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(usuario.email)) {
                errores.push('El formato del email no es válido');
            } else if (usuario.email.length > 100) {
                errores.push('El email no puede exceder 100 caracteres');
            }
        }

        // Validar caracteres especiales en nombre
        const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
        if (usuario.nombre && !nombreRegex.test(usuario.nombre)) {
            errores.push('El nombre solo puede contener letras y espacios');
        }

        return errores;
    }

    // Procesar datos antes de guardar
    procesarUsuario(usuario) {
        return {
            nombre: usuario.nombre.trim(),
            email: usuario.email.toLowerCase().trim(),
            fechaRegistro: new Date(),
            activo: true
        };
    }

    // Obtener todos los usuarios
    async obtenerUsuarios() {
        try {
            return await this.repository.getUsuarios();
        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
    }

    // Agregar nuevo usuario
    async agregarUsuario(usuario) {
        try {
            // Validaciones de negocio
            const errores = this.validarUsuario(usuario);
            if (errores.length > 0) {
                throw new Error(errores.join(', '));
            }

            // Procesar datos
            const usuarioProcesado = this.procesarUsuario(usuario);

            // Guardar en repositorio
            return await this.repository.addUsuario(usuarioProcesado);
        } catch (error) {
            throw new Error(`Error al agregar usuario: ${error.message}`);
        }
    }

    // Editar usuario existente
    async editarUsuario(id, datosActualizados) {
        try {
            if (!id) {
                throw new Error('ID del usuario es requerido');
            }

            // Validaciones de negocio
            const errores = this.validarUsuario(datosActualizados);
            if (errores.length > 0) {
                throw new Error(errores.join(', '));
            }

            // Procesar datos
            const datosProcesados = this.procesarUsuario(datosActualizados);

            // Actualizar en repositorio
            return await this.repository.editUsuario(id, datosProcesados);
        } catch (error) {
            throw new Error(`Error al editar usuario: ${error.message}`);
        }
    }

    // Eliminar usuario
    async eliminarUsuario(id) {
        try {
            if (!id) {
                throw new Error('ID del usuario es requerido');
            }

            // Verificar reglas de negocio antes de eliminar
            const usuarios = await this.repository.getUsuarios();
            const usuario = usuarios.find(u => u.id === id);
            
            if (!usuario) {
                throw new Error('El usuario no existe');
            }

            // Eliminar del repositorio
            return await this.repository.deleteUsuario(id);
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }

    // Obtener usuarios activos
    async obtenerUsuariosActivos() {
        try {
            return await this.repository.getUsuariosActivos();
        } catch (error) {
            throw new Error(`Error al obtener usuarios activos: ${error.message}`);
        }
    }

    // Buscar usuarios por nombre o email
    async buscarUsuarios(termino) {
        try {
            const usuarios = await this.repository.getUsuarios();
            const terminoLower = termino.toLowerCase();
            
            return usuarios.filter(usuario => 
                usuario.nombre.toLowerCase().includes(terminoLower) ||
                usuario.email.toLowerCase().includes(terminoLower)
            );
        } catch (error) {
            throw new Error(`Error al buscar usuarios: ${error.message}`);
        }
    }

    // Validar si un usuario puede ser eliminado
    async puedeEliminarUsuario(id) {
        try {
            const prestamosActivos = await this.repository.getPrestamosActivos();
            const tienePrestamos = prestamosActivos.some(p => p.usuarioId === id);
            
            return !tienePrestamos;
        } catch (error) {
            throw new Error(`Error al validar eliminación de usuario: ${error.message}`);
        }
    }
}

// Instancia global del servicio
window.usuarioService = new UsuarioService(window.bibliotecaRepository);
