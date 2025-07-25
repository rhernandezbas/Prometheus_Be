import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { estudiantesService, evaluacionesService } from '../services/estudiantes.service.js';

const EvaluacionesEstudiante = () => {
  const { id } = useParams();
  const [estudiante, setEstudiante] = useState(null);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Cargar datos del estudiante
        const estudianteResponse = await estudiantesService.getById(id);
        setEstudiante(estudianteResponse.data);
        
        // Cargar evaluaciones del estudiante
        const evaluacionesResponse = await evaluacionesService.getByEstudiante(id);
        setEvaluaciones(evaluacionesResponse.data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar las evaluaciones del estudiante');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="loading">Cargando evaluaciones...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!estudiante) {
    return <div className="not-found">Estudiante no encontrado</div>;
  }

  return (
    <div className="evaluaciones-estudiante">
      <div className="page-header">
        <h1>Evaluaciones de {estudiante.nombre} {estudiante.apellido}</h1>
        <button className="btn btn-primary">
          Nueva Evaluación
        </button>
      </div>

      {evaluaciones.length === 0 ? (
        <div className="empty-state">
          <p>No hay evaluaciones registradas para este estudiante.</p>
        </div>
      ) : (
        <div className="evaluaciones-list">
          {evaluaciones.map((evaluacion) => (
            <div key={evaluacion.id} className="evaluacion-card">
              <div className="evaluacion-header">
                <h3>{evaluacion.nombre || `Evaluación ${evaluacion.id}`}</h3>
                <span className="fecha">{evaluacion.fecha}</span>
              </div>
              <div className="evaluacion-body">
                <div className="calificacion">
                  <span className="label">Calificación:</span>
                  <span className="value">{evaluacion.calificacion}</span>
                </div>
                {evaluacion.observaciones && (
                  <div className="observaciones">
                    <span className="label">Observaciones:</span>
                    <p>{evaluacion.observaciones}</p>
                  </div>
                )}
              </div>
              <div className="evaluacion-footer">
                <button className="btn btn-sm btn-warning">Editar</button>
                <button className="btn btn-sm btn-danger">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="navigation-links">
        <Link to={`/estudiantes/${id}`} className="btn btn-secondary">
          Volver al detalle del estudiante
        </Link>
      </div>
    </div>
  );
};

export default EvaluacionesEstudiante;
