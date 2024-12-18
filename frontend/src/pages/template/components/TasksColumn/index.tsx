// components/TasksColumn/index.tsx
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
  CheckOutlined, 
  MoreOutlined
} from '@ant-design/icons';
import { Task, TasksColumnProps } from '../../../../interfaces/interfase';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const TasksColumn: React.FC<TasksColumnProps> = ({
  tasks,
  loading = false,
  error,
  onTaskAdd,
  onTaskDelete,
  onTaskEdit
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingTask) {
        onTaskEdit({ ...editingTask, ...values });
      } else {
        onTaskAdd(values);
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingTask(null);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingTask(null);
  };

  const showEditModal = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue(task);
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
        dataSource={tasks}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Нет задач"
            >
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Добавить первую задачу
              </Button>
            </Empty>
          )
        }}
        renderItem={(task) => (
          <List.Item
          key={task.id}
          actions={[
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item 
                    key="edit" 
                    icon={<EditOutlined />}
                    onClick={() => showEditModal(task)}
                  >
                    Редактировать
                  </Menu.Item>
                  <Menu.Item 
                    key="delete" 
                    danger
                    icon={<DeleteOutlined />}
                  >
                    <Popconfirm
                      title="Удалить задачу?"
                      description="Это действие нельзя отменить"
                      onConfirm={() => onTaskDelete(task.id)}
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
            title={task.title}
            description={task.description}
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
        title={<Title level={4}>Задачи</Title>}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            disabled={loading}
            ghost
          >
            Добавить задачу
          </Button>
        }
        style={{ width: '100%', height: '100%' }}
      >
        {renderContent()}
      </Card>

      <Modal
        title={editingTask ? "Редактировать задачу" : "Добавить задачу"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingTask ? "Сохранить" : "Добавить"}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Название"
            rules={[{ required: true, message: 'Введите название задачи' }]}
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

export default TasksColumn
