import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importar páginas del módulo de estudiantes
const EstudiantesIndex = React.lazy(() => import('./EstudiantesIndex'));
const EstudianteDetalle = React.lazy(() => import('./EstudianteDetalle'));
const EstudianteForm = React.lazy(() => import('./EstudianteForm'));
const EvaluacionesEstudiante = React.lazy(() => import('./EvaluacionesEstudiante'));
const NivelesLista = React.lazy(() => import('./NivelesLista'));

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
