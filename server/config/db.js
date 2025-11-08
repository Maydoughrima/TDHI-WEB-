import pkg from 'pg';
const { Pool } = pkg;

// PostgreSQL connection setup
const pool = new Pool({
  user: process.env.DB_USER,           // your PostgreSQL username
  host: process.env.DB_HOST,       // your PostgreSQL host
  database: process.env.DB_DATABASE,       // your database name
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT,
});

// Test the connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database!'))
  .catch(err => console.error('Connection error', err));

export default pool;
