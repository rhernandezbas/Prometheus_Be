"""
Modelo para eventos del calendario académico.
"""
from datetime import datetime
from app.utils.config.config import db

class EventoCalendario(db.Model):
    """Modelo para eventos del calendario académico."""

    __tablename__ = 'calendario_eventos'

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    fecha_inicio = db.Column(db.DateTime, nullable=False)
    fecha_fin = db.Column(db.DateTime, nullable=False)
    todo_el_dia = db.Column(db.Boolean, default=False)
    tipo = db.Column(db.String(50), nullable=False)  # clase, examen, evento, feriado, etc.
    nivel_id = db.Column(db.Integer, db.ForeignKey('niveles.id'))
    instructor_id = db.Column(db.Integer, db.ForeignKey('instructor.id'))
    color = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, titulo, descripcion, fecha_inicio, fecha_fin, todo_el_dia=False, 
                 tipo='evento', nivel_id=None, instructor_id=None, color=None):
        self.titulo = titulo
        self.descripcion = descripcion
        self.fecha_inicio = fecha_inicio
        self.fecha_fin = fecha_fin
        self.todo_el_dia = todo_el_dia
        self.tipo = tipo
        self.nivel_id = nivel_id
        self.instructor_id = instructor_id
        self.color = color
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
