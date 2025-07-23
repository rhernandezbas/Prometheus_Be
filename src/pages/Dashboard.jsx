import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  PeopleAlt as PeopleIcon, 
  School as SchoolIcon, 
  Assessment as AssessmentIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { estudiantesService, evaluacionesService, administracionService } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEstudiantes: 0,
    estudiantesPorNivel: {
      basico: 0,
      intermedio: 0,
      avanzado: 0
    },
    evaluacionesRecientes: 0,
    ingresosMensuales: 0
  });
  
  const [chartData, setChartData] = useState({
    estudiantes: {
      labels: ['Básico', 'Intermedio', 'Avanzado'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ['#4caf50', '#2196f3', '#9c27b0'],
      }]
    },
    evaluaciones: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [{
        label: 'Evaluaciones',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: '#3f51b5',
      }]
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener datos de estudiantes
        const estudiantesResponse = await estudiantesService.getAll();
        
        // Asegurarse de que estudiantes sea un array
        const estudiantes = Array.isArray(estudiantesResponse.data) 
          ? estudiantesResponse.data 
          : estudiantesResponse.data?.estudiantes || [];
        
        console.log('Datos de estudiantes:', estudiantes);
        
        // Contar estudiantes por nivel
        const nivelCounts = {};
        if (Array.isArray(estudiantes)) {
          estudiantes.forEach(estudiante => {
            const nivel = estudiante.nivel?.toLowerCase() || 'sin nivel';
            nivelCounts[nivel] = (nivelCounts[nivel] || 0) + 1;
          });
        }
        
        // Obtener datos de evaluaciones recientes
        const evaluacionesResponse = await evaluacionesService.getByNivel('all');
        
        // Asegurarse de que evaluaciones sea un array
        const evaluaciones = Array.isArray(evaluacionesResponse.data) 
          ? evaluacionesResponse.data 
          : evaluacionesResponse.data?.evaluaciones || [];
        
        console.log('Datos de evaluaciones:', evaluaciones);
        
        // Obtener datos financieros
        const resumenFinancieroResponse = await administracionService.getResumen();
        const resumenFinanciero = resumenFinancieroResponse.data || {};
        const ingresosMensuales = resumenFinanciero.ingresosMensuales || 0;
        
        console.log('Datos financieros:', resumenFinanciero);
        
        // Preparar datos para gráficos de evaluaciones por mes
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const mesActual = new Date().getMonth();
        const ultimosSeisMeses = meses.slice(Math.max(0, mesActual - 5), mesActual + 1);
        
        // Contar evaluaciones por mes
        const evaluacionesPorMes = {};
        if (Array.isArray(evaluaciones)) {
          evaluaciones.forEach(evaluacion => {
            if (evaluacion.fecha) {
              const fecha = new Date(evaluacion.fecha);
              const mes = meses[fecha.getMonth()];
              if (ultimosSeisMeses.includes(mes)) {
                evaluacionesPorMes[mes] = (evaluacionesPorMes[mes] || 0) + 1;
              }
            }
          });
        }
        
        // Actualizar estado con datos reales
        setStats({
          totalEstudiantes: Array.isArray(estudiantes) ? estudiantes.length : 0,
          estudiantesPorNivel: {
            basico: nivelCounts.basico || 0,
            intermedio: nivelCounts.intermedio || 0,
            avanzado: nivelCounts.avanzado || 0
          },
          evaluacionesRecientes: Array.isArray(evaluaciones) ? evaluaciones.length : 0,
          ingresosMensuales: ingresosMensuales
        });
        
        setChartData({
          estudiantes: {
            labels: ['Básico', 'Intermedio', 'Avanzado'],
            datasets: [{
              data: [
                nivelCounts.basico || 0,
                nivelCounts.intermedio || 0,
                nivelCounts.avanzado || 0
              ],
              backgroundColor: ['#4caf50', '#2196f3', '#9c27b0'],
            }]
          },
          evaluaciones: {
            labels: ultimosSeisMeses,
            datasets: [{
              label: 'Evaluaciones',
              data: ultimosSeisMeses.map(mes => evaluacionesPorMes[mes] || 0),
              backgroundColor: '#3f51b5',
            }]
          }
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
        setError("No se pudieron cargar los datos del dashboard. Por favor, intente nuevamente más tarde.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h5">{stats.totalEstudiantes}</Typography>
                <Typography variant="body2" color="text.secondary">Estudiantes</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
              <Box>
                <Typography variant="h5">{stats.estudiantesPorNivel.avanzado}</Typography>
                <Typography variant="body2" color="text.secondary">Nivel Avanzado</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <AssessmentIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h5">{stats.evaluacionesRecientes}</Typography>
                <Typography variant="body2" color="text.secondary">Evaluaciones Recientes</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <MoneyIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h5">${stats.ingresosMensuales.toLocaleString()}</Typography>
                <Typography variant="body2" color="text.secondary">Ingresos Mensuales</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Estudiantes por Nivel" />
            <CardContent>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <Pie data={chartData.estudiantes} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Evaluaciones por Mes" />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Bar 
                  data={chartData.evaluaciones} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
