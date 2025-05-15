// src/components/admin/PostEditor.jsx
import React, { useState, useEffect } from 'react';
import { spacing, typography, shadows, borderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

// Servicios
import publicacionesService from '../../services/publicacionesService';

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
  // Obtener información del usuario autenticado
  const { user, isAuthenticated, token } = useAuth();
  
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

  // Categorías disponibles
  const categories = [
    'Noticias',
    'Técnicas de Estudio',
    'Problemáticas',
    'Educación de Calidad',
    'Herramientas',
    'Desarrollo Docente',
    'Comunidad'
  ];

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

  // Guardar como borrador en la base de datos
  const saveDraft = async () => {
    try {
      setIsSaving(true);
      
      // Validación básica
      if (!post.title.trim()) {
        setSaveMessage({
          type: 'error',
          text: 'El título es obligatorio para guardar un borrador',
          icon: '✖'
        });
        
        setTimeout(() => setSaveMessage(null), 3000);
        setIsSaving(false);
        return;
      }
      
      // Crear objeto para enviar a la API
      const postData = {
        titulo: post.title,
        contenido: post.content,
        categoria_id: getCategoriaIdByName(post.category),
        estado: 'borrador',
        tags: post.tags,
        coverImage: post.coverImage,
      };
      
      if (isAuthenticated && token) {
        // Si ya tiene un ID, actualizar, si no, crear nuevo
        let response;
        if (post.id) {
          response = await publicacionesService.updatePublicacion(post.id, postData, token);
        } else {
          response = await publicacionesService.createPublicacion(postData, token);
          // Actualizar el ID del post en el estado local
          setPost(prev => ({ ...prev, id: response.id }));
        }
        
        // Guardar también en localStorage como respaldo
        savePostToLocalStorage(post);
        
        setSaveMessage({
          type: 'success',
          text: 'Borrador guardado correctamente en la base de datos',
          icon: '✓'
        });
      } else {
        // Si no está autenticado, solo guarda en localStorage
        savePostToLocalStorage(post);
        
        setSaveMessage({
          type: 'success',
          text: 'Borrador guardado localmente (inicia sesión para guardar en la nube)',
          icon: '✓'
        });
      }
    } catch (error) {
      console.error('Error al guardar borrador:', error);
      setSaveMessage({
        type: 'error',
        text: `Error al guardar: ${error.message}`,
        icon: '✖'
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Publicar el post en la base de datos
  const publishPost = async () => {
    try {
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
      
      // Solo se puede publicar si el usuario está autenticado
      if (!isAuthenticated || !token) {
        setSaveMessage({
          type: 'error',
          text: 'Debes iniciar sesión para publicar',
          icon: '✖'
        });
        setIsPublishing(false);
        setTimeout(() => setSaveMessage(null), 3000);
        return;
      }
      
      // Crear objeto para enviar a la API
      const postData = {
        titulo: post.title,
        contenido: post.content,
        categoria_id: getCategoriaIdByName(post.category),
        estado: 'publicado',
        tags: post.tags,
        coverImage: post.coverImage,
        fecha_publicacion: post.publishDate || new Date().toISOString().slice(0, 10),
      };
      
      // Si ya tiene un ID, actualizar, si no, crear nuevo
      let response;
      if (post.id) {
        response = await publicacionesService.updatePublicacion(post.id, postData, token);
      } else {
        response = await publicacionesService.createPublicacion(postData, token);
      }
      
      setPost(prev => ({ 
        ...prev, 
        id: response.id, 
        status: 'published' 
      }));
      
      setSaveMessage({
        type: 'success',
        text: '¡Post publicado correctamente!',
        icon: '🎉'
      });
      
      // Limpiar el borrador en localStorage después de publicar
      localStorage.removeItem('post_draft');
    } catch (error) {
      console.error('Error al publicar:', error);
      setSaveMessage({
        type: 'error',
        text: `Error al publicar: ${error.message}`,
        icon: '✖'
      });
    } finally {
      setIsPublishing(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };
  
  // Obtener el ID de la categoría por su nombre
  const getCategoriaIdByName = (categoryName) => {
    // Mapeo de nombres de categorías a IDs (debería obtenerse de la API)
    const categoryMap = {
      'Noticias': 1,
      'Técnicas de Estudio': 2,
      'Problemáticas': 3,
      'Educación de Calidad': 4,
      'Herramientas': 5,
      'Desarrollo Docente': 6,
      'Comunidad': 7
    };
    
    return categoryMap[categoryName] || null;
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
        `
      }} />

      <div style={styles.editorContainer}>
        {/* Sidebar - Ahora a la izquierda */}
        <div style={styles.sidebar}>
          <CoverImageUploader 
            coverImagePreview={post.coverImagePreview} 
            onChange={handleImageChange} 
          />

          <PostMetadata 
            post={post} 
            categories={categories} 
            onChange={handleChange} 
          />
          
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