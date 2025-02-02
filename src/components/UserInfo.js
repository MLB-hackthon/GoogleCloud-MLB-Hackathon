import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './UserInfo.css';
import defaultAvatar from '../assets/default-avatar';

function UserInfo() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  console.log('UserInfo - Current user:', user); // Debug log

  const handleLogout = () => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    logout();
    navigate('/login');
  };

  // Don't render anything if no user
  if (!user) {
    return null;
  }

  return (
    <div className="user-info">
      <div className="user-profile">
        <div className="user-avatar-container">
          <img 
            src={imageError ? defaultAvatar : user.picture}
            alt={user.name || 'User'} 
            className="user-avatar"
            onError={() => setImageError(true)}
          />
        </div>
        <span className="user-name">{user.name || user.email}</span>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default UserInfo; 