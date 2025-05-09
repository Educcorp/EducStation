import React, { useState } from 'react';
import { spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext'; // Añadir esta importación

const PostMetadata = ({ post, categories, onChange }) => {
  // Obtener colores del tema actual
  const { colors, isDarkMode } = useTheme();
  
  // State to track which category is being hovered
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Category descriptions object
  const categoryDescriptions = {
    "Noticias": "Información actualizada sobre eventos y novedades en el ámbito educativo.",
    "Técnicas de Estudio": "Métodos y estrategias para optimizar el aprendizaje y mejorar el rendimiento académico.",
    "Problemáticas": "Análisis de desafíos y obstáculos en el sistema educativo actual.",
    "Educación de Calidad": "Estándares, prácticas y enfoques para una enseñanza de excelencia.",
    "Herramientas": "Recursos tecnológicos y pedagógicos para facilitar la labor docente.",
    "Desarrollo Docente": "Oportunidades de crecimiento profesional y capacitación para educadores.",
    "Comunidad": "Espacios de colaboración e intercambio entre miembros de la comunidad educativa."
  };

  // Estilos para animaciones
  const keyframes = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 0.98;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeOut {
      from {
        opacity: 0.98;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(8px);
      }
    }
  `;

  const styles = {
    card: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      boxShadow: shadows.sm,
      marginBottom: spacing.lg,
      borderTop: `3px solid ${colors.secondary}`
    },
    formGroup: {
      marginBottom: spacing.lg
    },
    label: {
      display: "flex",
      alignItems: "center",
      gap: spacing.xs,
      marginBottom: spacing.xs,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary
    },
    input: {
      width: "100%",
      padding: spacing.md,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.md,
      transition: "all 0.3s ease",
      marginBottom: spacing.md,
      borderLeft: `4px solid ${colors.secondary}`
    },
    select: {
      width: "100%",
      padding: spacing.md,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.md,
      backgroundColor: colors.white,
      borderLeft: `4px solid ${colors.secondary}`,
      transition: "all 0.3s ease",
      position: "relative"
    },
    selectContainer: {
      position: "relative"
    },
    descriptionTooltip: {
      position: "absolute",
      top: "calc(100% + 5px)",
      left: 0,
      right: 0,
      backgroundColor: colors.primary,
      color: colors.white,
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      boxShadow: shadows.md,
      zIndex: 10,
      opacity: 1,
      transition: "opacity 0.3s ease, transform 0.3s ease",
      transform: "translateY(0)",
      maxWidth: "100%"
    },
    option: {
      padding: `${spacing.xs} ${spacing.md}`,
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    tagsInputContainer: {
      marginBottom: spacing.md
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
    tagContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: spacing.xs,
      marginTop: spacing.sm
    },
    tag: {
      backgroundColor: colors.secondary + '40',
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.round,
      fontSize: typography.fontSize.xs,
      color: colors.primary,
      display: "flex",
      alignItems: "center",
      gap: spacing.xs,
      transition: "all 0.3s ease"
    },
    // Custom dropdown styles
    customSelect: {
      position: "relative",
      width: "100%",
    },
    selectedValue: {
      width: "100%",
      padding: spacing.md,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      fontSize: typography.fontSize.md,
      backgroundColor: colors.white,
      borderLeft: `4px solid ${colors.secondary}`,
      transition: "all 0.3s ease",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: isDarkMode ? colors.textPrimary : "#000000" // Texto blanco en modo oscuro
    },
    dropdownIcon: {
      marginLeft: spacing.sm,
      transition: "transform 0.3s ease",
      color: isDarkMode ? colors.textPrimary : "#000000" // Flecha blanca en modo oscuro
    },
    optionsContainer: {
      position: "absolute",
      top: "calc(100% + 5px)",
      left: 0,
      right: 0,
      backgroundColor: colors.white, // Mantenemos el fondo blanco
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      boxShadow: shadows.md,
      zIndex: 20,
      maxHeight: "300px",
      overflowY: "auto",
      width: "100%"
    },
    optionItem: {
      padding: `${spacing.sm} ${spacing.md}`,
      cursor: "pointer",
      borderBottom: `1px solid ${colors.gray100}`,
      transition: "background-color 0.2s ease",
      position: "relative",
      color: isDarkMode ? colors.textPrimary : "#000000"  // Texto blanco en modo oscuro para las opciones
    },
    // Estilo para los tooltips de descripción
    optionDescription: {
      position: "absolute",
      top: "-40px",
      left: 0,
      backgroundColor: colors.white,
      color: colors.primary,
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      border: `1px solid ${colors.gray200}`,
      borderLeft: `4px solid ${colors.primary}`, // Cambiado a primary
      boxShadow: `0 3px 6px rgba(0,0,0,0.1)`,
      zIndex: 100,
      width: "100%",
      opacity: 0,
      transition: "opacity 0.2s ease-in-out, transform 0.2s ease-in-out",
      pointerEvents: "none",
      transform: "translateY(10px)",
      fontWeight: typography.fontWeight.medium
    }
  };

  // State for custom dropdown
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (category) => {
    const e = {
      target: {
        name: "category",
        value: category
      }
    };
    onChange(e);
    setIsOpen(false);
  };

  return (
    <div style={styles.card}>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="category">
          <span style={{ color: colors.secondary, fontSize: '1.1em' }}>📂</span> Categoría
        </label>

        {/* Estilos de animación en el head */}
        <style>
          {keyframes}
        </style>

        {/* Custom Dropdown Implementation */}
        <div style={styles.customSelect}>
          <div
            style={{
              ...styles.selectedValue,
              boxShadow: isOpen ? `0 0 0 2px ${colors.secondary}30` : 'none'
            }}
            onClick={toggleDropdown}
          >
            {post.category || "Selecciona una categoría"}
            <span style={{
              ...styles.dropdownIcon,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s ease-in-out'
            }}>▼</span>
          </div>

          {isOpen && (
            <div style={styles.optionsContainer}>
              <div
                style={{
                  ...styles.optionItem,
                  backgroundColor: 'transparent'
                }}
                onClick={() => handleSelectOption("")}
              >
                Selecciona una categoría
              </div>

              {categories.map((category) => (
                <div
                  key={category}
                  style={{
                    ...styles.optionItem,
                    backgroundColor: hoveredCategory === category ? `${colors.gray100}` : 'transparent'
                  }}
                  onClick={() => handleSelectOption(category)}
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {category}

                  {/* Hover description - aparece solo cuando el cursor está encima */}
                  {hoveredCategory === category && categoryDescriptions[category] && (
                    <div style={{
                      ...styles.optionDescription,
                      opacity: 0.98,
                      transform: "translateY(0)",
                      animation: "fadeIn 0.2s ease-in-out"
                    }}>
                      {categoryDescriptions[category]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="publishDate">
          <span style={{ color: colors.secondary, fontSize: '1.1em' }}>📅</span> Fecha de publicación
        </label>
        <input
          type="date"
          id="publishDate"
          name="publishDate"
          value={post.publishDate}
          onChange={onChange}
          style={styles.input}
          min={new Date().toISOString().split('T')[0]}
          onFocus={(e) => {
            e.target.style.boxShadow = `0 0 0 2px ${colors.secondary}30`;
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        />
        <p style={styles.helperText}>
          <span style={{ color: colors.secondary }}>⏰</span>
          Puedes programar la publicación para una fecha futura.
        </p>
      </div>
    </div>
  );
};

export default PostMetadata;