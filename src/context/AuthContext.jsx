import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la aplicación
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Si hay token pero no hay datos de usuario, intentar obtener el perfil
            const { success, user: profileUser } = await authService.getProfile();
            if (success) {
              setUser(profileUser);
            } else {
              // Si falla, limpiar la sesión
              authService.logout();
            }
          }
        }
      } catch (err) {
        console.error('Error al verificar autenticación:', err);
        setError('Error al verificar la autenticación');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(username, password);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Error al iniciar sesión';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const { success, user: profileUser } = await authService.getProfile();
      if (success) {
        setUser(profileUser);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      return false;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
