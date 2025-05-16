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
      color: colors?.secondary || '#d2b99a',
      animation: isAnimated ? 'pulseIcon 2s infinite' : 'none'
    },
    label: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      color: isDarkMode ? (colors?.textLight || '#e0e0e0') : (colors?.primary || '#0b4444'), // Ajustar color según el tema
      position: 'relative',
      paddingBottom: '3px'
    },
    underline: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: isAnimated ? '100%' : '0%',
      height: '2px',
      backgroundColor: colors?.secondary || '#d2b99a',
      transition: 'width 0.8s ease-in-out',
      transitionDelay: '0.3s'
    },
    badge: {
      display: 'inline-block',
      backgroundColor: isAnimated ? (colors?.primary || '#0b4444') : 'transparent',
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
  // Estado para el tema
  const { colors, isDarkMode } = useTheme(); // Extraer colors y isDarkMode
  
  // Estado del post
  const [post, setPost] = useState({
    title: '',
    content: '',
    category: '',
    coverImage: null,
    status: 'draft',
    editorMode: 'simple', // Es importante inicializar este valor
    previewUrl: null,
    lastSaved: null
  });
  
  // Otros estados
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Cargar categorías
  useEffect(() => {
    loadCategories();
    
    // Cargar borrador del almacenamiento local
    const savedPost = loadPostFromLocalStorage();
    if (savedPost) {
      setPost(prev => ({
        ...prev,
        ...savedPost,
        lastSaved: savedPost.lastSaved || null,
        // Asegurarnos que editorMode existe y tiene un valor válido
        editorMode: savedPost.editorMode || 'simple'
      }));
    }
    
    // Auto-guardado cada 30 segundos
    const interval = setInterval(() => {
      saveDraft();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Función para cargar categorías
  const loadCategories = async () => {
    try {
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
    }
  };

  // Manejador para cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    console.log(`Campo ${name} cambió a: ${value}`);
    
    if (name === 'editorMode') {
      console.log(`Modo de editor cambiado a: ${value}`);
    }
    
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
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  // Autoguardado cuando el contenido cambia
  useEffect(() => {
    if (!post.content.length > 0 || !post.title.length > 0) {
      // console.log('Guardado automático'); // Eliminar o comentar esta línea
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
      marginBottom: spacing.xxl,
      '@media (max-width: 768px)': {
        gridTemplateColumns: "1fr"
      }
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
      backgroundColor: colors?.secondary || '#d2b99a',
      color: colors?.primary || '#0b4444',
      "&:hover": {
        backgroundColor: (colors?.secondary || '#d2b99a') + "cc", // Añadir transparencia al hover
      }
    },
    publishButton: {
      backgroundColor: colors?.primary || '#0b4444',
      color: colors?.white || '#ffffff',
      "&:hover": {
        backgroundColor: colors?.primaryLight || '#166363',
      }
    }
  };

  // Modificar el componente PostMetadata para usar las categorías cargadas
  const renderPostMetadata = () => {
    return (
      <div style={{
        marginTop: spacing.lg,
        backgroundColor: isDarkMode ? (colors?.backgroundDarkSecondary || '#1a3838') : (colors?.white || '#ffffff'),
        padding: spacing.md,
        borderRadius: borderRadius.md,
        boxShadow: shadows.sm
      }}>
        <h3 style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semiBold,
          marginBottom: spacing.md,
          color: isDarkMode ? (colors?.textLight || '#e0e0e0') : (colors?.primary || '#0b4444')
        }}>Detalles de la publicación</h3>
        
        <div style={{ marginBottom: spacing.md }}>
          <label style={{
            display: 'block',
            marginBottom: spacing.xs,
            fontWeight: typography.fontWeight.medium,
            color: isDarkMode ? (colors?.textLight || '#e0e0e0') : (colors?.textPrimary || '#333333')
          }} htmlFor="category">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            value={post.category}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: spacing.sm,
              borderRadius: borderRadius.sm,
              border: `1px solid ${colors?.gray200 || '#e9e9e9'}`,
              backgroundColor: isDarkMode ? (colors?.backgroundDark || '#0f2e2e') : (colors?.white || '#ffffff'),
              color: isDarkMode ? (colors?.textLight || '#e0e0e0') : (colors?.textPrimary || '#333333')
            }}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((cat) => (
              <option 
                key={cat.ID_categoria} 
                value={cat.Nombre_categoria}
              >
                {cat.Nombre_categoria}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: spacing.md }}>
          <label style={{
            display: 'block',
            marginBottom: spacing.xs,
            fontWeight: typography.fontWeight.medium,
            color: isDarkMode ? (colors?.textLight || '#e0e0e0') : (colors?.textPrimary || '#333333')
          }} htmlFor="tags">
            Etiquetas (separadas por comas)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={post.tags}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: spacing.sm,
              borderRadius: borderRadius.sm,
              border: `1px solid ${colors?.gray200 || '#e9e9e9'}`,
              backgroundColor: isDarkMode ? (colors?.backgroundDark || '#0f2e2e') : (colors?.white || '#ffffff'),
              color: isDarkMode ? (colors?.textLight || '#e0e0e0') : (colors?.textPrimary || '#333333')
            }}
            placeholder="ej. educación, tecnología, aprendizaje"
          />
        </div>
        
        <div style={{ marginBottom: spacing.md }}>
          <label style={{
            display: 'block',
            marginBottom: spacing.xs,
            fontWeight: typography.fontWeight.medium,
            color: isDarkMode ? (colors?.textLight || '#e0e0e0') : (colors?.textPrimary || '#333333')
          }} htmlFor="publishDate">
            Fecha de publicación
          </label>
          <input
            type="date"
            id="publishDate"
            name="publishDate"
            value={post.publishDate}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: spacing.sm,
              borderRadius: borderRadius.sm,
              border: `1px solid ${colors?.gray200 || '#e9e9e9'}`,
              backgroundColor: isDarkMode ? (colors?.backgroundDark || '#0f2e2e') : (colors?.white || '#ffffff'),
              color: isDarkMode ? (colors?.textLight || '#e0e0e0') : (colors?.textPrimary || '#333333')
            }}
          />
        </div>
        
        <div style={{ marginBottom: spacing.md }}>
          <label style={{
            display: 'block',
            marginBottom: spacing.xs,
            fontWeight: typography.fontWeight.medium,
            color: isDarkMode ? (colors?.textLight || '#e0e0e0') : (colors?.textPrimary || '#333333')
          }}>
            Estado actual
          </label>
          <div style={{
            display: 'inline-block',
            padding: `${spacing.xs} ${spacing.sm}`,
            backgroundColor: post.status === 'draft' ? (colors?.warning || '#f6c23e') : (colors?.success || '#1cc88a'),
            color: colors?.white || '#ffffff',
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
  if (!categories.length) {
    return <div style={styles.container}>Cargando categorías...</div>;
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
        `
      }} />

      <div style={styles.editorContainer}>
        {/* Sidebar - Ahora a la izquierda */}
        <div style={styles.sidebar}>
          <CoverImageUploader 
            coverImagePreview={post.previewUrl} 
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
              <span style={{color: isDarkMode ? colors.textLight : colors.primary, fontSize: '1.4em'}}>📝</span> Título del post
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={post.title}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: spacing.md,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors?.gray200 || '#e9e9e9'}`,
                fontSize: typography.fontSize.lg,
                transition: "all 0.3s ease",
                marginBottom: spacing.md,
                fontWeight: typography.fontWeight.semiBold,
                borderLeft: `4px solid ${colors?.primary || '#0b4444'}`,
                backgroundColor: colors?.white || '#ffffff',
                color: isDarkMode ? (colors?.textPrimary || '#333333') : "#000000",
              }}
              placeholder="Escribe un título atractivo"
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 0 2px ${colors?.primary || '#0b4444'}30`;
                e.target.style.borderLeft = `4px solid ${colors?.secondary || '#d2b99a'}`;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.borderLeft = `4px solid ${colors?.primary || '#0b4444'}`;
              }}
            />
          </div>

          <div style={styles.formGroup}>
            {/* Etiqueta "Contenido" animada */}
            <ContentLabel />
            
            <DualModeEditor 
              content={post.content}
              onChange={handleInputChange}
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