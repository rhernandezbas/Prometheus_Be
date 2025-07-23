""""""

from flask import Flask
from app.ping import ping
from app.routes import asistencia as asistencia_bp
from app.routes import calendario as calendario_bp
from app.routes import evaluacion as evaluacion_bp
from app.routes import users as users_bp
from app.routes import auth as auth_bp
from app.routes import alumnos as alumnos_bp
from app.routes import finanzas as finanzas_bp
from app.utils.auth.jwt_config import init_jwt
from app.utils.config.config import db, migrate, Config

# Importación explícita de modelos para asegurar que SQLAlchemy los registre
import app.models.alumnos
import app.models.users
import app.models.finanzas
import app.models.instructor
import app.models.niveles
import app.models.asistencia
import app.models.evaluaciones
import app.models.calendar

ACTIVE_ENDPOINTS = [
    ("/", ping),
    ("/asistencia", asistencia_bp),
    ("/calendar", calendario_bp),
    ("/evaluacion", evaluacion_bp),
    ("/users", users_bp),
    ("/auth", auth_bp),
    ("/estudiantes", alumnos_bp),
    ("/finanzas", finanzas_bp),
]


def create_app():
    """Create Flask app."""
    app = Flask(__name__)

    # load secrets from environment variables
    #app.config.update(load_secrets())

    # initialize config manager
    #app.config_manager = ConfigurationManager()

    app.config.from_object(Config)  # Load config from a file
    db.init_app(app)
    migrate.init_app(app, db)

    init_jwt(app)

    # accepts both /endpoint and /endpoint/ as valid URLs
    app.url_map.strict_slashes = False


    # register each active blueprint
    for url, blueprint in ACTIVE_ENDPOINTS:
        app.register_blueprint(blueprint, url_prefix=url)

    return app