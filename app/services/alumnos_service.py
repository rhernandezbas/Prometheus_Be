"""Servicio para la gestión de alumnos."""
from datetime import datetime
import bcrypt
from typing import Dict, Any, Optional, List

from app.repositories.alumnos_repository import AlumnosRepository
from app.services.user_service import UserService
from app.models.niveles import Nivel, Subnivel


class AlumnosService:
    """Servicio para la gestión de alumnos."""
    
    def __init__(self):
        """Inicializa el servicio con el repositorio correspondiente."""
        self.repository = AlumnosRepository()
        self.user_service = UserService()
    
    def calculate_age(self, date_of_birth: str) -> str:
        """
        Calcula la edad a partir de la fecha de nacimiento.
        
        Args:
            date_of_birth: Fecha de nacimiento en formato string (YYYY-MM-DD)
            
        Returns:
            Edad como string
        """
        if not date_of_birth:
            return ""
            
        try:
            # Convertir la fecha de nacimiento a objeto datetime
            birth_date = datetime.strptime(date_of_birth, "%Y-%m-%d")
            
            # Obtener la fecha actual
            today = datetime.now()
            
            # Calcular la edad
            age = today.year - birth_date.year
            
            # Ajustar la edad si aún no ha pasado el cumpleaños este año
            if (today.month, today.day) < (birth_date.month, birth_date.day):
                age -= 1
                
            return str(age)
        except ValueError:
            # Si el formato de fecha no es válido, retornar cadena vacía
            return ""
    
    def get_subnivel_id(self, nivel_nombre: str, subnivel_numero: int) -> Optional[int]:
        """
        Obtiene el ID del subnivel basado en el nombre del nivel y el número de subnivel.
        
        Args:
            nivel_nombre: Nombre del nivel (básico, intermedio, avanzado)
            subnivel_numero: Número del subnivel (1, 2, 3)
            
        Returns:
            ID del subnivel o None si no se encuentra
        """
        try:
            # Buscar el nivel por nombre
            nivel = Nivel.query.filter_by(nombre=nivel_nombre).first()
            if not nivel:
                return None
                
            # Buscar el subnivel por nivel_id y número
            subnivel = Subnivel.query.filter_by(nivel_id=nivel.id, numero=subnivel_numero).first()
            if not subnivel:
                return None
                
            return subnivel.id
        except Exception as e:
            print(f"Error al obtener subnivel: {e}")
            return None
    
    def create_alumno(self, alumno_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crea un nuevo alumno.
        
        Args:
            alumno_data: Datos del alumno a crear
            
        Returns:
            Alumno creado
        """
        # Generar contraseña automáticamente si no se proporciona
        original_password = alumno_data.get('password')
        if not original_password:
            name = alumno_data.get('name', '')
            dni = alumno_data.get('dni', '')
            if name and dni:
                original_password = f"{name.lower()}{dni}"
                alumno_data['password'] = original_password
        
        # Encriptar contraseña
        if original_password:
            alumno_data['password'] = self._hash_password(original_password)
            
        # Agregar timestamps y valores por defecto
        current_time = datetime.now().isoformat()
        alumno_data['created_at'] = current_time
        alumno_data['updated_at'] = current_time
        alumno_data['status'] = alumno_data.get('status', 'activo')
        alumno_data['pago'] = alumno_data.get('pago', 'pendiente')
        
        # Establecer valores predeterminados para los nuevos campos
        alumno_data.setdefault('dateOfEntry', '')
        alumno_data.setdefault('comments', '')
        alumno_data.setdefault('gender', '')
        
        # Calcular la edad a partir de la fecha de nacimiento
        date_of_birth = alumno_data.get('dateOfBirth', '')
        alumno_data['age'] = self.calculate_age(date_of_birth)
        
        # Procesar información de nivel y subnivel
        nivel = alumno_data.get('nivel', '')
        subnivel_numero = alumno_data.get('subnivel_numero')
        
        # Si se proporciona nivel y número de subnivel, buscar el ID del subnivel
        if nivel and subnivel_numero:
            subnivel_id = self.get_subnivel_id(nivel, subnivel_numero)
            if subnivel_id:
                alumno_data['subnivel_id'] = subnivel_id
        
        # Crear alumno
        alumno = self.repository.create_alumno(alumno_data)
        
        # Si se creó el alumno exitosamente, crear un usuario asociado
        if alumno and original_password:
            # Crear el nombre completo combinando nombre y apellido
            name = alumno_data.get('name', '')
            lastname = alumno_data.get('lastname', '')
            fullname = f"{name} {lastname}".strip()
            
            # Crear usuario con DNI como nombre de usuario
            user_data = {
                'username': alumno_data.get('dni'),
                'email': alumno_data.get('mail'),
                'password': original_password,  # La contraseña original, el servicio la encriptará
                'privileges': 'ESTUDIANTE',  # Rol de estudiante
                'fullname': fullname  # Añadir el nombre completo
            }
            
            # Crear el usuario
            self.user_service.create_user(user_data)
        
        return alumno
    
    def get_alumno_by_id(self, alumno_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene un alumno por su ID.
        
        Args:
            alumno_id: ID del alumno a buscar
            
        Returns:
            Alumno encontrado o None
        """
        return self.repository.get_alumno_by_id(alumno_id)
    
    def get_alumno_by_dni(self, dni: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un alumno por su DNI.
        
        Args:
            dni: DNI del alumno a buscar
            
        Returns:
            Alumno encontrado o None
        """
        return self.repository.get_alumno_by_dni(dni)
    
    def update_alumno(self, alumno_id: int, alumno_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los datos de un alumno.
        
        Args:
            alumno_id: ID del alumno a actualizar
            alumno_data: Datos actualizados
            
        Returns:
            Alumno actualizado o None
        """
        # Encriptar contraseña si se proporciona
        if 'password' in alumno_data:
            alumno_data['password'] = self._hash_password(alumno_data['password'])
            
        # Añadir timestamp de actualización como string
        alumno_data['updated_at'] = datetime.now().isoformat()
        
        # Recalcular la edad si se actualiza la fecha de nacimiento
        if 'dateOfBirth' in alumno_data:
            alumno_data['age'] = self.calculate_age(alumno_data['dateOfBirth'])
        
        # Procesar información de nivel y subnivel si se actualizan
        if 'nivel' in alumno_data or 'subnivel_numero' in alumno_data:
            # Obtener datos actuales del alumno si es necesario
            alumno_actual = None
            if 'nivel' not in alumno_data or 'subnivel_numero' not in alumno_data:
                alumno_actual = self.get_alumno_by_id(alumno_id)
            
            nivel = alumno_data.get('nivel', alumno_actual['nivel'] if alumno_actual else '')
            subnivel_numero = alumno_data.get('subnivel_numero')
            
            if nivel and subnivel_numero:
                subnivel_id = self.get_subnivel_id(nivel, subnivel_numero)
                if subnivel_id:
                    alumno_data['subnivel_id'] = subnivel_id
        
        return self.repository.update_alumno(alumno_id, alumno_data)
    
    def delete_alumno(self, alumno_id: int) -> bool:
        """
        Elimina un alumno.
        
        Args:
            alumno_id: ID del alumno a eliminar
            
        Returns:
            True si el alumno fue eliminado, False en caso contrario
        """
        return self.repository.delete_alumno(alumno_id)
    
    def search_alumnos(self, filters: Optional[Dict[str, Any]] = None, page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """
        Busca alumnos con filtros opcionales y paginación.
        
        Args:
            filters: Filtros para la búsqueda
            page: Número de página
            per_page: Elementos por página
            
        Returns:
            Diccionario con alumnos y metadatos de paginación
        """
        return self.repository.search_all(filters, page, per_page)
    
    def change_password(self, alumno_id: int, new_password: str) -> bool:
        """
        Cambia la contraseña de un alumno.
        
        Args:
            alumno_id: ID del alumno
            new_password: Nueva contraseña
            
        Returns:
            True si la contraseña fue cambiada, False en caso contrario
        """
        hashed_password = self._hash_password(new_password)
        return self.repository.change_password(alumno_id, hashed_password)
    
    def update_alumno_status(self, alumno_id: int, status: str) -> bool:
        """
        Actualiza el estado de un alumno (activo/inactivo/etc).
        
        Args:
            alumno_id: ID del alumno
            status: Nuevo estado
            
        Returns:
            True si el estado fue actualizado, False en caso contrario
        """
        return self.repository.update_alumno_status(alumno_id, status)
    
    def update_alumno_pago(self, alumno_id: int, pago: str) -> bool:
        """
        Actualiza el estado de pago de un alumno.
        
        Args:
            alumno_id: ID del alumno
            pago: Estado de pago (pendiente/pagado/etc)
            
        Returns:
            True si el estado de pago fue actualizado, False en caso contrario
        """
        return self.repository.update_alumno_pago(alumno_id, pago)
    
    def get_alumnos_by_nivel(self, nivel: str) -> List[Dict[str, Any]]:
        """
        Obtiene todos los alumnos de un nivel específico.
        
        Args:
            nivel: Nivel académico
            
        Returns:
            Lista de alumnos del nivel especificado
        """
        return self.repository.get_alumnos_by_nivel(nivel)
    
    def verify_login(self, dni: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Verifica las credenciales de login de un alumno.
        
        Args:
            dni: DNI del alumno
            password: Contraseña
            
        Returns:
            Datos del alumno si las credenciales son correctas, None en caso contrario
        """
        alumno = self.repository.get_alumno_by_dni(dni)
        if not alumno:
            return None
            
        if self._verify_password(password, alumno['password']):
            # Eliminar la contraseña del objeto devuelto por seguridad
            alumno_safe = alumno.copy()
            if 'password' in alumno_safe:
                del alumno_safe['password']
            return alumno_safe
        
        return None
    
    def _hash_password(self, password: str) -> str:
        """
        Hashea una contraseña.
        
        Args:
            password: Contraseña a hashear
            
        Returns:
            Contraseña hasheada
        """
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)
        return hashed.decode('utf-8')
    
    def _verify_password(self, password: str, hashed_password: str) -> bool:
        """
        Verifica si una contraseña coincide con su hash.
        
        Args:
            password: Contraseña a verificar
            hashed_password: Hash de contraseña almacenado
            
        Returns:
            True si la contraseña coincide, False en caso contrario
        """
        password_bytes = password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)
