import React, { useState, useEffect } from 'react';
import { configuracionService } from '../services/administracion.service.js';

const ConfiguracionPanel = () => {
  const [criterios, setCriterios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    valor: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCriterios();
  }, []);

  const fetchCriterios = async () => {
    try {
      setLoading(true);
      const response = await configuracionService.getCriterios();
      setCriterios(response.data);
    } catch (err) {
      console.error('Error al cargar criterios:', err);
      setError('Error al cargar la configuración de criterios');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await configuracionService.updateCriterio(formData.id, formData);
      } else {
        await configuracionService.createCriterio(formData);
      }
      resetForm();
      fetchCriterios();
    } catch (err) {
      console.error('Error al guardar criterio:', err);
      setError('Error al guardar el criterio');
    }
  };

  const handleEdit = (criterio) => {
    setFormData({
      id: criterio.id,
      nombre: criterio.nombre,
      descripcion: criterio.descripcion,
      valor: criterio.valor
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este criterio?')) {
      try {
        await configuracionService.deleteCriterio(id);
        fetchCriterios();
      } catch (err) {
        console.error('Error al eliminar criterio:', err);
        setError('Error al eliminar el criterio');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      nombre: '',
      descripcion: '',
      valor: ''
    });
    setIsEditing(false);
  };

  if (loading && criterios.length === 0) {
    return <div className="loading">Cargando configuración...</div>;
  }

  // Si no hay datos reales, usar datos de muestra
  const criteriosMuestra = [
    { id: 1, nombre: 'Puntaje Mínimo', descripcion: 'Puntaje mínimo para aprobar', valor: '60' },
    { id: 2, nombre: 'Asistencia Mínima', descripcion: 'Porcentaje mínimo de asistencia', valor: '80' },
    { id: 3, nombre: 'Escala de Calificación', descripcion: 'Escala utilizada para calificaciones', valor: '1-100' }
  ];

  const displayCriterios = criterios.length > 0 ? criterios : criteriosMuestra;

  return (
    <div className="configuracion-container">
      <div className="page-header">
        <h1>Panel de Configuración</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="configuracion-grid">
        <div className="configuracion-form-card">
          <h2>{isEditing ? 'Editar Criterio' : 'Nuevo Criterio'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="form-control"
                rows="3"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="valor">Valor</label>
              <input
                type="text"
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Actualizar' : 'Guardar'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="configuracion-list-card">
          <h2>Criterios Configurados</h2>
          {displayCriterios.length === 0 ? (
            <p>No hay criterios configurados.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Valor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayCriterios.map((criterio) => (
                  <tr key={criterio.id}>
                    <td>{criterio.nombre}</td>
                    <td>{criterio.descripcion}</td>
                    <td>{criterio.valor}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          onClick={() => handleEdit(criterio)}
                          className="btn btn-sm btn-warning"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(criterio.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionPanel;
