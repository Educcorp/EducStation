// src/components/auth/LoginPage.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { colors, spacing, typography } from '../../styles/theme';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import '@fortawesome/fontawesome-free/css/all.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuth, loading, error: authError } = useContext(AuthContext);
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
            await login({
                username: formData.usernameOrEmail,
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
        mainContent: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `${spacing.xl} ${spacing.md}`,
            position: 'relative',
            zIndex: 1,
        },
        formContainer: {
            width: "100%",
            maxWidth: "1100px",
            display: "flex",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: '0 25px 50px rgba(11, 68, 68, 0.25)',
            backgroundColor: colors.white,
            opacity: formActive ? 1 : 0,
            transform: formActive ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        },
        loginImage: {
            backgroundImage: "url('/assets/images/humanos.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            '@media (max-width: 768px)': {
                display: 'none'
            }
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
            '&:hover': {
                transform: 'rotate(0deg) scale(1.05)',
            },
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
        formContent: {
            flex: 1,
            padding: spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
        },
        formContentInner: {
            opacity: animationComplete ? 1 : 0,
            transform: animationComplete ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease-out',
        },
        loginHeader: {
            marginBottom: spacing.xl,
        },
        loginTitle: {
            color: '#1F4E4E',
            fontSize: typography.fontSize.xxl,
            marginBottom: spacing.sm,
            position: 'relative',
            display: 'inline-block',
            overflow: 'hidden',
        },
        loginSubtitle: {
            color: colors.primaryLight,
            fontSize: typography.fontSize.md,
            opacity: 0,
            animation: 'fadeInUp 0.6s ease-out forwards',
            animationDelay: '1.2s',
        },
        formGroup: {
            marginBottom: spacing.lg,
            position: 'relative',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)',
        },
        activeFormGroup: {
            transform: 'translateY(-5px)',
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
        activeLabel: {
            color: '#2C7171',
            opacity: 1,
            transform: 'translateY(-2px)',
        },
        inputIcon: {
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#91a8a9',
            fontSize: '18px',
            transition: 'all 0.3s ease',
            zIndex: 1,
        },
        activeInputIcon: {
            color: '#1F4E4E',
            transform: 'translateY(-50%) scale(1.1)',
        },
        input: {
            width: '100%',
            padding: `${spacing.md} ${spacing.lg}`,
            paddingLeft: '45px',
            border: `2px solid ${colors.gray200}`,
            borderRadius: '12px',
            fontSize: typography.fontSize.md,
            transition: 'all 0.3s ease',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
        activeInput: {
            border: '2px solid #2C7171',
            backgroundColor: '#ffffff',
            boxShadow: '0 5px 15px rgba(44, 113, 113, 0.15)',
        },
        passwordInput: {
            width: '100%',
            padding: `${spacing.md} ${spacing.lg}`,
            paddingLeft: '45px',
            paddingRight: '45px',
            border: `2px solid ${colors.gray200}`,
            borderRadius: '12px',
            fontSize: typography.fontSize.md,
            transition: 'all 0.3s ease',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
        activePasswordInput: {
            border: '2px solid #2C7171',
            backgroundColor: '#ffffff',
            boxShadow: '0 5px 15px rgba(44, 113, 113, 0.15)',
        },
        passwordWrapper: {
            position: 'relative',
            width: '100%',
        },
        eyeIcon: {
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: colors.primaryLight,
            fontSize: '20px',
            zIndex: 10,
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
        },
        activeEyeIcon: {
            color: '#1F4E4E',
            backgroundColor: 'rgba(44, 113, 113, 0.1)',
        },
        errorText: {
            color: colors.error,
            fontSize: typography.fontSize.xs,
            marginTop: spacing.xs,
            display: 'flex',
            alignItems: 'center',
            animation: 'shakeX 0.5s',
        },
        errorIcon: {
            marginRight: spacing.xs,
            fontSize: '12px',
        },
        rememberForgot: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.lg,
            fontSize: typography.fontSize.sm,
            opacity: 0,
            animation: 'fadeIn 0.6s ease-out forwards',
            animationDelay: '1.3s',
        },
        checkbox: {
            display: 'flex',
            alignItems: 'center',
            color: colors.primaryLight,
            cursor: 'pointer',
        },
        checkboxInput: {
            marginRight: spacing.xs,
            accentColor: '#1F4E4E',
            height: '16px',
            width: '16px',
            cursor: 'pointer',
        },
        checkmark: {
            position: 'relative',
            height: '20px',
            width: '20px',
            borderRadius: '4px',
            border: `2px solid #91a8a9`,
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
        forgotLink: {
            color: '#1F4E4E',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            position: 'relative',
            paddingBottom: '2px',
        },
        forgotLinkAfter: {
            content: '""',
            position: 'absolute',
            width: '0',
            height: '2px',
            bottom: '0',
            left: '0',
            backgroundColor: '#2C7171',
            transition: 'width 0.3s ease',
        },
        loginButton: {
            width: '100%',
            padding: `${spacing.md} ${spacing.lg}`,
            backgroundColor: '#1F4E4E',
            color: colors.white,
            border: 'none',
            borderRadius: '12px',
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semiBold,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: spacing.md,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(31, 78, 78, 0.3)',
            opacity: 0,
            animation: 'fadeInUp 0.5s ease-out forwards',
            animationDelay: '1.4s',
        },
        buttonRipple: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: '0',
            left: '0',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            transform: 'scale(0)',
            opacity: '0',
            transition: 'all 0.5s ease-out',
        },
        registerLink: {
            textAlign: 'center',
            marginTop: spacing.xl,
            fontSize: typography.fontSize.sm,
            color: colors.primaryLight,
            opacity: 0,
            animation: 'fadeIn 0.6s ease-out forwards',
            animationDelay: '1.5s',
        },
        registerLinkText: {
            color: '#1F4E4E',
            fontWeight: typography.fontWeight.semiBold,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            position: 'relative',
            paddingBottom: '2px',
        },
        registerLinkAfter: {
            content: '""',
            position: 'absolute',
            width: '0',
            height: '2px',
            bottom: '0',
            left: '0',
            backgroundColor: '#2C7171',
            transition: 'width 0.3s ease',
        },
        generalError: {
            backgroundColor: `rgba(220, 53, 69, 0.1)`,
            color: colors.error,
            padding: spacing.md,
            borderRadius: '8px',
            marginBottom: spacing.lg,
            textAlign: 'center',
            fontSize: typography.fontSize.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'shakeX 0.5s',
            boxShadow: '0 4px 10px rgba(220, 53, 69, 0.1)',
            border: '1px solid rgba(220, 53, 69, 0.2)',
        },
        errorAlertIcon: {
            fontSize: '18px',
            marginRight: spacing.sm,
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
        forgotPasswordContainer: {
            marginTop: spacing.xs,
            textAlign: 'right',
        },
        forgotPasswordLink: {
            color: colors.primaryLight,
            fontSize: typography.fontSize.sm,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
        },
        forgotPasswordWrapper: {
            textAlign: 'center',
            margin: `${spacing.md} 0`,
            padding: `${spacing.sm} ${spacing.md}`,
            borderRadius: '8px',
            backgroundColor: 'rgba(210, 185, 154, 0.15)',
            border: '1px dashed rgba(11, 68, 68, 0.2)',
            transition: 'all 0.3s ease',
            animation: 'pulseAttention 2s infinite',
        },
        forgotPasswordLinkProminent: {
            color: colors.primary,
            fontSize: typography.fontSize.md,
            textDecoration: 'none',
            fontWeight: typography.fontWeight.semiBold,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: '8px',
            width: '100%',
        },
        forgotPasswordIcon: {
            marginRight: spacing.xs,
            fontSize: '16px',
            color: colors.secondary,
        },
    };

    // Estilos para bordes de inputs con error
    const getInputStyle = (fieldName) => ({
        ...styles.input,
        ...(activeField === fieldName ? styles.activeInput : {}),
        borderColor: errors[fieldName] ? colors.error : activeField === fieldName ? '#2C7171' : colors.gray200,
        boxShadow: errors[fieldName] 
            ? '0 4px 10px rgba(220, 53, 69, 0.1)' 
            : activeField === fieldName 
                ? '0 5px 15px rgba(44, 113, 113, 0.15)' 
                : '0 2px 4px rgba(0, 0, 0, 0.05)',
    });

    const getPasswordInputStyle = () => ({
        ...styles.passwordInput,
        ...(activeField === 'password' ? styles.activePasswordInput : {}),
        borderColor: errors.password ? colors.error : activeField === 'password' ? '#2C7171' : colors.gray200,
        boxShadow: errors.password 
            ? '0 4px 10px rgba(220, 53, 69, 0.1)' 
            : activeField === 'password' 
                ? '0 5px 15px rgba(44, 113, 113, 0.15)' 
                : '0 2px 4px rgba(0, 0, 0, 0.05)',
    });

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
            {/* Background Elements */}
            <div style={styles.backgroundElements}>
                <div style={styles.circle1}></div>
                <div style={styles.circle2}></div>
                <div style={styles.circle3}></div>
                <div style={styles.backgroundParticles}>
                    {renderParticles()}
                </div>
            </div>

            <main style={styles.mainContent}>
                <div 
                    style={styles.formContainer}
                    ref={formRef}
                    className="login-form-container"
                >
                    <div style={styles.loginImage}>
                        <div style={styles.imageOverlay}>
                            <div style={styles.raccoonLogoRow}>
                                <img 
                                    src="/assets/images/educstation-logo.png" 
                                    alt="logo" 
                                    style={styles.raccoonImage}
                                    className="pulse-animation"
                                />
                                <span style={styles.logoText}>Educ</span>
                                <span style={styles.logoText2}>Station</span>
                            </div>
                            <p style={styles.imageText}>
                                Tu destino para educación, innovación y crecimiento profesional.
                                Conecta con nuestra comunidad de educadores y estudiantes comprometidos.
                            </p>
                            <div style={styles.imageQuote}>
                                "La educación es el arma más poderosa que puedes usar para cambiar el mundo." - Nelson Mandela
                            </div>
                        </div>
                    </div>

                    <div style={styles.formContent}>
                        <div style={styles.formContentInner}>
                            <div style={styles.loginHeader}>
                                <h1 
                                    style={styles.loginTitle}
                                    ref={titleRef}
                                    className="welcome-text"
                                >
                                    ¡Bienvenido de nuevo!
                                </h1>
                                <p style={styles.loginSubtitle}>
                                    Ingresa tus credenciales para acceder a tu cuenta
                                </p>
                            </div>

                            {errors.general && (
                                <div style={styles.generalError}>
                                    <i className="fas fa-exclamation-circle" style={styles.errorAlertIcon}></i>
                                    {errors.general}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div 
                                    style={{
                                        ...styles.formGroup,
                                        ...(activeField === 'usernameOrEmail' ? styles.activeFormGroup : {})
                                    }}
                                    className="form-group-animation"
                                >
                                    <label 
                                        style={{
                                            ...styles.label,
                                            ...(activeField === 'usernameOrEmail' ? styles.activeLabel : {})
                                        }} 
                                        htmlFor="usernameOrEmail"
                                    >
                                        Nombre de usuario o correo electrónico
                                    </label>
                                    <div style={{position: 'relative'}}>
                                        <i 
                                            className="fas fa-user" 
                                            style={{
                                                ...styles.inputIcon,
                                                ...(activeField === 'usernameOrEmail' ? styles.activeInputIcon : {})
                                            }}
                                        ></i>
                                        <input
                                            type="text"
                                            id="usernameOrEmail"
                                            name="usernameOrEmail"
                                            ref={inputRefs.username}
                                            value={formData.usernameOrEmail}
                                            onChange={handleChange}
                                            onFocus={() => handleFocus('usernameOrEmail')}
                                            onBlur={handleBlur}
                                            placeholder="usuario123 o correo@ejemplo.com"
                                            style={getInputStyle('usernameOrEmail')}
                                            className="input-animation"
                                        />
                                    </div>
                                    {errors.usernameOrEmail && (
                                        <div style={styles.errorText}>
                                            <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
                                            {errors.usernameOrEmail}
                                        </div>
                                    )}
                                </div>

                                <div 
                                    style={{
                                        ...styles.formGroup,
                                        ...(activeField === 'password' ? styles.activeFormGroup : {})
                                    }}
                                    className="form-group-animation"
                                >
                                    <label 
                                        style={{
                                            ...styles.label,
                                            ...(activeField === 'password' ? styles.activeLabel : {})
                                        }} 
                                        htmlFor="password"
                                    >
                                        Contraseña
                                    </label>
                                    <div style={styles.passwordWrapper}>
                                        <i 
                                            className="fas fa-lock" 
                                            style={{
                                                ...styles.inputIcon,
                                                ...(activeField === 'password' ? styles.activeInputIcon : {})
                                            }}
                                        ></i>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            ref={inputRefs.password}
                                            value={formData.password}
                                            onChange={handleChange}
                                            onFocus={() => handleFocus('password')}
                                            onBlur={handleBlur}
                                            placeholder="Ingresa tu contraseña"
                                            style={getPasswordInputStyle()}
                                            className="input-animation"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            style={styles.eyeIcon}
                                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <div style={styles.errorText}>
                                            <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                <div style={styles.rememberForgot}>
                                    <label style={styles.checkbox}>
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            name="remember"
                                            checked={formData.remember}
                                            onChange={handleChange}
                                            style={{display: 'none'}}
                                        />
                                        <div 
                                            style={{
                                                ...styles.checkmark,
                                                ...(formData.remember ? styles.activeCheckmark : {})
                                            }}
                                            onClick={() => setFormData({...formData, remember: !formData.remember})}
                                        >
                                            <i 
                                                className="fas fa-check" 
                                                style={{
                                                    ...styles.checkmarkIcon,
                                                    ...(formData.remember ? styles.activeCheckmarkIcon : {})
                                                }}
                                            ></i>
                                        </div>
                                        Recordar sesión
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    style={styles.loginButton}
                                    ref={buttonRef}
                                    disabled={isSubmitting}
                                    className="login-button-animation"
                                >
                                    <span style={styles.buttonRipple}></span>
                                    {isSubmitting ? (
                                        <>
                                            <i className="fas fa-circle-notch fa-spin" style={{marginRight: '10px'}}></i>
                                            Iniciando sesión...
                                        </>
                                    ) : 'Iniciar Sesión'}
                                </button>

                                <div style={styles.forgotPasswordWrapper}>
                                    <Link to="/forgot-password" style={styles.forgotPasswordLinkProminent}>
                                        <i className="fas fa-key" style={styles.forgotPasswordIcon}></i> ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>

                                <div style={styles.registerLink}>
                                    ¿No tienes una cuenta?
                                    <Link 
                                        to="/register"
                                        style={styles.registerLinkText}
                                        className="link-hover-effect"
                                    > Regístrate ahora
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx="true">{`
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
                
                @keyframes pulseAttention {
                    0% {
                        box-shadow: 0 0 0 0 rgba(210, 185, 154, 0.3);
                        transform: scale(1);
                    }
                    50% {
                        box-shadow: 0 0 0 5px rgba(210, 185, 154, 0);
                        transform: scale(1.02);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(210, 185, 154, 0);
                        transform: scale(1);
                    }
                }
                
                @keyframes shakeX {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                @keyframes typing {
                    from { width: 150% }
                    to { width: 0% }
                }
                
                .typing-animation::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    height: 100%;
                    width: 100%;
                    background-color: white;
                    border-left: 2px solid #1F4E4E;
                    animation: typing 1.5s steps(30) forwards;
                }
                
                .welcome-text {
                    position: relative;
                    display: inline-block;
                }
                
                .form-group-animation {
                    animation: fadeInUp 0.5s ease-out forwards;
                    opacity: 0;
                }
                
                .form-group-animation:nth-child(1) {
                    animation-delay: 0.9s;
                }
                
                .form-group-animation:nth-child(2) {
                    animation-delay: 1.1s;
                }
                
                .pulse-animation {
                    animation: pulse 2s infinite;
                }
                
                .login-button-animation:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(31, 78, 78, 0.4);
                    background-color: #2C7171;
                }
                
                .login-button-animation:active {
                    transform: translateY(0);
                    box-shadow: 0 4px 15px rgba(31, 78, 78, 0.3);
                }
                
                .button-press {
                    animation: buttonPress 0.3s forwards;
                }
                
                @keyframes buttonPress {
                    0% { transform: scale(1); }
                    50% { transform: scale(0.95); }
                    100% { transform: scale(1); }
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
                
                .input-animation:focus {
                    transform: translateY(-2px);
                }
                
                .eye-icon-animation:hover {
                    background-color: rgba(44, 113, 113, 0.2);
                    transform: translateY(-50%) scale(1.1);
                }
                
                .form-error {
                    animation: shakeX 0.5s;
                }
                
                @media (max-width: 768px) {
                    .form-container {
                        max-width: 90%;
                    }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;