import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { colors, spacing, typography } from '../../styles/theme';
import { requestPasswordReset } from '../../services/authService';
import '@fortawesome/fontawesome-free/css/all.css';
import { ThemeContext } from '../../context/ThemeContext';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const { setForceLightMode } = useContext(ThemeContext);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState('form'); // 'form', 'success', 'error'
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState(null);
    const isDev = process.env.NODE_ENV === 'development';

    // Forzar el modo claro inmediatamente
    // Usando useLayoutEffect para que se ejecute antes del renderizado
    React.useLayoutEffect(() => {
        setForceLightMode(true);
        return () => setForceLightMode(false);
    }, [setForceLightMode]);

    const handleChange = (e) => {
        setEmail(e.target.value);
        setError('');
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setError('Por favor ingresa tu correo electrónico.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Por favor ingresa un correo electrónico válido.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setDebugInfo(null);

        try {
            const response = await requestPasswordReset(email);
            
            // Si estamos en desarrollo y hay información de depuración, la guardamos
            if (isDev && response.debug_info) {
                setDebugInfo(response.debug_info);
            }
            
            setStep('success');
        } catch (error) {
            console.error('Error al solicitar restablecimiento:', error);
            
            // Manejar específicamente el error de correo no encontrado
            if (error.message.includes('No existe ninguna cuenta con este correo')) {
                setError('No existe ninguna cuenta con este correo electrónico. Por favor, verifica que has introducido el correo correcto.');
            } else {
                setError(error.message || 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
            }
            
            setStep('error');
        } finally {
            setIsSubmitting(false);
        }
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
        debugInfo: {
            marginTop: spacing.lg,
            padding: spacing.md,
            backgroundColor: `${colors.gray200}15`,
            borderRadius: '6px',
            textAlign: 'left',
        },
        debugTitle: {
            color: colors.primary,
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.bold,
            marginBottom: spacing.xs,
        },
        debugText: {
            color: colors.primaryLight,
            fontSize: typography.fontSize.sm,
            marginBottom: spacing.xs,
        },
        debugLink: {
            color: colors.primary,
            textDecoration: 'none',
            transition: 'color 0.3s ease',
        },
        debugNote: {
            color: colors.primaryLight,
            fontSize: typography.fontSize.sm,
            marginTop: spacing.xs,
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
    const getInputStyle = () => ({
        ...styles.input,
        borderColor: error ? colors.error : colors.gray200,
        boxShadow: error ? `0 0 0 1px ${colors.error}` : 'none',
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
                    {step === 'form' && (
                        <>
                            <div style={styles.header}>
                                <h1 style={styles.title}>Recupera tu contraseña</h1>
                                <p style={styles.subtitle}>
                                    Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                                </p>
                            </div>

                            {error && (
                                <div style={styles.errorMessage}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label} htmlFor="email">Correo electrónico</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={handleChange}
                                        placeholder="tu.correo@ejemplo.com"
                                        style={getInputStyle()}
                                        disabled={isSubmitting}
                                    />
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
                                    {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
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
                            <h2 style={styles.successTitle}>¡Correo enviado!</h2>
                            <p style={styles.successMessage}>
                                Te hemos enviado un correo electrónico con las instrucciones para restablecer tu contraseña.
                                Revisa tu bandeja de entrada y sigue el enlace proporcionado.
                            </p>
                            <p style={styles.successMessage}>
                                Si no ves el correo en tu bandeja de entrada, revisa tu carpeta de spam.
                            </p>
                            
                            {/* Información de depuración en desarrollo */}
                            {isDev && debugInfo && (
                                <div style={styles.debugInfo}>
                                    <h3 style={styles.debugTitle}>Información de depuración</h3>
                                    <p style={styles.debugText}>
                                        <strong>Token:</strong> {debugInfo.token}
                                    </p>
                                    <p style={styles.debugText}>
                                        <strong>URL:</strong> <a href={debugInfo.reset_url} target="_blank" rel="noopener noreferrer" style={styles.debugLink}>{debugInfo.reset_url}</a>
                                    </p>
                                    <p style={styles.debugNote}>
                                        {debugInfo.note}
                                    </p>
                                </div>
                            )}
                            
                            <div style={styles.divider}></div>
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
                        </div>
                    )}

                    {step === 'error' && (
                        <div style={styles.successContainer}>
                            <div style={styles.errorIcon}>
                                <i className="fa-solid fa-exclamation-circle"></i>
                            </div>
                            <h2 style={styles.successTitle}>Ha ocurrido un error</h2>
                            <p style={styles.errorMessage}>
                                {error || 'No pudimos procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.'}
                            </p>
                            <button
                                onClick={() => setStep('form')}
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
                                Intentar nuevamente
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

export default ForgotPasswordPage; 

