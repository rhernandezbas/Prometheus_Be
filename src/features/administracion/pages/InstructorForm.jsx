import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instructoresService } from '../services/administracion.service.js';

const InstructorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    email: '',
    telefono: '',
    direccion: '',
    fecha_contratacion: '',
    observaciones: ''
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchInstructor = async () => {
        try {
          setLoading(true);
          const response = await instructoresService.getById(id);
          setFormData(response.data);
        } catch (err) {
          console.error('Error al cargar instructor:', err);
          setError('Error al cargar los datos del instructor');
        } finally {
          setLoading(false);
        }
      };

      fetchInstructor();
    }
  }, [id, isEditing]);

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
      setLoading(true);
      setError(null);

      if (isEditing) {
        await instructoresService.update(id, formData);
      } else {
        await instructoresService.create(formData);
      }

      navigate('/administracion/instructores');
    } catch (err) {
      console.error('Error al guardar instructor:', err);
      setError('Error al guardar los datos del instructor');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Cargando datos del instructor...</div>;
  }

  return (
    <div className="instructor-form">
      <div className="page-header">
        <h1>{isEditing ? 'Editar Instructor' : 'Nuevo Instructor'}</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Información Personal</h2>
          <div className="form-row">
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
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Información Profesional</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="especialidad">Especialidad</label>
              <input
                type="text"
                id="especialidad"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="fecha_contratacion">Fecha de Contratación</label>
              <input
                type="date"
                id="fecha_contratacion"
                name="fecha_contratacion"
                value={formData.fecha_contratacion}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="observaciones">Observaciones</label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
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
            onClick={() => navigate('/administracion/instructores')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstructorForm;
