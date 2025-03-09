// src/components/admin/utils/syntaxHighlighting.js

/**
 * Aplica resaltado de sintaxis al texto según el modo especificado (markdown o html)
 * 
 * @param {string} content - El contenido al que aplicar el resaltado
 * @param {string} mode - El modo de editor ('markdown' o 'html')
 * @returns {string} - HTML con etiquetas span para el resaltado
 */
const applySyntaxHighlighting = (content, mode) => {
    if (!content) return "";
    
    // Función para escapar HTML de forma segura
    const escapeHtml = (unsafe) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };
    
    // Función para evaluar si una línea forma parte de un bloque de código
    const isCodeBlockDelimiter = (line) => {
      return line.trim().startsWith('```');
    };
    
    // Función para detectar el lenguaje en una línea de apertura de bloque de código
    const getCodeLanguage = (line) => {
      const match = line.trim().match(/^```(\w*)$/);
      return match && match[1] ? match[1] : '';
    };
    
    if (mode === 'markdown') {
      const lines = content.split('\n');
      let inCodeBlock = false;
      let currentCodeLanguage = '';
      let resultLines = [];
      
      // Procesamos línea por línea para manejar los bloques de código correctamente
      lines.forEach((line, index) => {
        // Detectar si estamos en un bloque de código
        if (isCodeBlockDelimiter(line)) {
          if (!inCodeBlock) {
            // Inicio de un bloque de código - Simplemente colorear la línea sin estilos especiales
            inCodeBlock = true;
            currentCodeLanguage = getCodeLanguage(line);
            resultLines.push(`<span style="color: #569CD6;">${escapeHtml(line)}</span>`);
          } else {
            // Fin de un bloque de código - Simplemente colorear la línea sin estilos especiales
            inCodeBlock = false;
            currentCodeLanguage = '';
            resultLines.push(`<span style="color: #569CD6;">${escapeHtml(line)}</span>`);
          }
        } else if (inCodeBlock) {
          // Simplemente colorear el contenido del bloque de código sin alterar su formato
          let coloredLine;
          
          // Resaltado básico según el lenguaje
          switch (currentCodeLanguage.toLowerCase()) {
            case 'js':
            case 'javascript':
              coloredLine = highlightJavaScript(line);
              break;
            case 'html':
              coloredLine = highlightHtml(line);
              break;
            case 'css':
              coloredLine = highlightCss(line);
              break;
            case 'bash':
            case 'sh':
              coloredLine = highlightBash(line);
              break;
            case 'python':
            case 'py':
              coloredLine = highlightPython(line);
              break;
            default:
              // Para otros lenguajes o sin especificar
              coloredLine = `<span style="color: #b5cea8;">${escapeHtml(line)}</span>`;
          }
          
          resultLines.push(coloredLine);
        } else {
          // Procesamiento normal fuera de bloques de código con estilos enriquecidos
          let processedLine = escapeHtml(line);
          
          // Headers - Estos son siempre líneas completas, aplicamos el span a toda la línea
          if (processedLine.match(/^#{1,6}\s.+/)) {
            processedLine = `<span class="editor-header">${processedLine}</span>`;
          } else {
            // Para el resto de elementos, aplicamos resaltado por partes
            // Aplicamos los patrones en un orden específico para evitar problemas de superposición

            // Preservamos inline code primero porque puede contener otros símbolos markdown
            const codeMatches = [];
            processedLine = processedLine.replace(/`([^`\n]+)`/g, (match, p1, offset) => {
              const placeholder = `__CODE_PLACEHOLDER_${codeMatches.length}__`;
              codeMatches.push(match);
              return placeholder;
            });

            // Aplicamos negrita
            processedLine = processedLine.replace(/(\*\*|__)([^\*\n]+)(\*\*|__)/g, 
              '<span class="editor-bold">$1$2$3</span>');

            // Aplicamos cursiva, pero cuidando de no afectar lo que ya está en negrita
            processedLine = processedLine.replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)|(?<!_)_([^_\n]+)_(?!_)/g, 
              (match, p1, p2) => {
                const content = p1 || p2;
                return `<span class="editor-italic">*${content}*</span>`;
              });

            // Restauramos los placeholders de código inline
            codeMatches.forEach((codeMatch, i) => {
              processedLine = processedLine.replace(`__CODE_PLACEHOLDER_${i}__`, 
                `<span class="editor-inline-code">${codeMatch}</span>`);
            });

            // Links
            processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
              '<span class="editor-link">$&</span>');

            // Images
            processedLine = processedLine.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, 
              '<span class="editor-image">$&</span>');
          }

          // Estas son líneas completas que reciben clases especiales
          if (line.match(/^\s*[-*+]\s/)) {
            processedLine = `<span class="editor-list">${processedLine}</span>`;
          } else if (line.match(/^\s*\d+\.\s/)) {
            processedLine = `<span class="editor-list">${processedLine}</span>`;
          } else if (line.match(/^\s*>\s/)) {
            processedLine = `<span class="editor-blockquote">${processedLine}</span>`;
          } else if (line.match(/^\s*[-*_]{3,}\s*$/)) {
            processedLine = `<span class="editor-hr">${processedLine}</span>`;
          }
          
          resultLines.push(processedLine);
        }
      });
      
      return resultLines.join('\n');
    } else if (mode === 'html') {
      // Escapar el contenido HTML completo
      let htmlContent = escapeHtml(content);
      
      // Resaltado de etiquetas HTML con diferenciación entre apertura/cierre de etiquetas
      htmlContent = htmlContent.replace(/(&lt;\/[a-zA-Z0-9]+&gt;)/g, '<span class="editor-tag-close">$1</span>'); // Etiquetas de cierre
      htmlContent = htmlContent.replace(/(&lt;[a-zA-Z0-9]+)(\s|&gt;)/g, '<span class="editor-tag-open">$1</span>$2'); // Etiquetas de apertura
      
      // Atributos y valores - procesamiento mejorado
      htmlContent = htmlContent.replace(/(\s+)([a-zA-Z0-9_-]+)(=)(&quot;[^&]*&quot;|&#039;[^&]*&#039;)/g, 
        '$1<span class="editor-attr-name">$2</span><span class="editor-operator">$3</span><span class="editor-attr-value">$4</span>');
      
      // DOCTYPE, comentarios
      htmlContent = htmlContent.replace(/(&lt;!DOCTYPE[^&>]+&gt;|&lt;!--[\s\S]*?--&gt;)/g, '<span class="editor-doctype">$1</span>');
      
      // Dividir en líneas para procesamiento adicional
      const htmlLines = htmlContent.split('\n');
      const processedLines = htmlLines.map(line => {
        // Determinar si la línea es CSS o JavaScript
        if (line.includes('&lt;style') || (line.includes('style') && line.includes('{')) || line.includes('class=')) {
          // Propiedades CSS
          line = line.replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="editor-css-property">$1</span>$2');
          
          // Valores CSS
          line = line.replace(/(:)(\s*)([^;{}]+)(;|$)/g, '$1$2<span class="editor-css-value">$3</span>$4');
        }
        
        if (line.includes('&lt;script') || line.includes('function') || line.includes('var ') || line.includes('let ') || line.includes('const ')) {
          // Palabras clave JavaScript
          const jsKeywords = ["function", "return", "var", "let", "const", "if", "else", "for", "while", "switch", "case", "break", "default", "try", "catch", "throw"];
          
          jsKeywords.forEach(keyword => {
            const regex = new RegExp(`(^|[^a-zA-Z0-9_])(${keyword})([^a-zA-Z0-9_]|$)`, 'g');
            line = line.replace(regex, '$1<span class="editor-keyword">$2</span>$3');
          });
          
          // Strings
          line = line.replace(/(&quot;.*?&quot;|&#039;.*?&#039;)/g, '<span class="editor-string">$1</span>');
          
          // Números
          line = line.replace(/\b(\d+)\b/g, '<span class="editor-number">$1</span>');
          
          // Comentarios JS
          line = line.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="editor-comment">$1</span>');
        }
        
        return line;
      });
      
      return processedLines.join('\n');
    }
    
    return escapeHtml(content);
  };
  
  // Funciones auxiliares para el resaltado específico por lenguaje
  function highlightJavaScript(line) {
    const escapedLine = escapeHtml(line);
    let highlightedLine = escapedLine;
    
    // Palabras clave
    const keywords = ["function", "return", "var", "let", "const", "if", "else", "for", "while", "switch", "case", "break", "default", "try", "catch", "throw", "new", "this", "class", "extends"];
    keywords.forEach(keyword => {
      highlightedLine = highlightedLine.replace(
        new RegExp(`(^|[^\\w$])${keyword}([^\\w$]|$)`, 'g'),
        `$1<span class="editor-keyword">${keyword}</span>$2`
      );
    });
    
    // Strings
    highlightedLine = highlightedLine.replace(
      /(["'])(.*?)\1/g,
      '<span class="editor-string">$&</span>'
    );
    
    // Números
    highlightedLine = highlightedLine.replace(
      /\b(\d+)\b/g,
      '<span class="editor-number">$1</span>'
    );
    
    // Comentarios
    highlightedLine = highlightedLine.replace(
      /(\/\/.*$)/g,
      '<span class="editor-comment">$1</span>'
    );
    
    return highlightedLine;
  }
  
  function highlightHtml(line) {
    const escapedLine = escapeHtml(line);
    let highlightedLine = escapedLine;
    
    // Etiquetas
    highlightedLine = highlightedLine.replace(
      /(&lt;\/?[a-zA-Z0-9]+&gt;|&lt;[a-zA-Z0-9]+\s)/g,
      '<span class="editor-tag-open">$&</span>'
    );
    
    // Atributos
    highlightedLine = highlightedLine.replace(
      /\s([a-zA-Z0-9_-]+)=/g,
      ' <span class="editor-attr-name">$1</span>='
    );
    
    // Valores de atributos
    highlightedLine = highlightedLine.replace(
      /=("[^"]*"|'[^']*')/g,
      '=<span class="editor-attr-value">$1</span>'
    );
    
    return highlightedLine;
  }
  
  function highlightCss(line) {
    const escapedLine = escapeHtml(line);
    let highlightedLine = escapedLine;
    
    // Propiedades
    highlightedLine = highlightedLine.replace(
      /([a-zA-Z-]+):/g,
      '<span class="editor-css-property">$1</span>:'
    );
    
    // Valores
    highlightedLine = highlightedLine.replace(
      /:\s*([^;]+)(;|\s*$)/g,
      ': <span class="editor-css-value">$1</span>$2'
    );
    
    // Selectores
    highlightedLine = highlightedLine.replace(
      /^([\w\.-]+)/g,
      '<span class="editor-css-selector">$1</span>'
    );
    
    return highlightedLine;
  }
  
  function highlightBash(line) {
    const escapedLine = escapeHtml(line);
    let highlightedLine = escapedLine;
    
    // Comandos comunes
    const commands = ["git", "cd", "ls", "mkdir", "touch", "rm", "cp", "mv", "echo", "cat", "grep", "find", "code", "npm", "yarn", "node"];
    commands.forEach(command => {
      highlightedLine = highlightedLine.replace(
        new RegExp(`(^|\\s)(${command})\\b`, 'g'),
        '$1<span class="editor-bash-command">$2</span>'
      );
    });
    
    // Flags y opciones
    highlightedLine = highlightedLine.replace(
      /\s(-{1,2}[a-zA-Z0-9_-]+)/g,
      ' <span class="editor-bash-flag">$1</span>'
    );
    
    // URLs y rutas
    highlightedLine = highlightedLine.replace(
      /(https?:\/\/[^\s]+|\/\S*)/g,
      '<span class="editor-bash-path">$1</span>'
    );
    
    // Comentarios
    highlightedLine = highlightedLine.replace(
      /(#.*)$/g,
      '<span class="editor-comment">$1</span>'
    );
    
    return highlightedLine;
  }
  
  function highlightPython(line) {
    const escapedLine = escapeHtml(line);
    let highlightedLine = escapedLine;
    
    // Palabras clave
    const keywords = ["def", "class", "import", "from", "return", "if", "elif", "else", "for", "while", "try", "except", "finally", "with", "as", "pass", "break", "continue", "and", "or", "not", "is", "in", "None", "True", "False"];
    keywords.forEach(keyword => {
      highlightedLine = highlightedLine.replace(
        new RegExp(`(^|[^\\w])${keyword}([^\\w]|$)`, 'g'),
        `$1<span class="editor-keyword">${keyword}</span>$2`
      );
    });
    
    // Strings
    highlightedLine = highlightedLine.replace(
      /(["'])(.*?)\1/g,
      '<span class="editor-string">$&</span>'
    );
    
    // Números
    highlightedLine = highlightedLine.replace(
      /\b(\d+)\b/g,
      '<span class="editor-number">$1</span>'
    );
    
    // Comentarios
    highlightedLine = highlightedLine.replace(
      /(#.*)$/g,
      '<span class="editor-comment">$1</span>'
    );
    
    return highlightedLine;
  }
  
  /**
   * Estilos CSS para el resaltado de sintaxis en el editor
   */
  const syntaxHighlightingStyles = `
  /* Estilos base para el editor */
  .syntax-highlight-editor {
    background-color: #1e1e1e;
    color: #d4d4d4;
    font-family: 'Cascadia Code', 'Consolas', 'Monaco', 'Courier New', monospace;
    line-height: 1.5;
    padding: 16px;
    border-radius: 8px;
    overflow: auto;
    tab-size: 2;
    white-space: pre;
    counter-reset: line;
  }
  
  /* Markdown general */
  .editor-header {
    color: #569cd6;
    font-weight: bold;
    display: block;
    font-size: 1.2em;
  }
  
  .editor-bold {
    color: #ce9178;
    font-weight: bold;
  }
  
  .editor-italic {
    color: #dcdcaa;
    font-style: italic;
  }
  
  .editor-inline-code {
    color: #b5cea8;
    background-color: #2d2d2d;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Cascadia Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  }
  
  .editor-link, .editor-image {
    color: #4ec9b0;
  }
  
  .editor-list {
    color: #9cdcfe;
    display: block;
  }
  
  .editor-blockquote {
    color: #608b4e;
    border-left: 3px solid #608b4e;
    padding-left: 8px;
    display: block;
  }
  
  .editor-hr {
    color: #608b4e;
    display: block;
  }
  
  /* Lenguajes específicos */
  /* JavaScript */
  .editor-keyword {
    color: #569cd6;
    font-weight: bold;
  }
  
  .editor-string {
    color: #ce9178;
  }
  
  .editor-number {
    color: #b5cea8;
  }
  
  .editor-comment {
    color: #608b4e;
    font-style: italic;
  }
  
  /* HTML */
  .editor-tag-open, .editor-tag-close {
    color: #569cd6;
  }
  
  .editor-attr-name {
    color: #9cdcfe;
  }
  
  .editor-attr-value {
    color: #ce9178;
  }
  
  .editor-doctype {
    color: #608b4e;
  }
  
  /* CSS */
  .editor-css-property {
    color: #9cdcfe;
  }
  
  .editor-css-value {
    color: #ce9178;
  }
  
  .editor-css-selector {
    color: #d7ba7d;
  }
  
  /* Bash */
  .editor-bash-command {
    color: #569cd6;
    font-weight: bold;
  }
  
  .editor-bash-flag {
    color: #9cdcfe;
  }
  
  .editor-bash-path {
    color: #ce9178;
  }
  
  /* Estilos para lenguajes adicionales */
  .editor-python-decorator {
    color: #dcdcaa;
  }
  
  .editor-variable {
    color: #9cdcfe;
  }
  
  .editor-function {
    color: #dcdcaa;
  }
  
  /* Scrollbars personalizados */
  .syntax-highlight-editor::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  
  .syntax-highlight-editor::-webkit-scrollbar-track {
    background: #2d2d2d;
    border-radius: 5px;
  }
  
  .syntax-highlight-editor::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 5px;
  }
  
  .syntax-highlight-editor::-webkit-scrollbar-thumb:hover {
    background: #777;
  }
  `;
  
  export { applySyntaxHighlighting, syntaxHighlightingStyles };