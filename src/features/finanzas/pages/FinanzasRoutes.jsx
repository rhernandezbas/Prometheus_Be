import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importar páginas del módulo de finanzas
const FinanzasIndex = React.lazy(() => import('./FinanzasIndex.jsx'));
const GastosLista = React.lazy(() => import('./GastosLista.jsx'));
const GastoForm = React.lazy(() => import('./GastoForm.jsx'));
const IngresosLista = React.lazy(() => import('./IngresosLista.jsx'));
const IngresoForm = React.lazy(() => import('./IngresoForm.jsx'));
const BalanceFinanciero = React.lazy(() => import('./BalanceFinanciero.jsx'));
const ReportesFinancieros = React.lazy(() => import('./ReportesFinancieros.jsx'));

const FinanzasRoutes = () => {
  return (
    <React.Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        <Route index element={<FinanzasIndex />} />
        <Route path="gastos" element={<GastosLista />} />
        <Route path="gastos/nuevo" element={<GastoForm />} />
        <Route path="gastos/editar/:id" element={<GastoForm />} />
        <Route path="ingresos" element={<IngresosLista />} />
        <Route path="ingresos/nuevo" element={<IngresoForm />} />
        <Route path="ingresos/editar/:id" element={<IngresoForm />} />
        <Route path="balance" element={<BalanceFinanciero />} />
        <Route path="reportes" element={<ReportesFinancieros />} />
      </Routes>
    </React.Suspense>
  );
};

export default FinanzasRoutes;
