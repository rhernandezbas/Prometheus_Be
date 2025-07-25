import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { estudiantesService } from '../services/estudiantes.service';
import './EstudianteForm.css';

// Error Modal Component
const ErrorModal = ({ show, message, onClose }) => {
  if (!show) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content error-modal">
        <div className="modal-header">
          <h2>Error</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>Aceptar</button>
        </div>
      </div>
    </div>
  );
};

// Success Modal Component
const SuccessModal = ({ show, message, onClose }) => {
  if (!show) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content success-modal">
        <div className="modal-header">
          <h2>¡Éxito!</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="success-icon">✓</div>
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-success" onClick={onClose}>Aceptar</button>
        </div>
      </div>
    </div>
  );
};

const EstudianteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    dni: '',
    dateOfBirth: '',
    gender: '',
    mail: '',
    telephone: '',
    address: '',
    nivel: '',
    subnivel_id: '',
    dateOfEntry: '',
    comments: ''
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchEstudiante = async () => {
        try {
          setLoading(true);
          const response = await estudiantesService.getById(id);
          console.log('API Response for student edit:', response);
          console.log('Student data structure:', response.data);
          
          // Check if the data is nested in another property
          if (response.data && response.data.alumno) {
            console.log('Found nested student data in alumno property:', response.data.alumno);
            setFormData(response.data.alumno);
          } else if (response.data && response.data.estudiante) {
            console.log('Found nested student data in estudiante property:', response.data.estudiante);
            setFormData(response.data.estudiante);
          } else {
            console.log('Using direct response data:', response.data);
            setFormData(response.data);
          }
        } catch (err) {
          console.error('Error al cargar estudiante:', err);
          setError('Error al cargar los datos del estudiante');
          setShowErrorModal(true);
        } finally {
          setLoading(false);
        }
      };

      fetchEstudiante();
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
        await estudiantesService.update(id, formData);
        setSuccessMessage('Estudiante actualizado con éxito');
      } else {
        await estudiantesService.create(formData);
        setSuccessMessage('Estudiante creado con éxito');
      }

      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error al guardar estudiante:', err);
      setError('Error al guardar los datos del estudiante');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Cargando datos del estudiante...</div>;
  }

  return (
    <div className="estudiante-form">
      <div className="page-header">
        <h1>{isEditing ? 'Editar Estudiante' : 'Nuevo Estudiante'}</h1>
      </div>

      {/* Error Modal */}
      <ErrorModal 
        show={showErrorModal} 
        message={error || 'Ha ocurrido un error inesperado.'} 
        onClose={() => setShowErrorModal(false)} 
      />

      {/* Success Modal */}
      <SuccessModal 
        show={showSuccessModal} 
        message={successMessage} 
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/estudiantes');
        }} 
      />

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Información Personal</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Apellido</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dni">DNI</label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Fecha de Nacimiento</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Género</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Seleccione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mail">Email</label>
              <input
                type="email"
                id="mail"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="telephone">Teléfono</label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address">Dirección</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Información Académica</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nivel">Nivel</label>
              <select
                id="nivel"
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="">Seleccione...</option>
                <option value="Basico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="subnivel_id">Subnivel</label>
              <select
                id="subnivel_id"
                name="subnivel_id"
                value={formData.subnivel_id}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Seleccione...</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfEntry">Fecha de Ingreso</label>
              <input
                type="date"
                id="dateOfEntry"
                name="dateOfEntry"
                value={formData.dateOfEntry}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="comments">Observaciones</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
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
            onClick={() => navigate('/estudiantes')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EstudianteForm;
