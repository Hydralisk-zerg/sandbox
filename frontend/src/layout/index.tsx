import React, { useState, useEffect } from 'react';
import {
  AlertOutlined,
  BarsOutlined,
  BookOutlined,
  BuildOutlined,
  DatabaseOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Avatar, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/apiClient';
import { Employee } from '../interfaces/interfase';
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
  const [, setIsLoading] = useState(true);
  const [dictionaryLists, setDictionaryLists] = useState<any[]>([])
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const getAvatarUrl = (avatarPath: string) => {
    if (!avatarPath) {
      return '';
    }
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
    return `${baseUrl}${avatarPath}`;
  };

  useEffect(() => {
    const fetchEmployeesAndUser = async () => {
      try {
        setIsLoading(true);
        setCurrentUser(await api.getCurrentUser());
      } catch (error) {
        console.error('Error fetching employees or current user:', error);
      };
      try {
        setIsLoading(true);
        const x: any = await api.getDictianaryList()
        setDictionaryLists(x['dictionaries']);
      } catch (error) {
        console.error('Error fetching dictionaries', error);
      };
      try {
        setIsLoading(true);
        setEmployees(await api.getEmployees());
      } catch (error) {
        console.error('Error fetching employees or current users:', error);
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
      dictionaryLists.map((dictionaryName: any) => {
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
    getItem('Logs', 'sub3', <BookOutlined />, [
      getItem(<Link to="/project">Projects</Link>, '31', <DatabaseOutlined />),
      getItem(<Link to="/task">Tasks</Link>, '32', <BarsOutlined />),
      getItem(<Link to="/event">Events</Link>, '33', <AlertOutlined />),
      getItem(<Link to="/template">Templates</Link>, '34', <BuildOutlined />),
    ])
  ];

  const handleDictionaryClick = (dictionaryName: string) => {
    navigate(`/dictionary/${dictionaryName}`);
  };

  return (
    <Layout style={{ minHeight: '99vh', minWidth: '1450px'}}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div
          style={{
            height: 64,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Место для логотипа */}
        </div>
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
                  src={getAvatarUrl(currentUser.avatar) || undefined}
                  icon={!getAvatarUrl(currentUser.avatar) ? <UserOutlined /> : null}
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
