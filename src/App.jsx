import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Páginas principales
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';

// Importaciones de módulos por características
import EstudiantesRoutes from './features/estudiantes/pages/EstudiantesRoutes.jsx';
import AdministracionRoutes from './features/administracion/pages/AdministracionRoutes.jsx';
import FinanzasRoutes from './features/finanzas/pages/FinanzasRoutes.jsx';

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
