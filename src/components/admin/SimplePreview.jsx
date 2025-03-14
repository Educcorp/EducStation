import React from 'react';
import { colors, spacing, shadows, borderRadius } from '../../styles/theme';

const SimplePreview = ({ title, content }) => {
  const styles = {
    simplePreview: {
      lineHeight: 1.6,
      color: colors.textPrimary,
      fontFamily: "'Poppins', sans-serif",
      maxWidth: "100%",
      overflowWrap: "break-word",
      height: "100%",
      '& p': {
        marginBottom: spacing.md
      },
      '& h1': {
        fontSize: '1.8em',
        fontWeight: 'bold',
        marginBottom: spacing.md,
        marginTop: spacing.lg,
        color: colors.primary
      },
      '& h2': {
        fontSize: '1.5em',
        fontWeight: 'semibold',
        marginTop: spacing.lg,
        marginBottom: spacing.md,
        color: colors.primary
      },
      '& ul, & ol': {
        paddingLeft: spacing.xl,
        marginBottom: spacing.lg
      },
      '& li': {
        marginBottom: spacing.sm
      },
      '& blockquote': {
        borderLeft: `4px solid ${colors.primary}`,
        padding: `${spacing.sm} ${spacing.lg}`,
        backgroundColor: 'rgba(11, 68, 68, 0.05)',
        fontStyle: "italic",
        margin: `${spacing.md} 0`,
        borderRadius: `0 ${borderRadius.sm} ${borderRadius.sm} 0`
      }
    }
  };

  return (
    <div style={styles.simplePreview}>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default SimplePreview;
