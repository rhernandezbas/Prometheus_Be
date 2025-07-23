"""Servicio para la gestión de instructores."""
from typing import Dict, Any, Optional, List

from app.repositories.instructor_repository import InstructorRepository
from app.services.user_service import UserService


class InstructorService:
    """Servicio para la gestión de instructores."""
    
    def __init__(self):
        """Inicializa el servicio con el repositorio correspondiente."""
        self.repository = InstructorRepository()
        self.user_service = UserService()
    
    def create_instructor(self, instructor_data: Dict[str, Any], crear_usuario: bool = True) -> Dict[str, Any]:
        """
        Crea un nuevo instructor y opcionalmente su usuario asociado.
        
        Args:
            instructor_data: Datos del instructor a crear
            crear_usuario: Si es True, crea un usuario para el instructor
            
        Returns:
            Instructor creado
        """
        # Si se solicita crear un usuario asociado
        user_id = None
        if crear_usuario and 'user_data' in instructor_data:
            user_data = instructor_data.pop('user_data')
            user = self.user_service.create_user(user_data)
            user_id = user['id']
            instructor_data['user_id'] = user_id
        
        return self.repository.create_instructor(instructor_data)
    
    def get_instructor_by_id(self, instructor_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un instructor por su ID.
        
        Args:
            instructor_id: ID del instructor a buscar
            
        Returns:
            Instructor encontrado o None
        """
        return self.repository.get_instructor_by_id(instructor_id)
    
    def get_instructor_by_user_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un instructor por su ID de usuario asociado.
        
        Args:
            user_id: ID del usuario asociado al instructor
            
        Returns:
            Instructor encontrado o None
        """
        return self.repository.get_instructor_by_user_id(user_id)
    
    def get_instructor_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un instructor por su correo electrónico.
        
        Args:
            email: Correo electrónico a buscar
            
        Returns:
            Instructor encontrado o None
        """
        return self.repository.get_instructor_by_email(email)
    
    def update_instructor(self, instructor_id: int, instructor_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los datos de un instructor.
        
        Args:
            instructor_id: ID del instructor a actualizar
            instructor_data: Datos actualizados
            
        Returns:
            Instructor actualizado o None
        """
        # Si se solicita actualizar el usuario asociado
        if 'user_data' in instructor_data:
            instructor = self.repository.get_instructor_by_id(instructor_id)
            if instructor and 'user_id' in instructor:
                user_data = instructor_data.pop('user_data')
                self.user_service.update_user(instructor['user_id'], user_data)
        
        return self.repository.update_instructor(instructor_id, instructor_data)
    
    def delete_instructor(self, instructor_id: int, eliminar_usuario: bool = False) -> bool:
        """
        Elimina un instructor y opcionalmente su usuario asociado.
        
        Args:
            instructor_id: ID del instructor a eliminar
            eliminar_usuario: Si es True, elimina también el usuario asociado
            
        Returns:
            True si el instructor fue eliminado, False en caso contrario
        """
        instructor = self.repository.get_instructor_by_id(instructor_id)
        if not instructor:
            return False
            
        # Si se solicita eliminar el usuario asociado
        if eliminar_usuario and 'user_id' in instructor:
            self.user_service.delete_user(instructor['user_id'])
        
        return self.repository.delete_instructor(instructor_id)
    
    def search_instructores(self, filters: Optional[Dict[str, Any]] = None, page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """
        Busca instructores con filtros opcionales y paginación.
        
        Args:
            filters: Filtros para la búsqueda
            page: Número de página
            per_page: Elementos por página
            
        Returns:
            Diccionario con instructores y metadatos de paginación
        """
        return self.repository.search_all(filters, page, per_page)
    
    def get_instructor_con_usuario(self, instructor_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un instructor junto con los datos de su usuario asociado.
        
        Args:
            instructor_id: ID del instructor
            
        Returns:
            Datos del instructor y su usuario asociado, o None
        """
        instructor = self.repository.get_instructor_by_id(instructor_id)
        if not instructor or 'user_id' not in instructor:
            return instructor
            
        user = self.user_service.get_user_by_id(instructor['user_id'])
        if user:
            instructor['user'] = user
            
        return instructor
