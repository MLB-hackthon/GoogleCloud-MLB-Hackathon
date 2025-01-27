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
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: handleGoogleLogin,
            auto_select: false,
            cancel_on_tap_outside: true,
            scope: 'email profile',
            ux_mode: 'popup',
          });

          window.google.accounts.id.renderButton(
            document.getElementById('google-login-button'),
            { 
              theme: 'outline', 
              size: 'large',
              width: 250,
              text: 'continue_with',
              shape: 'rectangular',
              type: 'standard',
            }
          );
        }
      };

      document.body.appendChild(script);
    };

    loadGoogleScript();

    return () => {
      const scriptTag = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (scriptTag) {
        scriptTag.remove();
      }
    };
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      if (!response.credential) {
        console.error('No credential received');
        return;
      }

      const decoded = JSON.parse(atob(response.credential.split('.')[1]));
      console.log('Decoded user info:', decoded);

      const userInfo = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      };

      updateUser(userInfo);
      navigate('/share');

      /* Uncomment when backend is ready
      const result = await fetch('http://localhost:3001/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          token: response.credential,
          userInfo: userInfo
        }),
      });

      const data = await result.json();
      console.log('Server response:', data);
      
      if (data.success) {
        updateUser(userInfo);
        navigate('/share');
      }
      */
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