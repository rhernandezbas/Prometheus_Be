"""Servicio para la gestión de finanzas."""
from typing import Dict, Any, Optional, List

from app.repositories.finanzas_repository import GastosRepository, IngresosRepository
from app.services.instructor_service import InstructorService
from app.services.alumnos_service import AlumnosService


class FinanzasService:
    """Servicio para la gestión de finanzas de la institución."""
    
    def __init__(self):
        """Inicializa el servicio con los repositorios correspondientes."""
        self.gastos_repository = GastosRepository()
        self.ingresos_repository = IngresosRepository()
        self.instructor_service = InstructorService()
        self.alumnos_service = AlumnosService()
    
    # -------------------- Servicios para Gastos --------------------
    
    def create_gasto(self, gasto_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo registro de gasto.
        
        Args:
            gasto_data: Datos del gasto a registrar
            
        Returns:
            Registro de gasto creado
        """
        # Validar que el instructor existe si se proporciona instructor_id
        if 'instructor_id' in gasto_data and gasto_data['instructor_id'] is not None:
            instructor = self.instructor_service.get_instructor_by_id(gasto_data['instructor_id'])
            if not instructor:
                raise ValueError(f"El instructor con ID {gasto_data['instructor_id']} no existe")
        
        return self.gastos_repository.create_gasto(gasto_data)
    
    def get_gasto_by_id(self, gasto_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un gasto por su ID.
        
        Args:
            gasto_id: ID del gasto a buscar
            
        Returns:
            Registro del gasto encontrado o None
        """
        return self.gastos_repository.get_gasto_by_id(gasto_id)
    
    def update_gasto(self, gasto_id: int, gasto_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza un registro de gasto.
        
        Args:
            gasto_id: ID del gasto a actualizar
            gasto_data: Datos actualizados del gasto
            
        Returns:
            Registro de gasto actualizado o None
        """
        # Validar que el instructor existe si se proporciona instructor_id
        if 'instructor_id' in gasto_data and gasto_data['instructor_id'] is not None:
            instructor = self.instructor_service.get_instructor_by_id(gasto_data['instructor_id'])
            if not instructor:
                raise ValueError(f"El instructor con ID {gasto_data['instructor_id']} no existe")
                
        return self.gastos_repository.update_gasto(gasto_id, gasto_data)
    
    def delete_gasto(self, gasto_id: int) -> bool:
        """
        Elimina un registro de gasto.
        
        Args:
            gasto_id: ID del gasto a eliminar
            
        Returns:
            True si el gasto fue eliminado, False en caso contrario
        """
        return self.gastos_repository.delete_gasto(gasto_id)
    
    def search_gastos(self, filters: Optional[Dict[str, Any]] = None, page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """
        Busca registros de gastos con filtros opcionales y paginación.
        
        Args:
            filters: Filtros para la búsqueda
            page: Número de página
            per_page: Elementos por página
            
        Returns:
            Diccionario con gastos y metadatos de paginación
        """
        return self.gastos_repository.search_all(filters, page, per_page)
    
    def get_gastos_by_instructor_id(self, instructor_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todos los gastos asociados a un instructor.
        
        Args:
            instructor_id: ID del instructor
            
        Returns:
            Lista de gastos del instructor
        """
        return self.gastos_repository.get_gastos_by_instructor_id(instructor_id)
    
    def get_gastos_by_fecha(self, fecha_inicio: str, fecha_fin: str) -> List[Dict[str, Any]]:
        """
        Obtiene gastos dentro de un rango de fechas.
        
        Args:
            fecha_inicio: Fecha inicial
            fecha_fin: Fecha final
            
        Returns:
            Lista de gastos en el rango de fechas
        """
        return self.gastos_repository.get_gastos_by_fecha(fecha_inicio, fecha_fin)
    
    def get_gastos_by_tipo(self, tipo: str) -> List[Dict[str, Any]]:
        """
        Obtiene gastos por tipo.
        
        Args:
            tipo: Tipo de gasto
            
        Returns:
            Lista de gastos del tipo especificado
        """
        return self.gastos_repository.get_gastos_by_tipo(tipo)
    
    # -------------------- Servicios para Ingresos --------------------
    
    def create_ingreso(self, ingreso_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo registro de ingreso.
        
        Args:
            ingreso_data: Datos del ingreso a registrar
            
        Returns:
            Registro de ingreso creado
        """
        # Validar que el alumno existe si se proporciona alumno_id
        if 'alumno_id' in ingreso_data and ingreso_data['alumno_id'] is not None:
            alumno = self.alumnos_service.get_alumno_by_id(ingreso_data['alumno_id'])
            if not alumno:
                raise ValueError(f"El alumno con ID {ingreso_data['alumno_id']} no existe")
                
        return self.ingresos_repository.create_ingreso(ingreso_data)
    
    def get_ingreso_by_id(self, ingreso_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un ingreso por su ID.
        
        Args:
            ingreso_id: ID del ingreso a buscar
            
        Returns:
            Registro del ingreso encontrado o None
        """
        return self.ingresos_repository.get_ingreso_by_id(ingreso_id)
    
    def update_ingreso(self, ingreso_id: int, ingreso_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza un registro de ingreso.
        
        Args:
            ingreso_id: ID del ingreso a actualizar
            ingreso_data: Datos actualizados del ingreso
            
        Returns:
            Registro de ingreso actualizado o None
        """
        # Validar que el alumno existe si se proporciona alumno_id
        if 'alumno_id' in ingreso_data and ingreso_data['alumno_id'] is not None:
            alumno = self.alumnos_service.get_alumno_by_id(ingreso_data['alumno_id'])
            if not alumno:
                raise ValueError(f"El alumno con ID {ingreso_data['alumno_id']} no existe")
                
        return self.ingresos_repository.update_ingreso(ingreso_id, ingreso_data)
    
    def delete_ingreso(self, ingreso_id: int) -> bool:
        """
        Elimina un registro de ingreso.
        
        Args:
            ingreso_id: ID del ingreso a eliminar
            
        Returns:
            True si el ingreso fue eliminado, False en caso contrario
        """
        return self.ingresos_repository.delete_ingreso(ingreso_id)
    
    def search_ingresos(self, filters: Optional[Dict[str, Any]] = None, page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """
        Busca registros de ingresos con filtros opcionales y paginación.
        
        Args:
            filters: Filtros para la búsqueda
            page: Número de página
            per_page: Elementos por página
            
        Returns:
            Diccionario con ingresos y metadatos de paginación
        """
        return self.ingresos_repository.search_all(filters, page, per_page)
    
    def get_ingresos_by_alumno_id(self, alumno_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todos los ingresos asociados a un alumno.
        
        Args:
            alumno_id: ID del alumno
            
        Returns:
            Lista de ingresos del alumno
        """
        return self.ingresos_repository.get_ingresos_by_alumno_id(alumno_id)
    
    def get_ingresos_by_fecha(self, fecha_inicio: str, fecha_fin: str) -> List[Dict[str, Any]]:
        """
        Obtiene ingresos dentro de un rango de fechas.
        
        Args:
            fecha_inicio: Fecha inicial
            fecha_fin: Fecha final
            
        Returns:
            Lista de ingresos en el rango de fechas
        """
        return self.ingresos_repository.get_ingresos_by_fecha(fecha_inicio, fecha_fin)
    
    def get_ingresos_by_tipo(self, tipo: str) -> List[Dict[str, Any]]:
        """
        Obtiene ingresos por tipo.
        
        Args:
            tipo: Tipo de ingreso
            
        Returns:
            Lista de ingresos del tipo especificado
        """
        return self.ingresos_repository.get_ingresos_by_tipo(tipo)
    
    # -------------------- Servicios de Estadísticas Financieras --------------------
    
    def get_balance_general(self, fecha_inicio: Optional[str] = None, fecha_fin: Optional[str] = None) -> Dict[str, Any]:
        """
        Obtiene el balance general de la institución.
        
        Args:
            fecha_inicio: Fecha inicial opcional
            fecha_fin: Fecha final opcional
            
        Returns:
            Diccionario con el resumen de ingresos, gastos y balance
        """
        ingresos = []
        gastos = []
        
        # Si se proporcionan fechas, filtrar por rango
        if fecha_inicio and fecha_fin:
            ingresos = self.ingresos_repository.get_ingresos_by_fecha(fecha_inicio, fecha_fin)
            gastos = self.gastos_repository.get_gastos_by_fecha(fecha_inicio, fecha_fin)
        else:
            # Obtener todos los registros
            ingresos_result = self.ingresos_repository.search_all(None, 1, 1000)
            gastos_result = self.gastos_repository.search_all(None, 1, 1000)
            ingresos = ingresos_result['items']
            gastos = gastos_result['items']
        
        # Calcular totales
        total_ingresos = sum(float(ingreso['monto']) for ingreso in ingresos)
        total_gastos = sum(float(gasto['monto']) for gasto in gastos)
        balance = total_ingresos - total_gastos
        
        return {
            'total_ingresos': total_ingresos,
            'total_gastos': total_gastos,
            'balance': balance,
            'periodo': {
                'fecha_inicio': fecha_inicio,
                'fecha_fin': fecha_fin
            }
        }
    
    def get_resumen_mensual(self, año: int, mes: int) -> Dict[str, Any]:
        """
        Obtiene un resumen financiero mensual.
        
        Args:
            año: Año del resumen
            mes: Mes del resumen (1-12)
            
        Returns:
            Diccionario con el resumen mensual de ingresos y gastos
        """
        # Crear fechas de inicio y fin para el mes especificado
        fecha_inicio = f"{año}-{mes:02d}-01"
        
        # Determinar el último día del mes
        if mes == 12:
            fecha_fin = f"{año + 1}-01-01"
        else:
            fecha_fin = f"{año}-{mes + 1:02d}-01"
        
        # Obtener registros del mes
        ingresos = self.ingresos_repository.get_ingresos_by_fecha(fecha_inicio, fecha_fin)
        gastos = self.gastos_repository.get_gastos_by_fecha(fecha_inicio, fecha_fin)
        
        # Agrupar por tipo
        ingresos_por_tipo = {}
        for ingreso in ingresos:
            tipo = ingreso['tipo']
            if tipo not in ingresos_por_tipo:
                ingresos_por_tipo[tipo] = []
            ingresos_por_tipo[tipo].append(ingreso)
        
        gastos_por_tipo = {}
        for gasto in gastos:
            tipo = gasto['tipo']
            if tipo not in gastos_por_tipo:
                gastos_por_tipo[tipo] = []
            gastos_por_tipo[tipo].append(gasto)
        
        # Calcular totales por tipo
        resumen_ingresos = {}
        for tipo, items in ingresos_por_tipo.items():
            resumen_ingresos[tipo] = sum(float(item['monto']) for item in items)
            
        resumen_gastos = {}
        for tipo, items in gastos_por_tipo.items():
            resumen_gastos[tipo] = sum(float(item['monto']) for item in items)
            
        # Calcular totales generales
        total_ingresos = sum(resumen_ingresos.values())
        total_gastos = sum(resumen_gastos.values())
        balance = total_ingresos - total_gastos
        
        return {
            'mes': mes,
            'año': año,
            'ingresos': {
                'por_tipo': resumen_ingresos,
                'total': total_ingresos
            },
            'gastos': {
                'por_tipo': resumen_gastos,
                'total': total_gastos
            },
            'balance': balance
        }
