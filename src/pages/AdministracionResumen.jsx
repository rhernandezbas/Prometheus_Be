import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { administracionService } from '../services/api';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title
);

const AdministracionResumen = () => {
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mensual');
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [resumenData, setResumenData] = useState({
    totalEstudiantes: 0,
    totalIngresos: 0,
    totalGastos: 0,
    balance: 0
  });
  
  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);
  
  const [chartData, setChartData] = useState({
    estudiantes: {
      labels: [],
      datasets: []
    },
    finanzas: {
      labels: [],
      datasets: []
    },
    distribucionNiveles: {
      labels: [],
      datasets: []
    }
  });

  useEffect(() => {
    fetchResumenData();
  }, [periodo]);

  const fetchResumenData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener el balance general
      console.log('Solicitando balance financiero');
      const balanceResponse = await administracionService.getBalance();
      console.log('Respuesta del balance:', balanceResponse);
      
      // Obtener ingresos
      console.log('Solicitando ingresos');
      const ingresosResponse = await administracionService.getIngresos({ periodo });
      console.log('Respuesta de ingresos:', ingresosResponse);
      
      // Obtener gastos
      console.log('Solicitando gastos');
      const gastosResponse = await administracionService.getGastos({ periodo });
      console.log('Respuesta de gastos:', gastosResponse);
      
      // Procesar datos del balance
      if (balanceResponse && balanceResponse.data) {
        const balanceData = balanceResponse.data;
        
        setResumenData({
          totalEstudiantes: 0, // Este dato se obtendría de otro endpoint
          totalIngresos: balanceData.total_ingresos || 0,
          totalGastos: balanceData.total_gastos || 0,
          balance: balanceData.balance || 0
        });
      }
      
      // Procesar datos de ingresos
      if (ingresosResponse && ingresosResponse.data && ingresosResponse.data.ingresos) {
        setIngresos(ingresosResponse.data.ingresos);
      }
      
      // Procesar datos de gastos
      if (gastosResponse && gastosResponse.data && gastosResponse.data.gastos) {
        setGastos(gastosResponse.data.gastos);
      }
      
      // Preparar datos para los gráficos
      prepareChartData();
      
    } catch (error) {
      console.error("Error al cargar datos del resumen:", error);
      setError('Error al cargar los datos del resumen. Por favor, intente nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const prepareChartData = () => {
    // Agrupar datos por fecha para los gráficos
    const fechasSet = new Set();
    
    // Recopilar todas las fechas únicas de ingresos y gastos
    ingresos.forEach(ingreso => fechasSet.add(ingreso.fecha));
    gastos.forEach(gasto => fechasSet.add(gasto.fecha));
    
    // Convertir a array y ordenar
    const fechas = Array.from(fechasSet).sort();
    
    // Calcular montos por fecha
    const ingresosPorFecha = fechas.map(fecha => {
      const ingresosEnFecha = ingresos.filter(i => i.fecha === fecha);
      return ingresosEnFecha.reduce((sum, i) => sum + parseFloat(i.monto || 0), 0);
    });
    
    const gastosPorFecha = fechas.map(fecha => {
      const gastosEnFecha = gastos.filter(g => g.fecha === fecha);
      return gastosEnFecha.reduce((sum, g) => sum + parseFloat(g.monto || 0), 0);
    });
    
    // Agrupar datos por tipo para el gráfico de distribución
    const tiposGastos = {};
    gastos.forEach(gasto => {
      const tipo = gasto.tipo || 'No especificado';
      if (!tiposGastos[tipo]) {
        tiposGastos[tipo] = 0;
      }
      tiposGastos[tipo] += parseFloat(gasto.monto || 0);
    });
    
    const tiposLabels = Object.keys(tiposGastos);
    const tiposData = tiposLabels.map(tipo => tiposGastos[tipo]);
    
    // Actualizar datos de los gráficos
    setChartData({
      finanzas: {
        labels: fechas,
        datasets: [
          {
            label: 'Ingresos',
            data: ingresosPorFecha,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Gastos',
            data: gastosPorFecha,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      distribucionNiveles: {
        labels: tiposLabels,
        datasets: [{
          data: tiposData,
          backgroundColor: [
            '#4caf50', '#2196f3', '#9c27b0', '#ff9800', '#f44336', 
            '#009688', '#673ab7', '#3f51b5', '#e91e63', '#ffc107'
          ],
          borderWidth: 1
        }]
      }
    });
  };

  const handlePeriodoChange = (event) => {
    setPeriodo(event.target.value);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Resumen Administrativo
        </Typography>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Periodo</InputLabel>
          <Select
            value={periodo}
            onChange={handlePeriodoChange}
            label="Periodo"
          >
            <MenuItem value="mensual">Mensual</MenuItem>
            <MenuItem value="trimestral">Trimestral</MenuItem>
            <MenuItem value="anual">Anual</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <MoneyIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h5">${resumenData.totalIngresos.toLocaleString()}</Typography>
                <Typography variant="body2" color="text.secondary">Ingresos</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <MoneyIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
              <Box>
                <Typography variant="h5">${resumenData.totalGastos.toLocaleString()}</Typography>
                <Typography variant="body2" color="text.secondary">Gastos</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h5" color={resumenData.balance >= 0 ? 'success.main' : 'error.main'}>
                  ${resumenData.balance.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">Balance</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs para cambiar entre gráficos y tablas */}
      <Box sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Gráficos" />
          <Tab label="Detalle de Ingresos" />
          <Tab label="Detalle de Gastos" />
        </Tabs>
      </Box>
      
      {/* Contenido de las tabs */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Evolución Financiera
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar 
                  data={chartData.finanzas} 
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
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Distribución de Gastos por Tipo
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Pie 
                  data={chartData.distribucionNiveles} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }} 
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {tabValue === 1 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Detalle de Ingresos
          </Typography>
          {ingresos.length > 0 ? (
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Fecha</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Concepto</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Tipo</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Detalle</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {ingresos.map((ingreso, index) => (
                    <tr key={ingreso.id || index}>
                      <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{ingreso.fecha}</td>
                      <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{ingreso.concepto}</td>
                      <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{ingreso.tipo}</td>
                      <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{ingreso.detalle}</td>
                      <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>${parseFloat(ingreso.monto || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>${ingresos.reduce((sum, i) => sum + parseFloat(i.monto || 0), 0).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </Box>
          ) : (
            <Typography variant="body1" align="center" sx={{ py: 3 }}>
              No hay datos de ingresos disponibles
            </Typography>
          )}
        </Paper>
      )}
      
      {tabValue === 2 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Detalle de Gastos
          </Typography>
          {gastos.length > 0 ? (
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Fecha</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Concepto</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Tipo</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Detalle</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {gastos.map((gasto, index) => (
                    <tr key={gasto.id || index}>
                      <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{gasto.fecha}</td>
                      <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{gasto.concepto}</td>
                      <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{gasto.tipo}</td>
                      <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{gasto.detalle}</td>
                      <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>${parseFloat(gasto.monto || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>${gastos.reduce((sum, g) => sum + parseFloat(g.monto || 0), 0).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </Box>
          ) : (
            <Typography variant="body1" align="center" sx={{ py: 3 }}>
              No hay datos de gastos disponibles
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AdministracionResumen;
