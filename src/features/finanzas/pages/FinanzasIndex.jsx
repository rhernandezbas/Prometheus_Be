import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { finanzasService } from '../services/finanzas.service.js';

const FinanzasIndex = () => {
  const [resumenFinanciero, setResumenFinanciero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumenFinanciero = async () => {
      try {
        setLoading(true);
        const response = await finanzasService.getBalance();
        console.log('Balance API response:', response.data);
        
        // Ensure totalGastos is correctly set
        const totalGastos = response.data?.totalGastos || 
                           (response.data?.gastos?.total) || 
                           (response.data?.gastos) || 
                           0;
        
        // Create a new object with the correct totalGastos value
        const processedData = {
          ...response.data,
          totalGastos: totalGastos
        };
        
        console.log('Processed financial data:', processedData);
        setResumenFinanciero(processedData);
      } catch (err) {
        console.error('Error al cargar resumen financiero:', err);
        setError('Error al cargar el resumen financiero');
      } finally {
        setLoading(false);
      }
    };

    fetchResumenFinanciero();
  }, []);

  if (loading) {
    return <div className="loading">Cargando datos financieros...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Si no hay datos reales, usar datos de muestra
  const resumenData = resumenFinanciero || {
    totalIngresos: 25000,
    totalGastos: 18000,
    balance: 7000,
    ultimosIngresos: [
      { id: 1, concepto: 'Matrícula', monto: 5000, fecha: '2025-07-15' },
      { id: 2, concepto: 'Mensualidad', monto: 3500, fecha: '2025-07-10' },
      { id: 3, concepto: 'Curso especial', monto: 2000, fecha: '2025-07-05' }
    ],
    ultimosGastos: [
      { id: 1, concepto: 'Salarios', monto: 10000, fecha: '2025-07-15' },
      { id: 2, concepto: 'Materiales', monto: 1500, fecha: '2025-07-08' },
      { id: 3, concepto: 'Servicios', monto: 2000, fecha: '2025-07-03' }
    ]
  };

  return (
    <div className="finanzas-container">
      <div className="page-header">
        <h1>Panel Financiero</h1>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card ingresos">
          <h2>Total Ingresos</h2>
          <div className="amount">${resumenData?.totalIngresos || 0}</div>
          <Link to="/finanzas/ingresos" className="btn btn-outline">
            Ver Ingresos
          </Link>
        </div>
        
        <div className="summary-card gastos">
          <h2>Total Gastos</h2>
          <div className="amount">${resumenData?.totalGastos || 0}</div>
          <Link to="/finanzas/gastos" className="btn btn-outline">
            Ver Gastos
          </Link>
        </div>
        
        <div className="summary-card balance">
          <h2>Balance</h2>
          <div className="amount">${resumenData?.balance || 0}</div>
          <Link to="/finanzas/balance" className="btn btn-outline">
            Ver Balance Detallado
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Últimos Ingresos</h2>
            <Link to="/finanzas/ingresos" className="btn btn-sm">
              Ver Todos
            </Link>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {resumenData.ultimosIngresos?.map((ingreso) => (
                  <tr key={ingreso.id}>
                    <td>{ingreso.concepto}</td>
                    <td>${ingreso.monto}</td>
                    <td>{ingreso.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer">
            <Link to="/finanzas/ingresos/nuevo" className="btn btn-primary">
              Nuevo Ingreso
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Últimos Gastos</h2>
            <Link to="/finanzas/gastos" className="btn btn-sm">
              Ver Todos
            </Link>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {resumenData.ultimosGastos?.map((gasto) => (
                  <tr key={gasto.id}>
                    <td>{gasto.concepto}</td>
                    <td>${gasto.monto}</td>
                    <td>{gasto.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer">
            <Link to="/finanzas/gastos/nuevo" className="btn btn-primary">
              Nuevo Gasto
            </Link>
          </div>
        </div>
      </div>

      <div className="actions-section">
        <div className="action-buttons">
          <Link to="/finanzas/reportes" className="btn btn-secondary">
            Ver Reportes Financieros
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FinanzasIndex;
