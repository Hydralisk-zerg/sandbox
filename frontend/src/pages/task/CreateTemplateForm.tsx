import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Space, Spin, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { api } from '../../services/apiClient';
import { Employee } from '../../interfaces/interfase';

const { Option } = Select;

interface TaskGroup {
  id: string;
  departmentId?: number;
  employeeId?: number;
  tasks: string[];
}

interface Template {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  task_groups: {
    department_id?: number;
    employee_id?: number;
    tasks: string[];
  }[];
}

interface CreateTemplateFormProps {
  onSave: (newTemplate: Template) => void;
  onCancel: () => void;
}

const CreateTemplateForm: React.FC<CreateTemplateFormProps> = ({ onSave, onCancel }) => {
  const [templateName, setTemplateName] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const employeesData = await api.getEmployees();
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    setSelectedEmployee(null);
  }, [selectedDepartment]);

  const departments = Array.from(
    new Set(employees.map(emp => emp.department))
  ).sort((a, b) => a.name.localeCompare(b.name));

  const departmentEmployees = selectedDepartment
    ? employees.filter(emp => emp.department.id === selectedDepartment)
    : employees;

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    const existingGroup = taskGroups.find(
      group =>
        group.departmentId === selectedDepartment &&
        group.employeeId === selectedEmployee
    );

    if (existingGroup) {
      setTaskGroups(taskGroups.map(group =>
        group.id === existingGroup.id
          ? { ...group, tasks: [...group.tasks, newTask] }
          : group
      ));
    } else {
      setTaskGroups([
        ...taskGroups,
        {
          id: Math.random().toString(),
          departmentId: selectedDepartment || undefined,
          employeeId: selectedEmployee || undefined,
          tasks: [newTask]
        }
      ]);
    }
    setNewTask('');
  };

  const handleDeleteTask = (groupId: string, taskIndex: number) => {
    setTaskGroups(taskGroups.map(group => {
      if (group.id === groupId) {
        const newTasks = group.tasks.filter((_, index) => index !== taskIndex);
        return newTasks.length ? { ...group, tasks: newTasks } : null;
      }
      return group;
    }).filter(Boolean) as TaskGroup[]);
  };

  const handleSaveTemplate = () => {
    console.log('Название шаблона:', templateName);
    console.log('Группы задач:', taskGroups);

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: templateName,
      created_by: "current_user",
      created_at: new Date().toISOString(),
      task_groups: taskGroups.map(group => ({
        department_id: group.departmentId,
        employee_id: group.employeeId,
        tasks: group.tasks
      }))
    };

    console.log('Новый шаблон:', newTemplate);
    onSave(newTemplate);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Input
        placeholder="Введите название шаблона"
        style={{ width: '50%' }} // Уменьшаем ширину поля ввода названия
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
      />

      {taskGroups.map(group => {
        const department = departments.find(d => d.id === group.departmentId);
        const employee = employees.find(e => e.id === group.employeeId);
        const title = [];
        if (department) title.push(`Отдел: ${department.name}`);
        if (employee) title.push(`Сотрудник: ${employee.firstName} ${employee.lastName}`);

        return (
          <div key={group.id} style={{ marginBottom: 12 }}>
            <h4 style={{ marginBottom: 4 }}>{title.join(' | ')}</h4>
            {group.tasks.map((task, index) => (
              <div
                key={index}
                style={{
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{task}</span>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteTask(group.id, index)}
                />
              </div>
            ))}
          </div>
        );
      })}

      <Divider style={{ margin: '8px 0' }} />

      <Space direction="vertical" style={{ width: '50%' }} size="small"> {/* Уменьшаем ширину блока с полями */}
        <Space>
          <Select
            style={{ width: 200 }}
            placeholder="Выберите отдел"
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            allowClear
          >
            {departments.map(dept => (
              <Option key={dept.id} value={dept.id}>{dept.name}</Option>
            ))}
          </Select>

          <Select
            style={{ width: 200 }}
            placeholder="Выберите сотрудника"
            value={selectedEmployee}
            onChange={setSelectedEmployee}
            allowClear
          >
            {departmentEmployees.map(emp => (
              <Option key={emp.id} value={emp.id}>
                {`${emp.firstName} ${emp.lastName}`.trim() || emp.username}
              </Option>
            ))}
          </Select>
        </Space>

        {(selectedDepartment || selectedEmployee) && (
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <Input
              placeholder="Введите задачу"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              style={{ width: '100%' }}
            />

            {newTask.trim() && (
              <Button
                type="dashed"
                onClick={handleAddTask}
                icon={<PlusOutlined />}
                style={{ width: 'auto' }} // Уменьшаем ширину кнопки
              >
                Добавить задачу
              </Button>
            )}
          </Space>
        )}
      </Space>

      <Button
        type="primary"
        ghost
        onClick={handleSaveTemplate}
        disabled={!templateName || taskGroups.length === 0}
        style={{ marginTop: 8, width: 'auto' }} // Уменьшаем ширину кнопки сохранения
      >
        Сохранить шаблон
      </Button>
    </div>
  );

};

export default CreateTemplateForm;
