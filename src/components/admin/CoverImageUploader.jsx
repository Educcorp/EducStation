import React, { useState } from 'react';
import { spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

// Constante para el tamaño máximo de imagen en bytes (4MB)
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
// Tamaño máximo absoluto - no se permitirán imágenes mayores a este tamaño ni siquiera comprimidas (15MB)
const ABSOLUTE_MAX_SIZE = 15 * 1024 * 1024;

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
      // Verificar si la imagen excede el tamaño máximo absoluto
      if (file.size > ABSOLUTE_MAX_SIZE) {
        reject(new Error(`La imagen es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)} MB). El tamaño máximo permitido es de ${ABSOLUTE_MAX_SIZE / 1024 / 1024} MB.`));
        return;
      }

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
          // Para imágenes muy grandes, usamos un factor más agresivo
          let compressionRatio;
          
          if (file.size > 10 * 1024 * 1024) { // Más de 10MB
            // Compresión muy agresiva
            compressionRatio = Math.sqrt(maxSize / file.size) * 0.7;
          } else if (file.size > 5 * 1024 * 1024) { // Entre 5MB y 10MB
            // Compresión agresiva
            compressionRatio = Math.sqrt(maxSize / file.size) * 0.8;
          } else {
            // Compresión estándar
            compressionRatio = Math.sqrt(maxSize / file.size);
          }
          
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
          
          // Calcular calidad de JPEG según tamaño original
          let jpegQuality = 0.7; // Calidad por defecto (70%)
          
          if (file.size > 10 * 1024 * 1024) {
            jpegQuality = 0.5; // 50% para imágenes muy grandes
          } else if (file.size > 5 * 1024 * 1024) {
            jpegQuality = 0.6; // 60% para imágenes grandes
          }
          
          // Convertir a blob con calidad reducida
          canvas.toBlob((blob) => {
            // Crear un nuevo archivo a partir del blob
            const newFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            // Verificar si después de la compresión todavía es demasiado grande
            if (newFile.size > MAX_IMAGE_SIZE * 1.2) { // Permitimos un poco de margen
              // Intentar comprimir de nuevo con calidad más baja
              const secondCanvas = document.createElement('canvas');
              const reducedWidth = Math.floor(newWidth * 0.8); // Reducir tamaño en un 20% adicional
              const reducedHeight = Math.floor(newHeight * 0.8);
              
              secondCanvas.width = reducedWidth;
              secondCanvas.height = reducedHeight;
              
              const ctx2 = secondCanvas.getContext('2d');
              ctx2.drawImage(img, 0, 0, reducedWidth, reducedHeight);
              
              secondCanvas.toBlob((secondBlob) => {
                const finalFile = new File([secondBlob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                
                setImageInfo({
                  originalSize: (file.size / 1024 / 1024).toFixed(2),
                  compressedSize: (finalFile.size / 1024 / 1024).toFixed(2),
                  width: reducedWidth,
                  height: reducedHeight,
                  compressionLevel: 'alta' // Indicar compresión alta
                });
                
                resolve(finalFile);
              }, 'image/jpeg', 0.45); // Calidad muy reducida (45%)
            } else {
              // Mostrar información de compresión
              setImageInfo({
                originalSize: (file.size / 1024 / 1024).toFixed(2),
                compressedSize: (newFile.size / 1024 / 1024).toFixed(2),
                width: newWidth,
                height: newHeight,
                compressionLevel: file.size > 5 * 1024 * 1024 ? 'media' : 'normal'
              });
              
              resolve(newFile);
            }
          }, 'image/jpeg', jpegQuality);
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
        
        // Verificar si la imagen es demasiado grande antes de intentar procesarla
        if (file.size > ABSOLUTE_MAX_SIZE) {
          throw new Error(`La imagen es demasiado grande (${originalSizeMB} MB). El tamaño máximo permitido es de ${ABSOLUTE_MAX_SIZE / 1024 / 1024} MB.`);
        }
        
        // Comprimir la imagen si es necesario
        const processedFile = await compressImageIfNeeded(file);
        
        // Convertir a Base64
        const base64String = await convertToBase64(processedFile);
        
        // Verificar el tamaño de la cadena Base64
        const base64SizeBytes = base64String.length * 0.75; // Aproximación del tamaño en bytes
        const base64SizeMB = (base64SizeBytes / 1024 / 1024).toFixed(2);
        
        if (base64SizeBytes > 45 * 1024 * 1024) { // Límite de 45MB para Base64 (menor que max_allowed_packet)
          throw new Error(`La imagen procesada sigue siendo demasiado grande (${base64SizeMB} MB). Por favor, utiliza una imagen más pequeña.`);
        }
        
        // Mostrar mensaje de éxito por 3 segundos
        setConversionStatus('success');
        setTimeout(() => setConversionStatus(null), 3000);
        
        // Llamar al onChange del componente padre con el archivo original y la versión Base64
        onChange(e, base64String);
      } catch (error) {
        console.error('Error al procesar imagen:', error);
        // Mostrar mensaje de error
        setConversionStatus('error');
        setImageInfo({ 
          error: true, 
          message: error.message || 'Error al procesar la imagen'
        });
        setTimeout(() => setConversionStatus(null), 5000);
        
        // Limpiar el input de archivo
        e.target.value = '';
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
        if (imageInfo && imageInfo.compressionLevel === 'alta') {
          message += ' (compresión alta)';
        }
        break;
      case 'error':
        statusStyles = styles.errorStatus;
        message = imageInfo && imageInfo.error ? 
          `✗ ${imageInfo.message}` : 
          '✗ Error al procesar la imagen';
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

  const getValidImageSrc = (src) => {
    if (src.startsWith('data:')) {
      return src;
    } else if (src.startsWith('http') || src.startsWith('https')) {
      return src;
    } else {
      console.warn('URL de imagen no válida:', src);
      return null;
    }
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
              src={getValidImageSrc(coverImagePreview)} 
              alt="Vista previa de la portada" 
              style={styles.coverImage}
              onError={(e) => {
                console.warn('Error cargando imagen preview:', coverImagePreview);
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; color: #888; text-align: center;"><span style="font-size: 28px; margin-bottom: 8px;">❌</span><span>Error al cargar imagen</span></div>';
              }}
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