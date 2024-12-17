// components/ProjectsColumn/index.tsx
import React, { useState } from 'react';
import {
  Card,
  List,
  Button,
  Typography,
  Popconfirm,
  Empty,
  Alert,
  Modal,
  Form,
  Input,
  DatePicker,
  Tag,
  Space,
  Select,
  Dropdown,
  Menu
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ProjectOutlined,
  CalendarOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Project } from '../../types';
import { ProjectsColumnProps } from './types';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const ProjectsColumn: React.FC<ProjectsColumnProps> = ({
  projects,
  loading = false,
  error,
  onProjectAdd,
  onProjectDelete,
  onProjectEdit
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const projectData = {
        ...values,
        startDate: values.dates[0].format('YYYY-MM-DD'),
        endDate: values.dates[1].format('YYYY-MM-DD')
      };

      if (editingProject) {
        onProjectEdit({ ...editingProject, ...projectData });
      } else {
        onProjectAdd(projectData);
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingProject(null);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProject(null);
  };

  const showEditModal = (project: Project) => {
    setEditingProject(project);
    form.setFieldsValue({
      ...project,
      dates: [dayjs(project.startDate), dayjs(project.endDate)]
    });
    setIsModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'green',
      'pending': 'orange',
      'completed': 'blue',
      'cancelled': 'red'
    };
    return colors[status.toLowerCase()] || 'default';
  };

  const renderContent = () => {
    if (error) {
      return (
        <Alert
          message="Ошибка"
          description={error}
          type="error"
          showIcon
        />
      );
    }

    return (
      <List
        loading={loading}
        dataSource={projects}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Нет проектов"
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Создать первый проект
              </Button>
            </Empty>
          )
        }}
        renderItem={(project) => (
          <List.Item
            key={project.id}
            actions={[
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="edit"
                      icon={<EditOutlined />}
                      onClick={() => showEditModal(project)}
                    >
                      Редактировать
                    </Menu.Item>
                    <Menu.Item
                      key="delete"
                      danger
                      icon={<DeleteOutlined />}
                    >
                      <Popconfirm
                        title="Удалить проект?"
                        description="Это действие нельзя отменить"
                        onConfirm={() => onProjectDelete(project.id)}
                        okText="Да"
                        cancelText="Нет"
                      >
                        Удалить
                      </Popconfirm>
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <Button type="link" icon={<MoreOutlined />} />
              </Dropdown>
            ]}
          >
            <List.Item.Meta
              avatar={<ProjectOutlined style={{ fontSize: '24px' }} />}
              title={
                <Space>
                  {project.name}
                  <Tag color={getStatusColor(project.status)}>
                    {project.status}
                  </Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size="small">
                  {project.description && (
                    <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                      {project.description}
                    </Paragraph>
                  )}
                  <Space>
                    <CalendarOutlined />
                    {`${project.startDate} - ${project.endDate}`}
                  </Space>
                </Space>
              }
            />
          </List.Item>

        )}
        style={{
          height: 'calc(100vh - 200px)',
          overflowY: 'auto'
        }}
      />
    );
  };

  return (
    <>
      <Card
        title={<Title level={4}>Проекты</Title>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            disabled={loading}
            ghost
          >
            Создать проект
          </Button>
        }
        style={{ width: '100%', height: '100%' }}
      >
        {renderContent()}
      </Card>

      <Modal
        title={editingProject ? "Редактировать проект" : "Создать проект"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingProject ? "Сохранить" : "Создать"}
        cancelText="Отмена"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название проекта' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Описание"
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="dates"
            label="Период"
            rules={[{ required: true, message: 'Выберите период проекта' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Статус"
            rules={[{ required: true, message: 'Выберите статус проекта' }]}
          >
            <Select>
              <Select.Option value="active">Активный</Select.Option>
              <Select.Option value="pending">В ожидании</Select.Option>
              <Select.Option value="completed">Завершен</Select.Option>
              <Select.Option value="cancelled">Отменен</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectsColumn