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
  MoreOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Data, Department, Employee, Task, TasksColumnProps } from '../../../../interfaces/interfase';
import { api } from '../../../../services/apiClient';
import { dataStorage } from '../../../../services/templateStorage';
import TaskDetailsModal from './TaskDetailsModal';

const { Option } = Select;
const { Title } = Typography;

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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [customFields, setCustomFields] = useState<Array<any>>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [form] = Form.useForm();

  const handleDepartmentChange = (departmentId: number) => {
    const filteredEmps = employees.filter(emp =>
      emp.department && emp.department.id === departmentId
    );
    setFilteredEmployees(filteredEmps);

    // Очищаем значение поля сотрудника
    form.setFieldValue('employeeId', undefined);
  }
  useEffect(() => {
    if (editingTask?.department?.id) {
      const filteredEmps = employees.filter(emp => emp.department?.id === editingTask.department.id);
      setFilteredEmployees(filteredEmps);
    }
  }, [editingTask, employees]);


  useEffect(() => {
    const loadData = async () => {
      try {
        // Загрузка сотрудников и отделов
        const [employeesResponse, departmentsResponse] = await Promise.all([
          api.getEmployees(),
          api.getDepartments()
        ]);

        setEmployees(employeesResponse || []);
        setDepartments(departmentsResponse.departments || []);

        // Загрузка кастомных полей из локального хранилища
        const customFieldsData = dataStorage.getData();
        setCustomFields(customFieldsData || []);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setLoadingError('Не удалось загрузить данные');
      }
    };

    loadData();
  }, []);


  const updateCustomFields = () => {
    const customFieldsData = dataStorage.getData();
    setCustomFields(customFieldsData || []);
  };

  useEffect(() => {
    // Функция-обработчик изменений в localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'customFields') { // или ключ, который вы используете для хранения
        updateCustomFields();
      }
    };

    // Добавляем слушатель
    window.addEventListener('storage', handleStorageChange);

    // Начальная загрузка данных
    updateCustomFields();

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  // Обновите функцию handleModalOk для сохранения кастомных полей
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const departmentObj = departments.find(d => d.id === values.departmentId);

      // Получаем значения кастомных полей из формы
      const customFieldValues = values.customFields || {};

      const taskData = {
        ...values,
        department: departmentObj,
        customFields: customFieldValues // Добавляем кастомные поля
      };

      if (editingTask) {
        onTaskEdit({ ...editingTask, ...taskData });
      } else {
        onTaskAdd(taskData);
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
    
    // Обновляем отфильтрованных сотрудников на основе отдела задачи
    if (task.department?.id) {
      const filteredEmps = employees.filter(emp => 
        emp.department?.id === task.department?.id
      );
      setFilteredEmployees(filteredEmps);
    }
  
    // Устанавливаем значения формы
    form.setFieldsValue({
      name: task.name,
      description: task.description,
      departmentId: task.department?.id,
      employeeId: task.employee?.id,
      linkedItems: task.linkedItems || { data: [] },
    });
  
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
                      key: "show",
                      icon: <EyeOutlined />,
                      onClick: () => {
                        setSelectedTask(task);
                        setIsCardModalVisible(true);
                      },
                      label: 'Показать карточку'
                    },
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
        {loadingError && (
          <Alert
            message="Ошибка загрузки данных"
            description={loadingError}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
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
            <Select
              placeholder="Выберите отдел"
              onChange={handleDepartmentChange}
            >
              {departments.map(dept => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="employeeId"
            label="Сотрудник"
          >
            <Select
              placeholder="Выберите сотрудника"
              disabled={!form.getFieldValue('departmentId')}
              showSearch
              filterOption={(input, option) => {
                if (!option) return false;
                const childrenString = String(option.children);
                return childrenString.toLowerCase().includes(input.toLowerCase());
              }}
            >
              {filteredEmployees.map(emp => (
                <Option key={emp.id} value={emp.id}>
                  {!emp.firstName && !emp.lastName
                    ? emp.username
                    : `${emp.firstName} ${emp.lastName}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name={['linkedItems', 'data']}
            label="Связанные данные"
          >
            <Select
              mode="multiple"
              placeholder="Выберите данные"
              optionFilterProp="children"
            >
              {customFields.map(field => (
                <Select.Option key={field.id} value={field.id}>
                  {field.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <TaskDetailsModal
        taskId={selectedTask?.id || ''}
        isVisible={isCardModalVisible}
        onClose={() => setIsCardModalVisible(false)}
      />
    </>
  );
};

export default TasksColumn
