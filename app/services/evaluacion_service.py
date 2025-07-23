"""Servicio para la gestión de evaluaciones y calificaciones."""
from typing import Dict, Any, Optional, List

from app.repositories.evaluacion_repository import EvaluacionRepository, CalificacionRepository


class EvaluacionService:
    """Servicio para gestionar las evaluaciones y calificaciones."""
    
    def __init__(self):
        """Inicializa el servicio con los repositorios correspondientes."""
        self.evaluacion_repository = EvaluacionRepository()
        self.calificacion_repository = CalificacionRepository()
    
    # -------------------- Métodos para Evaluaciones --------------------
    
    def crear_evaluacion(self, evaluacion_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea una nueva evaluación académica.
        
        Args:
            evaluacion_data: Datos de la evaluación
                - titulo: Título de la evaluación
                - descripcion: Descripción de la evaluación
                - fecha: Fecha de la evaluación (formato: 'YYYY-MM-DD')
                - nivel_id: ID del nivel académico
                - subnivel_id: ID del subnivel (opcional)
                - instructor_id: ID del instructor (opcional)
                - puntaje_maximo: Puntaje máximo de la evaluación (default: 100)
                
        Returns:
            Evaluación creada
        """
        return self.evaluacion_repository.crear_evaluacion(evaluacion_data)
    
    def get_evaluacion_by_id(self, evaluacion_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene una evaluación por su ID.
        
        Args:
            evaluacion_id: ID de la evaluación
            
        Returns:
            Evaluación encontrada o None
        """
        return self.evaluacion_repository.get_evaluacion_by_id(evaluacion_id)
    
    def update_evaluacion(self, evaluacion_id: int, evaluacion_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza una evaluación académica.
        
        Args:
            evaluacion_id: ID de la evaluación a actualizar
            evaluacion_data: Datos actualizados
            
        Returns:
            Evaluación actualizada o None
        """
        return self.evaluacion_repository.update_evaluacion(evaluacion_id, evaluacion_data)
    
    def delete_evaluacion(self, evaluacion_id: int) -> bool:
        """
        Elimina una evaluación académica.
        
        Args:
            evaluacion_id: ID de la evaluación a eliminar
            
        Returns:
            True si la evaluación fue eliminada, False en caso contrario
        """
        return self.evaluacion_repository.delete_evaluacion(evaluacion_id)
    
    def get_evaluaciones_by_nivel(self, nivel_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene evaluaciones de un nivel específico.
        
        Args:
            nivel_id: ID del nivel académico
            
        Returns:
            Lista de evaluaciones del nivel
        """
        return self.evaluacion_repository.get_evaluaciones_by_nivel(nivel_id)
    
    def get_evaluaciones_by_periodo(self, fecha_inicio: str, fecha_fin: str, nivel_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Obtiene evaluaciones en un rango de fechas.
        
        Args:
            fecha_inicio: Fecha inicial (formato: 'YYYY-MM-DD')
            fecha_fin: Fecha final (formato: 'YYYY-MM-DD')
            nivel_id: Filtro opcional por nivel
            
        Returns:
            Lista de evaluaciones en el rango
        """
        return self.evaluacion_repository.get_evaluaciones_by_periodo(fecha_inicio, fecha_fin, nivel_id)
    
    # -------------------- Métodos para Calificaciones --------------------
    
    def registrar_calificacion(self, calificacion_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Registra la calificación de un alumno.
        
        Args:
            calificacion_data: Datos de la calificación
                - evaluacion_id: ID de la evaluación
                - alumno_id: ID del alumno
                - puntaje: Puntaje obtenido
                - comentario: Comentario opcional
                
        Returns:
            Calificación registrada
        """
        # Verificar que la evaluación existe
        evaluacion = self.evaluacion_repository.get_evaluacion_by_id(calificacion_data.get('evaluacion_id'))
        if not evaluacion:
            raise ValueError(f"La evaluación con ID {calificacion_data.get('evaluacion_id')} no existe")
        
        return self.calificacion_repository.registrar_calificacion(calificacion_data)
    
    def registrar_calificaciones_multiple(self, calificaciones: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Registra calificaciones para múltiples alumnos de una vez.
        
        Args:
            calificaciones: Lista de datos de calificaciones
            
        Returns:
            Lista de calificaciones registradas
        """
        resultados = []
        
        for calificacion_data in calificaciones:
            try:
                resultado = self.registrar_calificacion(calificacion_data)
                resultados.append(resultado)
            except Exception as e:
                # Agregar registro de error
                resultados.append({
                    'error': str(e),
                    'evaluacion_id': calificacion_data.get('evaluacion_id'),
                    'alumno_id': calificacion_data.get('alumno_id')
                })
        
        return resultados
    
    def get_calificacion(self, evaluacion_id: int, alumno_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene la calificación de un alumno para una evaluación específica.
        
        Args:
            evaluacion_id: ID de la evaluación
            alumno_id: ID del alumno
            
        Returns:
            Calificación encontrada o None
        """
        return self.calificacion_repository.get_calificacion(evaluacion_id, alumno_id)
    
    def get_calificacion_by_id(self, calificacion_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene una calificación por su ID.
        
        Args:
            calificacion_id: ID de la calificación
            
        Returns:
            Calificación encontrada o None
        """
        return self.calificacion_repository.get_calificacion_by_id(calificacion_id)
    
    def update_calificacion(self, calificacion_id: int, calificacion_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza una calificación.
        
        Args:
            calificacion_id: ID de la calificación a actualizar
            calificacion_data: Datos actualizados
            
        Returns:
            Calificación actualizada o None
        """
        return self.calificacion_repository.update_calificacion(calificacion_id, calificacion_data)
    
    def delete_calificacion(self, calificacion_id: int) -> bool:
        """
        Elimina una calificación.
        
        Args:
            calificacion_id: ID de la calificación a eliminar
            
        Returns:
            True si la calificación fue eliminada, False en caso contrario
        """
        return self.calificacion_repository.delete_calificacion(calificacion_id)
    
    def get_calificaciones_by_evaluacion(self, evaluacion_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todas las calificaciones de una evaluación.
        
        Args:
            evaluacion_id: ID de la evaluación
            
        Returns:
            Lista de calificaciones
        """
        return self.calificacion_repository.get_calificaciones_by_evaluacion(evaluacion_id)
    
    def get_calificaciones_by_alumno(self, alumno_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todas las calificaciones de un alumno.
        
        Args:
            alumno_id: ID del alumno
            
        Returns:
            Lista de calificaciones
        """
        return self.calificacion_repository.get_calificaciones_by_alumno(alumno_id)
    
    def get_reporte_academico(self, alumno_id: int, nivel_id: Optional[int] = None) -> Dict[str, Any]:
        """
        Genera un reporte académico de un alumno.
        
        Args:
            alumno_id: ID del alumno
            nivel_id: Filtro opcional por nivel
            
        Returns:
            Reporte académico con calificaciones y estadísticas
        """
        # Obtener calificaciones del alumno
        calificaciones = self.calificacion_repository.get_calificaciones_by_alumno(alumno_id)
        if not calificaciones:
            return {
                'alumno_id': alumno_id,
                'nivel_id': nivel_id,
                'calificaciones': [],
                'promedio': 0,
                'maximo': 0,
                'minimo': 0,
                'total_evaluaciones': 0
            }
        
        # Filtrar por nivel si es necesario
        if nivel_id:
            # Obtener IDs de evaluaciones del nivel
            evaluaciones_nivel = self.evaluacion_repository.get_evaluaciones_by_nivel(nivel_id)
            eval_ids = [e['id'] for e in evaluaciones_nivel]
            
            # Filtrar calificaciones
            calificaciones = [c for c in calificaciones if c['evaluacion_id'] in eval_ids]
        
        # Calcular estadísticas
        if calificaciones:
            puntajes = [c['puntaje'] for c in calificaciones]
            promedio = sum(puntajes) / len(puntajes)
            maximo = max(puntajes)
            minimo = min(puntajes)
            
            # Obtener detalles de las evaluaciones
            calificaciones_con_evaluacion = []
            for c in calificaciones:
                eval_data = self.evaluacion_repository.get_evaluacion_by_id(c['evaluacion_id'])
                if eval_data:
                    calificaciones_con_evaluacion.append({
                        'calificacion': c,
                        'evaluacion': eval_data
                    })
            
            return {
                'alumno_id': alumno_id,
                'nivel_id': nivel_id,
                'calificaciones': calificaciones_con_evaluacion,
                'promedio': promedio,
                'maximo': maximo,
                'minimo': minimo,
                'total_evaluaciones': len(calificaciones)
            }
        
        return {
            'alumno_id': alumno_id,
            'nivel_id': nivel_id,
            'calificaciones': [],
            'promedio': 0,
            'maximo': 0,
            'minimo': 0,
            'total_evaluaciones': 0
        }
