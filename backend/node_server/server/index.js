const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const cors = require('cors');
const db = require('./db');
const config = require('../src/utils/config');

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Use configuration values
const region = config.get('REGION');
const projectId = config.get('PROJECT_ID');
const deploySuffix = config.get('DEPLOY_SUFFIX');

// Configure CORS with additional headers
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Cross-Origin-Opener-Policy', 'Cross-Origin-Embedder-Policy']
}));

// Add security headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.use(express.json());

app.post('/api/auth/google', async (req, res) => {
  try {
    console.log('Received auth request');
    const { token, userInfo } = req.body;
    console.log('Token received:', token.substring(0, 20) + '...');

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    console.log('Payload received:', payload.email);
    
    // Check if user exists, if not create new user
    const result = await db.query(
      'INSERT INTO users (email, name, picture) VALUES ($1, $2, $3) ' +
      'ON CONFLICT (email) DO UPDATE SET ' +
      'last_login = CURRENT_TIMESTAMP, name = $2, picture = $3 ' +
      'RETURNING id, email, name, picture',
      [payload.email, payload.name, payload.picture]
    );

    const user = result.rows[0];
    console.log('User data:', user);
    
    // Send back the complete user object
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
}); 