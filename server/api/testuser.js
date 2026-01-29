// testUser.js
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

async function createTestUser() {
  try {
    const username = "account1";
    const password = "password12345"; // plain text
    const fullname = "Nice One";
    const role = "PAYROLL_CHECKER";

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert into users table
    const result = await pool.query(
      `INSERT INTO users (username, fullname, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *`,
      [username, fullname, hashedPassword, role]
    );

    console.log("Test user created:", result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error("Error creating test user:", error);
    process.exit(1);
  }
}

createTestUser();
