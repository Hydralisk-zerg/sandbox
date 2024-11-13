import React from 'react';
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

  const onLoginHandler = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/login/get_users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Network response was not ok');
      }

      message.success('Login successful!');
      onLogin(username, password); // Устанавливаем аутентификацию
      navigate('/home'); // Перенаправляем на /home
    } catch (error: any) {
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
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
