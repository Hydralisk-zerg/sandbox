import React, { useEffect, useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';

type FieldType = {
  username: string;
  password: string;
};

interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/csrf-token/', {
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
        } else {
          console.error('CSRF token not found in response');
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const onLoginHandler = async (username: string, password: string) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }
  
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      
      const responseData = await response.json();
      console.log('Login response:', responseData); // Додайте цей лог
  
      if (!response.ok) {
        throw new Error(responseData.detail || 'Network response was not ok');
      }
  
      // Перевіряємо наявність токену у відповіді
      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
      }
  
      message.success('Login successful!');
      onLogin(username, password);
      navigate('/home', { replace: true }); // Додаємо replace: true
    } catch (error: any) {
      console.error('Login error:', error); // Додайте детальніший лог помилки
      message.error('Login failed: ' + error.message);
    }
  };
  
  

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    onLoginHandler(values.username, values.password);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: 400 }}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" disabled={!csrfToken}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
