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
  TablePagination,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { administracionService, instructoresService } from '../services/api';

const AdministracionGastos = () => {
  const [loading, setLoading] = useState(true);
  const [gastos, setGastos] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [gastoForm, setGastoForm] = useState({
    concepto: '',
    monto: '',
    tipo: '',
    detalle: '',
    fecha: '',
    instructor_id: null
  });
  const [instructores, setInstructores] = useState([]);
  const [loadingInstructores, setLoadingInstructores] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGastos();
    fetchInstructores();
  }, [page, rowsPerPage, search]);

  const fetchInstructores = async () => {
    try {
      setLoadingInstructores(true);
      const response = await instructoresService.getAll();
      if (response && response.data) {
        setInstructores(Array.isArray(response.data) ? response.data : response.data.instructores || []);
      }
    } catch (error) {
      console.error("Error al cargar instructores:", error);
    } finally {
      setLoadingInstructores(false);
    }
  };

  const fetchGastos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir parámetros de consulta para paginación y búsqueda
      const params = {
        page: page + 1, // Ajustar para API que comienza en página 1
        per_page: rowsPerPage
      };
      
      if (search && search.trim() !== '') {
        params.search = search.trim();
      }
      
      console.log('Enviando solicitud a gastos con params:', params);
      
      // Llamar a la API real
      const response = await administracionService.getGastos(params);
      console.log('Respuesta completa de API gastos:', response);
      
      // Extraer datos de la respuesta
      let gastosData = [];
      let total = 0;
      
      // Analizar la estructura de la respuesta
      if (response && response.data) {
        // Si la respuesta tiene una propiedad 'gastos', usarla
        if (response.data.gastos) {
          console.log('Encontrados datos en response.data.gastos');
          gastosData = response.data.gastos;
          total = response.data.total || gastosData.length;
        } 
        // Si la respuesta es un array directamente
        else if (Array.isArray(response.data)) {
          console.log('Respuesta es un array directo');
          gastosData = response.data;
          total = gastosData.length;
        }
        // Si la respuesta tiene datos en otra estructura
        else {
          console.log('Buscando datos en otras propiedades de la respuesta');
          // Intentar encontrar un array en cualquier propiedad de la respuesta
          const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            console.log('Encontrado array en otra propiedad');
            gastosData = possibleArrays[0];
            total = gastosData.length;
          } else {
            console.warn('No se encontraron arrays en la respuesta');
            gastosData = [];
            total = 0;
          }
        }
      } else {
        console.warn('Respuesta vacía o sin propiedad data');
        gastosData = [];
        total = 0;
      }
      
      console.log('Datos procesados de gastos:', gastosData);
      console.log('Total de gastos:', total);
      
      setGastos(gastosData);
      setTotalCount(total);
    } catch (error) {
      console.error("Error al cargar gastos:", error);
      setError("No se pudieron cargar los gastos. Por favor, intente nuevamente más tarde.");
      setGastos([]);
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

  const handleOpenDialog = (gasto = null) => {
    if (gasto) {
      setGastoForm({
        concepto: gasto.concepto || '',
        monto: gasto.monto || '',
        tipo: gasto.tipo || '',
        detalle: gasto.detalle || '',
        fecha: gasto.fecha || '',
        instructor_id: gasto.instructor_id || null
      });
      setEditingId(gasto.id);
    } else {
      setGastoForm({
        concepto: '',
        monto: '',
        tipo: '',
        detalle: '',
        fecha: new Date().toISOString().split('T')[0],
        instructor_id: null
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
    setGastoForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Si se cambia el tipo y no es "salarios", eliminar instructor_id
    if (name === 'tipo' && value !== 'salarios') {
      setGastoForm(prev => ({
        ...prev,
        instructor_id: null
      }));
    }
  };

  const handleInstructorChange = (event, newValue) => {
    setGastoForm(prev => ({
      ...prev,
      instructor_id: newValue ? newValue.id : null
    }));
  };

  const handleSubmitGasto = async () => {
    try {
      setError(null);
      
      // Validar campos requeridos
      const requiredFields = ['concepto', 'monto', 'tipo', 'detalle', 'fecha'];
      
      // Si el tipo es salarios, añadir instructor_id a los campos requeridos
      if (gastoForm.tipo === 'salarios') {
        requiredFields.push('instructor_id');
      }
      
      const missingFields = requiredFields.filter(field => !gastoForm[field]);
      
      if (missingFields.length > 0) {
        setError(`Los siguientes campos son requeridos: ${missingFields.join(', ')}`);
        return;
      }
      
      // Crear una copia del formulario para enviar
      const formToSubmit = { ...gastoForm };
      
      // Si no es salarios, eliminar instructor_id
      if (formToSubmit.tipo !== 'salarios') {
        delete formToSubmit.instructor_id;
      }
      
      if (editingId) {
        await administracionService.updateGasto(editingId, formToSubmit);
      } else {
        await administracionService.createGasto(formToSubmit);
      }
      
      // Actualizar la lista de gastos después de guardar
      fetchGastos();
      handleCloseDialog();
      
    } catch (error) {
      console.error("Error al guardar gasto:", error);
      setError("No se pudo guardar el gasto. Por favor, intente nuevamente más tarde.");
    }
  };

  const handleDeleteGasto = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      try {
        setError(null);
        await administracionService.deleteGasto(id);
        
        // Actualizar la lista después de eliminar
        fetchGastos();
        
      } catch (error) {
        console.error("Error al eliminar gasto:", error);
        setError("No se pudo eliminar el gasto. Por favor, intente nuevamente más tarde.");
      }
    }
  };

  const calcularTotalGastos = () => {
    return gastos.reduce((total, gasto) => total + parseFloat(gasto.monto || 0), 0);
  };

  // Función para obtener el tipo de gasto formateado
  const getTipoGasto = (tipo) => {
    if (!tipo) return 'No especificado';
    return tipo.charAt(0).toUpperCase() + tipo.slice(1);
  };

  // Función para encontrar el nombre del instructor por ID
  const getInstructorName = (instructorId) => {
    if (!instructorId) return '';
    const instructor = instructores.find(i => i.id === instructorId);
    return instructor ? `${instructor.nombre} ${instructor.apellido || ''}` : '';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Administración de Gastos
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Gastos
            </Typography>
            <Typography variant="h4" color="primary">
              ${calcularTotalGastos().toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            variant="outlined"
            placeholder="Buscar gasto..."
            value={search}
            onChange={handleSearchChange}
            sx={{ width: '70%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Agregar Gasto
          </Button>
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
                    <TableCell>Concepto</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Detalle</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Instructor</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gastos && gastos.length > 0 ? (
                    gastos.map((gasto) => (
                      <TableRow key={gasto.id || gasto._id}>
                        <TableCell>{gasto.concepto}</TableCell>
                        <TableCell>${parseFloat(gasto.monto || 0).toFixed(2)}</TableCell>
                        <TableCell>{getTipoGasto(gasto.tipo)}</TableCell>
                        <TableCell>{gasto.detalle}</TableCell>
                        <TableCell>{gasto.fecha}</TableCell>
                        <TableCell>
                          {gasto.tipo === 'salarios' ? getInstructorName(gasto.instructor_id) : ''}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            color="primary" 
                            size="small"
                            onClick={() => handleOpenDialog(gasto)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => handleDeleteGasto(gasto.id || gasto._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No se encontraron gastos
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
      
      {/* Diálogo para agregar/editar gasto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Editar Gasto' : 'Nuevo Gasto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="concepto"
                label="Concepto"
                value={gastoForm.concepto}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="monto"
                label="Monto"
                type="number"
                value={gastoForm.monto}
                onChange={handleFormChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  value={gastoForm.tipo}
                  onChange={handleFormChange}
                  label="Tipo"
                >
                  <MenuItem value="material">Material</MenuItem>
                  <MenuItem value="servicios">Servicios</MenuItem>
                  <MenuItem value="salarios">Salarios</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Campo condicional para seleccionar instructor cuando el tipo es salarios */}
            {gastoForm.tipo === 'salarios' && (
              <Grid item xs={12}>
                <Autocomplete
                  options={instructores}
                  getOptionLabel={(option) => `${option.nombre} ${option.apellido || ''}`}
                  value={instructores.find(i => i.id === gastoForm.instructor_id) || null}
                  onChange={handleInstructorChange}
                  loading={loadingInstructores}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Instructor"
                      required
                      error={gastoForm.tipo === 'salarios' && !gastoForm.instructor_id}
                      helperText={gastoForm.tipo === 'salarios' && !gastoForm.instructor_id ? 'Seleccione un instructor' : ''}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingInstructores ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                name="detalle"
                label="Detalle"
                value={gastoForm.detalle}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="fecha"
                label="Fecha"
                type="date"
                value={gastoForm.fecha}
                onChange={handleFormChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSubmitGasto} 
            variant="contained" 
            color="primary"
            disabled={
              !gastoForm.concepto || 
              !gastoForm.monto || 
              !gastoForm.tipo || 
              !gastoForm.detalle || 
              !gastoForm.fecha ||
              (gastoForm.tipo === 'salarios' && !gastoForm.instructor_id)
            }
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdministracionGastos;
