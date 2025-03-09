// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogDetailPage from './pages/BlogDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPostPage from './pages/AdminPostPage'; // Nueva importación

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/blog/:blogId" component={BlogDetailPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/admin/post" component={AdminPostPage} /> {/* Nueva ruta para crear posts */}
        <Route path="/admin/post/:postId" component={AdminPostPage} /> {/* Ruta para editar posts existentes */}
        
        {/* Ruta de respaldo */}
        <Route component={HomePage} />
      </Switch>
    </Router>
  );
};

export default App;