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
            if (height) {
              iframe.style.height = `${height}px`;
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
      minHeight: "500px",
      border: "none",
      overflow: "auto",
      backgroundColor: colors.white,
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
    previewHeader: {
      backgroundColor: colors.gray100,
      borderRadius: `${borderRadius.md} ${borderRadius.md} 0 0`,
      padding: `${spacing.xs} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      borderBottom: `1px solid ${colors.gray200}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    infoIcon: {
      marginRight: spacing.xs,
      color: colors.primary
    },
    instructions: {
      fontSize: typography.fontSize.xs,
      padding: spacing.sm,
      backgroundColor: colors.white,
      borderTop: `1px solid ${colors.gray200}`,
      color: colors.textSecondary,
      borderRadius: `0 0 ${borderRadius.md} ${borderRadius.md}`,
      textAlign: "center"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.previewHeader}>
        <span>
          <span style={styles.infoIcon}>ℹ️</span>
          Vista previa HTML
        </span>
        <span>Vista segura (sandbox)</span>
      </div>
      
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
      
      <div style={styles.instructions}>
        Nota: Esta es solo una vista previa. Los enlaces se abrirán en una nueva pestaña y algunas funcionalidades pueden estar limitadas.
      </div>
    </div>
  );
};

export default HTMLPreview;