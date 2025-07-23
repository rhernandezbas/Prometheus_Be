from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class NivelInterfaces(ABC):
    """Interfaz para el repositorio de niveles."""
    
    @abstractmethod
    def create_nivel(self, nivel_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo nivel en el sistema.
        
        Args:
            nivel_data: Diccionario con los datos del nivel a crear
            
        Returns:
            El nivel creado
        """
        pass
    
    @abstractmethod
    def get_nivel_by_id(self, nivel_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un nivel por su ID.
        
        Args:
            nivel_id: ID del nivel a buscar
            
        Returns:
            Nivel encontrado o None
        """
        pass
    
    @abstractmethod
    def get_nivel_by_nombre(self, nombre: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un nivel por su nombre.
        
        Args:
            nombre: Nombre del nivel a buscar
            
        Returns:
            Nivel encontrado o None
        """
        pass
    
    @abstractmethod
    def update_nivel(self, nivel_id: int, nivel_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los datos de un nivel.
        
        Args:
            nivel_id: ID del nivel a actualizar
            nivel_data: Diccionario con los datos actualizados
            
        Returns:
            Nivel actualizado o None
        """
        pass
    
    @abstractmethod
    def delete_nivel(self, nivel_id: int) -> bool:
        """
        Elimina un nivel del sistema.
        
        Args:
            nivel_id: ID del nivel a eliminar
            
        Returns:
            True si el nivel fue eliminado, False en caso contrario
        """
        pass
    
    @abstractmethod
    def search_all(self, filters: Optional[Dict[str, Any]] = None, 
                  page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """
        Busca niveles con filtros opcionales y paginación.
        
        Args:
            filters: Diccionario de filtros para la búsqueda
            page: Número de página
            per_page: Elementos por página
            
        Returns:
            Diccionario con niveles y metadatos de paginación
        """
        pass
    
    @abstractmethod
    def get_subniveles_by_nivel_id(self, nivel_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todos los subniveles de un nivel específico.
        
        Args:
            nivel_id: ID del nivel
            
        Returns:
            Lista de subniveles del nivel especificado
        """
        pass


class SubnivelInterfaces(ABC):
    """Interfaz para el repositorio de subniveles."""
    
    @abstractmethod
    def create_subnivel(self, subnivel_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo subnivel en el sistema.
        
        Args:
            subnivel_data: Diccionario con los datos del subnivel a crear
            
        Returns:
            El subnivel creado
        """
        pass
    
    @abstractmethod
    def get_subnivel_by_id(self, subnivel_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un subnivel por su ID.
        
        Args:
            subnivel_id: ID del subnivel a buscar
            
        Returns:
            Subnivel encontrado o None
        """
        pass
    
    @abstractmethod
    def get_subnivel_by_numero_and_nivel_id(self, numero: int, nivel_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un subnivel por su número y el ID del nivel.
        
        Args:
            numero: Número del subnivel
            nivel_id: ID del nivel
            
        Returns:
            Subnivel encontrado o None
        """
        pass
    
    @abstractmethod
    def update_subnivel(self, subnivel_id: int, subnivel_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los datos de un subnivel.
        
        Args:
            subnivel_id: ID del subnivel a actualizar
            subnivel_data: Diccionario con los datos actualizados
            
        Returns:
            Subnivel actualizado o None
        """
        pass
    
    @abstractmethod
    def delete_subnivel(self, subnivel_id: int) -> bool:
        """
        Elimina un subnivel del sistema.
        
        Args:
            subnivel_id: ID del subnivel a eliminar
            
        Returns:
            True si el subnivel fue eliminado, False en caso contrario
        """
        pass
    
    @abstractmethod
    def search_all(self, filters: Optional[Dict[str, Any]] = None, 
                  page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """
        Busca subniveles con filtros opcionales y paginación.
        
        Args:
            filters: Diccionario de filtros para la búsqueda
            page: Número de página
            per_page: Elementos por página
            
        Returns:
            Diccionario con subniveles y metadatos de paginación
        """
        pass
