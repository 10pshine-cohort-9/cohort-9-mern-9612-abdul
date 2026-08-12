import 'dotenv/config';
import app from './app.js';
import pool from './config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Successfully connected to the PostgreSQL database.');
  } catch (error) {
    console.error('Failed to connect to the PostgreSQL database:', error.message);
    process.exit(1);
  }

  const server = app.listen(PORT);

  server.on('listening', () => {
    console.log(`Server is running on port ${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
    } else {
      console.error('Server error:', error.message);
    }
    process.exit(1);
  });
};

startServer();
