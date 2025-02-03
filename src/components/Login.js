import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const CLIENT_ID = "218661372917-r65cdbmtlha18e38dgkmq6baq1au3ahh.apps.googleusercontent.com";

  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleSignIn();
      } else {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.body.appendChild(script);
      }
    };

    const initializeGoogleSignIn = () => {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-login-button'),
        { 
          theme: 'outline', 
          size: 'large',
          width: 250,
          text: 'continue_with',
          shape: 'rectangular',
          type: 'standard'
        }
      );
    };

    loadGoogleScript();
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      if (!response.credential) {
        console.error('No credential received');
        return;
      }

      // Send token to backend
      const backendResponse = await fetch('http://34.56.194.81:8000/api/v1/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.credential
        })
      });

      const data = await backendResponse.json();
      console.log('Backend response:', data);

      // Update user context with backend response
      updateUser(data);
      navigate('/share');

    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to MLB Highlights</h1>
        <p>Sign in to continue</p>
        <div id="google-login-button"></div>
      </div>
    </div>
  );
}

export default Login; 