import express from "express";
import { pool } from "../config/db.js";
import { transactionLog } from "../services/transactionLog.js";

const router = express.Router();

/* ===============================
   GET /api/departments
=============================== */
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT id, name
      FROM departments
      WHERE is_active = true
      ORDER BY name ASC
      `
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Fetch departments error:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   POST /api/departments
   ADD DEPARTMENT
=============================== */
router.post("/", async (req, res) => {
  try {
    const actorId = req.headers["x-user-id"] || null;
    const actorRole = "ADMIN";
    const { name } = req.body;

    const { rows } = await pool.query(
      `
      INSERT INTO departments (name)
      VALUES ($1)
      RETURNING id, name
      `,
      [name]
    );

    await transactionLog({
      actorId,
      actorRole,
      action: "ADD",
      entity: "DEPARTMENT",
      entityId: rows[0].id,
      status: "COMPLETED",
      description: `Added department: ${name}`,
    });

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Add department error:", err);
    res.status(500).json({ success: false });
  }
});

export default router;
