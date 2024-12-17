// components/EventsColumn/index.tsx
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
  DatePicker,
  TimePicker,
  Tag,
  Space,
  Select,
  Dropdown,
  Menu
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Event } from '../../types';
import { EventsColumnProps } from './types';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const EventsColumn: React.FC<EventsColumnProps> = ({
  events,
  loading = false,
  error,
  onEventAdd,
  onEventDelete,
  onEventEdit
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [form] = Form.useForm();

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const eventData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm')
      };

      if (editingEvent) {
        onEventEdit({ ...editingEvent, ...eventData });
      } else {
        onEventAdd(eventData);
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingEvent(null);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingEvent(null);
  };

  const showEditModal = (event: Event) => {
    setEditingEvent(event);
    form.setFieldsValue({
      ...event,
      date: dayjs(event.date),
      time: dayjs(event.time, 'HH:mm')
    });
    setIsModalVisible(true);
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'red',
      'medium': 'orange',
      'low': 'green'
    };
    return colors[priority.toLowerCase()] || 'blue';
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

    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    return (
      <List
        loading={loading}
        dataSource={sortedEvents}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Нет событий"
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Добавить первое событие
              </Button>
            </Empty>
          )
        }}
        renderItem={(event) => (
          <List.Item
            key={event.id}
            actions={[
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="edit"
                      icon={<EditOutlined />}
                      onClick={() => showEditModal(event)}
                    >
                      Редактировать
                    </Menu.Item>
                    <Menu.Item
                      key="delete"
                      danger
                      icon={<DeleteOutlined />}
                    >
                      <Popconfirm
                        title="Удалить событие?"
                        description="Это действие нельзя отменить"
                        onConfirm={() => onEventDelete(event.id)}
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
              title={
                <Space>
                  {event.title}
                  <Tag color={getPriorityColor(event.priority)}>
                    {event.priority}
                  </Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size="small">
                  {event.description && (
                    <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                      {event.description}
                    </Paragraph>
                  )}
                  <Space>
                    <CalendarOutlined />
                    {event.date}
                    <ClockCircleOutlined />
                    {event.time}
                  </Space>
                </Space>
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
        title={<Title level={4}>События</Title>}
        extra={
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            disabled={loading}
          >
            Добавить событие
          </Button>
        }
        style={{ width: '100%', height: '100%' }}
      >
        {renderContent()}
      </Card>

      <Modal
        title={editingEvent ? "Редактировать событие" : "Добавить событие"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingEvent ? "Сохранить" : "Добавить"}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Название"
            rules={[{ required: true, message: 'Введите название события' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Описание"
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="date"
            label="Дата"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="time"
            label="Время"
            rules={[{ required: true, message: 'Выберите время' }]}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Приоритет"
            rules={[{ required: true, message: 'Выберите приоритет' }]}
          >
            <Select>
              <Select.Option value="high">Высокий</Select.Option>
              <Select.Option value="medium">Средний</Select.Option>
              <Select.Option value="low">Низкий</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EventsColumn