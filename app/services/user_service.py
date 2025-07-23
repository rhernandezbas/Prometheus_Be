"""Servicio para la gestión de usuarios."""
from typing import Dict, Any, Optional, List

from app.repositories.users_repository import UsersRepository
from app.utils.config.logger import get_logger
from app.utils.auth.auth_utils import (
    hash_password, check_password, generate_access_token, 
    generate_refresh_token, refresh_token as auth_refresh_token
)

# Inicializar el logger para este módulo
logger = get_logger(__name__)


class UserService:
    """Servicio para la gestión de usuarios."""
    
    def __init__(self):
        """Inicializa el servicio con el repositorio correspondiente."""
        self.repository = UsersRepository()

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo usuario.

        Args:
            user_data: Datos del usuario a crear

        Returns:
            Usuario creado
        """
        logger.info(f"[create_user]: Iniciando creación de usuario: {user_data.get('username')}")
        
        # Encriptar contraseña
        if 'password' in user_data:
            user_data['password'] = hash_password(user_data['password'])
            logger.info("[create_user]: Contraseña encriptada correctamente")

        # Eliminar timestamps si existen para usar los valores en el repositorio
        if 'created_at' in user_data:
            del user_data['created_at']
        if 'updated_at' in user_data:
            del user_data['updated_at']

        result = self.repository.create_user(user_data)

        if not result:
            logger.info("[create_user]: Fallo al crear el usuario")
            return {}

        logger.info(f"[create_user]: Usuario creado exitosamente con ID: {result.get('id')}")
        return result
    
    def authenticate(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Autentica un usuario por nombre de usuario y contraseña.
        
        Args:
            username: Nombre de usuario o email
            password: Contraseña
            
        Returns:
            Token JWT si la autenticación es exitosa, None en caso contrario
        """
        logger.info(f"[authenticate]: Intento de autenticación para usuario: {username}")
        
        # Buscar usuario por nombre de usuario o email
        user = self.repository.get_user_by_username(username)
        if not user:
            user = self.repository.get_user_by_email(username)
            
        if not user:
            logger.info(f"[authenticate]: Autenticación fallida: usuario {username} no encontrado")
            return None
            
        # Verificar contraseña
        if not check_password(password, user['password']):
            logger.info(f"[authenticate]: Autenticación fallida: contraseña incorrecta para usuario {username}")
            return None
            
        # Generar tokens
        access_token = generate_access_token(user)
        refresh_token = generate_refresh_token(user)
        
        logger.info(f"[authenticate]: Autenticación exitosa para usuario: {username} (ID: {user['id']})")
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'privileges': user['privileges']
            }
        }
    
    def refresh_token(self, refresh_token_str: str) -> Optional[Dict[str, Any]]:
        """
        Refresca un token de acceso usando un token de refresco.
        
        Args:
            refresh_token: Token de refresco
            
        Returns:
            Nuevo token de acceso si el token de refresco es válido, None en caso contrario
        """
        logger.info("[refresh_token]: Delegando a auth_utils.refresh_token")
        return auth_refresh_token(refresh_token_str, self.repository)
    
    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un usuario por su ID.
        
        Args:
            user_id: ID del usuario a buscar
            
        Returns:
            Usuario encontrado o None
        """
        logger.info(f"[get_user_by_id]: Obteniendo información de usuario ID: {user_id}")
        return self.repository.get_user_by_id(user_id)
    
    def update_user(self, user_id: int, user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los datos de un usuario.
        
        Args:
            user_id: ID del usuario a actualizar
            user_data: Datos actualizados
            
        Returns:
            Usuario actualizado o None
        """
        logger.info(f"[update_user]: Iniciando actualización de usuario ID: {user_id}")
        
        # Encriptar contraseña si se proporciona
        if 'password' in user_data:
            user_data['password'] = hash_password(user_data['password'])
            logger.info(f"[update_user]: Contraseña actualizada y encriptada para usuario ID: {user_id}")
            
        # El timestamp de actualización se manejará en el repositorio
        if 'updated_at' in user_data:
            del user_data['updated_at']
        
        result = self.repository.update_user(user_id, user_data)
        if result:
            logger.info(f"[update_user]: Usuario ID: {user_id} actualizado exitosamente")
        else:
            logger.info(f"[update_user]: Fallo al actualizar usuario ID: {user_id}, no encontrado")
        return result
    
    def change_password(self, user_id: int, current_password: str, new_password: str) -> bool:
        """
        Cambia la contraseña de un usuario verificando la contraseña actual.
        
        Args:
            user_id: ID del usuario
            current_password: Contraseña actual
            new_password: Nueva contraseña
            
        Returns:
            True si la contraseña fue cambiada, False en caso contrario
        """
        logger.info(f"[change_password]: Intento de cambio de contraseña para usuario ID: {user_id}")
        user = self.repository.get_user_by_id(user_id)
        if not user:
            logger.info(f"[change_password]: Cambio de contraseña fallido: usuario ID {user_id} no encontrado")
            return False
            
        # Verificar contraseña actual
        if not check_password(current_password, user['password']):
            logger.info(f"[change_password]: Cambio de contraseña fallido: contraseña actual incorrecta para usuario ID {user_id}")
            return False
            
        # Cambiar contraseña
        hashed_password = hash_password(new_password)
        result = self.repository.change_password(user_id, hashed_password)
        if result:
            logger.info(f"[change_password]: Contraseña cambiada exitosamente para usuario ID: {user_id}")
        return result
    
    def search_users(self, filters: Optional[Dict[str, Any]] = None, page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """
        Busca usuarios con filtros opcionales y paginación.
        
        Args:
            filters: Filtros para la búsqueda
            page: Número de página
            per_page: Elementos por página
            
        Returns:
            Diccionario con usuarios y metadatos de paginación
        """
        logger.info(f"[search_users]: Realizando búsqueda de usuarios con filtros: {filters}")
        return self.repository.search_all(filters, page, per_page)
    
    def delete_user(self, user_id: int) -> bool:
        """
        Elimina un usuario.
        
        Args:
            user_id: ID del usuario a eliminar
            
        Returns:
            True si el usuario fue eliminado, False en caso contrario
        """
        logger.info(f"[delete_user]: Eliminando usuario ID: {user_id}")
        result = self.repository.delete_user(user_id)
        if result:
            logger.info(f"[delete_user]: Usuario ID: {user_id} eliminado exitosamente")
        else:
            logger.info(f"[delete_user]: Fallo al eliminar usuario ID: {user_id}, no encontrado")
        return result
