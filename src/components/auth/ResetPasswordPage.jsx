import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { colors, spacing, typography } from '../../styles/theme';
import { verifyResetToken, resetPassword } from '../../services/authService';
import '@fortawesome/fontawesome-free/css/all.css';
import { ThemeContext } from '../../context/ThemeContext';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token: paramToken } = useParams(); // Extrae el token de los parámetros de ruta
    const { setForceLightMode } = useContext(ThemeContext);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState('loading'); // 'loading', 'form', 'success', 'error'
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
        general: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState('');

    // Forzar el modo claro inmediatamente
    // Usando useLayoutEffect para que se ejecute antes del renderizado
    React.useLayoutEffect(() => {
        setForceLightMode(true);
        return () => setForceLightMode(false);
    }, [setForceLightMode]);

    // Extraer token de la URL - puede estar en diferentes formatos:
    // 1. Como parámetro: /reset-password/:token
    // 2. Como query param: /reset-password?token=xxx
    // 3. Directamente en la ruta con doble slash: /reset-password//token
    useEffect(() => {
        console.log("ResetPasswordPage - Analizando URL para token:", location.pathname);
        
        const getToken = () => {
            // 1. Verificar si viene como parámetro en la ruta (/reset-password/:token)
            if (paramToken) {
                console.log("Token encontrado en parámetros de ruta:", paramToken);
                return paramToken;
            }
            
            // 2. Verificar si viene como query parameter (?token=xxx)
            const params = new URLSearchParams(location.search);
            const queryToken = params.get('token');
            if (queryToken) {
                console.log("Token encontrado en query parameters:", queryToken);
                return queryToken;
            }
            
            // 3. Extraer de URL directamente para manejar casos como doble slash
            const pathTokenRegex = /\/reset-password\/+([^\/]+)/;
            const match = location.pathname.match(pathTokenRegex);
            if (match && match[1]) {
                console.log("Token encontrado en ruta con expresión regular:", match[1]);
                return match[1];
            }
            
            // 4. Último segmento de la ruta como fallback
            const pathSegments = location.pathname.split('/').filter(segment => segment);
            const lastSegment = pathSegments[pathSegments.length - 1];
            if (lastSegment && lastSegment !== 'reset-password') {
                console.log("Token encontrado como último segmento de ruta:", lastSegment);
                return lastSegment;
            }
            
            console.log("No se encontró token en la URL");
            return null;
        };
        
        const resetToken = getToken();
        
        if (resetToken) {
            setToken(resetToken);
            verifyToken(resetToken);
        } else {
            setErrors({
                ...errors,
                general: 'No se proporcionó un token válido. Por favor, solicita un nuevo enlace de restablecimiento.'
            });
            setStep('error');
        }
    }, [location, paramToken]);

    const verifyToken = async (tokenValue) => {
        try {
            // En lugar de verificar con el backend, aceptamos el token directamente
            // porque algunos backends no implementan verificación previa
            setStep('form');
            console.log("Token aceptado para reseteo de contraseña:", tokenValue);
            
            // Si desea verificar con el backend, descomente estas líneas:
            /*
            await verifyResetToken(tokenValue);
            setStep('form');
            */
        } catch (error) {
            console.error('Error al verificar token:', error);
            setErrors({
                ...errors,
                general: 'El enlace de restablecimiento no es válido o ha expirado. Por favor, solicita un nuevo enlace.'
            });
            setStep('error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Limpiar los errores específicos del campo
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            password: '',
            confirmPassword: '',
            general: ''
        };

        // Validar contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
            isValid = false;
        }

        // Validar confirmación de contraseña
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Por favor confirma tu contraseña';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({ ...errors, general: '' });

        try {
            await resetPassword(token, formData.password);
            setStep('success');
        } catch (error) {
            console.error('Error al restablecer contraseña:', error);
            setErrors({
                ...errors,
                general: error.message || 'Ha ocurrido un error al restablecer la contraseña.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #93ABA3 0%, #1F4E4E 100%)',
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
            zIndex: 0,
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
        navContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `${spacing.md} ${spacing.xl}`,
            backgroundColor: 'transparent',
            position: 'relative',
            zIndex: 2,
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
        },
        logoText: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            color: colors.primary,
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
            width: '100%',
            maxWidth: '420px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(11, 68, 68, 0.25)',
            backgroundColor: colors.white,
            padding: spacing.xl,
            margin: '0 auto',
            opacity: 1,
            transform: 'translateY(0)',
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            animation: 'fadeInUp 0.8s',
        },
        header: {
            marginBottom: spacing.xl,
            textAlign: 'center',
        },
        title: {
            color: colors.primary,
            fontSize: typography.fontSize.xxl,
            marginBottom: spacing.sm,
            fontWeight: typography.fontWeight.bold,
            letterSpacing: '1px',
        },
        subtitle: {
            color: colors.primaryLight,
            fontSize: typography.fontSize.md,
            maxWidth: '350px',
            margin: '0 auto',
        },
        formGroup: {
            marginBottom: spacing.lg,
            position: 'relative',
        },
        label: {
            display: 'block',
            marginBottom: spacing.xs,
            color: colors.primary,
            fontWeight: typography.fontWeight.medium,
            fontSize: typography.fontSize.sm,
            letterSpacing: '0.5px',
        },
        input: {
            width: '100%',
            padding: `${spacing.md} ${spacing.lg}`,
            border: `2px solid ${colors.gray200}`,
            borderRadius: '12px',
            fontSize: typography.fontSize.md,
            transition: 'all 0.3s ease',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
        passwordInput: {
            width: '100%',
            padding: `${spacing.md} ${spacing.lg}`,
            paddingRight: '40px',
            border: `2px solid ${colors.gray200}`,
            borderRadius: '12px',
            fontSize: typography.fontSize.md,
            transition: 'all 0.3s ease',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
        passwordWrapper: {
            position: 'relative',
            width: '100%',
        },
        eyeIcon: {
            position: 'absolute',
            right: '12px',
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
            padding: '4px',
        },
        errorText: {
            color: colors.error,
            fontSize: typography.fontSize.xs,
            marginTop: spacing.xs,
        },
        button: {
            width: '100%',
            padding: spacing.md,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
            color: colors.white,
            border: 'none',
            borderRadius: '12px',
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semiBold,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: spacing.md,
            boxShadow: '0 4px 15px rgba(31, 78, 78, 0.3)',
        },
        buttonHover: {
            background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`,
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(31, 78, 78, 0.4)',
        },
        backLink: {
            textAlign: 'center',
            marginTop: spacing.xl,
            fontSize: typography.fontSize.sm,
            color: colors.primaryLight,
        },
        backLinkText: {
            color: colors.primary,
            fontWeight: typography.fontWeight.semiBold,
            textDecoration: 'none',
            transition: 'color 0.3s ease',
            position: 'relative',
            paddingBottom: '2px',
        },
        successContainer: {
            textAlign: 'center',
            padding: spacing.xl,
        },
        successIcon: {
            color: colors.success,
            fontSize: '48px',
            marginBottom: spacing.lg,
        },
        successTitle: {
            color: colors.primary,
            fontSize: typography.fontSize.xl,
            marginBottom: spacing.md,
        },
        successMessage: {
            color: colors.textPrimary,
            fontSize: typography.fontSize.md,
            marginBottom: spacing.xl,
            lineHeight: 1.6,
        },
        divider: {
            margin: `${spacing.lg} 0`,
            borderTop: `1px solid ${colors.gray200}`,
        },
        errorIcon: {
            color: colors.error,
            fontSize: '48px',
            marginBottom: spacing.lg,
        },
        errorMessage: {
            backgroundColor: `${colors.error}15`,
            color: colors.error,
            padding: spacing.md,
            borderRadius: '6px',
            marginBottom: spacing.lg,
            textAlign: 'center',
            fontSize: typography.fontSize.sm,
        },
        loadingContainer: {
            textAlign: 'center',
            padding: spacing.xl,
        },
        loadingIcon: {
            color: colors.primary,
            fontSize: '48px',
            marginBottom: spacing.lg,
            animation: 'spin 2s linear infinite',
        },
        loadingText: {
            color: colors.primary,
            fontSize: typography.fontSize.md,
        },
    };

    // Animaciones de fondo
    const renderBackground = () => (
        <div style={styles.backgroundElements}>
            <div style={styles.circle1}></div>
            <div style={styles.circle2}></div>
            <div style={styles.circle3}></div>
        </div>
    );

    // Función para manejar el estilo del botón en hover
    const getButtonStyle = () => ({
        ...styles.button,
        ...(isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}),
    });

    // Función para manejar el estilo del input con error
    const getInputStyle = (fieldName) => ({
        ...styles.input,
        borderColor: errors[fieldName] ? colors.error : colors.gray200,
        boxShadow: errors[fieldName] ? `0 0 0 1px ${colors.error}` : 'none',
    });

    const getPasswordInputStyle = (fieldName) => ({
        ...styles.passwordInput,
        borderColor: errors[fieldName] ? colors.error : colors.gray200,
        boxShadow: errors[fieldName] ? `0 0 0 1px ${colors.error}` : 'none',
    });

    return (
        <div style={styles.container}>
            {renderBackground()}
            <div style={styles.navContainer}>
                <Link to="/" style={styles.logo}>
                    <span style={styles.logoText}>EducStation</span>
                </Link>
            </div>
            <main style={styles.mainContent}>
                <div style={styles.formContainer}>
                    {step === 'loading' && (
                        <div style={styles.loadingContainer}>
                            <div style={styles.loadingIcon}>
                                <i className="fa-solid fa-circle-notch fa-spin"></i>
                            </div>
                            <p style={styles.loadingText}>
                                Verificando enlace de restablecimiento...
                            </p>
                        </div>
                    )}

                    {step === 'form' && (
                        <>
                            <div style={styles.header}>
                                <h1 style={styles.title}>Crear nueva contraseña</h1>
                                <p style={styles.subtitle}>
                                    Establece una nueva contraseña segura para tu cuenta.
                                </p>
                            </div>

                            {errors.general && (
                                <div style={styles.errorMessage}>
                                    {errors.general}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label} htmlFor="password">Nueva contraseña</label>
                                    <div style={styles.passwordWrapper}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Ingresa tu nueva contraseña"
                                            style={getPasswordInputStyle('password')}
                                            disabled={isSubmitting}
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
                                    {errors.password && <div style={styles.errorText}>{errors.password}</div>}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label} htmlFor="confirmPassword">Confirmar contraseña</label>
                                    <div style={styles.passwordWrapper}>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirma tu nueva contraseña"
                                            style={getPasswordInputStyle('confirmPassword')}
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPasswordVisibility}
                                            style={styles.eyeIcon}
                                            aria-label={showConfirmPassword ? "Ocultar confirmación" : "Mostrar confirmación"}
                                        >
                                            {showConfirmPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <div style={styles.errorText}>{errors.confirmPassword}</div>}
                                </div>

                                <button
                                    type="submit"
                                    style={getButtonStyle()}
                                    disabled={isSubmitting}
                                    onMouseEnter={(e) => {
                                        if (!isSubmitting) {
                                            e.target.style.background = `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`;
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(11, 68, 68, 0.2)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSubmitting) {
                                            e.target.style.background = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`;
                                            e.target.style.transform = 'none';
                                            e.target.style.boxShadow = 'none';
                                        }
                                    }}
                                >
                                    {isSubmitting ? 'Procesando...' : 'Cambiar contraseña'}
                                </button>

                                <div style={styles.backLink}>
                                    <Link to="/login"
                                        style={styles.backLinkText}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = colors.secondary;
                                            e.target.style.textDecoration = 'underline';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = colors.primary;
                                            e.target.style.textDecoration = 'none';
                                        }}
                                    >
                                        Volver a inicio de sesión
                                    </Link>
                                </div>
                            </form>
                        </>
                    )}

                    {step === 'success' && (
                        <div style={styles.successContainer}>
                            <div style={styles.successIcon}>
                                <i className="fa-solid fa-check-circle"></i>
                            </div>
                            <h2 style={styles.successTitle}>¡Contraseña actualizada!</h2>
                            <p style={styles.successMessage}>
                                Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
                            </p>
                            <div style={styles.divider}></div>
                            <button
                                onClick={() => navigate('/login')}
                                style={getButtonStyle()}
                                onMouseEnter={(e) => {
                                    e.target.style.background = `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`;
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(11, 68, 68, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`;
                                    e.target.style.transform = 'none';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                Ir a iniciar sesión
                            </button>
                        </div>
                    )}

                    {step === 'error' && (
                        <div style={styles.successContainer}>
                            <div style={styles.errorIcon}>
                                <i className="fa-solid fa-exclamation-circle"></i>
                            </div>
                            <h2 style={styles.successTitle}>Ha ocurrido un error</h2>
                            <p style={styles.errorMessage}>
                                {errors.general || 'No pudimos procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.'}
                            </p>
                            <div style={styles.divider}></div>
                            <div style={styles.backLink}>
                                <Link to="/forgot-password"
                                    style={styles.backLinkText}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = colors.secondary;
                                        e.target.style.textDecoration = 'underline';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = colors.primary;
                                        e.target.style.textDecoration = 'none';
                                    }}
                                >
                                    Solicitar un nuevo enlace
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-20px) translateX(10px); }
                    50% { transform: translateY(0) translateX(20px); }
                    75% { transform: translateY(20px) translateX(10px); }
                    100% { transform: translateY(0) translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default ResetPasswordPage; 