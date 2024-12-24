import React, { useEffect, useState } from 'react';
import { Modal, Typography, Space, Empty, Form, Input, Select, Spin } from 'antd';
import { taskStorage, eventStorage, dataStorage } from '../../../../services/templateStorage';
import { api } from '../../../../services/apiClient';
import { Task } from '../../../../interfaces/interfase';

const { Title } = Typography;

// Інтерфейси
interface Procedure {
  id: string;
  name: string;
  description: string;
  linkedItems: {
    tasks: string[];
    events: string[];
    data: string[];
  };
}

interface Data {
  id: string;
  name: string;
  description: string;
  fieldType: string;
  fieldName: string;
  sourceTable?: string;
  sourceColumn?: string;
}

interface ModalProps {
  procedureId: string;
  isVisible: boolean;
  onClose: () => void;
}

// Кеш для даних
const dataCache: Record<string, any[]> = {};

const ProcedureDetailsModal: React.FC<ModalProps> = ({
  procedureId,
  isVisible,
  onClose
}) => {
  const [form] = Form.useForm();
  const [procedure, setProcedure] = useState<Procedure | null>(null);
  const [linkedTasks, setLinkedTasks] = useState<Task[]>([]);
  const [linkedEvents, setLinkedEvents] = useState<Event[]>([]);
  const [linkedData, setLinkedData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectData, setSelectData] = useState<Record<string, any[]>>({});
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible && procedureId && !isInitialized) {
      initializeModalData();
    }
  }, [isVisible, procedureId]);

  const initializeModalData = async () => {
    setLoading(true);
    try {
      // Завантаження процедури
      const procedures = JSON.parse(localStorage.getItem('procedures') || '[]');
      const currentProcedure = procedures.find((p: Procedure) => p.id === procedureId);

      if (currentProcedure) {
        setProcedure(currentProcedure);

        // Завантаження пов'язаних даних
        if (currentProcedure.linkedItems.data.length > 0) {
          const allData = dataStorage.getData() || [];
          const filteredData = allData.filter((data: Data) =>
            currentProcedure.linkedItems.data.includes(data.id)
          );
          setLinkedData(filteredData);

          // Завантаження даних для селектів
          await loadAllSelectData();
        }
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing modal data:', error);
    } finally {
      setLoading(false);
    }
  };


  // Функція отримання даних для селектів
  const fetchSelectData = async (sourceTable: string): Promise<any[]> => {
    try {
      let response: any;
      let formattedData: any[] = [];
      if (dataCache[sourceTable] && dataCache[sourceTable].length > 0) {
        return dataCache[sourceTable];
      }

      switch (sourceTable) {
        case 'countries':
          response = await api.get('dictionary/countries/');
          console.log('dictionary/countries/', response)
          formattedData = response.countries.map((country: any) => ({
            value: country.id,
            label: country.name_uk || country.name_en
          }));
          break;

        case 'cities':
          response = await api.get('dictionary/cities/');
          console.log('dictionary/cities/', response)
          formattedData = response.cities.map((city: any) => ({
            value: city.id,
            label: city.name_uk || city.name_en
          }));
          break;
        case 'terminals':
          response = await api.get('dictionary/terminals/');
          console.log('dictionary/terminals/', response)
          formattedData = response.terminals.map((terminal: any) => ({
            value: terminal.id,
            label: terminal.name_uk || terminal.name_en
          }));
        case 'currencies':
          response = await api.get('dictionary/currencies/');
          console.log('dictionary/currencies/', response)
          formattedData = response.currencies.map((currency: any) => ({
            value: currency.id,
            label: `${currency.name} (${currency.code})`
          }));
        case 'containers':
          response = await api.get('dictionary/containers/');
          console.log('dictionary/containers/', response)
          formattedData = response.containers.map((container: any) => ({
            value: container.id,
            label: `${container.size} - ${container.container_type}`
          }));
        case 'danger_classes':
          response = await api.get('dictionary/danger_classes/');
          console.log('dictionary/danger_classes/', response)
          formattedData = response.danger_classes.map((dangerClass: any) => ({
            value: dangerClass.id,
            label: `${dangerClass.class_number} - ${dangerClass.description}`
          }));
        case 'employees':
          response = await api.getEmployees();
          console.log(response)
          formattedData = response.map((employee: any) => ({
            value: employee.id,
            label: `${employee.user__first_name} ${employee.user__last_name}`
          }));
        // Додайте інші кейси для інших таблиць
        default:
          return [];
      }

      dataCache[sourceTable] = formattedData;
      return formattedData;

    } catch (error) {
      console.error(`Error fetching ${sourceTable} data:`, error);
      return [];
    }
  };

  // Завантаження всіх необхідних даних
  const loadAllSelectData = async () => {
    try {
      const uniqueTables = new Set(
        linkedData
          .filter(data => data.fieldType === 'select' && data.sourceTable)
          .map(data => data.sourceTable as string)
      );
  
      const loadPromises = Array.from(uniqueTables).map(async (table) => {
        const data = await fetchSelectData(table);
        return { table, data };
      });
  
      const results = await Promise.all(loadPromises);
      
      const newSelectData = { ...selectData };
      results.forEach(({ table, data }) => {
        newSelectData[table] = data;
      });
  
      setSelectData(newSelectData);
    } catch (error) {
      console.error('Error loading select data:', error);
    }
  };
  
  useEffect(() => {
    const initializeModalData = async () => {
      setLoading(true);
      try {
        const procedures = JSON.parse(localStorage.getItem('procedures') || '[]');
        const currentProcedure = procedures.find((p: Procedure) => p.id === procedureId);
    
        if (currentProcedure) {
          setProcedure(currentProcedure);
    
          if (currentProcedure.linkedItems.data.length > 0) {
            const allData = dataStorage.getData() || [];
            const filteredData = allData.filter((data: Data) =>
              currentProcedure.linkedItems.data.includes(data.id)
            );
            setLinkedData(filteredData);
    
            // Завантажуємо дані для селектів
            await loadAllSelectData();
          }
        }
      } catch (error) {
        console.error('Error initializing modal data:', error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeModalData();
  }, [procedureId, isVisible, isInitialized]);

  useEffect(() => {
    if (linkedData.length > 0 && isVisible) {
      loadAllSelectData();
    }
  }, [linkedData, isVisible]);

  useEffect(() => {
    if (isVisible && procedureId) {
      const procedures = JSON.parse(localStorage.getItem('procedures') || '[]');
      const currentProcedure = procedures.find((p: Procedure) => p.id === procedureId);

      if (currentProcedure) {
        setProcedure(currentProcedure);

        // Завантаження пов'язаних даних
        if (currentProcedure.linkedItems.data.length > 0) {
          const allData = dataStorage.getData() || [];
          const filteredData = allData.filter((data: Data) =>
            currentProcedure.linkedItems.data.includes(data.id)
          );
          setLinkedData(filteredData);
          loadAllSelectData();
        }
      }
    }
  }, [procedureId, isVisible]);

  const renderDataField = (fieldData: Data) => {
    if (fieldData.fieldType === 'select' && fieldData.sourceTable) {
      const options = selectData[fieldData.sourceTable] || [];
      
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
            // disabled={loading || options.length === 0}
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
      title={<Title level={4}>{procedure?.name || 'Деталі процедури'}</Title>}
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
      ) : !procedure ? (
        <Empty description="Процедуру не знайдено" />
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={5}>Опис процедури</Title>
            <p>{procedure.description}</p>
          </div>
  
          {linkedData.length > 0 && (
            <div>
              <Title level={5}>Дані</Title>
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

export default ProcedureDetailsModal;
