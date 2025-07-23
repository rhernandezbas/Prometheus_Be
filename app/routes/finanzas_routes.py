"""
Módulo de rutas para la gestión de finanzas.
Define los endpoints para manejar gastos e ingresos.
"""

from flask import Blueprint, request, jsonify
from app.models.finanzas import gastos, ingresos
from flask_jwt_extended import jwt_required
from app.utils.config.config import db
from sqlalchemy.exc import SQLAlchemyError

# Crear el blueprint para las rutas de finanzas
finanzas_bp = Blueprint('finanzas', __name__)


@finanzas_bp.route('/gastos/search_all', methods=['GET'])
@jwt_required()
def get_all_gastos():
    """Obtiene todos los registros de gastos"""
    try:
        all_gastos = gastos.query.all()
        result = []
        for gasto in all_gastos:
            gasto_data = {
                'id': gasto.id,
                'fecha': gasto.fecha,
                'concepto': gasto.concepto,
                'monto': gasto.monto,
                'tipo': gasto.tipo,
                'detalle': gasto.detalle,
                'instructor_id': gasto.instructor_id
            }
            result.append(gasto_data)
        return jsonify({'gastos': result}), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@finanzas_bp.route('/gastos/search/<int:id_gasto>', methods=['GET'])
@jwt_required()
def get_gasto(id_gasto):
    """Obtiene un gasto específico por su ID"""
    try:
        gasto = gastos.query.get(id_gasto)
        if not gasto:
            return jsonify({'message': 'Gasto no encontrado'}), 404

        gasto_data = {
            'id': gasto.id,
            'fecha': gasto.fecha,
            'concepto': gasto.concepto,
            'monto': gasto.monto,
            'tipo': gasto.tipo,
            'detalle': gasto.detalle,
            'instructor_id': gasto.instructor_id
        }
        return jsonify({'gasto': gasto_data}), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@finanzas_bp.route('/gastos/create', methods=['POST'])
@jwt_required()
def create_gasto():
    """Crea un nuevo registro de gasto"""
    try:
        data = request.get_json()

        # Validar datos requeridos
        required_fields = ['fecha', 'concepto', 'monto', 'tipo', 'detalle']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'El campo {field} es requerido'}), 400

        nuevo_gasto = gastos(
            fecha=data['fecha'],
            concepto=data['concepto'],
            monto=data['monto'],
            tipo=data['tipo'],
            detalle=data['detalle']
        )

        # Asignar instructor_id si está presente
        if 'instructor_id' in data:
            nuevo_gasto.instructor_id = data['instructor_id']

        db.session.add(nuevo_gasto)
        db.session.commit()

        return jsonify({
            'message': 'Gasto creado exitosamente',
            'gasto': {
                'id': nuevo_gasto.id,
                'fecha': nuevo_gasto.fecha,
                'concepto': nuevo_gasto.concepto,
                'monto': nuevo_gasto.monto,
                'tipo': nuevo_gasto.tipo,
                'detalle': nuevo_gasto.detalle,
                'instructor_id': nuevo_gasto.instructor_id
            }
        }), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@finanzas_bp.route('/gastos/update/<int:id_gasto>', methods=['PUT'])
@jwt_required()
def update_gasto(id_gasto):
    """Actualiza un registro de gasto existente"""
    try:
        gasto = gastos.query.get(id_gasto)
        if not gasto:
            return jsonify({'message': 'Gasto no encontrado'}), 404

        data = request.get_json()

        # Actualizar campos si están presentes en la solicitud
        if 'fecha' in data:
            gasto.fecha = data['fecha']
        if 'concepto' in data:
            gasto.concepto = data['concepto']
        if 'monto' in data:
            gasto.monto = data['monto']
        if 'tipo' in data:
            gasto.tipo = data['tipo']
        if 'detalle' in data:
            gasto.detalle = data['detalle']
        if 'instructor_id' in data:
            gasto.instructor_id = data['instructor_id']

        db.session.commit()

        return jsonify({
            'message': 'Gasto actualizado exitosamente',
            'gasto': {
                'id': gasto.id,
                'fecha': gasto.fecha,
                'concepto': gasto.concepto,
                'monto': gasto.monto,
                'tipo': gasto.tipo,
                'detalle': gasto.detalle,
                'instructor_id': gasto.instructor_id
            }
        }), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@finanzas_bp.route('/gastos/delete/<int:id_gasto>', methods=['DELETE'])
