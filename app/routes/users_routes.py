"""Rutas para la gestión de usuarios."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.services.user_service import UserService
from app.utils.auth.decorators import role_required
from app.utils.auth.auth_utils import hash_password
from app.utils.auth.roles import Roles


# Crear Blueprint para rutas de usuarios
users_bp = Blueprint('users', __name__)

# Instanciar servicio
users_service = UserService()


@users_bp.route('/create', methods=['POST'])
#@jwt_required()
#@role_required(Roles.ADMINISTRADOR)
def crear_usuario():
    """Crea un nuevo usuario (solo administradores)."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se proporcionaron datos'}), 400
        
        # Verificar campos requeridos
        required_fields = ['username', 'email', 'password', 'privileges']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'El campo {field} es requerido'}), 400
        
        # Validar que el rol sea válido
        if not Roles.is_valid_role(data['privileges']):
            return jsonify({
                'error': f'Rol inválido: {data["privileges"]}',
                'roles_validos': Roles.ALL_ROLES
            }), 400

        usuario = users_service.create_user(data)

        if not usuario:
            return jsonify({'error': 'No se pudo crear el usuario'}), 500
        
        return jsonify({'mensaje': 'Usuario creado con éxito', 'usuario': usuario}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/', methods=['GET'])
@jwt_required()
@role_required('ADMINISTRADOR')
def listar_usuarios():
    """Lista todos los usuarios (solo administradores)."""
    try:
        # Obtener parámetros de consulta para paginación
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Obtener parámetros para filtrado
        filters = {}
        for key in request.args:
            if key not in ['page', 'per_page'] and request.args.get(key):
                filters[key] = request.args.get(key)
        
        # Obtener lista paginada de usuarios
        result = users_service.get_users(page, per_page, filters)
        
        return jsonify({
            'usuarios': result.get('items', []),
            'total': result.get('total', 0),
            'pages': result.get('pages', 1),
            'page': page,
            'per_page': per_page
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
@role_required('ADMINISTRADOR')
def obtener_usuario(user_id):
    """Obtiene un usuario por su ID."""
    try:
        usuario = users_service.get_user_by_id(user_id)
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404
            
        return jsonify({'usuario': usuario}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
@role_required('ADMINISTRADOR')
def actualizar_usuario(user_id):
    """Actualiza los datos de un usuario."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se proporcionaron datos'}), 400
        
        # No permitir actualización de contraseña por esta ruta
        if 'password' in data:
            return jsonify({'error': 'No se puede actualizar la contraseña por esta ruta. Use /api/v1/auth/change-password'}), 400
        
        # Actualizar usuario
        usuario = users_service.update_user(user_id, data)
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404
            
        return jsonify({'mensaje': 'Usuario actualizado con éxito', 'usuario': usuario}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
@role_required('ADMINISTRADOR')
def eliminar_usuario(user_id):
    """Elimina un usuario."""
    try:
        result = users_service.delete_user(user_id)
        if not result:
            return jsonify({'error': 'Usuario no encontrado'}), 404
            
        return jsonify({'mensaje': 'Usuario eliminado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/buscar', methods=['GET'])
@jwt_required()
@role_required('ADMINISTRADOR')
def buscar_usuarios():
    """Busca usuarios por texto en username o email."""
    try:
        query = request.args.get('q', '')
        if not query or len(query) < 3:
            return jsonify({'error': 'Se requiere un término de búsqueda de al menos 3 caracteres'}), 400
            
        usuarios = users_service.search_users(query)
        
        return jsonify({'usuarios': usuarios}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
