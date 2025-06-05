// src/components/auth/RegisterPage.jsx - Completamente Renovado
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { checkUsernameAvailability, checkEmailAvailability } from '../../services/authService';
import { colors, spacing, typography } from '../../styles/theme';
import '@fortawesome/fontawesome-free/css/all.css';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext.jsx';

// Constante para habilitar el modo desarrollo (registro sin backend)
const DEV_MODE = process.env.NODE_ENV === 'development';

const RegisterPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, isAuth, loading } = useAuth();
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

    // Estado para controlar la validación del email
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [emailAvailable, setEmailAvailable] = useState(null);

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
        
        // Validar email cuando cambia el valor y tiene formato válido
        if (name === 'email') {
            // Reiniciar estado de disponibilidad si se cambia el valor
            if (emailAvailable !== null) {
                setEmailAvailable(null);
            }
            
            // Solo validar si el formato es correcto
            if (value && /\S+@\S+\.\S+/.test(value)) {
                // Usar un temporizador para no hacer demasiadas peticiones mientras se escribe
                if (window.emailValidationTimer) {
                    clearTimeout(window.emailValidationTimer);
                }
                
                window.emailValidationTimer = setTimeout(() => {
                    validateEmail(value);
                }, 800); // Esperar 800ms después de que el usuario deje de escribir
            }
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

    // Función para validar el formato del email (simplificada a la versión anterior)
    const validateEmail = async (email) => {
        if (!email) {
            setErrors(prev => ({ ...prev, email: 'El correo electrónico es requerido' }));
            setEmailAvailable(null);
            return;
        }

        // Validación de formato básica (versión anterior)
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors(prev => ({
                ...prev,
                email: 'Ingresa un correo electrónico válido'
            }));
            setEmailAvailable(null);
            return;
        }

        setIsCheckingEmail(true);
        try {
            console.log('Iniciando verificación de email para:', email);

            // Si el modo desarrollo está activado, asumimos que el email está disponible
            if (devModeEnabled) {
                console.log('Modo desarrollo activado - asumiendo email disponible');
                setEmailAvailable(true);
                setErrors(prev => ({ ...prev, email: '' }));
                setIsCheckingEmail(false);
                return;
            }

            // Validación temporal - REMOVER EN PRODUCCIÓN
            const bypassValidation = localStorage.getItem('bypassEmailValidation') === 'true';
            if (bypassValidation) {
                console.log('Bypass de validación activado - asumiendo email disponible');
                setEmailAvailable(true);
                setErrors(prev => ({ ...prev, email: '' }));
                setIsCheckingEmail(false);
                return;
            }

            await checkEmailAvailability(email);
            console.log('Email disponible:', email);
            setEmailAvailable(true);
            setErrors(prev => ({ ...prev, email: '' }));
        } catch (error) {
            console.error('Error en validación de email:', error.message);

            if (error.message && (
                error.message.includes('ya está registrado') ||
                error.message.includes('ya existe')
            )) {
                console.log('Email no disponible:', email);
                setEmailAvailable(false);
                setErrors(prev => ({
                    ...prev,
                    email: error.message || 'Este correo electrónico ya está registrado'
                }));
            }
            else if (DEV_MODE && (error.message === 'Failed to fetch' || error.message.includes('conectar'))) {
                console.log('Error de red en desarrollo - asumiendo email disponible');
                setEmailAvailable(true);
                setErrors(prev => ({ ...prev, email: '' }));
            } else {
                setEmailAvailable(true);
                setErrors(prev => ({ ...prev, email: '' }));
            }
        } finally {
            setIsCheckingEmail(false);
        }
    };

    // Función para validar el formulario completo (versión anterior)
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

        // Validar username
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

        // Validar email (versión anterior)
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es requerido';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Ingresa un correo electrónico válido';
            valid = false;
        } else if (emailAvailable === false) {
            newErrors.email = 'Este correo electrónico ya está registrado';
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

        setErrors(newErrors);
        return valid;
    };

    // Función para manejar el envío del formulario (versión anterior con setTimeout)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación del formulario
        if (!validateForm()) return;

        // Si hay bypass de validación de username o el username está disponible, continuar
        if (localStorage.getItem('bypassUsernameValidation') !== 'true' &&
            !devModeEnabled &&
            usernameAvailable === false) {
            setErrors(prev => ({
                ...prev,
                username: 'Este nombre de usuario ya está en uso. Intenta con otro.'
            }));
            inputRefs.username.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Si hay bypass de validación de email o el email está disponible, continuar
        if (localStorage.getItem('bypassEmailValidation') !== 'true' &&
            !devModeEnabled &&
            emailAvailable === false) {
            setErrors(prev => ({
                ...prev,
                email: 'Este correo electrónico ya está registrado. Intenta con otro.'
            }));
            inputRefs.email.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                await new Promise(resolve => setTimeout(resolve, 1000));

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

            if (DEV_MODE && (error.message === 'Failed to fetch' || error.message.includes('conectar'))) {
                setErrors(prev => ({
                    ...prev,
                    general: 'Error de conexión con el servidor. ¿Deseas activar el modo desarrollo para probar la aplicación sin backend?',
                    devMode: true
                }));
            }
            else if (error.message.toLowerCase().includes('nombre de usuario') ||
                error.message.toLowerCase().includes('usuario ya está') ||
                error.message.toLowerCase().includes('username')) {
                setUsernameAvailable(false); 
                setErrors(prev => ({
                    ...prev,
                    username: error.message,
                    general: 'Error en el registro: ' + error.message
                }));
                inputRefs.username.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            else if (error.message.toLowerCase().includes('correo') ||
                error.message.toLowerCase().includes('email')) {
                setEmailAvailable(false); 
                setErrors(prev => ({
                    ...prev,
                    email: error.message,
                    general: 'Error en el registro: ' + error.message
                }));
                inputRefs.email.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            else {
                setErrors(prev => ({
                    ...prev,
                    general: error.message || 'Error al registrar. Por favor intenta nuevamente más tarde.'
                }));
            }

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

    // Agregar estilos responsivos COMPLETOS
    const responsiveStyles = `
      /* Estilos base - mantener diseño original */
      .register-form-container {
        width: 100%;
        max-width: 1100px;
        display: flex;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 25px 50px rgba(11, 68, 68, 0.25);
        backgroundColor: white;
        transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      /* Estilos para el contenido de la imagen */
      .register-image-overlay {
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
      
      .register-raccoon-logo-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 32px;
        opacity: 0;
        animation: fadeInUp 0.8s ease-out forwards;
        animation-delay: 0.3s;
      }
      
      .register-raccoon-image {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        margin-right: 16px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        transform: rotate(-5deg);
        transition: transform 0.3s ease;
      }
      
      .register-logo-text {
        font-size: 32px;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      }
      
      .register-logo-text2 {
        font-size: 32px;
        font-weight: 700;
        color: #d2b99a;
        margin: 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      }
      
      .register-image-text {
        font-size: 18px;
        line-height: 1.6;
        margin-bottom: 32px;
        opacity: 0;
        animation: fadeInUp 0.8s ease-out forwards;
        animation-delay: 0.6s;
      }
      
      .register-image-quote {
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

      /* Media queries para responsive - TABLETS */
      @media (max-width: 768px) {
        .register-form-container {
          flex-direction: column !important;
          max-width: 96% !important;
          margin: 15px auto !important;
          min-height: auto !important;
          height: auto !important;
        }
        
        .register-image-section {
          min-height: 180px !important;
          border-radius: 16px 16px 0 0 !important;
          flex: none !important;
        }
        
        /* Contenido de la imagen responsive */
        .register-image-overlay {
          padding: 20px !important;
          justify-content: center !important;
        }
        
        .register-raccoon-logo-row {
          margin-bottom: 16px !important;
          justify-content: center !important;
        }
        
        .register-raccoon-image {
          width: 40px !important;
          height: 40px !important;
          margin-right: 12px !important;
        }
        
        .register-logo-text {
          font-size: 20px !important;
        }
        
        .register-logo-text2 {
          font-size: 20px !important;
        }
        
        .register-image-text {
          font-size: 13px !important;
          line-height: 1.4 !important;
          margin-bottom: 16px !important;
          text-align: center !important;
        }
        
        .register-image-quote {
          font-size: 12px !important;
          padding: 12px !important;
          line-height: 1.3 !important;
          text-align: center !important;
        }
        
        .register-form-content {
          padding: 28px 24px !important;
          max-height: none !important;
          flex: none !important;
        }
        
        .register-title {
          font-size: 26px !important;
          margin-bottom: 6px !important;
        }
        
        .register-subtitle {
          font-size: 14px !important;
          margin-bottom: 24px !important;
        }
        
        /* MANTENER nombre y apellido lado a lado en tablets */
        .register-form-row {
          flex-direction: row !important;
          gap: 12px !important;
        }
        
        .register-form-group {
          margin-bottom: 18px !important;
        }
        
        .register-input-field {
          padding: 14px 16px 14px 45px !important;
          font-size: 16px !important;
          min-height: 50px !important;
        }
        
        .register-password-input {
          padding: 14px 45px 14px 45px !important;
          font-size: 16px !important;
          min-height: 50px !important;
        }
        
        .register-input-icon {
          left: 15px !important;
          font-size: 16px !important;
        }
        
        .register-eye-icon {
          right: 15px !important;
          padding: 10px !important;
        }
        
        .register-status-icon {
          right: 15px !important;
        }
        
        .register-button {
          padding: 15px !important;
          font-size: 16px !important;
          min-height: 50px !important;
          margin-bottom: 12px !important;
        }
        
        /* Términos y condiciones LADO A LADO */
        .register-terms-container {
          flex-direction: row !important;
          align-items: flex-start !important;
          gap: 8px !important;
          margin-bottom: 20px !important;
        }
        
        .register-login-link {
          font-size: 14px !important;
          margin-top: 18px !important;
          text-align: center !important;
        }
        
        .register-background-elements {
          display: none !important;
        }
        
        .register-error-message {
          padding: 12px 16px !important;
          font-size: 14px !important;
          margin-bottom: 18px !important;
        }
        
        .register-password-requirements {
          font-size: 12px !important;
        }
      }
      
      @media (max-width: 480px) {
        .register-form-container {
          max-width: 98% !important;
          margin: 8px auto !important;
        }
        
        .register-image-section {
          min-height: 160px !important;
        }
        
        /* Contenido imagen más compacto */
        .register-image-overlay {
          padding: 16px !important;
        }
        
        .register-raccoon-logo-row {
          margin-bottom: 12px !important;
        }
        
        .register-raccoon-image {
          width: 32px !important;
          height: 32px !important;
          margin-right: 8px !important;
        }
        
        .register-logo-text {
          font-size: 18px !important;
        }
        
        .register-logo-text2 {
          font-size: 18px !important;
        }
        
        .register-image-text {
          font-size: 12px !important;
          margin-bottom: 12px !important;
        }
        
        .register-image-quote {
          font-size: 11px !important;
          padding: 10px !important;
        }
        
        .register-form-content {
          padding: 24px 20px !important;
        }
        
        .register-title {
          font-size: 24px !important;
          margin-bottom: 4px !important;
        }
        
        .register-subtitle {
          font-size: 13px !important;
          margin-bottom: 20px !important;
        }
        
        .register-form-row {
          flex-direction: row !important;
          gap: 10px !important;
        }
        
        .register-form-group {
          margin-bottom: 16px !important;
        }
        
        .register-input-field {
          padding: 13px 14px 13px 42px !important;
          font-size: 16px !important;
          min-height: 48px !important;
        }
        
        .register-password-input {
          padding: 13px 42px 13px 42px !important;
          font-size: 16px !important;
          min-height: 48px !important;
        }
        
        .register-input-icon {
          left: 14px !important;
          font-size: 15px !important;
        }
        
        .register-eye-icon {
          right: 12px !important;
          padding: 8px !important;
        }
        
        .register-status-icon {
          right: 12px !important;
        }
        
        .register-button {
          padding: 14px !important;
          font-size: 15px !important;
          min-height: 48px !important;
          margin-bottom: 10px !important;
        }
        
        /* Términos y condiciones LADO A LADO más compacto */
        .register-terms-container {
          flex-direction: row !important;
          align-items: flex-start !important;
          gap: 6px !important;
          margin-bottom: 18px !important;
        }
        
        .register-login-link {
          font-size: 13px !important;
          margin-top: 16px !important;
        }
        
        .register-password-requirements {
          font-size: 11px !important;
        }
        
        .register-error-text {
          font-size: 12px !important;
        }
      }
      
      @media (max-width: 360px) {
        .register-form-container {
          max-width: 100% !important;
          margin: 5px auto !important;
          border-radius: 12px !important;
        }
        
        .register-image-section {
          min-height: 140px !important;
        }
        
        /* Imagen súper compacta */
        .register-image-overlay {
          padding: 12px !important;
        }
        
        .register-raccoon-logo-row {
          margin-bottom: 8px !important;
        }
        
        .register-raccoon-image {
          width: 28px !important;
          height: 28px !important;
          margin-right: 6px !important;
        }
        
        .register-logo-text {
          font-size: 16px !important;
        }
        
        .register-logo-text2 {
          font-size: 16px !important;
        }
        
        .register-image-text {
          font-size: 10px !important;
          margin-bottom: 8px !important;
          line-height: 1.2 !important;
        }
        
        .register-image-quote {
          font-size: 9px !important;
          padding: 8px !important;
          line-height: 1.2 !important;
        }
        
        .register-form-content {
          padding: 20px 16px !important;
        }
        
        .register-title {
          font-size: 22px !important;
          margin-bottom: 4px !important;
        }
        
        .register-subtitle {
          font-size: 12px !important;
          margin-bottom: 18px !important;
        }
        
        .register-form-group {
          margin-bottom: 14px !important;
        }
        
        /* MANTENER nombre y apellido lado a lado incluso en pantallas muy pequeñas */
        .register-form-row {
          flex-direction: row !important;
          gap: 8px !important;
        }
        
        .register-input-field {
          padding: 12px 12px 12px 40px !important;
          min-height: 46px !important;
        }
        
        .register-password-input {
          padding: 12px 40px 12px 40px !important;
          min-height: 46px !important;
        }
        
        .register-input-icon {
          left: 12px !important;
        }
        
        .register-eye-icon {
          right: 10px !important;
        }
        
        .register-status-icon {
          right: 10px !important;
        }
        
        .register-button {
          min-height: 46px !important;
          padding: 13px !important;
        }
        
        /* Términos y condiciones LADO A LADO súper compacto */
        .register-terms-container {
          flex-direction: row !important;
          align-items: flex-start !important;
          gap: 4px !important;
          margin-bottom: 16px !important;
        }
        
        .register-login-link {
          margin-top: 14px !important;
        }
        
        .register-password-requirements {
          font-size: 10px !important;
        }
        
        .register-error-text {
          font-size: 11px !important;
        }
      }
    `;

    return (
        <div style={styles.registerContainer}>
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
              
              @keyframes buttonPress {
                0% { transform: scale(1); }
                50% { transform: scale(0.95); }
                100% { transform: scale(1); }
              }
              
              .button-press {
                animation: buttonPress 0.3s forwards;
              }
              
              .form-error {
                animation: shakeX 0.5s;
              }
              
              .pulse-animation {
                animation: pulse 2s infinite;
              }
              
              .link-hover-effect {
                position: relative;
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
              
              .login-button-animation:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(31, 78, 78, 0.4);
                background-color: #2C7171;
              }
              
              .login-button-animation:active {
                transform: translateY(0);
                box-shadow: 0 4px 15px rgba(31, 78, 78, 0.3);
              }
              
              .info-fade-in {
                animation: fadeIn 0.5s ease-out forwards;
                animation-delay: 0.2s;
                opacity: 0;
              }
            `}</style>
            
            {/* Background Elements */}
            <div style={styles.backgroundElements} className="register-background-elements">
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
                    <div style={styles.registerImage} className="register-image-section">
                        <div style={styles.imageOverlay} className="register-image-overlay">
                            <div style={styles.raccoonLogoRow} className="register-raccoon-logo-row">
                                <img
                                    src="/assets/images/educstation-logo.png"
                                    alt="logo"
                                    style={styles.raccoonImage}
                                    className="register-raccoon-image pulse-animation"
                                />
                                <span style={styles.logoText} className="register-logo-text">Educ</span>
                                <span style={styles.logoText2} className="register-logo-text2">Station</span>
                            </div>
                            <p style={styles.imageText} className="register-image-text">
                                Únete a nuestra comunidad educativa y descubre un mundo de
                                oportunidades para tu crecimiento profesional y personal.
                            </p>
                            <div style={styles.imageQuote} className="register-image-quote">
                                "La educación es el pasaporte hacia el futuro, el mañana pertenece a aquellos que se preparan hoy."
                            </div>
                        </div>
                    </div>

                    <div style={styles.formContent} className="register-form-content">
                        <div style={styles.formContentInner}>
                            <div style={styles.registerHeader}>
                                <h1
                                    style={styles.registerTitle}
                                    ref={titleRef}
                                    className="register-title welcome-text"
                                >
                                    Crea tu cuenta
                                </h1>
                                <p style={styles.registerSubtitle} className="register-subtitle">
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
                                <div style={styles.generalError} className="register-error-message">
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
                                <div style={styles.formRow} className="register-form-row">
                                    <div
                                        style={{
                                            ...styles.formGroup,
                                            ...(activeField === 'firstName' ? styles.activeFormGroup : {})
                                        }}
                                        className="register-form-group form-group-animation"
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
                                                className="fas fa-user register-input-icon"
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
                                                className="register-input-field input-animation"
                                            />
                                        </div>
                                        {errors.firstName && (
                                            <div style={styles.errorText} className="register-error-text">
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
                                        className="register-form-group form-group-animation"
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
                                                className="fas fa-user register-input-icon"
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
                                                className="register-input-field input-animation"
                                            />
                                        </div>
                                        {errors.lastName && (
                                            <div style={styles.errorText} className="register-error-text">
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
                                    className="register-form-group form-group-animation"
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
                                            className="fas fa-at register-input-icon"
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
                                            className="register-input-field input-animation"
                                        />
                                        {isCheckingUsername && (
                                            <div style={{
                                                ...styles.statusIcon,
                                                color: '#91a8a9'
                                            }} className="register-status-icon">
                                                <i className="fas fa-circle-notch fa-spin"></i>
                                            </div>
                                        )}
                                        {usernameAvailable === true && (
                                            <div style={{
                                                ...styles.statusIcon,
                                                color: colors.success
                                            }} className="register-status-icon">
                                                <i className="fas fa-check-circle"></i>
                                            </div>
                                        )}
                                        {usernameAvailable === false && (
                                            <div style={{
                                                ...styles.statusIcon,
                                                color: colors.error
                                            }} className="register-status-icon">
                                                <i className="fas fa-times-circle"></i>
                                            </div>
                                        )}
                                    </div>
                                    {errors.username && (
                                        <div style={styles.errorText} className="register-error-text">
                                            <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
                                            {errors.username}
                                        </div>
                                    )}
                                    <div style={styles.passwordRequirements} className="register-password-requirements info-fade-in">
                                        Usa solo letras minúsculas, números, punto y guion bajo
                                    </div>
                                </div>

                                <div
                                    style={{
                                        ...styles.formGroup,
                                        ...(activeField === 'email' ? styles.activeFormGroup : {})
                                    }}
                                    className="register-form-group form-group-animation"
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
                                            className="fas fa-envelope register-input-icon"
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
                                            onBlur={(e) => {
                                                handleBlur();
                                                if (e.target.value && /\S+@\S+\.\S+/.test(e.target.value)) {
                                                    validateEmail(e.target.value);
                                                }
                                            }}
                                            placeholder="correo@ejemplo.com"
                                            style={getInputStyle('email')}
                                            className="register-input-field input-animation"
                                        />
                                        {isCheckingEmail && (
                                            <div style={{
                                                ...styles.statusIcon,
                                                color: '#91a8a9'
                                            }} className="register-status-icon">
                                                <i className="fas fa-circle-notch fa-spin"></i>
                                            </div>
                                        )}
                                        {emailAvailable === true && (
                                            <div style={{
                                                ...styles.statusIcon,
                                                color: colors.success
                                            }} className="register-status-icon">
                                                <i className="fas fa-check-circle"></i>
                                            </div>
                                        )}
                                        {emailAvailable === false && (
                                            <div style={{
                                                ...styles.statusIcon,
                                                color: colors.error
                                            }} className="register-status-icon">
                                                <i className="fas fa-times-circle"></i>
                                            </div>
                                        )}
                                    </div>
                                    {errors.email && (
                                        <div style={styles.errorText} className="register-error-text">
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
                                    className="register-form-group form-group-animation"
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
                                            className="fas fa-lock register-input-icon"
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
                                            className="register-password-input input-animation"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            style={{
                                                ...styles.eyeIcon,
                                                ...(activeField === 'password' ? styles.activeEyeIcon : {})
                                            }}
                                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                            className="register-eye-icon eye-icon-animation"
                                        >
                                            {showPassword ?
                                                <i className="fa-solid fa-eye-slash"></i> :
                                                <i className="fa-solid fa-eye"></i>
                                            }
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <div style={styles.errorText} className="register-error-text">
                                            <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
                                            {errors.password}
                                        </div>
                                    )}
                                    <div style={styles.passwordRequirements} className="register-password-requirements info-fade-in">
                                        La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula,
                                        una minúscula y un número.
                                    </div>
                                </div>

                                <div
                                    style={{
                                        ...styles.formGroup,
                                        ...(activeField === 'confirmPassword' ? styles.activeFormGroup : {})
                                    }}
                                    className="register-form-group form-group-animation"
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
                                            className="fas fa-lock register-input-icon"
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
                                            className="register-password-input input-animation"
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPasswordVisibility}
                                            style={{
                                                ...styles.eyeIcon,
                                                ...(activeField === 'confirmPassword' ? styles.activeEyeIcon : {})
                                            }}
                                            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                            className="register-eye-icon eye-icon-animation"
                                        >
                                            {showConfirmPassword ?
                                                <i className="fa-solid fa-eye-slash"></i> :
                                                <i className="fa-solid fa-eye"></i>
                                            }
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <div style={styles.errorText} className="register-error-text">
                                            <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
                                            {errors.confirmPassword}
                                        </div>
                                    )}
                                </div>

                                <div style={styles.termsContainer} className="register-terms-container">
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
                                        He leído y acepto los <button 
                                            onClick={() => {
                                                // Navigate to terms page with instant reload
                                                if(location.pathname === '/terms') {
                                                    window.location.reload();
                                                } else {
                                                    window.location.href = '/terms';
                                                }
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#1F4E4E',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                                padding: 0,
                                                fontFamily: 'inherit',
                                                fontSize: 'inherit'
                                            }}
                                            className="link-hover-effect"
                                        >términos y condiciones</button> y
                                        la <button 
                                            onClick={() => {
                                                // Navigate to privacy page with instant reload
                                                if(location.pathname === '/privacy') {
                                                    window.location.reload();
                                                } else {
                                                    window.location.href = '/privacy';
                                                }
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#1F4E4E',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                                padding: 0,
                                                fontFamily: 'inherit',
                                                fontSize: 'inherit'
                                            }}
                                            className="link-hover-effect"
                                        >política de privacidad</button>.
                                    </label>
                                </div>
                                {errors.termsAccepted && (
                                    <div style={styles.errorText} className="register-error-text">
                                        <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
                                        {errors.termsAccepted}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    style={styles.registerButton}
                                    ref={buttonRef}
                                    disabled={isSubmitting}
                                    className="register-button login-button-animation"
                                >
                                    <span style={styles.buttonRipple}></span>
                                    {isSubmitting ? (
                                        <>
                                            <i className="fas fa-circle-notch fa-spin" style={{ marginRight: '10px' }}></i>
                                            Creando cuenta...
                                        </>
                                    ) : 'Crear cuenta'}
                                </button>

                                <div style={styles.loginLink} className="register-login-link">
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
        </div>
    );
};

export default RegisterPage;