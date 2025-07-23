"""Rutas para el módulo de evaluaciones y calificaciones."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.evaluacion_service import EvaluacionService
from app.utils.auth.decorators import role_required


# Crear Blueprint para rutas de evaluación
evaluacion_bp = Blueprint('evaluacion', __name__, url_prefix='/api/v1/evaluacion')

# Instanciar servicio
evaluacion_service = EvaluacionService()


# -------------------- Rutas para Evaluaciones --------------------

@evaluacion_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('ADMINISTRADOR', 'INSTRUCTOR')
def crear_evaluacion():
    """Crea una nueva evaluación académica."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se proporcionaron datos'}), 400
        
        evaluacion = evaluacion_service.crear_evaluacion(data)
        return jsonify({'mensaje': 'Evaluación creada con éxito', 'evaluacion': evaluacion}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evaluacion_bp.route('/', methods=['GET'])
@jwt_required()
def obtener_evaluaciones():
    """Obtiene evaluaciones con filtros opcionales."""
    try:
        # Obtener parámetros de consulta
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        nivel_id = request.args.get('nivel_id', type=int)
        
        if fecha_inicio and fecha_fin:
            evaluaciones = evaluacion_service.get_evaluaciones_by_periodo(fecha_inicio, fecha_fin, nivel_id)
        elif nivel_id:
            evaluaciones = evaluacion_service.get_evaluaciones_by_nivel(nivel_id)
        else:
            return jsonify({'error': 'Se requieren filtros válidos'}), 400
        
        return jsonify({'evaluaciones': evaluaciones}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evaluacion_bp.route('/<int:evaluacion_id>', methods=['GET'])
@jwt_required()
def obtener_evaluacion(evaluacion_id):
    """Obtiene una evaluación por su ID."""
    try:
        evaluacion = evaluacion_service.get_evaluacion_by_id(evaluacion_id)
        if not evaluacion:
            return jsonify({'error': 'Evaluación no encontrada'}), 404
        
        return jsonify({'evaluacion': evaluacion}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evaluacion_bp.route('/<int:evaluacion_id>', methods=['PUT'])
@jwt_required()
@role_required('ADMINISTRADOR', 'INSTRUCTOR')
def actualizar_evaluacion(evaluacion_id):
    """Actualiza una evaluación académica."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se proporcionaron datos'}), 400
        
        evaluacion = evaluacion_service.update_evaluacion(evaluacion_id, data)
        if not evaluacion:
            return jsonify({'error': 'Evaluación no encontrada'}), 404
        
        return jsonify({'mensaje': 'Evaluación actualizada con éxito', 'evaluacion': evaluacion}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evaluacion_bp.route('/<int:evaluacion_id>', methods=['DELETE'])
@jwt_required()
@role_required('ADMINISTRADOR')
def eliminar_evaluacion(evaluacion_id):
    """Elimina una evaluación académica."""
    try:
        result = evaluacion_service.delete_evaluacion(evaluacion_id)
        if not result:
            return jsonify({'error': 'Evaluación no encontrada'}), 404
        
        return jsonify({'mensaje': 'Evaluación eliminada con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evaluacion_bp.route('/nivel/<int:nivel_id>', methods=['GET'])
@jwt_required()
def obtener_evaluaciones_por_nivel(nivel_id):
    """Obtiene evaluaciones de un nivel específico."""
    try:
        evaluaciones = evaluacion_service.get_evaluaciones_by_nivel(nivel_id)
        return jsonify({'evaluaciones': evaluaciones}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# -------------------- Rutas para Calificaciones --------------------

@evaluacion_bp.route('/calificacion', methods=['POST'])
@jwt_required()
@role_required('ADMINISTRADOR', 'INSTRUCTOR')
def registrar_calificacion():
    """Registra la calificación de un alumno."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se proporcionaron datos'}), 400
        
        calificacion = evaluacion_service.registrar_calificacion(data)
        return jsonify({'mensaje': 'Calificación registrada con éxito', 'calificacion': calificacion}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evaluacion_bp.route('/calificacion/multiple', methods=['POST'])
@jwt_required()
@role_required('ADMINISTRADOR', 'INSTRUCTOR')
def registrar_calificaciones_multiple():
    """Registra calificaciones para múltiples alumnos de una vez."""
    try:
        data = request.get_json()
        if not data or not isinstance(data, list):
            return jsonify({'error': 'Se requiere una lista de calificaciones'}), 400
        
        resultados = evaluacion_service.registrar_calificaciones_multiple(data)
        return jsonify({'mensaje': 'Calificaciones registradas', 'resultados': resultados}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evaluacion_bp.route('/calificacion/<int:evaluacion_id>/alumno/<int:alumno_id>', methods=['GET'])
@jwt_required()
def obtener_calificacion(evaluacion_id, alumno_id):
    """Obtiene la calificación de un alumno para una evaluación específica."""
    try:
        calificacion = evaluacion_service.get_calificacion(evaluacion_id, alumno_id)
        if not calificacion:
            return jsonify({'mensaje': 'No hay calificación registrada'}), 404
            
        return jsonify({'calificacion': calificacion}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evaluacion_bp.route('/calificacion/evaluacion/<int:evaluacion_id>', methods=['GET'])
@jwt_required()
@role_required('ADMINISTRADOR', 'INSTRUCTOR')
def obtener_calificaciones_por_evaluacion(evaluacion_id):
    """Obtiene todas las calificaciones de una evaluación."""
    try:
        calificaciones = evaluacion_service.get_calificaciones_by_evaluacion(evaluacion_id)
        return jsonify({'calificaciones': calificaciones}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evaluacion_bp.route('/calificacion/alumno/<int:alumno_id>', methods=['GET'])
@jwt_required()
def obtener_calificaciones_por_alumno(alumno_id):
    """Obtiene todas las calificaciones de un alumno."""
    try:
        calificaciones = evaluacion_service.get_calificaciones_by_alumno(alumno_id)
        return jsonify({'calificaciones': calificaciones}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evaluacion_bp.route('/calificacion/<int:calificacion_id>', methods=['PUT'])
@jwt_required()
@role_required('ADMINISTRADOR', 'INSTRUCTOR')
def actualizar_calificacion(calificacion_id):
    """Actualiza una calificación."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se proporcionaron datos'}), 400
        
        calificacion = evaluacion_service.update_calificacion(calificacion_id, data)
        if not calificacion:
            return jsonify({'error': 'Calificación no encontrada'}), 404
        
        return jsonify({'mensaje': 'Calificación actualizada con éxito', 'calificacion': calificacion}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evaluacion_bp.route('/calificacion/<int:calificacion_id>', methods=['DELETE'])
@jwt_required()
@role_required('ADMINISTRADOR')
def eliminar_calificacion(calificacion_id):
    """Elimina una calificación."""
    try:
        result = evaluacion_service.delete_calificacion(calificacion_id)
        if not result:
            return jsonify({'error': 'Calificación no encontrada'}), 404
        
        return jsonify({'mensaje': 'Calificación eliminada con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evaluacion_bp.route('/reporte/alumno/<int:alumno_id>', methods=['GET'])
@jwt_required()
def obtener_reporte_academico(alumno_id):
    """Genera un reporte académico de un alumno."""
    try:
        # Obtener parámetro de nivel opcional
        nivel_id = request.args.get('nivel_id', type=int)
        
        reporte = evaluacion_service.get_reporte_academico(alumno_id, nivel_id)
        return jsonify({'reporte': reporte}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
