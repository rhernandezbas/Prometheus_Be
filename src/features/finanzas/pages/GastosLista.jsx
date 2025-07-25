import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { finanzasService } from '../services/finanzas.service.js';
import './GastoForm.css'; // Reuse the modal styles

const GastosLista = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gastoToDelete, setGastoToDelete] = useState(null);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    categoria: '',
    busqueda: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchGastos();
  }, []);

  const fetchGastos = async (params = {}) => {
    try {
      setLoading(true);
      const response = await finanzasService.getGastos(params);
      // Ensure gastos is always an array
      if (response.data && Array.isArray(response.data)) {
        setGastos(response.data);
      } else if (response.data) {
        console.warn('API returned non-array data for gastos:', response.data);
        // If response.data exists but is not an array, check if it contains gastos property
        if (response.data.gastos && Array.isArray(response.data.gastos)) {
          setGastos(response.data.gastos);
        } else {
          // Set empty array as fallback
          setGastos([]);
        }
      } else {
        // Handle null or undefined response
        console.warn('API returned null or undefined data for gastos');
        setGastos([]);
      }
    } catch (err) {
      console.error('Error al cargar gastos:', err);
      setError('Error al cargar la lista de gastos');
      setGastos([]); // Ensure gastos is reset to an array on error
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFiltrar = (e) => {
    e.preventDefault();
    fetchGastos(filtros);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      categoria: '',
      busqueda: ''
    });
    fetchGastos();
  };

  const handleEliminarClick = (gasto) => {
    setGastoToDelete(gasto);
    setShowDeleteModal(true);
  };

  const handleEliminar = async () => {
    try {
      await finanzasService.deleteGasto(gastoToDelete.id);
      setShowDeleteModal(false);
      setGastoToDelete(null);
      fetchGastos();
    } catch (err) {
      console.error('Error al eliminar gasto:', err);
      setError('Error al eliminar el gasto');
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setGastoToDelete(null);
  };

  if (loading && gastos.length === 0) {
    return <div className="loading">Cargando gastos...</div>;
  }

  return (
    <div className="gastos-container">
      {showDeleteModal && gastoToDelete && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', position: 'relative', borderTop: '5px solid #dc3545' }}>
            <button className="close-button" onClick={closeDeleteModal} style={{ 
              backgroundColor: '#dc3545', 
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
              <h2 style={{ color: '#dc3545' }}>Confirmar Eliminación</h2>
            </div>
            <div className="modal-body" style={{ padding: '1.75rem', fontSize: '1.1rem', textAlign: 'center' }}>
              <p>¿Está seguro que desea eliminar este gasto?</p>
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                <p><strong>Concepto:</strong> {gastoToDelete.concepto}</p>
                <p><strong>Monto:</strong> ${gastoToDelete.monto}</p>
                <p><strong>Fecha:</strong> {gastoToDelete.fecha}</p>
              </div>
              <p style={{ marginTop: '15px', color: '#dc3545' }}>Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '1.25rem', borderTop: '1px solid #e9ecef' }}>
              <button 
                className="btn btn-secondary" 
                onClick={closeDeleteModal}
                style={{ minWidth: '120px', padding: '10px 20px' }}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleEliminar}
                style={{ minWidth: '120px', padding: '10px 20px' }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1>Registro de Gastos</h1>
        <Link to="/finanzas/gastos/nuevo" className="btn btn-primary">
          Nuevo Gasto
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="filtros-panel">
        <h2>Filtros</h2>
        <form onSubmit={handleFiltrar}>
          <div className="filtros-grid">
            <div className="form-group">
              <label htmlFor="fechaInicio">Fecha Inicio</label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={filtros.fechaInicio}
                onChange={handleFiltroChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="fechaFin">Fecha Fin</label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={filtros.fechaFin}
                onChange={handleFiltroChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                name="categoria"
                value={filtros.categoria}
                onChange={handleFiltroChange}
                className="form-control"
              >
                <option value="">Todas</option>
                <option value="Personal">Personal</option>
                <option value="Material">Material</option>
                <option value="Servicios">Servicios</option>
                <option value="Instalaciones">Instalaciones</option>
                <option value="Equipamiento">Equipamiento</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="busqueda">Búsqueda</label>
              <input
                type="text"
                id="busqueda"
                name="busqueda"
                value={filtros.busqueda}
                onChange={handleFiltroChange}
                placeholder="Buscar por concepto..."
                className="form-control"
              />
            </div>
          </div>
          <div className="filtros-actions">
            <button type="submit" className="btn btn-primary">
              Filtrar
            </button>
            <button
              type="button"
              onClick={handleLimpiarFiltros}
              className="btn btn-secondary"
            >
              Limpiar Filtros
            </button>
          </div>
        </form>
      </div>

      {gastos.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron gastos con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((gasto) => (
                <tr key={gasto.id}>
                  <td>{gasto.id}</td>
                  <td>{gasto.concepto}</td>
                  <td>${gasto.monto}</td>
                  <td>{gasto.fecha}</td>
                  <td>{gasto.categoria}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        onClick={() => navigate(`/finanzas/gastos/editar/${gasto.id}`)}
                        className="btn btn-warning btn-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminarClick(gasto)}
                        className="btn btn-danger btn-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="summary-section">
        <div className="total-card">
          <span className="label">Total Gastos:</span>
          <span className="value">
            ${gastos.reduce((total, gasto) => total + Number(gasto.monto), 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GastosLista;
