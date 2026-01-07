import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * GET /api/transactions
 *
 * PURPOSE:
 * - Fetch audit log (transactions)
 * - Supports filtering (action, status)
 * - Supports pagination (limit, offset)
 * - JOIN users table to get actor info
 */
router.get("/transactions", async (req, res) => {
  try {
    const {
      action,
      status,
      limit = 20,
      offset = 0,
    } = req.query;

    const values = [];
    let whereClause = "WHERE 1=1";

    // 🔹 Filter by action
    if (action && action !== "ALL") {
      values.push(action);
      whereClause += ` AND t.action = $${values.length}`;
    }

    // 🔹 Filter by status
    if (status && status !== "ALL") {
      values.push(status);
      whereClause += ` AND t.status = $${values.length}`;
    }

    // =============================
    // 🔹 COUNT QUERY (pagination)
    // =============================
    const countQuery = `
      SELECT COUNT(*)
      FROM transactions t
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count, 10);

    // =============================
    // 🔹 DATA QUERY (JOIN users)
    // =============================
    values.push(limit);
    values.push(offset);

    const dataQuery = `
      SELECT
        t.id,
        t.action,
        t.entity,
        t.entity_id,
        t.reference_code,
        t.status,
        t.description,
        t.created_at,

        -- 🔥 JOINED USER DATA
        u.id AS actor_id,
        u.fullname AS actor_name,
        u.role AS actor_role

      FROM transactions t
      JOIN users u ON u.id = t.actor_id

      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length}
    `;

    const result = await pool.query(dataQuery, values);

    return res.json({
      success: true,
      data: result.rows,
      meta: {
        total,
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error) {
    console.error("Fetch transactions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
});

export default router;
