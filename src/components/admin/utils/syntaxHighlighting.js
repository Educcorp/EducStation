// src/components/admin/utils/syntaxHighlighting.js
// Archivo completo con todas las funciones y estilos necesarios

/**
 * Aplica resaltado de sintaxis al texto según el modo especificado (markdown o html)
 * Versión mejorada para evitar el desface entre el texto y los colores
 * 
 * @param {string} content - El contenido al que aplicar el resaltado
 * @param {string} mode - El modo de editor ('markdown' o 'html')
 * @returns {string} - HTML con etiquetas span para el resaltado
 */
const applySyntaxHighlighting = (content, mode) => {
  if (!content) return "<div></div>"; // Devuelve al menos una línea vacía
  
  // Función para escapar HTML de forma segura
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  
  // Crear divs para cada línea, manteniendo líneas vacías
  const createDivs = (html) => {
    const lines = html.split('\n');
    return lines.map(line => `<div>${line || " "}</div>`).join('');
  };
  
  // Procesamiento para Markdown
  if (mode === 'markdown') {
    const lines = content.split('\n');
    let inCodeBlock = false;
    let currentCodeLanguage = '';
    let resultLines = [];
    
    // Procesamos línea por línea
    lines.forEach((line, index) => {
      // Detectar si estamos en un bloque de código
      if (line.trim().match(/^```(\w*)$/)) {
        if (!inCodeBlock) {
          // Inicio de un bloque de código
          inCodeBlock = true;
          const match = line.trim().match(/^```(\w*)$/);
          currentCodeLanguage = match && match[1] ? match[1] : '';
          resultLines.push(`<span class="editor-keyword">${escapeHtml(line)}</span>`);
        } else {
          // Fin de un bloque de código
          inCodeBlock = false;
          currentCodeLanguage = '';
          resultLines.push(`<span class="editor-keyword">${escapeHtml(line)}</span>`);
        }
      } else if (inCodeBlock) {
        // Dentro de un bloque de código
        let coloredLine = escapeHtml(line);
        
        // Resaltar según el lenguaje
        if (currentCodeLanguage.toLowerCase().match(/js|javascript/)) {
          // JavaScript
          coloredLine = coloredLine
            // Keywords
            .replace(/\b(function|return|var|let|const|if|else|for|while|switch|case|break|default|try|catch|throw|new|class|extends|import|export|from|async|await)\b/g, '<span class="editor-keyword">$1</span>')
            // Strings
            .replace(/(["'])(.*?)\1/g, '<span class="editor-string">$&</span>')
            // Numbers
            .replace(/\b(\d+)\b/g, '<span class="editor-number">$1</span>')
            // Comments
            .replace(/(\/\/.*$)/g, '<span class="editor-comment">$1</span>')
            // Functions
            .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="editor-function">$1</span>(');
        } 
        else if (currentCodeLanguage.toLowerCase().match(/html|xml/)) {
          // HTML
          coloredLine = coloredLine
            // Tags
            .replace(/(&lt;\/?[a-zA-Z0-9]+)(\s|&gt;)/g, '<span class="editor-tag-open">$1</span>$2')
            // Attributes
            .replace(/(\s+)([a-zA-Z0-9_-]+)(=)/g, '$1<span class="editor-attr-name">$2</span><span class="editor-attr-value">$3</span>')
            // Values
            .replace(/(=)(&quot;[^&]*&quot;|&#039;[^&]*&#039;)/g, '$1<span class="editor-attr-value">$2</span>');
        }
        else if (currentCodeLanguage.toLowerCase().match(/css/)) {
          // CSS
          coloredLine = coloredLine
            // Properties
            .replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="editor-css-property">$1</span>$2')
            // Values
            .replace(/(:)(\s*)([^;{}]+)(;|$)/g, '$1$2<span class="editor-css-value">$3</span>$4')
            // Selectors
            .replace(/^([.#]?[a-zA-Z0-9_-]+)(\s*\{)/g, '<span class="editor-css-selector">$1</span>$2');
        }
        else {
          // Generic code
          coloredLine = `<span class="editor-inline-code">${coloredLine}</span>`;
        }
        
        resultLines.push(coloredLine);
      } else {
        // Fuera de bloques de código
        let escapedLine = escapeHtml(line);
        
        // Headers
        if (escapedLine.match(/^#{1,6}\s/)) {
          escapedLine = `<span class="editor-header">${escapedLine}</span>`;
        }
        // Lists
        else if (escapedLine.match(/^\s*[-*+]\s/)) {
          escapedLine = `<span class="editor-list">${escapedLine}</span>`;
        }
        // Numbered lists
        else if (escapedLine.match(/^\s*\d+\.\s/)) {
          escapedLine = `<span class="editor-list">${escapedLine}</span>`;
        }
        // Blockquotes
        else if (escapedLine.match(/^\s*>\s/)) {
          escapedLine = `<span class="editor-blockquote">${escapedLine}</span>`;
        }
        // Horizontal rules
        else if (escapedLine.match(/^\s*[-*_]{3,}\s*$/)) {
          escapedLine = `<span class="editor-hr">${escapedLine}</span>`;
        }
        else {
          // Inline formatting
          escapedLine = escapedLine
            // Inline code
            .replace(/`([^`\n]+)`/g, '<span class="editor-inline-code">`$1`</span>')
            // Bold
            .replace(/(\*\*|__)([^\*\n]+)(\*\*|__)/g, '<span class="editor-bold">$1$2$3</span>')
            // Italic
            .replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)|(?<!_)_([^_\n]+)_(?!_)/g, (match, p1, p2) => {
              const content = p1 || p2;
              return `<span class="editor-italic">*${content}*</span>`;
            })
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="editor-link">$&</span>')
            // Images
            .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<span class="editor-image">$&</span>');
        }
        
        resultLines.push(escapedLine);
      }
    });
    
    return createDivs(resultLines.join('\n'));
  } 
  else if (mode === 'html') {
    // Procesamiento para HTML
    const htmlLines = content.split('\n');
    const processedLines = htmlLines.map(line => {
      let processedLine = escapeHtml(line);
      
      // Etiquetas HTML
      processedLine = processedLine
        // Doctype, comments
        .replace(/(&lt;!DOCTYPE[^&>]+&gt;|&lt;!--[\s\S]*?--&gt;)/g, '<span class="editor-doctype">$1</span>')
        // Opening tags
        .replace(/(&lt;)([a-zA-Z0-9]+)(\s|&gt;|\/&gt;)/g, '$1<span class="editor-tag-open">$2</span>$3')
        // Closing tags
        .replace(/(&lt;\/)([a-zA-Z0-9]+)(&gt;)/g, '$1<span class="editor-tag-open">$2</span>$3')
        // Attributes
        .replace(/(\s+)([a-zA-Z0-9_-]+)(=)/g, '$1<span class="editor-attr-name">$2</span>$3')
        // Attribute values
        .replace(/(=)(&quot;[^&]*&quot;|&#039;[^&]*&#039;)/g, '$1<span class="editor-attr-value">$2</span>');
      
      // CSS en style tags
      if (line.includes("&lt;style") || line.includes("style=") || line.match(/\{.+?\}/)) {
        processedLine = processedLine
          // Properties
          .replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="editor-css-property">$1</span>$2')
          // Values
          .replace(/(:)(\s*)([^;{}]+)(;|$)/g, '$1$2<span class="editor-css-value">$3</span>$4');
      }
      
      // JavaScript en script tags
      if (line.includes("&lt;script") || line.includes("function") || line.includes("var ")) {
        processedLine = processedLine
          // Keywords
          .replace(/\b(function|return|var|let|const|if|else|for|while|switch|case|break)\b/g, '<span class="editor-keyword">$1</span>')
          // Strings
          .replace(/(&quot;.*?&quot;|&#039;.*?&#039;)/g, '<span class="editor-string">$1</span>')
          // Numbers
          .replace(/\b(\d+)\b/g, '<span class="editor-number">$1</span>')
          // Comments
          .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="editor-comment">$1</span>');
      }
      
      return processedLine;
    });
    
    return createDivs(processedLines.join('\n'));
  }
  
  // Para otros modos, devolver el texto escapado con divs
  return createDivs(escapeHtml(content));
};

// Los estilos CSS para el resaltado de sintaxis
const syntaxHighlightingStyles = `
/* Estilos base para el editor */
.syntax-highlight-editor {
  background-color: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Cascadia Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
  font-size: 14px;
  padding: 16px;
  border-radius: 8px;
  tab-size: 2;
  -moz-tab-size: 2;
  white-space: pre;
  counter-reset: line;
  letter-spacing: normal;
  word-spacing: normal;
  margin: 0;
}

/* Corrección del desface haciendo que todos los elementos tengan el mismo tamaño */
.syntax-highlight-editor * {
  font-family: 'Cascadia Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  word-spacing: normal;
  letter-spacing: normal;
}

/* Markdown general - Colores mejorados */
.editor-header {
  color: #61afef;
  font-weight: bold;
}

.editor-bold {
  color: #e06c75;
  font-weight: bold;
}

.editor-italic {
  color: #98c379;
  font-style: italic;
}

.editor-inline-code {
  color: #d19a66;
  background-color: rgba(40, 44, 52, 0.5);
  padding: 0 4px;
  border-radius: 3px;
}

.editor-link {
  color: #56b6c2;
}

.editor-image {
  color: #56b6c2;
}

.editor-list {
  color: #c678dd;
}

.editor-blockquote {
  color: #98c379;
  border-left: 3px solid #98c379;
  padding-left: 8px;
}

.editor-hr {
  color: #abb2bf;
}

/* Lenguajes específicos */
/* JavaScript */
.editor-keyword {
  color: #c678dd;
  font-weight: bold;
}

.editor-string {
  color: #98c379;
}

.editor-number {
  color: #d19a66;
}

.editor-comment {
  color: #7f848e;
  font-style: italic;
}

/* HTML - Colores más vibrantes */
.editor-tag-open, .editor-tag-close {
  color: #e06c75;
}

.editor-attr-name {
  color: #d19a66;
}

.editor-attr-value {
  color: #98c379;
}

.editor-doctype {
  color: #7f848e;
}

/* CSS */
.editor-css-property {
  color: #56b6c2;
}

.editor-css-value {
  color: #98c379;
}

.editor-css-selector {
  color: #c678dd;
}

/* Líneas numeradas */
.syntax-highlight-editor {
  counter-reset: line;
  padding-left: 60px;
}

.syntax-highlight-editor div {
  position: relative;
  min-height: 1.5em;
}

.syntax-highlight-editor div:before {
  content: counter(line);
  counter-increment: line;
  position: absolute;
  left: -50px;
  top: 0;
  width: 40px;
  color: #636d83;
  text-align: right;
  user-select: none;
  opacity: 0.5;
}

/* Líneas vacías */
.syntax-highlight-editor div:empty {
  min-height: 1.5em;
}

.syntax-highlight-editor div:empty:after {
  content: " ";
}

/* Scrollbars personalizados */
.syntax-highlight-editor::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.syntax-highlight-editor::-webkit-scrollbar-track {
  background: #2d2d2d;
  border-radius: 3px;
}

.syntax-highlight-editor::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 3px;
}

.syntax-highlight-editor::-webkit-scrollbar-thumb:hover {
  background: #777;
}
`;

// Exportamos las funciones y estilos
export { applySyntaxHighlighting, syntaxHighlightingStyles };