// components/Logout.tsx
import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiClient';
import { LogoutOutlined } from '@ant-design/icons';

interface LogoutProps {
  className?: string;
  style?: React.CSSProperties;
  ghost?: boolean;
}

const Logout: React.FC<LogoutProps> = ({ className, style, ghost }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.logout();
      localStorage.removeItem('token');
      message.success('Вихід успішний');
      navigate('/login');
    } catch (error: any) {
      message.error('Помилка виходу: ' + error.message);
    }
  };

  return (
    <Button 
      type="primary"
      ghost={ghost}
      icon={<LogoutOutlined />}
      onClick={handleLogout}
      className={className}
      style={style}
    >
      Logout
    </Button>
  );
};

export default Logout;
