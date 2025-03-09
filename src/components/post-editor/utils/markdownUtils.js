/**
 * Inserta sintaxis de markdown en el texto de acuerdo al tipo especificado
 * 
 * @param {string} content - El contenido actual del editor
 * @param {string} markdownSyntax - El tipo de sintaxis a insertar ('bold', 'italic', etc.)
 * @param {string} placeholder - Texto de placeholder cuando no hay selección
 * @param {HTMLTextAreaElement} textAreaRef - Referencia al elemento textarea
 * @returns {string} - El contenido actualizado con la sintaxis de markdown insertada
 */
export const insertMarkdown = (content, markdownSyntax, placeholder = '', textAreaRef) => {
    if (!textAreaRef) return content;
    
    const start = textAreaRef.selectionStart;
    const end = textAreaRef.selectionEnd;
    
    // Texto seleccionado o placeholder
    const selectedText = start !== end 
      ? content.substring(start, end) 
      : placeholder;
    
    // Formateamos el contenido seleccionado con la sintaxis de markdown
    let formattedText;
    switch(markdownSyntax) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'heading':
        formattedText = `# ${selectedText}`;
        break;
      case 'subheading':
        formattedText = `## ${selectedText}`;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      case 'image':
        formattedText = `![${selectedText || 'Alt texto'}](url)`;
        break;
      case 'code':
        formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        break;
      case 'ordered-list':
        formattedText = `\n1. ${selectedText}`;
        break;
      case 'quote':
        formattedText = `\n> ${selectedText}`;
        break;
      case 'table':
        formattedText = `\n| Encabezado 1 | Encabezado 2 | Encabezado 3 |\n| --- | --- | --- |\n| Celda 1 | Celda 2 | Celda 3 |\n| Celda 4 | Celda 5 | Celda 6 |`;
        break;
      case 'html':
        formattedText = `<div>\n  ${selectedText || 'Contenido HTML aquí'}\n</div>`;
        break;
      case 'divider':
        formattedText = `\n\n---\n\n`;
        break;
      case 'gif':
        formattedText = `![${selectedText || 'GIF'}](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmp5cmcwazQzOXoyNTE2NHhoYXVmcWVqdnFuMTQ2dWt1dHN5OTFqaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vFKqnCdLPNOKc/giphy.gif)`;
        break;
      case 'externalImage':
        formattedText = `![${selectedText || 'Imagen externa'}](https://example.com/imagen.jpg)`;
        break;
      default:
        formattedText = selectedText;
    }
    
    // Actualizamos el contenido
    const newContent = 
      content.substring(0, start) + 
      formattedText + 
      content.substring(end);
    
    // Enfocamos de nuevo el editor y movemos el cursor después del texto insertado
    setTimeout(() => {
      textAreaRef.focus();
      textAreaRef.setSelectionRange(
        start + formattedText.length,
        start + formattedText.length
      );
    }, 0);
    
    return newContent;
  };
  
  /**
   * Parsea un string de Markdown para extraer metadatos del frontmatter
   * 
   * @param {string} markdownContent - Contenido en formato Markdown
   * @returns {Object} - Objeto con metadatos del frontmatter y el contenido
   */
  export const parseMarkdownFrontmatter = (markdownContent) => {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n/;
    const match = markdownContent.match(frontMatterRegex);
    
    let postData = { content: markdownContent };
    
    if (match) {
      const frontMatter = match[1];
      const actualContent = markdownContent.replace(frontMatterRegex, '');
      
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
        content: actualContent.trim()
      };
    }
    
    return postData;
  };
  
  /**
   * Genera el frontmatter para un post en formato Markdown
   * 
   * @param {Object} post - Objeto con los datos del post
   * @returns {string} - Frontmatter en formato Markdown
   */
  export const generateFrontmatter = (post) => {
    return `---
  title: ${post.title}
  category: ${post.category}
  tags: ${post.tags}
  date: ${post.publishDate}
  status: ${post.status}
  ---
  
  `;
  };