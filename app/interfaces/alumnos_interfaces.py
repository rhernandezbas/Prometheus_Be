from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class AlumnosInterfaces(ABC):
    """Interfaz para el repositorio de alumnos."""
    
    @abstractmethod
    def create_alumno(self, alumno_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo alumno en el sistema.
        
        Args:
            alumno_data: Diccionario con los datos del alumno a crear
            
        Returns:
            El alumno creado
        """
        pass
    
    @abstractmethod
    def get_alumno_by_id(self, alumno_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un alumno por su ID.
        
        Args:
            alumno_id: ID del alumno a buscar
            
        Returns:
            Alumno encontrado o None
        """
        pass
    
    @abstractmethod
    def get_alumno_by_dni(self, dni: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un alumno por su DNI.
        
        Args:
            dni: DNI del alumno a buscar
            
        Returns:
            Alumno encontrado o None
        """
        pass
    
    @abstractmethod
    def get_alumno_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un alumno por su correo electrónico.
        
        Args:
            email: Correo electrónico a buscar
            
        Returns:
            Alumno encontrado o None
        """
        pass
    
    @abstractmethod
    def update_alumno(self, alumno_id: int, alumno_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los datos de un alumno.
        
        Args:
            alumno_id: ID del alumno a actualizar
            alumno_data: Diccionario con los datos actualizados
            
        Returns:
            Alumno actualizado o None
        """
        pass
    
    @abstractmethod
    def delete_alumno(self, alumno_id: int) -> bool:
        """
        Elimina un alumno del sistema.
        
        Args:
            alumno_id: ID del alumno a eliminar
            
        Returns:
            True si el alumno fue eliminado, False en caso contrario
        """
        pass
    
    @abstractmethod
    def search_all(self, filters: Optional[Dict[str, Any]] = None, 
                  page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """
        Busca alumnos con filtros opcionales y paginación.
        
        Args:
            filters: Diccionario de filtros para la búsqueda
            page: Número de página
            per_page: Elementos por página
            
        Returns:
            Diccionario con alumnos y metadatos de paginación
        """
        pass
    
    @abstractmethod
    def change_password(self, alumno_id: int, new_password: str) -> bool:
        """
        Cambia la contraseña de un alumno.
        
        Args:
            alumno_id: ID del alumno
            new_password: Nueva contraseña
            
        Returns:
            True si la contraseña fue cambiada, False en caso contrario
        """
        pass
    
    @abstractmethod
    def get_alumnos_by_nivel(self, nivel: str) -> List[Dict[str, Any]]:
        """
        Obtiene todos los alumnos de un nivel específico.
        
        Args:
            nivel: Nivel académico
            
        Returns:
            Lista de alumnos del nivel especificado
        """
        pass
    
    @abstractmethod
    def update_alumno_status(self, alumno_id: int, status: str) -> bool:
        """
        Actualiza el estado de un alumno.
        
        Args:
            alumno_id: ID del alumno
            status: Nuevo estado
            
        Returns:
            True si el estado fue actualizado, False en caso contrario
        """
        pass
    
    @abstractmethod
    def update_alumno_pago(self, alumno_id: int, pago: str) -> bool:
        """
        Actualiza el estado de pago de un alumno.
        
        Args:
            alumno_id: ID del alumno
            pago: Estado de pago
            
        Returns:
            True si el estado de pago fue actualizado, False en caso contrario
        """
        pass
