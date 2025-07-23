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
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { nivelesService } from '../services/api';

const SubnivelList = ({ nivel }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subnivelData, setSubnivelData] = useState({
    1: { estudiantes: [] },
    2: { estudiantes: [] },
    3: { estudiantes: [] }
  });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchSubnivelData();
  }, [nivel]);

  const fetchSubnivelData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener todos los estudiantes del nivel
      const estudiantesResponse = await nivelesService.getEstudiantesByNivel(nivel);
      console.log('Respuesta de estudiantes por nivel:', estudiantesResponse);
      
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
      
      console.log('Estudiantes obtenidos:', estudiantes);
      
      // Agrupar estudiantes por subnivel
      const subniveles = {
        1: { estudiantes: [] },
        2: { estudiantes: [] },
        3: { estudiantes: [] }
      };
      
      estudiantes.forEach(estudiante => {
        // Asegurarse de que subnivel_id sea un string para comparación consistente
        let subnivel = estudiante.subnivel_id || estudiante.subnivel || '1';
        
        // Convertir a string si no lo es
        subnivel = subnivel.toString();
        
        console.log(`Estudiante ${estudiante.name || estudiante.nombre} tiene subnivel: ${subnivel}`);
        
        if (subniveles[subnivel]) {
          subniveles[subnivel].estudiantes.push(estudiante);
        } else {
          // Si por alguna razón hay un subnivel no esperado, lo asignamos al 1
          console.warn(`Subnivel no esperado: ${subnivel}, asignando a subnivel 1`);
          subniveles['1'].estudiantes.push(estudiante);
        }
      });
      
      console.log('Estudiantes agrupados por subnivel:', subniveles);
      setSubnivelData(subniveles);
    } catch (error) {
      console.error("Error al cargar datos de subniveles:", error);
      setError("No se pudieron cargar los datos de los subniveles. Por favor, intente nuevamente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>Subniveles</Typography>
      
      {Object.keys(subnivelData).map((subnivel) => (
        <Accordion 
          key={subnivel}
          expanded={expanded === `subnivel${subnivel}`}
          onChange={handleAccordionChange(`subnivel${subnivel}`)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`subnivel${subnivel}-content`}
            id={`subnivel${subnivel}-header`}
          >
            <Typography variant="h6">
              {nivel === 'Basico' ? 'Básico' : nivel} {subnivel}
              <Chip 
                label={`${subnivelData[subnivel].estudiantes.length} estudiantes`} 
                size="small" 
                color="primary" 
                sx={{ ml: 2 }}
              />
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
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
                  {subnivelData[subnivel].estudiantes.length > 0 ? (
                    subnivelData[subnivel].estudiantes.map((estudiante) => (
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
                        No hay estudiantes en este subnivel
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default SubnivelList;
