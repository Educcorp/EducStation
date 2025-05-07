// src/components/auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { colors, spacing, typography } from '../../styles/theme';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { register } from '../../services/authService';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: '',
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
        const newErrors = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            termsAccepted: '',
            general: ''
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

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        try {
            // Asegurarse de que los nombres de los campos coincidan exactamente
            await register({
                username: formData.email, // Backend espera un username
                email: formData.email,
                password: formData.password,
                password2: formData.confirmPassword,
                first_name: formData.firstName,
                last_name: formData.lastName
            });
            
            // Redirigir al login después del registro exitoso
            navigate('/login', { 
                state: { message: '¡Registro exitoso! Ahora puedes iniciar sesión.' } 
            });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            
            // Mejorar manejo de errores en la UI
            setErrors({
                ...errors,
                general: error.message || 'Error al registrar. Por favor intenta nuevamente.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const styles = {
        registerContainer: {
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
        registerImage: {
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
            maxHeight: '800px',
            overflowY: 'auto',
        },
        registerHeader: {
            marginBottom: spacing.lg,
        },
        registerTitle: {
            color: colors.primary,
            fontSize: typography.fontSize.xxl,
            marginBottom: spacing.sm,
        },
        registerSubtitle: {
            color: colors.primaryLight,
            fontSize: typography.fontSize.md,
        },
        formRow: {
            display: 'flex',
            gap: spacing.md,
            marginBottom: spacing.md,
        },
        formGroup: {
            marginBottom: spacing.lg,
            position: 'relative',
            flex: 1,
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
        termsContainer: {
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: spacing.lg,
            fontSize: typography.fontSize.sm,
            color: colors.primaryLight,
        },
        checkbox: {
            marginRight: spacing.xs,
            marginTop: '2px',
            accentColor: colors.primary,
        },
        termsLink: {
            color: colors.primary,
            textDecoration: 'none',
            transition: 'color 0.3s ease',
        },
        registerButton: {
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
        loginLink: {
            textAlign: 'center',
            marginTop: spacing.xl,
            fontSize: typography.fontSize.sm,
            color: colors.primaryLight,
        },
        loginLinkText: {
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
        },
        passwordRequirements: {
            fontSize: typography.fontSize.xs,
            color: colors.primaryLight,
            marginTop: spacing.xs,
            lineHeight: 1.4,
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
        ...styles.registerButton,
        ...(isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}),
    });

    return (
        <div style={styles.registerContainer}>
            <Header />

            <main style={styles.mainContent}>
                <div style={styles.formContainer}>
                    <div style={styles.registerImage}>
                        <div style={styles.imageOverlay}>
                            <div style={styles.logoContainer}>
                                <div style={styles.logoIcon}>
                                    <img src="/assets/images/Icon.png" alt="Logo" style={{ width: '30px', height: '30px' }} />
                                </div>
                                <div style={styles.logoText}>EducStation</div>
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
                        <div style={styles.registerHeader}>
                            <h1 style={styles.registerTitle}>Crea tu cuenta</h1>
                            <p style={styles.registerSubtitle}>Completa el formulario para unirte a nuestra plataforma</p>
                        </div>

                        {errors.general && (
                            <div style={styles.generalError}>
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label} htmlFor="firstName">Nombre</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Tu nombre"
                                        style={getInputStyle('firstName')}
                                    />
                                    {errors.firstName && <div style={styles.errorText}>{errors.firstName}</div>}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label} htmlFor="lastName">Apellido</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Tu apellido"
                                        style={getInputStyle('lastName')}
                                    />
                                    {errors.lastName && <div style={styles.errorText}>{errors.lastName}</div>}
                                </div>
                            </div>

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
                                    placeholder="Crea una contraseña segura"
                                    style={getInputStyle('password')}
                                />
                                {errors.password && <div style={styles.errorText}>{errors.password}</div>}
                                <div style={styles.passwordRequirements}>
                                    La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula,
                                    una minúscula y un número.
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="confirmPassword">Confirmar contraseña</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repite tu contraseña"
                                    style={getInputStyle('confirmPassword')}
                                />
                                {errors.confirmPassword && <div style={styles.errorText}>{errors.confirmPassword}</div>}
                            </div>

                            <div style={styles.termsContainer}>
                                <input
                                    type="checkbox"
                                    id="termsAccepted"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleChange}
                                    style={styles.checkbox}
                                />
                                <label htmlFor="termsAccepted">
                                    He leído y acepto los <Link to="/terms" style={{
                                        ...styles.termsLink,
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
                                        }}>términos y condiciones</Link> y la <Link to="/privacy" style={{
                                            ...styles.termsLink,
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
                                            }}>política de privacidad</Link>.
                                </label>
                            </div>
                            {errors.termsAccepted && <div style={styles.errorText}>{errors.termsAccepted}</div>}

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
                                {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
                            </button>

                            <div style={styles.loginLink}>
                                ¿Ya tienes una cuenta? <Link to="/login" style={{
                                    ...styles.loginLinkText,
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
                                    }}>Inicia sesión</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default RegisterPage;