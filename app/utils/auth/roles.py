"""
Definición de roles y permisos del sistema.
"""
from enum import Enum, auto


class Roles:
    """Constantes para los roles del sistema."""
    
    # Roles principales
    ADMINISTRADOR = "ADMINISTRADOR"
    PROFESOR = "PROFESOR"
    ALUMNO = "ALUMNO"
    SECRETARIA = "SECRETARIA"
    FINANZAS = "FINANZAS"
    USER = "USER"  # Usuario básico
    
    # Lista de todos los roles válidos
    ALL_ROLES = [ADMINISTRADOR, PROFESOR, ALUMNO, SECRETARIA, FINANZAS, USER]
    
    # Roles con acceso administrativo
    ADMIN_ROLES = [ADMINISTRADOR]
    
    # Roles con acceso a gestión académica
    ACADEMIC_ROLES = [ADMINISTRADOR, PROFESOR, SECRETARIA]
    
    # Roles con acceso a información financiera
    FINANCE_ROLES = [ADMINISTRADOR, FINANZAS, SECRETARIA]
    
    @staticmethod
    def is_valid_role(role):
        """Verifica si un rol es válido."""
        return role in Roles.ALL_ROLES
