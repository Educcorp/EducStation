// src/components/admin/PostEditor.jsx
import React, { useState, useEffect } from 'react';
import { spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext'; // Añadir esta importación
import { createPublicacion, createPublicacionFromHTML } from '../../services/publicacionesService';
import { getAllCategorias } from '../../services/categoriasServices';

// Componentes para el editor
import DualModeEditor from './DualModeEditor';
import PostMetadata from './PostMetadata';
import CoverImageUploader from './CoverImageUploader';
import StatusMessage from './StatusMessage';
import ImportExportActions from './ImportExportActions';

// Funciones para almacenamiento local
const savePostToLocalStorage = (post) => {
  try {
    const postToSave = { ...post };
    // No guardamos la imagen como tal, sino solo la URL de vista previa
    delete postToSave.coverImage;
    localStorage.setItem('post_draft', JSON.stringify(postToSave));
    console.log('Saved to localStorage:', postToSave); // Debug
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadPostFromLocalStorage = () => {
  try {
    const savedPost = localStorage.getItem('post_draft');
    return savedPost ? JSON.parse(savedPost) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Componente para la etiqueta de Contenido animada
const ContentLabel = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const { colors, isDarkMode } = useTheme(); // Obtener colores del tema

  useEffect(() => {
    // Activar animación después de un breve retraso
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: spacing.md,
      transform: isAnimated ? 'translateX(0)' : 'translateX(-20px)',
      opacity: isAnimated ? 1 : 0,
      transition: 'all 0.6s ease-out'
    },
    icon: {
      fontSize: '22px',
      marginRight: spacing.sm,
      color: colors.secondary,
      animation: isAnimated ? 'pulseIcon 2s infinite' : 'none'
    },
    label: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      color: isDarkMode ? colors.textLight : colors.primary, // Ajustar color según el tema
      position: 'relative',
      paddingBottom: '3px'
    },
    underline: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: isAnimated ? '100%' : '0%',
      height: '2px',
      backgroundColor: colors.secondary,
      transition: 'width 0.8s ease-in-out',
      transitionDelay: '0.3s'
    },
    badge: {
      display: 'inline-block',
      backgroundColor: isAnimated ? colors.primary : 'transparent',
      color: 'white',
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.round,
      fontSize: typography.fontSize.xs,
      marginLeft: spacing.md,
      transform: isAnimated ? 'scale(1)' : 'scale(0)',
      transition: 'all 0.5s ease-out',
      transitionDelay: '0.6s',
      boxShadow: isAnimated ? '0 2px 4px rgba(11, 68, 68, 0.2)' : 'none'
    }
  };

  return (
    <div style={styles.container}>
      <span style={styles.icon}>📝</span>
      <h3 style={styles.label}>
        Contenido
        <span style={styles.underline}></span>
      </h3>
      <span style={styles.badge}>Editor</span>
    </div>
  );
};

const PostEditor = () => {
  // Obtener los colores del tema actual
  const { colors, isDarkMode } = useTheme();

  const [post, setPost] = useState({
    title: '',
    category: '',
    content: '', // Aseguramos que se inicie con una cadena vacía
    tags: '',
    coverImage: null,
    coverImagePreview: null,
    status: 'draft', // 'draft', 'published'
    publishDate: new Date().toISOString().slice(0, 10),
    editorMode: 'simple', // Set default mode to 'simple'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  // Estado para controlar qué categoría tiene el cursor encima
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Definir descripciones de categorías para los tooltips
  const categoryDescriptions = {
    "Noticias": "Información actualizada sobre eventos y novedades en el ámbito educativo.",
    "Técnicas de Estudio": "Métodos y estrategias para optimizar el aprendizaje y mejorar el rendimiento académico.",
    "Técnicas": "Métodos y estrategias para optimizar el aprendizaje y mejorar el rendimiento académico.",
    "Problemáticas": "Análisis de desafíos y obstáculos en el sistema educativo actual.",
    "Problemáticas en el Estudio": "Análisis de desafíos y obstáculos en el sistema educativo actual.",
    "Educación de Calidad": "Estándares, prácticas y enfoques para una enseñanza de excelencia.",
    "Herramientas": "Recursos tecnológicos y pedagógicos para facilitar la labor docente.",
    "Herramientas Tecnológicas": "Recursos tecnológicos y pedagógicos para facilitar la labor docente.",
    "Desarrollo Docente": "Oportunidades de crecimiento profesional y capacitación para educadores.",
    "Desarrollo Profesional Docente": "Oportunidades de crecimiento profesional y capacitación para educadores.",
    "Comunidad": "Espacios de colaboración e intercambio entre miembros de la comunidad educativa.",
    "Comunidad y Colaboración": "Espacios de colaboración e intercambio entre miembros de la comunidad educativa."
  };

  // Estilos para animaciones de tooltips
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

    .tooltip-arrow {
      position: absolute;
      bottom: -8px;
      left: 50%;
      margin-left: -8px;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid white;
    }
  `;

  // Cargar categorías desde el backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await getAllCategorias();
        console.log("Categorías cargadas:", data);
        if (data && Array.isArray(data)) {
          setCategories(data);
        } else {
          // Si no hay datos o no es un array, usar categorías predeterminadas
          setCategories([
            { ID_categoria: 1, Nombre_categoria: 'Noticias' },
            { ID_categoria: 2, Nombre_categoria: 'Técnicas de Estudio' },
            { ID_categoria: 3, Nombre_categoria: 'Problemáticas en el Estudio' },
            { ID_categoria: 4, Nombre_categoria: 'Educación de Calidad' },
            { ID_categoria: 5, Nombre_categoria: 'Herramientas Tecnológicas' },
            { ID_categoria: 6, Nombre_categoria: 'Desarrollo Profesional Docente' },
            { ID_categoria: 7, Nombre_categoria: 'Comunidad y Colaboración' }
          ]);
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        // Usar categorías predeterminadas en caso de error
        setCategories([
          { ID_categoria: 1, Nombre_categoria: 'Noticias' },
          { ID_categoria: 2, Nombre_categoria: 'Técnicas de Estudio' },
          { ID_categoria: 3, Nombre_categoria: 'Problemáticas en el Estudio' },
          { ID_categoria: 4, Nombre_categoria: 'Educación de Calidad' },
          { ID_categoria: 5, Nombre_categoria: 'Herramientas Tecnológicas' },
          { ID_categoria: 6, Nombre_categoria: 'Desarrollo Profesional Docente' },
          { ID_categoria: 7, Nombre_categoria: 'Comunidad y Colaboración' }
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-dropdown]')) {
        setDropdownOpen(false);
        setHoveredCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup: remover el listener cuando el componente se desmonte
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Manejador para cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Log para depuración
    console.log(`Changing ${name} to ${value}`);

    setPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador para cambios en la imagen de portada
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPost(prev => ({
        ...prev,
        coverImage: file,
        coverImagePreview: URL.createObjectURL(file)
      }));
    }
  };

  // Autoguardado cuando el contenido cambia
  useEffect(() => {
    if (!isInitialized) return; // Evita guardar durante la inicialización

    const timer = setTimeout(() => {
      if (post.content.length > 0 || post.title.length > 0) {
        // console.log('Guardado automático'); // Eliminar o comentar esta línea
        savePostToLocalStorage(post);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [post, isInitialized]);

  // Cargar borrador guardado al iniciar
  useEffect(() => {
    const savedPost = loadPostFromLocalStorage();
    if (savedPost) {
      setPost({
        ...savedPost,
        editorMode: savedPost.editorMode || 'simple' // Ensure 'simple' is the default mode
      });

      console.log('Loaded post with mode:', savedPost.editorMode || 'simple');
    }

    // Marcar como inicializado después de cargar
    setIsInitialized(true);
  }, []);

  // Guardar como borrador
  const saveDraft = async () => {
    // Validación básica
    if (!post.title.trim()) {
      setSaveMessage({
        type: 'error',
        text: 'Por favor añade un título a tu publicación',
        icon: '✖'
      });

      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsSaving(true);

    try {
      // Convertir la categoría seleccionada a un ID numérico si existe
      let categorias = [];
      if (post.category) {
        // Buscar el ID de la categoría seleccionada
        const categoriaSeleccionada = categories.find(cat =>
          typeof cat === 'object' ? cat.Nombre_categoria === post.category : cat === post.category
        );

        if (typeof categoriaSeleccionada === 'object' && categoriaSeleccionada.ID_categoria) {
          categorias = [categoriaSeleccionada.ID_categoria];
        } else if (post.category) {
          // Si no encontramos el ID pero hay una categoría seleccionada, usamos 1 como valor predeterminado
          console.warn("No se pudo encontrar el ID de la categoría, usando valor predeterminado");
          categorias = [1];
        }
      }

      // Preparar los datos para el backend
      const postData = {
        titulo: post.title,
        contenido: post.content,
        resumen: post.title.substring(0, 150), // Usar parte del título como resumen
        estado: 'borrador',
        categorias: categorias
      };

      console.log("Guardando borrador con datos:", postData);

      // Guardar en el backend
      const result = await createPublicacion(postData);

      // Guardar en localStorage como respaldo
      savePostToLocalStorage(post);

      setIsSaving(false);
      setSaveMessage({
        type: 'success',
        text: 'Borrador guardado correctamente',
        icon: '✓'
      });

      // Limpiar mensaje después de unos segundos
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error al guardar borrador:', error);
      setIsSaving(false);
      setSaveMessage({
        type: 'error',
        text: `Error al guardar: ${error.message}`,
        icon: '✖'
      });

      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Publicar el post
  const publishPost = async () => {
    // Validación básica
    if (!post.title.trim() || !post.content.trim() || !post.category) {
      setSaveMessage({
        type: 'error',
        text: 'Por favor completa al menos el título, categoría y contenido del post',
        icon: '✖'
      });

      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsPublishing(true);

    try {
      // Convertir la categoría seleccionada a un ID numérico
      // Buscar el ID de la categoría seleccionada
      const categoriaSeleccionada = categories.find(cat =>
        typeof cat === 'object' ? cat.Nombre_categoria === post.category : cat === post.category
      );

      let categoriaId;
      if (typeof categoriaSeleccionada === 'object' && categoriaSeleccionada.ID_categoria) {
        categoriaId = categoriaSeleccionada.ID_categoria;
      } else {
        // Si no encontramos el ID, usamos 1 como valor predeterminado (asumiendo que existe)
        console.warn("No se pudo encontrar el ID de la categoría, usando valor predeterminado");
        categoriaId = 1;
      }

      // Preparar los datos para el backend
      const postData = {
        titulo: post.title,
        contenido: post.content,
        resumen: post.title.substring(0, 150), // Usar parte del título como resumen
        estado: 'publicado',
        categorias: [categoriaId] // Usar el ID numérico de la categoría
      };

      console.log("Enviando publicación con datos:", postData);

      // Determinar qué endpoint usar según el modo del editor
      let result;
      if (post.editorMode === 'html') {
        result = await createPublicacionFromHTML({
          titulo: postData.titulo,
          htmlContent: postData.contenido,
          resumen: postData.resumen,
          estado: postData.estado,
          categorias: postData.categorias
        });
      } else {
        result = await createPublicacion(postData);
      }

      setIsPublishing(false);
      setPost(prev => ({ ...prev, status: 'published' }));
      setSaveMessage({
        type: 'success',
        text: '¡Post publicado correctamente!',
        icon: '🎉'
      });

      // Limpiar mensaje después de unos segundos
      setTimeout(() => setSaveMessage(null), 3000);

      // Limpieza del borrador en localStorage después de publicar
      localStorage.removeItem('post_draft');
    } catch (error) {
      console.error('Error al publicar:', error);
      setIsPublishing(false);
      setSaveMessage({
        type: 'error',
        text: `Error al publicar: ${error.message}`,
        icon: '✖'
      });

      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Exportar el post a HTML para descargar
  const exportToFile = () => {
    // Crear un objeto de texto para descargar
    const content = post.content;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Crear un enlace de descarga y hacer clic en él
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();

    // Limpiar
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Mostrar mensaje de éxito
    setSaveMessage({
      type: 'success',
      text: `Archivo HTML descargado correctamente`,
      icon: '📥'
    });

    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Importar un archivo HTML
  const importFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const fileExtension = file.name.split('.').pop().toLowerCase();

      // Verificar que sea HTML
      const isHTML = fileExtension === 'html' || fileExtension === 'htm';

      if (isHTML) {
        // Extraer el título del documento HTML si existe
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : '';

        // Actualizar el estado con el contenido HTML
        setPost(prevPost => ({
          ...prevPost,
          title: title || prevPost.title,
          content: content,
          editorMode: 'html'
        }));
      } else {
        // Informar que solo se permiten archivos HTML
        setSaveMessage({
          type: 'error',
          text: 'Solo se permiten archivos HTML (.html, .htm)',
          icon: '⚠️'
        });

        setTimeout(() => setSaveMessage(null), 3000);
        return;
      }

      // Mostrar mensaje de éxito
      setSaveMessage({
        type: 'success',
        text: `Archivo HTML importado correctamente`,
        icon: '📤'
      });

      setTimeout(() => setSaveMessage(null), 3000);
    };

    reader.readAsText(file);
  };

  // Estilos CSS
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `${"100px"} ${spacing.md}`,
      fontFamily: typography.fontFamily
    },
    editorContainer: {
      display: "grid",
      // Cambiado: Invertir el orden de las columnas para que la barra lateral esté a la izquierda
      gridTemplateColumns: "300px 1fr",
      gap: spacing.xl,
      marginBottom: spacing.xxl
    },
    mainEditor: {
      width: "100%",
      maxWidth: "800px" // Anchura predefinida para el contenido del post
    },
    sidebar: {
      // No necesita cambios específicos de estilo aquí
    },
    formGroup: {
      marginBottom: spacing.lg
    },
    actionsContainer: {
      display: "flex",
      justifyContent: "space-between",
      gap: spacing.md,
      marginTop: spacing.xl
    },
    actionButton: {
      padding: `${spacing.sm} ${spacing.lg}`,
      borderRadius: borderRadius.md,
      fontWeight: typography.fontWeight.medium,
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: typography.fontSize.md,
      border: "none",
      // Estilos específicos se aplicarán en cada botón
    },
    saveButton: {
      backgroundColor: colors.secondary,
      color: colors.primary,
      "&:hover": {
        backgroundColor: colors.secondary + "cc", // Añadir transparencia al hover
      }
    },
    publishButton: {
      backgroundColor: colors.primary,
      color: colors.white,
      "&:hover": {
        backgroundColor: colors.primaryLight,
      }
    }
  };

  // Modificar el componente PostMetadata para usar las categorías cargadas
  const renderPostMetadata = () => {
    return (
      <div style={{
        marginTop: spacing.lg,
        backgroundColor: isDarkMode ? colors.backgroundDarkSecondary : colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        boxShadow: shadows.sm
      }}>
        <h3 style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semiBold,
          marginBottom: spacing.md,
          color: isDarkMode ? colors.textLight : colors.primary
        }}>Detalles de la publicación</h3>

        <div style={{ marginBottom: spacing.md, position: 'relative' }}>
          <label style={{
            display: 'block',
            marginBottom: spacing.xs,
            fontWeight: typography.fontWeight.medium,
            color: isDarkMode ? colors.textLight : colors.textPrimary
          }} htmlFor="category">
            <span style={{ color: colors.secondary, fontSize: '1.1em', marginRight: spacing.xs }}>📂</span>
            Categoría
          </label>

          {/* Custom Dropdown Implementation */}
          <div style={{
            position: "relative",
            width: "100%",
          }}>
            <div
              style={{
                width: "100%",
                padding: spacing.md,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.gray200}`,
                fontSize: typography.fontSize.md,
                backgroundColor: isDarkMode ? colors.backgroundDark : colors.white,
                borderLeft: `4px solid ${colors.secondary}`,
                transition: "all 0.3s ease",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: isDarkMode ? colors.textLight : colors.textPrimary,
                boxShadow: dropdownOpen ? `0 0 0 2px ${colors.secondary}30` : 'none'
              }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              data-dropdown
            >
              {post.category || "Selecciona una categoría"}
              <span style={{
                marginLeft: spacing.sm,
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s ease-in-out'
              }}>▼</span>
            </div>

            {dropdownOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 5px)",
                left: 0,
                right: 0,
                backgroundColor: "#f8f9fa", // Cambiado a un fondo claro
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.gray200}`,
                borderLeft: `4px solid ${colors.secondary}`,
                boxShadow: shadows.md,
                zIndex: 20,
                maxHeight: "300px",
                overflowY: "auto",
                width: "100%"
              }}
                data-dropdown
              >
                <div
                  style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                    paddingLeft: spacing.md,
                    cursor: "pointer",
                    borderBottom: `1px solid ${colors.gray200}`,
                    transition: "background-color 0.2s ease",
                    position: "relative",
                    color: colors.primary, // Cambiado a color primario
                    backgroundColor: 'transparent',
                    borderLeft: '4px solid transparent'
                  }}
                  onClick={() => {
                    handleChange({ target: { name: 'category', value: '' } });
                    setDropdownOpen(false);
                    setHoveredCategory(null);
                  }}
                >
                  Selecciona una categoría
                </div>

                {categories.map((cat) => {
                  const categoryName = typeof cat === 'object' ? cat.Nombre_categoria : cat;
                  const isSelected = post.category === categoryName;

                  return (
                    <div
                      key={categoryName}
                      style={{
                        padding: `${spacing.sm} ${spacing.md}`,
                        paddingLeft: spacing.md,
                        cursor: "pointer",
                        borderBottom: `1px solid ${colors.gray200}`,
                        transition: "all 0.2s ease",
                        position: "relative",
                        backgroundColor: hoveredCategory === categoryName
                          ? colors.secondary + '25' // Color de fondo al pasar el cursor (con transparencia)
                          : isSelected
                            ? colors.secondary + '15' // Color de fondo si está seleccionado
                            : 'transparent',
                        color: colors.primary, // Color de texto
                        fontWeight: isSelected ? typography.fontWeight.bold : typography.fontWeight.normal,
                        borderLeft: isSelected ? `4px solid ${colors.secondary}` : '4px solid transparent'
                      }}
                      onClick={() => {
                        handleChange({ target: { name: 'category', value: categoryName } });
                        setDropdownOpen(false);
                        setHoveredCategory(null);
                      }}
                      onMouseEnter={() => setHoveredCategory(categoryName)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      {categoryName}

                      {/* Tooltip de descripción */}
                      {hoveredCategory === categoryName && categoryDescriptions[categoryName] && (
                        <div style={{
                          position: "absolute",
                          top: "-50px",
                          left: 0,
                          right: 0,
                          backgroundColor: colors.white,
                          color: colors.primary,
                          padding: spacing.sm,
                          borderRadius: borderRadius.md,
                          fontSize: typography.fontSize.sm,
                          border: `1px solid ${colors.gray200}`,
                          borderLeft: `4px solid ${colors.secondary}`,
                          boxShadow: `0 3px 6px rgba(0,0,0,0.1)`,
                          zIndex: 100,
                          width: "100%",
                          opacity: 0.98,
                          animation: "fadeIn 0.2s ease-in-out",
                          pointerEvents: "none",
                          fontWeight: typography.fontWeight.medium,
                          maxWidth: "100%",
                          whiteSpace: "normal",
                          lineHeight: "1.4",
                          textAlign: "left"
                        }}>
                          {categoryDescriptions[categoryName]}
                          <span className="tooltip-arrow"></span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{
            display: 'block',
            marginBottom: spacing.xs,
            fontWeight: typography.fontWeight.medium,
            color: isDarkMode ? colors.textLight : colors.textPrimary
          }} htmlFor="tags">
            Etiquetas (separadas por comas)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={post.tags}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: spacing.sm,
              borderRadius: borderRadius.sm,
              border: `1px solid ${colors.gray200}`,
              backgroundColor: isDarkMode ? colors.backgroundDark : colors.white,
              color: isDarkMode ? colors.textLight : colors.textPrimary
            }}
            placeholder="ej. educación, tecnología, aprendizaje"
          />
        </div>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{
            display: 'block',
            marginBottom: spacing.xs,
            fontWeight: typography.fontWeight.medium,
            color: isDarkMode ? colors.textLight : colors.textPrimary
          }} htmlFor="publishDate">
            Fecha de publicación
          </label>
          <input
            type="date"
            id="publishDate"
            name="publishDate"
            value={post.publishDate}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: spacing.sm,
              borderRadius: borderRadius.sm,
              border: `1px solid ${colors.gray200}`,
              backgroundColor: isDarkMode ? colors.backgroundDark : colors.white,
              color: isDarkMode ? colors.textLight : colors.textPrimary
            }}
          />
        </div>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{
            display: 'block',
            marginBottom: spacing.xs,
            fontWeight: typography.fontWeight.medium,
            color: isDarkMode ? colors.textLight : colors.textPrimary
          }}>
            Estado actual
          </label>
          <div style={{
            display: 'inline-block',
            padding: `${spacing.xs} ${spacing.sm}`,
            backgroundColor: post.status === 'draft' ? colors.warning : colors.success,
            color: colors.white,
            borderRadius: borderRadius.sm,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium
          }}>
            {post.status === 'draft' ? 'Borrador' : 'Publicado'}
          </div>
        </div>
      </div>
    );
  };

  // Solo renderizar una vez inicializado para evitar problemas de redimensión
  if (!isInitialized) {
    return <div style={styles.container}>Cargando editor...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Estilos CSS en línea para animaciones */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes pulseIcon {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes shine {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          ${keyframes}
        `
      }} />

      <div style={styles.editorContainer}>
        {/* Sidebar - Ahora a la izquierda */}
        <div style={styles.sidebar}>
          <CoverImageUploader
            coverImagePreview={post.coverImagePreview}
            onChange={handleImageChange}
          />

          {renderPostMetadata()}

          <ImportExportActions
            onExport={exportToFile}
            onImport={importFile}
          />
        </div>

        {/* Main Editor - Ahora a la derecha */}
        <div style={styles.mainEditor}>
          <div style={styles.formGroup}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              marginBottom: spacing.xs,
              fontWeight: typography.fontWeight.medium,
              color: isDarkMode ? colors.textLight : colors.primary
            }} htmlFor="title">
              <span style={{ color: isDarkMode ? colors.textLight : colors.primary, fontSize: '1.4em' }}>📝</span> Título del post
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={post.title}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: spacing.md,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.gray200}`,
                fontSize: typography.fontSize.lg,
                transition: "all 0.3s ease",
                marginBottom: spacing.md,
                fontWeight: typography.fontWeight.semiBold,
                borderLeft: `4px solid ${colors.primary}`,
                backgroundColor: colors.white,
                color: isDarkMode ? colors.textPrimary : "#000000",
              }}
              placeholder="Escribe un título atractivo"
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 0 2px ${colors.primary}30`;
                e.target.style.borderLeft = `4px solid ${colors.secondary}`;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.borderLeft = `4px solid ${colors.primary}`;
              }}
            />
          </div>

          <div style={styles.formGroup}>
            {/* Etiqueta "Contenido" animada */}
            <ContentLabel />

            <DualModeEditor
              content={post.content}
              onChange={handleChange}
              initialMode={post.editorMode}
            />
          </div>

          {saveMessage && (
            <StatusMessage
              type={saveMessage.type}
              text={saveMessage.text}
              icon={saveMessage.icon}
            />
          )}

          <div style={styles.actionsContainer}>
            <button
              onClick={saveDraft}
              disabled={isSaving}
              style={{
                ...styles.actionButton,
                ...styles.saveButton
              }}
            >
              {isSaving ? 'Guardando...' : 'Guardar borrador'}
            </button>

            <button
              onClick={publishPost}
              disabled={isPublishing}
              style={{
                ...styles.actionButton,
                ...styles.publishButton
              }}
            >
              {isPublishing ? 'Publicando...' : 'Publicar post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;