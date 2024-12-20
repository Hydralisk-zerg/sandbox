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
  ContactsOutlined
} from '@ant-design/icons';
import { api } from '../../../../services/apiClient';
import { Data, DataColumnProps, Employee } from '../../../../interfaces/interfase';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';


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
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalVisible) {
      loadTables();
    }
  }, [isModalVisible]);

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

  const loadTables = async () => {
    try {
      const response = await api.getAllDictianary();
      setTables(response);
    } catch (error) {
      console.error('Помилка завантаження таблиць:', error);
    }
  };

  const handleAddClick = () => {
    setIsModalVisible(true);
    setEditingData(null);
    form.resetFields();
    setSelectedFieldType(null);
    setColumns([]);
  };

  const handleTableSelect = (tableName: string) => {
    if (tables[tableName] && Array.isArray(tables[tableName])) {
      const tableData = tables[tableName];
      if (tableData.length > 0) {
        const columnNames = Object.keys(tableData[0]);
        setColumns(columnNames);
        form.setFieldValue('sourceColumn', undefined);
      }
    }
  };

  const handleFieldTypeChange = (value: string) => {
    setSelectedFieldType(value);
    if (value === 'select') {
      setColumns([]);
    } else if (value === 'employees') {
      loadEmployees();
    }
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
                overlay={
                  <Menu>
                    <Menu.Item
                      key="edit"
                      icon={<EditOutlined />}
                      onClick={() => showEditModal(data)}
                    >
                      Редактировать
                    </Menu.Item>
                    <Menu.Item
                      key="delete"
                      danger
                      icon={<DeleteOutlined />}
                    >
                      <Popconfirm
                        title="Удалить данные?"
                        description="Это действие нельзя отменить"
                        onConfirm={() => onDataDelete(data.id)}
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

          {(form.getFieldValue('fieldType') === 'select' || selectedFieldType === 'select') && (
            <>
              <Form.Item
                name="sourceTable"
                label="Таблиця"
                rules={[{ required: true, message: 'Оберіть таблицю' }]}
              >
                <Select
                  onChange={handleTableSelect}
                  placeholder="Оберіть таблицю"
                >
                  {Object.keys(tables).map(table => (
                    <Select.Option key={table} value={table}>
                      {table}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="sourceColumn"
                label="Колонка"
                rules={[{ required: true, message: 'Оберіть колонку' }]}
              >
                <Select
                  placeholder="Оберіть колонку"
                  disabled={!form.getFieldValue('sourceTable')}
                >
                  {columns.map(column => (
                    <Select.Option key={column} value={column}>
                      {column}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {(form.getFieldValue('fieldType') === 'employees' || selectedFieldType === 'employees') && (
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
