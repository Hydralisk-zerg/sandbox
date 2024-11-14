// UserPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/apiClient';
import { Employee } from '../interfaces/IUser';

const UserPage: React.FC = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.get<Employee>(`/dictionary/get_employees/${userId}/`);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>{`${user.first_name} ${user.last_name}`}</h2>
      <ul>
        <li>Email: {user.email}</li>
        <li>Additional Email: {user.additional_email || 'Not specified'}</li>
        <li>Phone: {user.phone || 'Not specified'}</li>
        <li>Additional Phone: {user.additional_phone || 'Not specified'}</li>
        <li>Birth Date: {user.birth_date || 'Not specified'}</li>
        <li>Department: {user.department.name}</li>
        <li>Position: {user.position.name}</li>
        <li>Hire Date: {user.hire_date || 'Not specified'}</li>
        <li>Registration Address: {user.registration_address || 'Not specified'}</li>
        <li>Living Address: {user.living_address || 'Not specified'}</li>
      </ul>
    </div>
  );
};

export default UserPage;
