"""Servicio para la gestión del calendario académico."""
from typing import Dict, Any, Optional, List

from app.repositories.calendario_repository import CalendarioRepository


class CalendarioService:
    """Servicio para gestionar el calendario académico."""
    
    def __init__(self):
        """Inicializa el servicio con el repositorio correspondiente."""
        self.repository = CalendarioRepository()
    
    def crear_evento(self, evento_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo evento en el calendario.
        
        Args:
            evento_data: Datos del evento
                - titulo: Título del evento
                - descripcion: Descripción del evento
                - fecha_inicio: Fecha y hora de inicio (formato ISO)
                - fecha_fin: Fecha y hora de fin (formato ISO)
                - todo_el_dia: True si el evento dura todo el día
                - tipo: Tipo de evento (clase, examen, etc.)
                - nivel_id: ID del nivel relacionado (opcional)
                - instructor_id: ID del instructor relacionado (opcional)
                - color: Color para mostrar en calendario (opcional)
                
        Returns:
            Evento creado
        """
        return self.repository.create_evento(evento_data)
    
    def get_evento_by_id(self, evento_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un evento por su ID.
        
        Args:
            evento_id: ID del evento
            
        Returns:
            Evento encontrado o None
        """
        return self.repository.get_evento_by_id(evento_id)
    
    def update_evento(self, evento_id: int, evento_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza un evento del calendario.
        
        Args:
            evento_id: ID del evento a actualizar
            evento_data: Datos actualizados
            
        Returns:
            Evento actualizado o None
        """
        return self.repository.update_evento(evento_id, evento_data)
    
    def delete_evento(self, evento_id: int) -> bool:
        """
        Elimina un evento del calendario.
        
        Args:
            evento_id: ID del evento a eliminar
            
        Returns:
            True si el evento fue eliminado, False en caso contrario
        """
        return self.repository.delete_evento(evento_id)
    
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
        return self.repository.get_eventos_by_rango(
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin,
            tipo=tipo,
            nivel_id=nivel_id,
            instructor_id=instructor_id
        )
    
    def get_eventos_by_nivel(self, nivel_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene eventos asociados a un nivel específico.
        
        Args:
            nivel_id: ID del nivel
            
        Returns:
            Lista de eventos del nivel
        """
        return self.repository.get_eventos_by_nivel(nivel_id)
    
    def get_eventos_by_instructor(self, instructor_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene eventos asociados a un instructor específico.
        
        Args:
            instructor_id: ID del instructor
            
        Returns:
            Lista de eventos del instructor
        """
        return self.repository.get_eventos_by_instructor(instructor_id)
    
    def get_eventos_proximos(self, dias: int = 7, nivel_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Obtiene eventos próximos en los siguientes días.
        
        Args:
            dias: Número de días a considerar
            nivel_id: Filtro opcional por nivel
            
        Returns:
            Lista de eventos próximos
        """
        return self.repository.get_eventos_proximos(dias=dias, nivel_id=nivel_id)
