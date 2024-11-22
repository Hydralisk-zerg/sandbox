import React, { useState, useEffect } from 'react';
import {
  DatabaseOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Avatar, Space} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/apiClient';
import { Employee } from '../interfaces/IUser';
import { Outlet } from 'react-router-dom'; 
import Logout from '../components/Logout';

const { Header, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

type ContextType = {
  employees: Employee[];
};

const Layouts: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentUser, setCurrentUser] = useState<Employee>();
  const [isLoading, setIsLoading] = useState(true);
  const [dictionaryLists, setDictionaryLists] = useState([])
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const getAvatarUrl = (avatarPath: string)  => {
    if (!avatarPath) {
      return ''; // Если аватар отсутствует, возвращаем пустую строку
    }
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'; // Убедитесь, что базовый URL соответствует вашему серверу
    return `${baseUrl}${avatarPath}`;
  };

  useEffect(() => {
    const fetchEmployeesAndUser = async () => {
      try {
        setIsLoading(true);
        // Делаем запрос для получения информации о текущем пользователе
        setCurrentUser(await api.getCurrentUser());
      } catch (error) {
        console.error('Error fetching employees or current user:', error);
      };
      try {
        setIsLoading(true);
        // Получаем архив с названиями справочников
        const x: any = await api.getDictianaryList()
        setDictionaryLists(x['dictionaries']);
      } catch (error) {
        console.error('Error fetching dictionaries', error);
      };
      try {
        setIsLoading(true);
        // Получаем список сотрудников
        setEmployees(await api.getEmployees());
      } catch (error) {
        console.error('Error fetching employees or current users:', error);
      // Если ошибка 401 (неавторизован), перенаправляем на логин
      if (error instanceof Error && error.message.includes('401')) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
    fetchEmployeesAndUser();
  }, [navigate]);
  
  const formatDictionaryName = (name: string): string => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getDisplayName = (employee: Employee): string => {
    if (employee.firstName && employee.lastName) {
      return `${employee.firstName} ${employee.lastName}`;
    }
    return employee.username;
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const items: MenuItem[] = [
    getItem(<Link to="/home">Home</Link>, '0', <HomeOutlined />),
    getItem('Users', 'sub1', <UserOutlined />, 
      employees.map(employee => getItem(
        <div 
          onClick={() => handleUserClick(employee.id.toString())}
          style={{ cursor: 'pointer' }}
        >
          {getDisplayName(employee)}
        </div>,
        employee.id.toString()
      ))
    ),
    getItem('Dictionary', 'sub2', <DatabaseOutlined />, 
      dictionaryLists.map((dictionaryName) => {
        return getItem(
          <div 
            onClick={() => handleDictionaryClick(dictionaryName)}
            style={{ cursor: 'pointer' }}
          >
            {formatDictionaryName(dictionaryName)}
          </div>,
          dictionaryName
        );
      })
    ),
  ];

  const handleDictionaryClick = (dictionaryName: string) => {
    navigate(`/dictionary/${dictionaryName}`);
    // или любая другая логика
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['0']}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header 
          style={{ 
            padding: 0, 
            background: colorBgContainer, 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center', 
            paddingRight: '16px' 
          }}
        >
          <Space>
            {currentUser && (
              <>
                <Avatar 
                    src={currentUser && getAvatarUrl(currentUser.avatar)} 
                    icon={!currentUser?.avatar && <UserOutlined />}
                  />
                <span>{getDisplayName(currentUser)}</span>
              </>
            )}
            <Logout 
              ghost 
              style={{ marginLeft: '16px' }}
            />
          </Space>
        </Header>
        <Layout.Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer }}>
          <Outlet context={{ employees }} />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Layouts;
export type { ContextType };
 
