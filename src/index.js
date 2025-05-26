// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/lightMode.css'; // Importar primero los estilos del modo claro
import './index.css';
import App from './App';
import './services/test-api-url'; // Import test file to check API URLs

// Función para registrar el Service Worker
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registrado con éxito:', registration.scope);
          
          // Verificar si hay actualizaciones del Service Worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('Nuevo Service Worker instalándose:', newWorker);
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Nuevo Service Worker disponible, recargar para activar');
                // Aquí podrías mostrar un mensaje al usuario para que recargue la página
              }
            });
          });
        })
        .catch(error => {
          console.error('Error al registrar el Service Worker:', error);
        });
        
      // Manejar actualizaciones del Service Worker
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker actualizado, recargando...');
        window.location.reload();
      });
    });
  }
};

// Registrar el Service Worker
registerServiceWorker();

// Renderizar la aplicación
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);