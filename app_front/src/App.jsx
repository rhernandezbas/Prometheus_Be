import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Páginas principales
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Importaciones de módulos por características
import EstudiantesRoutes from './features/estudiantes/pages/EstudiantesRoutes';
import AdministracionRoutes from './features/administracion/pages/AdministracionRoutes';
import FinanzasRoutes from './features/finanzas/pages/FinanzasRoutes';

import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas protegidas con layout común */}
          <Route element={<Layout />}>
            {/* Ruta principal */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas de módulos */}
            <Route path="/estudiantes/*" element={
              <ProtectedRoute>
                <EstudiantesRoutes />
              </ProtectedRoute>
            } />
            
            <Route path="/administracion/*" element={
              <ProtectedRoute>
                <AdministracionRoutes />
              </ProtectedRoute>
            } />
            
            <Route path="/finanzas/*" element={
              <ProtectedRoute>
                <FinanzasRoutes />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
