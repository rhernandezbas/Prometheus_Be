import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Nota: El video debe estar en la carpeta /public/video/login.mp4

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const { login, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password) {
      setError('Por favor, complete todos los campos');
      return;
    }
    
    try {
      setLoading(true);
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intente nuevamente.');
      console.error('Error en login:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Mostrar error del contexto de autenticación si existe
  const displayError = error || authError;
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        background: 'linear-gradient(135deg, #8e24aa 0%, #6a1b9a 50%, #4a148c 100%)',
      }}
    >
      {/* Login Form */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          px: 3,
          py: 4,
          zIndex: 1
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '10px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Box sx={{ 
            mb: 4, 
            textAlign: 'center',
            borderBottom: '2px solid #6a1b9a',
            paddingBottom: '10px'
          }}>
            <Typography 
              component="h1" 
              variant="h4" 
              fontWeight="bold" 
              gutterBottom
              sx={{
                color: '#6a1b9a',
                textTransform: 'uppercase',
                fontSize: '1.8rem',
                letterSpacing: '1px'
              }}
            >
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please enter your details
            </Typography>
          </Box>

          {displayError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {displayError}
            </Typography>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
              Email address
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              name="username"
              autoComplete="email"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter your email"
              variant="outlined"
              sx={{ 
                mb: 3,
                mt: 0,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
              InputProps={{
                sx: { padding: '12px 14px' }
              }}
            />
            
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
              Password
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter your password"
              variant="outlined"
              sx={{ 
                mb: 2,
                mt: 0,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
              InputProps={{
                sx: { padding: '12px 14px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 3
            }}>
              <Link 
                href="#" 
                variant="body2" 
                sx={{ 
                  color: '#6a1b9a',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Forgot password
              </Link>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 1, 
                mb: 3, 
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                bgcolor: '#6a1b9a',
                '&:hover': {
                  bgcolor: '#4a148c',
                }
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                  Signing in...
                </>
              ) : 'Sign in'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
