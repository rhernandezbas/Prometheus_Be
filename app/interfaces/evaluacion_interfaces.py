"""Interfaces para los repositorios de evaluaciones y calificaciones."""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List


class EvaluacionInterfaces(ABC):
    """Interfaz para el repositorio de evaluaciones académicas."""
    
    @abstractmethod
    def crear_evaluacion(self, evaluacion_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea una nueva evaluación académica.
        
        Args:
            evaluacion_data: Diccionario con los datos de la evaluación
            
        Returns:
            La evaluación creada
        """
        pass
    
    @abstractmethod
    def get_evaluacion_by_id(self, evaluacion_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene una evaluación por su ID.
        
        Args:
            evaluacion_id: ID de la evaluación a buscar
            
        Returns:
            Evaluación encontrada o None
        """
        pass
    
    @abstractmethod
    def update_evaluacion(self, evaluacion_id: int, evaluacion_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los datos de una evaluación.
        
        Args:
            evaluacion_id: ID de la evaluación a actualizar
            evaluacion_data: Diccionario con los datos actualizados
            
        Returns:
            Evaluación actualizada o None
        """
        pass
    
    @abstractmethod
    def delete_evaluacion(self, evaluacion_id: int) -> bool:
        """
        Elimina una evaluación académica.
        
        Args:
            evaluacion_id: ID de la evaluación a eliminar
            
        Returns:
            True si la evaluación fue eliminada, False en caso contrario
        """
        pass
    
    @abstractmethod
    def get_evaluaciones_by_nivel(self, nivel_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene evaluaciones de un nivel específico.
        
        Args:
            nivel_id: ID del nivel académico
            
        Returns:
            Lista de evaluaciones del nivel
        """
        pass
    
    @abstractmethod
    def get_evaluaciones_by_periodo(self, fecha_inicio: str, fecha_fin: str, 
                                 nivel_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Obtiene evaluaciones en un rango de fechas.
        
        Args:
            fecha_inicio: Fecha inicial (formato: 'YYYY-MM-DD')
            fecha_fin: Fecha final (formato: 'YYYY-MM-DD')
            nivel_id: Filtro opcional por nivel
            
        Returns:
            Lista de evaluaciones en el rango
        """
        pass


class CalificacionInterfaces(ABC):
    """Interfaz para el repositorio de calificaciones."""
    
    @abstractmethod
    def registrar_calificacion(self, calificacion_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Registra la calificación de un alumno.
        
        Args:
            calificacion_data: Diccionario con los datos de la calificación
            
        Returns:
            La calificación registrada
        """
        pass
    
    @abstractmethod
    def get_calificacion(self, evaluacion_id: int, alumno_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene la calificación de un alumno para una evaluación específica.
        
        Args:
            evaluacion_id: ID de la evaluación
            alumno_id: ID del alumno
            
        Returns:
            Calificación encontrada o None
        """
        pass
    
    @abstractmethod
    def get_calificacion_by_id(self, calificacion_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene una calificación por su ID.
        
        Args:
            calificacion_id: ID de la calificación
            
        Returns:
            Calificación encontrada o None
        """
        pass
    
    @abstractmethod
    def update_calificacion(self, calificacion_id: int, calificacion_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza una calificación.
        
        Args:
            calificacion_id: ID de la calificación a actualizar
            calificacion_data: Datos actualizados de la calificación
            
        Returns:
            Calificación actualizada o None
        """
        pass
    
    @abstractmethod
    def delete_calificacion(self, calificacion_id: int) -> bool:
        """
        Elimina una calificación.
        
        Args:
            calificacion_id: ID de la calificación a eliminar
            
        Returns:
            True si la calificación fue eliminada, False en caso contrario
        """
        pass
    
    @abstractmethod
    def get_calificaciones_by_evaluacion(self, evaluacion_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todas las calificaciones de una evaluación.
        
        Args:
            evaluacion_id: ID de la evaluación
            
        Returns:
            Lista de calificaciones
        """
        pass
    
    @abstractmethod
    def get_calificaciones_by_alumno(self, alumno_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todas las calificaciones de un alumno.
        
        Args:
            alumno_id: ID del alumno
            
        Returns:
            Lista de calificaciones
        """
        pass
