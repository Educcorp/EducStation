import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { colors, spacing, typography } from '../../styles/theme';
import { verifyResetToken, resetPassword } from '../../services/authService';
import '@fortawesome/fontawesome-free/css/all.css';
import { ThemeContext } from '../../context/ThemeContext';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
    useEffect(() => {
        const getToken = () => {
            // Intentar obtener de params
            const params = new URLSearchParams(location.search);
            const queryToken = params.get('token');
            
            if (queryToken) {
                return queryToken;
            }
            
            // Intentar obtener de la ruta
            const pathSegments = location.pathname.split('/');
            const lastSegment = pathSegments[pathSegments.length - 1];
            
            if (lastSegment && lastSegment !== 'reset-password') {
                return lastSegment;
            }
            
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
    }, [location]);

    const verifyToken = async (tokenValue) => {
        try {
            await verifyResetToken(tokenValue);
            setStep('form');
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
            backgroundColor: colors.background,
            display: 'flex',
            flexDirection: 'column',
        },
        navContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `${spacing.md} ${spacing.xl}`,
            backgroundColor: 'transparent',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
        },
        logoImg: {
            height: '36px',
            marginRight: spacing.sm,
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
        },
        formContainer: {
            width: "100%",
            maxWidth: "600px",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: '0 15px 30px rgba(11, 68, 68, 0.2)',
            backgroundColor: colors.white,
            padding: spacing.xl,
        },
        header: {
            marginBottom: spacing.xl,
            textAlign: 'center',
        },
        title: {
            color: colors.primary,
            fontSize: typography.fontSize.xxl,
            marginBottom: spacing.sm,
        },
        subtitle: {
            color: colors.primaryLight,
            fontSize: typography.fontSize.md,
            maxWidth: '450px',
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
        },
        input: {
            width: '100%',
            padding: `${spacing.sm} ${spacing.md}`,
            border: `1px solid ${colors.gray200}`,
            borderRadius: '6px',
            fontSize: typography.fontSize.md,
            transition: 'all 0.3s ease',
            backgroundColor: colors.white,
        },
        passwordInput: {
            width: '100%',
            padding: `${spacing.sm} ${spacing.md}`,
            paddingRight: '40px', // Espacio para el icono
            border: `1px solid ${colors.gray200}`,
            borderRadius: '6px',
            fontSize: typography.fontSize.md,
            transition: 'all 0.3s ease',
            backgroundColor: colors.white,
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
            borderRadius: '6px',
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.medium,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: spacing.md,
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
            {/* Logo simplificado en lugar del Header */}
            <div style={styles.navContainer}>
                <Link to="/" style={styles.logo}>
                    <img src="/assets/images/Icon.png" alt="EducStation Logo" style={styles.logoImg} />
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

            {/* Estilos para la animación de carga */}
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
        </div>
    );
};

export default ResetPasswordPage; 