// src/components/auth/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { colors, spacing, typography } from '../../styles/theme';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { login } from '../../services/authService';
import AuthContext from '../../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { updateAuthState } = useContext(AuthContext);
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const validateForm = () => {
        let valid = true;
        const newErrors = { email: '', password: '', general: '' };

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
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Llamar a la API de login
            const userData = await login({
                email: formData.email,
                password: formData.password
            });
            
            // Actualizar el estado de autenticación
            updateAuthState(userData);
            
            // Redireccionar a la página principal
            navigate('/');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setErrors({
                ...errors,
                general: 'Error al iniciar sesión. Verifica tus credenciales e intenta nuevamente.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const styles = {
        loginContainer: {
            minHeight: '100vh',
            backgroundColor: colors.background,
            display: 'flex',
            flexDirection: 'column',
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
            maxWidth: "1000px",
            display: "flex",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: '0 15px 30px rgba(11, 68, 68, 0.2)',
            backgroundColor: colors.white,
        },
        loginImage: {
            flex: 1,
            backgroundImage: "url('/assets/images/humanos.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '@media (max-width: 768px)': {
                display: 'none'
            }
        },
        imageOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${colors.primary}e6 0%, ${colors.primaryLight}cc 100%)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: spacing.xl,
            color: colors.white,
        },
        logoContainer: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: spacing.lg,
        },
        logoIcon: {
            width: '48px',
            height: '48px',
            backgroundColor: colors.white,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.sm,
        },
        logoText: {
            fontSize: '28px',
            fontWeight: typography.fontWeight.bold,
        },
        imageText: {
            fontSize: typography.fontSize.lg,
            lineHeight: 1.6,
            marginBottom: spacing.xl,
        },
        imageQuote: {
            fontStyle: 'italic',
            opacity: 0.9,
            fontSize: typography.fontSize.md,
            position: 'relative',
            paddingLeft: spacing.lg,
            borderLeft: `3px solid ${colors.secondary}`,
        },
        formContent: {
            flex: 1,
            padding: spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        },
        loginHeader: {
            marginBottom: spacing.xl,
        },
        loginTitle: {
            color: colors.primary,
            fontSize: typography.fontSize.xxl,
            marginBottom: spacing.sm,
        },
        loginSubtitle: {
            color: colors.primaryLight,
            fontSize: typography.fontSize.md,
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
        errorText: {
            color: colors.error,
            fontSize: typography.fontSize.xs,
            marginTop: spacing.xs,
        },
        rememberForgot: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.lg,
            fontSize: typography.fontSize.sm,
        },
        checkbox: {
            display: 'flex',
            alignItems: 'center',
            color: colors.primaryLight,
            cursor: 'pointer',
        },
        checkboxInput: {
            marginRight: spacing.xs,
            accentColor: colors.primary,
        },
        forgotLink: {
            color: colors.primary,
            textDecoration: 'none',
            transition: 'color 0.3s ease',
            '&:hover': {
                color: colors.secondary,
                textDecoration: 'underline',
            }
        },
        loginButton: {
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
            '&:hover': {
                background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`,
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(11, 68, 68, 0.2)',
            },
            '&:disabled': {
                opacity: 0.7,
                cursor: 'not-allowed',
                transform: 'none',
                boxShadow: 'none',
            }
        },
        registerLink: {
            textAlign: 'center',
            marginTop: spacing.xl,
            fontSize: typography.fontSize.sm,
            color: colors.primaryLight,
        },
        registerLinkText: {
            color: colors.primary,
            fontWeight: typography.fontWeight.semiBold,
            textDecoration: 'none',
            transition: 'color 0.3s ease',
            '&:hover': {
                color: colors.secondary,
                textDecoration: 'underline',
            }
        },
        generalError: {
            backgroundColor: `${colors.error}15`,
            color: colors.error,
            padding: spacing.md,
            borderRadius: '6px',
            marginBottom: spacing.lg,
            textAlign: 'center',
            fontSize: typography.fontSize.sm,
        }
    };

    // Definir estilos específicos para bordes de inputs con error
    const getInputStyle = (fieldName) => ({
        ...styles.input,
        borderColor: errors[fieldName] ? colors.error : colors.gray200,
        boxShadow: errors[fieldName] ? `0 0 0 1px ${colors.error}` : 'none',
    });

    // Estilos para aplicar hover en el botón
    const getButtonStyle = () => ({
        ...styles.loginButton,
        ...(isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}),
    });

    return (
        <div style={styles.loginContainer}>
            <Header />

            <main style={styles.mainContent}>
                <div style={styles.formContainer}>
                    <div style={styles.loginImage}>
                        <div style={styles.imageOverlay}>
                            <div style={styles.logoContainer}>
                                <div style={styles.logoIcon}>
                                    <img src="/assets/images/Icon.png" alt="Logo" style={{ width: '30px', height: '30px' }} />
                                </div>
                                <div style={styles.logoText}>EducStation</div>
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
                        <div style={styles.loginHeader}>
                            <h1 style={styles.loginTitle}>¡Bienvenido de nuevo!</h1>
                            <p style={styles.loginSubtitle}>Ingresa tus credenciales para acceder a tu cuenta</p>
                        </div>

                        {errors.general && (
                            <div style={styles.generalError}>
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="email">Correo electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="correo@ejemplo.com"
                                    style={getInputStyle('email')}
                                />
                                {errors.email && <div style={styles.errorText}>{errors.email}</div>}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="password">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu contraseña"
                                    style={getInputStyle('password')}
                                />
                                {errors.password && <div style={styles.errorText}>{errors.password}</div>}
                            </div>

                            <div style={styles.rememberForgot}>
                                <label style={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        name="remember"
                                        checked={formData.remember}
                                        onChange={handleChange}
                                        style={styles.checkboxInput}
                                    />
                                    Recordar sesión
                                </label>
                                <Link to="/forgot-password" style={{
                                    ...styles.forgotLink,
                                    "&:hover": {
                                        color: colors.secondary,
                                        textDecoration: 'underline',
                                    }
                                }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = colors.secondary;
                                        e.target.style.textDecoration = 'underline';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = colors.primary;
                                        e.target.style.textDecoration = 'none';
                                    }}>
                                    ¿Olvidaste tu contraseña?
                                </Link>
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
                                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>

                            <div style={styles.registerLink}>
                                ¿No tienes una cuenta? <Link to="/register" style={{
                                    ...styles.registerLinkText,
                                    "&:hover": {
                                        color: colors.secondary,
                                        textDecoration: 'underline',
                                    }
                                }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = colors.secondary;
                                        e.target.style.textDecoration = 'underline';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = colors.primary;
                                        e.target.style.textDecoration = 'none';
                                    }}>Regístrate ahora</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LoginPage;