"""Alumnos model."""

from app.utils.config.config import db

class Alumnos(db.Model):
    __tablename__ = 'alumnos'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    mail = db.Column(db.String(100), )
    telephone = db.Column(db.String(100), )
    address = db.Column(db.String(100), )
    dateOfBirth = db.Column(db.String(100), )
    dni = db.Column(db.String(100), nullable=False)
    age = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100))
    updated_at = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.String(100), nullable=False)
    nivel = db.Column(db.String(100), nullable=False)
    subnivel_id = db.Column(db.Integer, db.ForeignKey('subniveles.id'))
    dateOfEntry = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(100), nullable=False)
    comments = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(100), nullable=False)
    pago = db.Column(db.String(100), nullable=False)

    def __init__(self, name, lastname, mail, telephone, address, dateOfBirth, dni, password, nivel, 
                 updated_at=None, created_at=None, status='activo', pago='pendiente', 
                 dateOfEntry=None, comments=None, age=None, gender=None, subnivel_id=None):
        self.name = name
        self.lastname = lastname
        self.mail = mail
        self.telephone = telephone
        self.dateOfEntry = dateOfEntry
        self.address = address
        self.dateOfBirth = dateOfBirth
        self.dni = dni
        self.nivel = nivel
        self.subnivel_id = subnivel_id
        self.password = password
        self.updated_at = updated_at
        self.created_at = created_at
        self.status = status
        self.pago = pago
        self.comments = comments
        self.age = age
        self.gender = gender