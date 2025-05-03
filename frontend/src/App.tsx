import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { TodoProvider } from './contexts/TodoContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Index from './pages/Index';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/me/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'text/plain',
          },
        });
        console.log(response);
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  if (!authChecked) {
    return null;
  }

  return (
    <TodoProvider>
      <Router>
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/index" element={<Index />} />
              <Route path="/login" element={<Navigate to="/index" replace />} />
              <Route path="/register" element={<Navigate to="/index" replace />} />
              <Route path="*" element={<Navigate to="/index" replace />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </TodoProvider>
  );
};

export default App;