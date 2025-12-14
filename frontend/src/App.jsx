import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Search from './pages/Search';
import PostDetail from './pages/PostDetail';
import CreateStory from './pages/CreateStory';
import StoryViewer from './pages/StoryViewer';

import Navbar from './components/Navbar';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/feed" /> : <Login />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/feed" /> : <Signup />
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Layout>
                  <Feed />
                </Layout>
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Layout>
                  <CreatePost />
                </Layout>
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Layout>
                  <Profile />
                </Layout>
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Layout>
                  <Search />
                </Layout>
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:postId"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Layout>
                  <PostDetail />
                </Layout>
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stories/create"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Layout>
                  <CreateStory />
                </Layout>
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stories/:userId"
          element={
            <ProtectedRoute>
              <StoryViewer />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/feed" />} />
      </Routes>
    </Router>
  );
}

export default App;
