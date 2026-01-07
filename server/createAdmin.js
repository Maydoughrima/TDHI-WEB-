import bcrypt from 'bcrypt';
import { pool } from "./config/db.js";

const saltRounds = 10; //set hashing complexity

async function createAdmin(username, password, fullName) {
 const hashedPassword = await bcrypt.hash(password, saltRounds);

 const result = await pool.query(
    "INSERT INTO admins (username, password, fullname) VALUES ($1, $2, $3) RETURNING *",
    [username, hashedPassword, fullName]
 );

 console.log ("Admin user created:", result.rows[0]);
 process.exit();
};

createAdmin("Admintest3", "admin123", "John Doess");