"""Interfaces para el repositorio de asistencia."""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List


class AsistenciaInterfaces(ABC):
    """Interfaz para el repositorio de asistencia de alumnos."""
    
    @abstractmethod
    def registrar_asistencia(self, asistencia_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Registra la asistencia de un alumno.
        
        Args:
            asistencia_data: Diccionario con los datos de asistencia
                - alumno_id: ID del alumno
                - fecha: Fecha de la clase
                - presente: True si asistió, False si no
                - comentario: Comentario opcional
                - instructor_id: ID del instructor opcional
                - nivel_id: ID del nivel opcional
                
        Returns:
            Registro de asistencia creado
        """
        pass
    
    @abstractmethod
    def get_asistencia_by_id(self, asistencia_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un registro de asistencia por su ID.
        
        Args:
            asistencia_id: ID del registro de asistencia
            
        Returns:
            Registro de asistencia encontrado o None
        """
        pass
    
    @abstractmethod
    def get_asistencia_by_alumno_fecha(self, alumno_id: int, fecha: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un registro de asistencia por alumno y fecha.
        
        Args:
            alumno_id: ID del alumno
            fecha: Fecha de la asistencia (formato: 'YYYY-MM-DD')
            
        Returns:
            Registro de asistencia encontrado o None
        """
        pass
    
    @abstractmethod
    def update_asistencia(self, asistencia_id: int, asistencia_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza un registro de asistencia.
        
        Args:
            asistencia_id: ID del registro de asistencia
            asistencia_data: Datos actualizados de asistencia
            
        Returns:
            Registro actualizado o None
        """
        pass
    
    @abstractmethod
    def delete_asistencia(self, asistencia_id: int) -> bool:
        """
        Elimina un registro de asistencia.
        
        Args:
            asistencia_id: ID del registro a eliminar
            
        Returns:
            True si el registro fue eliminado, False en caso contrario
        """
        pass
    
    @abstractmethod
    def get_asistencia_by_alumno(self, alumno_id: int, fecha_inicio: Optional[str] = None,
                              fecha_fin: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Obtiene los registros de asistencia de un alumno.
        
        Args:
            alumno_id: ID del alumno
            fecha_inicio: Fecha inicial opcional (formato: 'YYYY-MM-DD')
            fecha_fin: Fecha final opcional (formato: 'YYYY-MM-DD')
            
        Returns:
            Lista de registros de asistencia
        """
        pass
    
    @abstractmethod
    def get_asistencia_by_nivel(self, nivel_id: int, fecha: str) -> List[Dict[str, Any]]:
        """
        Obtiene los registros de asistencia de un nivel para una fecha específica.
        
        Args:
            nivel_id: ID del nivel
            fecha: Fecha de la clase (formato: 'YYYY-MM-DD')
            
        Returns:
            Lista de registros de asistencia
        """
        pass
    
    @abstractmethod
    def get_reporte_asistencia(self, alumno_id: int, mes: int, año: int) -> Dict[str, Any]:
        """
        Genera un reporte mensual de asistencia de un alumno.
        
        Args:
            alumno_id: ID del alumno
            mes: Mes (1-12)
            año: Año
            
        Returns:
            Reporte de asistencia
        """
        pass
