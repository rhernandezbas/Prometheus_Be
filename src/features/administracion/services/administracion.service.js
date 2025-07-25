import api from '../../../services/api.js';

// Servicios para administración
export const administracionService = {
  // Servicios para gastos
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
  
  // Servicio para obtener resumen general
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

export default {
  administracionService,
  configuracionService,
  instructoresService
};
