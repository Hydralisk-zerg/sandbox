import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import ProcedureColumn from './components/ProcedureColumn';
import TasksColumn from './components/TasksColumn';
import EventsColumn from './components/EventsColumn';
import DataColumn from './components/DатаColumn';
import { 
  procedureStorage, 
  taskStorage, 
  eventStorage, 
  dataStorage 
} from '../../services/templateStorage';
import { 
  Procedure, 
  Task, 
  Data, 
  Event as CustomEvent 
} from '../../interfaces/interfase';

const { Content } = Layout;

interface EventData extends Omit<CustomEvent, 'id'> {
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

const Dashboard: React.FC = () => {
  // Состояния
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [allProcedures, setAllProcedures] = useState<Procedure[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [data, setData] = useState<Data[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CustomEvent[]>([]);
  const [filteredData, setFilteredData] = useState<Data[]>([]);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadedProcedures = procedureStorage.getProcedures();
    setProcedures(loadedProcedures);
    setAllProcedures(loadedProcedures);
    setTasks(taskStorage.getTasks());
    setEvents(eventStorage.getEvents());
    setData(dataStorage.getData());
  }, []);

  // Функция обновления отфильтрованных элементов
  const updateFilteredItems = (procedure: Procedure) => {
    const linkedTasks = tasks.filter(task => 
      procedure.linkedItems?.tasks?.includes(task.id)
    );
    const linkedEvents = events.filter(event => 
      procedure.linkedItems?.events?.includes(event.id)
    );
    const linkedData = data.filter(data => 
      procedure.linkedItems?.data?.includes(data.id)
    );

    setFilteredTasks(linkedTasks);
    setFilteredEvents(linkedEvents);
    setFilteredData(linkedData);
  };

  // Обработчик фильтрации
  const handleProcedureFilter = (procedure: Procedure) => {
    if (!isFiltered) {
      setSelectedProcedure(procedure);
      updateFilteredItems(procedure);
      setProcedures([procedure]);
      setIsFiltered(true);
    } else {
      setSelectedProcedure(null);
      setFilteredTasks([]);
      setFilteredEvents([]);
      setFilteredData([]);
      setProcedures(allProcedures);
      setIsFiltered(false);
    }
  };

  // Обработчики проектов
  const handleProcedureAdd = (procedureData: Omit<Procedure, 'id'>) => {
    const newProcedure: Procedure = {
      ...procedureData,
      id: uuidv4(),
      status: procedureData.status || 'pending',
      linkedItems: {
        tasks: procedureData.linkedItems?.tasks || [],
        events: procedureData.linkedItems?.events || [],
        data: procedureData.linkedItems?.data || []
      }
    };
    const updatedProcedures = [...allProcedures, newProcedure];
    setAllProcedures(updatedProcedures);
    if (!isFiltered) {
      setProcedures(updatedProcedures);
    }
    procedureStorage.saveProcedures(updatedProcedures);
  };

  const handleProcedureDelete = (procedureId: string) => {
    const updatedProcedures = allProcedures.filter(p => p.id !== procedureId);
    setAllProcedures(updatedProcedures);
    if (!isFiltered) {
      setProcedures(updatedProcedures);
    }
    procedureStorage.saveProcedures(updatedProcedures);
  };

  const handleProcedureEdit = (updatedProcedure: Procedure) => {
    const updatedProcedures = allProcedures.map(p =>
      p.id === updatedProcedure.id ? updatedProcedure : p
    );
    setAllProcedures(updatedProcedures);
    procedureStorage.saveProcedures(updatedProcedures);

    if (isFiltered && selectedProcedure?.id === updatedProcedure.id) {
      setSelectedProcedure(updatedProcedure);
      setProcedures([updatedProcedure]);
      updateFilteredItems(updatedProcedure);
    }
  };

  // Обработчики задач
  const handleTaskAdd = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium'
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    taskStorage.saveTasks(updatedTasks);

    if (isFiltered && selectedProcedure) {
      updateFilteredItems(selectedProcedure);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    taskStorage.saveTasks(updatedTasks);

    if (isFiltered && selectedProcedure) {
      updateFilteredItems(selectedProcedure);
    }
  };

  const handleTaskEdit = (updatedTask: Task) => {
    const updatedTasks = tasks.map(t =>
      t.id === updatedTask.id ? updatedTask : t
    );
    setTasks(updatedTasks);
    taskStorage.saveTasks(updatedTasks);

    if (isFiltered && selectedProcedure) {
      updateFilteredItems(selectedProcedure);
    }
  };

  // Обработчики событий
  const handleEventAdd = (eventData: EventData) => {
    const newEvent: CustomEvent = {
      ...eventData,
      id: uuidv4(),
      status: eventData.status || 'pending',
      priority: eventData.priority || 'medium'
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    eventStorage.saveEvents(updatedEvents);

    if (isFiltered && selectedProcedure) {
      updateFilteredItems(selectedProcedure);
    }
  };

  const handleEventDelete = (eventId: string) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    eventStorage.saveEvents(updatedEvents);

    if (isFiltered && selectedProcedure) {
      updateFilteredItems(selectedProcedure);
    }
  };

  const handleEventEdit = (updatedEvent: CustomEvent) => {
    const updatedEvents = events.map(e =>
      e.id === updatedEvent.id ? updatedEvent : e
    );
    setEvents(updatedEvents);
    eventStorage.saveEvents(updatedEvents);

    if (isFiltered && selectedProcedure) {
      updateFilteredItems(selectedProcedure);
    }
  };

  // Обработчики шаблонов
  const handleDataAdd = (dataData: Omit<Data, 'id'>) => {
    const newData: Data = {
      ...dataData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    const updatedData = [...data, newData];
    setData(updatedData);
    dataStorage.saveData(updatedData);

    if (isFiltered && selectedProcedure) {
      updateFilteredItems(selectedProcedure);
    }
  };

  const handleDataDelete = (dataId: string) => {
    const updatedData = data.filter(t => t.id !== dataId);
    setData(updatedData);
    dataStorage.saveData(updatedData);

    if (isFiltered && selectedProcedure) {
      updateFilteredItems(selectedProcedure);
    }
  };

  const handleDataEdit = (updatedData: Data) => {
    const updatedAllData = data.map(t =>
      t.id === updatedData.id ? updatedData : t
    );
    setData(updatedAllData);
    dataStorage.saveData(updatedAllData);

    if (isFiltered && selectedProcedure) {
      updateFilteredItems(selectedProcedure);
    }
  };

  return (
    <Layout>
      <Card>
        <Content style={{ padding: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <ProcedureColumn
                procedures={procedures}
                tasks={tasks}
                events={events}
                data={data}
                onProcedureAdd={handleProcedureAdd}
                onProcedureDelete={handleProcedureDelete}
                onProcedureEdit={handleProcedureEdit}
                onProcedureFilter={handleProcedureFilter}
                isFiltered={isFiltered}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <TasksColumn
                tasks={isFiltered ? filteredTasks : tasks}
                onTaskAdd={handleTaskAdd}
                onTaskDelete={handleTaskDelete}
                onTaskEdit={handleTaskEdit}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <EventsColumn
                events={isFiltered ? filteredEvents : events}
                onEventAdd={handleEventAdd}
                onEventDelete={handleEventDelete}
                onEventEdit={handleEventEdit}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <DataColumn
                data={isFiltered ? filteredData : data}
                loading={false}
                error={undefined}
                onDataAdd={handleDataAdd}
                onDataDelete={handleDataDelete}
                onDataEdit={handleDataEdit}
              />
            </Col>
          </Row>
        </Content>
      </Card>
    </Layout>
  );
};

export default Dashboard;
