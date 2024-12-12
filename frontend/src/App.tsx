import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/home';
import Layouts from './layout/index';
import UserPage from './pages/UserPage';
import { AuthProvider } from './components/AuthContext';
import DictionaryPage from './pages/dictionary';
import TaskPage from './pages/task';
import Project from './pages/project';
import Event from './pages/event';
import Template from './pages/template';

// Компонент для защищенных маршрутов
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = document.cookie.includes('token=') || localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App: React.FC = () => {
  const handleLogin = (username: string, password: string) => {
    console.log('Logged in:', username);
  };

  return (
    <AuthProvider>
      <BrowserRouter future={{ 
        v7_startTransition: true,  // Добавлен флаг для устранения предупреждения
        v7_relativeSplatPath: true 
      }}>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layouts />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<Home />} />
            <Route path="user/:userId" element={<UserPage />} />
            <Route path="dictionary/:dictionaryName" element={<DictionaryPage />} />
            <Route path="" element={<Navigate to="/home" replace />} />
            <Route path="task" element={<TaskPage />} />
            <Route path="event" element={<Event />} />
            <Route path="template" element={<Template />} />
            <Route path="project" element={<Project />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
