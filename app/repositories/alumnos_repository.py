"""Repositorio de alumnos."""
from datetime import datetime
from typing import Dict, Any, Optional, List

from app.interfaces.alumnos_interfaces import AlumnosInterfaces
from app.models.alumnos import Alumnos
from app.utils.config.config import db
from app.schemas.alumnos import alumnos_schema, alumnos_list_schema


class AlumnosRepository(AlumnosInterfaces):
    """Implementación del repositorio de alumnos."""

    def create_alumno(self, alumno_data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea un nuevo alumno en el sistema."""
        
        # Validar y cargar datos usando el esquema
        alumno = alumnos_schema.load(alumno_data)
        
        db.session.add(alumno)
        db.session.commit()
        return alumnos_schema.dump(alumno)

    def get_alumno_by_id(self, alumno_id: int) -> Optional[Dict[str, Any]]:
        """Obtiene un alumno por su ID."""
        alumno = db.session.query(Alumnos).filter_by(id=alumno_id).first()
        if alumno:
            return alumnos_schema.dump(alumno)
        return None

    def get_alumno_by_dni(self, dni: str) -> Optional[Dict[str, Any]]:
        """Obtiene un alumno por su DNI."""
        alumno = db.session.query(Alumnos).filter_by(dni=dni).first()
        if alumno:
            return alumnos_schema.dump(alumno)
        return None

    def get_alumno_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Obtiene un alumno por su correo electrónico."""
        alumno = db.session.query(Alumnos).filter_by(mail=email).first()
        if alumno:
            return alumnos_schema.dump(alumno)
        return None

    def update_alumno(self, alumno_id: int, alumno_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Actualiza los datos de un alumno."""
        alumno = db.session.query(Alumnos).filter_by(id=alumno_id).first()
        if not alumno:
            return None
        
        # Actualizar solo los campos proporcionados
        for key, value in alumno_data.items():
            if hasattr(alumno, key):
                setattr(alumno, key, value)
        
        db.session.commit()
        return alumnos_schema.dump(alumno)

    def delete_alumno(self, alumno_id: int) -> bool:
        """Elimina un alumno del sistema."""
        alumno = db.session.query(Alumnos).filter_by(id=alumno_id).first()
        if not alumno:
            return False

        db.session.delete(alumno)
        db.session.commit()
        return True

    def search_all(self, filters: Optional[Dict[str, Any]] = None, 
                  page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """Busca alumnos con filtros opcionales y paginación."""
        query = db.session.query(Alumnos)
        
        if filters:
            for key, value in filters.items():
                if hasattr(Alumnos, key):
                    if isinstance(value, str):
                        query = query.filter(getattr(Alumnos, key).like(f"%{value}%"))
                    else:
                        query = query.filter(getattr(Alumnos, key) == value)
        
        total = query.count()
        alumnos = query.limit(per_page).offset((page - 1) * per_page).all()
        
        return {
            'items': alumnos_list_schema.dump(alumnos),
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        }

    def change_password(self, alumno_id: int, new_password: str) -> bool:
        """Cambia la contraseña de un alumno."""
        alumno = db.session.query(Alumnos).filter_by(id=alumno_id).first()
        if not alumno:
            return False

        alumno.password = new_password
        alumno.updated_at = datetime.now()
        db.session.commit()
        return True

    def get_alumnos_by_nivel(self, nivel: str) -> List[Dict[str, Any]]:
        """Obtiene todos los alumnos de un nivel específico."""
        alumnos = db.session.query(Alumnos).filter_by(nivel=nivel).all()
        return alumnos_list_schema.dump(alumnos)

    def update_alumno_status(self, alumno_id: int, status: str) -> bool:
        """Actualiza el estado de un alumno."""
        alumno = db.session.query(Alumnos).filter_by(id=alumno_id).first()
        if not alumno:
            return False

        alumno.status = status
        alumno.updated_at = datetime.now()
        db.session.commit()
        return True

    def update_alumno_pago(self, alumno_id: int, pago: str) -> bool:
        """Actualiza el estado de pago de un alumno."""
        alumno = db.session.query(Alumnos).filter_by(id=alumno_id).first()
        if not alumno:
            return False

        alumno.pago = pago
        alumno.updated_at = datetime.now()
        db.session.commit()
        return True
