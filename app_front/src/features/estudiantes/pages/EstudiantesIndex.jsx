import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { estudiantesService } from '../services/estudiantes.service';

// Componente para mostrar mensajes de notificación
const AlertMessage = ({ type, message, onClose }) => {
  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-message">{message}</span>
      <button className="alert-close" onClick={onClose}>×</button>
    </div>
  );
};

const EstudiantesIndex = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const { nivel, subnivel } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verificar si hay un mensaje de notificación en el estado de navegación
    if (location.state && location.state.showMessage) {
      setNotification({
        type: location.state.messageType,
        message: location.state.messageText
      });
      
      // Limpiar el estado de navegación para evitar que el mensaje aparezca después de recargar
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        setLoading(true);
        let response;

        if (nivel && subnivel) {
          response = await estudiantesService.getEstudiantesBySubnivel(nivel, subnivel);
        } else if (nivel) {
          response = await estudiantesService.getByNivel(nivel);
        } else {
          response = await estudiantesService.getAll();
        }

        // Debug: Log the response to see its structure
        console.log('API Response:', response);

        // Check if response.data.alumnos exists and is an array
        if (response.data && response.data.alumnos && Array.isArray(response.data.alumnos)) {
          setEstudiantes(response.data.alumnos);
        } else {
          console.error('La respuesta de la API no contiene un array de alumnos:', response);
          setEstudiantes([]);
          setError('La estructura de datos recibida no es válida');
        }
      } catch (err) {
        console.error('Error al cargar estudiantes:', err);
        setError('Error al cargar la lista de estudiantes');
        setEstudiantes([]); // Ensure estudiantes is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiantes();
  }, [nivel, subnivel]);

  const closeNotification = () => {
    setNotification(null);
  };

  if (loading) {
    return <div className="loading">Cargando estudiantes...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="estudiantes-container">
      <div className="page-header">
        <h1>
          {nivel 
            ? `Estudiantes - Nivel ${nivel}${subnivel ? ` - Subnivel ${subnivel}` : ''}` 
            : 'Todos los Estudiantes'}
        </h1>
        <Link to="/estudiantes/nuevo" className="btn btn-primary">
          Nuevo Estudiante
        </Link>
      </div>

      {notification && (
        <AlertMessage 
          type={notification.type} 
          message={notification.message} 
          onClose={closeNotification} 
        />
      )}

      {estudiantes.length === 0 ? (
        <p>No hay estudiantes registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Nivel</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((estudiante) => (
                <tr key={estudiante.id}>
                  <td>{estudiante.id}</td>
                  <td>{estudiante.name}</td>
                  <td>{estudiante.lastname}</td>
                  <td>{estudiante.nivel}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        onClick={() => navigate(`/estudiantes/${estudiante.id}`)}
                        className="btn btn-info btn-sm"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => navigate(`/estudiantes/editar/${estudiante.id}`)}
                        className="btn btn-warning btn-sm"
                      >
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EstudiantesIndex;
