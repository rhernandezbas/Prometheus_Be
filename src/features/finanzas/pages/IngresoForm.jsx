import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { finanzasService } from '../services/finanzas.service.js';

const IngresoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    concepto: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    categoria: '',
    descripcion: ''
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchIngreso = async () => {
        try {
          setLoading(true);
          const response = await finanzasService.getIngresos({ id });
          // Asumimos que la API devuelve un array y tomamos el primer elemento
          const ingreso = Array.isArray(response.data) ? response.data[0] : response.data;
          setFormData(ingreso);
        } catch (err) {
          console.error('Error al cargar ingreso:', err);
          setError('Error al cargar los datos del ingreso');
        } finally {
          setLoading(false);
        }
      };

      fetchIngreso();
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
        await finanzasService.updateIngreso(id, formData);
      } else {
        await finanzasService.createIngreso(formData);
      }

      navigate('/finanzas/ingresos');
    } catch (err) {
      console.error('Error al guardar ingreso:', err);
      setError('Error al guardar los datos del ingreso');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Cargando datos del ingreso...</div>;
  }

  return (
    <div className="ingreso-form">
      <div className="page-header">
        <h1>{isEditing ? 'Editar Ingreso' : 'Nuevo Ingreso'}</h1>
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
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="">Seleccione una categoría</option>
                <option value="Inscripción">Inscripción</option>
                <option value="Mensualidad">Mensualidad</option>
                <option value="Curso">Curso</option>
                <option value="Material">Material</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion || ''}
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
            onClick={() => navigate('/finanzas/ingresos')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default IngresoForm;
