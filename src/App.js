import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Post from './pages/Post';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/post/:id" component={Post} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;