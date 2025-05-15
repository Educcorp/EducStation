// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/lightMode.css'; // Importar primero los estilos del modo claro
import './index.css';
import App from './App';

// Renderizar la aplicación
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);