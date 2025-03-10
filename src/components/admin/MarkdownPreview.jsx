// src/components/admin/MarkdownPreview.jsx
import React from 'react';
import { colors, spacing, shadows, borderRadius } from '../../styles/theme';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const MarkdownPreview = ({ content }) => {
  const styles = {
    markdownPreview: {
      lineHeight: 1.6,
      color: colors.textPrimary,
      fontFamily: "'Poppins', sans-serif", // Coherente con el resto de la interfaz
      maxWidth: "100%",
      overflowWrap: "break-word",
      height: "100%",
      // Eliminamos márgenes y bordes innecesarios para que se integre mejor
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
    <div style={styles.markdownPreview}>
      <ReactMarkdown 
        rehypePlugins={[rehypeRaw]} // Permite HTML en el markdown
        components={{
          img: ({node, ...props}) => (
            <img 
              {...props} 
              style={{
                maxWidth: '100%',
                boxShadow: shadows.sm,
                borderRadius: borderRadius.md,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.01)';
                e.target.style.boxShadow = shadows.lg;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = shadows.sm;
              }}
            />
          ),
          a: ({node, ...props}) => (
            <a 
              {...props} 
              style={{
                color: colors.primary,
                textDecoration: 'none',
                borderBottom: `1px solid ${colors.secondary}`,
                transition: 'color 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = colors.secondary;
                e.target.style.borderColor = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.target.style.color = colors.primary;
                e.target.style.borderColor = colors.secondary;
              }}
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          table: ({node, ...props}) => (
            <div style={{ overflowX: 'auto', marginBottom: spacing.md }}>
              <table 
                {...props} 
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  boxShadow: shadows.sm,
                  borderRadius: borderRadius.md,
                  overflow: 'hidden'
                }}
              />
            </div>
          ),
          hr: ({node, ...props}) => (
            <hr 
              {...props} 
              style={{
                height: '2px',
                backgroundColor: colors.gray200,
                border: 'none',
                margin: `${spacing.lg} 0`,
                boxShadow: `0 1px 1px ${colors.gray100}`
              }}
            />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;