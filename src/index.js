// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/lightMode.css'; // Importar primero los estilos del modo claro
import './index.css';
import App from './App';
import './services/test-api-url'; // Import test file to check API URLs

// Renderizar la aplicación
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);