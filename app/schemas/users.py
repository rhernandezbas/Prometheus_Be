"""users schemas."""

from app.models.users import User
from app.utils.config.config import ma


class ProactiveSchema(ma.SQLAlchemyAutoSchema):
    """Schema for the user model."""

    class Meta:
        """Metaclass for the user."""
        load_instance = True
        model = User
        include_fk = True

user_schema = ProactiveSchema()
users_schema = ProactiveSchema(many=True)