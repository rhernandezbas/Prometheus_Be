import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { configuracionService } from '../services/api';

const ConfiguracionCriterios = () => {
  const [loading, setLoading] = useState(false);
  const [criterios, setCriterios] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [criterioForm, setCriterioForm] = useState({
    nombre: '',
    descripcion: '',
    puntajeMaximo: 10
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCriterios();
  }, []);

  const fetchCriterios = async () => {
    try {
      setLoading(true);
      
      // En un caso real, esta sería una llamada a tu API
      // const response = await configuracionService.getCriterios();
      
      // Por ahora usamos datos de ejemplo
      setTimeout(() => {
        const mockData = [
          { 
            id: 1, 
            nombre: 'Tiempo', 
            descripcion: 'Evaluación del manejo del tiempo durante la presentación',
            puntajeMaximo: 10
          },
          { 
            id: 2, 
            nombre: 'Expresión', 
            descripcion: 'Evaluación de la claridad y fluidez en la comunicación',
            puntajeMaximo: 10
          },
          { 
            id: 3, 
            nombre: 'Figura', 
            descripcion: 'Evaluación de la postura y presentación personal',
            puntajeMaximo: 10
          },
          { 
            id: 4, 
            nombre: 'Contenido', 
            descripcion: 'Evaluación de la calidad y relevancia del contenido presentado',
            puntajeMaximo: 10
          },
          { 
            id: 5, 
            nombre: 'Recursos', 
            descripcion: 'Evaluación del uso adecuado de recursos y materiales',
            puntajeMaximo: 10
          }
        ];
        
        setCriterios(mockData);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error al cargar criterios:", error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (criterio = null) => {
    if (criterio) {
      setCriterioForm({
        nombre: criterio.nombre,
        descripcion: criterio.descripcion,
        puntajeMaximo: criterio.puntajeMaximo
      });
      setEditingId(criterio.id);
    } else {
      setCriterioForm({
        nombre: '',
        descripcion: '',
        puntajeMaximo: 10
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
    setCriterioForm(prev => ({
      ...prev,
      [name]: name === 'puntajeMaximo' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmitCriterio = async () => {
    // Validación básica
    if (!criterioForm.nombre) {
      alert('El nombre del criterio es obligatorio');
      return;
    }
    
    try {
      // En un caso real, estas serían llamadas a tu API
      // if (editingId) {
      //   await configuracionService.updateCriterio(editingId, criterioForm);
      // } else {
      //   await configuracionService.createCriterio(criterioForm);
      // }
      
      // Simulamos la operación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Actualizar la lista de criterios
      if (editingId) {
        setCriterios(prev => 
          prev.map(c => c.id === editingId ? {...criterioForm, id: editingId} : c)
        );
      } else {
        const newId = Math.max(...criterios.map(c => c.id), 0) + 1;
        setCriterios(prev => [...prev, {...criterioForm, id: newId}]);
      }
      
      handleCloseDialog();
      
    } catch (error) {
      console.error("Error al guardar criterio:", error);
    }
  };

  const handleDeleteCriterio = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este criterio de evaluación?')) {
      try {
        // En un caso real, esta sería una llamada a tu API
        // await configuracionService.deleteCriterio(id);
        
        // Actualizar la lista después de eliminar
        setCriterios(prev => prev.filter(c => c.id !== id));
        
      } catch (error) {
        console.error("Error al eliminar criterio:", error);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configuración de Criterios de Evaluación
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Información
        </Typography>
        <Typography variant="body1" paragraph>
          Los criterios de evaluación son los parámetros utilizados para evaluar el desempeño de los estudiantes.
          Cada criterio puede tener un puntaje máximo que se utilizará como referencia en las evaluaciones.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Agregar Criterio
          </Button>
        </Box>
      </Paper>
      
      <Paper sx={{ width: '100%' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Puntaje Máximo</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {criterios.map((criterio) => (
                  <TableRow key={criterio.id}>
                    <TableCell>{criterio.nombre}</TableCell>
                    <TableCell>{criterio.descripcion}</TableCell>
                    <TableCell>{criterio.puntajeMaximo}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => handleOpenDialog(criterio)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleDeleteCriterio(criterio.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Diálogo para agregar/editar criterio */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Editar Criterio' : 'Nuevo Criterio'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="nombre"
                label="Nombre"
                value={criterioForm.nombre}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="descripcion"
                label="Descripción"
                value={criterioForm.descripcion}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="puntajeMaximo"
                label="Puntaje Máximo"
                type="number"
                value={criterioForm.puntajeMaximo}
                onChange={handleFormChange}
                fullWidth
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSubmitCriterio} 
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

export default ConfiguracionCriterios;
