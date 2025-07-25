import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { administracionService } from '../services/administracion.service';

const AdministracionIndex = () => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        setLoading(true);
        const response = await administracionService.getResumen();
        setResumen(response.data);
      } catch (err) {
        console.error('Error al cargar resumen de administración:', err);
        setError('Error al cargar el resumen de administración');
      } finally {
        setLoading(false);
      }
    };

    fetchResumen();
  }, []);

  if (loading) {
    return <div className="loading">Cargando datos de administración...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Si no hay datos reales, usar datos de muestra
  const resumenData = resumen || {
    totalEstudiantes: 120,
    totalInstructores: 8,
    totalIngresos: 15000,
    totalGastos: 10000,
    balance: 5000,
    estudiantesPorNivel: {
      Basico: 45,
      Intermedio: 50,
      Avanzado: 25
    }
  };

  return (
    <div className="administracion-container">
      <div className="page-header">
        <h1>Panel de Administración</h1>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Estudiantes</h2>
          </div>
          <div className="card-body">
            <div className="stat-value">{resumenData.totalEstudiantes}</div>
            <div className="stat-label">Total de estudiantes</div>
          </div>
          <div className="card-footer">
            <Link to="/estudiantes" className="btn btn-primary">
              Ver Estudiantes
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Instructores</h2>
          </div>
          <div className="card-body">
            <div className="stat-value">{resumenData.totalInstructores}</div>
            <div className="stat-label">Total de instructores</div>
          </div>
          <div className="card-footer">
            <Link to="/administracion/instructores" className="btn btn-primary">
              Ver Instructores
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Finanzas</h2>
          </div>
          <div className="card-body">
            <div className="stat-row">
              <div className="stat-label">Ingresos:</div>
              <div className="stat-value">${resumenData.totalIngresos}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Gastos:</div>
              <div className="stat-value">${resumenData.totalGastos}</div>
            </div>
            <div className="stat-row total">
              <div className="stat-label">Balance:</div>
              <div className="stat-value">${resumenData.balance}</div>
            </div>
          </div>
          <div className="card-footer">
            <Link to="/finanzas" className="btn btn-primary">
              Ver Finanzas
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Configuración</h2>
          </div>
          <div className="card-body">
            <p>Administre la configuración del sistema, criterios de evaluación y otros parámetros.</p>
          </div>
          <div className="card-footer">
            <Link to="/administracion/configuracion" className="btn btn-primary">
              Ir a Configuración
            </Link>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Distribución de Estudiantes por Nivel</h2>
        <div className="chart-container">
          {/* Aquí se podría integrar una librería de gráficos como Chart.js */}
          <div className="bar-chart-placeholder">
            {Object.entries(resumenData.estudiantesPorNivel).map(([nivel, cantidad]) => (
              <div key={nivel} className="chart-bar">
                <div className="bar-label">{nivel}</div>
                <div 
                  className="bar" 
                  style={{ 
                    height: `${(cantidad / resumenData.totalEstudiantes) * 100}%`,
                    backgroundColor: nivel === 'Basico' ? '#3498db' : nivel === 'Intermedio' ? '#2ecc71' : '#e74c3c'
                  }}
                ></div>
                <div className="bar-value">{cantidad}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministracionIndex;
