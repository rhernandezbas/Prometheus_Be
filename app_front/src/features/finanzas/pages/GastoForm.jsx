import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { finanzasService } from '../services/finanzas.service';

const GastoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    concepto: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo: '',
    detalle: ''
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchGasto = async () => {
        try {
          setLoading(true);
          const response = await finanzasService.getGastos({ id });
          // Asumimos que la API devuelve un array y tomamos el primer elemento
          const gasto = Array.isArray(response.data) ? response.data[0] : response.data;
          setFormData(gasto);
        } catch (err) {
          console.error('Error al cargar gasto:', err);
          setError('Error al cargar los datos del gasto');
        } finally {
          setLoading(false);
        }
      };

      fetchGasto();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'monto' ? parseFloat(value) || value : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        await finanzasService.updateGasto(id, formData);
        navigate('/finanzas/gastos');
      } else {
        await finanzasService.createGasto(formData);
        setShowSuccessModal(true);
        // Reset form after successful creation
        setFormData({
          concepto: '',
          monto: '',
          fecha: new Date().toISOString().split('T')[0],
          tipo: '',
          detalle: ''
        });
      }
    } catch (err) {
      console.error('Error al guardar gasto:', err);
      setError('Error al guardar los datos del gasto');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    // Optional: navigate to the gastos list after closing the modal
    // navigate('/finanzas/gastos');
  };

  if (loading && isEditing) {
    return <div className="loading">Cargando datos del gasto...</div>;
  }

  return (
    <div className="gasto-form">
      {showSuccessModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal-content success-modal" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', position: 'relative' }}>
            <button className="close-button" onClick={closeModal} style={{ 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '50%', 
              width: '30px', 
              height: '30px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              position: 'absolute',
              top: '-15px',
              right: '-15px'
            }}>×</button>
            <div className="modal-header">
              <h2>¡Éxito!</h2>
            </div>
            <div className="modal-body">
              <p>El gasto ha sido registrado correctamente.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={closeModal}>Aceptar</button>
              <button className="btn btn-secondary" onClick={() => navigate('/finanzas/gastos')}>
                Ver Lista de Gastos
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1>{isEditing ? 'Editar Gasto' : 'Nuevo Gasto'}</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="concepto">Concepto</label>
              <input
                type="text"
                id="concepto"
                name="concepto"
                value={formData.concepto}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="monto">Monto</label>
              <input
                type="number"
                id="monto"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="tipo">Categoría</label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="">Seleccione una categoría</option>
                <option value="Personal">Personal</option>
                <option value="Material">Material</option>
                <option value="Servicios">Servicios</option>
                <option value="Instalaciones">Instalaciones</option>
                <option value="Equipamiento">Equipamiento</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="detalle">Descripción</label>
            <textarea
              id="detalle"
              name="detalle"
              value={formData.detalle || ''}
              onChange={handleChange}
              rows="4"
              className="form-control"
            ></textarea>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/finanzas/gastos')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default GastoForm;
