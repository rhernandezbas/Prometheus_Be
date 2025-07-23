from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class UsersInterfaces(ABC):
    """Interfaz para el repositorio de usuarios."""
    
    @abstractmethod
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo usuario en el sistema.
        
        Args:
            user_data: Diccionario con los datos del usuario a crear
            
        Returns:
            El usuario creado
        """
        pass
    
    @abstractmethod
    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un usuario por su ID.
        
        Args:
            user_id: ID del usuario a buscar
            
        Returns:
            Usuario encontrado o None
        """
        pass
    
    @abstractmethod
    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un usuario por su nombre de usuario.
        
        Args:
            username: Nombre de usuario a buscar
            
        Returns:
            Usuario encontrado o None
        """
        pass
    
    @abstractmethod
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un usuario por su correo electrónico.
        
        Args:
            email: Correo electrónico a buscar
            
        Returns:
            Usuario encontrado o None
        """
        pass
    
    @abstractmethod
    def update_user(self, user_id: int, user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los datos de un usuario.
        
        Args:
            user_id: ID del usuario a actualizar
            user_data: Diccionario con los datos actualizados
            
        Returns:
            Usuario actualizado o None
        """
        pass
    
    @abstractmethod
    def delete_user(self, user_id: int) -> bool:
        """
        Elimina un usuario del sistema.
        
        Args:
            user_id: ID del usuario a eliminar
            
        Returns:
            True si el usuario fue eliminado, False en caso contrario
        """
        pass
    
    @abstractmethod
    def search_all(self, filters: Optional[Dict[str, Any]] = None, 
                   page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """
        Busca usuarios con filtros opcionales y paginación.
        
        Args:
            filters: Diccionario de filtros para la búsqueda
            page: Número de página
            per_page: Elementos por página
            
        Returns:
            Diccionario con usuarios y metadatos de paginación
        """
        pass
    
    @abstractmethod
    def change_password(self, user_id: int, new_password: str) -> bool:
        """
        Cambia la contraseña de un usuario.
        
        Args:
            user_id: ID del usuario
            new_password: Nueva contraseña
            
        Returns:
            True si la contraseña fue cambiada, False en caso contrario
        """
        pass