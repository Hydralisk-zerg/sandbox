import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Button,
  Popconfirm,
  Empty,
  Alert,
  Modal,
  Form,
  Input,
  Dropdown,
  Select
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { api } from '../../../../services/apiClient';
import { Data, DataColumnProps, Employee } from '../../../../interfaces/interfase';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import { useDictionary } from '../../../../hooks/useDictionary';

const DataColumn: React.FC<DataColumnProps> = ({
  data,
  loading = false,
  error,
  onDataAdd,
  onDataDelete,
  onDataEdit
}) => {
  // Состояния для управления модальным окном
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingData, setEditingData] = useState<Data | null>(null);
  
  // Состояния для работы с данными
  const [tables, setTables] = useState<Record<string, any>>({});
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedFieldType, setSelectedFieldType] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // Хуки и утилиты
  const { fetchTablesList, fetchTableColumns } = useDictionary();
  const [form] = Form.useForm();

    // Загрузка списка доступных таблиц
    const loadTables = async () => {
      try {
        const tablesList = await fetchTablesList();
        if (Array.isArray(tablesList)) {
          setTables(tablesList);
        } else {
          setTables(Object.keys(tablesList));
        }
      } catch (error) {
        console.error('Ошибка загрузки таблиц:', error);
        setTables([]); 
      }
    };
  
    // Загрузка списка сотрудников
    const loadEmployees = async () => {
      try {
        const response = await api.getEmployees();
        setEmployees(response);
      } catch (error) {
        console.error('Ошибка загрузки сотрудников:', error);
      }
    };
    // Открытие модального окна для добавления
    const handleAddClick = () => {
      setIsModalVisible(true);
      setEditingData(null);
      form.resetFields();
      setSelectedFieldType(null);
      setColumns([]);
    };
  
    // Открытие модального окна для редактирования
    const showEditModal = (data: Data) => {
      setEditingData(data);
      form.setFieldsValue(data);
      setIsModalVisible(true);
    };
  
    // Подтверждение в модальном окне
    const handleModalOk = async () => {
      try {
        const values = await form.validateFields();
        if (editingData) {
          onDataEdit({ ...editingData, ...values });
        } else {
          onDataAdd(values);
        }
        setIsModalVisible(false);
        form.resetFields();
        setEditingData(null);
        setColumns([]);
      } catch (error) {
        console.error('Ошибка валидации:', error);
      }
    };
  
    // Закрытие модального окна
    const handleModalCancel = () => {
      setIsModalVisible(false);
      form.resetFields();
      setEditingData(null);
      setColumns([]);
    };
    // Обработка выбора типа поля
    const handleFieldTypeChange = (value: string) => {
      setSelectedFieldType(value);
      if (value === 'select') {
        setColumns([]);
      } else if (value === 'employees') {
        loadEmployees();
      }
      form.setFieldsValue({ fieldType: value });
    };
  
    // Обработка выбора таблицы
    const handleTableSelect = async (tableName: string) => {
      const columnsList = await fetchTableColumns(tableName);
      setColumns(columnsList);
      form.setFieldValue('sourceColumn', undefined);
    };
  
    // Рендер опций таблиц
    const renderTableOptions = () => {
      if (!Array.isArray(tables)) return null;
      return tables.map(table => (
        <Select.Option key={table} value={table}>
          {table}
        </Select.Option>
      ));
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
          dataSource={data}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Нет данных"
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsModalVisible(true)}
                >
                  Добавить первые данные
                </Button>
              </Empty>
            )
          }}
          renderItem={(data) => (
            <List.Item
              key={data.id}
              actions={[
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "edit",
                        label: 'Редактировать',
                        icon: <EditOutlined />,
                        onClick: () => showEditModal(data)
                      },
                      {
                        key: "delete",
                        danger: true,
                        icon: <DeleteOutlined />,
                        label: (
                          <Popconfirm
                            title="Удалить данные?"
                            description="Это действие нельзя отменить"
                            onConfirm={() => onDataDelete(data.id)}
                            okText="Да"
                            cancelText="Нет"
                          >
                            Удалить
                          </Popconfirm>
                        )
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
                title={data.name}
                description={
                  data.description && (
                    <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                      {data.description}
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
    // Эффекты
    useEffect(() => {
      if (isModalVisible) {
        loadTables();
      }
    }, [isModalVisible]);
  
    useEffect(() => {
      if (editingData) {
        setSelectedFieldType(editingData.fieldType);
      }
    }, [editingData]);
  
    // Рендер компонента
    return (
      <>
        <Card
          title={<Title level={4}>Данные</Title>}
          extra={
            <Button
              type="primary"
              ghost
              icon={<PlusOutlined />}
              onClick={handleAddClick}
              disabled={loading}
            >
              Добавить данные
            </Button>
          }
          style={{ width: '100%', height: '100%' }}
        >
          {renderContent()}
        </Card>
  
        <Modal
          title={editingData ? "Редактировать данные" : "Добавить данные"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText={editingData ? "Сохранить" : "Добавить"}
          cancelText="Отмена"
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              fieldType: selectedFieldType
            }}
          >
            <Form.Item
              name="name"
              label="Название"
              rules={[{ required: true, message: 'Введите название' }]}
            >
              <Input />
            </Form.Item>
  
            <Form.Item
              name="fieldName"
              label="Название поля"
              rules={[{ required: true, message: 'Введите название поля' }]}
            >
              <Input />
            </Form.Item>
  
            <Form.Item
              name="description"
              label="Описание"
            >
              <Input.TextArea rows={4} />
            </Form.Item>
  
            <Form.Item
              name="fieldType"
              label="Тип поля"
              rules={[{ required: true, message: 'Выберите тип поля' }]}
            >
              <Select onChange={handleFieldTypeChange}>
                <Select.Option value="text">Текст</Select.Option>
                <Select.Option value="number">Число</Select.Option>
                <Select.Option value="date">Дата</Select.Option>
                <Select.Option value="select">Выпадающий список</Select.Option>
                <Select.Option value="employees">Сотрудники</Select.Option>
              </Select>
            </Form.Item>
  
            {selectedFieldType === 'select' && (
              <>
                <Form.Item name="sourceTable" label="Таблица">
                  <Select
                    onChange={handleTableSelect}
                    placeholder="Выберите таблицу"
                  >
                    {renderTableOptions()}
                  </Select>
                </Form.Item>
  
                <Form.Item name="sourceColumn" label="Колонка">
                  <Select disabled={!form.getFieldValue('sourceTable')}>
                    {columns.map(column => (
                      <Select.Option key={column} value={column}>
                        {column}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            )}
  
            {selectedFieldType === 'employees' && (
              <Form.Item
                name="employeeField"
                label="Поле сотрудника"
                rules={[{ required: true, message: 'Выберите поле сотрудника' }]}
              >
                <Select placeholder="Выберите поле сотрудника">
                  {employees.map(employee => (
                    <Select.Option key={employee.id} value={employee.id}>
                      {employee.firstName && employee.lastName
                        ? `${employee.firstName} ${employee.lastName}`
                        : employee.username}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Form>
        </Modal>
      </>
    );
  };
  
  export default DataColumn;
  