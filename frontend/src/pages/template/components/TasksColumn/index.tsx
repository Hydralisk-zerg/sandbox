// components/TasksColumn/index.tsx
import React, { useEffect, useState } from 'react';
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
  Select,
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Data, Department, Employee, Task, TasksColumnProps } from '../../../../interfaces/interfase';
import { api } from '../../../../services/apiClient';

const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

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

  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [customFields, setCustomFields] = useState<Array<any>>([]);



  useEffect(() => {
    const loadData = async () => {
      try {
        const responseEmployees = await api.getEmployees()
        console.log('Employees:', responseEmployees);
        setEmployees(responseEmployees || []);
    
      }

      catch (error) {
        console.error('Ошибка загрузки отделов:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const responseDepartment = await api.getDepartments()
        console.log('Departments:', responseDepartment);
        setDepartments(responseDepartment.departments || []);
      }

      catch (error) {
        console.error('Ошибка загрузки отделов:', error);
      }
    };

    loadData();
  }, []);


  // Функция рендера кастомного поля
  const renderCustomField = (field: Data) => {
    switch (field.fieldType) {
      case 'text':
        return <Input />;
      case 'number':
        return <Input type="number" />;
      case 'date':
        return <DatePicker />;
      case 'select':
        return (
          <Select>
            {field.options?.map((option: any) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      default:
        return <Input />;
    }
  };
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
                menu={{
                  items: [
                    {
                      key: "edit",
                      label: 'Редактировать',
                      icon: <EditOutlined />,
                      onClick: () => showEditModal(task)
                    },
                    {
                      key: "delete",
                      danger: true,
                      icon: <DeleteOutlined />,
                      label:
                        <Popconfirm
                          title="Удалить данные?"
                          description="Это действие нельзя отменить"
                          onConfirm={() => onTaskDelete(task.id)}
                          okText="Да"
                          cancelText="Нет"
                        >
                          Удалить
                        </Popconfirm>
                    }
                  ]
                }}

                trigger={['click']}
              >
                <Button type="link" icon={<MoreOutlined />} />
              </Dropdown>
            ]}
          >
            <List.Item.Meta
              title={task.name}
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
        title={editingTask ? "Редактировать задачу" : "Создать задачу"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Название"
            rules={[{ required: true, message: 'Введите название задачи' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Описание">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="departmentId"
            label="Отдел"
            rules={[{ required: true, message: 'Выберите отдел' }]}
          >
            <Select placeholder="Выберите отдел">
              {departments.map(dept => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Селект для сотрудников */}
          <Form.Item
            name="employeeId"
            label="Ответственный"
            rules={[{ required: true, message: 'Выберите ответственного' }]}
          >
            <Select placeholder="Выберите сотрудника">
              {employees.map(emp => (
                <Option key={emp.id} value={emp.id}>
                  {!emp.firstName && !emp.lastName ? emp.username : `${emp.firstName} ${emp.lastName}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {customFields.map(field => (
            <Form.Item
              key={field.id}
              name={['customFields', field.fieldName]}
              label={field.name}
            >
              {renderCustomField(field)}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </>
  );
};

export default TasksColumn
