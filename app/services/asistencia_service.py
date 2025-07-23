"""Servicio para la gestión de asistencia."""
from typing import Dict, Any, Optional, List

from app.repositories.asistencia_repository import AsistenciaRepository


class AsistenciaService:
    """Servicio para gestionar la asistencia de los alumnos."""
    
    def __init__(self):
        """Inicializa el servicio con el repositorio correspondiente."""
        self.repository = AsistenciaRepository()
    
    def registrar_asistencia(self, asistencia_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Registra la asistencia de un alumno.
        
        Args:
            asistencia_data: Datos de asistencia
                - alumno_id: ID del alumno
                - fecha: Fecha de la clase (formato: 'YYYY-MM-DD')
                - presente: True si asistió, False si no
                - comentario: Comentario opcional
                - instructor_id: ID del instructor opcional
                - nivel_id: ID del nivel opcional
                
        Returns:
            Registro de asistencia creado
        """
        return self.repository.registrar_asistencia(asistencia_data)
    
    def registrar_asistencia_multiple(self, asistencias: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Registra la asistencia de múltiples alumnos de una vez.
        
        Args:
            asistencias: Lista de datos de asistencia para diferentes alumnos
            
        Returns:
            Lista de registros de asistencia creados
        """
        resultados = []
        
        for asistencia_data in asistencias:
            try:
                resultado = self.repository.registrar_asistencia(asistencia_data)
                resultados.append(resultado)
            except Exception as e:
                # Agregar registro de error
                resultados.append({
                    'error': str(e),
                    'alumno_id': asistencia_data.get('alumno_id'),
                    'fecha': asistencia_data.get('fecha')
                })
        
        return resultados
    
    def get_asistencia_by_id(self, asistencia_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un registro de asistencia por su ID.
        
        Args:
            asistencia_id: ID del registro de asistencia
            
        Returns:
            Registro de asistencia encontrado o None
        """
        return self.repository.get_asistencia_by_id(asistencia_id)
    
    def get_asistencia_by_alumno_fecha(self, alumno_id: int, fecha: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un registro de asistencia por alumno y fecha.
        
        Args:
            alumno_id: ID del alumno
            fecha: Fecha de la asistencia (formato: 'YYYY-MM-DD')
            
        Returns:
            Registro de asistencia encontrado o None
        """
        return self.repository.get_asistencia_by_alumno_fecha(alumno_id, fecha)
    
    def update_asistencia(self, asistencia_id: int, asistencia_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza un registro de asistencia.
        
        Args:
            asistencia_id: ID del registro de asistencia
            asistencia_data: Datos actualizados
            
        Returns:
            Registro actualizado o None
        """
        return self.repository.update_asistencia(asistencia_id, asistencia_data)
    
    def get_asistencia_by_alumno(self, alumno_id: int, fecha_inicio: Optional[str] = None, fecha_fin: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Obtiene los registros de asistencia de un alumno.
        
        Args:
            alumno_id: ID del alumno
            fecha_inicio: Fecha inicial opcional (formato: 'YYYY-MM-DD')
            fecha_fin: Fecha final opcional (formato: 'YYYY-MM-DD')
            
        Returns:
            Lista de registros de asistencia
        """
        return self.repository.get_asistencia_by_alumno(alumno_id, fecha_inicio, fecha_fin)
    
    def get_asistencia_by_nivel(self, nivel_id: int, fecha: str) -> List[Dict[str, Any]]:
        """
        Obtiene los registros de asistencia de un nivel para una fecha específica.
        
        Args:
            nivel_id: ID del nivel
            fecha: Fecha de la clase (formato: 'YYYY-MM-DD')
            
        Returns:
            Lista de registros de asistencia
        """
        return self.repository.get_asistencia_by_nivel(nivel_id, fecha)
    
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
        return self.repository.get_reporte_asistencia(alumno_id, mes, año)
    
    def delete_asistencia(self, asistencia_id: int) -> bool:
        """
        Elimina un registro de asistencia.
        
        Args:
            asistencia_id: ID del registro de asistencia a eliminar
            
        Returns:
            True si el registro fue eliminado, False en caso contrario
        """
        return self.repository.delete_asistencia(asistencia_id)
