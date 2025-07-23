"""
Modelo para registrar la asistencia de los alumnos.
"""
from datetime import datetime
from app.utils.config.config import db


class Asistencia(db.Model):
    """Modelo para registrar la asistencia de los alumnos."""
    
    __tablename__ = 'asistencia'
    
    id = db.Column(db.Integer, primary_key=True)
    alumno_id = db.Column(db.Integer, db.ForeignKey('alumnos.id'), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    presente = db.Column(db.Boolean, default=True)
    comentario = db.Column(db.String(255))
    instructor_id = db.Column(db.Integer, db.ForeignKey('instructor.id'))
    nivel_id = db.Column(db.Integer, db.ForeignKey('niveles.id'))
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)
    
    def __init__(self, alumno_id, fecha, presente=True, comentario=None, instructor_id=None, nivel_id=None):
        self.alumno_id = alumno_id
        self.fecha = fecha
        self.presente = presente
        self.comentario = comentario
        self.instructor_id = instructor_id
        self.nivel_id = nivel_id
        self.created_at = datetime.now()
        self.updated_at = datetime.now()