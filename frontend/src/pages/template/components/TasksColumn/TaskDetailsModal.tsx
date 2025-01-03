import React, { useEffect, useState } from 'react';
import { Modal, Typography, Space, Empty, Form, Input, Select, Spin } from 'antd';
import { dataStorage } from '../../../../services/templateStorage';
import { api } from '../../../../services/apiClient';
import { Task, TaskStatus, TaskPriority } from '../../../../interfaces/interfase';

const { Title } = Typography;
const { Option } = Select;

interface ModalProps {
  taskId: string;
  isVisible: boolean;
  onClose: () => void;
}

interface TaskFormData {
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  [key: string]: any;
}

const dataCache: Record<string, any[]> = {};

const TaskDetailsModal: React.FC<ModalProps> = ({
  taskId,
  isVisible,
  onClose
}) => {
  const [form] = Form.useForm<TaskFormData>();
  const [task, setTask] = useState<Task | null>(null);
  const [linkedData, setLinkedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectData, setSelectData] = useState<Record<string, any[]>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isVisible && taskId && !isInitialized) {
      initializeModalData();
    }
  }, [isVisible, taskId]);

  const initializeModalData = async () => {
    setLoading(true);
    try {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const currentTask = tasks.find((t: Task) => t.id === taskId);

      if (currentTask) {
        setTask(currentTask);
        form.setFieldsValue({
          name: currentTask.name,
          description: currentTask.description,
          status: currentTask.status,
          priority: currentTask.priority,
        });

        if (currentTask.linkedItems?.data?.length > 0) {
          const allData = dataStorage.getData() || [];
          const filteredData = allData.filter((data: any) =>
            currentTask.linkedItems.data.includes(data.id)
          );
          setLinkedData(filteredData);
          await loadAllSelectData(filteredData);
        }
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing modal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectData = async (sourceTable: string, sourceColumn: string) => {
    try {
      if (!sourceColumn) {
        return [];
      }

      const cacheKey = `${sourceTable}_${sourceColumn}`;

      if (dataCache[cacheKey] && dataCache[cacheKey].length > 0) {
        return dataCache[cacheKey];
      }

      let response: any;
      let formattedData: any[] = [];

      switch (sourceTable) {
        case 'countries':
          response = await api.get('dictionary/countries/');
          formattedData = response.countries
            .filter((country: any) => country[sourceColumn])
            .map((country: any) => ({
              value: country.id,
              label: country[sourceColumn],
            }));
          break;

        case 'cities':
          response = await api.get('dictionary/cities/');
          formattedData = response.cities
            .filter((city: any) => city[sourceColumn])
            .map((city: any) => ({
              value: city.id,
              label: city[sourceColumn],
            }));
          break;

        case 'terminals':
          response = await api.get('dictionary/terminals/');
          formattedData = response.terminals
            .filter((terminal: any) => terminal[sourceColumn])
            .map((terminal: any) => ({
              value: terminal.id,
              label: terminal[sourceColumn],
            }));
          break;

        case 'currencies':
          response = await api.get('dictionary/currencies/');
          formattedData = response.currencies
            .filter((currency: any) => currency[sourceColumn])
            .map((currency: any) => ({
              value: currency.id,
              label: currency[sourceColumn],
            }));
          break;

        case 'containers':
          response = await api.get('dictionary/containers/');
          formattedData = response.containers
            .filter((container: any) => container[sourceColumn])
            .map((container: any) => ({
              value: container.id,
              label: container[sourceColumn],
            }));
          break;

        case 'cargos':
          response = await api.get('dictionary/cargos/');
          formattedData = response.cargos
            .filter((cargo: any) => cargo[sourceColumn as keyof typeof cargo])
            .map((cargo: any) => ({
              value: cargo.id,
              label: cargo[sourceColumn as keyof typeof cargo],
            }));
          break;

        // Добавьте эту функцию внутри компонента TaskDetailsModal, 
        // перед функцией loadAllSelectData

        default:
          console.warn(`Unknown source table: ${sourceTable}`);
          return [];
      }

      dataCache[cacheKey] = formattedData;
      return formattedData;
    } catch (error) {
      console.error(`Error fetching ${sourceTable} data:`, error);
      return [];
    }
  };

  const loadAllSelectData = async (data: any[]) => {
    try {
      const uniqueSelects = data
        .filter(field => field.fieldType === 'select' && field.sourceTable)
        .map(field => ({
          table: field.sourceTable,
          column: field.sourceColumn
        }));

      const loadPromises = uniqueSelects.map(async ({ table, column }) => {
        if (!column) return { table, column, data: [] };
        const data = await fetchSelectData(table, column);
        return { table, column, data };
      });

      const results = await Promise.all(loadPromises);

      const newSelectData = { ...selectData };
      results.forEach(({ table, column, data }) => {
        const key = `${table}_${column}`;
        newSelectData[key] = data;
      });

      setSelectData(newSelectData);
    } catch (error) {
      console.error('Error loading select data:', error);
    }
  };

  // const handleFormSubmit = async (values: TaskFormData) => {
  //   try {
  //     const updatedTask = {
  //       ...task,
  //       ...values,
  //     };
  //     // Обновление задачи в localStorage
  //     const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  //     const taskIndex = tasks.findIndex((t: Task) => t.id === taskId);
  //     if (taskIndex !== -1) {
  //       tasks[taskIndex] = updatedTask;
  //       localStorage.setItem('tasks', JSON.stringify(tasks));
  //     }
  //     onClose();
  //   } catch (error) {
  //     console.error('Error updating task:', error);
  //   }
  // };

  const renderStatusSelect = () => (
    <Form.Item
      name="status"
      label="Статус"
    >
      <Select placeholder="Выберите статус">
        <Option value={TaskStatus.PLANNED}>Запланировано</Option>
        <Option value={TaskStatus.IN_PROGRESS}>В работе</Option>
        <Option value={TaskStatus.COMPLETED}>Завершено</Option>
      </Select>
    </Form.Item>
  );

  const renderPrioritySelect = () => (
    <Form.Item
      name="priority"
      label="Приоритет"
    >
      <Select placeholder="Выберите приоритет">
        <Option value={TaskPriority.LOW}>Низкий</Option>
        <Option value={TaskPriority.MEDIUM}>Средний</Option>
        <Option value={TaskPriority.HIGH}>Высокий</Option>
        <Option value={TaskPriority.URGENT}>Срочный</Option>
      </Select>
    </Form.Item>
  );

  const renderDataField = (fieldData: any) => {
    if (fieldData.fieldType === 'select' && fieldData.sourceTable) {
      const selectKey = `${fieldData.sourceTable}_${fieldData.sourceColumn}`;
      const options = selectData[selectKey] || [];

      return (
        <Form.Item
          key={fieldData.id}
          name={fieldData.id}
          label={fieldData.fieldName}
        >
          <Select
            placeholder={fieldData.description}
            loading={loading}
            options={options}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            disabled={loading || options.length === 0}
          />
        </Form.Item>
      );
    }

    return (
      <Form.Item
        key={fieldData.id}
        name={fieldData.id}
        label={fieldData.fieldName}
      >
        <Input
          placeholder={fieldData.description}
          type={fieldData.fieldType}
        />
      </Form.Item>
    );
  };
  return (
    <Modal
      title={<Title level={4}>{`Задача: ${task?.name}` || 'Детали задачи'}</Title>}
      open={isVisible}
      onCancel={() => {
        onClose();
        setIsInitialized(false);
      }}
      onOk={() => form.submit()}
      width={800}
    >
      {loading || !isInitialized ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : !task ? (
        <Empty description="Задача не найдена" />
      ) : (
        <Form
          form={form}
          layout="horizontal" // Меняем с vertical на horizontal
          labelCol={{ span: 6 }} // Задаем ширину для лейблов
          wrapperCol={{ span: 18 }} // Задаем ширину для полей ввода
        // onFinish={handleFormSubmit}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={5}>Опис процедури</Title>
              <p>{task.description}</p>
              {renderStatusSelect()}
              {renderPrioritySelect()}

              {linkedData.length > 0 && (
                <div>
                  <Title level={5}>Дополнительные данные</Title>
                  {linkedData.map(data => renderDataField(data))}
                </div>
              )}
            </div>
          </Space>
        </Form>
      )}
    </Modal>
  );
};

export default TaskDetailsModal;

