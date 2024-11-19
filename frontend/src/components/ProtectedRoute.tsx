import React from 'react';
import { useNavigate } from 'react-router-dom';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};


export default ProtectedRoute;