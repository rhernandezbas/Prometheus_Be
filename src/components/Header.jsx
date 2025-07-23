import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon
} from '@mui/material';
import {
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };
  
  const handleSettings = () => {
    handleClose();
    navigate('/settings');
  };
  
  // Si estamos en la página de login, solo mostrar Timbashe centrado
  const isLoginPage = window.location.pathname === '/login';

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: isLoginPage ? 'center' : 'space-between' }}>
        {isLoginPage ? (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Timbashe
          </Typography>
        ) : (
          <>
            <Typography
              variant="h6"
              component={RouterLink}
              to={isAuthenticated ? "/dashboard" : "/"}
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold'
              }}
            >
              Timbashe
            </Typography>

            {isAuthenticated ? (
              <Box>
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                  size="large"
                  aria-label="cuenta de usuario"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                >
                  {user?.avatar ? (
                    <Avatar
                      src={user.avatar}
                      alt={user.username || 'Usuario'}
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <AccountIcon />
                  )}
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose} disabled>
                    <Typography variant="body2" color="textSecondary">
                      {user?.username || 'Usuario'}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Perfil
                  </MenuItem>
                  <MenuItem onClick={handleSettings}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Configuración
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </Box>
            ) : null}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
