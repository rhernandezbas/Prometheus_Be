"""Repositorio de usuarios."""
from datetime import datetime
from typing import Dict, Any, Optional

from app.interfaces.users_interfaces import UsersInterfaces
from app.models.users import User
from app.utils.config.config import db
from app.schemas.users import user_schema, users_schema
from app.utils.config.logger import get_logger

# Inicializar el logger para este módulo
logger = get_logger(__name__)

class UsersRepository(UsersInterfaces):
    """Implementación del repositorio de usuarios."""

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea un nuevo usuario en el sistema."""
        # Formato de fecha y hora como string
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        # Añadir campos de tiempo que no vendrán en los datos de entrada
        user_data['created_at'] = current_time
        user_data['updated_at'] = current_time
        
        logger.info(f"[create_user]: Creando usuario: {user_data.get('username')}")
        

        user = user_schema.load(user_data)
        try:
            db.session.add(user)
            db.session.commit()
            logger.info(f"[create_user]: Usuario creado con ID: {user.id}")
        except Exception as e:
            logger.error(f"[create_user]: Error al crear el usuario: {str(e)}")
            return {}

        return user_schema.dump(user)

    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Obtiene un usuario por su ID."""
        logger.info(f"[get_user_by_id]: Buscando usuario con ID: {user_id}")
        user = db.session.query(User).filter_by(id=user_id).first()
        if user:
            return user_schema.dump(user)
        logger.info(f"[get_user_by_id]: Usuario con ID {user_id} no encontrado")
        return None

    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Obtiene un usuario por su nombre de usuario."""
        logger.info(f"[get_user_by_username]: Buscando usuario con username: {username}")
        user = db.session.query(User).filter_by(username=username).first()
        if user:
            return user_schema.dump(user)
        logger.info(f"[get_user_by_username]: Usuario con username {username} no encontrado")
        return None

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Obtiene un usuario por su correo electrónico."""
        logger.info(f"[get_user_by_email]: Buscando usuario con email: {email}")
        user = db.session.query(User).filter_by(email=email).first()
        if user:
            return user_schema.dump(user)
        logger.info(f"[get_user_by_email]: Usuario con email {email} no encontrado")
        return None

    def update_user(self, user_id: int, user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Actualiza los datos de un usuario."""
        logger.info(f"[update_user]: Actualizando usuario con ID: {user_id}")
        user = db.session.query(User).filter_by(id=user_id).first()
        if not user:
            logger.info(f"[update_user]: Usuario con ID {user_id} no encontrado para actualizar")
            return None
        
        # Añadir el campo updated_at a los datos de actualización
        user_data['updated_at'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Actualizar solo los campos proporcionados
        for key, value in user_data.items():
            if hasattr(user, key):
                setattr(user, key, value)
        
        db.session.commit()
        logger.info(f"[update_user]: Usuario con ID {user_id} actualizado correctamente")
        return user_schema.dump(user)

    def delete_user(self, user_id: int) -> bool:
        """Elimina un usuario del sistema."""
        logger.info(f"[delete_user]: Eliminando usuario con ID: {user_id}")
        user = db.session.query(User).filter_by(id=user_id).first()
        if not user:
            logger.info(f"[delete_user]: Usuario con ID {user_id} no encontrado para eliminar")
            return False

        db.session.delete(user)
        db.session.commit()
        logger.info(f"[delete_user]: Usuario con ID {user_id} eliminado correctamente")
        return True

    def search_all(self, filters: Optional[Dict[str, Any]] = None, 
                  page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """Busca usuarios con filtros opcionales y paginación."""
        logger.info(f"[search_all]: Buscando usuarios con filtros: {filters}, página: {page}, por página: {per_page}")
        query = db.session.query(User)
        
        if filters:
            if 'username' in filters:
                query = query.filter(User.username.like(f"%{filters['username']}%"))
            if 'email' in filters:
                query = query.filter(User.email.like(f"%{filters['email']}%"))
            if 'privileges' in filters:
                query = query.filter(User.privileges == filters['privileges'])
        
        total = query.count()
        users = query.limit(per_page).offset((page - 1) * per_page).all()
        
        logger.info(f"[search_all]: Búsqueda completada. Total de resultados: {total}")
        return {
            'items': users_schema.dump(users),
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        }

    def change_password(self, user_id: int, new_password: str) -> bool:
        """Cambia la contraseña de un usuario."""
        logger.info(f"[change_password]: Cambiando contraseña para usuario con ID: {user_id}")
        user = db.session.query(User).filter_by(id=user_id).first()
        if not user:
            logger.info(f"[change_password]: Usuario con ID {user_id} no encontrado para cambio de contraseña")
            return False

        user.password = new_password
        user.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        db.session.commit()
        logger.info(f"[change_password]: Contraseña cambiada correctamente para usuario con ID: {user_id}")
        return True
