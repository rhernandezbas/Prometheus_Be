"""Repositorio para el manejo de asistencia de alumnos."""
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List

from app.models.asistencia import Asistencia
from app.interfaces.asistencia_interfaces import AsistenciaInterfaces
from app.utils.config.config import db
from app.schemas.asistencia import asistencia_schema, asistencias_schema


class AsistenciaRepository(AsistenciaInterfaces):
    """Implementación del repositorio de asistencia de alumnos."""

    def registrar_asistencia(self, asistencia_data: Dict[str, Any]) -> Dict[str, Any]:
        """Registra la asistencia de un alumno."""
        # Convertir fecha si es string
        if 'fecha' in asistencia_data and isinstance(asistencia_data.get('fecha'), str):
            asistencia_data['fecha'] = datetime.strptime(asistencia_data.get('fecha'), '%Y-%m-%d').date()
            
        # Verificar si ya existe un registro para esta fecha y alumno
        registro_existente = db.session.query(Asistencia).filter_by(
            alumno_id=asistencia_data.get('alumno_id'),
            fecha=asistencia_data.get('fecha')
        ).first()
        
        if registro_existente:
            # Actualizar registro existente
            for key, value in asistencia_data.items():
                if hasattr(registro_existente, key):
                    setattr(registro_existente, key, value)
            
            registro_existente.updated_at = datetime.now()
            db.session.commit()
            return asistencia_schema.dump(registro_existente)
        
        # Agregar timestamps
        current_time = datetime.now()
        asistencia_data['created_at'] = current_time
        asistencia_data['updated_at'] = current_time
        
        # Validar y cargar datos usando el esquema
        asistencia = asistencia_schema.load(asistencia_data)
        
        # Guardar nueva asistencia
        db.session.add(asistencia)
        db.session.commit()
        
        return asistencia_schema.dump(asistencia)

    def get_asistencia_by_id(self, asistencia_id: int) -> Optional[Dict[str, Any]]:
        """Obtiene un registro de asistencia por su ID."""
        asistencia = db.session.query(Asistencia).filter_by(id=asistencia_id).first()
        if not asistencia:
            return None
            
        return asistencia_schema.dump(asistencia)

    def get_asistencia_by_alumno_fecha(self, alumno_id: int, fecha: str) -> Optional[Dict[str, Any]]:
        """Obtiene un registro de asistencia por alumno y fecha."""
        fecha_date = datetime.strptime(fecha, '%Y-%m-%d').date() if isinstance(fecha, str) else fecha
        
        asistencia = db.session.query(Asistencia).filter_by(
            alumno_id=alumno_id,
            fecha=fecha_date
        ).first()
        
        if not asistencia:
            return None
            
        return asistencia_schema.dump(asistencia)

    def update_asistencia(self, asistencia_id: int, asistencia_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Actualiza un registro de asistencia."""
        asistencia = db.session.query(Asistencia).filter_by(id=asistencia_id).first()
        if not asistencia:
            return None
            
        # Convertir fecha si es string
        if 'fecha' in asistencia_data and isinstance(asistencia_data.get('fecha'), str):
            asistencia_data['fecha'] = datetime.strptime(asistencia_data.get('fecha'), '%Y-%m-%d').date()
            
        # Agregar timestamp de actualización
        asistencia_data['updated_at'] = datetime.now()
        
        # Actualizar solo los campos proporcionados
        for key, value in asistencia_data.items():
            if hasattr(asistencia, key):
                setattr(asistencia, key, value)
                
        db.session.commit()
        return asistencia_schema.dump(asistencia)

    def delete_asistencia(self, asistencia_id: int) -> bool:
        """Elimina un registro de asistencia."""
        asistencia = db.session.query(Asistencia).filter_by(id=asistencia_id).first()
        if not asistencia:
            return False
            
        db.session.delete(asistencia)
        db.session.commit()
        return True

    def get_asistencia_by_alumno(self, alumno_id: int, fecha_inicio: Optional[str] = None,
                              fecha_fin: Optional[str] = None) -> List[Dict[str, Any]]:
        """Obtiene los registros de asistencia de un alumno."""
        query = db.session.query(Asistencia).filter(Asistencia.alumno_id == alumno_id)
        
        if fecha_inicio:
            fecha_inicio_date = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
            query = query.filter(Asistencia.fecha >= fecha_inicio_date)
            
        if fecha_fin:
            fecha_fin_date = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
            query = query.filter(Asistencia.fecha <= fecha_fin_date)
        
        asistencias = query.order_by(Asistencia.fecha).all()
        return asistencias_schema.dump(asistencias)

    def get_asistencia_by_nivel(self, nivel_id: int, fecha: str) -> List[Dict[str, Any]]:
        """Obtiene los registros de asistencia de un nivel para una fecha específica."""
        fecha_date = datetime.strptime(fecha, '%Y-%m-%d').date() if isinstance(fecha, str) else fecha
        
        asistencias = db.session.query(Asistencia).filter(
            Asistencia.nivel_id == nivel_id,
            Asistencia.fecha == fecha_date
        ).all()
        
        return asistencias_schema.dump(asistencias)

    def get_reporte_asistencia(self, alumno_id: int, mes: int, año: int) -> Dict[str, Any]:
        """Genera un reporte mensual de asistencia de un alumno."""
        # Determinar el primer y último día del mes
        primer_dia = datetime(año, mes, 1).date()
        if mes == 12:
            ultimo_dia = datetime(año + 1, 1, 1).date() - timedelta(days=1)
        else:
            ultimo_dia = datetime(año, mes + 1, 1).date() - timedelta(days=1)
        
        # Obtener registros de asistencia del mes
        asistencias = db.session.query(Asistencia).filter(
            Asistencia.alumno_id == alumno_id,
            Asistencia.fecha >= primer_dia,
            Asistencia.fecha <= ultimo_dia
        ).order_by(Asistencia.fecha).all()
        
        # Contar presentes y ausentes
        total_clases = len(asistencias)
        total_presentes = sum(1 for a in asistencias if a.presente)
        total_ausentes = total_clases - total_presentes
        
        # Calcular porcentaje de asistencia
        porcentaje_asistencia = (total_presentes / total_clases * 100) if total_clases > 0 else 0
        
        # Preparar detalles por día
        detalles_por_dia = {}
        for asistencia in asistencias:
            dia = asistencia.fecha.day
            detalles_por_dia[dia] = {
                'fecha': asistencia.fecha.strftime('%Y-%m-%d'),
                'presente': asistencia.presente,
                'comentario': asistencia.comentario
            }
        
        return {
            'alumno_id': alumno_id,
            'mes': mes,
            'año': año,
            'total_clases': total_clases,
            'total_presentes': total_presentes,
            'total_ausentes': total_ausentes,
            'porcentaje_asistencia': porcentaje_asistencia,
            'detalles_por_dia': detalles_por_dia,
            'asistencias': asistencias_schema.dump(asistencias)
        }
