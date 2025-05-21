import React, { useState } from 'react';
import { spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

const CoverImageUploader = ({ coverImagePreview, onChange }) => {
  // Estado para mostrar mensaje de conversión exitosa
  const [conversionStatus, setConversionStatus] = useState(null);

  // Usar el hook useTheme para obtener los colores según el tema actual
  const { colors } = useTheme();

  // Función para convertir la imagen a Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Manejar el cambio de archivo y convertir a Base64
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setConversionStatus('converting');
        const base64String = await convertToBase64(file);
        
        // Mostrar mensaje de éxito por 3 segundos
        setConversionStatus('success');
        setTimeout(() => setConversionStatus(null), 3000);
        
        // Llamar al onChange del componente padre con el archivo original y la versión Base64
        onChange(e, base64String);
      } catch (error) {
        console.error('Error al convertir imagen a Base64:', error);
        // Mostrar mensaje de error por 3 segundos
        setConversionStatus('error');
        setTimeout(() => setConversionStatus(null), 3000);
        
        // En caso de error, llamar al onChange solo con el evento original
        onChange(e);
      }
    }
  };

  const styles = {
    card: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      boxShadow: shadows.sm,
      marginBottom: spacing.lg
    },
    formGroup: {
      marginBottom: spacing.lg
    },
    label: {
      display: "block",
      marginBottom: spacing.xs,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary
    },
    coverImageContainer: {
      marginBottom: spacing.md,
      cursor: "pointer",
      backgroundColor: colors.gray100,
      borderRadius: borderRadius.md,
      width: "100%",
      height: "150px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      boxShadow: shadows.sm,
      transition: "all 0.3s ease"
    },
    coverImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease"
    },
    imageUploadText: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: colors.textSecondary,
      cursor: "pointer",
      transition: "transform 0.3s ease"
    },
    imageIcon: {
      fontSize: "28px",
      marginBottom: spacing.xs
    },
    helperText: {
      fontSize: typography.fontSize.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      lineHeight: 1.5,
      display: "flex",
      alignItems: "center",
      gap: spacing.xs
    },
    statusMessage: {
      fontSize: typography.fontSize.sm,
      marginTop: spacing.sm,
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      textAlign: 'center',
      fontWeight: typography.fontWeight.medium,
      transition: 'all 0.3s ease',
    },
    successStatus: {
      backgroundColor: 'rgba(0, 200, 83, 0.1)',
      color: '#00C853',
      border: '1px solid rgba(0, 200, 83, 0.2)',
    },
    errorStatus: {
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: '#F44336',
      border: '1px solid rgba(244, 67, 54, 0.2)',
    },
    convertingStatus: {
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      color: '#2196F3',
      border: '1px solid rgba(33, 150, 243, 0.2)',
    }
  };

  // Renderizar mensaje de estado
  const renderStatusMessage = () => {
    if (!conversionStatus) return null;

    let statusStyles = {};
    let message = '';

    switch (conversionStatus) {
      case 'success':
        statusStyles = styles.successStatus;
        message = '✓ Imagen convertida exitosamente a Base64';
        break;
      case 'error':
        statusStyles = styles.errorStatus;
        message = '✗ Error al convertir la imagen a Base64';
        break;
      case 'converting':
        statusStyles = styles.convertingStatus;
        message = '⏳ Convirtiendo imagen...';
        break;
      default:
        return null;
    }

    return (
      <div style={{...styles.statusMessage, ...statusStyles}}>
        {message}
      </div>
    );
  };

  return (
    <div style={styles.card}>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="coverImage">Imagen de portada</label>
        <input
          type="file"
          id="coverImage"
          name="coverImage"
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <label 
          htmlFor="coverImage" 
          style={styles.coverImageContainer}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = shadows.sm;
          }}
        >
          {coverImagePreview ? (
            <img 
              src={coverImagePreview} 
              alt="Vista previa de la portada" 
              style={styles.coverImage}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            />
          ) : (
            <div style={styles.imageUploadText}>
              <span style={styles.imageIcon}>🖼️</span>
              <span>Subir imagen de portada</span>
            </div>
          )}
        </label>
        {renderStatusMessage()}
        <p style={styles.helperText}>
          <span style={{color: colors.primary}}>💡</span>
          Recomendación: Usar imágenes de al menos 1200x600px para una mejor visualización.
        </p>
      </div>
    </div>
  );
};

export default CoverImageUploader;