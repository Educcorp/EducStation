// src/components/admin/PostEditor.jsx
import React, { useState, useEffect } from 'react';
import { colors, spacing, typography, shadows, borderRadius } from '../../styles/theme';

// Componentes para el editor
import DualModeEditor from './DualModeEditor';
import PostMetadata from './PostMetadata';
import CoverImageUploader from './CoverImageUploader';
import MarkdownGuide from './MarkdownGuide';
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

const PostEditor = () => {
  const [post, setPost] = useState({
    title: '',
    category: '',
    content: '', // Aseguramos que se inicie con una cadena vacía
    tags: '',
    coverImage: null,
    coverImagePreview: null,
    status: 'draft', // 'draft', 'published'
    publishDate: new Date().toISOString().slice(0, 10),
    editorMode: 'markdown', // Iniciamos explícitamente en modo markdown
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

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
    const timer = setTimeout(() => {
      if (post.content.length > 0 || post.title.length > 0) {
        console.log('Guardado automático...');
        savePostToLocalStorage(post);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [post]);
  
  // Cargar borrador guardado al iniciar
  useEffect(() => {
    const savedPost = loadPostFromLocalStorage();
    if (savedPost) {
      // Detectamos si el contenido parece ser HTML para establecer el modo
      const hasHTMLStructure = /<(!DOCTYPE|html|head|body|div|p|h[1-6]|ul|ol|script|style)[^>]*>/i.test(savedPost.content);
      
      setPost({
        ...savedPost,
        editorMode: hasHTMLStructure ? 'html' : (savedPost.editorMode || 'markdown')
      });
      
      console.log('Loaded post with mode:', hasHTMLStructure ? 'html' : (savedPost.editorMode || 'markdown'));
    }
  }, []);

  // Simular guardar como borrador
  const saveDraft = () => {
    setIsSaving(true);
    
    // Guardar en localStorage
    savePostToLocalStorage(post);
    
    // Simulación de guardado
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage({
        type: 'success',
        text: 'Borrador guardado correctamente',
        icon: '✓'
      });
      
      // Limpiar mensaje después de unos segundos
      setTimeout(() => setSaveMessage(null), 3000);
    }, 1000);
  };

  // Simular publicación del post
  const publishPost = () => {
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
    
    // Simulación de publicación
    setTimeout(() => {
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
    }, 1500);
  };

  // Exportar el post a Markdown/HTML para descargar
  const exportToFile = () => {
    // Crear un objeto de texto para descargar
    let content = '';
    let fileExtension = '';
    
    if (post.editorMode === 'markdown') {
      const frontMatter = `---
title: ${post.title}
category: ${post.category}
tags: ${post.tags}
date: ${post.publishDate}
status: ${post.status}
---

`;
      content = frontMatter + post.content;
      fileExtension = 'md';
    } else { // HTML mode
      content = post.content;
      fileExtension = 'html';
    }
    
    const blob = new Blob([content], { 
      type: post.editorMode === 'markdown' ? 'text/markdown' : 'text/html' 
    });
    const url = URL.createObjectURL(blob);
    
    // Crear un enlace de descarga y hacer clic en él
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Mostrar mensaje de éxito
    setSaveMessage({
      type: 'success',
      text: `Archivo ${post.editorMode === 'markdown' ? 'Markdown' : 'HTML'} descargado correctamente`,
      icon: '📥'
    });
    
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Importar un archivo Markdown o HTML
  const importFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      // Detectar si es Markdown o HTML
      const isMarkdown = fileExtension === 'md' || fileExtension === 'markdown';
      const isHTML = fileExtension === 'html' || fileExtension === 'htm';
      
      if (isMarkdown) {
        // Parsear el frontmatter si existe
        let postData = { content, editorMode: 'markdown' };
        
        const frontMatterRegex = /^---\n([\s\S]*?)\n---\n/;
        const match = content.match(frontMatterRegex);
        
        if (match) {
          const frontMatter = match[1];
          const actualContent = content.replace(frontMatterRegex, '');
          
          // Extraer metadatos del frontmatter
          const titleMatch = frontMatter.match(/title:\s*(.*)/);
          const categoryMatch = frontMatter.match(/category:\s*(.*)/);
          const tagsMatch = frontMatter.match(/tags:\s*(.*)/);
          const dateMatch = frontMatter.match(/date:\s*(.*)/);
          const statusMatch = frontMatter.match(/status:\s*(.*)/);
          
          postData = {
            title: titleMatch ? titleMatch[1] : '',
            category: categoryMatch ? categoryMatch[1] : '',
            tags: tagsMatch ? tagsMatch[1] : '',
            publishDate: dateMatch ? dateMatch[1] : new Date().toISOString().slice(0, 10),
            status: statusMatch ? statusMatch[1] : 'draft',
            content: actualContent.trim(),
            editorMode: 'markdown'
          };
        } else {
          // Si no hay frontmatter, usar todo como contenido
          postData.content = content;
        }
        
        // Actualizar el estado del post 
        setPost(prevPost => ({
          ...prevPost,
          ...postData
        }));
      } else if (isHTML) {
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
        // Si no es Markdown ni HTML, tratar como texto plano
        setPost(prevPost => ({
          ...prevPost,
          content: content
        }));
      }
      
      // Mostrar mensaje de éxito
      setSaveMessage({
        type: 'success',
        text: `Archivo ${isMarkdown ? 'Markdown' : (isHTML ? 'HTML' : 'de texto')} importado correctamente`,
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
      gridTemplateColumns: "1fr 300px",
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
    sidebar: {},
    formGroup: {
      marginBottom: spacing.lg
    }
  };

  // Log para depuración
  console.log('Current editor mode:', post.editorMode);

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
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
        `
      }} />


      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: spacing.xl,
        marginBottom: spacing.xxl,
        '@media (max-width: 768px)': {
          gridTemplateColumns: "1fr"
        }
      }}>
        <div style={styles.mainEditor}>
          <div style={styles.formGroup}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              marginBottom: spacing.xs,
              fontWeight: typography.fontWeight.medium,
              color: colors.primary
            }} htmlFor="title">
              <span style={{color: colors.primary, fontSize: '1.1em'}}>📝</span> Título del post
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
                borderLeft: `4px solid ${colors.primary}`
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
        </div>

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

          <MarkdownGuide />
          
          <ImportExportActions 
            onExport={exportToFile} 
            onImport={importFile}
            isHTML={post.editorMode === 'html'} 
          />
        </div>
      </div>
    </div>
  );
};

export default PostEditor;