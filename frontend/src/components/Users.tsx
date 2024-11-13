import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/get_users/', {
          method: 'POST',
          credentials: 'include', // Важно для отправки куки с CSRF-токеном
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'), // Функция для получения CSRF-токена из куки
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('У вас нет прав для просмотра списка пользователей');
          } else {
            throw new Error('Ошибка при получении списка пользователей');
          }
        }

        const data = await response.json();
        setUsers(data);
      } catch (error: any) {
        setError(error.message);
        console.error('Failed to fetch users:', error.message);
      }
    };

    fetchUsers();
  }, []);

  // Функция для получения значения куки
  const getCookie = (name: string): string => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
    return '';
  };

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div>
      <h2>Список пользователей</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user: User) => (
            <li key={user.id}>{user.id}: {user.username}</li>
          ))}
        </ul>
      ) : (
        <p>Загрузка пользователей...</p>
      )}
    </div>
  );
};

export default Users;
