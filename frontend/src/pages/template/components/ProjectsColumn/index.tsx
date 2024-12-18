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
  Menu
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
      
      if (editingProject) {
        onProjectEdit({ ...editingProject, ...values });
      } else {
        onProjectAdd(values);
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
              title={project.name}
              description={
                project.description && (
                  <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                    {project.description}
                  </Paragraph>
                )
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
            ghost
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            disabled={loading}
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
        </Form>
      </Modal>
    </>
  );
};

export default ProjectsColumn;
