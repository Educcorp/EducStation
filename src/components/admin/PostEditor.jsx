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

// Función para detectar si el contenido es HTML completo
const isFullHTML = (content) => {
  if (!content) return false;
  // Verifica si el contenido comienza con DOCTYPE html
  const trimmedContent = content.trim().toLowerCase();
  return trimmedContent.startsWith('<!doctype html>') || 
         trimmedContent.startsWith('<!DOCTYPE html>') || 
         trimmedContent.startsWith('<html');
};

// Componente para la etiqueta de Contenido animada
const ContentLabel = ({ isVisible = false }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsAnimated(true), 80);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: spacing.md,
      opacity: isAnimated ? 1 : 0,
      transform: isAnimated ? 'translateX(0)' : 'translateX(-18px)',
      transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)'
    },
    icon: {
      fontSize: '22px',
      marginRight: spacing.sm,
      color: colors.secondary,
      opacity: isAnimated ? 1 : 0,
      transform: isAnimated ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-35deg)',
      transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transitionDelay: '0.15s',
      animation: isAnimated ? 'float 3.5s ease-in-out infinite 0.8s' : 'none'
    },
    label: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      color: isDarkMode ? colors.textLight : colors.primary,
      position: 'relative',
      paddingBottom: '3px',
      opacity: isAnimated ? 1 : 0,
      transform: isAnimated ? 'translateY(0)' : 'translateY(-6px)',
      transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
      transitionDelay: '0.2s'
    },
    underline: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: isAnimated ? '100%' : '0%',
      height: '2px',
      backgroundColor: colors.secondary,
      transition: 'width 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
      transitionDelay: '0.35s'
    },
    badge: {
      display: 'inline-block',
      backgroundColor: isAnimated ? colors.primary : 'transparent',
      color: 'white',
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.round,
      fontSize: typography.fontSize.xs,
      marginLeft: spacing.md,
      opacity: isAnimated ? 1 : 0,
      transform: isAnimated ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(10px)',
      transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transitionDelay: '0.5s',
      boxShadow: isAnimated ? '0 4px 15px rgba(11, 68, 68, 0.25)' : 'none'
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
  const { colors, isDarkMode } = useTheme();
  const { postId } = useParams();
  const navigate = useNavigate();

  // Estados para animaciones moderadas
  const [mounted, setMounted] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  const [post, setPost] = useState({
    title: '',
    category: '',
    content: '',
    tags: '',
    coverImage: null,
    coverImagePreview: null,
    status: 'draft',
    publishDate: new Date().toISOString().slice(0, 10),
    editorMode: 'simple',
    resumen: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
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

  // Efectos para animaciones moderadas y balanceadas
  useEffect(() => {
    setMounted(true);
    
    // Timing balanceado - ni muy rápido ni muy lento
    const timers = [
      setTimeout(() => setPageVisible(true), 100),
      setTimeout(() => setSidebarVisible(true), 250),
      setTimeout(() => setTitleVisible(true), 400),
      setTimeout(() => setContentVisible(true), 550),
      setTimeout(() => setEditorVisible(true), 700),
      setTimeout(() => setSummaryVisible(true), 850),
      setTimeout(() => setButtonsVisible(true), 1000)
    ];

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Resto del código se mantiene igual...
  
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Cargar post existente si hay un postId
  useEffect(() => {
    const loadExistingPost = async () => {
      if (!postId) {
        console.log('Creando nueva publicación');
        setIsInitialized(true);
        return;
      }
      
      try {
        console.log(`Cargando publicación existente con ID: ${postId}`);
        const postData = await getPublicacionById(postId);
        
        if (!postData) {
          console.error('No se encontró la publicación');
          return;
        }
        
        console.log('Datos de la publicación cargados:', postData);
        
        const categoriaObj = categories.find(cat => 
          cat.ID_categoria === (postData.categorias && postData.categorias[0]?.ID_categoria)
        );
        
        const categoria = categoriaObj ? categoriaObj.Nombre_categoria : '';
        
        // Determinar si el contenido es HTML completo o tiene marcado HTML
        const contentHasHTML = postData.contenido && (
          postData.contenido.includes('<') || 
          postData.contenido.includes('&lt;')
        );
        
        // Verificar si es HTML completo (con DOCTYPE o tag html)
        const isHTMLDocument = isFullHTML(postData.contenido);
        
        console.log('¿El contenido tiene HTML?', contentHasHTML);
        console.log('¿Es un documento HTML completo?', isHTMLDocument);
        
        // Determinar el modo de editor basado en el contenido
        const editorMode = isHTMLDocument ? 'html' : (contentHasHTML ? 'html' : 'simple');
        console.log('Modo de editor seleccionado:', editorMode);
        
        setPost({
          title: postData.titulo || '',
          content: postData.contenido || '',
          category: categoria,
          tags: postData.tags || '',
          coverImagePreview: postData.imagen_url || null,
          status: postData.estado || 'draft',
          publishDate: postData.fecha_publicacion ? new Date(postData.fecha_publicacion).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          editorMode: editorMode,
          resumen: postData.resumen || ''
        });
        
        // Asegurarse de que el contenido se cargue correctamente en el editor
        console.log('Contenido cargado en el editor:', postData.contenido ? postData.contenido.substring(0, 50) + '...' : 'vacío');
        
        setIsEditing(true);
        setIsInitialized(true);
        
      } catch (error) {
        console.error('Error al cargar la publicación:', error);
        setIsInitialized(true);
      }
    };
    
    if (categories.length > 0 && postId) {
      loadExistingPost();
    }
  }, [postId, categories]);

  // Manejador para cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador para cambios en la imagen de portada
  const handleImageChange = (e, base64Image) => {
    const file = e.target.files && e.target.files[0];
    
    if (file && base64Image) {
      console.log("Imagen Base64 recibida:", base64Image ? base64Image.substring(0, 50) + "..." : "No hay imagen Base64");
      setPost(prev => ({
        ...prev,
        coverImage: file,
        coverImagePreview: base64Image,
        Imagen_portada: base64Image
      }));
    } 
    else if (!file && base64Image === null) {
      console.log("Eliminando imagen seleccionada");
      setPost(prev => ({
        ...prev,
        coverImage: null,
        coverImagePreview: null,
        Imagen_portada: null
      }));
    }
  };

  // Actualizar el estado cuando cambia el post
  useEffect(() => {
    if (isInitialized && post) {
      console.log("Post actualizado:", post.title);
    }
  }, [post]);

  // Resto de las funciones (saveDraft, publishPost, exportToFile, importFile) - mantener las mismas
  const saveDraft = async () => {
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
      let categorias = [];
      if (post.category) {
        const categoriaSeleccionada = categories.find(cat => 
          typeof cat === 'object' ? cat.Nombre_categoria === post.category : cat === post.category
        );
        
        if (typeof categoriaSeleccionada === 'object' && categoriaSeleccionada.ID_categoria) {
          categorias = [categoriaSeleccionada.ID_categoria];
        } else if (post.category) {
          console.warn("No se pudo encontrar el ID de la categoría, usando valor predeterminado");
          categorias = [1];
        }
      }
      
      const postData = {
        titulo: post.title,
        contenido: post.content,
        resumen: post.resumen || post.title.substring(0, 150),
        estado: 'borrador',
        categorias: categorias,
        Imagen_portada: post.Imagen_portada || null
      };
      
      console.log("Guardando borrador con datos:", postData);
      
      let result;
      
      if (isEditing) {
        console.log(`Actualizando borrador existente con ID: ${postId}`);
        result = await updatePublicacion(postId, postData);
      } else {
        const hasHTMLImages = post.content.includes('<img') && post.content.includes('src="data:image');
        const shouldUseHTMLEndpoint = post.editorMode === 'html' || hasHTMLImages;
        
        if (shouldUseHTMLEndpoint) {
          console.log("Guardando borrador usando endpoint HTML - Modo:", post.editorMode, "- Tiene imágenes:", hasHTMLImages);
          result = await createPublicacionFromHTML({
            titulo: postData.titulo,
            htmlContent: post.content,
            resumen: postData.resumen,
            estado: postData.estado,
            categorias: postData.categorias,
            Imagen_portada: postData.Imagen_portada
          });
        } else {
          console.log("Guardando borrador usando endpoint estándar");
          result = await createPublicacion(postData);
        }
      }
      
      setIsSaving(false);
      setSaveMessage({
        type: 'success',
        text: 'Borrador guardado correctamente',
        icon: '✓'
      });
      
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

  const publishPost = async () => {
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
      const categoriaSeleccionada = categories.find(cat => 
        typeof cat === 'object' ? cat.Nombre_categoria === post.category : cat === post.category
      );
      
      let categoriaId;
      if (typeof categoriaSeleccionada === 'object' && categoriaSeleccionada.ID_categoria) {
        categoriaId = categoriaSeleccionada.ID_categoria;
      } else {
        console.warn("No se pudo encontrar el ID de la categoría, usando valor predeterminado");
        categoriaId = 1;
      }
      
      const postData = {
        titulo: post.title,
        contenido: post.content,
        resumen: post.resumen || post.title.substring(0, 150),
        estado: 'publicado',
        categorias: [categoriaId],
        Imagen_portada: post.Imagen_portada || null
      };
      
      console.log("Enviando publicación con datos:", postData);
      
      if (post.Imagen_portada) {
        console.log("Imagen incluida en la publicación (primeros 50 caracteres):", post.Imagen_portada.substring(0, 50) + "...");
        console.log("Longitud de la imagen Base64:", post.Imagen_portada.length);
      } else {
        console.log("No se incluyó imagen en la publicación");
      }
      
      let result;
      
      if (isEditing) {
        console.log(`Actualizando post existente con ID: ${postId}`);
        result = await updatePublicacion(postId, postData);
        setSaveMessage({
          type: 'success',
          text: '¡Post actualizado correctamente!',
          icon: '🎉'
        });
      } else {
        const hasHTMLImages = post.content.includes('<img') && post.content.includes('src="data:image');
        const shouldUseHTMLEndpoint = post.editorMode === 'html' || hasHTMLImages;
        
        if (shouldUseHTMLEndpoint) {
          console.log("Usando endpoint HTML - Modo:", post.editorMode, "- Tiene imágenes:", hasHTMLImages);
          console.log("Contenido HTML longitud:", post.content.length);
          console.log("Muestra del contenido HTML:", post.content.substring(0, 150) + "...");
          
          if (!post.content.trim()) {
            throw new Error("El contenido HTML está vacío o solo contiene espacios");
          }
          
          result = await createPublicacionFromHTML({
            titulo: postData.titulo,
            htmlContent: post.content,
            resumen: post.resumen || postData.resumen,
            estado: postData.estado,
            categorias: postData.categorias,
            Imagen_portada: postData.Imagen_portada
          });
        } else {
          console.log("Usando endpoint estándar para contenido simple");
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
      
      setTimeout(() => setSaveMessage(null), 3000);
      
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

  const exportToFile = () => {
    try {
      // Exportar como HTML si estamos en modo HTML
      if (post.editorMode === 'html') {
        const htmlContent = post.content;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
        document.body.appendChild(link);
        link.click();
        
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } 
      // Exportar como JSON en cualquier caso
      else {
        const postData = {
          title: post.title,
          content: post.content,
          category: post.category,
          tags: post.tags,
          status: post.status,
          publishDate: post.publishDate,
          editorMode: post.editorMode,
          resumen: post.resumen,
          coverImagePreview: post.coverImagePreview
        };
        
        const jsonData = JSON.stringify(postData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.json`;
        document.body.appendChild(link);
        link.click();
        
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
      
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

  const importFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const fileContent = event.target.result;
        
        // Intentar primero como JSON
        if (file.name.endsWith('.json')) {
          const importedData = JSON.parse(fileContent);
          
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
          
          setSaveMessage({
            type: 'success',
            text: 'Post importado correctamente desde JSON',
            icon: '📥'
          });
        } 
        // Si es HTML, importar como contenido
        else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
          setPost(prev => ({
            ...prev,
            content: fileContent,
            editorMode: 'html'
          }));
          
          setSaveMessage({
            type: 'success',
            text: 'HTML importado correctamente',
            icon: '📥'
          });
        }
        // Otro tipo de archivo
        else {
          throw new Error('Formato de archivo no soportado');
        }
        
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

  // Estilos con animaciones moderadas
  const styles = {
    container: {
      minHeight: '100vh',
      maxWidth: "1200px",
      margin: "0 auto",
      padding: `100px ${spacing.md} 100px`,
      fontFamily: typography.fontFamily,
      opacity: mounted && pageVisible ? 1 : 0,
      transform: mounted && pageVisible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
      position: 'relative',
      zIndex: 1
    },
    editorContainer: {
      display: "grid",
      gridTemplateColumns: "300px 1fr",
      gap: spacing.xl,
      marginBottom: spacing.xxl,
      minHeight: '600px',
    },
    mainEditor: {
      width: "100%",
      maxWidth: "800px",
      opacity: editorVisible ? 1 : 0,
      transform: editorVisible ? 'translateX(0)' : 'translateX(20px)',
      transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
    },
    sidebar: {
      opacity: sidebarVisible ? 1 : 0,
      transform: sidebarVisible ? 'translateX(0)' : 'translateX(-20px)',
      transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)'
    },
    formGroup: {
      marginBottom: spacing.lg
    },
    titleContainer: {
      opacity: titleVisible ? 1 : 0,
      transform: titleVisible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
    },
    summaryContainer: {
      marginBottom: spacing.xl,
      marginTop: spacing.xl,
      border: `1px solid ${colors.gray200}`,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      backgroundColor: colors.white,
      boxShadow: shadows.sm,
      opacity: summaryVisible ? 1 : 0,
      transform: summaryVisible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.98)',
      transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
    },
    actionsContainer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: spacing.md,
      marginTop: spacing.xl,
      opacity: buttonsVisible ? 1 : 0,
      transform: buttonsVisible ? 'translateY(0)' : 'translateY(15px)',
      transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
    },
    actionButton: {
      padding: `${spacing.sm} ${spacing.lg}`,
      borderRadius: borderRadius.md,
      fontWeight: typography.fontWeight.medium,
      cursor: "pointer",
      transition: "all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)", // Hover moderado
      fontSize: typography.fontSize.md,
      border: "none",
      transform: 'scale(1)',
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
            <span style={{ color: colors.secondary, fontSize: '1.1em', marginRight: spacing.xs }}></span>
            Categoría
          </label>

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
                transition: "all 0.25s ease", // Moderado
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
                transition: 'transform 0.2s ease'
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
                width: "100%",
                animation: 'fadeIn 0.25s ease-out'
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
                    color: colors.primary,
                    backgroundColor: 'transparent',
                    borderLeft: 'none'
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
                          ? colors.secondary + '15'
                          : isSelected
                            ? colors.secondary + '08'
                            : 'transparent',
                        color: colors.primary,
                        fontWeight: isSelected ? typography.fontWeight.bold : typography.fontWeight.normal,
                        borderLeft: 'none'
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
                          borderLeft: `4px solid ${colors.primary}`,
                          boxShadow: `0 3px 6px rgba(0,0,0,0.1)`,
                          zIndex: 100,
                          width: "100%",
                          opacity: 0.98,
                          animation: "fadeIn 0.2s ease-out",
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
              transition: "all 0.25s ease",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: isDarkMode ? colors.textLight : colors.textPrimary,
              pointerEvents: "none",
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

  if (loadingCategories) {
    return (
      <div style={{
        ...styles.container,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div style={{
          animation: 'pulse 2s infinite',
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: `3px solid ${colors.primary}`,
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Cargando categorías...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Estilos CSS moderados */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes scaleIn {
            from { transform: scale(0.96); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
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
        `
      }} />

      <div style={styles.editorContainer}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={{
            opacity: sidebarVisible ? 1 : 0,
            transform: sidebarVisible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
            transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
            transitionDelay: '0.05s'
          }}>
            <CoverImageUploader
              coverImagePreview={post.coverImagePreview}
              onChange={handleImageChange}
              isAnimated={sidebarVisible}
            />
          </div>

          <div style={{
            opacity: sidebarVisible ? 1 : 0,
            transform: sidebarVisible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
            transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
            transitionDelay: '0.1s'
          }}>
            {renderPostMetadata()}
          </div>

          <div style={{
            opacity: sidebarVisible ? 1 : 0,
            transform: sidebarVisible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
            transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
            transitionDelay: '0.15s'
          }}>
            <ImportExportActions
              onExport={exportToFile}
              onImport={importFile}
              isAnimated={sidebarVisible}
            />
          </div>
        </div>

        {/* Main Editor */}
        <div style={styles.mainEditor}>
          <div style={{
            ...styles.formGroup,
            ...styles.titleContainer
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              marginBottom: spacing.xs,
              fontWeight: typography.fontWeight.medium,
              color: isDarkMode ? colors.textLight : colors.primary,
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateX(0)' : 'translateX(-12px)',
              transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
              transitionDelay: '0.1s'
            }} htmlFor="title">
              <span style={{ 
                color: isDarkMode ? colors.textLight : colors.primary, 
                fontSize: '1.4em',
                opacity: titleVisible ? 1 : 0,
                transform: titleVisible ? 'scale(1) rotate(0deg)' : 'scale(0.85) rotate(-25deg)',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transitionDelay: '0.2s',
                animation: titleVisible ? 'float 3.5s ease-in-out infinite 0.8s' : 'none'
              }}>📝</span> 
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
                transition: "all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)",
                marginBottom: spacing.md,
                fontWeight: typography.fontWeight.semiBold,
                borderLeft: `4px solid ${colors.primary}`,
                backgroundColor: colors.white,
                color: isDarkMode ? colors.textPrimary : "#000000",
                opacity: titleVisible ? 1 : 0,
                transform: titleVisible ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.99)',
                transitionDelay: '0.3s'
              }}
              placeholder="Escribe un título atractivo"
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                e.target.style.borderLeft = `4px solid ${colors.secondary}`;
                e.target.style.transform = 'scale(1.003) translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.borderLeft = `4px solid ${colors.primary}`;
                e.target.style.transform = 'scale(1) translateY(0)';
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <ContentLabel isVisible={contentVisible} />

            <div style={{
              opacity: editorVisible ? 1 : 0,
              transform: editorVisible ? 'scale(1)' : 'scale(0.99)',
              transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
              transitionDelay: '0.05s'
            }}>
              <DualModeEditor
                content={post.content}
                onChange={handleChange}
                initialMode={post.editorMode}
                onExport={exportToFile}
                onImport={importFile}
              />
            </div>
          </div>

          <div style={styles.summaryContainer}>
            <label 
              htmlFor="resumen" 
              style={{
                display: 'block',
                marginBottom: spacing.sm,
                fontSize: typography.fontSize.md,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                opacity: summaryVisible ? 1 : 0,
                transform: summaryVisible ? 'translateX(0)' : 'translateX(-8px)',
                transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                transitionDelay: '0.1s'
              }}
            >
              Resumen de la publicación
            </label>
            <textarea
              id="resumen"
              name="resumen"
              value={post.resumen}
              onChange={handleChange}
              placeholder="Ingresa un resumen para tu publicación (máximo 500 caracteres)"
              style={{
                width: '100%',
                padding: spacing.md,
                border: `1px solid ${colors.gray200}`,
                borderRadius: borderRadius.md,
                minHeight: '120px',
                fontSize: typography.fontSize.md,
                color: colors.textPrimary,
                resize: 'vertical',
                transition: 'all 0.25s ease',
                opacity: summaryVisible ? 1 : 0,
                transform: summaryVisible ? 'scale(1)' : 'scale(0.99)',
                transitionDelay: '0.15s'
              }}
              maxLength={500}
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 0 3px ${colors.primary}15`;
                e.target.style.transform = 'scale(1.001)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'scale(1)';
              }}
            />
            <div style={{
              textAlign: 'right',
              marginTop: spacing.xs,
              fontSize: typography.fontSize.sm,
              color: colors.textSecondary,
              opacity: summaryVisible ? 1 : 0,
              transition: 'opacity 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
              transitionDelay: '0.2s'
            }}>
              {post.resumen.length}/500 caracteres
            </div>
          </div>

          {saveMessage && (
            <div style={{
              animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
              <StatusMessage
                type={saveMessage.type}
                text={saveMessage.text}
                icon={saveMessage.icon}
              />
            </div>
          )}

          <div style={styles.actionsContainer}>
            <button
              onClick={publishPost}
              disabled={isPublishing}
              style={{
                ...styles.actionButton,
                ...styles.publishButton,
                opacity: buttonsVisible ? 1 : 0,
                transform: buttonsVisible ? 'scale(1) translateX(0)' : 'scale(0.96) translateX(8px)',
                transitionDelay: '0.1s'
              }}
              onMouseEnter={(e) => {
                if (!isPublishing) {
                  e.target.style.transform = 'scale(1.025) translateY(-2px)';
                  e.target.style.boxShadow = `0 6px 20px ${colors.primary}30`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isPublishing) {
                  e.target.style.transform = 'scale(1) translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
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