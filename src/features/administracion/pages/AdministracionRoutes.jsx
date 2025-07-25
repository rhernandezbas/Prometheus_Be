import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importar páginas del módulo de administración
const AdministracionIndex = React.lazy(() => import('./AdministracionIndex.jsx'));
const ConfiguracionPanel = React.lazy(() => import('./ConfiguracionPanel.jsx'));
const InstructoresLista = React.lazy(() => import('./InstructoresLista.jsx'));
const InstructorForm = React.lazy(() => import('./InstructorForm.jsx'));
const InstructorDetalle = React.lazy(() => import('./InstructorDetalle.jsx'));

const AdministracionRoutes = () => {
  return (
    <React.Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        <Route index element={<AdministracionIndex />} />
        <Route path="configuracion" element={<ConfiguracionPanel />} />
        <Route path="instructores" element={<InstructoresLista />} />
        <Route path="instructores/nuevo" element={<InstructorForm />} />
        <Route path="instructores/editar/:id" element={<InstructorForm />} />
        <Route path="instructores/:id" element={<InstructorDetalle />} />
      </Routes>
    </React.Suspense>
  );
};

export default AdministracionRoutes;
