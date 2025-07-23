"""
Utilidades para autenticación y manejo de credenciales.
"""
import jwt
import hashlib
from datetime import datetime, timedelta
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity
)
from typing import Dict, Any, Optional, Tuple
from app.utils.config.logger import get_logger
from app.utils.config.config import Config

# Inicializar el logger para este módulo
logger = get_logger(__name__)


def hash_password(password: str) -> str:
    """
    Genera un hash seguro de la contraseña utilizando SHA-256.
    
    Args:
        password: Contraseña en texto plano
        
    Returns:
        Hash de la contraseña
    """
    logger.info("[hash_password]: Generando hash de contraseña con SHA-256")
    # Usar SHA-256 para generar un hash simple y consistente
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def check_password(password: str, password_hash: str) -> bool:
    """
    Verifica si una contraseña coincide con su hash.
    
    Args:
        password: Contraseña en texto plano
        password_hash: Hash almacenado de la contraseña
        
    Returns:
        True si la contraseña es correcta, False en caso contrario
    """
    logger.info("[check_password]: Verificando contraseña con SHA-256")
    # Generar hash de la contraseña proporcionada
    hashed = hash_password(password)
    # Comparar con el hash almacenado
    result = hashed == password_hash
    logger.info(f"[check_password]: Resultado de la verificación: {result}")
    return result


def authenticate_user(username: str, password: str, user_repository) -> Optional[Dict[str, Any]]:
    """
    Autentica un usuario verificando sus credenciales.
    
    Args:
        username: Nombre de usuario, correo o DNI
        password: Contraseña
        user_repository: Repositorio de usuarios para consultar credenciales
        
    Returns:
        Datos del usuario si la autenticación es exitosa, None en caso contrario
    """
    logger.info(f"[authenticate_user]: Proceso de autenticación para identificador: {username}")
    
    # Buscar usuario por username
    user = user_repository.get_user_by_username(username)
    
    # Si no se encuentra por username, intentar por email
    if not user:
        logger.info(f"[authenticate_user]: Usuario no encontrado por username, intentando por email: {username}")
        user = user_repository.get_user_by_email(username)
    
    # Si no se encuentra por email, intentar por DNI (si existe el método en el repositorio)
    if not user and hasattr(user_repository, 'get_user_by_dni'):
        logger.info(f"[authenticate_user]: Usuario no encontrado por email, intentando por DNI: {username}")
        user = user_repository.get_user_by_dni(username)
    
    # Si aún no se encuentra, intentar buscar en el repositorio de alumnos (si se proporciona)
    if not user:
        try:
            # Importar dinámicamente para evitar dependencias circulares
            from app.repositories.alumnos_repository import AlumnosRepository
            alumnos_repository = AlumnosRepository()
            
            logger.info(f"[authenticate_user]: Usuario no encontrado, intentando buscar alumno por DNI: {username}")
            alumno = alumnos_repository.get_alumno_by_dni(username)
            
            if alumno:
                logger.info(f"[authenticate_user]: Alumno encontrado con DNI: {username}, verificando credenciales")
                # Si encontramos un alumno, verificar su contraseña
                if check_password(password, alumno.get('password', '')):
                    # Crear un objeto de usuario a partir del alumno para mantener consistencia
                    user = {
                        'id': alumno.get('id'),
                        'username': alumno.get('dni'),
                        'email': alumno.get('mail'),
                        'privileges': 'ESTUDIANTE'
                    }
                    logger.info(f"[authenticate_user]: Autenticación exitosa para alumno con DNI: {username}")
        except ImportError:
            logger.info("[authenticate_user]: No se pudo importar AlumnosRepository")
            pass
    
    if not user:
        logger.info(f"[authenticate_user]: Usuario/Alumno no encontrado con identificador: {username}")
        return None
    
    # Verificar contraseña
    logger.info(f"[authenticate_user]: Verificando contraseña para usuario: {username}")
    
    # Información para depuración
    stored_hash = user.get('password')
    logger.info(f"[authenticate_user]: Hash almacenado: {stored_hash}")
    
    # Verificar directamente con SHA-256
    result = check_password(password, stored_hash)
    
    logger.info(f"[authenticate_user]: Resultado de verificación directa: {result}")
    
    if not result:
        logger.info(f"[authenticate_user]: Contraseña incorrecta para usuario: {username}")
        return None
    
    # Eliminar la contraseña del resultado
    if 'password' in user:
        del user['password']
    
    logger.info(f"[authenticate_user]: Autenticación exitosa para usuario: {username} (ID: {user.get('id')})")
    return user


