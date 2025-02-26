import React, { useState, useEffect } from 'react';

const EducStation = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Detectar scroll para efectos de navegación
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const categories = [
    'Todos',
    'Noticias',
    'Técnicas de Estudio',
    'Problemáticas',
    'Educación de Calidad',
    'Herramientas',
    'Desarrollo Docente',
    'Comunidad'
  ];
  
  const featuredPost = {
    title: 'Innovación Educativa: Transformando el Aprendizaje en la Era Digital',
    image: '/api/placeholder/600/350',
    category: 'desarrollo docente',
    time: '2 horas atrás',
    number: '01',
    excerpt: 'Descubre cómo los educadores están reinventando sus métodos de enseñanza para adaptarse a un mundo cada vez más digitalizado.'
  };
  
  const posts = [
    {
      id: 1,
      title: 'Cómo Optimizar el Uso de Tecnología en el Aula',
      image: '/api/placeholder/150/100',
      category: 'herramientas',
      time: '4 horas atrás',
      number: '02',
      likes: 124
    },
    {
      id: 2,
      title: 'Entendiendo la Psicología del Aprendizaje Visual',
      image: '/api/placeholder/150/100',
      category: 'técnicas de estudio',
      time: '4 horas atrás',
      number: '03',
      likes: 89
    },
    {
      id: 3,
      title: 'El Poder de la Colaboración en Entornos Educativos',
      image: '/api/placeholder/150/100',
      category: 'comunidad',
      time: '4 horas atrás',
      number: '04',
      likes: 76
    },
    {
      id: 4,
      title: 'Construyendo un Sistema Educativo Inclusivo',
      image: '/api/placeholder/150/100',
      category: 'educación de calidad',
      time: '4 horas atrás',
      number: '05',
      likes: 112
    }
  ];

  // Estilos CSS avanzados
  const styles = {
    app: {
      fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      margin: 0,
      padding: 0,
      backgroundColor: "#f8f9fc",
      color: "#1e293b",
      overflowX: "hidden"
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 15px"
    },
    header: {
      backgroundColor: isScrolled ? "rgba(255,255,255,0.95)" : "white",
      padding: "15px 0",
      boxShadow: isScrolled ? "0 4px 20px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.05)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      transition: "all 0.3s ease-in-out"
    },
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    logo: {
      display: "flex",
      alignItems: "center",
      color: "#7c4dff",
      textDecoration: "none",
      fontSize: "24px",
      fontWeight: "bold",
      transition: "transform 0.3s ease",
      transform: hoveredCategory === 'logo' ? "translateY(-2px)" : "translateY(0)"
    },
    logoIcon: {
      marginRight: "10px",
      width: "32px",
      height: "32px",
      backgroundColor: "#7c4dff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(124, 77, 255, 0.3)",
      transition: "all 0.3s ease"
    },
    navLinks: {
      display: "flex",
      gap: "30px"
    },
    navLink: (isActive) => ({
      color: isActive ? "#7c4dff" : "#1e293b",
      textDecoration: "none",
      fontWeight: "500",
      position: "relative",
      padding: "5px 0",
      transition: "color 0.3s ease",
      "&:hover": {
        color: "#7c4dff"
      },
      "&:after": {
        content: "''",
        position: "absolute",
        width: isActive ? "100%" : "0%",
        height: "2px",
        bottom: 0,
        left: 0,
        backgroundColor: "#7c4dff",
        transition: "width 0.3s ease"
      }
    }),
    profileIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#f0f0f0",
      overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      border: "2px solid white",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
      }
    },
    profileImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    },
    breadcrumb: {
      margin: "20px 0",
      color: "#64748b",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    breadcrumbLink: {
      color: "#64748b",
      textDecoration: "none",
      transition: "color 0.3s ease",
      "&:hover": {
        color: "#7c4dff"
      }
    },
    hero: {
      margin: "40px 0 60px",
      position: "relative"
    },
    heroTitle: {
      fontSize: "48px",
      color: "#1e293b",
      marginBottom: "15px",
      lineHeight: "1.2",
      background: "linear-gradient(135deg, #7c4dff 0%, #448aff 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: "fadeInUp 0.8s ease-out"
    },
    heroText: {
      fontSize: "18px",
      color: "#64748b",
      marginBottom: "30px",
      maxWidth: "700px",
      lineHeight: "1.6",
      animation: "fadeInUp 1s ease-out"
    },
    circleLink: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "90px",
      height: "90px",
      background: "linear-gradient(135deg, #7c4dff 0%, #448aff 100%)",
      borderRadius: "50%",
      color: "white",
      textDecoration: "none",
      marginLeft: "auto",
      marginTop: "-40px",
      boxShadow: "0 6px 20px rgba(124, 77, 255, 0.4)",
      cursor: "pointer",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "scale(1.05) rotate(5deg)",
        boxShadow: "0 8px 25px rgba(124, 77, 255, 0.5)"
      }
    },
    circleText: {
      position: "absolute",
      width: "100%",
      height: "100%",
      fontSize: "10px",
      color: "rgba(255, 255, 255, 0.8)"
    },
    circleIcon: {
      fontSize: "28px",
      animation: "pulse 2s infinite"
    },
    categories: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      background: "white",
      padding: "16px 24px",
      borderRadius: "50px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      marginBottom: "50px",
      position: "relative",
      zIndex: 1,
      animation: "slideInUp 0.6s ease-out"
    },
    category: (isActive, isHovered) => ({
      padding: "10px 18px",
      background: isActive ? "linear-gradient(135deg, #7c4dff 0%, #448aff 100%)" : isHovered ? "rgba(124, 77, 255, 0.1)" : "none",
      border: "none",
      borderRadius: "24px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      color: isActive ? "white" : isHovered ? "#7c4dff" : "#1e293b",
      transition: "all 0.3s ease",
      boxShadow: isActive ? "0 4px 12px rgba(124, 77, 255, 0.3)" : "none",
      transform: isHovered && !isActive ? "translateY(-2px)" : "translateY(0)"
    }),
    searchBox: {
      flex: "1",
      maxWidth: "300px",
      position: "relative",
      marginLeft: "auto"
    },
    searchInput: {
      width: "100%",
      padding: "12px 15px 12px 45px",
      border: "none",
      borderRadius: "24px",
      backgroundColor: "#f2f4f8",
      fontSize: "14px",
      transition: "all 0.3s ease",
      boxShadow: "inset 0 2px 5px rgba(0,0,0,0.05)",
      "&:focus": {
        backgroundColor: "white",
        boxShadow: "0 0 0 2px rgba(124, 77, 255, 0.2), inset 0 2px 5px rgba(0,0,0,0.05)",
        outline: "none"
      }
    },
    searchIcon: {
      position: "absolute",
      left: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#64748b",
      fontSize: "18px"
    },
    featuredPost: {
      display: "flex",
      gap: "40px",
      marginBottom: "60px",
      flexDirection: "row",
      flexWrap: "wrap",
      animation: "fadeIn 1s ease-out"
    },
    featuredImage: {
      flex: "0 0 60%",
      position: "relative",
      minWidth: "300px",
      overflow: "hidden",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 40px rgba(0,0,0,0.15)"
      }
    },
    featuredImg: {
      width: "100%",
      height: "350px",
      objectFit: "cover",
      transition: "transform 0.5s ease",
      "&:hover": {
        transform: "scale(1.03)"
      }
    },
    featuredContent: {
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "100%",
      background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
      padding: "30px 20px 20px",
      color: "white"
    },
    featuredTitle: {
      fontSize: "24px",
      fontWeight: "600",
      marginBottom: "15px",
      lineHeight: "1.3"
    },
    featuredExcerpt: {
      fontSize: "14px",
      opacity: "0.9",
      marginBottom: "20px",
      lineHeight: "1.5"
    },
    featuredNumber: {
      position: "absolute",
      left: "20px",
      top: "20px",
      backgroundColor: "rgba(255,255,255,0.9)",
      padding: "6px 16px",
      borderRadius: "20px",
      fontWeight: "bold",
      fontSize: "14px",
      color: "#1e293b",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      zIndex: 1
    },
    featuredNumberSpan: {
      color: "#7c4dff",
      marginRight: "5px"
    },
    featuredMeta: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "10px"
    },
    metaItem: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "14px"
    },
    postsGrid: {
      flex: "1",
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "30px",
      minWidth: "300px"
    },
    postCard: {
      display: "flex",
      gap: "20px",
      marginBottom: "20px",
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "15px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
      }
    },
    postImage: {
      flex: "0 0 150px",
      height: "100px",
      overflow: "hidden",
      borderRadius: "8px"
    },
    postImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease",
      "&:hover": {
        transform: "scale(1.1)"
      }
    },
    postContent: {
      flex: "1"
    },
    postMeta: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "10px",
      flexWrap: "wrap"
    },
    postNumber: {
      fontWeight: "bold",
      fontSize: "14px",
      color: "#7c4dff"
    },
    postCategory: {
      color: "white",
      fontSize: "12px",
      fontWeight: "500",
      backgroundColor: "#7c4dff",
      padding: "4px 10px",
      borderRadius: "12px",
      textTransform: "capitalize"
    },
    postTime: {
      color: "#64748b",
      fontSize: "12px",
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    postLikes: {
      color: "#64748b",
      fontSize: "12px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      marginLeft: "auto"
    },
    postTitle: {
      fontSize: "18px",
      color: "#1e293b",
      marginBottom: "10px",
      fontWeight: "600",
      transition: "color 0.3s ease",
      "&:hover": {
        color: "#7c4dff"
      }
    },
    button: {
      backgroundColor: "#7c4dff",
      color: "white",
      border: "none",
      borderRadius: "24px",
      padding: "8px 15px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      boxShadow: "0 4px 12px rgba(124, 77, 255, 0.3)",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#6a3aff",
        transform: "translateY(-2px)",
        boxShadow: "0 6px 15px rgba(124, 77, 255, 0.4)"
      }
    }
  };

  // Estilos para animaciones
  const animationStyles = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeInUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideInUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `;

  // Aplicar hover states de manera dinámica
  const applyHoverStyles = (styleObj) => {
    const newStyles = { ...styleObj };
    if (styleObj['&:hover']) {
      Object.assign(newStyles, styleObj['&:hover']);
      delete newStyles['&:hover'];
    }
    return newStyles;
  };

  return (
    <div style={styles.app}>
      {/* Añadir estilos de animación */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

      {/* Header */}
      <header style={styles.header}>
        <div style={{...styles.container, ...styles.navbar}}>
          <a 
            href="#" 
            style={{...styles.logo, ...(hoveredCategory === 'logo' ? applyHoverStyles(styles.logo) : {})}}
            onMouseEnter={() => setHoveredCategory('logo')}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div style={{
              ...styles.logoIcon, 
              transform: hoveredCategory === 'logo' ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
            }}>E</div>
            EducStation
          </a>
          <div style={styles.navLinks}>
            {['Inicio', 'Tendencias', 'Popular', 'Acerca de'].map((link, index) => (
              <a 
                key={index} 
                href="#" 
                style={styles.navLink(index === 0)}
                onMouseEnter={() => {
                  const element = document.getElementById(`navlink-${index}`);
                  if (element) element.style.width = '100%';
                }}
                onMouseLeave={() => {
                  const element = document.getElementById(`navlink-${index}`);
                  if (element && index !== 0) element.style.width = '0%';
                }}
              >
                {link}
                <span 
                  id={`navlink-${index}`} 
                  style={{
                    position: 'absolute',
                    width: index === 0 ? '100%' : '0%',
                    height: '2px',
                    bottom: 0,
                    left: 0,
                    backgroundColor: '#7c4dff',
                    transition: 'width 0.3s ease'
                  }}
                ></span>
              </a>
            ))}
          </div>
          <div 
            style={{...styles.profileIcon, ...(hoveredCategory === 'profile' ? applyHoverStyles(styles.profileIcon) : {})}}
            onMouseEnter={() => setHoveredCategory('profile')}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <img src="/api/placeholder/40/40" alt="Profile" style={styles.profileImg} />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main style={styles.container}>
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <a 
            href="#" 
            style={styles.breadcrumbLink}
            onMouseEnter={(e) => e.target.style.color = '#7c4dff'} 
            onMouseLeave={(e) => e.target.style.color = '#64748b'}
          >Inicio</a> 
          <span style={{color: '#9ca3af', fontSize: '10px'}}>►</span> 
          <span>Blogs y Artículos</span>
        </div>
        
        {/* Hero Section */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Tu Destino para Educación, Innovación y Crecimiento</h1>
          <p style={styles.heroText}>Descubre consejos, tendencias y técnicas para mejorar tu experiencia educativa y desarrollo profesional. Únete a nuestra comunidad de aprendices y educadores comprometidos.</p>
          
          <div 
            style={{...styles.circleLink, ...(hoveredCategory === 'circle' ? applyHoverStyles(styles.circleLink) : {})}}
            onMouseEnter={() => setHoveredCategory('circle')}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div style={{
              ...styles.circleText, 
              animation: 'spin 20s linear infinite',
              transform: hoveredCategory === 'circle' ? 'rotate(-5deg)' : 'rotate(0deg)',
            }}>• Comparte tu historia • Comparte tu idea • Comparte tu visión •</div>
            <div style={{
              ...styles.circleIcon,
              animation: hoveredCategory === 'circle' ? 'pulse 1s infinite' : 'none'
            }}>→</div>
          </div>
        </div>
        
        {/* Categories */}
        <div style={styles.categories}>
          {categories.map(category => (
            <button
              key={category}
              style={{
                ...styles.category(
                  activeCategory === category,
                  hoveredCategory === category
                ),
                ...(hoveredCategory === category && !activeCategory === category
                  ? applyHoverStyles(styles.category(false, true))
                  : {})
              }}
              onClick={() => setActiveCategory(category)}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {category}
            </button>
          ))}
          
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Buscar un artículo..."
              style={{
                ...styles.searchInput,
                ...(searchValue !== '' ? applyHoverStyles(styles.searchInput) : {})
              }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(124, 77, 255, 0.2), inset 0 2px 5px rgba(0,0,0,0.05)'}
              onBlur={(e) => e.target.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.05)'}
            />
          </div>
        </div>
        
        {/* Featured Post and Grid */}
        <div style={styles.featuredPost}>
          {/* Featured Post */}
          <div 
            style={{...styles.featuredImage, ...(hoveredCategory === 'featured' ? applyHoverStyles(styles.featuredImage) : {})}}
            onMouseEnter={() => setHoveredCategory('featured')}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <img
              src={featuredPost.image}
              alt="Featured Post"
              style={{
                ...styles.featuredImg,
                transform: hoveredCategory === 'featured' ? 'scale(1.03)' : 'scale(1)'
              }}
            />
            <div style={styles.featuredNumber}>
              <span style={styles.featuredNumberSpan}>#{featuredPost.number}</span> Destacado
            </div>
            <div style={styles.featuredContent}>
              <div style={styles.featuredMeta}>
                <div style={styles.metaItem}>
                  <span style={{color: '#7c4dff'}}>◆</span> {featuredPost.category}
                </div>
                <div style={styles.metaItem}>
                  <span style={{color: '#9ca3af'}}>⏱</span> {featuredPost.time}
                </div>
              </div>
              <h2 style={styles.featuredTitle}>{featuredPost.title}</h2>
              <p style={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
              <button 
                style={{
                  ...styles.button,
                  ...(hoveredCategory === 'readMore' ? applyHoverStyles(styles.button) : {})
                }}
                onMouseEnter={() => setHoveredCategory('readMore')}
                onMouseLeave={() => setHoveredCategory('featured')}
              >
                Leer más <span>→</span>
              </button>
            </div>
          </div>
          
          {/* Posts Grid */}
          <div style={styles.postsGrid}>
            {posts.map((post, index) => (
              <div 
                key={post.id} 
                style={{
                  ...styles.postCard,
                  ...(hoveredCategory === `post-${index}` ? applyHoverStyles(styles.postCard) : {}),
                  animation: `fadeInUp ${0.3 + index * 0.1}s ease-out`
                }}
                onMouseEnter={() => setHoveredCategory(`post-${index}`)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div style={styles.postImage}>
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{
                      ...styles.postImg,
                      transform: hoveredCategory === `post-${index}` ? 'scale(1.1)' : 'scale(1)'
                    }}
                  />
                </div>
                <div style={styles.postContent}>
                  <div style={styles.postMeta}>
                    <div style={styles.postNumber}>#{post.number}</div>
                    <div style={styles.postCategory}>{post.category}</div>
                    <div style={styles.postTime}>
                      <span style={{fontSize: '10px', marginRight: '2px'}}>⏱</span> {post.time}
                    </div>
                    <div style={styles.postLikes}>
                      <span style={{fontSize: '10px', marginRight: '2px', color: '#ef4444'}}>♥</span> {post.likes}
                    </div>
                  </div>
                  <h3 
                    style={{
                      ...styles.postTitle,
                      color: hoveredCategory === `post-${index}` ? '#7c4dff' : '#1e293b'
                    }}
                  >{post.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EducStation;