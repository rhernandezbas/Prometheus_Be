import axios from 'axios';

// Constantes para almacenamiento local
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

// Configuración base de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Verificar si el error es 401 (No autorizado)
    if (error.response && error.response.status === 401) {
      console.log('Error 401: Sesión expirada o token inválido');
      
      // Intentar refrescar el token si hay un refresh token disponible
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (refreshToken) {
        try {
          // Evitar ciclos infinitos de refresco
          if (!error.config._isRetry) {
            console.log('Intentando refrescar el token...');
            
            // Llamar directamente a la API sin usar el interceptor para evitar ciclos
            const refreshResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/refresh-token`,
              { refresh_token: refreshToken },
              { headers: { 'Content-Type': 'application/json' } }
            );
            
            if (refreshResponse.data && refreshResponse.data.access_token) {
              // Guardar el nuevo token
              localStorage.setItem(TOKEN_KEY, refreshResponse.data.access_token);
              
              // Reintentar la solicitud original con el nuevo token
              error.config.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
              error.config._isRetry = true;
              return axios(error.config);
            }
          }
        } catch (refreshError) {
          console.error('Error al refrescar el token:', refreshError);
        }
      }
      
      // Si no se pudo refrescar el token o no hay refresh token, cerrar sesión
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      // Redireccionar al login - usando timeout para asegurar que se complete
      setTimeout(() => {
        // Verificar la URL actual para evitar redirecciones innecesarias si ya estamos en login
        if (!window.location.pathname.includes('/login')) {
          console.log('Redirigiendo a login...');
          // Usar replace en lugar de href para evitar problemas de historial
          window.location.replace('/login');
        }
      }, 100);
    }
    
    return Promise.reject(error);
  }
);

export default api;
