"""Schemas para validación de registros de asistencia."""

from app.models.asistencia import Asistencia
from app.utils.config.config import ma


class AsistenciaSchema(ma.SQLAlchemyAutoSchema):
    """Schema para el modelo de asistencia."""

    class Meta:
        """Metaclase para la asistencia."""
        model = Asistencia
        load_instance = True
        include_fk = True


asistencia_schema = AsistenciaSchema()
asistencias_schema = AsistenciaSchema(many=True)
