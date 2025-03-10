
// src/components/admin/HTMLPreview.jsx
import React, { useRef, useEffect, useState } from 'react';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';

const HTMLPreview = ({ htmlContent }) => {
  const iframeRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (iframeRef.current) {
      try {
        setIsLoading(true);
        setError(null);
        
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Reset the document
        doc.open();
        doc.write(htmlContent);
        doc.close();
        
        // Adjust iframe height to match content
        const adjustHeight = () => {
          try {
            const height = doc.documentElement.scrollHeight;
            if (height && height < 580) { // Mantenemos una altura mínima
              iframe.style.height = `${height}px`;
            } else {
              iframe.style.height = '580px'; // Altura consistente con textarea
            }
          } catch (error) {
            console.error("Error adjusting iframe height:", error);
          }
          setIsLoading(false);
        };
        
        // Add a base target to open links in new tab
        try {
          const baseEl = doc.createElement('base');
          baseEl.target = '_blank';
          doc.head.appendChild(baseEl);
        } catch (error) {
          console.error("Error setting base target:", error);
        }
        
        // Add custom styles to improve preview experience
        try {
          const styleEl = doc.createElement('style');
          styleEl.textContent = `
            body {
              font-family: 'Poppins', sans-serif;
              line-height: 1.6;
              color: #0b4444;
              margin: 0 auto;
              padding: 0;
              max-width: 100%;
              overflow-x: hidden;
              background-color: #f9fafb; /* Concordancia con el fondo del textarea */
            }
            
            /* Para cuando el HTML no incluye estilos propios */
            a {
              color: #0b4444;
              text-decoration: underline;
            }
            
            img {
              max-width: 100%;
              height: auto;
            }
            
            pre, code {
              background-color: #f5f5f5;
              padding: 2px 4px;
              border-radius: 4px;
              font-family: monospace;
            }
            
            blockquote {
              border-left: 4px solid #d2b99a;
              padding-left: 16px;
              margin-left: 0;
              color: #4c7977;
            }
            
            h1, h2, h3, h4, h5, h6 {
              color: #0b4444;
              margin-top: 24px;
              margin-bottom: 16px;
            }
            
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 16px 0;
            }
            
            table, th, td {
              border: 1px solid #d2b99a;
            }
            
            th, td {
              padding: 8px;
              text-align: left;
            }
            
            th {
              background-color: #f0f8f7;
            }
          `;
          doc.head.appendChild(styleEl);
        } catch (error) {
          console.error("Error adding styles:", error);
        }
        
        // Add onload event to iframe to adjust height after content loads
        iframe.onload = adjustHeight;
        
        // Also try to adjust immediately
        adjustHeight();
        
      } catch (error) {
        setError("Error al renderizar HTML: " + error.message);
        setIsLoading(false);
      }
    }
  }, [htmlContent]);

  const styles = {
    container: {
      position: "relative",
      height: "100%",
      width: "100%"
    },
    previewContainer: {
      width: "100%",
      minHeight: "580px", // Misma altura que textarea
      border: "none",
      overflow: "auto",
      backgroundColor: "#f9fafb", // Concordancia con el fondo del textarea
      borderRadius: borderRadius.md
    },
    errorMessage: {
      padding: spacing.md,
      color: colors.error,
      backgroundColor: `${colors.error}10`,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      marginBottom: spacing.md
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
      borderRadius: borderRadius.md
    },
    infoBox: {
      backgroundColor: 'rgba(11, 68, 68, 0.05)',
      borderRadius: borderRadius.md,
      padding: spacing.sm,
      marginTop: spacing.md,
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      textAlign: "center"
    }
  };

  return (
    <div style={styles.container}>
      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <iframe 
        ref={iframeRef}
        style={styles.previewContainer}
        title="HTML Preview"
        sandbox="allow-same-origin allow-scripts"
      />
      
      {isLoading && (
        <div style={styles.loadingOverlay}>
          Cargando vista previa...
        </div>
      )}
      
      <div style={styles.infoBox}>
        Vista previa segura (sandbox) • Los enlaces se abrirán en una nueva pestaña
      </div>
    </div>
  );
};

export default HTMLPreview;