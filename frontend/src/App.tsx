import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/home';
import Layouts from './layout/index';
import UserPage from './pages/UserPage'; // Добавляем импорт UserPage
import { BrowserRouter } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login onLogin={function (username: string, password: string): void {
        throw new Error('Function not implemented.');
      } } />} />
      <Route path="/" element={<Layouts />}>
        <Route path="home" element={<Home />} />
        <Route path="user/:userId" element={<UserPage />} /> {/* Добавляем маршрут для UserPage */}
        <Route path="" element={<Navigate to="/home" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
    </BrowserRouter>
  );
};

export default App;
