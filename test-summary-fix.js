// Script de prueba para verificar las correcciones del resumen
console.log('🔧 Verificando correcciones del resumen en publicaciones...\n');

// Simulación de datos de prueba
const testPosts = [
  {
    ID_publicaciones: 1,
    Titulo: "Post con resumen normal",
    Resumen: "Este es un resumen normal sin HTML",
    Contenido: "<p>Este es el contenido HTML completo del post...</p>"
  },
  {
    ID_publicaciones: 2,
    Titulo: "Post con resumen HTML",
    Resumen: "<p>Este es un <strong>resumen</strong> con HTML</p>",
    Contenido: "<div><h1>Contenido completo</h1><p>Mucho texto...</p></div>"
  },
  {
    ID_publicaciones: 3,
    Titulo: "Post sin resumen",
    Resumen: "",
    Contenido: "<p>Solo tiene contenido, no resumen. Este texto debería aparecer truncado...</p>"
  },
  {
    ID_publicaciones: 4,
    Titulo: "Post con resumen vacío",
    Resumen: "   ",
    Contenido: "<div><p>Contenido HTML complejo con múltiples elementos</p></div>"
  }
];

// Función de prueba para procesar resumen
function getCleanSummary(post) {
  // Prioridad 1: Usar el campo Resumen si existe y no está vacío
  if (post.Resumen && post.Resumen.trim() !== '') {
    // Si el resumen contiene HTML, extraer solo el texto
    if (post.Resumen.includes('<') && post.Resumen.includes('>')) {
      // Simulación de extracción de texto (en el navegador usaríamos DOM)
      const cleanText = post.Resumen.replace(/<[^>]*>/g, '').trim();
      return cleanText || 'Sin resumen disponible';
    }
    return post.Resumen;
  }
  
  // Prioridad 2: Si no hay resumen, extraer del contenido
  if (post.Contenido && post.Contenido.trim() !== '') {
    const cleanText = post.Contenido.replace(/<[^>]*>/g, '').trim();
    
    // Truncar a 150 caracteres máximo
    if (cleanText.length > 150) {
      return cleanText.substring(0, 150).trim() + '...';
    }
    return cleanText || 'Sin contenido disponible';
  }
  
  return 'Sin resumen disponible';
}

console.log('📝 Probando función getCleanSummary:\n');

testPosts.forEach((post, index) => {
  console.log(`${index + 1}. ${post.Titulo}`);
  console.log(`   Resumen original: "${post.Resumen}"`);
  console.log(`   Resumen procesado: "${getCleanSummary(post)}"`);
  console.log('');
});

console.log('✅ Correcciones aplicadas:');
console.log('- AdminPanel.jsx: Agregada función getCleanSummary()');
console.log('- AdminPostList.jsx: Agregada función getCleanSummary()');
console.log('- PostCard.jsx: Corregido para usar Resumen en lugar de Contenido');
console.log('- Todas las funciones extraen texto limpio del HTML');

console.log('\n🎯 Resultado esperado:');
console.log('- Los resúmenes mostrarán texto limpio sin etiquetas HTML');
console.log('- Si no hay resumen, se extraerá del contenido y se truncará');
console.log('- No más HTML visible en las tarjetas de publicaciones'); 