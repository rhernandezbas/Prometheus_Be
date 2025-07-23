from app.models.niveles import Nivel, Subnivel
from app.utils.config.config import ma

class NivelSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Nivel
        load_instance = True

class SubnivelSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Subnivel
        load_instance = True
        include_fk = True

nivel_schema = NivelSchema()
niveles_schema = NivelSchema(many=True)
subnivel_schema = SubnivelSchema()
subniveles_schema = SubnivelSchema(many=True)
