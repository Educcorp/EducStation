import React, { useState } from 'react';

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment) {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  const styles = {
    container: {
      marginTop: '20px',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
    },
    title: {
      fontSize: '1.5em',
      marginBottom: '10px',
    },
    textarea: {
      width: '100%',
      height: '80px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      padding: '10px',
      marginBottom: '10px',
      fontSize: '1em',
      resize: 'none',
    },
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 15px',
      cursor: 'pointer',
      fontSize: '1em',
    },
    commentList: {
      listStyleType: 'none',
      padding: '0',
    },
    commentItem: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Comentarios</h3>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          style={styles.textarea}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribe tu comentario aquí..."
          required
        />
        <button type="submit" style={styles.button}>Enviar</button>
      </form>
      <ul style={styles.commentList}>
        {comments.map((c, index) => (
          <li key={index} style={styles.commentItem}>{c}</li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
