// src/components/auth/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { colors, spacing, typography, shadows, borderRadius, transitions } from '../../styles/theme';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación básica del email
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Por favor, ingresa una dirección de correo electrónico válida');
            return;
        }

        setError('');
        setIsSubmitting(true);

        // Simulación de envío de email de recuperación
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setEmailSent(true);
        } catch (err) {
            setError('Error al enviar el correo. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const styles = {
        container: {
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
        header: {
            marginBottom: spacing.xl,
        },
        title: {
            color: colors.primary,
            fontSize: typography.fontSize.xxl,
            marginBottom: spacing.sm,
        },
        subtitle: {
            color: colors.primaryLight,
            fontSize: typography.fontSize.md,
        },
        formGroup: {
            marginBottom: spacing.lg,
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
        submitButton: {
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
        successMessage: {
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            color: '#388e3c',
            padding: spacing.md,
            borderRadius: '6px',
            marginBottom: spacing.lg,
            textAlign: 'center',
            fontSize: typography.fontSize.sm,
        },
        backLink: {
            textAlign: 'center',
            marginTop: spacing.md,
            fontSize: typography.fontSize.sm,
            color: colors.primaryLight,
        },
        linkText: {
            color: colors.primary,
            fontWeight: typography.fontWeight.semiBold,
            textDecoration: 'none',
            transition: transitions.default,
        }
    };

    return (
        <div style={styles.container}>
            <Header />

            <main style={styles.mainContent}>
                <div style={styles.formContainer}>
                    <div style={styles.formContent}>
                        <div style={styles.header}>
                            <h1 style={styles.title}>Recupera tu contraseña</h1>
                            <p style={styles.subtitle}>
                                {emailSent
                                    ? 'Hemos enviado instrucciones a tu correo'
                                    : 'Ingresa tu correo electrónico para recibir instrucciones'}
                            </p>
                        </div>

                        {emailSent ? (
                            <>
                                <div style={styles.successMessage}>
                                    Se ha enviado un correo a <strong>{email}</strong> con instrucciones para recuperar tu contraseña.
                                </div>
                                <div style={styles.backLink}>
                                    <Link to="/login" style={{
                                        ...styles.linkText,
                                    }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = colors.secondary;
                                            e.target.style.textDecoration = 'underline';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = colors.primary;
                                            e.target.style.textDecoration = 'none';
                                        }}>
                                        Volver a Iniciar sesión
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label} htmlFor="email">Correo electrónico</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                        style={{
                                            ...styles.input,
                                            borderColor: error ? colors.error : colors.gray200,
                                            boxShadow: error ? `0 0 0 1px ${colors.error}` : 'none',
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.boxShadow = `0 0 0 2px ${colors.primary}30`;
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.boxShadow = error ? `0 0 0 1px ${colors.error}` : 'none';
                                        }}
                                    />
                                    {error && <div style={styles.errorText}>{error}</div>}
                                </div>

                                <button
                                    type="submit"
                                    style={styles.submitButton}
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
                                    {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
                                </button>

                                <div style={styles.backLink}>
                                    <Link to="/login" style={{
                                        ...styles.linkText,
                                    }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = colors.secondary;
                                            e.target.style.textDecoration = 'underline';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = colors.primary;
                                            e.target.style.textDecoration = 'none';
                                        }}>
                                        Volver a Iniciar sesión
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ForgotPasswordPage;