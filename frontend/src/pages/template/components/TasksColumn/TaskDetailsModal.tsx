// TaskDetailsModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Typography, Space, Empty, Form, Input, Select, Spin } from 'antd';
import { dataStorage } from '../../../../services/templateStorage';
import { api } from '../../../../services/apiClient';
import { Task } from '../../../../interfaces/interfase';

const { Title } = Typography;

interface ModalProps {
  taskId: string;
  isVisible: boolean;
  onClose: () => void;
}

const dataCache: Record<string, any[]> = {};

const TaskDetailsModal: React.FC<ModalProps> = ({
  taskId,
  isVisible,
  onClose
}) => {
  const [form] = Form.useForm();
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
            .filter((country: any) => country[sourceColumn as keyof typeof country])
            .map((country: any) => ({
              value: country.id,
              label: country[sourceColumn as keyof typeof country],
            }));
          break;

        case 'cities':
          response = await api.get('dictionary/cities/');
          formattedData = response.cities
            .filter((city: any) => city[sourceColumn as keyof typeof city])
            .map((city: any) => ({
              value: city.id,
              label: city[sourceColumn as keyof typeof city],
            }));
          break;

        case 'terminals':
          response = await api.get('dictionary/terminals/');
          formattedData = response.terminals
            .filter((terminal: any) => terminal[sourceColumn as keyof typeof terminal])
            .map((terminal: any) => ({
              value: terminal.id,
              label: terminal[sourceColumn as keyof typeof terminal],
            }));
          break;

        case 'currencies':
          response = await api.get('dictionary/currencies/');
          formattedData = response.currencies
            .filter((currency: any) => currency[sourceColumn as keyof typeof currency])
            .map((currency: any) => ({
              value: currency.id,
              label: currency[sourceColumn as keyof typeof currency],
            }));
          break;

        case 'containers':
          response = await api.get('dictionary/containers/');
          formattedData = response.containers
            .filter((container: any) => container[sourceColumn as keyof typeof container])
            .map((container: any) => ({
              value: container.id,
              label: container[sourceColumn as keyof typeof container],
            }));
          break;

        case 'incoterms':
          response = await api.get('dictionary/incoterms/');
          formattedData = response.incoterms
            .filter((incoterm: any) => incoterm[sourceColumn as keyof typeof incoterm])
            .map((incoterm: any) => ({
              value: incoterm.id,
              label: incoterm[sourceColumn as keyof typeof incoterm],
            }));
          break;

        case 'packaging_types':
          response = await api.get('dictionary/packaging_types/');
          formattedData = response.packaging_types
            .filter((type: any) => type[sourceColumn as keyof typeof type])
            .map((type: any) => ({
              value: type.id,
              label: type[sourceColumn as keyof typeof type],
            }));
          break;

        case 'delivery_types':
          response = await api.get('dictionary/delivery_types/');
          formattedData = response.delivery_types
            .filter((type: any) => type[sourceColumn as keyof typeof type])
            .map((type: any) => ({
              value: type.id,
              label: type[sourceColumn as keyof typeof type],
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

        case 'danger_classes':
          response = await api.get('dictionary/danger_classes/');
          formattedData = response.danger_classes
            .filter((dangerClass: any) => dangerClass[sourceColumn as keyof typeof dangerClass])
            .map((dangerClass: any) => ({
              value: dangerClass.id,
              label: dangerClass[sourceColumn as keyof typeof dangerClass],
            }));
          break;

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
      onOk={onClose}
      width={800}
    >
      {loading || !isInitialized ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : !task ? (
        <Empty description="Задача не найдена" />
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={5}>Описание задачи</Title>
            <p>{task.description}</p>
          </div>
          {linkedData.length > 0 && (
            <div>
              <Title level={5}>Данные</Title>
              <Form form={form} layout="vertical">
                {linkedData.map(data => renderDataField(data))}
              </Form>
            </div>
          )}
        </Space>
      )}
    </Modal>
  );
};

export default TaskDetailsModal;
