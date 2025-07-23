import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Divider,
  Chip,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import { nivelesService, evaluacionesService } from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import SubnivelList from '../components/SubnivelList';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const NivelesAvanzado = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [nivelData, setNivelData] = useState({
    totalEstudiantes: 0,
    promedioEdad: 0,
    distribucionGenero: { masculino: 0, femenino: 0 },
    promedioEvaluaciones: 0,
    estudiantes: []
  });
  
  const [chartData, setChartData] = useState({
    evaluaciones: {
      labels: [],
      datasets: []
    }
  });

  useEffect(() => {
    fetchNivelData();
  }, []);

  const fetchNivelData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener estudiantes del nivel avanzado
      const estudiantesResponse = await nivelesService.getAvanzado();
      console.log('Respuesta de estudiantes nivel avanzado:', estudiantesResponse);
      
      // Extraer estudiantes de la respuesta
      let estudiantes = [];
      if (Array.isArray(estudiantesResponse.data)) {
        estudiantes = estudiantesResponse.data;
      } else if (estudiantesResponse.data && Array.isArray(estudiantesResponse.data.alumnos)) {
        estudiantes = estudiantesResponse.data.alumnos;
      } else if (estudiantesResponse.data && Array.isArray(estudiantesResponse.data.estudiantes)) {
        estudiantes = estudiantesResponse.data.estudiantes;
      } else {
        console.warn('Formato de respuesta inesperado para estudiantes:', estudiantesResponse.data);
        estudiantes = [];
      }
      
      // Calcular estadísticas
      const totalEstudiantes = estudiantes.length;
      
      // Calcular promedio de edad
      let sumaEdades = 0;
      estudiantes.forEach(estudiante => {
        if (estudiante.edad) {
          sumaEdades += parseInt(estudiante.edad);
        } else if (estudiante.dateOfBirth) {
          // Calcular edad a partir de la fecha de nacimiento si está disponible
          const fechaNacimiento = new Date(estudiante.dateOfBirth);
          const hoy = new Date();
          let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
          const mes = hoy.getMonth() - fechaNacimiento.getMonth();
          if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
          }
          sumaEdades += edad;
        }
      });
      const promedioEdad = totalEstudiantes > 0 ? sumaEdades / totalEstudiantes : 0;
      
      // Calcular distribución de género
      let masculino = 0;
      let femenino = 0;
      estudiantes.forEach(estudiante => {
        if (estudiante.genero === 'M' || estudiante.gender === 'M' || estudiante.gender === 'Masculino') {
          masculino++;
        } else if (estudiante.genero === 'F' || estudiante.gender === 'F' || estudiante.gender === 'Femenino') {
          femenino++;
        }
      });
      
      // Intentar obtener evaluaciones para este nivel
      try {
        const evaluacionesResponse = await evaluacionesService.getByNivel('Avanzado');
        console.log('Respuesta de evaluaciones nivel avanzado:', evaluacionesResponse);
        
        // Procesar datos para el gráfico de evaluaciones
        const evaluaciones = Array.isArray(evaluacionesResponse.data) 
          ? evaluacionesResponse.data 
          : (evaluacionesResponse.data?.evaluaciones || []);
        
        // Calcular promedio de evaluaciones
        let sumaEvaluaciones = 0;
        evaluaciones.forEach(evaluacion => {
          if (evaluacion.calificacion) {
            sumaEvaluaciones += parseFloat(evaluacion.calificacion);
          }
        });
        const promedioEvaluaciones = evaluaciones.length > 0 ? sumaEvaluaciones / evaluaciones.length : 0;
        
        // Preparar datos para el gráfico
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const evaluacionesPorMes = Array(12).fill(0);
        
        evaluaciones.forEach(evaluacion => {
          if (evaluacion.fecha) {
            const fecha = new Date(evaluacion.fecha);
            const mes = fecha.getMonth();
            evaluacionesPorMes[mes]++;
          }
        });
        
        setChartData({
          evaluaciones: {
            labels: meses,
            datasets: [
              {
                label: 'Evaluaciones por Mes',
                data: evaluacionesPorMes,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
              }
            ]
          }
        });
        
        // Actualizar el estado con todos los datos
        setNivelData({
          totalEstudiantes,
          promedioEdad,
          distribucionGenero: { masculino, femenino },
          promedioEvaluaciones,
          estudiantes
        });
        
      } catch (evaluacionError) {
        console.error("Error al cargar evaluaciones:", evaluacionError);
        // Continuar con los datos de estudiantes aunque fallen las evaluaciones
        setNivelData({
          totalEstudiantes,
          promedioEdad,
          distribucionGenero: { masculino, femenino },
          promedioEvaluaciones: 0,
          estudiantes
        });
      }
      
    } catch (error) {
      console.error("Error al cargar datos del nivel:", error);
      setError("No se pudieron cargar los datos del nivel. Por favor, intente nuevamente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getNombreCompleto = (estudiante) => {
    if (!estudiante) return 'Sin nombre';
    
    // Si tiene nombre y apellido separados
    if (estudiante.nombre && estudiante.apellido) {
      return `${estudiante.nombre} ${estudiante.apellido}`;
    }
    // Si tiene name y lastname
    else if (estudiante.name && estudiante.lastname) {
      return `${estudiante.name} ${estudiante.lastname}`;
    }
    // Si solo tiene nombre
    else if (estudiante.nombre) {
      return estudiante.nombre;
    }
    // Si solo tiene name
    else if (estudiante.name) {
      return estudiante.name;
    }
    // Si tiene nombre_completo
    else if (estudiante.nombre_completo) {
      return estudiante.nombre_completo;
    }
    // Si no tiene ninguno de los anteriores
    else {
      return 'Sin nombre';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Nivel Avanzado</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Resumen" />
        <Tab label="Estudiantes" />
        <Tab label="Evaluaciones" />
        <Tab label="Subniveles" />
      </Tabs>
      
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total de Estudiantes</Typography>
                <Typography variant="h3">{nivelData.totalEstudiantes}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Promedio de Edad</Typography>
                <Typography variant="h3">{nivelData.promedioEdad.toFixed(1)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Promedio de Evaluaciones</Typography>
                <Typography variant="h3">{nivelData.promedioEvaluaciones.toFixed(1)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Distribución por Género</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1">Masculino</Typography>
                    <Typography variant="h4">{nivelData.distribucionGenero.masculino}</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1">Femenino</Typography>
                    <Typography variant="h4">{nivelData.distribucionGenero.femenino}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Evaluaciones por Mes</Typography>
                <Box sx={{ height: 300 }}>
                  <Bar 
                    data={chartData.evaluaciones}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {tabValue === 1 && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Edad</TableCell>
                  <TableCell>Género</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Teléfono</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nivelData.estudiantes.length > 0 ? (
                  nivelData.estudiantes.map((estudiante) => (
                    <TableRow key={estudiante.id || estudiante._id}>
                      <TableCell>{getNombreCompleto(estudiante)}</TableCell>
                      <TableCell>{estudiante.edad || estudiante.age || '-'}</TableCell>
                      <TableCell>{estudiante.genero || estudiante.gender || '-'}</TableCell>
                      <TableCell>{estudiante.email || estudiante.mail || '-'}</TableCell>
                      <TableCell>{estudiante.telefono || estudiante.telephone || '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No hay estudiantes en este nivel
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      
      {tabValue === 2 && (
        <Typography variant="body1">
          {chartData.evaluaciones.datasets[0].data.reduce((a, b) => a + b, 0) > 0 ? (
            <Paper>
              <Box sx={{ p: 3, height: 400 }}>
                <Bar 
                  data={chartData.evaluaciones}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Evaluaciones por Mes - Nivel Avanzado'
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          ) : (
            <Alert severity="info">
              No hay datos de evaluaciones disponibles para este nivel.
            </Alert>
          )}
        </Typography>
      )}

      {tabValue === 3 && (
        <SubnivelList nivel="Avanzado" />
      )}
    </Box>
  );
};

export default NivelesAvanzado;
