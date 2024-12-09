import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/home';
import Layouts from './layout/index';
import UserPage from './pages/UserPage';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import DictionaryPage from './pages/dictionary';
import TaskPage from './pages/task';
import Project from './pages/project';
import Event from './pages/event';
import Template from './pages/template';


// Компонент для захищених маршрутів
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
      <BrowserRouter>
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
            <Route path="task" element={<TaskPage/>} />
            <Route path="event" element={<Event/>} />
            <Route path="template" element={<Template/>} />
            <Route path="project" element={<Project/>} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};



export default App;
