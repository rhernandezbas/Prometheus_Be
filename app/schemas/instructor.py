from app.models.instructor import Instructor
from app.utils.config.config import ma

class InstructorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Instructor
        load_instance = True
        include_fk = True

instructor_schema = InstructorSchema()
instructores_schema = InstructorSchema(many=True)
