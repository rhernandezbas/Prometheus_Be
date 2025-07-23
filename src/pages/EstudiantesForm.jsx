import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { estudiantesService } from '../services/api';

const EstudiantesForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [createdStudent, setCreatedStudent] = useState(null);
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    dni: '',
    mail: '',
    telephone: '',
    address: '',
    nivel: '',
    subnivel_id: '',
    gender: '',
    dateOfEntry: '',
    dateOfBirth: '',
    comments: ''
  });

  // Estado separado para los sublevels disponibles
  const [sublevels, setSublevels] = useState([]);

  // Actualizar sublevels cuando cambia el nivel
  useEffect(() => {
    updateSublevels(formData.nivel);
  }, [formData.nivel]);

  // Función para actualizar los sublevels disponibles según el nivel seleccionado
  const updateSublevels = (nivel) => {
    let options = [];
    
    if (nivel === 'Basico') {
      options = [
        { value: '1', label: 'Básico 1' },
        { value: '2', label: 'Básico 2' },
        { value: '3', label: 'Básico 3' }
      ];
    } else if (nivel === 'Intermedio') {
      options = [
        { value: '1', label: 'Intermedio 1' },
        { value: '2', label: 'Intermedio 2' },
        { value: '3', label: 'Intermedio 3' }
      ];
    } else if (nivel === 'Avanzado') {
      options = [
        { value: '1', label: 'Avanzado 1' },
        { value: '2', label: 'Avanzado 2' },
        { value: '3', label: 'Avanzado 3' }
      ];
    }
    
    setSublevels(options);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNivelChange = (e) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      nivel: value,
      subnivel_id: '' // Resetear subnivel cuando cambia el nivel
    }));
  };

  const handleSubnivelChange = (e) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      subnivel_id: value
    }));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate('/estudiantes');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.name || !formData.nivel || !formData.dni) {
      setError('Por favor completa los campos obligatorios (Nombre, DNI y Nivel)');
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      
      console.log('Enviando datos al backend:', formData);
      
      // Llamada a la API para crear el estudiante
      const response = await estudiantesService.create(formData);
      
      // Guardar los datos del estudiante creado para mostrarlos en el modal
      setCreatedStudent({
        name: formData.name,
        dni: formData.dni,
        username: formData.dni,
        password: `${formData.name}${formData.dni}`
      });
      
      // Mostrar el modal con la información de credenciales
      setOpenModal(true);
      
    } catch (error) {
      console.error("Error al guardar estudiante:", error);
      setError('Error al guardar los datos. Por favor intenta nuevamente.');
    } finally {
      setSaving(false);
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
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link color="inherit" onClick={() => navigate('/')}>
          Inicio
        </Link>
        <Link color="inherit" onClick={() => navigate('/estudiantes')}>
          Estudiantes
        </Link>
        <Typography color="text.primary">
          Nuevo Estudiante
        </Typography>
      </Breadcrumbs>
      
      <Typography variant="h4" gutterBottom>
        Nuevo Estudiante
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Nombre"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastname"
                label="Apellido"
                value={formData.lastname}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="dni"
                label="DNI"
                value={formData.dni}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="mail"
                label="Email"
                type="email"
                value={formData.mail}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="telephone"
                label="Teléfono"
                value={formData.telephone}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="address"
                label="Dirección"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Nivel</InputLabel>
                <Select
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleNivelChange}
                  label="Nivel"
                >
                  <MenuItem value="Basico">Básico</MenuItem>
                  <MenuItem value="Intermedio">Intermedio</MenuItem>
                  <MenuItem value="Avanzado">Avanzado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Subnivel</InputLabel>
                <Select
                  name="subnivel_id"
                  value={formData.subnivel_id}
                  onChange={handleSubnivelChange}
                  label="Subnivel"
                  disabled={!formData.nivel}
                >
                  {sublevels.map((subnivel) => (
                    <MenuItem key={subnivel.value} value={subnivel.value}>
                      {subnivel.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Género</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Género"
                >
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="dateOfEntry"
                label="Fecha de Inscripción"
                type="date"
                value={formData.dateOfEntry}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="dateOfBirth"
                label="Fecha de Nacimiento"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="comments"
                label="Observaciones"
                value={formData.comments}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/estudiantes')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Guardar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Modal de éxito con información de credenciales */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Usuario creado exitosamente"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {createdStudent && (
              <>
                <p>El estudiante <strong>{createdStudent.name}</strong> ha sido creado correctamente.</p>
                <p>Recuerda que:</p>
                <ul>
                  <li>El nombre de usuario es: <strong>{createdStudent.username}</strong> (su DNI)</li>
                  <li>La contraseña es: <strong>{createdStudent.password}</strong> (su nombre + DNI)</li>
                </ul>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary" autoFocus>
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EstudiantesForm;
