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
import { Data, DataColumnProps } from '../../../../interfaces/interfase';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

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
  const [form] = Form.useForm();

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingData) {
        onDataEdit({ ...editingData, ...values });
      } else {
        onDataAdd({
          ...values,
        });
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingData(null);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingData(null);
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
              description="Нет шаблонов"
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Добавить первый шаблон
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
                        title="Удалить шаблон?"
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

  return (
    <>
      <Card
        title={<Title level={4}>Шаблоны</Title>}
        extra={
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            disabled={loading}
          >
            Добавить шаблон
          </Button>
        }
        style={{ width: '100%', height: '100%' }}
      >
        {renderContent()}
      </Card>

      <Modal
        title={editingData ? "Редактировать шаблон" : "Добавить шаблон"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingData ? "Сохранить" : "Добавить"}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название шаблона' }]}
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

export default DataColumn;
