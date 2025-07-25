import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../pages/Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Bienvenido al Sistema Educativo</h1>
        {user && (
          <p className="welcome-message">
            Hola, <strong>{user.nombre || user.username}</strong>. Bienvenido de nuevo.
          </p>
        )}
      </div>

      <div className="modules-grid">
        <div className="module-card">
          <div className="module-icon student-icon">
            <span>👨‍🎓</span>
          </div>
          <div className="module-content">
            <h2>Estudiantes</h2>
            <p>Gestione la información de estudiantes, evaluaciones y niveles académicos.</p>
            <Link to="/estudiantes" className="module-button">
              Ir a Estudiantes
            </Link>
          </div>
        </div>

        <div className="module-card">
          <div className="module-icon admin-icon">
            <span>⚙️</span>
          </div>
          <div className="module-content">
            <h2>Administración</h2>
            <p>Acceda a las herramientas administrativas, configuración y gestión de instructores.</p>
            <Link to="/administracion" className="module-button">
              Ir a Administración
            </Link>
          </div>
        </div>

        <div className="module-card">
          <div className="module-icon finance-icon">
            <span>💰</span>
          </div>
          <div className="module-content">
            <h2>Finanzas</h2>
            <p>Controle los ingresos, gastos y genere reportes financieros.</p>
            <div className="chart-preview">
              <div className="chart-bar" style={{ height: '30px' }}></div>
              <div className="chart-bar" style={{ height: '50px' }}></div>
              <div className="chart-bar" style={{ height: '70px' }}></div>
            </div>
            <Link to="/finanzas" className="module-button">
              Ir a Finanzas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
