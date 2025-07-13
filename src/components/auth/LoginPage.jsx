// src/components/auth/LoginPage.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { colors, spacing, typography } from '../../styles/theme';
import { useAuth } from '../../context/AuthContext.jsx';
import { ThemeContext } from '../../context/ThemeContext';
import '@fortawesome/fontawesome-free/css/all.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuth, loading, error: authError } = useAuth();
    const { setForceLightMode } = useContext(ThemeContext);

    // Refs para las animaciones
    const formRef = useRef(null);
    const titleRef = useRef(null);
    const inputRefs = {
        username: useRef(null),
        password: useRef(null)
    };
    const buttonRef = useRef(null);

    // Forzar el modo claro inmediatamente
    React.useLayoutEffect(() => {
        setForceLightMode(true);
        return () => setForceLightMode(false);
    }, [setForceLightMode]);

    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: '',
        remember: false
    });

    const [errors, setErrors] = useState({
        usernameOrEmail: '',
        password: '',
        general: ''
    });

    // Estado para controlar la visibilidad de la contraseña
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados para animaciones
    const [formActive, setFormActive] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [animationComplete, setAnimationComplete] = useState(false);

    // Iniciar animaciones al cargar el componente
    useEffect(() => {
        // Secuencia de animaciones
        setTimeout(() => setFormActive(true), 300);
        setTimeout(() => setAnimationComplete(true), 1200);

        // Animación de "mecanografía" para el título
        if (titleRef.current) {
            titleRef.current.classList.add('typing-animation');
        }
    }, []);

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuth && !loading) {
            navigate('/');
        }
    }, [isAuth, loading, navigate]);

    // Manejar mensajes de la página anterior
    useEffect(() => {
        if (location.state?.message) {
            setErrors(prev => ({
                ...prev,
                general: location.state.message
            }));
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Actualizar errores cuando cambia el error de autenticación
    useEffect(() => {
        if (authError) {
            setErrors(prev => ({
                ...prev,
                general: authError
            }));
        }
    }, [authError]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Limpiar error al cambiar el valor
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleFocus = (field) => {
        setActiveField(field);
    };

    const handleBlur = () => {
        setActiveField(null);
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { usernameOrEmail: '', password: '', general: '' };

        if (!formData.usernameOrEmail) {
            newErrors.usernameOrEmail = 'El nombre de usuario o correo electrónico es requerido';
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors(prev => ({ ...prev, general: '' }));

        // Añadir animación al botón
        if (buttonRef.current) {
            buttonRef.current.classList.add('button-press');
            setTimeout(() => {
                buttonRef.current?.classList.remove('button-press');
            }, 300);
        }

        try {
            // Enviar el campo usernameOrEmail como username
            await login({
                username: formData.usernameOrEmail, // Enviar este campo como username
                password: formData.password
            });
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setErrors({
                ...errors,
                general: error.message || 'Error al iniciar sesión. Verifica tus credenciales e intenta nuevamente.'
            });

            // Animación de error en el formulario
            if (formRef.current) {
                formRef.current.classList.add('form-error');
                setTimeout(() => {
                    formRef.current?.classList.remove('form-error');
                }, 500);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Modificar responsiveStyles agregando estilos para el contenido de la imagen
    const responsiveStyles = `
  /* Estilos base para móviles - MANTENIENDO COLORES ORIGINALES EXACTOS */
  .login-form-container {
    width: 100%;
    max-width: 1100px;
    display: flex;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(11, 68, 68, 0.25);
    background-color: white;
    height: 600px;
    position: relative;
    z-index: 2;
    animation: fadeInUp 0.8s ease-out;
  }
  
  .login-image-section {
    background-image: url('/assets/images/humanos.jpg');
    background-size: cover;
    background-position: center;
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .login-form-content {
    flex: 1;
    padding: 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
    min-height: 600px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
    backdrop-filter: blur(10px);
  }
  
  /* Estilos para el contenido de la imagen */
  .login-image-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(31, 78, 78, 0.85) 0%, rgba(31, 78, 78, 0.7) 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px;
    color: white;
    animation: fadeIn 1s ease-in-out;
  }
  
  .login-raccoon-logo-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 32px;
    opacity: 0;
    animation: fadeInUp 0.8s ease-out forwards;
    animation-delay: 0.3s;
  }
  
  .login-raccoon-image {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    margin-right: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    transform: rotate(-5deg);
    transition: transform 0.3s ease;
  }
  
  .login-logo-text {
    font-size: 32px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
  
  .login-logo-text2 {
    font-size: 32px;
    font-weight: 700;
    color: #d2b99a;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
  
  .login-image-text {
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 32px;
    opacity: 0;
    animation: fadeInUp 0.8s ease-out forwards;
    animation-delay: 0.6s;
  }
  
  .login-image-quote {
    font-style: italic;
    font-size: 16px;
    position: relative;
    padding: 24px;
    border-left: 3px solid #d2b99a;
    border-radius: 0 8px 8px 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    opacity: 0;
    animation: fadeInUp 0.8s ease-out forwards;
    animation-delay: 0.9s;
  }
  
  .login-input-field {
    width: 100%;
    padding: 16px 24px 16px 50px;
    border-width: 2px;
    border-style: solid;
    border-color: #e5e7eb;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s ease;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    color: #1F4E4E;
  }
  
  .login-input-field:focus {
    border-color: #2C7171;
    background-color: #ffffff;
    box-shadow: 0 5px 15px rgba(44, 113, 113, 0.15);
    outline: none;
    transform: translateY(-2px);
  }
  
  .login-input-field::placeholder {
    color: #91a8a9;
    opacity: 0.7;
  }
  
  .login-input-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #91a8a9;
    font-size: 18px;
    transition: all 0.3s ease;
    z-index: 1;
  }
  
  .login-form-group:focus-within .login-input-icon {
    color: #1F4E4E;
    transform: translateY(-50%) scale(1.1);
  }
  
  .login-password-toggle {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #91a8a9;
    font-size: 20px;
    z-index: 10;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
  
  .login-password-toggle:hover {
    background-color: rgba(145, 168, 169, 0.2);
    transform: translateY(-50%) scale(1.1);
    color: #1F4E4E;
  }
  
  .login-button {
    width: 100%;
    padding: 16px 24px;
    background: linear-gradient(135deg, #1F4E4E 0%, #2C7171 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(31, 78, 78, 0.3);
    min-height: 52px;
  }
  
  .login-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  .login-button:hover::before {
    left: 100%;
  }
  
  .login-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(31, 78, 78, 0.4);
    background: linear-gradient(135deg, #2C7171 0%, #1F4E4E 100%);
  }
  
  .login-remember-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    font-size: 14px;
  }
  
  .login-form-group {
    margin-bottom: 24px;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .login-header h1 {
    color: #1F4E4E;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    position: relative;
    display: inline-block;
    overflow: hidden;
  }
  
  .login-header p {
    color: #91a8a9;
    font-size: 16px;
    margin-bottom: 32px;
    opacity: 0.9;
  }
  
  .login-error-message {
    background: linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.05) 100%);
    color: #dc3545;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    text-align: center;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(220, 53, 69, 0.1);
    border: 1px solid rgba(220, 53, 69, 0.2);
  }
  
  .login-register-link {
    text-align: center;
    margin-top: 32px;
    font-size: 14px;
    color: #91a8a9;
  }

  /* Media queries para responsive - COMPACTO PERO LEGIBLE */
  @media (max-width: 768px) {
    .login-form-container {
      flex-direction: column !important;
      max-width: 96% !important;
      margin: 15px auto !important;
      min-height: auto !important;
      height: auto !important;
    }
    
    .login-image-section {
      min-height: 180px !important;
      border-radius: 16px 16px 0 0 !important;
      flex: none !important;
    }
    
    /* Contenido de la imagen responsive */
    .login-image-overlay {
      padding: 20px !important;
      justify-content: center !important;
    }
    
    .login-raccoon-logo-row {
      margin-bottom: 16px !important;
      justify-content: center !important;
    }
    
    .login-raccoon-image {
      width: 40px !important;
      height: 40px !important;
      margin-right: 12px !important;
    }
    
    .login-logo-text {
      font-size: 20px !important;
    }
    
    .login-logo-text2 {
      font-size: 20px !important;
    }
    
    .login-image-text {
      font-size: 13px !important;
      line-height: 1.4 !important;
      margin-bottom: 16px !important;
      text-align: center !important;
    }
    
    .login-image-quote {
      font-size: 12px !important;
      padding: 12px !important;
      line-height: 1.3 !important;
      text-align: center !important;
    }
    
    .login-form-content {
      padding: 28px 24px !important;
      min-height: auto !important;
      flex: none !important;
    }
    
    .login-header h1 {
      font-size: 26px !important;
      margin-bottom: 6px !important;
    }
    
    .login-header p {
      font-size: 14px !important;
      margin-bottom: 24px !important;
    }
    
    .login-form-group {
      margin-bottom: 18px !important;
    }
    
    .login-input-field {
      padding: 14px 16px 14px 45px !important;
      font-size: 16px !important;
      min-height: 50px !important;
    }
    
    .login-input-icon {
      left: 15px !important;
      font-size: 16px !important;
    }
    
    .login-password-toggle {
      right: 15px !important;
      padding: 10px !important;
    }
    
    .login-button {
      padding: 15px !important;
      font-size: 16px !important;
      min-height: 50px !important;
      margin-top: 8px !important;
      margin-bottom: 12px !important;
    }
    
    .login-remember-row {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 12px !important;
      margin-bottom: 20px !important;
    }
    
    .login-remember-checkbox {
      order: 1;
    }
    
    .login-forgot-link {
      order: 2;
      font-size: 14px !important;
    }
    
    .login-register-link {
      font-size: 14px !important;
      margin-top: 18px !important;
      text-align: center !important;
    }
    
    .login-background-elements {
      display: none !important;
    }
    
    .login-error-message {
      padding: 12px 16px !important;
      font-size: 14px !important;
      margin-bottom: 18px !important;
    }
  }
  
  @media (max-width: 480px) {
    .login-form-container {
      max-width: 98% !important;
      margin: 8px auto !important;
    }
    
    .login-image-section {
      min-height: 160px !important;
    }
    
    /* Contenido imagen más compacto */
    .login-image-overlay {
      padding: 16px !important;
    }
    
    .login-raccoon-logo-row {
      margin-bottom: 12px !important;
    }
    
    .login-raccoon-image {
      width: 32px !important;
      height: 32px !important;
      margin-right: 8px !important;
    }
    
    .login-logo-text {
      font-size: 18px !important;
    }
    
    .login-logo-text2 {
      font-size: 18px !important;
    }
    
    .login-image-text {
      font-size: 12px !important;
      margin-bottom: 12px !important;
    }
    
    .login-image-quote {
      font-size: 11px !important;
      padding: 10px !important;
    }
    
    .login-form-content {
      padding: 24px 20px !important;
    }
    
    .login-header h1 {
      font-size: 24px !important;
      margin-bottom: 5px !important;
    }
    
    .login-header p {
      font-size: 13px !important;
      margin-bottom: 20px !important;
    }
    
    .login-form-group {
      margin-bottom: 16px !important;
    }
    
    .login-input-field {
      padding: 13px 14px 13px 42px !important;
      font-size: 16px !important;
      min-height: 48px !important;
    }
    
    .login-input-icon {
      left: 14px !important;
      font-size: 15px !important;
    }
    
    .login-password-toggle {
      right: 12px !important;
      padding: 8px !important;
    }
    
    .login-button {
      padding: 14px !important;
      font-size: 15px !important;
      min-height: 48px !important;
      margin-bottom: 10px !important;
    }
    
    .login-remember-row {
      gap: 10px !important;
      margin-bottom: 18px !important;
    }
    
    .login-forgot-link {
      font-size: 13px !important;
    }
    
    .login-register-link {
      font-size: 13px !important;
      margin-top: 16px !important;
    }
    
    .login-error-message {
      margin-bottom: 16px !important;
    }
  }
  
  @media (max-width: 360px) {
    .login-form-container {
      max-width: 100% !important;
      margin: 5px auto !important;
      border-radius: 12px !important;
    }
    
    .login-image-section {
      min-height: 140px !important;
    }
    
    /* Imagen súper compacta */
    .login-image-overlay {
      padding: 12px !important;
    }
    
    .login-raccoon-logo-row {
      margin-bottom: 8px !important;
    }
    
    .login-raccoon-image {
      width: 28px !important;
      height: 28px !important;
      margin-right: 6px !important;
    }
    
    .login-logo-text {
      font-size: 16px !important;
    }
    
    .login-logo-text2 {
      font-size: 16px !important;
    }
    
    .login-image-text {
      font-size: 10px !important;
      margin-bottom: 8px !important;
      line-height: 1.2 !important;
    }
    
    .login-image-quote {
      font-size: 9px !important;
      padding: 8px !important;
      line-height: 1.2 !important;
    }
    
    .login-form-content {
      padding: 20px 16px !important;
    }
    
    .login-header h1 {
      font-size: 22px !important;
      margin-bottom: 4px !important;
    }
    
    .login-header p {
      font-size: 12px !important;
      margin-bottom: 18px !important;
    }
    
    .login-form-group {
      margin-bottom: 14px !important;
    }
    
    .login-input-field {
      padding: 12px 12px 12px 40px !important;
      min-height: 46px !important;
    }
    
    .login-input-icon {
      left: 12px !important;
    }
    
    .login-password-toggle {
      right: 10px !important;
    }
    
    .login-button {
      min-height: 46px !important;
      padding: 13px !important;
    }
    
    .login-remember-row {
      margin-bottom: 16px !important;
    }
    
    .login-register-link {
      margin-top: 14px !important;
    }
  }
`;

    // Corregir el estilo del checkmark para evitar conflictos de border
    const styles = {
        loginContainer: {
            minHeight: '100vh',
            backgroundImage: 'linear-gradient(135deg, #93ABA3 0%, #1F4E4E 100%)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
        },
        backgroundElements: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.08,
            pointerEvents: 'none',
        },
        mainContent: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `${spacing.xl} ${spacing.md}`,
            position: 'relative',
            zIndex: 1,
        },
        imageOverlay: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(31, 78, 78, 0.85) 0%, rgba(31, 78, 78, 0.7) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: spacing.xl,
            color: colors.white,
            animation: 'fadeIn 1s ease-in-out',
        },
        raccoonLogoRow: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: spacing.xl,
            opacity: 0,
            animation: 'fadeInUp 0.8s ease-out forwards',
            animationDelay: '0.3s',
        },
        raccoonImage: {
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            marginRight: spacing.md,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
            transform: 'rotate(-5deg)',
            transition: 'transform 0.3s ease',
        },
        logoText: {
            fontSize: '32px',
            fontWeight: typography.fontWeight.bold,
            color: '#ffffff',
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
        },
        logoText2: {
            fontSize: '32px',
            fontWeight: typography.fontWeight.bold,
            color: '#d2b99a',
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
        },
        imageText: {
            fontSize: typography.fontSize.lg,
            lineHeight: 1.6,
            marginBottom: spacing.xl,
            opacity: 0,
            animation: 'fadeInUp 0.8s ease-out forwards',
            animationDelay: '0.6s',
        },
        imageQuote: {
            fontStyle: 'italic',
            fontSize: typography.fontSize.md,
            position: 'relative',
            padding: spacing.lg,
            borderLeft: `3px solid ${colors.secondary}`,
            borderRadius: '0 8px 8px 0',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            opacity: 0,
            animation: 'fadeInUp 0.8s ease-out forwards',
            animationDelay: '0.9s',
        },
        inputWrapper: {
            position: 'relative',
            width: '100%',
        },
        passwordWrapper: {
            position: 'relative',
            width: '100%',
        },
        label: {
            display: 'block',
            marginBottom: spacing.xs,
            color: '#1F4E4E',
            fontWeight: typography.fontWeight.medium,
            fontSize: typography.fontSize.sm,
            transition: 'all 0.3s ease',
            opacity: 0.9,
        },
        errorText: {
            color: colors.error,
            fontSize: typography.fontSize.xs,
            marginTop: spacing.xs,
            display: 'flex',
            alignItems: 'center',
        },
        errorIcon: {
            marginRight: spacing.xs,
            fontSize: '12px',
        },
        checkmark: {
            position: 'relative',
            height: '20px',
            width: '20px',
            borderRadius: '4px',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: '#91a8a9',
            marginRight: spacing.xs,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
        },
        activeCheckmark: {
            backgroundColor: '#1F4E4E',
            borderColor: '#1F4E4E',
        },
        checkmarkIcon: {
            color: '#ffffff',
            fontSize: '12px',
            opacity: 0,
            transition: 'opacity 0.2s ease',
        },
        activeCheckmarkIcon: {
            opacity: 1,
        },
        hiddenCheckbox: {
            display: 'none',
        },
        rememberText: {
            color: colors.primaryLight,
        },
        rememberLabel: {
            display: 'flex',
            alignItems: 'center',
            color: colors.primaryLight,
            cursor: 'pointer',
        },
        forgotLink: {
            color: '#1F4E4E',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            position: 'relative',
            paddingBottom: '2px',
        },
        registerPrompt: {
            color: colors.primaryLight,
        },
        registerLink: {
            color: '#1F4E4E',
            fontWeight: typography.fontWeight.semiBold,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            position: 'relative',
            paddingBottom: '2px',
        },
        loadingContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
        },
        spinner: {
            width: '20px',
            height: '20px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
        },
        buttonIcon: {
            marginRight: spacing.xs,
            fontSize: '16px',
        },
        disabledButton: {
            opacity: 0.7,
            cursor: 'not-allowed',
        },
        // Mantener solo estilos de background que no entran en conflicto
        circle1: {
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            top: '-100px',
            right: '-100px',
            opacity: '0.1',
            animation: 'float 15s infinite ease-in-out',
        },
        circle2: {
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            backgroundColor: '#d2b99a',
            bottom: '-50px',
            left: '10%',
            opacity: '0.1',
            animation: 'float 18s infinite ease-in-out reverse',
        },
        circle3: {
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: '#91a8a9',
            top: '20%',
            left: '-50px',
            opacity: '0.1',
            animation: 'float 20s infinite ease-in-out',
        },
        backgroundParticles: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            opacity: 0.4,
            pointerEvents: 'none',
        },
        particle: {
            position: 'absolute',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            opacity: 0.2,
            animation: 'float 15s infinite linear',
        },
    };

    // Crear partículas para el fondo
    const renderParticles = () => {
        const particles = [];
        const colors = ['#1F4E4E', '#91a8a9', '#d2b99a', '#ffffff'];

        for (let i = 0; i < 30; i++) {
            const size = Math.random() * 6 + 4;
            const style = {
                ...styles.particle,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 20 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
            };
            particles.push(<div key={i} style={style} />);
        }

        return particles;
    };

    return (
        <div style={styles.loginContainer}>
            <style>{`
          ${responsiveStyles}
          
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
          
          @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
            }
            25% {
                transform: translateY(-20px) translateX(10px);
            }
            50% {
                transform: translateY(0) translateX(20px);
            }
            75% {
                transform: translateY(20px) translateX(10px);
            }
            100% {
                transform: translateY(0) translateX(0);
            }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(44, 113, 113, 0.7);
            }
            70% {
                transform: scale(1.05);
                box-shadow: 0 0 0 10px rgba(44, 113, 113, 0);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(44, 113, 113, 0);
            }
          }
          
          @keyframes shakeX {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          .input-animation:focus {
            transform: translateY(-2px);
          }
          
          .link-hover-effect {
            position: relative;
          }
          
          .link-hover-effect::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: #2C7171;
            transition: width 0.3s ease;
          }
          
          .link-hover-effect:hover::after {
            width: 100%;
          }
          
          .pulse-animation {
            animation: pulse 2s infinite;
          }
          
          .form-error {
            animation: shakeX 0.5s;
          }
        `}</style>
        
        {/* Background Elements */}
        <div style={styles.backgroundElements} className="login-background-elements">
            <div style={styles.circle1}></div>
            <div style={styles.circle2}></div>
            <div style={styles.circle3}></div>
            <div style={styles.backgroundParticles}>
                {renderParticles()}
            </div>
        </div>

        <main style={styles.mainContent}>
            <div
                ref={formRef}
                className="login-form-container"
            >
                <div className="login-image-section">
                    <div className="login-image-overlay">
                        <div className="login-raccoon-logo-row">
                            <img
                                src="/assets/images/educstation-logo.png"
                                alt="logo"
                                className="login-raccoon-image pulse-animation"
                            />
                            <span className="login-logo-text">Educ</span>
                            <span className="login-logo-text2">Station</span>
                        </div>
                        <p className="login-image-text">
                            Tu destino para educación, innovación y crecimiento profesional.
                            Conecta con nuestra comunidad de educadores y estudiantes comprometidos.
                        </p>
                        <div className="login-image-quote">
                            "La educación es el arma más poderosa que puedes usar para cambiar el mundo." - Nelson Mandela
                        </div>
                    </div>
                </div>

                <div className="login-form-content">
                    <div className="login-header">
                        <h1 ref={titleRef}>
                            ¡Bienvenido de nuevo!
                        </h1>
                        <p>
                            Ingresa tus credenciales para acceder a tu cuenta
                        </p>
                    </div>

                    {errors.general && (
                        <div className="login-error-message">
                            <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="login-form-group">
                            <label style={styles.label}>
                                Usuario o Correo Electrónico
                            </label>
                            <div style={styles.inputWrapper}>
                                <i className="fas fa-user login-input-icon"></i>
                                <input
                                    ref={inputRefs.username}
                                    type="text"
                                    name="usernameOrEmail"
                                    value={formData.usernameOrEmail}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('usernameOrEmail')}
                                    onBlur={handleBlur}
                                    className="login-input-field"
                                    placeholder="Introduce tu usuario o correo"
                                    required
                                />
                            </div>
                            {errors.usernameOrEmail && (
                                <div style={styles.errorText}>
                                    <i className="fas fa-exclamation-circle" style={styles.errorIcon}></i>
                                    {errors.usernameOrEmail}
                                </div>
                            )}
                        </div>

                        <div className="login-form-group">
                            <label style={styles.label}>
                                Contraseña
                            </label>
                            <div style={styles.passwordWrapper}>
                                <i className="fas fa-lock login-input-icon"></i>
                                <input
                                    ref={inputRefs.password}
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('password')}
                                    onBlur={handleBlur}
                                    className="login-input-field"
                                    placeholder="Introduce tu contraseña"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="login-password-toggle"
                                >
                                    <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                                </button>
                            </div>
                            {errors.password && (
                                <div style={styles.errorText}>
                                    <i className="fas fa-exclamation-circle" style={styles.errorIcon}></i>
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <div className="login-remember-row">
                            <label style={styles.rememberLabel} className="login-remember-checkbox">
                                <div style={{
                                    ...styles.checkmark,
                                    ...(formData.remember ? styles.activeCheckmark : {})
                                }}>
                                    <i
                                        className="fas fa-check"
                                        style={{
                                            ...styles.checkmarkIcon,
                                            ...(formData.remember ? styles.activeCheckmarkIcon : {})
                                        }}
                                    ></i>
                                </div>
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    style={styles.hiddenCheckbox}
                                />
                                <span style={styles.rememberText}>Recordarme</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                style={styles.forgotLink}
                                className="link-hover-effect login-forgot-link"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button
                            ref={buttonRef}
                            type="submit"
                            disabled={isSubmitting}
                            className="login-button"
                            style={isSubmitting ? styles.disabledButton : {}}
                        >
                            {isSubmitting ? (
                                <div style={styles.loadingContainer}>
                                    <div style={styles.spinner}></div>
                                    <span>Iniciando sesión...</span>
                                </div>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt" style={styles.buttonIcon}></i>
                                    Iniciar Sesión
                                </>
                            )}
                        </button>

                        <div className="login-register-link">
                            ¿No tienes una cuenta?{' '}
                            <Link to="/register" style={styles.registerLink} className="link-hover-effect">
                                Regístrate aquí
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
);
};

export default LoginPage;