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
  Button,
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
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { evaluacionesService, estudiantesService } from '../services/api';

const EvaluacionesPorEstudiante = () => {
  const [loading, setLoading] = useState(false);
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [perfilEstudiante, setPerfilEstudiante] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [evaluacionForm, setEvaluacionForm] = useState({
    criterio: '',
    puntaje: '',
    fecha: '',
    observaciones: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  useEffect(() => {
    if (selectedEstudiante) {
      fetchEvaluaciones();
      fetchPerfilEstudiante();
    }
  }, [selectedEstudiante]);

  const fetchEstudiantes = async () => {
    try {
      setLoading(true);
      
      // En un caso real, esta sería una llamada a tu API
      // const response = await estudiantesService.getAll();
      
      // Por ahora usamos datos de ejemplo
      setTimeout(() => {
        const mockData = [
          { id: 1, nombre: 'María Flores' },
          { id: 2, nombre: 'Alberto Ruiz' },
          { id: 3, nombre: 'Ana Castro' },
          { id: 4, nombre: 'José Rodríguez' },
          { id: 5, nombre: 'Carla Pérez' }
        ];
        
        setEstudiantes(mockData);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      setLoading(false);
    }
  };

  const fetchEvaluaciones = async () => {
    if (!selectedEstudiante) return;
    
    try {
      setLoading(true);
      
      // En un caso real, esta sería una llamada a tu API
      // const response = await evaluacionesService.getByEstudiante(selectedEstudiante);
      
      // Por ahora usamos datos de ejemplo
      setTimeout(() => {
        const mockData = [
          { 
            id: 1, 
            criterio: 'Tiempo', 
            puntaje: 8, 
            fecha: '2023-05-15',
            observaciones: 'Buena administración del tiempo'
          },
          { 
            id: 2, 
            criterio: 'Expresión', 
            puntaje: 7, 
            fecha: '2023-05-15',
            observaciones: 'Mejorando en fluidez verbal'
          },
          { 
            id: 3, 
            criterio: 'Figura', 
            puntaje: 9, 
            fecha: '2023-05-15',
            observaciones: 'Excelente postura y presentación'
          },
          { 
            id: 4, 
            criterio: 'Tiempo', 
            puntaje: 9, 
            fecha: '2023-06-20',
            observaciones: 'Ha mejorado significativamente'
          },
          { 
            id: 5, 
            criterio: 'Expresión', 
            puntaje: 8, 
            fecha: '2023-06-20',
            observaciones: 'Mayor confianza al hablar'
          }
        ];
        
        setEvaluaciones(mockData);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error al cargar evaluaciones:", error);
      setLoading(false);
    }
  };

  const fetchPerfilEstudiante = async () => {
    if (!selectedEstudiante) return;
    
    try {
      // En un caso real, esta sería una llamada a tu API
      // const response = await estudiantesService.getById(selectedEstudiante);
      
      // Por ahora usamos datos de ejemplo
      setTimeout(() => {
        const mockData = {
          id: selectedEstudiante,
          nombre: estudiantes.find(e => e.id === parseInt(selectedEstudiante))?.nombre || '',
          nivel: 'Intermedio 1',
          edad: 15,
          fechaInscripcion: '2023-01-15',
          email: 'estudiante@example.com',
          telefono: '123456789'
        };
        
        setPerfilEstudiante(mockData);
      }, 300);
      
    } catch (error) {
      console.error("Error al cargar perfil del estudiante:", error);
    }
  };

  const handleEstudianteChange = (event) => {
    setSelectedEstudiante(event.target.value);
  };

  const handleOpenDialog = (evaluacion = null) => {
    if (evaluacion) {
      setEvaluacionForm({
        criterio: evaluacion.criterio,
        puntaje: evaluacion.puntaje,
        fecha: evaluacion.fecha,
        observaciones: evaluacion.observaciones
      });
      setEditingId(evaluacion.id);
    } else {
      setEvaluacionForm({
        criterio: '',
        puntaje: '',
        fecha: new Date().toISOString().split('T')[0],
        observaciones: ''
      });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEvaluacionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEvaluacion = async () => {
    try {
      // En un caso real, estas serían llamadas a tu API
      // if (editingId) {
      //   await evaluacionesService.update(editingId, {
      //     ...evaluacionForm,
      //     estudianteId: selectedEstudiante
      //   });
      // } else {
      //   await evaluacionesService.create({
      //     ...evaluacionForm,
      //     estudianteId: selectedEstudiante
      //   });
      // }
      
      // Simulamos la operación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Actualizar la lista de evaluaciones
      if (editingId) {
        setEvaluaciones(prev => 
          prev.map(ev => ev.id === editingId ? {...evaluacionForm, id: editingId} : ev)
        );
      } else {
        const newId = Math.max(...evaluaciones.map(e => e.id), 0) + 1;
        setEvaluaciones(prev => [...prev, {...evaluacionForm, id: newId}]);
      }
      
      handleCloseDialog();
      
    } catch (error) {
      console.error("Error al guardar evaluación:", error);
    }
  };

  const handleDeleteEvaluacion = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta evaluación?')) {
      try {
        // En un caso real, esta sería una llamada a tu API
        // await evaluacionesService.delete(id);
        
        // Actualizar la lista después de eliminar
        setEvaluaciones(prev => prev.filter(ev => ev.id !== id));
        
      } catch (error) {
        console.error("Error al eliminar evaluación:", error);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Evaluaciones por Estudiante
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Seleccionar Estudiante</InputLabel>
              <Select
                value={selectedEstudiante}
                onChange={handleEstudianteChange}
                label="Seleccionar Estudiante"
              >
                {estudiantes.map((estudiante) => (
                  <MenuItem key={estudiante.id} value={estudiante.id}>
                    {estudiante.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
          
          {perfilEstudiante && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Perfil del Estudiante
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Nombre
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">
                      {perfilEstudiante.nombre}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Nivel
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">
                      {perfilEstudiante.nivel}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Edad
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">
                      {perfilEstudiante.edad} años
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">
                      {perfilEstudiante.email}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
        
        <Grid item xs={12} md={8}>
          {selectedEstudiante ? (
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Historial de Evaluaciones
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Agregar Evaluación
                </Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : evaluaciones.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Criterio</TableCell>
                        <TableCell>Puntaje</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Observaciones</TableCell>
                        <TableCell align="right">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {evaluaciones.map((evaluacion) => (
                        <TableRow key={evaluacion.id}>
                          <TableCell>{evaluacion.criterio}</TableCell>
                          <TableCell>{evaluacion.puntaje}</TableCell>
                          <TableCell>{evaluacion.fecha}</TableCell>
                          <TableCell>{evaluacion.observaciones}</TableCell>
                          <TableCell align="right">
                            <IconButton 
                              color="primary" 
                              size="small"
                              onClick={() => handleOpenDialog(evaluacion)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              size="small"
                              onClick={() => handleDeleteEvaluacion(evaluacion.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" sx={{ py: 3, textAlign: 'center' }}>
                  No hay evaluaciones registradas para este estudiante.
                </Typography>
              )}
            </Paper>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">
                Selecciona un estudiante para ver sus evaluaciones.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Diálogo para agregar/editar evaluación */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Editar Evaluación' : 'Nueva Evaluación'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Criterio</InputLabel>
                <Select
                  name="criterio"
                  value={evaluacionForm.criterio}
                  onChange={handleFormChange}
                  label="Criterio"
                >
                  <MenuItem value="Tiempo">Tiempo</MenuItem>
                  <MenuItem value="Expresión">Expresión</MenuItem>
                  <MenuItem value="Figura">Figura</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="puntaje"
                label="Puntaje (0-10)"
                type="number"
                value={evaluacionForm.puntaje}
                onChange={handleFormChange}
                fullWidth
                inputProps={{ min: 0, max: 10 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="fecha"
                label="Fecha"
                type="date"
                value={evaluacionForm.fecha}
                onChange={handleFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="observaciones"
                label="Observaciones"
                value={evaluacionForm.observaciones}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSubmitEvaluacion} 
            variant="contained" 
            color="primary"
          >
            {editingId ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EvaluacionesPorEstudiante;
