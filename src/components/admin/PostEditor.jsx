// src/components/admin/PostEditor.jsx
import React, { useState, useEffect } from 'react';
import { spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';
import { createPublicacion, createPublicacionFromHTML, getPublicacionById, updatePublicacion } from '../../services/publicacionesService';
import { getAllCategorias } from '../../services/categoriasServices';
import { Calendar } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

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
    // Incluimos el resumen en los datos guardados
    postToSave.lastSaved = new Date().toISOString();
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

const PostEditor = () => {
  // Obtener los colores del tema actual
  const { colors, isDarkMode } = useTheme();
  const { postId } = useParams(); // Obtener el ID del post de los parámetros de la URL
  const navigate = useNavigate();

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
    resumen: '', // Añadimos el campo resumen
  });

  const [isEditing, setIsEditing] = useState(false); // Estado para saber si estamos editando un post existente
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

  // Cargar post existente si hay un postId
  useEffect(() => {
    const loadExistingPost = async () => {
      if (postId) {
        try {
          const postData = await getPublicacionById(postId);
          console.log('Post cargado para edición:', postData);
          
          // Encontrar la categoría por su ID
          let categoryName = '';
          if (postData.categorias && postData.categorias.length > 0 && categories.length > 0) {
            const category = categories.find(cat => 
              cat.ID_categoria === postData.categorias[0].ID_categoria
            );
            if (category) {
              categoryName = category.Nombre_categoria;
            }
          }
          
          setPost({
            title: postData.Titulo || '',
            category: categoryName,
            content: postData.contenido || '',
            tags: '',
            coverImage: null,
            coverImagePreview: postData.Imagen_portada ? 
              (postData.Imagen_portada.startsWith('data:') ? 
                postData.Imagen_portada : 
                `data:image/jpeg;base64,${postData.Imagen_portada}`) : 
              null,
            status: postData.Estado || 'draft',
            publishDate: postData.Fecha_publicacion ? 
              new Date(postData.Fecha_publicacion).toISOString().slice(0, 10) : 
              new Date().toISOString().slice(0, 10),
            editorMode: 'simple',
            resumen: postData.Resumen || '',
            Imagen_portada: postData.Imagen_portada || null
          });
          
          setIsEditing(true);
          setSaveMessage({
            type: 'success',
            text: 'Post cargado correctamente para edición',
            icon: '✓'
          });
          
          setTimeout(() => setSaveMessage(null), 3000);
        } catch (error) {
          console.error('Error al cargar el post para edición:', error);
          setSaveMessage({
            type: 'error',
            text: `Error al cargar el post: ${error.message}`,
            icon: '✖'
          });
          
          setTimeout(() => setSaveMessage(null), 3000);
        }
      }
    };
    
    // Solo cargar el post después de que las categorías estén disponibles
    if (categories.length > 0 && postId) {
      loadExistingPost();
    }
  }, [postId, categories]);

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

  // Manejador específico para cambios del DualModeEditor
  const handleEditorChange = (eventOrContent) => {
    // Si es un string directo (contenido), manejar como contenido
    if (typeof eventOrContent === 'string') {
      console.log('DualModeEditor - Actualizando contenido:', eventOrContent.substring(0, 50) + '...');
      setPost(prev => ({ ...prev, content: eventOrContent }));
      return;
    }

    // Si es un evento del editor, verificar qué tipo de cambio es
    if (eventOrContent && eventOrContent.target) {
      const { name, value } = eventOrContent.target;
      
      console.log(`DualModeEditor - Changing ${name} to ${value}`);
      
      if (name === 'content') {
        // Cambio de contenido
        setPost(prev => ({ ...prev, content: value }));
      } else if (name === 'editorMode') {
        // Cambio de modo del editor
        console.log('DualModeEditor - Cambiando modo del editor a:', value);
        setPost(prev => ({ ...prev, editorMode: value }));
      } else {
        // Otros cambios
        setPost(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  // Manejador para cambios en la imagen de portada
  const handleImageChange = (e, base64Image) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Imagen Base64 recibida:", base64Image ? base64Image.substring(0, 50) + "..." : "No hay imagen Base64");
      // Guardar tanto el archivo como la vista previa
      setPost(prev => ({
        ...prev,
        coverImage: file,
        coverImagePreview: URL.createObjectURL(file),
        // Guardar la versión Base64 de la imagen para enviarla al backend
        Imagen_portada: base64Image || null
      }));
    }
  };

  // Cargar datos guardados en localStorage al iniciar
  useEffect(() => {
    // Cargar borrador del almacenamiento local
    const savedPost = loadPostFromLocalStorage();
    if (savedPost) {
      setPost(prev => ({
        ...prev,
        ...savedPost,
        // Asegurarnos que editorMode existe y tiene un valor válido
        editorMode: savedPost.editorMode || 'simple'
      }));
    }
    
    // Marcar como inicializado después de cargar
    setIsInitialized(true);
    
    // Auto-guardado cada 30 segundos
    let interval;
    setTimeout(() => {
      interval = setInterval(() => {
        if (post.title || post.content) {
          saveDraft();
        }
      }, 30000);
    }, 5000); // Esperar 5 segundos antes de iniciar el intervalo
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Autoguardado cuando el contenido cambia
  useEffect(() => {
    if (post.content.length > 0 || post.title.length > 0) {
      savePostToLocalStorage(post);
    }
  }, [post]);

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
        resumen: post.resumen || post.title.substring(0, 150), // Usar el resumen o parte del título como resumen si no existe
        estado: 'borrador',
        categorias: categorias,
        Imagen_portada: post.Imagen_portada || null // Enviar la imagen en Base64 si existe
      };
      
      console.log("Guardando borrador con datos:", postData);
      
      // Guardar en el backend
      let result;
      
      if (isEditing) {
        // Si estamos editando un post existente, usamos updatePublicacion
        console.log(`Actualizando borrador existente con ID: ${postId}`);
        result = await updatePublicacion(postId, postData);
      } else {
        // Si es un nuevo post, usamos createPublicacion
        result = await createPublicacion(postData);
      }
      
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
        resumen: post.resumen || post.title.substring(0, 150), // Usar el resumen o parte del título como resumen si no existe
        estado: 'publicado',
        categorias: [categoriaId], // Usar el ID numérico de la categoría
        Imagen_portada: post.Imagen_portada || null // Enviar la imagen en Base64 si existe
      };
      
      console.log("Enviando publicación con datos:", postData);
      // Verificar si la imagen está presente
      if (post.Imagen_portada) {
        console.log("Imagen incluida en la publicación (primeros 50 caracteres):", post.Imagen_portada.substring(0, 50) + "...");
        console.log("Longitud de la imagen Base64:", post.Imagen_portada.length);
      } else {
        console.log("No se incluyó imagen en la publicación");
      }
      
      // Determinar qué endpoint usar según el modo del editor y si es una edición o creación
      let result;
      
      if (isEditing) {
        // Si estamos editando un post existente, usamos updatePublicacion
        console.log(`Actualizando post existente con ID: ${postId}`);
        result = await updatePublicacion(postId, postData);
        setSaveMessage({
          type: 'success',
          text: '¡Post actualizado correctamente!',
          icon: '🎉'
        });
      } else {
        // Si es un nuevo post, usamos createPublicacion o createPublicacionFromHTML
        if (post.editorMode === 'html') {
          console.log("Usando endpoint HTML con contenido HTML de longitud:", post.content.length);
          console.log("Muestra del contenido HTML:", post.content.substring(0, 150) + "...");
          
          // Verificar que el contenido no sea vacío o solo espacios
          if (!post.content.trim()) {
            throw new Error("El contenido HTML está vacío o solo contiene espacios");
          }
          
          // Verificar que el contenido tenga etiquetas HTML válidas
          if (!post.content.includes("<") || !post.content.includes(">")) {
            console.warn("El contenido no parece contener etiquetas HTML válidas");
          }
          
          result = await createPublicacionFromHTML({
            titulo: postData.titulo,
            htmlContent: post.content, // Aquí está el cambio clave: enviamos el contenido como htmlContent
            resumen: post.resumen || postData.resumen,
            estado: postData.estado,
            categorias: postData.categorias,
            Imagen_portada: postData.Imagen_portada // Enviar la imagen en Base64
          });
        } else {
          result = await createPublicacion(postData);
        }
        
        setSaveMessage({
          type: 'success',
          text: '¡Post publicado correctamente!',
          icon: '🎉'
        });
      }
      
      setIsPublishing(false);
      setPost(prev => ({ ...prev, status: 'published' }));
      
      // Limpiar mensaje después de unos segundos
      setTimeout(() => setSaveMessage(null), 3000);
      
      // Limpieza del borrador en localStorage después de publicar
      localStorage.removeItem('post_draft');
      
      // Redireccionar al panel de administración después de publicar/actualizar
      setTimeout(() => {
        navigate('/admin/panel', { state: { forceReload: true } });
      }, 1500);
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
    try {
      // Prepare the data for export (including the resumen field)
      const postData = {
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags,
        status: post.status,
        publishDate: post.publishDate,
        editorMode: post.editorMode,
        resumen: post.resumen,
        // We don't include the image as it's a File object which can't be serialized
        // But we could include the coverImagePreview URL
        coverImagePreview: post.coverImagePreview
      };
      
      // Convert to JSON
      const jsonData = JSON.stringify(postData, null, 2);
      
      // Create a blob from the JSON data
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // Create a download link and trigger it
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.json`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      // Show success message
      setSaveMessage({
        type: 'success',
        text: 'Post exportado correctamente',
        icon: '📤'
      });
      
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error al exportar post:', error);
      setSaveMessage({
        type: 'error',
        text: 'Error al exportar: ' + error.message,
        icon: '✖'
      });
      
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Importar un archivo HTML
  const importFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // Parse the imported JSON data
        const importedData = JSON.parse(event.target.result);
        
        // Update the post state with the imported data
        setPost(prev => ({
          ...prev,
          title: importedData.title || '',
          content: importedData.content || '',
          category: importedData.category || '',
          tags: importedData.tags || '',
          status: importedData.status || 'draft',
          publishDate: importedData.publishDate || new Date().toISOString().slice(0, 10),
          editorMode: importedData.editorMode || 'simple',
          resumen: importedData.resumen || '',
          coverImagePreview: importedData.coverImagePreview || null
        }));
        
        // Show success message
        setSaveMessage({
          type: 'success',
          text: 'Post importado correctamente',
          icon: '📥'
        });
        
        setTimeout(() => setSaveMessage(null), 3000);
      } catch (error) {
        console.error('Error al importar archivo:', error);
        setSaveMessage({
          type: 'error',
          text: 'Error al importar: formato inválido',
          icon: '✖'
        });
        
        setTimeout(() => setSaveMessage(null), 3000);
      }
    };
    
    reader.readAsText(file);
  };

  // Estilos CSS
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: spacing.lg,
      fontFamily: typography.fontFamily
    },
    editorContainer: {
      display: "grid",
      gridTemplateColumns: "300px 1fr",
      gap: spacing.xl,
      marginBottom: spacing.xxl
    },
    mainEditor: {
      width: "100%"
    },
    sidebar: {
      // Estilos para la barra lateral
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
    },
    saveButton: {
      backgroundColor: colors.secondary,
      color: colors.primary,
    },
    publishButton: {
      backgroundColor: colors.primary,
      color: colors.white,
    }
  };

  // Renderizar metadatos del post
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
                padding: spacing.sm,
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
                backgroundColor: colors.white,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.gray200}`,
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
                    cursor: "pointer",
                    borderBottom: `1px solid ${colors.gray200}`,
                    transition: "background-color 0.2s ease",
                    position: "relative",
                    color: colors.primary,
                    backgroundColor: 'transparent'
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
                        cursor: "pointer",
                        borderBottom: `1px solid ${colors.gray200}`,
                        transition: "all 0.2s ease",
                        position: "relative",
                        backgroundColor: hoveredCategory === categoryName
                          ? colors.secondary + '15'
                          : isSelected
                            ? colors.secondary + '08'
                            : 'transparent',
                        color: colors.primary,
                        fontWeight: isSelected ? typography.fontWeight.bold : typography.fontWeight.normal
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
                          boxShadow: `0 3px 6px rgba(0,0,0,0.1)`,
                          zIndex: 100,
                          width: "100%",
                          opacity: 0.98,
                          fontWeight: typography.fontWeight.medium,
                          maxWidth: "100%",
                          whiteSpace: "normal",
                          lineHeight: "1.4",
                          textAlign: "left"
                        }}>
                          {categoryDescriptions[categoryName]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: spacing.md, position: 'relative' }}>
          <label style={{
            display: 'block',
            marginBottom: spacing.xs,
            fontWeight: typography.fontWeight.medium,
            color: isDarkMode ? colors.textLight : colors.textPrimary
          }} htmlFor="publishDate">
            Fecha de publicación
          </label>

          <div style={{
            position: "relative",
            width: "100%",
          }}>
            <div style={{
              width: "100%",
              padding: spacing.sm,
              borderRadius: borderRadius.md,
              border: `1px solid ${colors.gray200}`,
              fontSize: typography.fontSize.md,
              backgroundColor: isDarkMode ? colors.backgroundDark : colors.white,
              transition: "all 0.3s ease",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: isDarkMode ? colors.textLight : colors.textPrimary,
              pointerEvents: "none"
            }}>
              <input
                type="text"
                id="publishDate"
                name="publishDate"
                value={new Date().toLocaleDateString('es-ES')}
                readOnly
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  padding: "0",
                  fontSize: typography.fontSize.md,
                  backgroundColor: "transparent",
                  color: isDarkMode ? colors.textLight : colors.textPrimary,
                  cursor: "default"
                }}
              />
              <Calendar size={18} color={colors.gray400} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Solo renderizar una vez inicializado para evitar problemas de redimensión
  if (loadingCategories) {
    return (
      <div style={{
        ...styles.container,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing.md
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `3px solid ${colors.gray200}`,
            borderTop: `3px solid ${colors.secondary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{
            color: colors.textPrimary,
            fontSize: typography.fontSize.md
          }}>
            Cargando categorías...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={{
        fontSize: typography.fontSize.xxl,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
        marginBottom: spacing.lg,
        textAlign: 'center'
      }}>
        {isEditing ? 'Editar Publicación' : 'Nueva Publicación'}
      </h1>

      <div style={styles.editorContainer}>
        {/* Sidebar - Izquierda */}
        <div style={styles.sidebar}>
          <CoverImageUploader
            coverImage={post.coverImage}
            coverImagePreview={post.coverImagePreview}
            onImageChange={handleImageChange}
          />

          {renderPostMetadata()}

          <ImportExportActions
            onExport={exportToFile}
            onImport={importFile}
          />
        </div>

        {/* Main Editor - Derecha */}
        <div style={styles.mainEditor}>
          <div style={styles.formGroup}>
            <label style={{
              display: 'block',
              marginBottom: spacing.xs,
              fontWeight: typography.fontWeight.medium,
              color: isDarkMode ? colors.textLight : colors.primary
            }} htmlFor="title">
              Título del post
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
                color: colors.textPrimary,
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
            <label style={{
              display: 'block',
              marginBottom: spacing.xs,
              fontWeight: typography.fontWeight.medium,
              color: isDarkMode ? colors.textLight : colors.primary
            }} htmlFor="resumen">
              Resumen
            </label>
            <textarea
              id="resumen"
              name="resumen"
              value={post.resumen}
              onChange={handleChange}
              rows={3}
              style={{
                width: "100%",
                padding: spacing.md,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.gray200}`,
                fontSize: typography.fontSize.md,
                backgroundColor: colors.white,
                color: colors.textPrimary,
                resize: 'vertical',
                marginBottom: spacing.md
              }}
              placeholder="Breve descripción de tu publicación..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={{
              display: 'block',
              marginBottom: spacing.xs,
              fontWeight: typography.fontWeight.medium,
              color: isDarkMode ? colors.textLight : colors.primary
            }} htmlFor="tags">
              Etiquetas
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={post.tags}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: spacing.md,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.gray200}`,
                fontSize: typography.fontSize.md,
                backgroundColor: colors.white,
                color: colors.textPrimary,
                marginBottom: spacing.md
              }}
              placeholder="Separadas por comas: educación, tecnología..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={{
              display: 'block',
              marginBottom: spacing.xs,
              fontWeight: typography.fontWeight.medium,
              color: isDarkMode ? colors.textLight : colors.primary
            }}>
              Contenido
            </label>

            <DualModeEditor
              content={post.content}
              onChange={handleEditorChange}
              initialMode={post.editorMode}
              onExport={exportToFile}
              onImport={importFile}
            />
          </div>

          {saveMessage && (
            <StatusMessage
              message={saveMessage}
              type={saveMessage.type}
              onClose={() => setSaveMessage(null)}
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