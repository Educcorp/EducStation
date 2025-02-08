import React, { useState, useEffect } from 'react';
import PostList from './PostList';
import PostEditor from './PostEditor';

function AdminPanel() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    // Fetch posts from the server
    fetch('/api/posts')
      .then(response => response.json())
      .then(data => setPosts(data));
  }, []);

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleDelete = (postId) => {
    // Delete post from the server
    fetch(`/api/posts/${postId}`, { method: 'DELETE' })
      .then(() => {
        setPosts(posts.filter(post => post._id !== postId));
      });
  };

  return (
    <div>
      <h2>Panel de Administración</h2>
      {editingPost ? (
        <PostEditor post={editingPost} setEditingPost={setEditingPost} />
      ) : (
        <PostList posts={posts} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default AdminPanel;