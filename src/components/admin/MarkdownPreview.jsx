import React from 'react';
import { colors, spacing, shadows, borderRadius } from '../../styles/theme';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const MarkdownPreview = ({ content }) => {
  const styles = {
    previewContainer: {
      width: "100%",
      height: "500px",
      padding: spacing.md,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.gray200}`,
      overflow: "auto",
      backgroundColor: colors.white,
      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
      transition: "all 0.3s ease-in-out",
      maxWidth: "100%", // Asegura que el contenido no sobrepase el ancho
      wordWrap: "break-word" // Asegura que el texto salte de línea
    },
    markdownPreview: {
      lineHeight: 1.6,
      color: colors.textPrimary,
      maxWidth: "100%",
      overflowWrap: "break-word"
    }
  };

  return (
    <div style={styles.previewContainer}>
      <div style={styles.markdownPreview}>
        <ReactMarkdown 
          rehypePlugins={[rehypeRaw]} // Permite HTML en el markdown
          components={{
            img: ({node, ...props}) => (
              <img 
                {...props} 
                style={{
                  maxWidth: '100%',
                  boxShadow: shadows.md,
                  borderRadius: borderRadius.md,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.01)';
                  e.target.style.boxShadow = shadows.lg;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = shadows.md;
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
    </div>
  );
};

export default MarkdownPreview;