"""Schemas para validación de evaluaciones y calificaciones."""

from app.models.evaluaciones import Evaluacion, Calificacion
from app.utils.config.config import ma


class EvaluacionSchema(ma.SQLAlchemyAutoSchema):
    """Schema para el modelo de evaluación."""

    class Meta:
        """Metaclase para la evaluación."""
        model = Evaluacion
        load_instance = True
        include_fk = True


class CalificacionSchema(ma.SQLAlchemyAutoSchema):
    """Schema para el modelo de calificación."""

    class Meta:
        """Metaclase para la calificación."""
        model = Calificacion
        load_instance = True
        include_fk = True


evaluacion_schema = EvaluacionSchema()
evaluaciones_schema = EvaluacionSchema(many=True)
calificacion_schema = CalificacionSchema()
calificaciones_schema = CalificacionSchema(many=True)
