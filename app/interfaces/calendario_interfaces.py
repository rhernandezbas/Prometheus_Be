"""Interfaces para el repositorio de calendario."""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List


class CalendarioInterfaces(ABC):
    """Interfaz para el repositorio de eventos de calendario."""
    
    @abstractmethod
    def create_evento(self, evento_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo evento en el calendario.
        
        Args:
            evento_data: Diccionario con los datos del evento a crear
            
        Returns:
            El evento creado
        """
        pass
    
    @abstractmethod
    def get_evento_by_id(self, evento_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un evento por su ID.
        
        Args:
            evento_id: ID del evento a buscar
            
        Returns:
            Evento encontrado o None
        """
        pass
    
    @abstractmethod
    def update_evento(self, evento_id: int, evento_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los datos de un evento.
        
        Args:
            evento_id: ID del evento a actualizar
            evento_data: Diccionario con los datos actualizados
            
        Returns:
            Evento actualizado o None
        """
        pass
    
    @abstractmethod
    def delete_evento(self, evento_id: int) -> bool:
        """
        Elimina un evento del calendario.
        
        Args:
            evento_id: ID del evento a eliminar
            
        Returns:
            True si el evento fue eliminado, False en caso contrario
        """
        pass
    
    @abstractmethod
    def get_eventos_by_rango(self, fecha_inicio: str, fecha_fin: str,
                           tipo: Optional[str] = None,
                           nivel_id: Optional[int] = None,
                           instructor_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Obtiene eventos en un rango de fechas con filtros opcionales.
        
        Args:
            fecha_inicio: Fecha inicial (formato ISO)
            fecha_fin: Fecha final (formato ISO)
            tipo: Filtro por tipo de evento
            nivel_id: Filtro por nivel
            instructor_id: Filtro por instructor
            
        Returns:
            Lista de eventos en el rango
        """
        pass
    
    @abstractmethod
    def get_eventos_by_nivel(self, nivel_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene eventos asociados a un nivel específico.
        
        Args:
            nivel_id: ID del nivel
            
        Returns:
            Lista de eventos del nivel
        """
        pass
    
    @abstractmethod
    def get_eventos_by_instructor(self, instructor_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene eventos asociados a un instructor específico.
        
        Args:
            instructor_id: ID del instructor
            
        Returns:
            Lista de eventos del instructor
        """
        pass
    
    @abstractmethod
    def get_eventos_proximos(self, dias: int = 7, nivel_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Obtiene eventos próximos en los siguientes días.
        
        Args:
            dias: Número de días a considerar
            nivel_id: Filtro opcional por nivel
            
        Returns:
            Lista de eventos próximos
        """
        pass
