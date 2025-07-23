"""Repositorio de instructores."""
from typing import Dict, Any, Optional, List

from app.interfaces.instructor_interfaces import InstructorInterfaces
from app.models.instructor import Instructor
from app.utils.config.config import db
from app.schemas.instructor import instructor_schema, instructores_schema


class InstructorRepository(InstructorInterfaces):
    """Implementación del repositorio de instructores."""

    def create_instructor(self, instructor_data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea un nuevo instructor en el sistema."""
        # Validar y cargar datos usando el esquema
        instructor = instructor_schema.load(instructor_data)
        
        db.session.add(instructor)
        db.session.commit()
        return instructor_schema.dump(instructor)

    def get_instructor_by_id(self, instructor_id: int) -> Optional[Dict[str, Any]]:
        """Obtiene un instructor por su ID."""
        instructor = db.session.query(Instructor).filter_by(id=instructor_id).first()
        if instructor:
            return instructor_schema.dump(instructor)
        return None

    def get_instructor_by_user_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Obtiene un instructor por su ID de usuario."""
        instructor = db.session.query(Instructor).filter_by(user_id=user_id).first()
        if instructor:
            return instructor_schema.dump(instructor)
        return None

    def get_instructor_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Obtiene un instructor por su correo electrónico."""
        instructor = db.session.query(Instructor).filter_by(mail=email).first()
        if instructor:
            return instructor_schema.dump(instructor)
        return None

    def update_instructor(self, instructor_id: int, instructor_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Actualiza los datos de un instructor."""
        instructor = db.session.query(Instructor).filter_by(id=instructor_id).first()
        if not instructor:
            return None

        # Actualizar solo los campos proporcionados
        for key, value in instructor_data.items():
            if hasattr(instructor, key):
                setattr(instructor, key, value)
        
        db.session.commit()
        return instructor_schema.dump(instructor)

    def delete_instructor(self, instructor_id: int) -> bool:
        """Elimina un instructor del sistema."""
        instructor = db.session.query(Instructor).filter_by(id=instructor_id).first()
        if not instructor:
            return False

        db.session.delete(instructor)
        db.session.commit()
        return True

    def search_all(self, filters: Optional[Dict[str, Any]] = None, 
                  page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """Busca instructores con filtros opcionales y paginación."""
        query = db.session.query(Instructor)
        
        if filters:
            for key, value in filters.items():
                if hasattr(Instructor, key):
                    if isinstance(value, str):
                        query = query.filter(getattr(Instructor, key).like(f"%{value}%"))
                    else:
                        query = query.filter(getattr(Instructor, key) == value)
        
        total = query.count()
        instructores = query.limit(per_page).offset((page - 1) * per_page).all()
        
        return {
            'items': instructores_schema.dump(instructores),
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        }
