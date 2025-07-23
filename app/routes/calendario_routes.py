"""Rutas para el módulo de calendario académico."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.calendario_service import CalendarioService
from app.utils.auth.decorators import role_required


# Crear Blueprint para rutas de calendario
calendario_bp = Blueprint('calendario', __name__, url_prefix='/api/v1/calendario')

# Instanciar servicio
calendario_service = CalendarioService()


@calendario_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('ADMINISTRADOR', 'INSTRUCTOR')
def crear_evento():
    """Crea un nuevo evento en el calendario."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se proporcionaron datos'}), 400
        
        evento = calendario_service.crear_evento(data)
        return jsonify({'mensaje': 'Evento creado con éxito', 'evento': evento}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@calendario_bp.route('/', methods=['GET'])
@jwt_required()
def obtener_eventos():
    """Obtiene eventos del calendario con filtros."""
    try:
        # Obtener parámetros de consulta
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        tipo = request.args.get('tipo')
        nivel_id = request.args.get('nivel_id')
        instructor_id = request.args.get('instructor_id')
        
        if not fecha_inicio or not fecha_fin:
            return jsonify({'error': 'Se requieren fecha_inicio y fecha_fin'}), 400
        
        # Convertir nivel_id e instructor_id a enteros si no son None
        if nivel_id:
            nivel_id = int(nivel_id)
        if instructor_id:
            instructor_id = int(instructor_id)
        
        eventos = calendario_service.get_eventos_by_rango(
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin,
            tipo=tipo,
            nivel_id=nivel_id,
            instructor_id=instructor_id
        )
        
        return jsonify({'eventos': eventos}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@calendario_bp.route('/proximos', methods=['GET'])
@jwt_required()
def obtener_eventos_proximos():
    """Obtiene eventos próximos en los siguientes días."""
    try:
        # Obtener parámetros de consulta
        dias = request.args.get('dias', default=7, type=int)
        nivel_id = request.args.get('nivel_id', type=int)
        
        eventos = calendario_service.get_eventos_proximos(
            dias=dias,
            nivel_id=nivel_id
        )
        
        return jsonify({'eventos': eventos}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@calendario_bp.route('/nivel/<int:nivel_id>', methods=['GET'])
@jwt_required()
def obtener_eventos_por_nivel(nivel_id):
    """Obtiene eventos asociados a un nivel específico."""
    try:
        eventos = calendario_service.get_eventos_by_nivel(nivel_id)
        return jsonify({'eventos': eventos}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@calendario_bp.route('/instructor/<int:instructor_id>', methods=['GET'])
@jwt_required()
def obtener_eventos_por_instructor(instructor_id):
    """Obtiene eventos asociados a un instructor específico."""
    try:
        eventos = calendario_service.get_eventos_by_instructor(instructor_id)
        return jsonify({'eventos': eventos}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@calendario_bp.route('/<int:evento_id>', methods=['GET'])
@jwt_required()
def obtener_evento(evento_id):
    """Obtiene un evento por su ID."""
    try:
        evento = calendario_service.get_evento_by_id(evento_id)
        if not evento:
            return jsonify({'error': 'Evento no encontrado'}), 404
        
        return jsonify({'evento': evento}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@calendario_bp.route('/<int:evento_id>', methods=['PUT'])
@jwt_required()
@role_required('ADMINISTRADOR', 'INSTRUCTOR')
def actualizar_evento(evento_id):
    """Actualiza un evento del calendario."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se proporcionaron datos'}), 400
        
        evento = calendario_service.update_evento(evento_id, data)
        if not evento:
            return jsonify({'error': 'Evento no encontrado'}), 404
        
        return jsonify({'mensaje': 'Evento actualizado con éxito', 'evento': evento}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@calendario_bp.route('/<int:evento_id>', methods=['DELETE'])
@jwt_required()
@role_required('ADMINISTRADOR')
def eliminar_evento(evento_id):
    """Elimina un evento del calendario."""
    try:
        result = calendario_service.delete_evento(evento_id)
        if not result:
            return jsonify({'error': 'Evento no encontrado'}), 404
        
        return jsonify({'mensaje': 'Evento eliminado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
