"""
Decoradores para control de autenticación y autorización.
"""
from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request, get_jwt

def role_required(*roles):
    """
    Decorador para verificar si el usuario tiene el rol requerido.
    
    Args:
        *roles: Lista de roles permitidos para acceder al endpoint
        
    Returns:
        Un decorador que verifica el rol del usuario
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Verificar que hay un JWT válido
            verify_jwt_in_request()
            
            # Obtener identidad del usuario desde JWT (ahora es solo el ID)
            user_id = get_jwt_identity()
            
            # Obtener claims adicionales del token
            claims = get_jwt()
            user_role = claims.get('role')
            
            # Si no hay roles específicos o el usuario es ADMIN, permitir acceso
            if not roles or user_role == "ADMINISTRADOR":
                return fn(*args, **kwargs)
            
            # Verificar si el usuario tiene alguno de los roles permitidos
            if user_role in roles:
                return fn(*args, **kwargs)
            
            # Si no tiene permiso, devolver error 403
            return jsonify({
                "error": "No tienes permiso para acceder a este recurso",
                "role_required": roles
            }), 403
        return wrapper
    return decorator
