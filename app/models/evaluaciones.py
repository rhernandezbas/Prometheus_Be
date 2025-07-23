"""
Modelo para evaluaciones académicas y calificaciones.
"""
from datetime import datetime
from app.utils.config.config import db


class Evaluacion(db.Model):
    """Modelo para registrar evaluaciones académicas."""
    
    __tablename__ = 'evaluaciones'
    
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    fecha = db.Column(db.Date, nullable=False)
    nivel_id = db.Column(db.Integer, db.ForeignKey('niveles.id'), nullable=False)
    subnivel_id = db.Column(db.Integer, db.ForeignKey('subniveles.id'))
    instructor_id = db.Column(db.Integer, db.ForeignKey('instructor.id'))
    puntaje_maximo = db.Column(db.Float, default=100.0)
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)
    
    def __init__(self, titulo, descripcion, fecha, nivel_id, subnivel_id=None,
                 instructor_id=None, puntaje_maximo=100.0):
        self.titulo = titulo
        self.descripcion = descripcion
        self.fecha = fecha
        self.nivel_id = nivel_id
        self.subnivel_id = subnivel_id
        self.instructor_id = instructor_id
        self.puntaje_maximo = puntaje_maximo
        self.created_at = datetime.now()
        self.updated_at = datetime.now()


class Calificacion(db.Model):
    """Modelo para registrar calificaciones de alumnos."""
    
    __tablename__ = 'calificaciones'
    
    id = db.Column(db.Integer, primary_key=True)
    evaluacion_id = db.Column(db.Integer, db.ForeignKey('evaluaciones.id'), nullable=False)
    alumno_id = db.Column(db.Integer, db.ForeignKey('alumnos.id'), nullable=False)
    puntaje = db.Column(db.Float, nullable=False)
    comentario = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)
    
    def __init__(self, evaluacion_id, alumno_id, puntaje, comentario=None):
        self.evaluacion_id = evaluacion_id
        self.alumno_id = alumno_id
        self.puntaje = puntaje
        self.comentario = comentario
        self.created_at = datetime.now()
        self.updated_at = datetime.now()