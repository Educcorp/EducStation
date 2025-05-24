import React, { useState, useEffect } from 'react';
import { colors, spacing, shadows, borderRadius } from '../../styles/theme';

/**
 * Componente de previsualización simple con aislamiento mediante iframe
 * Muestra el contenido HTML de manera segura y aislada
 */
const SimplePreview = ({ title, content }) => {
  const [iframeHeight, setIframeHeight] = useState(300); // Altura inicial
  const [iframeKey, setIframeKey] = useState(Date.now());

  // Escuchar mensajes desde el iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'preview-height') {
        setIframeHeight(event.data.height + 30); // Añadir margen
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Regenerar iframe cuando cambia el contenido
  useEffect(() => {
    setIframeKey(Date.now());
  }, [title, content]);

  // Generar el documento HTML completo para el iframe
  const generatePreviewContent = () => {
    if (!content) return '';

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title || 'Vista previa'}</title>
        <style>
          /* Reset de estilos */
          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: ${colors.textPrimary};
            padding: 10px;
            background-color: white;
            overflow-x: hidden;
          }
          
          /* Contenedor principal */
          .preview-container {
            width: 100%;
            max-width: 100%;
          }
          
          /* Título */
          h1 {
            font-size: 1.8em;
            font-weight: bold;
            margin-bottom: ${spacing.md}px;
            color: ${colors.primary};
            width: 100%;
          }
          
          /* Estilos para encabezados */
          h2 {
            font-size: 1.5em;
            font-weight: 600;
            margin-top: ${spacing.lg}px;
            margin-bottom: ${spacing.md}px;
            color: ${colors.primary};
          }
          
          h3, h4, h5, h6 {
            margin: 1em 0 0.5em;
            color: ${colors.primary};
          }
          
          /* Párrafos */
          p {
            margin-bottom: ${spacing.md}px;
            width: 100%;
          }
          
          /* Listas */
          ul, ol {
            padding-left: ${spacing.xl}px;
            margin-bottom: ${spacing.lg}px;
          }
          
          li {
            margin-bottom: ${spacing.sm}px;
          }
          
          /* Citas */
          blockquote {
            border-left: 4px solid ${colors.primary};
            padding: ${spacing.sm}px ${spacing.lg}px;
            background-color: rgba(11, 68, 68, 0.05);
            font-style: italic;
            margin: ${spacing.md}px 0;
            border-radius: 0 ${borderRadius.sm}px ${borderRadius.sm}px 0;
          }
          
          /* Imágenes */
          img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1em auto;
            border-radius: 4px;
          }
          
          /* Correcciones para elementos con estilos inline */
          [style*="width:"], 
          [style*="width: "] {
            max-width: 100% !important;
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <h1>${title || ''}</h1>
          ${content}
        </div>
        <script>
          // Función para notificar la altura al padre
          function notifyHeight() {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ 
              type: 'preview-height',
              height: height
            }, '*');
          }
          
          // Observar cambios en el DOM
          const observer = new MutationObserver(notifyHeight);
          observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: true
          });
          
          // Notificar altura cuando se carga la página
          document.addEventListener('DOMContentLoaded', notifyHeight);
          
          // Notificar altura cuando se cargan las imágenes
          document.querySelectorAll('img').forEach(img => {
            if (img.complete) {
              notifyHeight();
            } else {
              img.addEventListener('load', notifyHeight);
              img.addEventListener('error', notifyHeight);
            }
          });
          
          // Ejecutar inmediatamente y también después de un pequeño retraso
          notifyHeight();
          setTimeout(notifyHeight, 100);
          setTimeout(notifyHeight, 500);
        </script>
      </body>
      </html>
    `;
  };

  const styles = {
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      backgroundColor: "white",
      borderRadius: borderRadius.md,
      boxShadow: shadows.sm,
    },
    iframe: {
      width: "100%",
      height: `${iframeHeight}px`,
      border: "none",
      transition: "height 0.3s ease",
      backgroundColor: "transparent",
      overflow: "hidden",
      borderRadius: borderRadius.md,
    }
  };

  return (
    <div style={styles.container}>
      <iframe 
        key={iframeKey}
        title="Vista previa del contenido"
        style={styles.iframe}
        srcDoc={generatePreviewContent()}
        sandbox="allow-same-origin allow-scripts"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
};

export default SimplePreview;
