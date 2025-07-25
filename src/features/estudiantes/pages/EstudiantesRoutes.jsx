import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importar páginas del módulo de estudiantes
const EstudiantesIndex = React.lazy(() => import('./EstudiantesIndex.jsx'));
const EstudianteDetalle = React.lazy(() => import('./EstudianteDetalle.jsx'));
const EstudianteForm = React.lazy(() => import('./EstudianteForm.jsx'));
const EvaluacionesEstudiante = React.lazy(() => import('./EvaluacionesEstudiante.jsx'));
const NivelesLista = React.lazy(() => import('./NivelesLista.jsx'));

const EstudiantesRoutes = () => {
  return (
    <React.Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        <Route index element={<EstudiantesIndex />} />
        <Route path="nuevo" element={<EstudianteForm />} />
        <Route path="editar/:id" element={<EstudianteForm />} />
        <Route path=":id" element={<EstudianteDetalle />} />
        <Route path=":id/evaluaciones" element={<EvaluacionesEstudiante />} />
        <Route path="niveles" element={<NivelesLista />} />
        <Route path="niveles/:nivel" element={<EstudiantesIndex />} />
        <Route path="niveles/:nivel/subnivel/:subnivel" element={<EstudiantesIndex />} />
      </Routes>
    </React.Suspense>
  );
};

export default EstudiantesRoutes;
