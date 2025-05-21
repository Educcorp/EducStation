import React, { useState } from 'react';
import { spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

// Constante para el tamaño máximo de imagen en bytes (4MB)
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

const CoverImageUploader = ({ coverImagePreview, onChange }) => {
  // Estado para mostrar mensaje de conversión exitosa
  const [conversionStatus, setConversionStatus] = useState(null);
  // Estado para mostrar información del tamaño
  const [imageInfo, setImageInfo] = useState(null);

  // Usar el hook useTheme para obtener los colores según el tema actual
  const { colors } = useTheme();

  // Función para comprimir imagen si es necesario
  const compressImageIfNeeded = (file, maxSize = MAX_IMAGE_SIZE) => {
    return new Promise((resolve, reject) => {
      if (file.size <= maxSize) {
        // Si la imagen ya es lo suficientemente pequeña, no la comprimimos
        resolve(file);
        return;
      }

      // Crear un canvas para comprimir la imagen
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          // Calcular nueva altura y anchura manteniendo la proporción
          let newWidth = img.width;
          let newHeight = img.height;
          
          // Calculo de ratio de compresión basado en el tamaño
          const compressionRatio = Math.sqrt(maxSize / file.size);
          
          // Reducir tamaño proporcionalmente
          newWidth = Math.floor(newWidth * compressionRatio);
          newHeight = Math.floor(newHeight * compressionRatio);
          
          // Crear un canvas para la imagen comprimida
          const canvas = document.createElement('canvas');
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          // Dibujar la imagen en el canvas con el nuevo tamaño
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          // Convertir a blob con calidad reducida
          canvas.toBlob((blob) => {
            // Crear un nuevo archivo a partir del blob
            const newFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            // Mostrar información de compresión
            setImageInfo({
              originalSize: (file.size / 1024 / 1024).toFixed(2),
              compressedSize: (newFile.size / 1024 / 1024).toFixed(2),
              width: newWidth,
              height: newHeight
            });
            
            resolve(newFile);
          }, 'image/jpeg', 0.7); // Calidad de JPEG (0.7 = 70%)
        };
      };
      
      reader.onerror = (error) => reject(error);
    });
  };

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
        
        // Mostrar el tamaño original
        const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
        setImageInfo({ originalSize: originalSizeMB });
        
        // Comprimir la imagen si es necesario
        const processedFile = await compressImageIfNeeded(file);
        
        // Convertir a Base64
        const base64String = await convertToBase64(processedFile);
        
        // Mostrar mensaje de éxito por 3 segundos
        setConversionStatus('success');
        setTimeout(() => setConversionStatus(null), 3000);
        
        // Llamar al onChange del componente padre con el archivo original y la versión Base64
        onChange(e, base64String);
      } catch (error) {
        console.error('Error al procesar imagen:', error);
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
    },
    infoMessage: {
      fontSize: typography.fontSize.sm,
      marginTop: spacing.xs,
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
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
        message = imageInfo && imageInfo.compressedSize ? 
          `✓ Imagen comprimida y convertida: ${imageInfo.originalSize}MB → ${imageInfo.compressedSize}MB` :
          '✓ Imagen convertida exitosamente';
        break;
      case 'error':
        statusStyles = styles.errorStatus;
        message = '✗ Error al procesar la imagen';
        break;
      case 'converting':
        statusStyles = styles.convertingStatus;
        message = '⏳ Procesando imagen...';
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

  // Renderizar información de la imagen
  const renderImageInfo = () => {
    if (!imageInfo || conversionStatus === 'converting') return null;
    
    let infoText = '';
    
    if (imageInfo.compressedSize) {
      infoText = `Imagen comprimida: ${imageInfo.width}x${imageInfo.height}px, ${imageInfo.compressedSize}MB (original: ${imageInfo.originalSize}MB)`;
    } else if (imageInfo.originalSize) {
      infoText = `Tamaño de imagen: ${imageInfo.originalSize}MB`;
    }
    
    if (!infoText) return null;
    
    return (
      <div style={styles.infoMessage}>
        {infoText}
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
        {renderImageInfo()}
        <p style={styles.helperText}>
          <span style={{color: colors.primary}}>💡</span>
          Para mejores resultados, usa imágenes de hasta 4MB. Las imágenes más grandes serán comprimidas automáticamente.
        </p>
      </div>
    </div>
  );
};

export default CoverImageUploader;