import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  Toolbar, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Collapse, 
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Home as HomeIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

const drawerWidth = 240;
const drawerCollapsedWidth = 65;

const menuItems = [
  {
    text: 'Inicio',
    path: '/dashboard',
    icon: <HomeIcon />,
  },
  {
    text: 'Estudiantes',
    icon: <PeopleIcon />,
    subItems: [
      { text: 'Ver todos', path: '/estudiantes' },
      { text: 'Agregar nuevo', path: '/estudiantes/nuevo' },
    ],
  },
  {
    text: 'Evaluaciones',
    icon: <AssessmentIcon />,
    subItems: [
      { text: 'Por estudiante', path: '/evaluaciones/estudiante' },
      { text: 'Por nivel', path: '/evaluaciones/nivel' },
    ],
  },
  {
    text: 'Niveles',
    icon: <SchoolIcon />,
    subItems: [
      { text: 'Básico', path: '/niveles/basico' },
      { text: 'Intermedio', path: '/niveles/intermedio' },
      { text: 'Avanzado', path: '/niveles/avanzado' },
    ],
  },
  {
    text: 'Administración',
    icon: <AdminIcon />,
    subItems: [
      { text: 'Gastos', path: '/administracion/gastos' },
      { text: 'Resumen', path: '/administracion/resumen' },
    ],
  },
  {
    text: 'Configuración',
    icon: <SettingsIcon />,
    subItems: [
      { text: 'Criterios de evaluación', path: '/configuracion/criterios' },
    ],
  },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerCollapsed, setDrawerCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerCollapse = () => {
    setDrawerCollapsed(!drawerCollapsed);
  };

  const handleClick = (item) => {
    if (item.path) {
      navigate(item.path);
      setMobileOpen(false);
    } else if (!drawerCollapsed) {
      setOpen((prevOpen) => ({
        ...prevOpen,
        [item.text]: !prevOpen[item.text],
      }));
    } else if (drawerCollapsed && item.subItems) {
      // Si está colapsado y tiene subitems, expandir el drawer primero
      setDrawerCollapsed(false);
      // Luego abrir el submenú después de un pequeño retraso para permitir la animación
      setTimeout(() => {
        setOpen((prevOpen) => ({
          ...prevOpen,
          [item.text]: true,
        }));
      }, 300);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isSubActive = (item) => {
    if (!item.subItems) return false;
    return item.subItems.some(subItem => location.pathname === subItem.path);
  };

  const drawer = (
    <div>
      <Toolbar 
        sx={{ 
          bgcolor: 'primary.main',
          display: 'flex',
          justifyContent: drawerCollapsed ? 'center' : 'space-between',
          pr: drawerCollapsed ? 0 : 1
        }}
      >
        {!drawerCollapsed && (
          <Typography variant="h6" noWrap component="div" color="white">
            Timbashee
          </Typography>
        )}
        <IconButton 
          onClick={handleDrawerCollapse}
          sx={{ color: 'white' }}
        >
          {drawerCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Box key={item.text}>
            <ListItem disablePadding>
              <Tooltip title={drawerCollapsed ? item.text : ""} placement="right" arrow>
                <ListItemButton 
                  onClick={() => handleClick(item)}
                  selected={item.path ? isActive(item.path) : isSubActive(item)}
                  sx={{ 
                    minHeight: 48,
                    justifyContent: drawerCollapsed ? 'center' : 'initial',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerCollapsed ? 0 : 3,
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!drawerCollapsed && (
                    <>
                      <ListItemText primary={item.text} />
                      {item.subItems && (open[item.text] ? <ExpandLess /> : <ExpandMore />)}
                    </>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
            {!drawerCollapsed && item.subItems && (
              <Collapse in={open[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItemButton 
                      key={subItem.text} 
                      sx={{ pl: 4 }}
                      onClick={() => {
                        navigate(subItem.path);
                        setMobileOpen(false);
                      }}
                      selected={isActive(subItem.path)}
                    >
                      <ListItemText primary={subItem.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </div>
  );

  // Calcular el ancho actual del drawer basado en si está colapsado o no
  const currentDrawerWidth = drawerCollapsed ? drawerCollapsedWidth : drawerWidth;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Botón de menú móvil */}
      <Box 
        sx={{ 
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 1200,
          display: { xs: 'block', sm: 'none' }
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      
      <Box
        component="nav"
        sx={{ 
          width: { sm: currentDrawerWidth },
          flexShrink: { sm: 0 },
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              position: 'fixed',
              height: '100%',
              overflowY: 'auto'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: currentDrawerWidth,
              position: 'fixed',
              height: '100%',
              overflowY: 'auto',
              transition: theme => theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0,0,0,0.05)',
              }
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { sm: `${currentDrawerWidth}px` },
          mt: '64px',
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
