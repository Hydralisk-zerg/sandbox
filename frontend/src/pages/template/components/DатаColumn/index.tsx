import React, { useState, useEffect } from 'react';
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingData, setEditingData] = useState<Data | null>(null);
  const [tables, setTables] = useState<Record<string, any>>({});
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedFieldType, setSelectedFieldType] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { fetchTablesList, fetchTableColumns } = useDictionary();

  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalVisible) {
      loadTables();
    }
  }, [isModalVisible]);

  const loadTables = async () => {
    try {
      const tablesList = await fetchTablesList();
      console.log('tablesList', tablesList)
      if (Array.isArray(tablesList)) {
        setTables(tablesList);
      } else {
        // Якщо прийшов об'єкт, перетворюємо його ключі на масив
        setTables(Object.keys(tablesList));
      }
    } catch (error) {
      console.error('Помилка завантаження таблиць:', error);
      setTables([]); // У випадку помилки встановлюємо пустий масив
    }
  };

  // Перевіряємо чи є tables масивом перед використанням map
  const renderTableOptions = () => {
    if (!Array.isArray(tables)) return null;

    return tables.map(table => (
      <Select.Option key={table} value={table}>
        {table}
      </Select.Option>
    ));
  };

  const handleTableSelect = async (tableName: string) => {
    const columnsList = await fetchTableColumns(tableName);
    setColumns(columnsList);
    form.setFieldValue('sourceColumn', undefined);
  };

  // Завантаження співробітників
  const loadEmployees = async () => {
    try {
      const response = await api.getEmployees();
      console.log(response)
      setEmployees(response);
    } catch (error) {
      console.error('Помилка завантаження співробітників:', error);
    }
  };

  const handleAddClick = () => {
    setIsModalVisible(true);
    setEditingData(null);
    form.resetFields();
    setSelectedFieldType(null);
    setColumns([]);
  };

  const handleFieldTypeChange = (value: string) => {
    setSelectedFieldType(value);
    if (value === 'select') {
      setColumns([]);
    } else if (value === 'employees') {
      loadEmployees();
    }
    form.setFieldsValue({ fieldType: value });
  };

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
      console.error('Помилка валідації:', error);
    }
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingData(null);
    setColumns([]);
  };

  const showEditModal = (data: Data) => {
    setEditingData(data);
    form.setFieldsValue(data);
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
                      label:
                        <Popconfirm
                          title="Удалить данные?"
                          description="Это действие нельзя отменить"
                          onConfirm={() => onDataDelete(data.id)}
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

  useEffect(() => {
    const loadTables = async () => {
      const allDictionaries = await api.getAllDictianary();
      setTables(Object.keys(allDictionaries));
    };
    loadTables();
  }, []);

  useEffect(() => {
    if (editingData) {
      setSelectedFieldType(editingData.fieldType);
    }
  }, [editingData]);

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
            Додати дані
          </Button>
        }
        style={{ width: '100%', height: '100%' }}
      >
        {renderContent()}
      </Card>
      <Modal
        title={editingData ? "Редагувати дані" : "Додати дані"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingData ? "Зберегти" : "Додати"}
        cancelText="Скасувати"
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
            label="Назва"
            rules={[{ required: true, message: 'Введіть назву' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="fieldName"
            label="Назва поля"
            rules={[{ required: true, message: 'Введіть назву поля' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Опис"
          >
            <Input.TextArea rows={4} />
          </Form.Item>


          <Form.Item
            name="fieldType"
            label="Тип поля"
            rules={[{ required: true, message: 'Оберіть тип поля' }]}
          >
            <Select onChange={handleFieldTypeChange}>
              <Select.Option value="text">Текст</Select.Option>
              <Select.Option value="number">Число</Select.Option>
              <Select.Option value="date">Дата</Select.Option>
              <Select.Option value="select">Випадаючий список</Select.Option>
              <Select.Option value="employees">Співробітники</Select.Option>
            </Select>
          </Form.Item>

          {selectedFieldType === 'select' && (
            <>
              <Form.Item name="sourceTable" label="Таблиця">
                <Select
                  onChange={handleTableSelect}
                  placeholder="Оберіть таблицю"
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
              label="Поле співробітника"
              rules={[{ required: true, message: 'Оберіть поле співробітника' }]}
            >
              <Select placeholder="Оберіть поле співробітника">
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
