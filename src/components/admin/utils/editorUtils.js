// src/components/admin/utils/editorUtils.js

/**
 * Inserta sintaxis de markdown en el texto de acuerdo al tipo especificado
 * 
 * @param {string} content - El contenido actual del editor
 * @param {string} markdownType - El tipo de sintaxis a insertar ('bold', 'italic', etc.)
 * @param {string} placeholder - Texto de placeholder cuando no hay selección
 * @param {HTMLTextAreaElement} textAreaRef - Referencia al elemento textarea
 * @returns {string} - El contenido actualizado con la sintaxis de markdown insertada
 */
export const insertMarkdown = (content, markdownType, placeholder = '', textAreaRef) => {
    if (!textAreaRef) return content;
    
    const start = textAreaRef.selectionStart;
    const end = textAreaRef.selectionEnd;
    
    // Texto seleccionado o placeholder
    const selectedText = start !== end 
      ? content.substring(start, end) 
      : placeholder;
    
    // Formateamos el contenido seleccionado con la sintaxis de markdown
    let formattedText;
    switch(markdownType) {
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
   * Inserta sintaxis HTML en el texto de acuerdo al tipo especificado
   * 
   * @param {string} content - El contenido actual del editor
   * @param {string} htmlType - El tipo de sintaxis a insertar ('div', 'p', 'h1', etc.)
   * @param {string} placeholder - Texto de placeholder cuando no hay selección
   * @param {HTMLTextAreaElement} textAreaRef - Referencia al elemento textarea
   * @returns {string} - El contenido actualizado con la sintaxis HTML insertada
   */
  export const insertHTML = (content, htmlType, placeholder = '', textAreaRef) => {
    if (!textAreaRef) return content;
    
    const start = textAreaRef.selectionStart;
    const end = textAreaRef.selectionEnd;
    
    // Texto seleccionado o placeholder
    const selectedText = start !== end 
      ? content.substring(start, end) 
      : placeholder;
    
    // Formateamos el contenido seleccionado con la sintaxis HTML apropiada
    let formattedText;
    switch(htmlType) {
      case 'bold':
        formattedText = `<strong>${selectedText || 'texto en negrita'}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText || 'texto en cursiva'}</em>`;
        break;
      case 'heading':
        formattedText = `<h1>${selectedText || 'Título principal'}</h1>`;
        break;
      case 'subheading':
        formattedText = `<h2>${selectedText || 'Subtítulo'}</h2>`;
        break;
      case 'h3':
        formattedText = `<h3>${selectedText || 'Encabezado 3'}</h3>`;
        break;
      case 'link':
        formattedText = `<a href="#">${selectedText || 'enlace'}</a>`;
        break;
      case 'image':
        formattedText = `<img src="imagen.jpg" alt="${selectedText || 'Descripción de la imagen'}" />`;
        break;
      case 'list':
        formattedText = `<ul>\n  <li>${selectedText || 'Elemento 1'}</li>\n  <li>Elemento 2</li>\n</ul>`;
        break;
      case 'ordered-list':
        formattedText = `<ol>\n  <li>${selectedText || 'Elemento 1'}</li>\n  <li>Elemento 2</li>\n</ol>`;
        break;
      case 'quote':
        formattedText = `<blockquote>\n  ${selectedText || 'Cita'}\n</blockquote>`;
        break;
      case 'code':
        formattedText = `<pre><code>${selectedText || 'código aquí'}</code></pre>`;
        break;
      case 'table':
        formattedText = `<table border="1">\n  <thead>\n    <tr>\n      <th>Encabezado 1</th>\n      <th>Encabezado 2</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Celda 1</td>\n      <td>Celda 2</td>\n    </tr>\n  </tbody>\n</table>`;
        break;
      case 'divider':
        formattedText = `<hr />`;
        break;
      case 'paragraph':
        formattedText = `<p>${selectedText || 'Párrafo'}</p>`;
        break;
      case 'div':
        formattedText = `<div>\n  ${selectedText || 'Contenido aquí'}\n</div>`;
        break;
      case 'section':
        formattedText = `<section>\n  <h2>${selectedText || 'Título de sección'}</h2>\n  <p>Contenido de la sección</p>\n</section>`;
        break;
      case 'style':
        formattedText = `<style>\n  /* Estilos CSS */\n  body {\n    font-family: 'Poppins', sans-serif;\n    color: #0b4444;\n  }\n</style>`;
        break;
      case 'script':
        formattedText = `<script>\n  // Código JavaScript\n  document.addEventListener('DOMContentLoaded', () => {\n    console.log('La página ha cargado');\n  });\n</script>`;
        break;
      case 'html-skeleton':
        formattedText = `<!DOCTYPE html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${selectedText || 'Título del documento'}</title>\n  <style>\n    body {\n      font-family: 'Poppins', sans-serif;\n      line-height: 1.6;\n      color: #0b4444;\n      max-width: 800px;\n      margin: 0 auto;\n      padding: 20px;\n    }\n  </style>\n</head>\n<body>\n  <h1>${selectedText || 'Título principal'}</h1>\n  <p>Contenido del documento</p>\n</body>\n</html>`;
        break;
      case 'timeline':
        formattedText = `<div class="timeline">\n  <div class="timeline-item">\n    <div class="timeline-date">Día 1</div>\n    <div class="timeline-content">\n      <h3>Estudiar nuevo material (2 horas)</h3>\n      <p>Lectura inicial y comprensión de conceptos</p>\n    </div>\n  </div>\n  <div class="timeline-item">\n    <div class="timeline-date">Día 3</div>\n    <div class="timeline-content">\n      <h3>Repasar material (1 hora)</h3>\n      <p>Primera sesión de repaso espaciado</p>\n    </div>\n  </div>\n</div>`;
        break;
      case 'custom-section':
        formattedText = `<section class="metodologia">\n  <h2>${selectedText || 'Metodología de Estudio'}</h2>\n  <div class="metodo-grid">\n    <div class="metodo-card">\n      <h3>Fase 1: Adquisición</h3>\n      <p>Lectura activa, subrayado y toma de notas</p>\n    </div>\n    <div class="metodo-card">\n      <h3>Fase 2: Comprensión</h3>\n      <p>Mapas mentales y resolución de ejemplos</p>\n    </div>\n  </div>\n</section>`;
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
 * Inserta sintaxis simple en el texto de acuerdo al tipo especificado
 * 
 * @param {string} content - El contenido actual del editor
 * @param {string} simpleType - El tipo de sintaxis a insertar ('bold', 'italic', etc.)
 * @param {string} placeholder - Texto de placeholder cuando no hay selección
 * @param {HTMLTextAreaElement} textAreaRef - Referencia al elemento textarea
 * @returns {string} - El contenido actualizado con la sintaxis simple insertada
 */
export const insertSimple = (content, simpleType, placeholder = '', textAreaRef) => {
  if (!textAreaRef) return content;
  
  const start = textAreaRef.selectionStart;
  const end = textAreaRef.selectionEnd;
  
  // Texto seleccionado o placeholder
  const selectedText = start !== end 
    ? content.substring(start, end) 
    : placeholder;
  
  // Formateamos el contenido seleccionado con la sintaxis simple
  let formattedText;
  switch(simpleType) {
    case 'bold':
      formattedText = `<b>${selectedText}</b>`;
      break;
    case 'italic':
      formattedText = `<i>${selectedText}</i>`;
      break;
    case 'heading':
      formattedText = `<h1>${selectedText}</h1>`;
      break;
    case 'subheading':
      formattedText = `<h2>${selectedText}</h2>`;
      break;
    case 'link':
      formattedText = `<a href="#">${selectedText}</a>`;
      break;
    case 'image':
      formattedText = `<img src="imagen.jpg" alt="${selectedText}" />`;
      break;
    case 'list':
      formattedText = `<ul><li>${selectedText}</li></ul>`;
      break;
    case 'ordered-list':
      formattedText = `<ol><li>${selectedText}</li></ol>`;
      break;
    case 'quote':
      formattedText = `<blockquote>${selectedText}</blockquote>`;
      break;
    case 'divider':
      formattedText = `<hr />`;
      break;
    case 'font-size':
      formattedText = `<span style="font-size:${placeholder};">${selectedText}</span>`;
      break;
    case 'font-family':
      formattedText = `<span style="font-family:${placeholder};">${selectedText}</span>`;
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