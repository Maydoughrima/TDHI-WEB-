import pool from './config/db.js';  // note the .js extension

async function getPatients() {
  try {
    const res = await pool.query('SELECT * FROM sample_user'); //statement to display the table data
    console.table(res.rows);
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    pool.end();
  }
}

getPatients();
