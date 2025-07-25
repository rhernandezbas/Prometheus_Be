import api from '../../../services/api.js';

// Servicios para estudiantes
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

// Servicios para niveles
export const nivelesService = {
  // Información general de niveles
  getAll: () => api.get('/estudiantes/niveles'),
  
  // Estudiantes por nivel
  getEstudiantesByNivel: (nivel) => api.get(`/estudiantes/nivel/${nivel}`),
  
  // Información específica por nivel
  getBasico: () => api.get('/estudiantes/nivel/Basico'),
  getIntermedio: () => api.get('/estudiantes/nivel/Intermedio'),
  getAvanzado: () => api.get('/estudiantes/nivel/Avanzado'),
  
  // Estudiantes por subnivel
  getEstudiantesBySubnivel: (nivel, subnivel) => api.get(`/estudiantes/nivel/${nivel}/subnivel/${subnivel}`),
  
  // Evaluaciones por nivel
  getEvaluacionesByNivel: (nivelId) => api.get(`/evaluacion/nivel/${nivelId}`),
  
  // Asistencia por nivel y fecha
  getAsistenciaByNivel: (nivelId, fecha) => api.get(`/asistencia/nivel/${nivelId}/fecha/${fecha}`),
  
  // Eventos de calendario por nivel
  getEventosByNivel: (nivelId) => api.get(`/calendar/nivel/${nivelId}`),
};

export default {
  estudiantesService,
  evaluacionesService,
  nivelesService
};
