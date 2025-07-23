"""
Configuración de Flask-JWT-Extended para la autenticación basada en tokens.
"""
from datetime import timedelta
import secrets
from flask_jwt_extended import JWTManager
from app.utils.config.logger import get_logger

# Inicializar el logger para este módulo
logger = get_logger(__name__)

# Variable global para almacenar la clave secreta dinámica
DYNAMIC_SECRET_KEY = None


def generate_dynamic_secret_key():
    """
    Genera una clave secreta dinámica para JWT.
    
    Returns:
        Clave secreta generada aleatoriamente
    """
    return secrets.token_hex(32)  # Genera una clave hexadecimal de 64 caracteres (32 bytes)


def init_jwt(app):
    """
    Inicializa y configura Flask-JWT-Extended en la aplicación.
    
    Args:
        app: Aplicación Flask
        
    Returns:
        Instancia de JWTManager configurada
    """
    logger.info("[init_jwt]: Inicializando configuración JWT")
    
    # Generar una nueva clave secreta dinámica para esta instancia del servidor
    global DYNAMIC_SECRET_KEY
    DYNAMIC_SECRET_KEY = generate_dynamic_secret_key()
    logger.info("[init_jwt]: Clave secreta dinámica generada para esta sesión del servidor")
    
    # Configuración JWT con la clave dinámica
    app.config["JWT_SECRET_KEY"] = DYNAMIC_SECRET_KEY
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(hours=1)  
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    
    logger.info(f"[init_jwt]: JWT configurado con expiración de acceso: {app.config['JWT_ACCESS_TOKEN_EXPIRES']}, "
                f"expiración de refresco: {app.config['JWT_REFRESH_TOKEN_EXPIRES']}")
    
    # Inicializar JWTManager
    jwt = JWTManager(app)
    
    # Personalizar respuestas de error JWT
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        user_id = jwt_payload.get("sub", "desconocido")
        logger.info(f"[expired_token_callback]: Token expirado para usuario ID: {user_id}")
        return {
            "error": "El token de acceso ha expirado",
            "message": "Por favor, inicia sesión nuevamente"
        }, 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        logger.warning(f"[invalid_token_callback]: Intento de uso de token inválido: {error}")
        return {
            "error": "Token inválido",
            "message": "El token proporcionado no es válido"
        }, 401
    
    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        logger.warning(f"[unauthorized_callback]: Intento de acceso no autorizado: {error}")
        return {
            "error": "No autorizado",
            "message": "Se requiere un token de acceso para esta solicitud"
        }, 401
    
    logger.info("[init_jwt]: Configuración JWT completada exitosamente")
    return jwt
