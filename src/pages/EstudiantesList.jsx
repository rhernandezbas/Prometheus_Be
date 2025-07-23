import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { estudiantesService } from '../services/api';

const EstudiantesList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [estudiantes, setEstudiantes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    fetchEstudiantes();
  }, [page, rowsPerPage, search]);

  const fetchEstudiantes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir parámetros de consulta para paginación y búsqueda
      const params = {
        page: page + 1, // Ajustar para API que comienza en página 1
        per_page: rowsPerPage
      };
      
      if (search) {
        params.search = search;
      }
      
      console.log('Enviando solicitud a estudiantes con params:', params);
      console.log('Token JWT:', localStorage.getItem('access_token') ? 'Presente' : 'No presente');
      
      // Llamar a la API real
      try {
        const response = await estudiantesService.getAll(params);
        console.log('Respuesta completa de API estudiantes:', response);
        
        // Extraer datos de la respuesta
        let estudiantesData = [];
        let total = 0;
        
        // Analizar la estructura de la respuesta
        if (response && response.data) {
          // Si la respuesta tiene una propiedad 'alumnos', usarla
          if (response.data.alumnos) {
            console.log('Encontrados datos en response.data.alumnos');
            estudiantesData = response.data.alumnos;
            total = response.data.total || estudiantesData.length;
          } 
          // Si la respuesta tiene una propiedad 'estudiantes', usarla
          else if (response.data.estudiantes) {
            console.log('Encontrados datos en response.data.estudiantes');
            estudiantesData = response.data.estudiantes;
            total = response.data.total || estudiantesData.length;
          }
          // Si la respuesta es un array directamente
          else if (Array.isArray(response.data)) {
            console.log('Respuesta es un array directo');
            estudiantesData = response.data;
            total = estudiantesData.length;
          }
          // Si la respuesta tiene datos en otra estructura
          else {
            console.log('Buscando datos en otras propiedades de la respuesta');
            // Intentar encontrar un array en cualquier propiedad de la respuesta
            const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
            if (possibleArrays.length > 0) {
              console.log('Encontrado array en otra propiedad');
              estudiantesData = possibleArrays[0];
              total = estudiantesData.length;
            } else {
              console.warn('No se encontraron arrays en la respuesta');
              estudiantesData = [];
              total = 0;
            }
          }
        } else {
          console.warn('Respuesta vacía o sin propiedad data');
          estudiantesData = [];
          total = 0;
        }
        
        console.log('Datos procesados de estudiantes:', estudiantesData);
        console.log('Total de estudiantes:', total);
        
        setEstudiantes(estudiantesData);
        setTotalCount(total);
      } catch (apiError) {
        console.error('Error específico de la API:', apiError);
        console.error('Detalles del error:', apiError.response || 'Sin detalles adicionales');
        throw apiError;
      }
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      setError("No se pudieron cargar los estudiantes. Por favor, intente nuevamente más tarde.");
      setEstudiantes([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleEdit = (id) => {
    navigate(`/estudiantes/editar/${id}`);
  };

  const openDeleteDialog = (id, nombre) => {
    setStudentToDelete({ id, nombre });
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    
    try {
      setError(null);
      await estudiantesService.delete(studentToDelete.id);
      
      // Actualizar la lista después de eliminar
      fetchEstudiantes(); // Volver a cargar la lista completa
      closeDeleteDialog();
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
      setError("No se pudo eliminar el estudiante. Por favor, intente nuevamente más tarde.");
      closeDeleteDialog();
    }
  };

  const getNivelColor = (nivel) => {
    if (!nivel) return 'default';
    
    switch (nivel?.toLowerCase()) {
      case 'alto':
      case 'avanzado':
        return 'success';
      case 'medio':
      case 'intermedio':
        return 'primary';
      case 'bajo':
      case 'basico':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Función para extraer el nombre completo del estudiante según la estructura de datos
  const getNombreCompleto = (estudiante) => {
    if (!estudiante) return 'Sin nombre';
    
    // Si tiene nombre y apellido separados
    if (estudiante.nombre && estudiante.apellido) {
      return `${estudiante.nombre} ${estudiante.apellido}`;
    }
    // Si solo tiene nombre
    else if (estudiante.nombre) {
      return estudiante.nombre;
    }
    // Si tiene name (en inglés)
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Estudiantes</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/estudiantes/nuevo')}
        >
          Agregar Estudiante
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar estudiante..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Nivel</TableCell>
                    <TableCell>Edad</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estudiantes && estudiantes.length > 0 ? (
                    estudiantes.map((estudiante) => (
                      <TableRow key={estudiante.id || estudiante._id}>
                        <TableCell>{getNombreCompleto(estudiante)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={estudiante.nivel || 'No asignado'} 
                            color={getNivelColor(estudiante.nivel)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{estudiante.edad || estudiante.age || '-'}</TableCell>
                        <TableCell>{estudiante.email || estudiante.mail || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEdit(estudiante.id || estudiante._id)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => openDeleteDialog(
                              estudiante.id || estudiante._id, 
                              getNombreCompleto(estudiante)
                            )}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No se encontraron estudiantes
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </>
        )}
      </Paper>

      {/* Modal de confirmación para eliminar estudiante */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar eliminación"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro que desea eliminar a este usuario?
            {studentToDelete && (
              <Typography component="span" sx={{ fontWeight: 'bold', display: 'block', mt: 1 }}>
                {studentToDelete.nombre}
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EstudiantesList;
