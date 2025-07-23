import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/auth';

// Crear el contexto de autenticación
const AuthContext = createContext(null);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inicializar el estado de autenticación al cargar el componente
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const token = authService.getToken();
        const currentUser = authService.getCurrentUser();

        if (token && currentUser) {
          console.log('Token encontrado en localStorage, intentando validar sesión...');

          // Verificar si el token es válido haciendo una petición al endpoint /auth/me
          try {
            const profileResult = await authService.getProfile();
            if (profileResult.success) {
              console.log('Sesión validada correctamente');
              setUser(profileResult.user);
              // Programar refresco de token
              scheduleTokenRefresh();
            } else {
              console.log('Token inválido, intentando refrescar...');
              // Intentar refrescar el token
              const refreshResult = await authService.refreshToken();
              if (refreshResult.success) {
                console.log('Token refrescado correctamente');
                const newProfileResult = await authService.getProfile();
                if (newProfileResult.success) {
                  setUser(newProfileResult.user);
                  scheduleTokenRefresh();
                } else {
                  throw new Error('No se pudo obtener el perfil después de refrescar el token');
                }
              } else {
                throw new Error('No se pudo refrescar el token');
              }
            }
          } catch (validationError) {
            console.error('Error al validar sesión:', validationError);
            // Limpiar datos de autenticación
            authService.logout();
            setUser(null);
          }
        } else {
          console.log('No hay token o usuario en localStorage');
          setUser(null);
        }
      } catch (err) {
        console.error('Error al inicializar autenticación:', err);
        setError('Error al inicializar autenticación');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Función para programar el refresco de token
  const scheduleTokenRefresh = () => {
    // Verificar si hay un token
    const token = authService.getToken();
    if (!token) return;

    try {
      // Decodificar el token para obtener su tiempo de expiración
      // Los tokens JWT están codificados en base64
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresIn = payload.exp * 1000 - Date.now(); // Convertir a milisegundos

      // Si el token está a punto de expirar (menos de 5 minutos)
      // o ya expiró, refrescarlo inmediatamente
      if (expiresIn < 300000) {
        refreshToken();
      } else {
        // Programar refresco para 5 minutos antes de que expire
        const timeToRefresh = expiresIn - 300000;
        setTimeout(refreshToken, timeToRefresh);
      }
    } catch (err) {
      console.error('Error al programar refresco de token:', err);
    }
  };

  // Función para refrescar el token
  const refreshToken = async () => {
    try {
      const result = await authService.refreshToken();
      if (result.success) {
        // Actualizar usuario si es necesario
        const profileResult = await authService.getProfile();
        if (profileResult.success) {
          setUser(profileResult.user);
        }
        // Programar próximo refresco
        scheduleTokenRefresh();
      } else {
        // Si no se pudo refrescar el token, cerrar sesión
        logout();
      }
    } catch (err) {
      console.error('Error al refrescar token:', err);
      logout();
    }
  };

  // Función para iniciar sesión
  const login = async (username, password) => {
    try {
      setError(null);
      const result = await authService.login(username, password);

      if (result.success) {
        setUser(result.user);
        scheduleTokenRefresh();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('Error en login:', err);
      const errorMsg = 'Error al iniciar sesión. Por favor, intente nuevamente.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  // Función para validar la sesión actual
  const validateSession = async () => {
    try {
      const token = authService.getToken();
      if (!token) return { success: false };

      const profileResult = await authService.getProfile();
      if (profileResult.success) {
        setUser(profileResult.user);
        return { success: true };
      } else {
        // Intentar refrescar el token
        const refreshResult = await authService.refreshToken();
        if (refreshResult.success) {
          const newProfileResult = await authService.getProfile();
          if (newProfileResult.success) {
            setUser(newProfileResult.user);
            return { success: true };
          }
        }
        return { success: false };
      }
    } catch (error) {
      console.error('Error al validar sesión:', error);
      return { success: false, error };
    }
  };

  // Exponer el contexto de autenticación
  const contextValue = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    refreshToken,
    validateSession
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
