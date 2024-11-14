import React from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import type { ContextType } from '../../layout'; // путь может отличаться

const UserPage: React.FC = () => {
  const { userId } = useParams();
  const { employees } = useOutletContext<ContextType>();
  
  const user = employees.find(emp => emp.id.toString() === userId);

  if (!user) return <div>User not found</div>;

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
