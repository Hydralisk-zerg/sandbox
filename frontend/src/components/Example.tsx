// src/components/Example.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../services/apiClient';

// Интерфейсы для типизации данных
interface User {
  id: number;
  username: string;
}

interface Country {
  id: number;
  name: string;
  code: string;
}

const Example: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Пример получения списка пользователей
  const fetchUsers = async () => {
    try {
      const data = await api.get<User[]>('/get_users/');
      setUsers(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Пример создания новой страны
  const createCountry = async () => {
    try {
      const newCountry = await api.post<Country>('/dictionaries/countries/', {
        name: 'New Country',
        code: 'NC'
      });
      console.log('Created country:', newCountry);
    } catch (error: any) {
      console.error('Error creating country:', error.message);
    }
  };

  // Пример обновления страны
  const updateCountry = async (id: number) => {
    try {
      const updatedCountry = await api.patch<Country>(`/dictionaries/countries/${id}/`, {
        name: 'Updated Country Name'
      });
      console.log('Updated country:', updatedCountry);
    } catch (error: any) {
      console.error('Error updating country:', error.message);
    }
  };

  // Пример удаления страны
  const deleteCountry = async (id: number) => {
    try {
      await api.delete(`/dictionaries/countries/${id}/`);
      console.log('Country deleted successfully');
    } catch (error: any) {
      console.error('Error deleting country:', error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
      <button onClick={createCountry}>Create Country</button>
    </div>
  );
};

export default Example;
