import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * GET /api/transactions
 *
 * PURPOSE:
 * - Fetch audit log (transactions)
 * - Supports filtering (action, status)
 * - Supports pagination
 * - Shows:
 *   ✅ Actor (who did it)
 *   ✅ Affected account (who was changed)
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

    /* FILTERS */
    if (action && action !== "ALL") {
      values.push(action);
      whereClause += ` AND t.action = $${values.length}`;
    }

    if (status && status !== "ALL") {
      values.push(status);
      whereClause += ` AND t.status = $${values.length}`;
    }

    /* COUNT */
    const countQuery = `
      SELECT COUNT(*)
      FROM transactions t
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, values);
    const total = Number(countResult.rows[0].count);

    /* DATA QUERY */
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

        -- ACTOR
        u.id AS actor_id,
        u.fullname AS actor_name,
        u.role AS actor_role,

        -- 🔥 AFFECTED ACCOUNT
        e.id AS affected_employee_id,
        e.full_name AS affected_employee_name

      FROM transactions t
      JOIN users u ON u.id = t.actor_id
      LEFT JOIN employees e ON e.id = t.entity_id

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
