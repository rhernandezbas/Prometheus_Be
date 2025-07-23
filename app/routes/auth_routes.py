"""Rutas para la autenticación de usuarios."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.user_service import UserService
from app.utils.auth.auth_utils import authenticate_user, generate_tokens
from app.utils.config.logger import get_logger

# Inicializar el logger para este módulo
logger = get_logger(__name__)

# Crear Blueprint para rutas de autenticación
auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

# Instanciar servicio
users_service = UserService()


@auth_bp.route('/login', methods=['POST'])
def login():
    """Autentica un usuario y genera tokens JWT."""
    try:
        logger.info("[login]: Intento de inicio de sesión")
        data = request.get_json()
        if not data:
            logger.info("[login]: Intento de inicio de sesión fallido: No se proporcionaron credenciales")
            return jsonify({'error': 'No se proporcionaron credenciales'}), 400
            
        username = data.get('username', '')
        password = data.get('password', '')
        
        if not username or not password:
            logger.info("[login]: Intento de inicio de sesión fallido: Credenciales incompletas")
            return jsonify({'error': 'Se requieren nombre de usuario y contraseña'}), 400
        
        # Autenticar usuario
        logger.info(f"[login]: Autenticando usuario: {username}")
        user = authenticate_user(username, password, users_service.repository)
        
        if not user:
            logger.info(f"[login]: Autenticación fallida para usuario: {username}")
            return jsonify({'error': 'Credenciales inválidas'}), 401
        
        # Generar tokens
        logger.info(f"[login]: Generando tokens para usuario: {username} (ID: {user.get('id')})")
        access_token, refresh_token = generate_tokens(user)
        
        logger.info(f"[login]: Inicio de sesión exitoso para usuario: {username} (ID: {user.get('id')})")
        return jsonify({
            'mensaje': 'Inicio de sesión exitoso',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user
        }), 200
    except Exception as e:
        logger.error(f"[login]: Error en inicio de sesión: {str(e)}")
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresca el token de acceso utilizando un token de actualización."""
    try:
        # Obtener identidad del usuario desde el token de actualización (ahora es solo el ID como string)
        user_id = get_jwt_identity()
        logger.info(f"[refresh]: Intento de refrescar token para usuario ID: {user_id}")
        
        # Obtener datos completos del usuario desde la base de datos
        user = users_service.get_user_by_id(user_id)
        
        if not user:
            logger.info(f"[refresh]: Usuario no encontrado con ID: {user_id}")
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # Generar nuevo token de acceso
        access_token = generate_tokens(user)[0]
        
        logger.info(f"[refresh]: Token refrescado exitosamente para usuario ID: {user_id}")
        return jsonify({
            'mensaje': 'Token actualizado con éxito',
            'access_token': access_token
        }), 200
    except Exception as e:
        logger.error(f"[refresh]: Error al refrescar token: {str(e)}")
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_profile():
    """Obtiene el perfil del usuario autenticado."""
    try:
        # Obtener identidad del usuario (ahora es solo el ID como string)
        user_id = get_jwt_identity()
        logger.info(f"[get_profile]: Solicitud de perfil para usuario ID: {user_id}")
        
        # Obtener datos completos del usuario desde la base de datos
        user = users_service.get_user_by_id(user_id)
        
        if not user:
            logger.info(f"[get_profile]: Perfil no encontrado para usuario ID: {user_id}")
            return jsonify({'error': 'Usuario no encontrado'}), 404
            
        logger.info(f"[get_profile]: Perfil obtenido exitosamente para usuario ID: {user_id}")
        return jsonify({'user': user}), 200
    except Exception as e:
        logger.error(f"[get_profile]: Error al obtener perfil: {str(e)}")
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Cambia la contraseña del usuario autenticado."""
    try:
        # Obtener identidad del usuario (ahora es solo el ID como string)
        user_id = get_jwt_identity()
        logger.info(f"[change_password]: Intento de cambio de contraseña para usuario ID: {user_id}")
        
        data = request.get_json()
        if not data:
            logger.info(f"[change_password]: Cambio de contraseña fallido para usuario ID {user_id}: No se proporcionaron datos")
            return jsonify({'error': 'No se proporcionaron datos'}), 400
            
        # Obtener datos
        current_password = data.get('current_password', '')
        new_password = data.get('new_password', '')
        
        if not current_password or not new_password:
            logger.info(f"[change_password]: Cambio de contraseña fallido para usuario ID {user_id}: Datos incompletos")
            return jsonify({'error': 'Se requiere contraseña actual y nueva'}), 400
            
        # Cambiar contraseña
        result = users_service.change_password(user_id, current_password, new_password)
        
        if not result:
            logger.info(f"[change_password]: Cambio de contraseña fallido para usuario ID {user_id}: Contraseña actual incorrecta")
            return jsonify({'error': 'No se pudo cambiar la contraseña. Verifique su contraseña actual'}), 400
            
        logger.info(f"[change_password]: Contraseña cambiada exitosamente para usuario ID: {user_id}")
        return jsonify({'mensaje': 'Contraseña actualizada con éxito'}), 200
    except Exception as e:
        logger.error(f"[change_password]: Error al cambiar contraseña: {str(e)}")
        return jsonify({'error': str(e)}), 500
