"""Schemas para validación de eventos del calendario."""

from app.models.calendar import EventoCalendario
from app.utils.config.config import ma


class EventoCalendarioSchema(ma.SQLAlchemyAutoSchema):
    """Schema para el modelo de eventos del calendario."""

    class Meta:
        """Metaclase para el evento de calendario."""
        model = EventoCalendario
        load_instance = True
        include_fk = True


evento_schema = EventoCalendarioSchema()
eventos_schema = EventoCalendarioSchema(many=True)
