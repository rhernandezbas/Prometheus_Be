"""Repositorio para el manejo de eventos del calendario."""
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List

from app.models.calendar import EventoCalendario
from app.interfaces.calendario_interfaces import CalendarioInterfaces
from app.utils.config.config import db
from app.schemas.calendario import evento_schema, eventos_schema


class CalendarioRepository(CalendarioInterfaces):
    """Implementación del repositorio de eventos de calendario."""

    def create_evento(self, evento_data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea un nuevo evento en el calendario."""
        # Convertir fechas ISO a objetos datetime
        if 'fecha_inicio' in evento_data and isinstance(evento_data.get('fecha_inicio'), str):
            evento_data['fecha_inicio'] = datetime.fromisoformat(evento_data.get('fecha_inicio'))
        if 'fecha_fin' in evento_data and isinstance(evento_data.get('fecha_fin'), str):
            evento_data['fecha_fin'] = datetime.fromisoformat(evento_data.get('fecha_fin'))
            
        # Agregar timestamps
        current_time = datetime.now()
        evento_data['created_at'] = current_time
        evento_data['updated_at'] = current_time
        
        # Validar y cargar datos usando el esquema
        evento = evento_schema.load(evento_data)
        
        db.session.add(evento)
        db.session.commit()
        
        return evento_schema.dump(evento)

    def get_evento_by_id(self, evento_id: int) -> Optional[Dict[str, Any]]:
        """Obtiene un evento por su ID."""
        evento = db.session.query(EventoCalendario).filter_by(id=evento_id).first()
        if not evento:
            return None
            
        return evento_schema.dump(evento)

    def update_evento(self, evento_id: int, evento_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Actualiza los datos de un evento."""
        evento = db.session.query(EventoCalendario).filter_by(id=evento_id).first()
        if not evento:
            return None
            
        # Convertir fechas ISO a objetos datetime
        if 'fecha_inicio' in evento_data and isinstance(evento_data.get('fecha_inicio'), str):
            evento_data['fecha_inicio'] = datetime.fromisoformat(evento_data.get('fecha_inicio'))
        if 'fecha_fin' in evento_data and isinstance(evento_data.get('fecha_fin'), str):
            evento_data['fecha_fin'] = datetime.fromisoformat(evento_data.get('fecha_fin'))
            
        # Agregar timestamp de actualización
        evento_data['updated_at'] = datetime.now()
        
        # Actualizar solo los campos proporcionados
        for key, value in evento_data.items():
            if hasattr(evento, key):
                setattr(evento, key, value)
                
        db.session.commit()
        return evento_schema.dump(evento)

    def delete_evento(self, evento_id: int) -> bool:
        """Elimina un evento del calendario."""
        evento = db.session.query(EventoCalendario).filter_by(id=evento_id).first()
        if not evento:
            return False
            
        db.session.delete(evento)
        db.session.commit()
        return True

    def get_eventos_by_rango(self, fecha_inicio: str, fecha_fin: str, 
                           tipo: Optional[str] = None, 
                           nivel_id: Optional[int] = None,
                           instructor_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """Obtiene eventos en un rango de fechas con filtros opcionales."""
        # Convertir fechas ISO a objetos datetime
        fecha_inicio_dt = datetime.fromisoformat(fecha_inicio)
        fecha_fin_dt = datetime.fromisoformat(fecha_fin)
        
        # Construir consulta
        query = db.session.query(EventoCalendario).filter(
            EventoCalendario.fecha_inicio >= fecha_inicio_dt,
            EventoCalendario.fecha_fin <= fecha_fin_dt
        )
        
        # Aplicar filtros opcionales
        if tipo:
            query = query.filter(EventoCalendario.tipo == tipo)
        if nivel_id:
            query = query.filter(EventoCalendario.nivel_id == nivel_id)
        if instructor_id:
            query = query.filter(EventoCalendario.instructor_id == instructor_id)
            
        # Ejecutar consulta
        eventos = query.order_by(EventoCalendario.fecha_inicio).all()
        
        return eventos_schema.dump(eventos)

    def get_eventos_by_nivel(self, nivel_id: int) -> List[Dict[str, Any]]:
        """Obtiene eventos asociados a un nivel específico."""
        eventos = db.session.query(EventoCalendario).filter(
            EventoCalendario.nivel_id == nivel_id
        ).order_by(EventoCalendario.fecha_inicio).all()
        
        return eventos_schema.dump(eventos)

    def get_eventos_by_instructor(self, instructor_id: int) -> List[Dict[str, Any]]:
        """Obtiene eventos asociados a un instructor específico."""
        eventos = db.session.query(EventoCalendario).filter(
            EventoCalendario.instructor_id == instructor_id
        ).order_by(EventoCalendario.fecha_inicio).all()
        
        return eventos_schema.dump(eventos)

    def get_eventos_proximos(self, dias: int = 7, nivel_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """Obtiene eventos próximos en los siguientes días."""
        # Fecha actual y fecha límite
        fecha_actual = datetime.now()
        fecha_limite = fecha_actual + timedelta(days=dias)
        
        # Construir consulta
        query = db.session.query(EventoCalendario).filter(
            EventoCalendario.fecha_inicio >= fecha_actual,
            EventoCalendario.fecha_inicio <= fecha_limite
        )
        
        # Aplicar filtro por nivel si se proporciona
        if nivel_id:
            query = query.filter(EventoCalendario.nivel_id == nivel_id)
            
        # Ejecutar consulta
        eventos = query.order_by(EventoCalendario.fecha_inicio).all()
        
        return eventos_schema.dump(eventos)
