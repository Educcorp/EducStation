// Script de prueba para verificar el acceso a publicaciones desde el frontend
const API_URL = 'https://educstation-backend-production.up.railway.app';

async function testAdminPanelAccess() {
  try {
    console.log('🔍 Probando acceso a publicaciones desde el frontend...\n');
    
    // 1. Probar endpoint público
    console.log('1. Probando endpoint público /latest...');
    const latestResponse = await fetch(`${API_URL}/api/publicaciones/latest?limite=5`);
    console.log(`   Status: ${latestResponse.status}`);
    
    let latestData = null;
    if (latestResponse.ok) {
      latestData = await latestResponse.json();
      console.log(`   ✅ Obtenidas ${latestData.length} publicaciones`);
      if (latestData.length > 0) {
        console.log(`   Primera publicación: "${latestData[0].Titulo}"`);
        console.log(`   Estado: ${latestData[0].Estado}`);
        console.log(`   Tiene imagen: ${latestData[0].Imagen_portada ? 'Sí' : 'No'}`);
      }
    } else {
      console.log(`   ❌ Error: ${latestResponse.status}`);
    }
    
    console.log('\n2. Probando endpoint principal...');
    const mainResponse = await fetch(`${API_URL}/api/publicaciones?limite=5`);
    console.log(`   Status: ${mainResponse.status}`);
    
    if (mainResponse.ok) {
      const mainData = await mainResponse.json();
      console.log(`   ✅ Obtenidas ${mainData.length} publicaciones`);
      if (mainData.length > 0) {
        console.log(`   Primera publicación: "${mainData[0].Titulo}"`);
        console.log(`   Estado: ${mainData[0].Estado}`);
        console.log(`   Tiene imagen: ${mainData[0].Imagen_portada ? 'Sí' : 'No'}`);
      }
    } else {
      console.log(`   ❌ Error: ${mainResponse.status}`);
    }
    
    console.log('\n3. Verificando estructura de datos...');
    if (latestData && latestData.length > 0) {
      const post = latestData[0];
      console.log('   Campos disponibles:');
      console.log(`   - ID_publicaciones: ${post.ID_publicaciones}`);
      console.log(`   - Titulo: ${post.Titulo ? 'Sí' : 'No'}`);
      console.log(`   - Resumen: ${post.Resumen ? 'Sí' : 'No'}`);
      console.log(`   - Estado: ${post.Estado ? 'Sí' : 'No'}`);
      console.log(`   - Fecha_creacion: ${post.Fecha_creacion ? 'Sí' : 'No'}`);
      console.log(`   - Fecha_modificacion: ${post.Fecha_modificacion ? 'Sí' : 'No'}`);
      console.log(`   - NombreAdmin: ${post.NombreAdmin ? 'Sí' : 'No'}`);
      console.log(`   - Imagen_portada: ${post.Imagen_portada ? 'Sí' : 'No'}`);
      
      if (post.Imagen_portada) {
        const imgType = typeof post.Imagen_portada;
        const imgLength = post.Imagen_portada.length;
        const isBase64 = post.Imagen_portada.startsWith('data:');
        const isHTML = post.Imagen_portada.includes('<img');
        console.log(`   - Tipo de imagen: ${imgType}, Longitud: ${imgLength}`);
        console.log(`   - Es Base64: ${isBase64}, Es HTML: ${isHTML}`);
      }
    }
    
    console.log('\n✅ Pruebas completadas');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  }
}

// Ejecutar las pruebas
testAdminPanelAccess(); 