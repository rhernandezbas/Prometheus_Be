from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class GastosInterfaces(ABC):
    """Interfaz para el repositorio de gastos."""
    
    @abstractmethod
    def create_gasto(self, gasto_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo registro de gasto en el sistema.
        
        Args:
            gasto_data: Diccionario con los datos del gasto a crear
            
        Returns:
            El gasto creado
        """
        pass
    
    @abstractmethod
    def get_gasto_by_id(self, gasto_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un gasto por su ID.
        
        Args:
            gasto_id: ID del gasto a buscar
            
        Returns:
            Gasto encontrado o None
        """
        pass
    
    @abstractmethod
    def get_gastos_by_instructor_id(self, instructor_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todos los gastos asociados a un instructor.
        
        Args:
            instructor_id: ID del instructor
            
        Returns:
            Lista de gastos del instructor
        """
        pass
    
    @abstractmethod
    def update_gasto(self, gasto_id: int, gasto_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los datos de un gasto.
        
        Args:
            gasto_id: ID del gasto a actualizar
            gasto_data: Diccionario con los datos actualizados
            
        Returns:
            Gasto actualizado o None
        """
        pass
    
    @abstractmethod
    def delete_gasto(self, gasto_id: int) -> bool:
        """
        Elimina un gasto del sistema.
        
        Args:
            gasto_id: ID del gasto a eliminar
            
        Returns:
            True si el gasto fue eliminado, False en caso contrario
        """
        pass
    
    @abstractmethod
    def search_all(self, filters: Optional[Dict[str, Any]] = None, 
                  page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """
        Busca gastos con filtros opcionales y paginación.
        
        Args:
            filters: Diccionario de filtros para la búsqueda
            page: Número de página
            per_page: Elementos por página
            
        Returns:
            Diccionario con gastos y metadatos de paginación
        """
        pass
    
    @abstractmethod
    def get_gastos_by_fecha(self, fecha_inicio: str, fecha_fin: str) -> List[Dict[str, Any]]:
        """
        Obtiene gastos dentro de un rango de fechas.
        
        Args:
            fecha_inicio: Fecha inicial
            fecha_fin: Fecha final
            
        Returns:
            Lista de gastos en el rango de fechas
        """
        pass
    
    @abstractmethod
    def get_gastos_by_tipo(self, tipo: str) -> List[Dict[str, Any]]:
        """
        Obtiene gastos por tipo.
        
        Args:
            tipo: Tipo de gasto
            
        Returns:
            Lista de gastos del tipo especificado
        """
        pass


class IngresosInterfaces(ABC):
    """Interfaz para el repositorio de ingresos."""
    
    @abstractmethod
    def create_ingreso(self, ingreso_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo registro de ingreso en el sistema.
        
        Args:
            ingreso_data: Diccionario con los datos del ingreso a crear
            
        Returns:
            El ingreso creado
        """
        pass
    
    @abstractmethod
    def get_ingreso_by_id(self, ingreso_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un ingreso por su ID.
        
        Args:
            ingreso_id: ID del ingreso a buscar
            
        Returns:
            Ingreso encontrado o None
        """
        pass
    
    @abstractmethod
    def get_ingresos_by_alumno_id(self, alumno_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todos los ingresos asociados a un alumno.
        
        Args:
            alumno_id: ID del alumno
            
        Returns:
            Lista de ingresos del alumno
        """
        pass
    
    @abstractmethod
    def update_ingreso(self, ingreso_id: int, ingreso_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los datos de un ingreso.
        
        Args:
            ingreso_id: ID del ingreso a actualizar
            ingreso_data: Diccionario con los datos actualizados
            
        Returns:
            Ingreso actualizado o None
        """
        pass
    
    @abstractmethod
    def delete_ingreso(self, ingreso_id: int) -> bool:
        """
        Elimina un ingreso del sistema.
        
        Args:
            ingreso_id: ID del ingreso a eliminar
            
        Returns:
            True si el ingreso fue eliminado, False en caso contrario
        """
        pass
    
    @abstractmethod
    def search_all(self, filters: Optional[Dict[str, Any]] = None, 
                  page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """
        Busca ingresos con filtros opcionales y paginación.
        
        Args:
            filters: Diccionario de filtros para la búsqueda
            page: Número de página
            per_page: Elementos por página
            
        Returns:
            Diccionario con ingresos y metadatos de paginación
        """
        pass
    
    @abstractmethod
    def get_ingresos_by_fecha(self, fecha_inicio: str, fecha_fin: str) -> List[Dict[str, Any]]:
        """
        Obtiene ingresos dentro de un rango de fechas.
        
        Args:
            fecha_inicio: Fecha inicial
            fecha_fin: Fecha final
            
        Returns:
            Lista de ingresos en el rango de fechas
        """
        pass
    
    @abstractmethod
    def get_ingresos_by_tipo(self, tipo: str) -> List[Dict[str, Any]]:
        """
        Obtiene ingresos por tipo.
        
        Args:
            tipo: Tipo de ingreso
            
        Returns:
            Lista de ingresos del tipo especificado
        """
        pass