def generate_tokens(user_data: Dict[str, Any]) -> Tuple[str, str]:
    """
    Genera tokens de acceso y actualización para un usuario autenticado.
    
    Args:
        user_data: Datos del usuario a incluir en el token
        
    Returns:
        Tupla con (access_token, refresh_token)
    """
    user_id = user_data.get('id')
    username = user_data.get('username')
    logger.info(f"[generate_tokens]: Generando tokens para usuario: {username} (ID: {user_id})")
    
    # Crear additional_claims para JWT (no incluir datos sensibles)
    additional_claims = {
        'username': username,
        'email': user_data.get('email'),
        'role': user_data.get('privileges', 'USER')
    }
    
    # Generar tokens usando el user_id como identity (string) y los datos adicionales como claims
    access_token = create_access_token(identity=str(user_id), additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity=str(user_id), additional_claims=additional_claims)
    
    logger.info(f"[generate_tokens]: Tokens generados exitosamente para usuario: {username} (ID: {user_id})")
    return access_token, refresh_token


def get_current_user() -> Dict[str, Any]:
    """
    Obtiene los datos del usuario actual desde el token JWT.
    
    Returns:
        Datos del usuario actual
    """
    # El identity ahora es solo el ID del usuario como string
    user_id = get_jwt_identity()
    logger.info(f"[get_current_user]: Obteniendo información del usuario actual con ID: {user_id}")
    return {
        'id': user_id
    }


def generate_access_token(user: Dict[str, Any]) -> str:
    """
    Genera un token de acceso JWT.
    
    Args:
        user: Datos del usuario
        
    Returns:
        Token de acceso JWT
    """
    logger.info(f"[generate_access_token]: Generando token de acceso para usuario ID: {user['id']}")
    payload = {
        'sub': user['id'],
        'username': user['username'],
        'privileges': user.get('privileges', 'USER'),
        'type': 'access',
        'exp': datetime.utcnow() + timedelta(minutes=30)  # 30 minutos de expiración
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')


def generate_refresh_token(user: Dict[str, Any]) -> str:
    """
    Genera un token de refresco JWT.
    
    Args:
        user: Datos del usuario
        
    Returns:
        Token de refresco JWT
    """
    logger.info(f"[generate_refresh_token]: Generando token de refresco para usuario ID: {user['id']}")
    payload = {
        'sub': user['id'],
        'type': 'refresh',
        'exp': datetime.utcnow() + timedelta(days=7)  # 7 días de expiración
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')


def refresh_token(refresh_token: str, user_repository) -> Optional[Dict[str, Any]]:
    """
    Refresca un token de acceso usando un token de refresco.
    
    Args:
        refresh_token: Token de refresco
        user_repository: Repositorio de usuarios
        
    Returns:
        Nuevo token de acceso si el token de refresco es válido, None en caso contrario
    """
    logger.info("[refresh_token]: Intento de refrescar token")
    try:
        payload = jwt.decode(
            refresh_token, 
            Config.SECRET_KEY, 
            algorithms=['HS256']
        )
        
        if 'type' not in payload or payload['type'] != 'refresh':
            logger.info("[refresh_token]: Refresco de token fallido: token no es de tipo refresh")
            return None
            
        user_id = payload['sub']
        logger.info(f"[refresh_token]: Refresco de token para usuario ID: {user_id}")
        user = user_repository.get_user_by_id(user_id)
        
        if not user:
            logger.info(f"[refresh_token]: Refresco de token fallido: usuario ID {user_id} no encontrado")
            return None
            
        access_token = generate_access_token(user)
        
        logger.info(f"[refresh_token]: Token refrescado exitosamente para usuario ID: {user_id}")
        return {
            'access_token': access_token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'privileges': user['privileges']
            }
        }
    except jwt.ExpiredSignatureError:
        logger.info("[refresh_token]: Refresco de token fallido: token expirado")
        return None
    except (jwt.InvalidTokenError, KeyError):
        logger.info("[refresh_token]: Refresco de token fallido: token inválido")
        return None
