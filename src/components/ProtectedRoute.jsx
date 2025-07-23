import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { authService } from '../services/auth';
import { CircularProgress, Box } from '@mui/material';

/**
 * Componente para proteger rutas que requieren autenticación.
 * Redirige a la página de login si el usuario no está autenticado.
 * Incluye validación de token en cada renderizado para asegurar consistencia.
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading, refreshToken } = useAuth();
  const [validatingToken, setValidatingToken] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  
  // Validar token cada vez que se carga una ruta protegida
  useEffect(() => {
    const validateToken = async () => {
      if (isAuthenticated) {
        setValidatingToken(true);
        try {
          // Verificar si el token actual es válido
          const token = authService.getToken();
          if (!token) {
            setTokenValid(false);
            return;
          }
          
          // Intentar hacer una petición para validar el token
          const profileResult = await authService.getProfile();
          if (!profileResult.success) {
            // Si falla, intentar refrescar el token
            console.log('Token inválido en ruta protegida, intentando refrescar...');
            const refreshResult = await authService.refreshToken();
            if (!refreshResult.success) {
              setTokenValid(false);
            }
          }
        } catch (error) {
          console.error('Error al validar token en ruta protegida:', error);
          setTokenValid(false);
        } finally {
          setValidatingToken(false);
        }
      }
    };
    
    validateToken();
  }, [location.pathname, isAuthenticated]);
  
  // Mostrar indicador de carga mientras se valida el token o se carga la autenticación
  if (loading || validatingToken) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Si el token no es válido o el usuario no está autenticado, redirigir al login
  if (!isAuthenticated || !tokenValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;
