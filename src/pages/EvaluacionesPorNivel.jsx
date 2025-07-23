import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { evaluacionesService, nivelesService } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EvaluacionesPorNivel = () => {
  const [loading, setLoading] = useState(false);
  const [niveles, setNiveles] = useState([]);
  const [selectedNivel, setSelectedNivel] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    fetchNiveles();
  }, []);

  useEffect(() => {
    if (selectedNivel) {
      fetchEstudiantesPorNivel();
      fetchEvaluacionesPorNivel();
    }
  }, [selectedNivel]);

  const fetchNiveles = async () => {
    try {
      setLoading(true);
      
      // En un caso real, esta sería una llamada a tu API
      // const response = await nivelesService.getAll();
      
      // Por ahora usamos datos de ejemplo
      setTimeout(() => {
        const mockData = [
          { id: 1, nombre: 'Básico' },
          { id: 2, nombre: 'Intermedio' },
          { id: 3, nombre: 'Avanzado' },
        ];
        
        setNiveles(mockData);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error al cargar niveles:", error);
      setLoading(false);
    }
  };

  const fetchEstudiantesPorNivel = async () => {
    if (!selectedNivel) return;
    
    try {
      setLoading(true);
      
      // En un caso real, esta sería una llamada a tu API
      // const response = await nivelesService.getEstudiantesByNivel(selectedNivel);
      
      // Por ahora usamos datos de ejemplo
      setTimeout(() => {
        const mockData = [
          { id: 1, nombre: 'José Rivera', edad: 16, email: 'jose@example.com' },
          { id: 2, nombre: 'María Gómez', edad: 15, email: 'maria@example.com' },
          { id: 3, nombre: 'Carlos Pérez', edad: 16, email: 'carlos@example.com' },
          { id: 4, nombre: 'Ana Martínez', edad: 15, email: 'ana@example.com' },
          { id: 5, nombre: 'Luis Rodríguez', edad: 16, email: 'luis@example.com' },
        ];
        
        setEstudiantes(mockData);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error al cargar estudiantes por nivel:", error);
      setLoading(false);
    }
  };

  const fetchEvaluacionesPorNivel = async () => {
    if (!selectedNivel) return;
    
    try {
      setLoading(true);
      
      // En un caso real, esta sería una llamada a tu API
      // const response = await evaluacionesService.getByNivel(selectedNivel);
      
      // Por ahora usamos datos de ejemplo
      setTimeout(() => {
        const mockData = {
          promedios: {
            tiempo: 7.5,
            expresion: 8.2,
            figura: 6.8
          },
          evaluaciones: [
            { 
              estudiante: 'José Rivera', 
              criterios: {
                tiempo: 8,
                expresion: 9,
                figura: 7
              }
            },
            { 
              estudiante: 'María Gómez', 
              criterios: {
                tiempo: 7,
                expresion: 8,
                figura: 6
              }
            },
            { 
              estudiante: 'Carlos Pérez', 
              criterios: {
                tiempo: 9,
                expresion: 7,
                figura: 8
              }
            },
            { 
              estudiante: 'Ana Martínez', 
              criterios: {
                tiempo: 6,
                expresion: 9,
                figura: 7
              }
            },
            { 
              estudiante: 'Luis Rodríguez', 
              criterios: {
                tiempo: 8,
                expresion: 8,
                figura: 6
              }
            }
          ]
        };
        
        setEvaluaciones(mockData.evaluaciones);
        
        // Preparar datos para el gráfico
        setChartData({
          labels: ['Tiempo', 'Expresión', 'Figura'],
          datasets: [
            {
              label: 'Promedio del Nivel',
              data: [mockData.promedios.tiempo, mockData.promedios.expresion, mockData.promedios.figura],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        });
        
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error al cargar evaluaciones por nivel:", error);
      setLoading(false);
    }
  };

  const handleNivelChange = (event) => {
    setSelectedNivel(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getNivelNombre = () => {
    const nivel = niveles.find(n => n.id === parseInt(selectedNivel));
    return nivel ? nivel.nombre : '';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Evaluaciones por Nivel
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Seleccionar Nivel</InputLabel>
          <Select
            value={selectedNivel}
            onChange={handleNivelChange}
            label="Seleccionar Nivel"
          >
            {niveles.map((nivel) => (
              <MenuItem key={nivel.id} value={nivel.id}>
                {nivel.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
      
      {selectedNivel && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Nivel: {getNivelNombre()}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ height: 300 }}>
                <Bar 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 10
                      }
                    },
                    plugins: {
                      title: {
                        display: true,
                        text: 'Promedios por Criterio de Evaluación'
                      },
                      legend: {
                        position: 'top'
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
          
          <Paper>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Estudiantes" />
              <Tab label="Evaluaciones Detalladas" />
            </Tabs>
            
            <Box sx={{ p: 2 }}>
              {tabValue === 0 ? (
                loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Edad</TableCell>
                          <TableCell>Email</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {estudiantes.map((estudiante) => (
                          <TableRow key={estudiante.id}>
                            <TableCell>{estudiante.nombre}</TableCell>
                            <TableCell>{estudiante.edad}</TableCell>
                            <TableCell>{estudiante.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )
              ) : (
                loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Estudiante</TableCell>
                          <TableCell>Tiempo</TableCell>
                          <TableCell>Expresión</TableCell>
                          <TableCell>Figura</TableCell>
                          <TableCell>Promedio</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {evaluaciones.map((evaluacion, index) => {
                          const promedio = (
                            evaluacion.criterios.tiempo + 
                            evaluacion.criterios.expresion + 
                            evaluacion.criterios.figura
                          ) / 3;
                          
                          return (
                            <TableRow key={index}>
                              <TableCell>{evaluacion.estudiante}</TableCell>
                              <TableCell>{evaluacion.criterios.tiempo}</TableCell>
                              <TableCell>{evaluacion.criterios.expresion}</TableCell>
                              <TableCell>{evaluacion.criterios.figura}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={promedio.toFixed(1)} 
                                  color={promedio >= 8 ? 'success' : promedio >= 6 ? 'primary' : 'warning'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )
              )}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default EvaluacionesPorNivel;
