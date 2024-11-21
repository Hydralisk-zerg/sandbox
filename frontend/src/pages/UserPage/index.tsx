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
      {user.firstName && user.lastName ? 
        <h2>{`${user.firstName} ${user.lastName}`}</h2>:
        <h2>{`${user.username}`}</h2> }
      
      <ul>
        <li>Email: {user.email || 'Not specified'}</li>
        <li>Additional Email: {user.additionalEmail || 'Not specified'}</li>
        <li>Phone: {user.phone || 'Not specified'}</li>
        <li>Additional Phone: {user.additionalPhone || 'Not specified'}</li>
        <li>Birth Date: {user.birthDate || 'Not specified'}</li>
        <li>Department: {user.department.name}</li>
        <li>Position: {user.position.name}</li>
        <li>Hire Date: {user.hireDate || 'Not specified'}</li>
        <li>Registration Address: {user.registrationAddress || 'Not specified'}</li>
        <li>Living Address: {user.livingAddress || 'Not specified'}</li>
      </ul>
    </div>
  );
};

export default UserPage;
