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
      
      setReporteData(response.data);
    } catch (err) {
      console.error('Error al generar reporte:', err);
      setError('Error al generar el reporte financiero');
    } finally {
      setLoading(false);
    }
  };

  const exportarReporte = () => {
    // Aquí se implementaría la lógica para exportar a PDF o Excel
    alert('Funcionalidad de exportación en desarrollo');
  };

  // Datos de muestra para el reporte
  const reporteMensualMuestra = {
    periodo: `${filtros.mes}/${filtros.año}`,
    ingresos: {
      total: 25000,
      detalles: [
        { concepto: 'Inscripciones', monto: 8000 },
        { concepto: 'Mensualidades', monto: 12000 },
        { concepto: 'Cursos especiales', monto: 3000 },
        { concepto: 'Venta de materiales', monto: 1500 },
        { concepto: 'Otros ingresos', monto: 500 }
      ]
    },
    gastos: {
      total: 18000,
      detalles: [
        { concepto: 'Salarios', monto: 10000 },
        { concepto: 'Materiales didácticos', monto: 2000 },
        { concepto: 'Servicios básicos', monto: 3000 },
        { concepto: 'Mantenimiento', monto: 2000 },
        { concepto: 'Equipamiento', monto: 1000 }
      ]
    },
    balance: 7000,
    comparativoMesAnterior: {
      ingresos: { actual: 25000, anterior: 24500, diferencia: 500, porcentaje: 2 },
      gastos: { actual: 18000, anterior: 18500, diferencia: -500, porcentaje: -2.7 },
      balance: { actual: 7000, anterior: 6000, diferencia: 1000, porcentaje: 16.7 }
    }
  };

  const reporteAnualMuestra = {
    año: filtros.año,
    ingresosTotales: 300000,
    gastosTotales: 220000,
    balanceAnual: 80000,
    ingresosPorMes: [
      { mes: 'Enero', monto: 22000 },
      { mes: 'Febrero', monto: 22000 },
      { mes: 'Marzo', monto: 23000 },
      { mes: 'Abril', monto: 24000 },
      { mes: 'Mayo', monto: 24500 },
      { mes: 'Junio', monto: 25000 },
      { mes: 'Julio', monto: 25000 },
      { mes: 'Agosto', monto: 26000 },
      { mes: 'Septiembre', monto: 27000 },
      { mes: 'Octubre', monto: 27500 },
      { mes: 'Noviembre', monto: 27000 },
      { mes: 'Diciembre', monto: 27000 }
    ],
    gastosPorMes: [
      { mes: 'Enero', monto: 17000 },
      { mes: 'Febrero', monto: 17000 },
      { mes: 'Marzo', monto: 17500 },
      { mes: 'Abril', monto: 18000 },
      { mes: 'Mayo', monto: 18500 },
      { mes: 'Junio', monto: 18000 },
      { mes: 'Julio', monto: 18000 },
      { mes: 'Agosto', monto: 19000 },
      { mes: 'Septiembre', monto: 19500 },
      { mes: 'Octubre', monto: 19500 },
      { mes: 'Noviembre', monto: 19000 },
      { mes: 'Diciembre', monto: 19000 }
    ],
    comparativoAñoAnterior: {
      ingresos: { actual: 300000, anterior: 280000, diferencia: 20000, porcentaje: 7.1 },
      gastos: { actual: 220000, anterior: 210000, diferencia: 10000, porcentaje: 4.8 },
      balance: { actual: 80000, anterior: 70000, diferencia: 10000, porcentaje: 14.3 }
    }
  };

  // Usar datos de muestra o datos reales
  const displayReporte = reporteData || (filtros.tipoReporte === 'mensual' ? reporteMensualMuestra : reporteAnualMuestra);

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

      {reporteData || true ? (
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
                  <div className="amount">${displayReporte.ingresos.total}</div>
                </div>
                <div className="summary-card gastos">
                  <h3>Total Gastos</h3>
                  <div className="amount">${displayReporte.gastos.total}</div>
                </div>
                <div className="summary-card balance">
                  <h3>Balance</h3>
                  <div className="amount">${displayReporte.balance}</div>
                </div>
              </div>

              <div className="reporte-section">
                <h3>Detalle de Ingresos</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Monto</th>
                      <th>Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayReporte.ingresos.detalles.map((item, index) => (
                      <tr key={index}>
                        <td>{item.concepto}</td>
                        <td>${item.monto}</td>
                        <td>{((item.monto / displayReporte.ingresos.total) * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="reporte-section">
                <h3>Detalle de Gastos</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Monto</th>
                      <th>Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayReporte.gastos.detalles.map((item, index) => (
                      <tr key={index}>
                        <td>{item.concepto}</td>
                        <td>${item.monto}</td>
                        <td>{((item.monto / displayReporte.gastos.total) * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                      <td>${displayReporte.comparativoMesAnterior.ingresos.actual}</td>
                      <td>${displayReporte.comparativoMesAnterior.ingresos.anterior}</td>
                      <td>${displayReporte.comparativoMesAnterior.ingresos.diferencia}</td>
                      <td className={displayReporte.comparativoMesAnterior.ingresos.porcentaje >= 0 ? 'positivo' : 'negativo'}>
                        {displayReporte.comparativoMesAnterior.ingresos.porcentaje}%
                      </td>
                    </tr>
                    <tr>
                      <td>Gastos</td>
                      <td>${displayReporte.comparativoMesAnterior.gastos.actual}</td>
                      <td>${displayReporte.comparativoMesAnterior.gastos.anterior}</td>
                      <td>${displayReporte.comparativoMesAnterior.gastos.diferencia}</td>
                      <td className={displayReporte.comparativoMesAnterior.gastos.porcentaje <= 0 ? 'positivo' : 'negativo'}>
                        {displayReporte.comparativoMesAnterior.gastos.porcentaje}%
                      </td>
                    </tr>
                    <tr>
                      <td>Balance</td>
                      <td>${displayReporte.comparativoMesAnterior.balance.actual}</td>
                      <td>${displayReporte.comparativoMesAnterior.balance.anterior}</td>
                      <td>${displayReporte.comparativoMesAnterior.balance.diferencia}</td>
                      <td className={displayReporte.comparativoMesAnterior.balance.porcentaje >= 0 ? 'positivo' : 'negativo'}>
                        {displayReporte.comparativoMesAnterior.balance.porcentaje}%
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
                  <div className="amount">${displayReporte.ingresosTotales}</div>
                </div>
                <div className="summary-card gastos">
                  <h3>Gastos Anuales</h3>
                  <div className="amount">${displayReporte.gastosTotales}</div>
                </div>
                <div className="summary-card balance">
                  <h3>Balance Anual</h3>
                  <div className="amount">${displayReporte.balanceAnual}</div>
                </div>
              </div>

              <div className="reporte-section">
                <h3>Evolución Mensual</h3>
                <div className="chart-container">
                  {/* Aquí se podría integrar un gráfico de líneas */}
                  <div className="line-chart-placeholder">
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
                        {displayReporte.ingresosPorMes.map((item, index) => (
                          <tr key={index}>
                            <td>{item.mes}</td>
                            <td>${item.monto}</td>
                            <td>${displayReporte.gastosPorMes[index].monto}</td>
                            <td>${item.monto - displayReporte.gastosPorMes[index].monto}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                      <td>${displayReporte.comparativoAñoAnterior.ingresos.actual}</td>
                      <td>${displayReporte.comparativoAñoAnterior.ingresos.anterior}</td>
                      <td>${displayReporte.comparativoAñoAnterior.ingresos.diferencia}</td>
                      <td className={displayReporte.comparativoAñoAnterior.ingresos.porcentaje >= 0 ? 'positivo' : 'negativo'}>
                        {displayReporte.comparativoAñoAnterior.ingresos.porcentaje}%
                      </td>
                    </tr>
                    <tr>
                      <td>Gastos</td>
                      <td>${displayReporte.comparativoAñoAnterior.gastos.actual}</td>
                      <td>${displayReporte.comparativoAñoAnterior.gastos.anterior}</td>
                      <td>${displayReporte.comparativoAñoAnterior.gastos.diferencia}</td>
                      <td className={displayReporte.comparativoAñoAnterior.gastos.porcentaje <= 0 ? 'positivo' : 'negativo'}>
                        {displayReporte.comparativoAñoAnterior.gastos.porcentaje}%
                      </td>
                    </tr>
                    <tr>
                      <td>Balance</td>
                      <td>${displayReporte.comparativoAñoAnterior.balance.actual}</td>
                      <td>${displayReporte.comparativoAñoAnterior.balance.anterior}</td>
                      <td>${displayReporte.comparativoAñoAnterior.balance.diferencia}</td>
                      <td className={displayReporte.comparativoAñoAnterior.balance.porcentaje >= 0 ? 'positivo' : 'negativo'}>
                        {displayReporte.comparativoAñoAnterior.balance.porcentaje}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

// Función auxiliar para obtener el nombre del mes
const getMesNombre = (mesNumero) => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[parseInt(mesNumero) - 1];
};

export default ReportesFinancieros;
