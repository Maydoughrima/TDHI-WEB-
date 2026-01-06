import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";

// ✅ AUDIT LOG SERVICE
import { transactionLog } from "../services/transactionLog.js";

const router = express.Router();

/**
 * USER LOGIN
 * - Authenticates user
 * - Logs successful login to TRANSACTIONS / AUDIT LOG (append-only)
 */
router.post("/user/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userQuery = await pool.query(
      `
      SELECT 
        id,
        username,
        fullname,
        role,
        password_hash
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    if (!userQuery.rows.length) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const user = userQuery.rows[0];

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // ✅ AUDIT LOG (APPEND-ONLY)
    await transactionLog({
      actorId: user.id,
      actorRole: user.role || "user",
      action: "LOGIN",
      entity: "USER",
      entityId: user.id,
      referenceCode: null,
      status: "COMPLETED",
      description: `User ${user.username} logged in`,
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
