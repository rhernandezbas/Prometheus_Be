from app.models.finanzas import gastos, ingresos
from app.utils.config.config import ma

class GastosSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = gastos
        load_instance = True
        include_fk = True

class IngresosSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ingresos
        load_instance = True
        include_fk = True

gastos_schema = GastosSchema()
gastos_list_schema = GastosSchema(many=True)
ingresos_schema = IngresosSchema()
ingresos_list_schema = IngresosSchema(many=True)
