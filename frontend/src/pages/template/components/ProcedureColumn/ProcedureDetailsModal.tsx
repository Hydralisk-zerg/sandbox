import React, { useEffect, useState } from 'react';
import { Modal, Typography, Space, Empty, Form, Input, Select } from 'antd';
import { taskStorage, eventStorage, dataStorage } from '../../../../services/templateStorage';

const { Title } = Typography;

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

interface Task {
  id: string;
  name: string;
  description: string;
}

interface Event {
  id: string;
  name: string;
  description: string;
}

interface Data {
  id: string;
  name: string;
  description: string;
  fieldType: string;
  fieldName: string;
}
interface ModalProps {
  procedureId: string;
  isVisible: boolean;
  onClose: () => void;
}

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

  useEffect(() => {
    if (isVisible && procedureId) {
      const procedures = JSON.parse(localStorage.getItem('procedures') || '[]');
      const currentProcedure = procedures.find((p: Procedure) => p.id === procedureId);

      if (currentProcedure) {
        setProcedure(currentProcedure);

        // Отримуємо пов'язані задачі
        if (currentProcedure.linkedItems.tasks.length > 0) {
          const allTasks = taskStorage.getTasks() || [];
          const filteredTasks = allTasks.filter((task: Task) =>
            currentProcedure.linkedItems.tasks.includes(task.id)
          );
          setLinkedTasks(filteredTasks);
        }

        // Отримуємо пов'язані події
        if (currentProcedure.linkedItems.events.length > 0) {
          const allEvents = eventStorage.getEvents() || [];
          const filteredEvents = allEvents.filter((event: Event) =>
            currentProcedure.linkedItems.events.includes(event.id)
          );
          setLinkedEvents(filteredEvents);
        }

        // Отримуємо пов'язані дані
        if (currentProcedure.linkedItems.data.length > 0) {
          const allData = dataStorage.getData() || [];
          const filteredData = allData.filter((data: Data) =>
            currentProcedure.linkedItems.data.includes(data.id)
          );
          setLinkedData(filteredData);
        }
      }
    }
  }, [procedureId, isVisible]);

  const renderDataField = (data: Data) => {
    const commonProps = {
      placeholder: data.description
    };

    if (data.fieldType === 'employees' || data.fieldType === 'select') {
      return (
        <Form.Item
          key={data.id}
          name={data.id}
          label={data.fieldName}
        >
          <Select
            {...commonProps}
            mode="multiple"
            options={[
              // Тут можна додати опції для select
              { value: 'employee1', label: 'Співробітник 1' },
              { value: 'employee2', label: 'Співробітник 2' },
            ]}
          />
        </Form.Item>
      );
    }

    return (
      <Form.Item
        key={data.id}
        name={data.id}
        label={data.fieldName}
      >
        <Input
          {...commonProps}
          type={data.fieldType}
        />
      </Form.Item>
    );
  };

  return (
    <Modal
      title={<Title level={4}>{procedure?.name || 'Деталі процедури'}</Title>}
      open={isVisible}
      onCancel={onClose}
      onOk={onClose}
      width={800}
    >
      {!procedure ? (
        <Empty description="Процедуру не знайдено" />
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={5}>Опис процедури</Title>
            <p>{procedure.description}</p>
          </div>

          {/* Відображення пов'язаних задач */}
          {linkedTasks.length > 0 && (
            <div>
              <Title level={5}>Задачі</Title>
              {linkedTasks.map(task => (
                <div key={task.id} style={{ marginBottom: 16 }}>
                  <div><strong>Назва:</strong> {task.name}</div>
                  <div><strong>Опис:</strong> {task.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Відображення пов'язаних подій */}
          {linkedEvents.length > 0 && (
            <div>
              <Title level={5}>Події</Title>
              {linkedEvents.map(event => (
                <div key={event.id} style={{ marginBottom: 16 }}>
                  <div><strong>Назва:</strong> {event.name}</div>
                  <div><strong>Опис:</strong> {event.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Відображення пов'язаних даних як форми */}
          {linkedData.length > 0 && (
            <div>
              <Title level={5}>Дані</Title>
              <Form form={form} layout="vertical">
                {linkedData.map(data => renderDataField(data))}
              </Form>
            </div>
          )}

          {linkedTasks.length === 0 && linkedEvents.length === 0 && linkedData.length === 0 && (
            <Empty description="Немає пов'язаних елементів" />
          )}
        </Space>
      )}
    </Modal>
  );
};

export default ProcedureDetailsModal;
