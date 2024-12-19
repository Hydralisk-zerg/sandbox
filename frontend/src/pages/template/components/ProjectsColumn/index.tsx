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
  Dropdown,
  Menu,
  Select,
  Space,
  Tag
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Project, ProjectsColumnProps } from '../../../../interfaces/interfase';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ProjectsColumn: React.FC<ProjectsColumnProps> = ({
  projects,
  tasks,
  events,
  templates,
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
        linkedItems: {
          tasks: values.tasks || [],
          events: values.events || [],
          templates: values.templates || []
        }
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
    form.setFieldsValue(project);
    setIsModalVisible(true);
  };
  const renderLinkedItems = (project: Project) => {
    // Проверяем наличие linkedItems
    if (!project.linkedItems) {
      return null;
    }
  
    const linkedTasks = tasks.filter(task => 
      project.linkedItems?.tasks?.includes(task.id)
    );
    const linkedEvents = events.filter(event => 
      project.linkedItems?.events?.includes(event.id)
    );
    const linkedTemplates = templates.filter(template => 
      project.linkedItems?.templates?.includes(template.id)
    );
  
    return (
      <Space direction="vertical" size={4}>
        {linkedTasks.length > 0 && (
          <div>
            <Typography.Text type="secondary">Задачи: </Typography.Text>
            {linkedTasks.map(task => (
              <Tag key={task.id}>{task.name}</Tag>
            ))}
          </div>
        )}
        {linkedEvents.length > 0 && (
          <div>
            <Typography.Text type="secondary">События: </Typography.Text>
            {linkedEvents.map(event => (
              <Tag key={event.id}>{event.name}</Tag>
            ))}
          </div>
        )}
        {linkedTemplates.length > 0 && (
          <div>
            <Typography.Text type="secondary">Шаблоны: </Typography.Text>
            {linkedTemplates.map(template => (
              <Tag key={template.id}>{template.name}</Tag>
            ))}
          </div>
        )}
      </Space>
    );
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
      <List<Project> // явно указываем тип для List
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
        renderItem={(project: Project) => ( // явно указываем тип для project
          <List.Item
            key={project.id}
            actions={[
              <Dropdown
                key="actions"
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
              title={project.name}
              description={
                <Space direction="vertical" size={8}>
                  {project.description && (
                    <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                      {project.description}
                    </Typography.Paragraph>
                  )}
                  {renderLinkedItems(project)}
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
            Добавить проект
          </Button>
        }
        style={{ width: '100%', height: '100%' }}
      >
        {renderContent()}
      </Card>

      <Modal
        title={editingProject ? "Редактировать проект" : "Добавить проект"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingProject ? "Сохранить" : "Добавить"}
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
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
            name={['linkedItems', 'tasks']} 
            label="Связанные задачи"
          >
            <Select
              mode="multiple"
              placeholder="Выберите задачи"
              optionFilterProp="children"
            >
              {tasks.map(task => (
                <Select.Option key={task.id} value={task.id}>
                  {task.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name={['linkedItems', 'events']} 
            label="Связанные события"
          >
            <Select
              mode="multiple"
              placeholder="Выберите события"
              optionFilterProp="children"
            >
              {events.map(event => (
                <Select.Option key={event.id} value={event.id}>
                  {event.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name={['linkedItems', 'templates']} 
            label="Связанные шаблоны"
          >
            <Select
              mode="multiple"
              placeholder="Выберите шаблоны"
              optionFilterProp="children"
            >
              {templates.map(template => (
                <Select.Option key={template.id} value={template.id}>
                  {template.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
);

};

export default ProjectsColumn;