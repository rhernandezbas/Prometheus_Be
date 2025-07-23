"""Repositorio para el manejo de evaluaciones y calificaciones."""
from datetime import datetime
from typing import Dict, Any, Optional, List

from app.models.evaluaciones import Evaluacion, Calificacion
from app.interfaces.evaluacion_interfaces import EvaluacionInterfaces, CalificacionInterfaces
from app.utils.config.config import db
from app.schemas.evaluacion import evaluacion_schema, evaluaciones_schema, calificacion_schema, calificaciones_schema


class EvaluacionRepository(EvaluacionInterfaces):
    """Implementación del repositorio de evaluaciones académicas."""

    def crear_evaluacion(self, evaluacion_data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea una nueva evaluación académica."""
        # Convertir fecha si es string
        if 'fecha' in evaluacion_data and isinstance(evaluacion_data.get('fecha'), str):
            evaluacion_data['fecha'] = datetime.strptime(evaluacion_data.get('fecha'), '%Y-%m-%d').date()
        
        # Agregar timestamps
        current_time = datetime.now()
        evaluacion_data['created_at'] = current_time
        evaluacion_data['updated_at'] = current_time
        
        # Validar y cargar datos usando el esquema
        evaluacion = evaluacion_schema.load(evaluacion_data)
        
        db.session.add(evaluacion)
        db.session.commit()
        
        return evaluacion_schema.dump(evaluacion)

    def get_evaluacion_by_id(self, evaluacion_id: int) -> Optional[Dict[str, Any]]:
        """Obtiene una evaluación por su ID."""
        evaluacion = db.session.query(Evaluacion).filter_by(id=evaluacion_id).first()
        if not evaluacion:
            return None
            
        return evaluacion_schema.dump(evaluacion)

    def update_evaluacion(self, evaluacion_id: int, evaluacion_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Actualiza los datos de una evaluación."""
        evaluacion = db.session.query(Evaluacion).filter_by(id=evaluacion_id).first()
        if not evaluacion:
            return None
            
        # Convertir fecha si es string
        if 'fecha' in evaluacion_data and isinstance(evaluacion_data.get('fecha'), str):
            evaluacion_data['fecha'] = datetime.strptime(evaluacion_data.get('fecha'), '%Y-%m-%d').date()
            
        # Agregar timestamp de actualización
        evaluacion_data['updated_at'] = datetime.now()
        
        # Actualizar solo los campos proporcionados
        for key, value in evaluacion_data.items():
            if hasattr(evaluacion, key):
                setattr(evaluacion, key, value)
                
        db.session.commit()
        return evaluacion_schema.dump(evaluacion)

    def delete_evaluacion(self, evaluacion_id: int) -> bool:
        """Elimina una evaluación académica."""
        evaluacion = db.session.query(Evaluacion).filter_by(id=evaluacion_id).first()
        if not evaluacion:
            return False
        
        # Eliminar también todas las calificaciones asociadas
        db.session.query(Calificacion).filter_by(evaluacion_id=evaluacion_id).delete()
        
        # Eliminar la evaluación
        db.session.delete(evaluacion)
        db.session.commit()
        return True

    def get_evaluaciones_by_nivel(self, nivel_id: int) -> List[Dict[str, Any]]:
        """Obtiene evaluaciones de un nivel específico."""
        evaluaciones = db.session.query(Evaluacion).filter_by(nivel_id=nivel_id).order_by(Evaluacion.fecha).all()
        return evaluaciones_schema.dump(evaluaciones)

    def get_evaluaciones_by_periodo(self, fecha_inicio: str, fecha_fin: str, 
                                 nivel_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """Obtiene evaluaciones en un rango de fechas."""
        fecha_inicio_date = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
        fecha_fin_date = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
        
        query = db.session.query(Evaluacion).filter(
            Evaluacion.fecha >= fecha_inicio_date,
            Evaluacion.fecha <= fecha_fin_date
        )
        
        if nivel_id:
            query = query.filter(Evaluacion.nivel_id == nivel_id)
            
        evaluaciones = query.order_by(Evaluacion.fecha).all()
        
        return evaluaciones_schema.dump(evaluaciones)


class CalificacionRepository(CalificacionInterfaces):
    """Implementación del repositorio de calificaciones."""

    def registrar_calificacion(self, calificacion_data: Dict[str, Any]) -> Dict[str, Any]:
        """Registra la calificación de un alumno."""
        # Verificar si ya existe una calificación para este alumno y evaluación
        calificacion_existente = db.session.query(Calificacion).filter_by(
            evaluacion_id=calificacion_data.get('evaluacion_id'),
            alumno_id=calificacion_data.get('alumno_id')
        ).first()
        
        if calificacion_existente:
            # Actualizar calificación existente
            for key, value in calificacion_data.items():
                if hasattr(calificacion_existente, key):
                    setattr(calificacion_existente, key, value)
            
            calificacion_existente.updated_at = datetime.now()
            db.session.commit()
            return calificacion_schema.dump(calificacion_existente)
        
        # Agregar timestamps
        current_time = datetime.now()
        calificacion_data['created_at'] = current_time
        calificacion_data['updated_at'] = current_time
        
        # Validar y cargar datos usando el esquema
        calificacion = calificacion_schema.load(calificacion_data)
        
        db.session.add(calificacion)
        db.session.commit()
        
        return calificacion_schema.dump(calificacion)

    def get_calificacion(self, evaluacion_id: int, alumno_id: int) -> Optional[Dict[str, Any]]:
        """Obtiene la calificación de un alumno para una evaluación específica."""
        calificacion = db.session.query(Calificacion).filter_by(
            evaluacion_id=evaluacion_id,
            alumno_id=alumno_id
        ).first()
        
        if not calificacion:
            return None
            
        return calificacion_schema.dump(calificacion)

    def get_calificacion_by_id(self, calificacion_id: int) -> Optional[Dict[str, Any]]:
        """Obtiene una calificación por su ID."""
        calificacion = db.session.query(Calificacion).filter_by(id=calificacion_id).first()
        if not calificacion:
            return None
            
        return calificacion_schema.dump(calificacion)

    def update_calificacion(self, calificacion_id: int, calificacion_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Actualiza una calificación."""
        calificacion = db.session.query(Calificacion).filter_by(id=calificacion_id).first()
        if not calificacion:
            return None
            
        # Agregar timestamp de actualización
        calificacion_data['updated_at'] = datetime.now()
        
        # Actualizar solo los campos proporcionados
        for key, value in calificacion_data.items():
            if hasattr(calificacion, key):
                setattr(calificacion, key, value)
                
        db.session.commit()
        return calificacion_schema.dump(calificacion)

    def delete_calificacion(self, calificacion_id: int) -> bool:
        """Elimina una calificación."""
        calificacion = db.session.query(Calificacion).filter_by(id=calificacion_id).first()
        if not calificacion:
            return False
            
        db.session.delete(calificacion)
        db.session.commit()
        return True

    def get_calificaciones_by_evaluacion(self, evaluacion_id: int) -> List[Dict[str, Any]]:
        """Obtiene todas las calificaciones de una evaluación."""
        calificaciones = db.session.query(Calificacion).filter_by(evaluacion_id=evaluacion_id).all()
        return calificaciones_schema.dump(calificaciones)

    def get_calificaciones_by_alumno(self, alumno_id: int) -> List[Dict[str, Any]]:
        """Obtiene todas las calificaciones de un alumno."""
        calificaciones = db.session.query(Calificacion).filter_by(alumno_id=alumno_id).all()
        return calificaciones_schema.dump(calificaciones)
