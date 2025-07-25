import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { instructoresService } from '../services/administracion.service.js';

const InstructoresLista = () => {
  const [instructores, setInstructores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstructores();
  }, []);

  const fetchInstructores = async (params = {}) => {
    try {
      setLoading(true);
      const response = await instructoresService.getAll(params);
      setInstructores(response.data);
    } catch (err) {
      console.error('Error al cargar instructores:', err);
      setError('Error al cargar la lista de instructores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (searchTerm.trim()) {
        const response = await instructoresService.search({ query: searchTerm });
        setInstructores(response.data);
      } else {
        fetchInstructores();
      }
    } catch (err) {
      console.error('Error al buscar instructores:', err);
      setError('Error al buscar instructores');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este instructor?')) {
      try {
        await instructoresService.delete(id);
        fetchInstructores();
      } catch (err) {
        console.error('Error al eliminar instructor:', err);
        setError('Error al eliminar el instructor');
      }
    }
  };

  if (loading && instructores.length === 0) {
    return <div className="loading">Cargando instructores...</div>;
  }

  // Si no hay datos reales, usar datos de muestra
  const instructoresMuestra = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', especialidad: 'Matemáticas', email: 'juan.perez@ejemplo.com', telefono: '123-456-7890' },
    { id: 2, nombre: 'María', apellido: 'González', especialidad: 'Ciencias', email: 'maria.gonzalez@ejemplo.com', telefono: '098-765-4321' },
    { id: 3, nombre: 'Carlos', apellido: 'Rodríguez', especialidad: 'Historia', email: 'carlos.rodriguez@ejemplo.com', telefono: '555-123-4567' }
  ];

  const displayInstructores = instructores.length > 0 ? instructores : instructoresMuestra;

  return (
    <div className="instructores-container">
      <div className="page-header">
        <h1>Instructores</h1>
        <Link to="/administracion/instructores/nuevo" className="btn btn-primary">
          Nuevo Instructor
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="input-group-append">
              <button type="submit" className="btn btn-primary">
                Buscar
              </button>
              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    fetchInstructores();
                  }}
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {displayInstructores.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron instructores.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Especialidad</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {displayInstructores.map((instructor) => (
                <tr key={instructor.id}>
                  <td>{instructor.id}</td>
                  <td>{instructor.nombre}</td>
                  <td>{instructor.apellido}</td>
                  <td>{instructor.especialidad}</td>
                  <td>{instructor.email}</td>
                  <td>{instructor.telefono}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        onClick={() => navigate(`/administracion/instructores/${instructor.id}`)}
                        className="btn btn-info btn-sm"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => navigate(`/administracion/instructores/editar/${instructor.id}`)}
                        className="btn btn-warning btn-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(instructor.id)}
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
    </div>
  );
};

export default InstructoresLista;
