import React, { useEffect, useState } from 'react';
import { api } from '../services/apiClient';

interface User {
  id: number;
  username: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fetchUsers = async () => {
    try {
      const data = await api.get<User[]>('/get_users/');
      setUsers(data);
    } catch (error: any) {
      setError(error.message);
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
    </div>
  );
};

export default Users;
