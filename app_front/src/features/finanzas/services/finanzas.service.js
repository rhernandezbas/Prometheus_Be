import api from '../../../services/api';

// Servicios para finanzas
export const finanzasService = {
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
  
  // Reportes financieros
  getReportesMensuales: (año, mes) => api.get(`/finanzas/reportes/mensual/${año}/${mes}`),
  getReportesAnuales: (año) => api.get(`/finanzas/reportes/anual/${año}`),
};

export default finanzasService;
