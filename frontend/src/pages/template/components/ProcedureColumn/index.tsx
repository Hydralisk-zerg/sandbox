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
  Select,
  Space,
  Tag
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  FilterOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Procedure, ProceduresColumnProps } from '../../../../interfaces/interfase';
import ProcedureDetailsModal from './ProcedureDetailsModal';

const { Title } = Typography;
const { TextArea } = Input;

const ProcedureColumn: React.FC<ProceduresColumnProps> = ({
  procedures,
  tasks,
  events,
  data,
  loading = false,
  error,
  isFiltered = false,
  onProcedureAdd,
  onProcedureDelete,
  onProcedureEdit,
  onProcedureFilter
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);

  const [form] = Form.useForm();

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const procedureData: Omit<Procedure, 'id'> = {
        name: values.name,
        description: values.description,
        linkedItems: {
          tasks: values.linkedItems?.tasks || [],
          events: values.linkedItems?.events || [],
          data: values.linkedItems?.data || []
        },
        status: values.status || 'active'
      };

      if (editingProcedure) {
        onProcedureEdit({
          ...procedureData,
          id: editingProcedure.id
        });
      } else {
        onProcedureAdd(procedureData);
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingProcedure(null);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProcedure(null);
  };

  const showEditModal = (procedure: Procedure) => {
    setEditingProcedure(procedure);
    form.setFieldsValue({
      name: procedure.name,
      description: procedure.description,
      status: procedure.status,
      linkedItems: {
        tasks: procedure.linkedItems?.tasks || [],
        events: procedure.linkedItems?.events || [],
        data: procedure.linkedItems?.data || []
      }
    });
    setIsModalVisible(true);
  };

  const renderLinkedItems = (procedure: Procedure) => {
    if (!procedure.linkedItems) return null;

    const linkedTasks = tasks.filter(task =>
      procedure.linkedItems?.tasks?.includes(task.id)
    );
    const linkedEvents = events.filter(event =>
      procedure.linkedItems?.events?.includes(event.id)
    );
    const linkedData = data.filter(temp =>
      procedure.linkedItems?.data?.includes(temp.id)
    );

    return (
      <Space direction="vertical" size={4}>
        {linkedTasks.length > 0 && (
          <div>
            <Typography.Text type="secondary">Задачи: </Typography.Text>
            {linkedTasks.map(task => (
              <Tag key={task.id}>{task.name}</Tag>
            ))}
          </div>
        )}
        {linkedEvents.length > 0 && (
          <div>
            <Typography.Text type="secondary">События: </Typography.Text>
            {linkedEvents.map(event => (
              <Tag key={event.id}>{event.name}</Tag>
            ))}
          </div>
        )}
        {linkedData.length > 0 && (
          <div>
            <Typography.Text type="secondary">Данные: </Typography.Text>
            {linkedData.map(data => (
              <Tag key={data.id}>{data.name}</Tag>
            ))}
          </div>
        )}
      </Space>
    );
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
      <List<Procedure>
        loading={loading}
        dataSource={procedures}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Нет процедур"
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Создать первую процедуру
              </Button>
            </Empty>
          )
        }}
        renderItem={(procedure: Procedure) => (
          <List.Item
            key={procedure.id}
            actions={[
              <Dropdown
                key="actions"
                menu={{
                  items: [
                    {
                      key: "show",
                      icon: <EyeOutlined />,
                      onClick: () => {
                        setSelectedProcedure(procedure);
                        setIsCardModalVisible(true);
                      },
                      label: 'Показати картку'
                    },
                    {
                      key: "filter",
                      icon: <FilterOutlined />,
                      onClick: () => onProcedureFilter(procedure),
                      label: isFiltered ? "Сбросить фильтр" : "Фильтровать связанные"
                    },
                    {
                      key: "edit",
                      icon: <EditOutlined />,
                      onClick: () => showEditModal(procedure),
                      label: 'Редактировать'
                    },
                    {
                      key: "delete",
                      icon: <DeleteOutlined />,
                      danger: true,
                      label: (
                        <Popconfirm
                          title="Видалити процедуру?"
                          description="Цю дію неможливо скасувати"
                          onConfirm={() => onProcedureDelete(procedure.id)}
                          okText="Так"
                          cancelText="Ні"
                        >
                          Видалити
                        </Popconfirm>
                      )
                    }
                  ]
                }}
                trigger={['click']}
              >
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  {procedure.name}
                  {isFiltered && <Tag color="blue">Отфильтровано</Tag>}
                </Space>
              }
              description={
                <Space direction="vertical" size={8}>
                  {procedure.description && (
                    <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                      {procedure.description}
                    </Typography.Paragraph>
                  )}
                  {renderLinkedItems(procedure)}
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
        title={<Title level={4}>Процедуры</Title>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            disabled={loading}
            ghost
          >
            Добавить процедуру
          </Button>
        }
        style={{ width: '100%', height: '100%' }}
      >
        {renderContent()}
      </Card>

      <Modal
        title={editingProcedure ? "Редактировать процедуру" : "Добавить процедуру"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingProcedure ? "Сохранить" : "Добавить"}
        cancelText="Отмена"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          preserve={false}
        >
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название процедуры' }]}
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
            name={['linkedItems', 'tasks']}
            label="Связанные задачи"
          >
            <Select
              mode="multiple"
              placeholder="Выберите задачи"
              optionFilterProp="children"
            >
              {tasks.map(task => (
                <Select.Option key={task.id} value={task.id}>
                  {task.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={['linkedItems', 'events']}
            label="Связанные события"
          >
            <Select
              mode="multiple"
              placeholder="Выберите события"
              optionFilterProp="children"
            >
              {events.map(event => (
                <Select.Option key={event.id} value={event.id}>
                  {event.name}
                </Select.Option>
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
              {data.map(data => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <ProcedureDetailsModal
        tasks={tasks}
        events={events}
        data={data}
        isVisible={isCardModalVisible}
        onClose={() => setIsCardModalVisible(false)}
      />
    </>
  );
};

export default ProcedureColumn;
