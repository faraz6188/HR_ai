import React from 'react';
import { useEffect, useState } from 'react';

interface UserProps {
  name?: string;
  position?: string;
}

const User: React.FC<UserProps> = ({ 
  name = "John Doe", 
  position = "Product Manager" 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  
  return (
    <div className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
        <span className="text-white text-sm font-medium">{name.split(' ').map(n => n[0]).join('')}</span>
      </div>
      {name && (
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-700">{name}</p>
          {position && <p className="text-xs text-gray-500">{position}</p>}
        </div>
      )}
    </div>
  );
};

export default User;