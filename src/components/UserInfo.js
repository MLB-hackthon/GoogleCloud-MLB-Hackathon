import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './UserInfo.css';

function UserInfo() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  console.log('Current user in UserInfo:', user); // Debug log

  // Always render the component, with either email or TEST FAILED
  return (
    <div className="user-info">
      <div className="user-profile">
        {user?.picture && (
          <img 
            src={user.picture} 
            alt={user.name || 'User'} 
            className="user-avatar"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
        <span className="user-email">
          {user?.email || 'TEST FAILED'}
        </span>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default UserInfo; 