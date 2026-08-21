import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

config();
config({ path: join(__dirname, '..', '.env.test'), override: true });

const TEST_DB_NAME = 'notes_app_test';

if (process.env.DB_NAME && process.env.DB_NAME !== TEST_DB_NAME) {
  throw new Error(
    `Refusing to run tests against database "${process.env.DB_NAME}"`
  );
}

process.env.DB_NAME = TEST_DB_NAME;
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'silent';

const schemaSQL = readFileSync(
  join(__dirname, '..', 'src', 'database', 'schema.sql'),
  'utf-8',
);

let pool;

async function getPool() {
  if (!pool) {
    const mod = await import('../src/config/database.js');
    pool = mod.default;
  }
  return pool;
}

export async function cleanDatabase() {
  const p = await getPool();
  await p.query(
    'TRUNCATE TABLE revoked_tokens, notes, users RESTART IDENTITY CASCADE',
  );
}

export const mochaHooks = {
  async beforeAll() {
    const pg = await import('pg');
    const Pool = pg.default.Pool;
    const adminPool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: 'postgres',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    try {
      await adminPool.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
    } catch (err) {
      if (err.code !== '42P04') throw err;
    } finally {
      await adminPool.end();
    }

    const p = await getPool();
    await p.query('DROP TABLE IF EXISTS revoked_tokens, notes, users CASCADE');
    await p.query(schemaSQL);
  },

  async afterAll() {
    if (pool) {
      await pool.query('DROP TABLE IF EXISTS revoked_tokens, notes, users CASCADE');
      await pool.end();
    }
  },
};
