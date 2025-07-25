import api from './api';

// Constantes para almacenamiento local
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

// Servicio de autenticación
export const authService = {
  // Iniciar sesión
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { access_token, refresh_token, user } = response.data;
      
      // Guardar tokens y datos de usuario en localStorage
      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al iniciar sesión'
      };
    }
  },
  
  // Cerrar sesión
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return true;
  },
  
  // Refrescar token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        return { success: false, error: 'No hay token de refresco' };
      }
      
      const response = await api.post('/refresh-token', { refresh_token: refreshToken });
      const { access_token } = response.data;
      
      localStorage.setItem(TOKEN_KEY, access_token);
      return { success: true };
    } catch (error) {
      console.error('Error al refrescar token:', error);
      // Si hay un error al refrescar, cerrar sesión
      authService.logout();
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al refrescar token'
      };
    }
  },
  
  // Obtener usuario actual
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error('Error al obtener usuario actual:', e);
      return null;
    }
  },
  
  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
  
  // Obtener token de acceso
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  // Obtener perfil de usuario desde el backend
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      const { user } = response.data;
      
      // Actualizar datos de usuario en localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al obtener perfil de usuario'
      };
    }
  },
  
  // Cambiar contraseña
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/user/change-password', { 
        current_password: currentPassword, 
        new_password: newPassword 
      });
      
      return { success: true, message: response.data.mensaje };
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al cambiar contraseña'
      };
    }
  }
};

export default authService;
