import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/" className="logo">
          <h1>Sistema Educativo</h1>
        </Link>
      </div>
      
      <div className="header-right">
        {user && (
          <div className="user-menu">
            <span className="user-name">
              {user.nombre || user.username}
            </span>
            <div className="dropdown-menu">
              <Link to="/perfil" className="dropdown-item">Mi Perfil</Link>
              <button onClick={handleLogout} className="dropdown-item logout-btn">
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
