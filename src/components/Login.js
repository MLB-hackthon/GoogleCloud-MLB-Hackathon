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
        callback: handleGoogleLogin,
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

  const handleGoogleLogin = async (response) => {
    try {
      console.log('Google response:', response);
      
      if (!response.credential) {
        console.error('No credential received');
        return;
      }

      const decoded = JSON.parse(atob(response.credential.split('.')[1]));
      console.log('Decoded user info:', decoded);

      const userInfo = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        token: response.credential
      };

      console.log('Setting user info:', userInfo);
      updateUser(userInfo);
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