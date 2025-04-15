// src/components/auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { colors, spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        const newErrors = {};

        // Validar nombre
        if (!formData.name) {
            newErrors.name = 'El nombre es requerido';
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
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            valid = false;
        }

        // Validar confirmación de contraseña
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
            valid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
            // Simulación de registro exitoso
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Redireccionar a la página de inicio de sesión
            window.location.href = '/login';
        } catch (error) {
            console.error('Error al registrar:', error);
            setErrors({
                ...errors,
                general: 'Error al registrar. Inténtalo nuevamente.'
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
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: shadows.lg,
            backgroundColor: colors.white,
        },
        formContent: {
            padding: spacing.xl,
            display: 'flex',
            flexDirection: 'column',
        },
        registerHeader: {
            marginBottom: spacing.xl,
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
            transition: transitions.default,
            backgroundColor: colors.white,
        },
        errorText: {
            color: colors.error,
            fontSize: typography.fontSize.xs,
            marginTop: spacing.xs,
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
            transition: transitions.default,
            marginBottom: spacing.md,
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
        loginLink: {
            textAlign: 'center',
            marginTop: spacing.md,
            fontSize: typography.fontSize.sm,
            color: colors.primaryLight,
        },
        loginLinkText: {
            color: colors.primary,
            fontWeight: typography.fontWeight.semiBold,
            textDecoration: 'none',
            transition: transitions.default,
        }
    };

    // Definir estilos específicos para bordes de inputs con error
    const getInputStyle = (fieldName) => ({
        ...styles.input,
        borderColor: errors[fieldName] ? colors.error : colors.gray200,
        boxShadow: errors[fieldName] ? `0 0 0 1px ${colors.error}` : 'none',
    });

    return (
        <div style={styles.registerContainer}>
            <Header />

            <main style={styles.mainContent}>
                <div style={styles.formContainer}>
                    <div style={styles.formContent}>
                        <div style={styles.registerHeader}>
                            <h1 style={styles.registerTitle}>Crea tu cuenta</h1>
                            <p style={styles.registerSubtitle}>Completa el formulario para registrarte</p>
                        </div>

                        {errors.general && (
                            <div style={styles.generalError}>
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="name">Nombre completo</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Tu nombre completo"
                                    style={getInputStyle('name')}
                                />
                                {errors.name && <div style={styles.errorText}>{errors.name}</div>}
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
                                    placeholder="Crea una contraseña"
                                    style={getInputStyle('password')}
                                />
                                {errors.password && <div style={styles.errorText}>{errors.password}</div>}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="confirmPassword">Confirma tu contraseña</label>
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

                            <button
                                type="submit"
                                style={styles.registerButton}
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
                                {isSubmitting ? 'Registrando...' : 'Registrarse'}
                            </button>

                            <div style={styles.loginLink}>
                                ¿Ya tienes una cuenta? <Link to="/login" style={{
                                    ...styles.loginLinkText,
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