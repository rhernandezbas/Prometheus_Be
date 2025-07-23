"""Rutas para la gestión de alumnos."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.services.alumnos_service import AlumnosService
from app.utils.auth.decorators import role_required
from app.utils.auth.roles import Roles
from app.utils.config.logger import get_logger

# Inicializar el logger para este módulo
logger = get_logger(__name__)

# Crear Blueprint para rutas de alumnos
alumnos_bp = Blueprint('alumnos', __name__)

# Instanciar servicio
alumnos_service = AlumnosService()


@alumnos_bp.route('/create', methods=['POST'])
@jwt_required()
@role_required([Roles.ADMINISTRADOR, Roles.PROFESOR])
def crear_alumno():
    """Crea un nuevo alumno."""
    try:
        logger.info("[crear_alumno]: Intento de creación de nuevo alumno")
        data = request.get_json()
        if not data:
            logger.info("[crear_alumno]: Creación fallida: No se proporcionaron datos")
            return jsonify({'error': 'No se proporcionaron datos'}), 400
        
        # Verificar campos requeridos
        required_fields = ['name', 'lastname', 'dni', 'mail']
        for field in required_fields:
            if field not in data:
                logger.info(f"[crear_alumno]: Creación fallida: Campo requerido faltante: {field}")
                return jsonify({'error': f'El campo {field} es requerido'}), 400
        
        logger.info(f"[crear_alumno]: Creando alumno con DNI: {data.get('dni')}")
        alumno = alumnos_service.create_alumno(data)

        if not alumno:
            logger.error("[crear_alumno]: No se pudo crear el alumno")
            return jsonify({'error': 'No se pudo crear el alumno'}), 500
        
        logger.info(f"[crear_alumno]: Alumno creado exitosamente con ID: {alumno.get('id')}")
        return jsonify({'mensaje': 'Alumno creado con éxito', 'alumno': alumno}), 201
    except ValueError as e:
        logger.error(f"[crear_alumno]: Error de validación: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"[crear_alumno]: Error inesperado: {str(e)}")
        return jsonify({'error': str(e)}), 500


@alumnos_bp.route('/', methods=['GET'])
@jwt_required()
@role_required([Roles.ADMINISTRADOR, Roles.PROFESOR])
def listar_alumnos():
    """Lista todos los alumnos con paginación y filtros opcionales."""
    try:
        logger.info("[listar_alumnos]: Solicitando lista de alumnos")
        # Obtener parámetros de consulta para paginación
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Obtener parámetros para filtrado
        filters = {}
        for key in request.args:
            if key not in ['page', 'per_page'] and request.args.get(key):
                filters[key] = request.args.get(key)
        
        logger.info(f"[listar_alumnos]: Buscando alumnos con filtros: {filters}, página: {page}, por página: {per_page}")
        # Obtener lista paginada de alumnos
        result = alumnos_service.search_alumnos(filters, page, per_page)
        
        logger.info(f"[listar_alumnos]: Se encontraron {result.get('total', 0)} alumnos")
        return jsonify({
            'alumnos': result.get('items', []),
            'total': result.get('total', 0),
            'pages': result.get('pages', 1),
            'page': page,
            'per_page': per_page
        }), 200
    except Exception as e:
        logger.error(f"[listar_alumnos]: Error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@alumnos_bp.route('/<int:alumno_id>', methods=['GET'])
@jwt_required()
@role_required([Roles.ADMINISTRADOR, Roles.PROFESOR])
def obtener_alumno(alumno_id):
    """Obtiene un alumno por su ID."""
    try:
        logger.info(f"[obtener_alumno]: Buscando alumno con ID: {alumno_id}")
        alumno = alumnos_service.get_alumno_by_id(alumno_id)
        if not alumno:
            logger.info(f"[obtener_alumno]: Alumno con ID {alumno_id} no encontrado")
            return jsonify({'error': 'Alumno no encontrado'}), 404
        
        logger.info(f"[obtener_alumno]: Alumno con ID {alumno_id} encontrado")
        return jsonify({'alumno': alumno}), 200
    except Exception as e:
        logger.error(f"[obtener_alumno]: Error al buscar alumno con ID {alumno_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500


@alumnos_bp.route('/<int:alumno_id>', methods=['PUT'])
@jwt_required()
@role_required([Roles.ADMINISTRADOR, Roles.PROFESOR])
def actualizar_alumno(alumno_id):
    """Actualiza los datos de un alumno."""
    try:
        logger.info(f"[actualizar_alumno]: Actualizando alumno con ID: {alumno_id}")
        data = request.get_json()
        if not data:
            logger.info(f"[actualizar_alumno]: Actualización fallida para ID {alumno_id}: No se proporcionaron datos")
            return jsonify({'error': 'No se proporcionaron datos'}), 400
        
        # Actualizar alumno
        logger.info(f"[actualizar_alumno]: Aplicando cambios al alumno con ID {alumno_id}")
        alumno = alumnos_service.update_alumno(alumno_id, data)
        if not alumno:
            logger.info(f"[actualizar_alumno]: Alumno con ID {alumno_id} no encontrado")
            return jsonify({'error': 'Alumno no encontrado'}), 404
        
        logger.info(f"[actualizar_alumno]: Alumno con ID {alumno_id} actualizado exitosamente")
        return jsonify({'mensaje': 'Alumno actualizado con éxito', 'alumno': alumno}), 200
    except Exception as e:
        logger.error(f"[actualizar_alumno]: Error al actualizar alumno con ID {alumno_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500


@alumnos_bp.route('/<int:alumno_id>', methods=['DELETE'])
@jwt_required()
@role_required([Roles.ADMINISTRADOR])
def eliminar_alumno(alumno_id):
    """Elimina un alumno."""
    try:
        logger.info(f"[eliminar_alumno]: Eliminando alumno con ID: {alumno_id}")
        result = alumnos_service.delete_alumno(alumno_id)
        if not result:
            logger.info(f"[eliminar_alumno]: Alumno con ID {alumno_id} no encontrado")
            return jsonify({'error': 'Alumno no encontrado'}), 404
        
        logger.info(f"[eliminar_alumno]: Alumno con ID {alumno_id} eliminado exitosamente")
        return jsonify({'mensaje': 'Alumno eliminado con éxito'}), 200
    except Exception as e:
        logger.error(f"[eliminar_alumno]: Error al eliminar alumno con ID {alumno_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500


@alumnos_bp.route('/buscar', methods=['GET'])
@jwt_required()
@role_required([Roles.ADMINISTRADOR, Roles.PROFESOR])
def buscar_alumnos():
    """Busca alumnos por diferentes criterios."""
    try:
        logger.info("[buscar_alumnos]: Iniciando búsqueda de alumnos por criterios")
        # Obtener parámetros de consulta para paginación
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Construir filtros basados en parámetros de consulta
        filters = {}
        for key in request.args:
            if key not in ['page', 'per_page'] and request.args.get(key):
                filters[key] = request.args.get(key)
        
        if not filters:
            logger.info("[buscar_alumnos]: Búsqueda fallida: No se proporcionaron criterios")
            return jsonify({'error': 'Se requiere al menos un criterio de búsqueda'}), 400
        
        logger.info(f"[buscar_alumnos]: Buscando alumnos con criterios: {filters}")
        result = alumnos_service.search_alumnos(filters, page, per_page)
        
        logger.info(f"[buscar_alumnos]: Se encontraron {result.get('total', 0)} alumnos con los criterios especificados")
        return jsonify({
            'alumnos': result.get('items', []),
            'total': result.get('total', 0),
            'pages': result.get('pages', 1),
            'page': page,
            'per_page': per_page
        }), 200
    except Exception as e:
        logger.error(f"[buscar_alumnos]: Error en la búsqueda: {str(e)}")
        return jsonify({'error': str(e)}), 500


@alumnos_bp.route('/nivel/<string:nivel>', methods=['GET'])
@jwt_required()
@role_required([Roles.ADMINISTRADOR, Roles.PROFESOR])
def alumnos_por_nivel(nivel):
    """Obtiene todos los alumnos de un nivel específico."""
    try:
        logger.info(f"[alumnos_por_nivel]: Buscando alumnos del nivel: {nivel}")
        alumnos = alumnos_service.get_alumnos_by_nivel(nivel)
        logger.info(f"[alumnos_por_nivel]: Se encontraron {len(alumnos)} alumnos en el nivel {nivel}")
        return jsonify({'alumnos': alumnos}), 200
    except Exception as e:
        logger.error(f"[alumnos_por_nivel]: Error al buscar alumnos del nivel {nivel}: {str(e)}")
        return jsonify({'error': str(e)}), 500


@alumnos_bp.route('/<int:alumno_id>/status', methods=['PUT'])
@jwt_required()
@role_required([Roles.ADMINISTRADOR])
def actualizar_status_alumno(alumno_id):
    """Actualiza el estado de un alumno."""
    try:
        logger.info(f"[actualizar_status_alumno]: Actualizando estado del alumno con ID: {alumno_id}")
        data = request.get_json()
        if not data or 'status' not in data:
            logger.info(f"[actualizar_status_alumno]: Actualización fallida para ID {alumno_id}: Campo status requerido")
            return jsonify({'error': 'Se requiere el campo status'}), 400
        
        logger.info(f"[actualizar_status_alumno]: Cambiando estado del alumno ID {alumno_id} a: {data['status']}")
        result = alumnos_service.update_alumno_status(alumno_id, data['status'])
        if not result:
            logger.info(f"[actualizar_status_alumno]: Alumno con ID {alumno_id} no encontrado")
            return jsonify({'error': 'Alumno no encontrado'}), 404
        
        logger.info(f"[actualizar_status_alumno]: Estado del alumno ID {alumno_id} actualizado exitosamente")
        return jsonify({'mensaje': 'Estado del alumno actualizado con éxito'}), 200
    except Exception as e:
        logger.error(f"[actualizar_status_alumno]: Error al actualizar estado del alumno ID {alumno_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500


@alumnos_bp.route('/<int:alumno_id>/pago', methods=['PUT'])
@jwt_required()
@role_required([Roles.ADMINISTRADOR])
def actualizar_pago_alumno(alumno_id):
    """Actualiza el estado de pago de un alumno."""
    try:
        logger.info(f"[actualizar_pago_alumno]: Actualizando estado de pago del alumno con ID: {alumno_id}")
        data = request.get_json()
        if not data or 'pago' not in data:
            logger.info(f"[actualizar_pago_alumno]: Actualización fallida para ID {alumno_id}: Campo pago requerido")
            return jsonify({'error': 'Se requiere el campo pago'}), 400
        
        logger.info(f"[actualizar_pago_alumno]: Cambiando estado de pago del alumno ID {alumno_id} a: {data['pago']}")
        result = alumnos_service.update_alumno_pago(alumno_id, data['pago'])
        if not result:
            logger.info(f"[actualizar_pago_alumno]: Alumno con ID {alumno_id} no encontrado")
            return jsonify({'error': 'Alumno no encontrado'}), 404
        
        logger.info(f"[actualizar_pago_alumno]: Estado de pago del alumno ID {alumno_id} actualizado exitosamente")
        return jsonify({'mensaje': 'Estado de pago del alumno actualizado con éxito'}), 200
    except Exception as e:
        logger.error(f"[actualizar_pago_alumno]: Error al actualizar estado de pago del alumno ID {alumno_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500
