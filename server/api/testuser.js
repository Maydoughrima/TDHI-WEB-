// testUser.js
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

async function createTestUser() {
  try {
    const username = "testuser2";
    const password = "password1234"; // plain text
    const fullname = "John Doed";

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert into users table
    const result = await pool.query(
      "INSERT INTO users (username, password_hash, fullname) VALUES ($1, $2, $3) RETURNING *",
      [username, hashedPassword, fullname]
    );

    console.log("Test user created:", result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error("Error creating test user:", error);
    process.exit(1);
  }
}

createTestUser();
