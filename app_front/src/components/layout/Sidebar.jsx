import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const [openMenus, setOpenMenus] = useState({
    estudiantes: false,
    administracion: false,
    finanzas: false
  });

  // Función para determinar si un usuario tiene acceso a un módulo según su rol
  const hasAccess = (requiredRoles) => {
    if (!user || !user.role) return false;
    return requiredRoles.includes(user.role);
  };

  // Toggle submenu open/closed state
  const toggleSubmenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="icon">🏠</span>
              <span className="label">Inicio</span>
            </NavLink>
          </li>

          {/* Módulo de Estudiantes - accesible para todos los roles */}
          <li className="nav-item">
            <div
              className={`menu-header ${openMenus.estudiantes ? 'open' : ''}`}
              onClick={() => toggleSubmenu('estudiantes')}
            >
              <span className="icon">👨‍🎓</span>
              <span className="label">Estudiantes</span>
              <span className="arrow">{openMenus.estudiantes ? '▼' : '▶'}</span>
            </div>
            {openMenus.estudiantes && (
              <ul className="submenu">
                <li>
                  <NavLink to="/estudiantes" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="icon">📋</span>
                    <span className="label">Lista de Estudiantes</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/estudiantes/nuevo" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="icon">➕</span>
                    <span className="label">Nuevo Estudiante</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/estudiantes/niveles" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="icon">📊</span>
                    <span className="label">Niveles</span>
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Módulo de Administración - solo para administradores y directores */}
          {hasAccess(['admin', 'director']) && (
            <li className="nav-item">
              <div
                className={`menu-header ${openMenus.administracion ? 'open' : ''}`}
                onClick={() => toggleSubmenu('administracion')}
              >
                <span className="icon">⚙️</span>
                <span className="label">Administración</span>
                <span className="arrow">{openMenus.administracion ? '▼' : '▶'}</span>
              </div>
              {openMenus.administracion && (
                <ul className="submenu">
                  <li>
                    <NavLink to="/administracion/usuarios" className={({ isActive }) => isActive ? 'active' : ''}>
                      <span className="icon">👥</span>
                      <span className="label">Usuarios</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/administracion/configuracion" className={({ isActive }) => isActive ? 'active' : ''}>
                      <span className="icon">🔧</span>
                      <span className="label">Configuración</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Módulo de Finanzas - solo para administradores, directores y contadores */}
          {hasAccess(['admin', 'director', 'contador']) && (
            <li className="nav-item">
              <div
                className={`menu-header ${openMenus.finanzas ? 'open' : ''}`}
                onClick={() => toggleSubmenu('finanzas')}
              >
                <span className="icon">💰</span>
                <span className="label">Finanzas</span>
                <span className="arrow">{openMenus.finanzas ? '▼' : '▶'}</span>
              </div>
              {openMenus.finanzas && (
                <ul className="submenu">
                  <li>
                    <NavLink to="/finanzas/ingresos" className={({ isActive }) => isActive ? 'active' : ''}>
                      <span className="icon">💵</span>
                      <span className="label">Ingresos</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/finanzas/gastos" className={({ isActive }) => isActive ? 'active' : ''}>
                      <span className="icon">💸</span>
                      <span className="label">Gastos</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/finanzas/reportes" className={({ isActive }) => isActive ? 'active' : ''}>
                      <span className="icon">📈</span>
                      <span className="label">Reportes</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
