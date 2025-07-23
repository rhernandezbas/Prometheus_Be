"""Servicio para la gestión de niveles académicos."""
from typing import Dict, Any, Optional, List

from app.repositories.niveles_repository import NivelRepository, SubnivelRepository


class NivelesService:
    """Servicio para la gestión de niveles académicos y subniveles."""
    
    def __init__(self):
        """Inicializa el servicio con los repositorios correspondientes."""
        self.nivel_repository = NivelRepository()
        self.subnivel_repository = SubnivelRepository()
    
    # -------------------- Servicios para Niveles --------------------
    
    def create_nivel(self, nivel_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo nivel académico.
        
        Args:
            nivel_data: Datos del nivel a crear
            
        Returns:
            Nivel creado
        """
        # Verificar si ya existe un nivel con el mismo nombre
        nombre = nivel_data.get('nombre')
        if nombre:
            nivel_existente = self.nivel_repository.get_nivel_by_nombre(nombre)
            if nivel_existente:
                raise ValueError(f"Ya existe un nivel con el nombre '{nombre}'")
        
        return self.nivel_repository.create_nivel(nivel_data)
    
    def get_nivel_by_id(self, nivel_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un nivel por su ID.
        
        Args:
            nivel_id: ID del nivel a buscar
            
        Returns:
            Nivel encontrado o None
        """
        return self.nivel_repository.get_nivel_by_id(nivel_id)
    
    def get_nivel_by_nombre(self, nombre: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un nivel por su nombre.
        
        Args:
            nombre: Nombre del nivel a buscar
            
        Returns:
            Nivel encontrado o None
        """
        return self.nivel_repository.get_nivel_by_nombre(nombre)
    
    def update_nivel(self, nivel_id: int, nivel_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los datos de un nivel.
        
        Args:
            nivel_id: ID del nivel a actualizar
            nivel_data: Datos actualizados
            
        Returns:
            Nivel actualizado o None
        """
        # Verificar si ya existe un nivel con el mismo nombre
        if 'nombre' in nivel_data:
            nivel_existente = self.nivel_repository.get_nivel_by_nombre(nivel_data['nombre'])
            if nivel_existente and nivel_existente['id'] != nivel_id:
                raise ValueError(f"Ya existe un nivel con el nombre '{nivel_data['nombre']}'")
        
        return self.nivel_repository.update_nivel(nivel_id, nivel_data)
    
    def delete_nivel(self, nivel_id: int) -> bool:
        """
        Elimina un nivel académico.
        
        Args:
            nivel_id: ID del nivel a eliminar
            
        Returns:
            True si el nivel fue eliminado, False en caso contrario
        """
        # Verificar si el nivel tiene subniveles asociados
        subniveles = self.nivel_repository.get_subniveles_by_nivel_id(nivel_id)
        if subniveles:
            raise ValueError(f"No se puede eliminar el nivel porque tiene {len(subniveles)} subniveles asociados")
            
        return self.nivel_repository.delete_nivel(nivel_id)
    
    def search_niveles(self, filters: Optional[Dict[str, Any]] = None, page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """
        Busca niveles con filtros opcionales y paginación.
        
        Args:
            filters: Filtros para la búsqueda
            page: Número de página
            per_page: Elementos por página
            
        Returns:
            Diccionario con niveles y metadatos de paginación
        """
        return self.nivel_repository.search_all(filters, page, per_page)
    
    def get_niveles_con_subniveles(self) -> List[Dict[str, Any]]:
        """
        Obtiene todos los niveles con sus subniveles anidados.
        
        Returns:
            Lista de niveles con subniveles
        """
        # Obtener todos los niveles
        resultado_niveles = self.nivel_repository.search_all()
        niveles = resultado_niveles['items']
        
        # Para cada nivel, agregar sus subniveles
        for nivel in niveles:
            subniveles = self.nivel_repository.get_subniveles_by_nivel_id(nivel['id'])
            nivel['subniveles'] = sorted(subniveles, key=lambda x: x['numero'])
            
        return niveles
    
    # -------------------- Servicios para Subniveles --------------------
    
    def create_subnivel(self, subnivel_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo subnivel académico.
        
        Args:
            subnivel_data: Datos del subnivel a crear
            
        Returns:
            Subnivel creado
        """
        # Verificar que el nivel exista
        nivel_id = subnivel_data.get('nivel_id')
        if nivel_id:
            nivel = self.nivel_repository.get_nivel_by_id(nivel_id)
            if not nivel:
                raise ValueError(f"El nivel con ID {nivel_id} no existe")
                
            # Verificar si ya existe un subnivel con el mismo número para este nivel
            numero = subnivel_data.get('numero')
            if numero is not None:
                subnivel_existente = self.subnivel_repository.get_subnivel_by_numero_and_nivel_id(
                    numero, nivel_id)
                if subnivel_existente:
                    raise ValueError(f"Ya existe un subnivel con el número {numero} para el nivel {nivel['nombre']}")
        
        return self.subnivel_repository.create_subnivel(subnivel_data)
    
    def get_subnivel_by_id(self, subnivel_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un subnivel por su ID.
        
        Args:
            subnivel_id: ID del subnivel a buscar
            
        Returns:
            Subnivel encontrado o None
        """
        return self.subnivel_repository.get_subnivel_by_id(subnivel_id)
    
    def get_subnivel_completo(self, subnivel_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un subnivel con datos de su nivel asociado.
        
        Args:
            subnivel_id: ID del subnivel a buscar
            
        Returns:
            Subnivel con datos del nivel asociado o None
        """
        subnivel = self.subnivel_repository.get_subnivel_by_id(subnivel_id)
        if not subnivel or 'nivel_id' not in subnivel:
            return subnivel
            
        nivel = self.nivel_repository.get_nivel_by_id(subnivel['nivel_id'])
        if nivel:
            subnivel['nivel'] = nivel
            
        return subnivel
    
    def update_subnivel(self, subnivel_id: int, subnivel_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los datos de un subnivel.
        
        Args:
            subnivel_id: ID del subnivel a actualizar
            subnivel_data: Datos actualizados
            
        Returns:
            Subnivel actualizado o None
        """
        subnivel_actual = self.subnivel_repository.get_subnivel_by_id(subnivel_id)
        if not subnivel_actual:
            return None
            
        # Si se cambia el número o el nivel, verificar que no exista uno igual
        if ('numero' in subnivel_data or 'nivel_id' in subnivel_data) and 'nivel_id' in subnivel_actual:
            numero = subnivel_data.get('numero', subnivel_actual['numero'])
            nivel_id = subnivel_data.get('nivel_id', subnivel_actual['nivel_id'])
            
            subnivel_existente = self.subnivel_repository.get_subnivel_by_numero_and_nivel_id(
                numero, nivel_id)
                
            if subnivel_existente and subnivel_existente['id'] != subnivel_id:
                nivel = self.nivel_repository.get_nivel_by_id(nivel_id)
                nombre_nivel = nivel['nombre'] if nivel else nivel_id
                raise ValueError(f"Ya existe un subnivel con el número {numero} para el nivel {nombre_nivel}")
                
        return self.subnivel_repository.update_subnivel(subnivel_id, subnivel_data)
    
    def delete_subnivel(self, subnivel_id: int) -> bool:
        """
        Elimina un subnivel académico.
        
        Args:
            subnivel_id: ID del subnivel a eliminar
            
        Returns:
            True si el subnivel fue eliminado, False en caso contrario
        """
        return self.subnivel_repository.delete_subnivel(subnivel_id)
    
    def search_subniveles(self, filters: Optional[Dict[str, Any]] = None, page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """
        Busca subniveles con filtros opcionales y paginación.
        
        Args:
            filters: Filtros para la búsqueda
            page: Número de página
            per_page: Elementos por página
            
        Returns:
            Diccionario con subniveles y metadatos de paginación
        """
        return self.subnivel_repository.search_all(filters, page, per_page)
    
    def get_subniveles_by_nivel_id(self, nivel_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todos los subniveles de un nivel específico.
        
        Args:
            nivel_id: ID del nivel
            
        Returns:
            Lista de subniveles del nivel especificado
        """
        return self.nivel_repository.get_subniveles_by_nivel_id(nivel_id)
