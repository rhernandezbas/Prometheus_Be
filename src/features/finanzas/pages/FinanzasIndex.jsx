import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { finanzasService } from '../services/finanzas.service.js';

const FinanzasIndex = () => {
  const [resumenFinanciero, setResumenFinanciero] = useState({
    totalIngresos: 0,
    totalGastos: 0,
    balance: 0,
    ultimosIngresos: [],
    ultimosGastos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    const fetchResumenFinanciero = async () => {
      try {
        setLoading(true);
        
        // Obtener el balance general
        const balanceResponse = await finanzasService.getBalance();
        console.log('Balance API response:', balanceResponse.data);
        
        // Obtener los gastos para asegurar que tenemos los datos más recientes
        const gastosResponse = await finanzasService.getGastos();
        console.log('Gastos API response:', gastosResponse.data);
        
        // Procesar los gastos
        let gastosList = [];
        if (gastosResponse.data && Array.isArray(gastosResponse.data)) {
          gastosList = gastosResponse.data;
        } else if (gastosResponse.data) {
          // Si response.data existe pero no es un array, verificar si contiene la propiedad gastos
          if (gastosResponse.data.gastos && Array.isArray(gastosResponse.data.gastos)) {
            gastosList = gastosResponse.data.gastos;
          }
        }
        
        // Calcular el total de gastos
        const totalGastos = gastosList.reduce((total, gasto) => total + Number(gasto.monto || 0), 0);
        
        // Ordenar los gastos por fecha (más recientes primero)
        const sortedGastos = [...gastosList].sort((a, b) => 
          new Date(b.fecha || '1900-01-01') - new Date(a.fecha || '1900-01-01')
        );
        
        // Tomar los últimos 5 gastos
        const ultimosGastos = sortedGastos.slice(0, 5);
        
        // Procesar los ingresos (similar a los gastos)
        const ingresosResponse = await finanzasService.getIngresos();
        let ingresosList = [];
        if (ingresosResponse.data && Array.isArray(ingresosResponse.data)) {
          ingresosList = ingresosResponse.data;
        } else if (ingresosResponse.data && ingresosResponse.data.ingresos && Array.isArray(ingresosResponse.data.ingresos)) {
          ingresosList = ingresosResponse.data.ingresos;
        }
        
        // Calcular el total de ingresos
        const totalIngresos = ingresosList.reduce((total, ingreso) => total + Number(ingreso.monto || 0), 0);
        
        // Ordenar los ingresos por fecha (más recientes primero)
        const sortedIngresos = [...ingresosList].sort((a, b) => 
          new Date(b.fecha || '1900-01-01') - new Date(a.fecha || '1900-01-01')
        );
        
        // Tomar los últimos 5 ingresos
        const ultimosIngresos = sortedIngresos.slice(0, 5);
        
        // Calcular el balance
        const balance = totalIngresos - totalGastos;
        
        // Crear el objeto de resumen financiero
        const processedData = {
          totalIngresos,
          totalGastos,
          balance,
          ultimosIngresos,
          ultimosGastos
        };
        
        console.log('Processed financial data:', processedData);
        setResumenFinanciero(processedData);
      } catch (err) {
        console.error('Error al cargar resumen financiero:', err);
        setError('Error al cargar el resumen financiero');
      } finally {
        setLoading(false);
        // Activar animaciones después de cargar los datos
        setTimeout(() => {
          setAnimateCards(true);
        }, 100);
      }
    };

    fetchResumenFinanciero();
  }, []);

  // Componente para mostrar esqueletos de carga
  const LoadingSkeleton = () => (
    <div className="finanzas-container">
      <div className="page-header">
        <h1>Panel Financiero</h1>
      </div>

      <div className="dashboard-summary">
        {[1, 2, 3].map((item) => (
          <div key={item} className="summary-card fade-in">
            <div className="loading-skeleton" style={{ height: '30px', width: '60%' }}></div>
            <div className="loading-skeleton" style={{ height: '40px', width: '80%' }}></div>
            <div className="loading-skeleton" style={{ height: '30px', width: '40%' }}></div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {[1, 2].map((item) => (
          <div key={item} className="dashboard-card">
            <div className="card-header">
              <div className="loading-skeleton" style={{ height: '30px', width: '50%' }}></div>
            </div>
            <div className="card-body">
              <div className="loading-skeleton" style={{ height: '20px', width: '100%' }}></div>
              <div className="loading-skeleton" style={{ height: '20px', width: '100%' }}></div>
              <div className="loading-skeleton" style={{ height: '20px', width: '100%' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <div className="error-message fade-in">{error}</div>;
  }

  return (
    <div className="finanzas-container">
      <div className="page-header">
        <h1>Panel Financiero</h1>
      </div>

      <div className="dashboard-summary">
        <div className={`summary-card ingresos ${animateCards ? 'slide-in' : ''}`} style={{animationDelay: '0.1s'}}>
          <div className="card-icon">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <h2>Total Ingresos</h2>
          <div className="amount">${resumenFinanciero.totalIngresos.toFixed(2)}</div>
          <Link to="/finanzas/ingresos" className="btn btn-outline">
            Ver Ingresos
          </Link>
        </div>
        
        <div className={`summary-card gastos ${animateCards ? 'slide-in' : ''}`} style={{animationDelay: '0.2s'}}>
          <div className="card-icon">
            <i className="fas fa-rocket"></i>
          </div>
          <h2>Total Gastos</h2>
          <div className="amount">${resumenFinanciero.totalGastos.toFixed(2)}</div>
          <Link to="/finanzas/gastos" className="btn btn-outline">
            Ver Gastos
          </Link>
        </div>
        
        <div className={`summary-card balance ${animateCards ? 'slide-in' : ''}`} style={{animationDelay: '0.3s'}}>
          <div className="card-icon">
            <i className="fas fa-balance-scale"></i>
          </div>
          <h2>Balance</h2>
          <div className="amount">${resumenFinanciero.balance.toFixed(2)}</div>
          <Link to="/finanzas/balance" className="btn btn-outline">
            Ver Balance Detallado
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className={`dashboard-card ${animateCards ? 'card-animate' : ''}`} style={{animationDelay: '0.4s'}}>
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
                {resumenFinanciero.ultimosIngresos.length > 0 ? (
                  resumenFinanciero.ultimosIngresos.map((ingreso) => (
                    <tr key={ingreso.id}>
                      <td>{ingreso.concepto}</td>
                      <td>${Number(ingreso.monto).toFixed(2)}</td>
                      <td>{ingreso.fecha}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">No hay ingresos registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="card-footer">
            <Link to="/finanzas/ingresos/nuevo" className="btn btn-primary">
              Nuevo Ingreso
            </Link>
          </div>
        </div>

        <div className={`dashboard-card ${animateCards ? 'card-animate' : ''}`} style={{animationDelay: '0.5s'}}>
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
                {resumenFinanciero.ultimosGastos.length > 0 ? (
                  resumenFinanciero.ultimosGastos.map((gasto) => (
                    <tr key={gasto.id}>
                      <td>{gasto.concepto}</td>
                      <td>${Number(gasto.monto).toFixed(2)}</td>
                      <td>{gasto.fecha}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">No hay gastos registrados</td>
                  </tr>
                )}
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
