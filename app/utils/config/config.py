"""Módulo de configuración que maneja las variables de entorno y configuraciones del sistema."""

from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from app.utils.config.logger import get_logger
import os
from pathlib import Path
from dotenv import load_dotenv
from flask_migrate import Migrate

logger = get_logger(__name__)
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'clave_secreta_por_defecto')
    logger.info(f'Initializing config for BD')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '3306')
    DB_NAME = os.getenv('DB_NAME', 'academia')

    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_ENGINE_OPTIONS = {'pool_recycle': 280, 'pool_pre_ping': True}