import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTheme from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../theme/ThemeToggle';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { darkMode } = useTheme();
  const { isAuth, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Cerrar menús cuando se hace clic fuera de ellos
  React.useEffect(() => {
    const closeMenus = () => {
      setIsMenuOpen(false);
      setIsProfileMenuOpen(false);
    };
    
    document.addEventListener('click', closeMenus);
    
    return () => {
      document.removeEventListener('click', closeMenus);
    };
  }, []);
  
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          EducStation
        </Link>
        
        {/* Botón de menú móvil */}
        <button 
          className="navbar-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <span className="navbar-toggle-icon"></span>
        </button>
        
        {/* Navegación principal */}
        <div className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
          {isAuth ? (
            <>
              <Link to="/" className="navbar-item">Inicio</Link>
              <Link to="/blog" className="navbar-item">Blog</Link>
              <Link to="/categorias" className="navbar-item">Categorías</Link>
              <Link to="/about" className="navbar-item">Acerca de</Link>
              <Link to="/contact" className="navbar-item">Contacto</Link>
              
              {/* Menú de perfil */}
              <div className="navbar-profile" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="navbar-profile-button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <span className="navbar-profile-name">
                    {user?.name || 'Usuario'}
                  </span>
                  <div className="navbar-profile-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name || 'Usuario'} />
                    ) : (
                      <FaUser />
                    )}
                  </div>
                </button>
                
                <div className={`navbar-dropdown ${isProfileMenuOpen ? 'is-active' : ''}`}>
                  <Link to="/profile" className="navbar-dropdown-item">
                    <FaUser className="navbar-dropdown-icon" />
                    <span>Perfil</span>
                  </Link>
                  <Link to="/settings" className="navbar-dropdown-item">
                    <FaCog className="navbar-dropdown-icon" />
                    <span>Ajustes</span>
                  </Link>
                  <button onClick={handleLogout} className="navbar-dropdown-item navbar-dropdown-button">
                    <FaSignOutAlt className="navbar-dropdown-icon" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-item">Iniciar sesión</Link>
              <Link to="/register" className="navbar-item navbar-button">Registrarse</Link>
            </>
          )}
          
          {/* Botón para cambiar tema */}
          <div className="navbar-theme">
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .navbar {
          background-color: var(--color-card);
          box-shadow: var(--shadow-sm);
          padding: var(--spacing-3) 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .navbar-brand {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-primary);
        }
        
        .navbar-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--color-text-primary);
          cursor: pointer;
          padding: var(--spacing-2);
        }
        
        .navbar-toggle-icon {
          display: block;
          width: 25px;
          height: 2px;
          background-color: var(--color-text-primary);
          position: relative;
          transition: background-color var(--transition-fast);
        }
        
        .navbar-toggle-icon::before,
        .navbar-toggle-icon::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          background-color: var(--color-text-primary);
          transition: transform var(--transition-fast);
        }
        
        .navbar-toggle-icon::before {
          top: -8px;
        }
        
        .navbar-toggle-icon::after {
          bottom: -8px;
        }
        
        .navbar-menu {
          display: flex;
          align-items: center;
          gap: var(--spacing-4);
        }
        
        .navbar-item {
          color: var(--color-text-primary);
          text-decoration: none;
          padding: var(--spacing-2);
          border-radius: var(--border-radius-md);
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }
        
        .navbar-item:hover {
          background-color: var(--color-surface);
          color: var(--color-primary);
        }
        
        .navbar-button {
          background-color: var(--color-primary);
          color: white;
          padding: var(--spacing-2) var(--spacing-4);
          border-radius: var(--border-radius-md);
          transition: background-color var(--transition-fast);
        }
        
        .navbar-button:hover {
          background-color: var(--color-primary-light);
          color: white;
        }
        
        .navbar-profile {
          position: relative;
        }
        
        .navbar-profile-button {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          background: transparent;
          border: none;
          color: var(--color-text-primary);
          cursor: pointer;
          padding: var(--spacing-2);
          border-radius: var(--border-radius-md);
          transition: background-color var(--transition-fast);
        }
        
        .navbar-profile-button:hover {
          background-color: var(--color-surface);
        }
        
        .navbar-profile-name {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
        }
        
        .navbar-profile-avatar {
          width: 32px;
          height: 32px;
          background-color: var(--color-primary);
          color: white;
          border-radius: var(--border-radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .navbar-profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .navbar-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: var(--color-card);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-md);
          padding: var(--spacing-1);
          min-width: 200px;
          z-index: 10;
          display: none;
          margin-top: var(--spacing-2);
        }
        
        .navbar-dropdown.is-active {
          display: block;
          animation: fadeInUp var(--transition-fast) ease-out;
        }
        
        .navbar-dropdown-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          color: var(--color-text-primary);
          padding: var(--spacing-2) var(--spacing-3);
          text-decoration: none;
          border-radius: var(--border-radius-sm);
          transition: background-color var(--transition-fast);
        }
        
        .navbar-dropdown-item:hover {
          background-color: var(--color-surface);
        }
        
        .navbar-dropdown-button {
          width: 100%;
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          font-family: var(--font-family);
          font-size: var(--font-size-md);
        }
        
        .navbar-dropdown-icon {
          color: var(--color-text-secondary);
        }
        
        .navbar-theme {
          display: flex;
          align-items: center;
        }
        
        @media (max-width: 768px) {
          .navbar-toggle {
            display: block;
          }
          
          .navbar-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--color-card);
            box-shadow: var(--shadow-md);
            flex-direction: column;
            padding: var(--spacing-4);
            gap: var(--spacing-3);
            display: none;
          }
          
          .navbar-menu.is-active {
            display: flex;
          }
          
          .navbar-item {
            width: 100%;
            text-align: center;
          }
          
          .navbar-profile {
            width: 100%;
          }
          
          .navbar-profile-button {
            width: 100%;
            justify-content: center;
          }
          
          .navbar-dropdown {
            position: static;
            box-shadow: none;
            margin-top: var(--spacing-2);
            width: 100%;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;