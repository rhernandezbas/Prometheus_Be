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
              `${import.meta.env.VITE_API_URL}/auth/refresh`,
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

// Servicios para estudiantes (actualizado según las rutas del backend)
export const estudiantesService = {
  getAll: (params) => api.get('/estudiantes/', { params }),
  getById: (id) => api.get(`/estudiantes/${id}`),
  create: (data) => api.post('/estudiantes/create', data),
  update: (id, data) => api.put(`/estudiantes/${id}`, data),
  delete: (id) => api.delete(`/estudiantes/${id}`),
  search: (params) => api.get('/estudiantes/buscar', { params }),
  getByNivel: (nivel) => api.get(`/estudiantes/nivel/${nivel}`),
};

// Servicios para evaluaciones
export const evaluacionesService = {
  getByEstudiante: (estudianteId) => api.get(`/evaluacion/estudiante/${estudianteId}`),
  getByNivel: (nivelId) => api.get(`/evaluacion/nivel/${nivelId}`),
  create: (data) => api.post('/evaluacion', data),
  update: (id, data) => api.put(`/evaluacion/${id}`, data),
  delete: (id) => api.delete(`/evaluacion/${id}`),
};

// Servicios para niveles (actualizado para usar los endpoints correctos)
export const nivelesService = {
  // Información general de niveles
  getAll: () => api.get('/estudiantes/niveles'),
  
  // Estudiantes por nivel (usando el endpoint de alumnos_routes.py)
  getEstudiantesByNivel: (nivel) => api.get(`/estudiantes/nivel/${nivel}`),
  
  // Información específica por nivel
  getBasico: () => api.get('/estudiantes/nivel/Basico'),
  getIntermedio: () => api.get('/estudiantes/nivel/Intermedio'),
  getAvanzado: () => api.get('/estudiantes/nivel/Avanzado'),
  
  // Estudiantes por subnivel
  getEstudiantesBySubnivel: (nivel, subnivel) => api.get(`/estudiantes/nivel/${nivel}/subnivel/${subnivel}`),
  
  // Evaluaciones por nivel (usando el endpoint de evaluacion_routes.py)
  getEvaluacionesByNivel: (nivelId) => api.get(`/evaluacion/nivel/${nivelId}`),
  
  // Asistencia por nivel y fecha (usando el endpoint de asistencia_routes.py)
  getAsistenciaByNivel: (nivelId, fecha) => api.get(`/asistencia/nivel/${nivelId}/fecha/${fecha}`),
  
  // Eventos de calendario por nivel (usando el endpoint de calendario_routes.py)
  getEventosByNivel: (nivelId) => api.get(`/calendar/nivel/${nivelId}`),
};

// Servicios para administración
export const administracionService = {
  // Servicios para gastos - actualizados para coincidir con las rutas del backend
  getGastos: (params) => api.get('/finanzas/gastos/search_all', { params }),
  createGasto: (data) => api.post('/finanzas/gastos/create', data),
  updateGasto: (id, data) => api.put(`/finanzas/gastos/update/${id}`, data),
  deleteGasto: (id) => api.delete(`/finanzas/gastos/delete/${id}`),
  
  // Servicios para ingresos
  getIngresos: (params) => api.get('/finanzas/ingresos/search_all', { params }),
  createIngreso: (data) => api.post('/finanzas/ingresos/create', data),
  updateIngreso: (id, data) => api.put(`/finanzas/ingresos/update/${id}`, data),
  deleteIngreso: (id) => api.delete(`/finanzas/ingresos/delete/${id}`),
  
  // Servicio para obtener el balance financiero
  getBalance: (params) => api.get('/finanzas/balance', { params }),
  
  // Servicio para obtener resumen general (mantener por compatibilidad)
  getResumen: (params) => api.get('/administracion/resumen', { params }),
};

// Servicios para configuración
export const configuracionService = {
  getCriterios: () => api.get('/configuracion/criterios'),
  updateCriterio: (id, data) => api.put(`/configuracion/criterios/${id}`, data),
  createCriterio: (data) => api.post('/configuracion/criterios', data),
  deleteCriterio: (id) => api.delete(`/configuracion/criterios/${id}`),
};

// Servicios para instructores
export const instructoresService = {
  getAll: (params) => api.get('/instructores', { params }),
  getById: (id) => api.get(`/instructores/${id}`),
  create: (data) => api.post('/instructores/create', data),
  update: (id, data) => api.put(`/instructores/${id}`, data),
  delete: (id) => api.delete(`/instructores/${id}`),
  search: (params) => api.get('/instructores/search', { params }),
};

export default api;
