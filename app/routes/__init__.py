"""
Módulo de rutas que define los endpoints de la API.
Las rutas manejan las peticiones HTTP y utilizan los servicios para procesar las solicitudes.
Este archivo exporta los blueprints para que puedan ser importados fácilmente.
"""

from app.routes.asistencia_routes import asistencia_bp
from app.routes.calendario_routes import calendario_bp
from app.routes.evaluacion_routes import evaluacion_bp
from app.routes.auth_routes import auth_bp
from app.routes.users_routes import users_bp
from app.routes.alumnos_routes import alumnos_bp
from app.routes.finanzas_routes import finanzas_bp

# Exportamos los blueprints con nombres más concisos
asistencia = asistencia_bp
calendario = calendario_bp
evaluacion = evaluacion_bp
auth = auth_bp
users = users_bp
alumnos = alumnos_bp
finanzas = finanzas_bp
