// Índice de componentes del blog
// Este archivo centraliza todas las exportaciones de componentes relacionados con el blog

export { default as PostList } from './PostList';
export { default as PostCard } from './PostCard';
export { default as PostDetail } from './PostDetail';
export { default as PostViewer } from './PostViewer';
export { default as PostSidebar } from './PostSidebar';
export { default as FeaturedPost } from './FeaturedPost';
export { default as CommentSection } from './CommentSection';
export { default as ReactionSection } from './ReactionSection';

// Re-exportación para compatibilidad con importaciones existentes
export { PostList as BlogPostList } from './PostList';
export { PostCard as BlogPostCard } from './PostCard';
export { PostDetail as BlogPostDetail } from './PostDetail'; 