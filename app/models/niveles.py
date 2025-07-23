"""Niveles model."""

"""Niveles model."""

from app.utils.config.config import db
from datetime import datetime

class Nivel(db.Model):
    __tablename__ = 'niveles'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False, unique=True)
    descripcion = db.Column(db.Text)

    def __init__(self, nombre, descripcion=None):
        self.nombre = nombre
        self.descripcion = descripcion
        self.updated_at = datetime.utcnow()
        self.created_at = datetime.utcnow()


class Subnivel(db.Model):
    __tablename__ = 'subniveles'

    id = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.Integer, nullable=False)
    descripcion = db.Column(db.Text)
    nivel_id = db.Column(db.Integer, db.ForeignKey('niveles.id'), nullable=False)

    def __init__(self, numero, nivel_id, descripcion=None):
        self.numero = numero
        self.nivel_id = nivel_id
        self.descripcion = descripcion
        self.updated_at = datetime.utcnow()
        self.created_at = datetime.utcnow()
