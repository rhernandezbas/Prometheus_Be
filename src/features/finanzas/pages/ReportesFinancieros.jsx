import React, { useState } from 'react';
import { finanzasService } from '../services/finanzas.service.js';

const ReportesFinancieros = () => {
  const [reporteData, setReporteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    tipoReporte: 'mensual',
    año: new Date().getFullYear(),
    mes: new Date().getMonth() + 1
  });

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const generarReporte = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (filtros.tipoReporte === 'mensual') {
        response = await finanzasService.getReportesMensuales(filtros.año, filtros.mes);
      } else {
        response = await finanzasService.getReportesAnuales(filtros.año);
      }
      
      console.log('Reporte API response:', response.data);
      
      // Procesar y validar los datos recibidos
      const processedData = processReporteData(response.data, filtros);
      setReporteData(processedData);
    } catch (err) {
      console.error('Error al generar reporte:', err);
      setError('Error al generar el reporte financiero');
    } finally {
      setLoading(false);
    }
  };

  // Función para procesar y validar los datos del reporte
  const processReporteData = (data, filtros) => {
    // Si no hay datos, devolver null
    if (!data) return null;
    
    // Crear estructura base según el tipo de reporte
    if (filtros.tipoReporte === 'mensual') {
      // Estructura para reporte mensual
      const processedData = {
        periodo: `${filtros.mes}/${filtros.año}`,
        ingresos: {
          total: 0,
          detalles: []
        },
        gastos: {
          total: 0,
          detalles: []
        },
        balance: 0,
        comparativoMesAnterior: {
          ingresos: { actual: 0, anterior: 0, diferencia: 0, porcentaje: 0 },
          gastos: { actual: 0, anterior: 0, diferencia: 0, porcentaje: 0 },
          balance: { actual: 0, anterior: 0, diferencia: 0, porcentaje: 0 }
        }
      };
      
      // Procesar ingresos si existen
      if (data.ingresos) {
        processedData.ingresos.total = data.ingresos.total || 0;
        
        if (Array.isArray(data.ingresos.detalles)) {
          processedData.ingresos.detalles = data.ingresos.detalles;
        }
      }
      
      // Procesar gastos si existen
      if (data.gastos) {
        processedData.gastos.total = data.gastos.total || 0;
        
        if (Array.isArray(data.gastos.detalles)) {
          processedData.gastos.detalles = data.gastos.detalles;
        }
      }
      
      // Procesar balance
      processedData.balance = data.balance || (processedData.ingresos.total - processedData.gastos.total);
      
      // Procesar comparativo con mes anterior si existe
      if (data.comparativoMesAnterior) {
        if (data.comparativoMesAnterior.ingresos) {
          processedData.comparativoMesAnterior.ingresos = {
            actual: data.comparativoMesAnterior.ingresos.actual || 0,
            anterior: data.comparativoMesAnterior.ingresos.anterior || 0,
            diferencia: data.comparativoMesAnterior.ingresos.diferencia || 0,
            porcentaje: data.comparativoMesAnterior.ingresos.porcentaje || 0
          };
        }
        
        if (data.comparativoMesAnterior.gastos) {
          processedData.comparativoMesAnterior.gastos = {
            actual: data.comparativoMesAnterior.gastos.actual || 0,
            anterior: data.comparativoMesAnterior.gastos.anterior || 0,
            diferencia: data.comparativoMesAnterior.gastos.diferencia || 0,
            porcentaje: data.comparativoMesAnterior.gastos.porcentaje || 0
          };
        }
        
        if (data.comparativoMesAnterior.balance) {
          processedData.comparativoMesAnterior.balance = {
            actual: data.comparativoMesAnterior.balance.actual || 0,
            anterior: data.comparativoMesAnterior.balance.anterior || 0,
            diferencia: data.comparativoMesAnterior.balance.diferencia || 0,
            porcentaje: data.comparativoMesAnterior.balance.porcentaje || 0
          };
        }
      }
      
      return processedData;
    } else {
      // Estructura para reporte anual
      const processedData = {
        año: filtros.año,
        ingresosTotales: 0,
        gastosTotales: 0,
        balanceAnual: 0,
        ingresosPorMes: [],
        gastosPorMes: [],
        comparativoAñoAnterior: {
          ingresos: { actual: 0, anterior: 0, diferencia: 0, porcentaje: 0 },
          gastos: { actual: 0, anterior: 0, diferencia: 0, porcentaje: 0 },
          balance: { actual: 0, anterior: 0, diferencia: 0, porcentaje: 0 }
        }
      };
      
      // Procesar ingresos totales
      processedData.ingresosTotales = data.ingresosTotales || 0;
      
      // Procesar gastos totales
      processedData.gastosTotales = data.gastosTotales || 0;
      
      // Procesar balance anual
      processedData.balanceAnual = data.balanceAnual || (processedData.ingresosTotales - processedData.gastosTotales);
      
      // Procesar ingresos por mes
      if (Array.isArray(data.ingresosPorMes)) {
        processedData.ingresosPorMes = data.ingresosPorMes;
      }
      
      // Procesar gastos por mes
      if (Array.isArray(data.gastosPorMes)) {
        processedData.gastosPorMes = data.gastosPorMes;
      }
      
      // Procesar comparativo con año anterior si existe
      if (data.comparativoAñoAnterior) {
        if (data.comparativoAñoAnterior.ingresos) {
          processedData.comparativoAñoAnterior.ingresos = {
            actual: data.comparativoAñoAnterior.ingresos.actual || 0,
            anterior: data.comparativoAñoAnterior.ingresos.anterior || 0,
            diferencia: data.comparativoAñoAnterior.ingresos.diferencia || 0,
            porcentaje: data.comparativoAñoAnterior.ingresos.porcentaje || 0
          };
        }
        
        if (data.comparativoAñoAnterior.gastos) {
          processedData.comparativoAñoAnterior.gastos = {
            actual: data.comparativoAñoAnterior.gastos.actual || 0,
            anterior: data.comparativoAñoAnterior.gastos.anterior || 0,
            diferencia: data.comparativoAñoAnterior.gastos.diferencia || 0,
            porcentaje: data.comparativoAñoAnterior.gastos.porcentaje || 0
          };
        }
        
        if (data.comparativoAñoAnterior.balance) {
          processedData.comparativoAñoAnterior.balance = {
            actual: data.comparativoAñoAnterior.balance.actual || 0,
            anterior: data.comparativoAñoAnterior.balance.anterior || 0,
            diferencia: data.comparativoAñoAnterior.balance.diferencia || 0,
            porcentaje: data.comparativoAñoAnterior.balance.porcentaje || 0
          };
        }
      }
      
      return processedData;
    }
  };

  const exportarReporte = () => {
    // Aquí se implementaría la lógica para exportar a PDF o Excel
    alert('Funcionalidad de exportación en desarrollo');
  };

  // Verificar si hay datos para mostrar
  const hayDatosParaMostrar = reporteData !== null;

  return (
    <div className="reportes-container">
      <div className="page-header">
        <h1>Reportes Financieros</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="filtros-panel">
        <h2>Generar Reporte</h2>
        <form onSubmit={generarReporte}>
          <div className="filtros-grid">
            <div className="form-group">
              <label htmlFor="tipoReporte">Tipo de Reporte</label>
              <select
                id="tipoReporte"
                name="tipoReporte"
                value={filtros.tipoReporte}
                onChange={handleFiltroChange}
                className="form-control"
              >
                <option value="mensual">Mensual</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="año">Año</label>
              <select
                id="año"
                name="año"
                value={filtros.año}
                onChange={handleFiltroChange}
                className="form-control"
              >
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
            {filtros.tipoReporte === 'mensual' && (
              <div className="form-group">
                <label htmlFor="mes">Mes</label>
                <select
                  id="mes"
                  name="mes"
                  value={filtros.mes}
                  onChange={handleFiltroChange}
                  className="form-control"
                >
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
              </div>
            )}
          </div>
          <div className="filtros-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generando...' : 'Generar Reporte'}
            </button>
          </div>
        </form>
      </div>

      {!hayDatosParaMostrar ? (
        <div className="no-data-message">
          <p>No hay datos disponibles. Por favor, genere un reporte utilizando los filtros.</p>
        </div>
      ) : (
        <div className="reporte-content">
          <div className="reporte-header">
            <h2>
              {filtros.tipoReporte === 'mensual'
                ? `Reporte Mensual - ${getMesNombre(filtros.mes)} ${filtros.año}`
                : `Reporte Anual - ${filtros.año}`}
            </h2>
            <button onClick={exportarReporte} className="btn btn-secondary">
              Exportar Reporte
            </button>
          </div>

          {filtros.tipoReporte === 'mensual' ? (
            <div className="reporte-mensual">
              <div className="summary-cards">
                <div className="summary-card ingresos">
                  <h3>Total Ingresos</h3>
                  <div className="amount">${reporteData.ingresos.total.toFixed(2)}</div>
                </div>
                <div className="summary-card gastos">
                  <h3>Total Gastos</h3>
                  <div className="amount">${reporteData.gastos.total.toFixed(2)}</div>
                </div>
                <div className="summary-card balance">
                  <h3>Balance</h3>
                  <div className="amount">${reporteData.balance.toFixed(2)}</div>
                </div>
              </div>

              <div className="reporte-section">
                <h3>Detalle de Ingresos</h3>
                {reporteData.ingresos.detalles.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Concepto</th>
                        <th>Monto</th>
                        <th>Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reporteData.ingresos.detalles.map((item, index) => (
                        <tr key={index}>
                          <td>{item.concepto}</td>
                          <td>${Number(item.monto).toFixed(2)}</td>
                          <td>{((Number(item.monto) / reporteData.ingresos.total) * 100).toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-data">No hay detalles de ingresos disponibles</div>
                )}
              </div>

              <div className="reporte-section">
                <h3>Detalle de Gastos</h3>
                {reporteData.gastos.detalles.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Concepto</th>
                        <th>Monto</th>
                        <th>Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reporteData.gastos.detalles.map((item, index) => (
                        <tr key={index}>
                          <td>{item.concepto}</td>
                          <td>${Number(item.monto).toFixed(2)}</td>
                          <td>{((Number(item.monto) / reporteData.gastos.total) * 100).toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-data">No hay detalles de gastos disponibles</div>
                )}
              </div>

              <div className="reporte-section">
                <h3>Comparativo con Mes Anterior</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Mes Actual</th>
                      <th>Mes Anterior</th>
                      <th>Diferencia</th>
                      <th>Variación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Ingresos</td>
                      <td>${reporteData.comparativoMesAnterior.ingresos.actual.toFixed(2)}</td>
                      <td>${reporteData.comparativoMesAnterior.ingresos.anterior.toFixed(2)}</td>
                      <td>${reporteData.comparativoMesAnterior.ingresos.diferencia.toFixed(2)}</td>
                      <td className={reporteData.comparativoMesAnterior.ingresos.porcentaje >= 0 ? 'positivo' : 'negativo'}>
                        {reporteData.comparativoMesAnterior.ingresos.porcentaje.toFixed(2)}%
                      </td>
                    </tr>
                    <tr>
                      <td>Gastos</td>
                      <td>${reporteData.comparativoMesAnterior.gastos.actual.toFixed(2)}</td>
                      <td>${reporteData.comparativoMesAnterior.gastos.anterior.toFixed(2)}</td>
                      <td>${reporteData.comparativoMesAnterior.gastos.diferencia.toFixed(2)}</td>
                      <td className={reporteData.comparativoMesAnterior.gastos.porcentaje <= 0 ? 'positivo' : 'negativo'}>
                        {reporteData.comparativoMesAnterior.gastos.porcentaje.toFixed(2)}%
                      </td>
                    </tr>
                    <tr>
                      <td>Balance</td>
                      <td>${reporteData.comparativoMesAnterior.balance.actual.toFixed(2)}</td>
                      <td>${reporteData.comparativoMesAnterior.balance.anterior.toFixed(2)}</td>
                      <td>${reporteData.comparativoMesAnterior.balance.diferencia.toFixed(2)}</td>
                      <td className={reporteData.comparativoMesAnterior.balance.porcentaje >= 0 ? 'positivo' : 'negativo'}>
                        {reporteData.comparativoMesAnterior.balance.porcentaje.toFixed(2)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="reporte-anual">
              <div className="summary-cards">
                <div className="summary-card ingresos">
                  <h3>Ingresos Anuales</h3>
                  <div className="amount">${reporteData.ingresosTotales.toFixed(2)}</div>
                </div>
                <div className="summary-card gastos">
                  <h3>Gastos Anuales</h3>
                  <div className="amount">${reporteData.gastosTotales.toFixed(2)}</div>
                </div>
                <div className="summary-card balance">
                  <h3>Balance Anual</h3>
                  <div className="amount">${reporteData.balanceAnual.toFixed(2)}</div>
                </div>
              </div>

              <div className="reporte-section">
                <h3>Evolución Mensual</h3>
                <div className="chart-container">
                  {/* Aquí se podría integrar un gráfico de líneas */}
                  <div className="line-chart-placeholder">
                    {reporteData.ingresosPorMes.length > 0 && reporteData.gastosPorMes.length > 0 ? (
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Mes</th>
                            <th>Ingresos</th>
                            <th>Gastos</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reporteData.ingresosPorMes.map((item, index) => {
                            const gastoMes = reporteData.gastosPorMes[index] || { monto: 0 };
                            return (
                              <tr key={index}>
                                <td>{item.mes}</td>
                                <td>${Number(item.monto).toFixed(2)}</td>
                                <td>${Number(gastoMes.monto).toFixed(2)}</td>
                                <td>${(Number(item.monto) - Number(gastoMes.monto)).toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="no-data">No hay datos de evolución mensual disponibles</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="reporte-section">
                <h3>Comparativo con Año Anterior</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Año Actual</th>
                      <th>Año Anterior</th>
                      <th>Diferencia</th>
                      <th>Variación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Ingresos</td>
                      <td>${reporteData.comparativoAñoAnterior.ingresos.actual.toFixed(2)}</td>
                      <td>${reporteData.comparativoAñoAnterior.ingresos.anterior.toFixed(2)}</td>
                      <td>${reporteData.comparativoAñoAnterior.ingresos.diferencia.toFixed(2)}</td>
                      <td className={reporteData.comparativoAñoAnterior.ingresos.porcentaje >= 0 ? 'positivo' : 'negativo'}>
                        {reporteData.comparativoAñoAnterior.ingresos.porcentaje.toFixed(2)}%
                      </td>
                    </tr>
                    <tr>
                      <td>Gastos</td>
                      <td>${reporteData.comparativoAñoAnterior.gastos.actual.toFixed(2)}</td>
                      <td>${reporteData.comparativoAñoAnterior.gastos.anterior.toFixed(2)}</td>
                      <td>${reporteData.comparativoAñoAnterior.gastos.diferencia.toFixed(2)}</td>
                      <td className={reporteData.comparativoAñoAnterior.gastos.porcentaje <= 0 ? 'positivo' : 'negativo'}>
                        {reporteData.comparativoAñoAnterior.gastos.porcentaje.toFixed(2)}%
                      </td>
                    </tr>
                    <tr>
                      <td>Balance</td>
                      <td>${reporteData.comparativoAñoAnterior.balance.actual.toFixed(2)}</td>
                      <td>${reporteData.comparativoAñoAnterior.balance.anterior.toFixed(2)}</td>
                      <td>${reporteData.comparativoAñoAnterior.balance.diferencia.toFixed(2)}</td>
                      <td className={reporteData.comparativoAñoAnterior.balance.porcentaje >= 0 ? 'positivo' : 'negativo'}>
                        {reporteData.comparativoAñoAnterior.balance.porcentaje.toFixed(2)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Función auxiliar para obtener el nombre del mes
const getMesNombre = (mesNumero) => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[parseInt(mesNumero) - 1] || '';
};

export default ReportesFinancieros;
