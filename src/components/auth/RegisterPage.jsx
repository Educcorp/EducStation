// src/components/auth/RegisterPage.jsx - Completamente Renovado
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkUsernameAvailability } from '../../services/authService';
import { colors, spacing, typography } from '../../styles/theme';
import '@fortawesome/fontawesome-free/css/all.css';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

// Constante para habilitar el modo desarrollo (registro sin backend)
const DEV_MODE = process.env.NODE_ENV === 'development';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, isAuth, loading } = useContext(AuthContext);
    const { setForceLightMode } = useContext(ThemeContext);

    // Estado para modo desarrollo
    const [devModeEnabled, setDevModeEnabled] = useState(false);

    // Refs para las animaciones
    const formRef = useRef(null);
    const titleRef = useRef(null);
    const inputRefs = {
        firstName: useRef(null),
        lastName: useRef(null),
        username: useRef(null),
        email: useRef(null),
        password: useRef(null),
        confirmPassword: useRef(null)
    };
    const buttonRef = useRef(null);

    // Estados para animaciones
    const [formActive, setFormActive] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [animationComplete, setAnimationComplete] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: '',
        general: '',
        devMode: false
    });

    // Estados para controlar la visibilidad de las contraseñas
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Estado para controlar la validación del username
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Forzar el modo claro inmediatamente
    React.useLayoutEffect(() => {
        setForceLightMode(true);
        return () => setForceLightMode(false);
    }, [setForceLightMode]);

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuth && !loading) {
            navigate('/');
        }
    }, [isAuth, loading, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Convertir username a minúsculas automáticamente
        const processedValue = name === 'username' ? value.toLowerCase() : value;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : processedValue
        }));

        // Limpiar error al cambiar el valor
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Validar username en tiempo real
        if (name === 'username') {
            validateUsername(processedValue);
        }
    };

    const handleFocus = (field) => {
        setActiveField(field);
    };

    const handleBlur = () => {
        setActiveField(null);
    };

    // Funciones para alternar la visibilidad de las contraseñas
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Función para validar el formato del username
    const validateUsernameFormat = (username) => {
        const usernameRegex = /^[a-z0-9._]+$/;
        return usernameRegex.test(username);
    };

    // Función para verificar disponibilidad del username
    const validateUsername = async (username) => {
        if (!username) {
            setErrors(prev => ({ ...prev, username: 'El nombre de usuario es requerido' }));
            setUsernameAvailable(null);
            return;
        }

        if (!validateUsernameFormat(username)) {
            setErrors(prev => ({
                ...prev,
                username: 'Solo se permiten letras minúsculas, números, punto y guion bajo'
            }));
            setUsernameAvailable(null);
            return;
        }

        setIsCheckingUsername(true);
        try {
            console.log('Iniciando verificación para:', username);

            // Si el modo desarrollo está activado, asumimos que el username está disponible
            if (devModeEnabled) {
                console.log('Modo desarrollo activado - asumiendo username disponible');
                setUsernameAvailable(true);
                setErrors(prev => ({ ...prev, username: '' }));
                setIsCheckingUsername(false);
                return;
            }

            // Validación temporal - REMOVER EN PRODUCCIÓN
            // Esta es una solución temporal hasta que se arregle el backend
            const bypassValidation = localStorage.getItem('bypassUsernameValidation') === 'true';
            if (bypassValidation) {
                console.log('Bypass de validación activado - asumiendo username disponible');
                setUsernameAvailable(true);
                setErrors(prev => ({ ...prev, username: '' }));
                setIsCheckingUsername(false);
                return;
            }

            await checkUsernameAvailability(username);
            console.log('Username disponible:', username);
            setUsernameAvailable(true);
            setErrors(prev => ({ ...prev, username: '' }));
        } catch (error) {
            console.error('Error en validación de username:', error.message);

            // Si el error indica que el usuario ya existe
            if (error.message && (
                error.message.includes('ya está en uso') ||
                error.message.includes('ya existe')
            )) {
                console.log('Username no disponible:', username);
                setUsernameAvailable(false);
                setErrors(prev => ({
                    ...prev,
                    username: error.message || 'Este nombre de usuario ya está en uso'
                }));
            }
            // Si es un error de red y estamos en desarrollo, permitir continuar
            else if (DEV_MODE && (error.message === 'Failed to fetch' || error.message.includes('conectar'))) {
                console.log('Error de red en desarrollo - asumiendo username disponible');
                setUsernameAvailable(true);
                setErrors(prev => ({ ...prev, username: '' }));
            } else {
                // Para otros errores, asumimos disponible para no bloquear el registro
                setUsernameAvailable(true);
                setErrors(prev => ({ ...prev, username: '' }));
            }
        } finally {
            setIsCheckingUsername(false);
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            termsAccepted: '',
            general: '',
            devMode: false
        };

        // Validar nombre
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'El nombre es requerido';
            valid = false;
        }

        // Validar apellido
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'El apellido es requerido';
            valid = false;
        }

        // Validar email
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es requerido';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Ingresa un correo electrónico válido';
            valid = false;
        }

        // Validar contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
            valid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
            valid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número';
            valid = false;
        }

        // Validar confirmación de contraseña
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
            valid = false;
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
            valid = false;
        }

        // Validar términos y condiciones
        if (!formData.termsAccepted) {
            newErrors.termsAccepted = 'Debes aceptar los términos y condiciones';
            valid = false;
        }

        // Validar nombre de usuario
        if (!formData.username) {
            newErrors.username = 'El nombre de usuario es requerido';
            valid = false;
        } else if (!validateUsernameFormat(formData.username)) {
            newErrors.username = 'Solo se permiten letras minúsculas, números, punto y guion bajo';
            valid = false;
        } else if (usernameAvailable === false) {
            newErrors.username = 'Este nombre de usuario ya está en uso';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación del formulario
        if (!validateForm()) return;

        // Si hay bypass de validación de username o el username está disponible, continuar
        if (localStorage.getItem('bypassUsernameValidation') !== 'true' &&
            !devModeEnabled &&
            usernameAvailable === false) {
            // Mostrar mensaje específico
            setErrors(prev => ({
                ...prev,
                username: 'Este nombre de usuario ya está en uso. Intenta con otro.'
            }));
            return;
        }

        setIsSubmitting(true);

        // Añadir animación al botón
        if (buttonRef.current) {
            buttonRef.current.classList.add('button-press');
            setTimeout(() => {
                buttonRef.current?.classList.remove('button-press');
            }, 300);
        }

        try {
            console.log('Iniciando registro con datos:', {
                username: formData.username,
                email: formData.email,
                // Omitiendo contraseña por seguridad
                first_name: formData.firstName,
                last_name: formData.lastName
            });

            // Si el modo desarrollo está activado, simulamos un registro exitoso
            if (devModeEnabled) {
                console.log('Modo desarrollo - simulando registro exitoso');
                // Simulamos un pequeño retraso para dar sensación de proceso
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Redirigir a login con mensaje de éxito
                navigate('/login', {
                    state: { message: '¡Registro exitoso en modo desarrollo! Ahora puedes iniciar sesión.' }
                });
                return;
            }

            await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                password2: formData.confirmPassword,
                first_name: formData.firstName,
                last_name: formData.lastName
            });

            console.log('Registro exitoso');
            navigate('/login', {
                state: { message: '¡Registro exitoso! Ahora puedes iniciar sesión.' }
            });
        } catch (error) {
            console.error('Error al registrar usuario:', error);

            // Si es un error de conexión en desarrollo, ofrecer modo desarrollo
            if (DEV_MODE && (error.message === 'Failed to fetch' || error.message.includes('conectar'))) {
                setErrors(prev => ({
                    ...prev,
                    general: 'Error de conexión con el servidor. ¿Deseas activar el modo desarrollo para probar la aplicación sin backend?',
                    devMode: true
                }));
            }
            // Manejo específico de errores
            else if (error.message.toLowerCase().includes('nombre de usuario') ||
                error.message.toLowerCase().includes('usuario ya está') ||
                error.message.toLowerCase().includes('username')) {
                setErrors(prev => ({
                    ...prev,
                    username: error.message,
                    general: 'Error en el registro: ' + error.message
                }));
                // Hacer scroll al campo con error
                inputRefs.username.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            else if (error.message.toLowerCase().includes('correo') ||
                error.message.toLowerCase().includes('email')) {
                setErrors(prev => ({
                    ...prev,
                    email: error.message,
                    general: 'Error en el registro: ' + error.message
                }));
                // Hacer scroll al campo con error
                inputRefs.email.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            else {
                setErrors(prev => ({
                    ...prev,
                    general: error.message || 'Error al registrar. Por favor intenta nuevamente más tarde.'
                }));
            }

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

    // Función para activar el modo desarrollo
    const enableDevMode = () => {
        setDevModeEnabled(true);
        setErrors(prev => ({
            ...prev,
            general: 'Modo desarrollo activado. Puedes registrarte sin conectar al backend.',
            devMode: false
        }));
    };

    const styles = {
        registerContainer: {
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
            bottom: '-100px',
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
            top: '-50px',
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
            bottom: '20%',
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
        registerImage: {
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
            position: 'relative',
            overflow: 'auto',
            maxHeight: '800px',
        },
        formContentInner: {
            opacity: animationComplete ? 1 : 0,
            transform: animationComplete ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease-out',
        },
        registerHeader: {
            marginBottom: spacing.xl,
        },
        registerTitle: {
            color: '#1F4E4E',
            fontSize: typography.fontSize.xxl,
            marginBottom: spacing.sm,
            position: 'relative',
            display: 'inline-block',
            overflow: 'hidden',
        },
        registerSubtitle: {
            color: colors.primaryLight,
            fontSize: typography.fontSize.md,
            opacity: 0,
            animation: 'fadeInUp 0.6s ease-out forwards',
            animationDelay: '1.2s',
        },
        formRow: {
            display: 'flex',
            gap: spacing.md,
            marginBottom: spacing.md,
        },
        formGroup: {
            marginBottom: spacing.lg,
            position: 'relative',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)',
            flex: 1,
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
        statusIcon: {
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '18px',
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
        termsContainer: {
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: spacing.lg,
            fontSize: typography.fontSize.sm,
            color: '#1F4E4E',
            opacity: 0,
            animation: 'fadeIn 0.6s ease-out forwards',
            animationDelay: '1.3s',
        },
        checkmark: {
            position: 'relative',
            height: '20px',
            width: '20px',
            borderRadius: '4px',
            border: `2px solid #91a8a9`,
            marginRight: spacing.xs,
            marginTop: '2px',
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
        termsLink: {
            color: '#1F4E4E',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            position: 'relative',
            paddingBottom: '2px',
        },
        registerButton: {
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
        loginLink: {
            textAlign: 'center',
            marginTop: spacing.xl,
            fontSize: typography.fontSize.sm,
            color: colors.primaryLight,
            opacity: 0,
            animation: 'fadeIn 0.6s ease-out forwards',
            animationDelay: '1.5s',
        },
        loginLinkText: {
            color: '#1F4E4E',
            fontWeight: typography.fontWeight.semiBold,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            position: 'relative',
            paddingBottom: '2px',
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
        passwordRequirements: {
            fontSize: typography.fontSize.xs,
            color: colors.primaryLight,
            marginTop: spacing.xs,
            lineHeight: 1.4,
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

    const getPasswordInputStyle = (fieldName) => ({
        ...styles.passwordInput,
        ...(activeField === fieldName ? styles.activePasswordInput : {}),
        borderColor: errors[fieldName] ? colors.error : activeField === fieldName ? '#2C7171' : colors.gray200,
        boxShadow: errors[fieldName]
            ? '0 4px 10px rgba(220, 53, 69, 0.1)'
            : activeField === fieldName
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
        <div style={styles.registerContainer}>
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
                    className="register-form-container"
                >
                    <div style={styles.registerImage}>
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
                                Únete a nuestra comunidad educativa y descubre un mundo de
                                oportunidades para tu crecimiento profesional y personal.
                            </p>
                            <div style={styles.imageQuote}>
                                "La educación es el pasaporte hacia el futuro, el mañana pertenece a aquellos que se preparan hoy."
                            </div>
                        </div>
                    </div>

                    <div style={styles.formContent}>
                        <div style={styles.formContentInner}>
                            <div style={styles.registerHeader}>
                                <h1
                                    style={styles.registerTitle}
                                    ref={titleRef}
                                    className="welcome-text"
                                >
                                    Crea tu cuenta
                                </h1>
                                <p style={styles.registerSubtitle}>
                                    Completa el formulario para unirte a nuestra plataforma
                                </p>

                                {/* Indicador de modo desarrollo */}
                                {devModeEnabled && (
                                    <div style={{
                                        backgroundColor: 'rgba(255, 193, 7, 0.2)',
                                        color: '#856404',
                                        padding: spacing.sm,
                                        borderRadius: '8px',
                                        marginTop: spacing.sm,
                                        fontSize: typography.fontSize.sm,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className="fas fa-code" style={{ marginRight: spacing.xs }}></i>
                                        Modo desarrollo activado - Sin conexión al backend
                                    </div>
                                )}
                            </div>

                            {errors.general && (
                                <div style={styles.generalError}>
                                    <i className="fas fa-exclamation-circle" style={styles.errorAlertIcon}></i>
                                    {errors.general}

                                    {/* Botón para activar modo desarrollo */}
                                    {errors.devMode && (
                                        <button
                                            onClick={enableDevMode}
                                            style={{
                                                marginLeft: spacing.md,
                                                padding: `${spacing.xs} ${spacing.sm}`,
                                                backgroundColor: '#1F4E4E',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: typography.fontSize.xs
                                            }}
                                        >
                                            Activar modo desarrollo
                                        </button>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div style={styles.formRow}>
                                    <div
                                        style={{
                                            ...styles.formGroup,
                                            ...(activeField === 'firstName' ? styles.activeFormGroup : {})
                                        }}
                                        className="form-group-animation"
                                    >
                                        <label
                                            style={{
                                                ...styles.label,
                                                ...(activeField === 'firstName' ? styles.activeLabel : {})
                                            }}
                                            htmlFor="firstName"
                                        >
                                            Nombre
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <i
                                                className="fas fa-user"
                                                style={{
                                                    ...styles.inputIcon,
                                                    ...(activeField === 'firstName' ? styles.activeInputIcon : {})
                                                }}
                                            ></i>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                ref={inputRefs.firstName}
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus('firstName')}
                                                onBlur={handleBlur}
                                                placeholder="Tu nombre"
                                                style={getInputStyle('firstName')}
                                                className="input-animation"
                                            />
                                        </div>
                                        {errors.firstName && (
                                            <div style={styles.errorText}>
                                                <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
                                                {errors.firstName}
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        style={{
                                            ...styles.formGroup,
                                            ...(activeField === 'lastName' ? styles.activeFormGroup : {})
                                        }}
                                        className="form-group-animation"
                                    >
                                        <label
                                            style={{
                                                ...styles.label,
                                                ...(activeField === 'lastName' ? styles.activeLabel : {})
                                            }}
                                            htmlFor="lastName"
                                        >
                                            Apellido
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <i
                                                className="fas fa-user"
                                                style={{
                                                    ...styles.inputIcon,
                                                    ...(activeField === 'lastName' ? styles.activeInputIcon : {})
                                                }}
                                            ></i>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                ref={inputRefs.lastName}
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus('lastName')}
                                                onBlur={handleBlur}
                                                placeholder="Tu apellido"
                                                style={getInputStyle('lastName')}
                                                className="input-animation"
                                            />
                                        </div>
                                        {errors.lastName && (
                                            <div style={styles.errorText}>
                                                <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
                                                {errors.lastName}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        ...styles.formGroup,
                                        ...(activeField === 'username' ? styles.activeFormGroup : {})
                                    }}
                                    className="form-group-animation"
                                >
                                    <label
                                        style={{
                                            ...styles.label,
                                            ...(activeField === 'username' ? styles.activeLabel : {})
                                        }}
                                        htmlFor="username"
                                    >
                                        Nombre de usuario
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <i
                                            className="fas fa-at"
                                            style={{
                                                ...styles.inputIcon,
                                                ...(activeField === 'username' ? styles.activeInputIcon : {})
                                            }}
                                        ></i>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            ref={inputRefs.username}
                                            value={formData.username}
                                            onChange={handleChange}
                                            onFocus={() => handleFocus('username')}
                                            onBlur={handleBlur}
                                            placeholder="usuario123"
                                            style={getInputStyle('username')}
                                            className="input-animation"
                                        />
                                        {isCheckingUsername && (
                                            <div style={{
                                                ...styles.statusIcon,
                                                color: '#91a8a9'
                                            }}>
                                                <i className="fas fa-circle-notch fa-spin"></i>
                                            </div>
                                        )}
                                        {usernameAvailable === true && (
                                            <div style={{
                                                ...styles.statusIcon,
                                                color: colors.success
                                            }}>
                                                <i className="fas fa-check-circle"></i>
                                            </div>
                                        )}
                                        {usernameAvailable === false && (
                                            <div style={{
                                                ...styles.statusIcon,
                                                color: colors.error
                                            }}>
                                                <i className="fas fa-times-circle"></i>
                                            </div>
                                        )}
                                    </div>
                                    {errors.username && (
                                        <div style={styles.errorText}>
                                            <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
                                            {errors.username}
                                        </div>
                                    )}
                                    <div style={styles.passwordRequirements} className="info-fade-in">
                                        Usa solo letras minúsculas, números, punto y guion bajo
                                    </div>
                                </div>

                                <div
                                    style={{
                                        ...styles.formGroup,
                                        ...(activeField === 'email' ? styles.activeFormGroup : {})
                                    }}
                                    className="form-group-animation"
                                >
                                    <label
                                        style={{
                                            ...styles.label,
                                            ...(activeField === 'email' ? styles.activeLabel : {})
                                        }}
                                        htmlFor="email"
                                    >
                                        Correo electrónico
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <i
                                            className="fas fa-envelope"
                                            style={{
                                                ...styles.inputIcon,
                                                ...(activeField === 'email' ? styles.activeInputIcon : {})
                                            }}
                                        ></i>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            ref={inputRefs.email}
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => handleFocus('email')}
                                            onBlur={handleBlur}
                                            placeholder="correo@ejemplo.com"
                                            style={getInputStyle('email')}
                                            className="input-animation"
                                        />
                                    </div>
                                    {errors.email && (
                                        <div style={styles.errorText}>
                                            <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
                                            {errors.email}
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
                                            placeholder="Crea una contraseña segura"
                                            style={getPasswordInputStyle('password')}
                                            className="input-animation"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            style={{
                                                ...styles.eyeIcon,
                                                ...(activeField === 'password' ? styles.activeEyeIcon : {})
                                            }}
                                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                            className="eye-icon-animation"
                                        >
                                            {showPassword ?
                                                <i className="fa-solid fa-eye-slash"></i> :
                                                <i className="fa-solid fa-eye"></i>
                                            }
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <div style={styles.errorText}>
                                            <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
                                            {errors.password}
                                        </div>
                                    )}
                                    <div style={styles.passwordRequirements} className="info-fade-in">
                                        La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula,
                                        una minúscula y un número.
                                    </div>
                                </div>

                                <div
                                    style={{
                                        ...styles.formGroup,
                                        ...(activeField === 'confirmPassword' ? styles.activeFormGroup : {})
                                    }}
                                    className="form-group-animation"
                                >
                                    <label
                                        style={{
                                            ...styles.label,
                                            ...(activeField === 'confirmPassword' ? styles.activeLabel : {})
                                        }}
                                        htmlFor="confirmPassword"
                                    >
                                        Confirmar contraseña
                                    </label>
                                    <div style={styles.passwordWrapper}>
                                        <i
                                            className="fas fa-lock"
                                            style={{
                                                ...styles.inputIcon,
                                                ...(activeField === 'confirmPassword' ? styles.activeInputIcon : {})
                                            }}
                                        ></i>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            ref={inputRefs.confirmPassword}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            onFocus={() => handleFocus('confirmPassword')}
                                            onBlur={handleBlur}
                                            placeholder="Repite tu contraseña"
                                            style={getPasswordInputStyle('confirmPassword')}
                                            className="input-animation"
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPasswordVisibility}
                                            style={{
                                                ...styles.eyeIcon,
                                                ...(activeField === 'confirmPassword' ? styles.activeEyeIcon : {})
                                            }}
                                            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                            className="eye-icon-animation"
                                        >
                                            {showConfirmPassword ?
                                                <i className="fa-solid fa-eye-slash"></i> :
                                                <i className="fa-solid fa-eye"></i>
                                            }
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <div style={styles.errorText}>
                                            <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
                                            {errors.confirmPassword}
                                        </div>
                                    )}
                                </div>

                                <div style={styles.termsContainer}>
                                    <div
                                        style={{
                                            ...styles.checkmark,
                                            ...(formData.termsAccepted ? styles.activeCheckmark : {})
                                        }}
                                        onClick={() => setFormData({ ...formData, termsAccepted: !formData.termsAccepted })}
                                    >
                                        <i
                                            className="fas fa-check"
                                            style={{
                                                ...styles.checkmarkIcon,
                                                ...(formData.termsAccepted ? styles.activeCheckmarkIcon : {})
                                            }}
                                        ></i>
                                    </div>

                                    <label>
                                        He leído y acepto los <Link to="/terms" className="link-hover-effect">términos y condiciones</Link> y
                                        la <Link to="/privacy" className="link-hover-effect">política de privacidad</Link>.
                                    </label>
                                </div>
                                {errors.termsAccepted && (
                                    <div style={styles.errorText}>
                                        <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
                                        {errors.termsAccepted}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    style={styles.registerButton}
                                    ref={buttonRef}
                                    disabled={isSubmitting}
                                    className="login-button-animation"
                                >
                                    <span style={styles.buttonRipple}></span>
                                    {isSubmitting ? (
                                        <>
                                            <i className="fas fa-circle-notch fa-spin" style={{ marginRight: '10px' }}></i>
                                            Creando cuenta...
                                        </>
                                    ) : 'Crear cuenta'}
                                </button>

                                <div style={styles.loginLink}>
                                    ¿Ya tienes una cuenta?
                                    <Link
                                        to="/login"
                                        style={styles.loginLinkText}
                                        className="link-hover-effect"
                                    > Inicia sesión
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
                    animation-delay: 1s;
                }
                
                .form-group-animation:nth-child(3) {
                    animation-delay: 1.1s;
                }
                
                .form-group-animation:nth-child(4) {
                    animation-delay: 1.2s;
                }
                
                .form-group-animation:nth-child(5) {
                    animation-delay: 1.3s;
                }
                
                .form-group-animation:nth-child(6) {
                    animation-delay: 1.4s;
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
                    color: #1F4E4E;
                    text-decoration: none;
                    transition: color 0.3s ease;
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
                
                .link-hover-effect:hover {
                    color: #2C7171;
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
                
                .info-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                    animation-delay: 0.2s;
                    opacity: 0;
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

export default RegisterPage;