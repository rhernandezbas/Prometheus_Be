"""Repositorio de niveles."""
from datetime import datetime
from typing import Dict, Any, Optional, List

from app.interfaces.niveles_interfaces import NivelInterfaces, SubnivelInterfaces
from app.models.niveles import Nivel, Subnivel
from app.utils.config.config import db
from app.schemas.niveles import nivel_schema, niveles_schema, subnivel_schema, subniveles_schema


class NivelRepository(NivelInterfaces):
    """Implementación del repositorio de niveles."""

    def create_nivel(self, nivel_data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea un nuevo nivel en el sistema."""
        # Validar y cargar datos usando el esquema
        nivel = nivel_schema.load(nivel_data)
        
        db.session.add(nivel)
        db.session.commit()
        return nivel_schema.dump(nivel)

    def get_nivel_by_id(self, nivel_id: int) -> Optional[Dict[str, Any]]:
        """Obtiene un nivel por su ID."""
        nivel = db.session.query(Nivel).filter_by(id=nivel_id).first()
        if nivel:
            return nivel_schema.dump(nivel)
        return None

    def get_nivel_by_nombre(self, nombre: str) -> Optional[Dict[str, Any]]:
        """Obtiene un nivel por su nombre."""
        nivel = db.session.query(Nivel).filter_by(nombre=nombre).first()
        if nivel:
            return nivel_schema.dump(nivel)
        return None

    def update_nivel(self, nivel_id: int, nivel_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Actualiza los datos de un nivel."""
        nivel = db.session.query(Nivel).filter_by(id=nivel_id).first()
        if not nivel:
            return None

        # Añadir timestamp de actualización
        nivel_data['updated_at'] = datetime.now()
        
        # Actualizar solo los campos proporcionados
        for key, value in nivel_data.items():
            if hasattr(nivel, key):
                setattr(nivel, key, value)
        
        db.session.commit()
        return nivel_schema.dump(nivel)

    def delete_nivel(self, nivel_id: int) -> bool:
        """Elimina un nivel del sistema."""
        nivel = db.session.query(Nivel).filter_by(id=nivel_id).first()
        if not nivel:
            return False

        db.session.delete(nivel)
        db.session.commit()
        return True

    def search_all(self, filters: Optional[Dict[str, Any]] = None, 
                  page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """Busca niveles con filtros opcionales y paginación."""
        query = db.session.query(Nivel)
        
        if filters:
            for key, value in filters.items():
                if hasattr(Nivel, key):
                    if isinstance(value, str):
                        query = query.filter(getattr(Nivel, key).like(f"%{value}%"))
                    else:
                        query = query.filter(getattr(Nivel, key) == value)
        
        total = query.count()
        items = query.limit(per_page).offset((page - 1) * per_page).all()
        
        return {
            'items': niveles_schema.dump(items),
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        }

    def get_subniveles_by_nivel_id(self, nivel_id: int) -> List[Dict[str, Any]]:
        """Obtiene todos los subniveles de un nivel específico."""
        subniveles = db.session.query(Subnivel).filter_by(nivel_id=nivel_id).all()
        return subniveles_schema.dump(subniveles)


class SubnivelRepository(SubnivelInterfaces):
    """Implementación del repositorio de subniveles."""

    def create_subnivel(self, subnivel_data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea un nuevo subnivel en el sistema."""
        # Validar y cargar datos usando el esquema
        subnivel = subnivel_schema.load(subnivel_data)
        
        db.session.add(subnivel)
        db.session.commit()
        return subnivel_schema.dump(subnivel)

    def get_subnivel_by_id(self, subnivel_id: int) -> Optional[Dict[str, Any]]:
        """Obtiene un subnivel por su ID."""
        subnivel = db.session.query(Subnivel).filter_by(id=subnivel_id).first()
        if subnivel:
            return subnivel_schema.dump(subnivel)
        return None

    def get_subnivel_by_numero_and_nivel_id(self, numero: int, nivel_id: int) -> Optional[Dict[str, Any]]:
        """Obtiene un subnivel por su número y el ID del nivel."""
        subnivel = db.session.query(Subnivel).filter_by(
            numero=numero, 
            nivel_id=nivel_id
        ).first()
        if subnivel:
            return subnivel_schema.dump(subnivel)
        return None

    def update_subnivel(self, subnivel_id: int, subnivel_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Actualiza los datos de un subnivel."""
        subnivel = db.session.query(Subnivel).filter_by(id=subnivel_id).first()
        if not subnivel:
            return None

        # Añadir timestamp de actualización
        subnivel_data['updated_at'] = datetime.now()
        
        # Actualizar solo los campos proporcionados
        for key, value in subnivel_data.items():
            if hasattr(subnivel, key):
                setattr(subnivel, key, value)
        
        db.session.commit()
        return subnivel_schema.dump(subnivel)

    def delete_subnivel(self, subnivel_id: int) -> bool:
        """Elimina un subnivel del sistema."""
        subnivel = db.session.query(Subnivel).filter_by(id=subnivel_id).first()
        if not subnivel:
            return False

        db.session.delete(subnivel)
        db.session.commit()
        return True

    def search_all(self, filters: Optional[Dict[str, Any]] = None, 
                  page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """Busca subniveles con filtros opcionales y paginación."""
        query = db.session.query(Subnivel)
        
        if filters:
            for key, value in filters.items():
                if hasattr(Subnivel, key):
                    if isinstance(value, str):
                        query = query.filter(getattr(Subnivel, key).like(f"%{value}%"))
                    else:
                        query = query.filter(getattr(Subnivel, key) == value)
        
        total = query.count()
        items = query.limit(per_page).offset((page - 1) * per_page).all()
        
        return {
            'items': subniveles_schema.dump(items),
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        }
