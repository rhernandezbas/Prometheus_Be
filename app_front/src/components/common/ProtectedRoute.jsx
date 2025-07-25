import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se requieren roles específicos y el usuario no tiene ninguno de ellos
  if (requiredRoles.length > 0 && (!user.role || !requiredRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado y tiene los roles necesarios, mostrar el componente hijo
  return children;
};

export default ProtectedRoute;
