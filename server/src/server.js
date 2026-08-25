import 'dotenv/config';
import app from './app.js';
import pool from './config/database.js';
import logger from './config/logger.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    logger.info('Successfully connected to the PostgreSQL database.');
  } catch (error) {
    logger.error({ err: error }, 'Failed to connect to the PostgreSQL database.');
    process.exit(1);
  }

  try {
    const server = app.listen(PORT, () => {
      logger.info({ port: PORT }, `Server is running on port ${PORT}`);
    });

    server.on('error', (error) => {
      logger.error({ err: error }, 'Server startup error.');
      process.exit(1);
    });
  } catch (error) {
    logger.error({ err: error }, 'Server startup error.');
    process.exit(1);
  }
};

startServer();