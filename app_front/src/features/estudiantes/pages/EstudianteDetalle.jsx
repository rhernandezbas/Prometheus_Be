import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { estudiantesService } from '../services/estudiantes.service';
import './EstudianteDetalle.css';

// Componente de Modal de Confirmación
const ConfirmModal = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content confirm-modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>
        <div className="modal-body">
          <div className="warning-icon">⚠️</div>
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};

const EstudianteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchEstudiante = async () => {
      try {
        setLoading(true);
        const response = await estudiantesService.getById(id);
        console.log('API Response for student detail:', response);
        console.log('Student data structure:', response.data);
        
        // Check if the data is nested in another property
        if (response.data && response.data.alumno) {
          console.log('Found nested student data in alumno property:', response.data.alumno);
          setEstudiante(response.data.alumno);
        } else if (response.data && response.data.estudiante) {
          console.log('Found nested student data in estudiante property:', response.data.estudiante);
          setEstudiante(response.data.estudiante);
        } else {
          console.log('Using direct response data:', response.data);
          setEstudiante(response.data);
        }
      } catch (err) {
        console.error('Error al cargar datos del estudiante:', err);
        setError('Error al cargar los datos del estudiante');
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiante();
  }, [id]);

  const handleEliminarClick = () => {
    setShowConfirmModal(true);
  };

  const handleEliminarConfirm = async () => {
    try {
      await estudiantesService.delete(id);
      setShowConfirmModal(false);
      // Pasar un parámetro de estado al redirigir
      navigate('/estudiantes', { 
        state: { 
          showMessage: true, 
          messageType: 'success', 
          messageText: `El estudiante ${estudiante.name} ${estudiante.lastname} ha sido eliminado exitosamente` 
        } 
      });
    } catch (err) {
      console.error('Error al eliminar estudiante:', err);
      setError('Error al eliminar el estudiante');
    }
  };

  const handleEliminarCancel = () => {
    setShowConfirmModal(false);
  };

  if (loading) {
    return <div className="loading">Cargando datos del estudiante...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!estudiante) {
    return <div className="not-found">Estudiante no encontrado</div>;
  }

  // Debug the actual estudiante object being used for rendering
  console.log('Estudiante object used for rendering:', estudiante);
  console.log('Name value:', estudiante.name);
  console.log('Lastname value:', estudiante.lastname);

  return (
    <div className="estudiante-detalle">
      <div className="page-header">
        <h1>Detalle del Estudiante</h1>
        <div className="actions">
          <Link to={`/estudiantes/editar/${id}`} className="btn btn-warning">
            Editar
          </Link>
          <button onClick={handleEliminarClick} className="btn btn-danger">
            Eliminar
          </button>
          <Link to={`/estudiantes/${id}/evaluaciones`} className="btn btn-info">
            Ver Evaluaciones
          </Link>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        show={showConfirmModal}
        title="Confirmar Eliminación"
        message={`¿Está seguro que desea eliminar al estudiante ${estudiante.name} ${estudiante.lastname}?`}
        onConfirm={handleEliminarConfirm}
        onCancel={handleEliminarCancel}
      />

      <div className="card">
        <div className="card-body">
          <h2>{estudiante.name} {estudiante.lastname}</h2>
          
          <div className="info-section">
            <h3>Información Personal</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">ID:</span>
                <span className="value">{estudiante.id}</span>
              </div>
              <div className="info-item">
                <span className="label">DNI:</span>
                <span className="value">{estudiante.dni}</span>
              </div>
              <div className="info-item">
                <span className="label">Fecha de Nacimiento:</span>
                <span className="value">{estudiante.dateOfBirth}</span>
              </div>
              <div className="info-item">
                <span className="label">Género:</span>
                <span className="value">{estudiante.gender}</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{estudiante.mail}</span>
              </div>
              <div className="info-item">
                <span className="label">Teléfono:</span>
                <span className="value">{estudiante.telephone}</span>
              </div>
              <div className="info-item">
                <span className="label">Dirección:</span>
                <span className="value">{estudiante.address}</span>
              </div>
            </div>
          </div>
          
          <div className="info-section">
            <h3>Información Académica</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Nivel:</span>
                <span className="value">{estudiante.nivel}</span>
              </div>
              <div className="info-item">
                <span className="label">Subnivel:</span>
                <span className="value">{estudiante.subnivel_id}</span>
              </div>
              <div className="info-item">
                <span className="label">Fecha de Ingreso:</span>
                <span className="value">{estudiante.dateOfEntry}</span>
              </div>
            </div>
          </div>
          
          {estudiante.comments && (
            <div className="info-section">
              <h3>Observaciones</h3>
              <p>{estudiante.comments}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="navigation-links">
        <Link to="/estudiantes" className="btn btn-secondary">
          Volver a la lista
        </Link>
      </div>
    </div>
  );
};

export default EstudianteDetalle;
