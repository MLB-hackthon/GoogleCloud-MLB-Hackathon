// Import React and MLBShowcase component
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Login from './components/Login';
import SharePage from "./SharePage";
import "./SharePage.css";
import StartPage from "./StartPage";
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  console.log('Protected Route - Current user:', user); // Debug log
  
  if (!user) {
    console.log('No user found, redirecting to login'); // Debug log
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Callback component to handle Google redirect
const GoogleCallback = () => {
  const navigate = useNavigate();
  const { updateUser } = useUser();

  useEffect(() => {
    // Get the credential from URL hash
    const urlParams = new URLSearchParams(window.location.search);
    const credential = urlParams.get('credential');

    if (credential) {
      try {
        const decoded = JSON.parse(atob(credential.split('.')[1]));
        console.log('Decoded credential:', decoded); // Debug log

        const userInfo = {
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture
        };
        console.log('Setting user info:', userInfo); // Debug log
        
        updateUser(userInfo);
        navigate('/share');
      } catch (error) {
        console.error('Failed to process login:', error);
        updateUser(null);
        navigate('/login');
      }
    } else {
      console.log('No credential found in URL'); // Debug log
      navigate('/login');
    }
  }, [navigate, updateUser]);

  return (
    <div className="login-processing">
      <p>Processing login...</p>
    </div>
  );
};

// Main App component
function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<GoogleCallback />} />
          <Route
            path="/share"
            element={
              <ProtectedRoute>
                {/* <StartPage  /> */}
                <SharePage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}


// Export App as the default export
export default App;
