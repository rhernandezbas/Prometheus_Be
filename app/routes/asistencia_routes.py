"""Rutas para el módulo de asistencia de alumnos."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.asistencia_service import AsistenciaService
from app.utils.auth.decorators import role_required


# Crear Blueprint para rutas de asistencia
asistencia_bp = Blueprint('asistencia', __name__, url_prefix='/api/v1/asistencia')

# Instanciar servicio
asistencia_service = AsistenciaService()


@asistencia_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('ADMINISTRADOR', 'INSTRUCTOR')
def registrar_asistencia():
    """Registra la asistencia de un alumno."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se proporcionaron datos'}), 400
        
        asistencia = asistencia_service.registrar_asistencia(data)
        return jsonify({'mensaje': 'Asistencia registrada con éxito', 'asistencia': asistencia}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@asistencia_bp.route('/multiple', methods=['POST'])
@jwt_required()
@role_required('ADMINISTRADOR', 'INSTRUCTOR')
def registrar_asistencia_multiple():
    """Registra la asistencia de múltiples alumnos de una vez."""
    try:
        data = request.get_json()
        if not data or not isinstance(data, list):
            return jsonify({'error': 'Se requiere una lista de registros de asistencia'}), 400
        
        resultados = asistencia_service.registrar_asistencia_multiple(data)
        return jsonify({'mensaje': 'Asistencias registradas', 'resultados': resultados}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@asistencia_bp.route('/alumno/<int:alumno_id>', methods=['GET'])
@jwt_required()
def obtener_asistencia_alumno(alumno_id):
    """Obtiene los registros de asistencia de un alumno."""
    try:
        # Obtener parámetros de consulta
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        
        asistencias = asistencia_service.get_asistencia_by_alumno(alumno_id, fecha_inicio, fecha_fin)
        return jsonify({'asistencias': asistencias}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@asistencia_bp.route('/alumno/<int:alumno_id>/fecha/<string:fecha>', methods=['GET'])
@jwt_required()
def obtener_asistencia_alumno_fecha(alumno_id, fecha):
    """Obtiene el registro de asistencia de un alumno para una fecha específica."""
    try:
        asistencia = asistencia_service.get_asistencia_by_alumno_fecha(alumno_id, fecha)
        if not asistencia:
            return jsonify({'mensaje': 'No hay registro de asistencia para esta fecha'}), 404
            
        return jsonify({'asistencia': asistencia}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@asistencia_bp.route('/nivel/<int:nivel_id>/fecha/<string:fecha>', methods=['GET'])
@jwt_required()
@role_required('ADMINISTRADOR', 'INSTRUCTOR')
def obtener_asistencia_nivel(nivel_id, fecha):
    """Obtiene los registros de asistencia de un nivel para una fecha específica."""
    try:
        asistencias = asistencia_service.get_asistencia_by_nivel(nivel_id, fecha)
        return jsonify({'asistencias': asistencias}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@asistencia_bp.route('/reporte/<int:alumno_id>/<int:ano>/<int:mes>', methods=['GET'])
@jwt_required()
def obtener_reporte_asistencia(alumno_id, ano, mes):
    """Genera un reporte mensual de asistencia de un alumno."""
    try:
        reporte = asistencia_service.get_reporte_asistencia(alumno_id, mes, ano)
        return jsonify({'reporte': reporte}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@asistencia_bp.route('/<int:asistencia_id>', methods=['GET'])
@jwt_required()
def obtener_asistencia(asistencia_id):
    """Obtiene un registro de asistencia por su ID."""
    try:
        asistencia = asistencia_service.get_asistencia_by_id(asistencia_id)
        if not asistencia:
            return jsonify({'error': 'Registro de asistencia no encontrado'}), 404
        
        return jsonify({'asistencia': asistencia}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@asistencia_bp.route('/<int:asistencia_id>', methods=['PUT'])
@jwt_required()
@role_required('ADMINISTRADOR', 'INSTRUCTOR')
def actualizar_asistencia(asistencia_id):
    """Actualiza un registro de asistencia."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se proporcionaron datos'}), 400
        
        asistencia = asistencia_service.update_asistencia(asistencia_id, data)
        if not asistencia:
            return jsonify({'error': 'Registro de asistencia no encontrado'}), 404
        
        return jsonify({'mensaje': 'Asistencia actualizada con éxito', 'asistencia': asistencia}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@asistencia_bp.route('/<int:asistencia_id>', methods=['DELETE'])
@jwt_required()
@role_required('ADMINISTRADOR')
def eliminar_asistencia(asistencia_id):
    """Elimina un registro de asistencia."""
    try:
        result = asistencia_service.delete_asistencia(asistencia_id)
        if not result:
            return jsonify({'error': 'Registro de asistencia no encontrado'}), 404
        
        return jsonify({'mensaje': 'Registro de asistencia eliminado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
