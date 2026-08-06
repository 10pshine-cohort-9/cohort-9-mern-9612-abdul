import 'dotenv/config';
import app from './app.js';
import pool from './config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Successfully connected to the PostgreSQL database.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the PostgreSQL database:', error.message);
    process.exit(1);
  }
};

startServer();
