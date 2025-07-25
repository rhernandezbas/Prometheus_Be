import React, { useState, useEffect } from 'react';
import { finanzasService } from '../services/finanzas.service.js';

const BalanceFinanciero = () => {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    año: new Date().getFullYear(),
    mes: new Date().getMonth() + 1
  });

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await finanzasService.getBalance(filtros);
      setBalanceData(response.data);
    } catch (err) {
      console.error('Error al cargar balance financiero:', err);
      setError('Error al cargar el balance financiero');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFiltrar = (e) => {
    e.preventDefault();
    fetchBalance();
  };

  if (loading && !balanceData) {
    return <div className="loading">Cargando balance financiero...</div>;
  }

  // Si no hay datos reales, usar datos de muestra
  const balanceMuestra = {
    periodo: `${filtros.mes}/${filtros.año}`,
    ingresos: {
      total: 25000,
      categorias: [
        { categoria: 'Inscripción', monto: 8000 },
        { categoria: 'Mensualidad', monto: 12000 },
        { categoria: 'Curso', monto: 3000 },
        { categoria: 'Material', monto: 1500 },
        { categoria: 'Otros', monto: 500 }
      ]
    },
    gastos: {
      total: 18000,
      categorias: [
        { categoria: 'Personal', monto: 10000 },
        { categoria: 'Material', monto: 2000 },
        { categoria: 'Servicios', monto: 3000 },
        { categoria: 'Instalaciones', monto: 2000 },
        { categoria: 'Equipamiento', monto: 1000 }
      ]
    },
    balance: 7000,
    tendencia: {
      ultimos6Meses: [
        { mes: 'Febrero', ingresos: 22000, gastos: 17000, balance: 5000 },
        { mes: 'Marzo', ingresos: 23000, gastos: 17500, balance: 5500 },
        { mes: 'Abril', ingresos: 24000, gastos: 18000, balance: 6000 },
        { mes: 'Mayo', ingresos: 24500, gastos: 18500, balance: 6000 },
        { mes: 'Junio', ingresos: 25000, gastos: 18000, balance: 7000 },
        { mes: 'Julio', ingresos: 25000, gastos: 18000, balance: 7000 }
      ]
    }
  };

  const displayBalance = balanceData || balanceMuestra;

  return (
    <div className="balance-container">
      <div className="page-header">
        <h1>Balance Financiero</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="filtros-panel">
        <h2>Filtros</h2>
        <form onSubmit={handleFiltrar}>
          <div className="filtros-grid">
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
          </div>
          <div className="filtros-actions">
            <button type="submit" className="btn btn-primary">
              Aplicar Filtros
            </button>
          </div>
        </form>
      </div>

      <div className="balance-summary">
        <div className="summary-card ingresos">
          <h2>Total Ingresos</h2>
          <div className="amount">${displayBalance.ingresos.total}</div>
        </div>
        
        <div className="summary-card gastos">
          <h2>Total Gastos</h2>
          <div className="amount">${displayBalance.gastos.total}</div>
        </div>
        
        <div className="summary-card balance">
          <h2>Balance</h2>
          <div className="amount">${displayBalance.balance}</div>
        </div>
      </div>

      <div className="balance-details">
        <div className="balance-card">
          <h2>Detalle de Ingresos</h2>
          <div className="chart-container">
            {/* Aquí se podría integrar un gráfico de pastel */}
            <div className="pie-chart-placeholder">
              {displayBalance.ingresos.categorias.map((item, index) => (
                <div key={index} className="chart-item">
                  <div className="color-box" style={{ backgroundColor: getColor(index) }}></div>
                  <div className="item-label">{item.categoria}</div>
                  <div className="item-value">${item.monto}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="balance-card">
          <h2>Detalle de Gastos</h2>
          <div className="chart-container">
            {/* Aquí se podría integrar un gráfico de pastel */}
            <div className="pie-chart-placeholder">
              {displayBalance.gastos.categorias.map((item, index) => (
                <div key={index} className="chart-item">
                  <div className="color-box" style={{ backgroundColor: getColor(index + 5) }}></div>
                  <div className="item-label">{item.categoria}</div>
                  <div className="item-value">${item.monto}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tendencia-section">
        <h2>Tendencia de los Últimos 6 Meses</h2>
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
                {displayBalance.tendencia.ultimos6Meses.map((item, index) => (
                  <tr key={index}>
                    <td>{item.mes}</td>
                    <td>${item.ingresos}</td>
                    <td>${item.gastos}</td>
                    <td>${item.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Función auxiliar para generar colores para los gráficos
const getColor = (index) => {
  const colors = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#d35400', '#34495e', '#16a085', '#c0392b'
  ];
  return colors[index % colors.length];
};

export default BalanceFinanciero;
