"""Modelo para instructores académicos."""

from app.utils.config.config import db
from datetime import datetime


class Instructor(db.Model):
    """Modelo de instructor académico."""
    
    __tablename__ = 'instructor'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    mail = db.Column(db.String(100))
    telephone = db.Column(db.String(100))
    address = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Lo hacemos nullable temporalmente
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    # Definimos la relación desde el lado Instructor
    # Esta definición creará automáticamente el atributo 'instructor' en el modelo User
    user = db.relationship('User', backref=db.backref('instructor', uselist=False, lazy='joined'))

    def __init__(self, name, lastname, mail=None, telephone=None, address=None, user_id=None):
        """Inicialización del modelo Instructor."""
        self.name = name
        self.lastname = lastname
        self.mail = mail
        self.telephone = telephone
        self.address = address
        self.user_id = user_id
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        
    def __repr__(self):
        """Representación del instructor."""
        return f'<Instructor {self.name} {self.lastname}>'