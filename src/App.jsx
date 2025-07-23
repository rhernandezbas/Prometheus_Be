import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import EstudiantesList from './pages/EstudiantesList';
import EstudiantesForm from './pages/EstudiantesForm';
import EstudiantesEdit from './pages/EstudiantesEdit';
import EvaluacionesPorEstudiante from './pages/EvaluacionesPorEstudiante';
import EvaluacionesPorNivel from './pages/EvaluacionesPorNivel';
import NivelesBasico from './pages/NivelesBasico';
import NivelesIntermedio from './pages/NivelesIntermedio';
import NivelesAvanzado from './pages/NivelesAvanzado';
import AdministracionGastos from './pages/AdministracionGastos';
import AdministracionResumen from './pages/AdministracionResumen';
import ConfiguracionCriterios from './pages/ConfiguracionCriterios';
import Login from './pages/Login';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6a1b9a', // Morado para Timbashee
    },
    secondary: {
      main: '#4a148c',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

// Componente de carga mientras se verifica la autenticación
const LoadingScreen = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

// Componente para manejar las rutas de la aplicación
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <Routes>
      {/* Ruta pública para login */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
      
      {/* Ruta raíz - redirige al dashboard si está autenticado, o al login si no */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
      } />
      
      {/* Rutas protegidas */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/estudiantes" element={
        <ProtectedRoute>
          <Layout>
            <EstudiantesList />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/estudiantes/nuevo" element={
        <ProtectedRoute>
          <Layout>
            <EstudiantesForm />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/estudiantes/editar/:id" element={
        <ProtectedRoute>
          <Layout>
            <EstudiantesEdit />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/evaluaciones/estudiante" element={
        <ProtectedRoute>
          <Layout>
            <EvaluacionesPorEstudiante />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/evaluaciones/nivel" element={
        <ProtectedRoute>
          <Layout>
            <EvaluacionesPorNivel />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/niveles/basico" element={
        <ProtectedRoute>
          <Layout>
            <NivelesBasico />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/niveles/intermedio" element={
        <ProtectedRoute>
          <Layout>
            <NivelesIntermedio />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/niveles/avanzado" element={
        <ProtectedRoute>
          <Layout>
            <NivelesAvanzado />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/administracion/gastos" element={
        <ProtectedRoute>
          <Layout>
            <AdministracionGastos />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/administracion/resumen" element={
        <ProtectedRoute>
          <Layout>
            <AdministracionResumen />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/configuracion/criterios" element={
        <ProtectedRoute>
          <Layout>
            <ConfiguracionCriterios />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Ruta para manejar URLs no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Header />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
