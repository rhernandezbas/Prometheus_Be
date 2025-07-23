"""Modelo para usuarios del sistema."""

from app.utils.config.config import db

class User(db.Model):
    """Modelo de usuario con autenticación."""
    
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    fullname = db.Column(db.String(150), nullable=True)
    created_at = db.Column(db.String(50))
    updated_at = db.Column(db.String(50))
    privileges = db.Column(db.String(50))

    def __repr__(self):
        return '<User %r>' % self.username