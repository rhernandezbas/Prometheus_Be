"""Repositorio de finanzas."""
from typing import Dict, Any, Optional, List

from app.interfaces.finanzas_interfaces import GastosInterfaces, IngresosInterfaces
from app.models.finanzas import gastos, ingresos
from app.utils.config.config import db
from app.schemas.finanzas import gastos_schema, gastos_list_schema, ingresos_schema, ingresos_list_schema


class GastosRepository(GastosInterfaces):
    """Implementación del repositorio de gastos."""

    def create_gasto(self, gasto_data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea un nuevo registro de gasto en el sistema."""
        # Validar y cargar datos usando el esquema
        gasto = gastos_schema.load(gasto_data)
        
        db.session.add(gasto)
        db.session.commit()
        return gastos_schema.dump(gasto)

    def get_gasto_by_id(self, gasto_id: int) -> Optional[Dict[str, Any]]:
        """Obtiene un gasto por su ID."""
        gasto = db.session.query(gastos).filter_by(id=gasto_id).first()
        if gasto:
            return gastos_schema.dump(gasto)
        return None

    def get_gastos_by_instructor_id(self, instructor_id: int) -> List[Dict[str, Any]]:
        """Obtiene todos los gastos asociados a un instructor."""
        gastos_list = db.session.query(gastos).filter_by(instructor_id=instructor_id).all()
        return gastos_list_schema.dump(gastos_list)

    def update_gasto(self, gasto_id: int, gasto_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Actualiza los datos de un gasto."""
        gasto = db.session.query(gastos).filter_by(id=gasto_id).first()
        if not gasto:
            return None

        # Actualizar solo los campos proporcionados
        for key, value in gasto_data.items():
            if hasattr(gasto, key):
                setattr(gasto, key, value)
        
        db.session.commit()
        return gastos_schema.dump(gasto)

    def delete_gasto(self, gasto_id: int) -> bool:
        """Elimina un gasto del sistema."""
        gasto = db.session.query(gastos).filter_by(id=gasto_id).first()
        if not gasto:
            return False

        db.session.delete(gasto)
        db.session.commit()
        return True

    def search_all(self, filters: Optional[Dict[str, Any]] = None, 
                  page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """Busca gastos con filtros opcionales y paginación."""
        query = db.session.query(gastos)
        
        if filters:
            for key, value in filters.items():
                if hasattr(gastos, key):
                    if key == 'fecha' and isinstance(value, dict):
                        if 'desde' in value:
                            query = query.filter(gastos.fecha >= value['desde'])
                        if 'hasta' in value:
                            query = query.filter(gastos.fecha <= value['hasta'])
                    elif isinstance(value, str):
                        query = query.filter(getattr(gastos, key).like(f"%{value}%"))
                    else:
                        query = query.filter(getattr(gastos, key) == value)
        
        total = query.count()
        items = query.limit(per_page).offset((page - 1) * per_page).all()
        
        return {
            'items': gastos_list_schema.dump(items),
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        }

    def get_gastos_by_fecha(self, fecha_inicio: str, fecha_fin: str) -> List[Dict[str, Any]]:
        """Obtiene gastos dentro de un rango de fechas."""
        gastos_list = db.session.query(gastos).filter(
            gastos.fecha >= fecha_inicio,
            gastos.fecha <= fecha_fin
        ).all()
        return gastos_list_schema.dump(gastos_list)

    def get_gastos_by_tipo(self, tipo: str) -> List[Dict[str, Any]]:
        """Obtiene gastos por tipo."""
        gastos_list = db.session.query(gastos).filter_by(tipo=tipo).all()
        return gastos_list_schema.dump(gastos_list)


class IngresosRepository(IngresosInterfaces):
    """Implementación del repositorio de ingresos."""

    def create_ingreso(self, ingreso_data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea un nuevo registro de ingreso en el sistema."""
        # Validar y cargar datos usando el esquema
        ingreso = ingresos_schema.load(ingreso_data)
        
        db.session.add(ingreso)
        db.session.commit()
        return ingresos_schema.dump(ingreso)

    def get_ingreso_by_id(self, ingreso_id: int) -> Optional[Dict[str, Any]]:
        """Obtiene un ingreso por su ID."""
        ingreso = db.session.query(ingresos).filter_by(id=ingreso_id).first()
        if ingreso:
            return ingresos_schema.dump(ingreso)
        return None

    def get_ingresos_by_alumno_id(self, alumno_id: int) -> List[Dict[str, Any]]:
        """Obtiene todos los ingresos asociados a un alumno."""
        ingresos_list = db.session.query(ingresos).filter_by(alumno_id=alumno_id).all()
        return ingresos_list_schema.dump(ingresos_list)

    def update_ingreso(self, ingreso_id: int, ingreso_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Actualiza los datos de un ingreso."""
        ingreso = db.session.query(ingresos).filter_by(id=ingreso_id).first()
        if not ingreso:
            return None

        # Actualizar solo los campos proporcionados
        for key, value in ingreso_data.items():
            if hasattr(ingreso, key):
                setattr(ingreso, key, value)
        
        db.session.commit()
        return ingresos_schema.dump(ingreso)

    def delete_ingreso(self, ingreso_id: int) -> bool:
        """Elimina un ingreso del sistema."""
        ingreso = db.session.query(ingresos).filter_by(id=ingreso_id).first()
        if not ingreso:
            return False

        db.session.delete(ingreso)
        db.session.commit()
        return True

    def search_all(self, filters: Optional[Dict[str, Any]] = None, 
                  page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """Busca ingresos con filtros opcionales y paginación."""
        query = db.session.query(ingresos)
        
        if filters:
            for key, value in filters.items():
                if hasattr(ingresos, key):
                    if key == 'fecha' and isinstance(value, dict):
                        if 'desde' in value:
                            query = query.filter(ingresos.fecha >= value['desde'])
                        if 'hasta' in value:
                            query = query.filter(ingresos.fecha <= value['hasta'])
                    elif isinstance(value, str):
                        query = query.filter(getattr(ingresos, key).like(f"%{value}%"))
                    else:
                        query = query.filter(getattr(ingresos, key) == value)
        
        total = query.count()
        items = query.limit(per_page).offset((page - 1) * per_page).all()
        
        return {
            'items': ingresos_list_schema.dump(items),
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        }

    def get_ingresos_by_fecha(self, fecha_inicio: str, fecha_fin: str) -> List[Dict[str, Any]]:
        """Obtiene ingresos dentro de un rango de fechas."""
        ingresos_list = db.session.query(ingresos).filter(
            ingresos.fecha >= fecha_inicio,
            ingresos.fecha <= fecha_fin
        ).all()
        return ingresos_list_schema.dump(ingresos_list)

    def get_ingresos_by_tipo(self, tipo: str) -> List[Dict[str, Any]]:
        """Obtiene ingresos por tipo."""
        ingresos_list = db.session.query(ingresos).filter_by(tipo=tipo).all()
        return ingresos_list_schema.dump(ingresos_list)
