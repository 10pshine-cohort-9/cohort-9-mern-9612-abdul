import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

let pool;

try {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  const requiredEnvVars = { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD };

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value || value.trim() === '') {
      throw new Error(`Missing or empty environment variable: ${key}`);
    }
  }

  const portNumber = Number(DB_PORT);

  if (
    !Number.isInteger(portNumber) ||
    portNumber < 1 ||
    portNumber > 65535
  ) {
    throw new Error('DB_PORT must be a valid integer between 1 and 65535');
  }

  pool = new Pool({
    host: DB_HOST,
    port: portNumber,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    connectionTimeoutMillis: 3000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err.message);
  });
} catch (error) {
  console.error('Database Configuration Error:', error.message);
  process.exit(1);
}

export default pool;