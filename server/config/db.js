import pkg from 'pg';
const { Pool } = pkg;

// PostgreSQL connection setup
const pool = new Pool({
  user: 'postgres',           // your PostgreSQL username
  host: 'localhost',
  database: 'tdhi_web',       // your database name
  password: '1414',  // replace with your PostgreSQL password
  port: 5432,
});

// Test the connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database!'))
  .catch(err => console.error('Connection error', err));

export default pool;
