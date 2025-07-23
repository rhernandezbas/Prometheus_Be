"""
DBManager: Clase utilitaria para operaciones CRUD simples con SQLAlchemy.
"""
from app.utils.config.config import db

class DBManager:
    def __init__(self, model):
        self.model = model

    def create(self, **kwargs):
        instance = self.model(**kwargs)
        db.session.add(instance)
        db.session.commit()
        return instance

    def get_by_id(self, idd: int):
        return self.model.query.get(idd)

    def get_all(self):
        return self.model.query.all()

    def update(self, idd, **kwargs):
        instance = self.get_by_id(idd)
        if not instance:
            return None
        for key, value in kwargs.items():
            setattr(instance, key, value)
        db.session.commit()
        return instance

    def delete(self, idd):
        instance = self.get_by_id(idd)
        if not instance:
            return False
        db.session.delete(instance)
        db.session.commit()
        return True
