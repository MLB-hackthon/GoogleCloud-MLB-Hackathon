const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '35.192.90.207',
  database: 'mlb-app',
  password: 'mlb',
  port: 5432,
});

// Create users table if it doesn't exist
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        picture TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initDb();

module.exports = pool; 