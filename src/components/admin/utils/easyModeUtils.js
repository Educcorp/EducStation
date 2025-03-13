// src/components/admin/utils/easyModeUtils.js

/**
 * Convierte contenido en formato Markdown a HTML enriquecido para editor WYSIWYG
 * 
 * @param {string} markdown - Contenido en formato Markdown
 * @returns {string} - Contenido en formato HTML enriquecido
 */
export const convertFromMarkdown = (markdown) => {
    if (!markdown) return '';
    
    let html = markdown;
    
    // Encabezados
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
    html = html.replace(/^##### (.*?)$/gm, '<h5>$1</h5>');
    html = html.replace(/^###### (.*?)$/gm, '<h6>$1</h6>');
    
    // Negrita
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Cursiva
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Código en línea
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Bloques de código
    html = html.replace(/```(.*?)\n([\s\S]*?)```/gm, (match, lang, code) => {
      return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
    });
    
    // Listas no ordenadas
    html = html.replace(/^\s*[\-*+]\s+(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Listas ordenadas
    html = html.replace(/^\s*\d+\.\s+(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>\n?)+/g, (match) => {
      return match.indexOf('<ul>') === -1 ? '<ol>' + match + '</ol>' : match;
    });
    
    // Citas
    html = html.replace(/^>\s+(.*?)$/gm, '<blockquote>$1</blockquote>');
    
    // Enlaces
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Imágenes
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%;">');
    
    // Líneas horizontales
    html = html.replace(/^---$/gm, '<hr style="border: none; height: 1px; background-color: #e1e4e8; margin: 1.5em 0;">');
    
    // Tablas (conversión básica)
    html = html.replace(/\|(.+)\|/g, (match, content) => {
      const cells = content.split('|').map(cell => cell.trim());
      return '<tr>' + cells.map(cell => `<td style="border: 1px solid #d2b99a; padding: 8px;">${cell}</td>`).join('') + '</tr>';
    });
    html = html.replace(/(<tr>.*?<\/tr>)\s*\|([-\s|]+)\|\s*(<tr>)/g, '$1<tr>$3');
    html = html.replace(/(<tr>.*?<\/tr>)+/g, '<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">$&</table>');
    
    // Párrafos (después de procesar todo lo demás)
    // Dividir por líneas en blanco
    const lines = html.split(/\n\s*\n/);
    
    // Envolver en párrafos solo el texto que no esté ya en un elemento HTML
    html = lines.map(line => {
      line = line.trim();
      if (line && !line.startsWith('<') && !line.endsWith('>')) {
        return `<p>${line}</p>`;
      }
      return line;
    }).join('\n\n');
    
    return html;
  };
  
  /**
   * Convierte contenido en formato HTML enriquecido a Markdown
   * 
   * @param {string} html - Contenido en formato HTML enriquecido
   * @returns {string} - Contenido en formato Markdown
   */
  export const convertToMarkdown = (html) => {
    if (!html) return '';
    
    // Creamos un elemento temporal para manipular el HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Procesamiento especial para tablas
    const tables = tempDiv.querySelectorAll('table');
    tables.forEach(table => {
      const rows = Array.from(table.querySelectorAll('tr'));
      
      if (rows.length > 1) {
        // Crear separadores para la segunda fila (después del encabezado)
        const headerCells = Array.from(rows[0].querySelectorAll('th, td'));
        if (headerCells.length > 0) {
          const separatorRow = document.createElement('tr');
          headerCells.forEach(() => {
            const separatorCell = document.createElement('td');
            separatorCell.textContent = ' --- ';
            separatorRow.appendChild(separatorCell);
          });
          
          rows[0].insertAdjacentElement('afterend', separatorRow);
        }
      }
    });
    
    // Función para convertir un nodo a Markdown
    const nodeToMarkdown = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
      }
      
      // Manejar nodos con estilos inline
      if (node.style && (node.style.color || node.style.backgroundColor)) {
        // En Markdown no hay soporte nativo para colores, así que mantenemos el HTML
        const wrapper = document.createElement('div');
        wrapper.appendChild(node.cloneNode(true));
        return wrapper.innerHTML;
      }
      
      const tagName = node.tagName.toLowerCase();
      const children = Array.from(node.childNodes).map(nodeToMarkdown).join('');
      
      switch (tagName) {
        case 'h1':
          return `# ${children.trim()}\n\n`;
        case 'h2':
          return `## ${children.trim()}\n\n`;
        case 'h3':
          return `### ${children.trim()}\n\n`;
        case 'h4':
          return `#### ${children.trim()}\n\n`;
        case 'h5':
          return `##### ${children.trim()}\n\n`;
        case 'h6':
          return `###### ${children.trim()}\n\n`;
        case 'p':
          return `${children.trim()}\n\n`;
        case 'strong':
        case 'b':
          return `**${children}**`;
        case 'em':
        case 'i':
          return `*${children}*`;
        case 'a':
          const href = node.getAttribute('href') || '';
          return `[${children}](${href})`;
        case 'img':
          const src = node.getAttribute('src') || '';
          const alt = node.getAttribute('alt') || '';
          return `![${alt}](${src})`;
        case 'code':
          return node.parentNode.tagName.toLowerCase() === 'pre' ? children : `\`${children}\``;
        case 'pre':
          if (node.querySelector('code')) {
            const code = node.querySelector('code').textContent;
            const lang = node.querySelector('code').className.replace('language-', '') || '';
            return `\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
          }
          return `\`\`\`\n${children}\n\`\`\`\n\n`;
        case 'blockquote':
          return `> ${children.trim()}\n\n`;
        case 'ul':
          return children + '\n';
        case 'ol':
          return children + '\n';
        case 'li':
          const parent = node.parentNode.tagName.toLowerCase();
          const prefix = parent === 'ol' ? '1. ' : '- ';
          return `${prefix}${children.trim()}\n`;
        case 'hr':
          return '---\n\n';
        case 'table':
          return children + '\n';
        case 'tr':
          return `|${children}|\n`;
        case 'th':
        case 'td':
          return ` ${children} `;
        case 'br':
          return '\n';
        default:
          return children;
      }
    };
    
    let markdown = nodeToMarkdown(tempDiv);
    
    // Limpieza final de posibles elementos HTML que quedaron
    markdown = markdown.replace(/<\/?[^>]+(>|$)/g, '');
    
    return markdown;
  };
  
  /**
   * Limpia el HTML para evitar problemas de seguridad y formato
   * 
   * @param {string} html - HTML a limpiar
   * @returns {string} - HTML limpio
   */
  export const sanitizeHtml = (html) => {
    if (!html) return '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Eliminar atributos potencialmente peligrosos
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(el => {
      // Eliminar eventos onclick y similares
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on') || attr.name === 'javascript:') {
          el.removeAttribute(attr.name);
        }
      });
      
      // Conservar solo atributos permitidos según el tipo de elemento
      if (el.tagName.toLowerCase() === 'a') {
        // Para enlaces, permitir href y target
        const href = el.getAttribute('href');
        const target = el.getAttribute('target');
        el.removeAttribute('class');
        // Eliminar todos los atributos
        while (el.attributes.length > 0) {
          el.removeAttribute(el.attributes[0].name);
        }
        // Restaurar los permitidos
        if (href) el.setAttribute('href', href);
        if (target) el.setAttribute('target', target);
      } else if (el.tagName.toLowerCase() === 'img') {
        // Para imágenes, permitir src, alt y style básico
        const src = el.getAttribute('src');
        const alt = el.getAttribute('alt');
        // Eliminar todos los atributos
        while (el.attributes.length > 0) {
          el.removeAttribute(el.attributes[0].name);
        }
        // Restaurar los permitidos
        if (src) el.setAttribute('src', src);
        if (alt) el.setAttribute('alt', alt);
        el.setAttribute('style', 'max-width: 100%;');
      }
    });
    
    return tempDiv.innerHTML;
  };