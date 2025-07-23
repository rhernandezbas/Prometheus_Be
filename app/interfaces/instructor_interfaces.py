from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class InstructorInterfaces(ABC):
    """Interfaz para el repositorio de instructores."""
    
    @abstractmethod
    def create_instructor(self, instructor_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo instructor en el sistema.
        
        Args:
            instructor_data: Diccionario con los datos del instructor a crear
            
        Returns:
            El instructor creado
        """
        pass
    
    @abstractmethod
    def get_instructor_by_id(self, instructor_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un instructor por su ID.
        
        Args:
            instructor_id: ID del instructor a buscar
            
        Returns:
            Instructor encontrado o None
        """
        pass
    
    @abstractmethod
    def get_instructor_by_user_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un instructor por su ID de usuario.
        
        Args:
            user_id: ID del usuario asociado al instructor
            
        Returns:
            Instructor encontrado o None
        """
        pass
    
    @abstractmethod
    def get_instructor_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un instructor por su correo electrónico.
        
        Args:
            email: Correo electrónico a buscar
            
        Returns:
            Instructor encontrado o None
        """
        pass
    
    @abstractmethod
    def update_instructor(self, instructor_id: int, instructor_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los datos de un instructor.
        
        Args:
            instructor_id: ID del instructor a actualizar
            instructor_data: Diccionario con los datos actualizados
            
        Returns:
            Instructor actualizado o None
        """
        pass
    
    @abstractmethod
    def delete_instructor(self, instructor_id: int) -> bool:
        """
        Elimina un instructor del sistema.
        
        Args:
            instructor_id: ID del instructor a eliminar
            
        Returns:
            True si el instructor fue eliminado, False en caso contrario
        """
        pass
    
    @abstractmethod
    def search_all(self, filters: Optional[Dict[str, Any]] = None, 
                  page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """
        Busca instructores con filtros opcionales y paginación.
        
        Args:
            filters: Diccionario de filtros para la búsqueda
            page: Número de página
            per_page: Elementos por página
            
        Returns:
            Diccionario con instructores y metadatos de paginación
        """
        pass
