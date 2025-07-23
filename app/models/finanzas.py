""""""

from app.utils.config.config import db

class gastos(db.Model):
    """"""
    __tablename__ = 'gastos'
    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.String(255), nullable=False)
    concepto = db.Column(db.String(255), nullable=False)
    monto = db.Column(db.Float, nullable=False)
    tipo = db.Column(db.String(255), nullable=False)
    detalle = db.Column(db.String(255), nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey('instructor.id'))

    def __init__(self, fecha, concepto, monto, tipo, detalle):
        self.fecha = fecha
        self.concepto = concepto
        self.monto = monto
        self.tipo = tipo
        self.detalle = detalle


class ingresos(db.Model):
    """"""
    __tablename__ = 'ingresos'
    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.String(255), nullable=False)
    concepto = db.Column(db.String(255), nullable=False)
    monto = db.Column(db.Float, nullable=False)
    tipo = db.Column(db.String(255), nullable=False)
    detalle = db.Column(db.String(255), nullable=False)
    alumno_id = db.Column(db.Integer, db.ForeignKey('alumnos.id'))

    def __init__(self, fecha, concepto, monto, tipo, detalle):
        self.fecha = fecha
        self.concepto = concepto
        self.monto = monto
        self.tipo = tipo
        self.detalle = detalle



