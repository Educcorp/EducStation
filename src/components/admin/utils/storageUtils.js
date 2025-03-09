// src/components/admin/utils/storageUtils.js

/**
 * Guarda el estado del post en el almacenamiento local
 * @param {Object} post - El objeto post a guardar
 */
export const savePostToLocalStorage = (post) => {
    try {
      const postToSave = { ...post };
      // No guardamos la imagen como tal, sino solo la URL de vista previa
      delete postToSave.coverImage;
      localStorage.setItem('post_draft', JSON.stringify(postToSave));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  };
  
  /**
   * Carga el estado del post desde el almacenamiento local
   * @returns {Object|null} - El objeto post guardado o null si no existe
   */
  export const loadPostFromLocalStorage = () => {
    try {
      const savedPost = localStorage.getItem('post_draft');
      return savedPost ? JSON.parse(savedPost) : null;
    } catch (error) {
      console.error('Error al cargar desde localStorage:', error);
      return null;
    }
  };