from app.models.alumnos import Alumnos
from app.utils.config.config import ma

class AlumnosSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Alumnos
        load_instance = True
        include_fk = True

alumnos_schema = AlumnosSchema()
alumnos_list_schema = AlumnosSchema(many=True)
