import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { instructoresService } from '../services/administracion.service';

const InstructorDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        setLoading(true);
        const response = await instructoresService.getById(id);
        setInstructor(response.data);
      } catch (err) {
        console.error('Error al cargar datos del instructor:', err);
        setError('Error al cargar los datos del instructor');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [id]);

  const handleEliminar = async () => {
    if (window.confirm('¿Está seguro que desea eliminar este instructor?')) {
      try {
        await instructoresService.delete(id);
        navigate('/administracion/instructores');
      } catch (err) {
        console.error('Error al eliminar instructor:', err);
        setError('Error al eliminar el instructor');
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando datos del instructor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!instructor) {
    return <div className="not-found">Instructor no encontrado</div>;
  }

  // Si no hay datos reales, usar datos de muestra
  const instructorData = instructor || {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    especialidad: 'Matemáticas',
    email: 'juan.perez@ejemplo.com',
    telefono: '123-456-7890',
    direccion: 'Calle Principal 123',
    fecha_contratacion: '2022-01-15',
    observaciones: 'Instructor con amplia experiencia en educación matemática.'
  };

  return (
    <div className="instructor-detalle">
      <div className="page-header">
        <h1>Detalle del Instructor</h1>
        <div className="actions">
          <Link to={`/administracion/instructores/editar/${id}`} className="btn btn-warning">
            Editar
          </Link>
          <button onClick={handleEliminar} className="btn btn-danger">
            Eliminar
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2>{instructorData.nombre} {instructorData.apellido}</h2>
          
          <div className="info-section">
            <h3>Información Personal</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">ID:</span>
                <span className="value">{instructorData.id}</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{instructorData.email}</span>
              </div>
              <div className="info-item">
                <span className="label">Teléfono:</span>
                <span className="value">{instructorData.telefono}</span>
              </div>
              <div className="info-item">
                <span className="label">Dirección:</span>
                <span className="value">{instructorData.direccion}</span>
              </div>
            </div>
          </div>
          
          <div className="info-section">
            <h3>Información Profesional</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Especialidad:</span>
                <span className="value">{instructorData.especialidad}</span>
              </div>
              <div className="info-item">
                <span className="label">Fecha de Contratación:</span>
                <span className="value">{instructorData.fecha_contratacion}</span>
              </div>
            </div>
          </div>
          
          {instructorData.observaciones && (
            <div className="info-section">
              <h3>Observaciones</h3>
              <p>{instructorData.observaciones}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="navigation-links">
        <Link to="/administracion/instructores" className="btn btn-secondary">
          Volver a la lista
        </Link>
      </div>
    </div>
  );
};

export default InstructorDetalle;
