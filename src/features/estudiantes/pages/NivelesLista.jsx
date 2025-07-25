import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { nivelesService } from '../services/estudiantes.service.js';

const NivelesLista = () => {
  const [niveles, setNiveles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNiveles = async () => {
      try {
        setLoading(true);
        const response = await nivelesService.getAll();
        setNiveles(response.data);
      } catch (err) {
        console.error('Error al cargar niveles:', err);
        setError('Error al cargar la lista de niveles');
      } finally {
        setLoading(false);
      }
    };

    fetchNiveles();
  }, []);

  if (loading) {
    return <div className="loading">Cargando niveles...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Estructura de niveles esperada
  const nivelesInfo = [
    {
      nombre: 'Básico',
      descripcion: 'Nivel para estudiantes principiantes',
      subniveles: ['Básico 1', 'Básico 2', 'Básico 3'],
      color: '#3498db'
    },
    {
      nombre: 'Intermedio',
      descripcion: 'Nivel para estudiantes con conocimientos medios',
      subniveles: ['Intermedio 1', 'Intermedio 2'],
      color: '#2ecc71'
    },
    {
      nombre: 'Avanzado',
      descripcion: 'Nivel para estudiantes con conocimientos avanzados',
      subniveles: ['Avanzado 1', 'Avanzado 2'],
      color: '#e74c3c'
    }
  ];

  // Si no hay datos reales, usar los datos de muestra
  const displayNiveles = niveles.length > 0 ? niveles : nivelesInfo;

  return (
    <div className="niveles-container">
      <div className="page-header">
        <h1>Niveles de Estudio</h1>
      </div>

      <div className="niveles-grid">
        {displayNiveles.map((nivel) => (
          <div 
            key={nivel.nombre} 
            className="nivel-card"
            style={{ borderColor: nivel.color }}
          >
            <div className="nivel-header" style={{ backgroundColor: nivel.color }}>
              <h2>{nivel.nombre}</h2>
            </div>
            <div className="nivel-body">
              <p>{nivel.descripcion}</p>
              
              <h3>Subniveles:</h3>
              <ul className="subniveles-list">
                {nivel.subniveles && nivel.subniveles.map((subnivel) => (
                  <li key={subnivel}>
                    <Link to={`/estudiantes/niveles/${nivel.nombre}/subnivel/${subnivel}`}>
                      {subnivel}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="nivel-actions">
                <Link 
                  to={`/estudiantes/niveles/${nivel.nombre}`}
                  className="btn btn-primary"
                >
                  Ver Estudiantes
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NivelesLista;