@jwt_required()
def delete_gasto(id_gasto):
    """Elimina un registro de gasto"""
    try:
        gasto = gastos.query.get(id_gasto)
        if not gasto:
            return jsonify({'message': 'Gasto no encontrado'}), 404

        db.session.delete(gasto)
        db.session.commit()

        return jsonify({'message': 'Gasto eliminado exitosamente'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Rutas para ingresos
@finanzas_bp.route('/ingresos/search_all', methods=['GET'])
@jwt_required()
def get_all_ingresos():
    """Obtiene todos los registros de ingresos"""
    try:
        all_ingresos = ingresos.query.all()
        result = []
        for ingreso in all_ingresos:
            ingreso_data = {
                'id': ingreso.id,
                'fecha': ingreso.fecha,
                'concepto': ingreso.concepto,
                'monto': ingreso.monto,
                'tipo': ingreso.tipo,
                'detalle': ingreso.detalle,
                'alumno_id': ingreso.alumno_id
            }
            result.append(ingreso_data)
        return jsonify({'ingresos': result}), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@finanzas_bp.route('/ingresos/search/<int:id_gasto>', methods=['GET'])
@jwt_required()
def get_ingreso(id_gasto):
    """Obtiene un ingreso específico por su ID"""
    try:
        ingreso = ingresos.query.get(id_gasto)
        if not ingreso:
            return jsonify({'message': 'Ingreso no encontrado'}), 404

        ingreso_data = {
            'id': ingreso.id,
            'fecha': ingreso.fecha,
            'concepto': ingreso.concepto,
            'monto': ingreso.monto,
            'tipo': ingreso.tipo,
            'detalle': ingreso.detalle,
            'alumno_id': ingreso.alumno_id
        }
        return jsonify({'ingreso': ingreso_data}), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@finanzas_bp.route('/ingresos/create', methods=['POST'])
@jwt_required()
def create_ingreso():
    """Crea un nuevo registro de ingreso"""
    try:
        data = request.get_json()

        # Validar datos requeridos
        required_fields = ['fecha', 'concepto', 'monto', 'tipo', 'detalle']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'El campo {field} es requerido'}), 400

        nuevo_ingreso = ingresos(
            fecha=data['fecha'],
            concepto=data['concepto'],
            monto=data['monto'],
            tipo=data['tipo'],
            detalle=data['detalle']
        )

        # Asignar alumno_id si está presente
        if 'alumno_id' in data:
            nuevo_ingreso.alumno_id = data['alumno_id']

        db.session.add(nuevo_ingreso)
        db.session.commit()

        return jsonify({
            'message': 'Ingreso creado exitosamente',
            'ingreso': {
                'id': nuevo_ingreso.id,
                'fecha': nuevo_ingreso.fecha,
                'concepto': nuevo_ingreso.concepto,
                'monto': nuevo_ingreso.monto,
                'tipo': nuevo_ingreso.tipo,
                'detalle': nuevo_ingreso.detalle,
                'alumno_id': nuevo_ingreso.alumno_id
            }
        }), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@finanzas_bp.route('/ingresos/update/<int:id_gasto>', methods=['PUT'])
@jwt_required()
def update_ingreso(id_gasto):
    """Actualiza un registro de ingreso existente"""
    try:
        ingreso = ingresos.query.get(id_gasto)
        if not ingreso:
            return jsonify({'message': 'Ingreso no encontrado'}), 404

        data = request.get_json()

        # Actualizar campos si están presentes en la solicitud
        if 'fecha' in data:
            ingreso.fecha = data['fecha']
        if 'concepto' in data:
            ingreso.concepto = data['concepto']
        if 'monto' in data:
            ingreso.monto = data['monto']
        if 'tipo' in data:
            ingreso.tipo = data['tipo']
        if 'detalle' in data:
            ingreso.detalle = data['detalle']
        if 'alumno_id' in data:
            ingreso.alumno_id = data['alumno_id']

        db.session.commit()

        return jsonify({
            'message': 'Ingreso actualizado exitosamente',
            'ingreso': {
                'id': ingreso.id,
                'fecha': ingreso.fecha,
                'concepto': ingreso.concepto,
                'monto': ingreso.monto,
                'tipo': ingreso.tipo,
                'detalle': ingreso.detalle,
                'alumno_id': ingreso.alumno_id
            }
        }), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@finanzas_bp.route('/ingresos/delete/<int:id_gasto>', methods=['DELETE'])
@jwt_required()
def delete_ingreso(id_gasto):
    """Elimina un registro de ingreso"""
    try:
        ingreso = ingresos.query.get(id_gasto)
        if not ingreso:
            return jsonify({'message': 'Ingreso no encontrado'}), 404

        db.session.delete(ingreso)
        db.session.commit()

        return jsonify({'message': 'Ingreso eliminado exitosamente'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@finanzas_bp.route('/balance', methods=['GET'])
@jwt_required()
def get_balance():
    """Obtiene un resumen del balance financiero"""
    try:
        # Obtener todos los ingresos
        all_ingresos = ingresos.query.all()
        total_ingresos = sum(ingreso.monto for ingreso in all_ingresos)
        
        # Obtener todos los gastos
        all_gastos = gastos.query.all()
        total_gastos = sum(gasto.monto for gasto in all_gastos)
        
        # Calcular balance
        balance = total_ingresos - total_gastos
        
        return jsonify({
            'total_ingresos': total_ingresos,
            'total_gastos': total_gastos,
            'balance': balance
        }), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500
