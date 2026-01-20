import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * ======================================================
 * SYSTEM CUTOFF RULES (BACKEND-ONLY)
 * ======================================================
 * FIRST_CUTOFF_ONLY → 15th
 * BOTH_CUTOFFS      → 30th
 */
const CUTOFF_RULES = {
  SSS_PREMIUM: "FIRST_CUTOFF_ONLY",
  PHILHEALTH_PREMIUM: "FIRST_CUTOFF_ONLY",
  SSS_LOAN: "FIRST_CUTOFF_ONLY",
  PAGIBIG_CONTRIBUTION: "BOTH_CUTOFFS",
  PAGIBIG_LOAN: "BOTH_CUTOFFS",
};

/**
 * ======================================================
 * SAVE GOVERNMENT DEDUCTIONS (EMPLOYEE PROFILE)
 * ======================================================
 * POST /api/employees/:employeeId/government-deductions
 */
router.post("/:employeeId/government-deductions", async (req, res) => {
  const { employeeId } = req.params;
  const { government_deductions } = req.body;

  /** 🔒 HARD GUARD */
  if (!employeeId || employeeId === "undefined") {
    return res.status(400).json({
      message: "Valid employeeId is required",
    });
  }

  /** 🔒 PAYLOAD VALIDATION */
  if (!Array.isArray(government_deductions)) {
    return res.status(400).json({
      message: "Invalid payload",
    });
  }

  try {
    await pool.query("BEGIN");

    /**
     * 1. Ensure main container row exists
     */
    await pool.query(
      `
      INSERT INTO employee_government_deductions (employee_id)
      VALUES ($1)
      ON CONFLICT (employee_id) DO NOTHING
      `,
      [employeeId]
    );

    /**
     * 2. Track incoming deduction types
     */
    const incomingTypes = government_deductions.map((d) => d.type);

    /**
     * 3. Insert / Update deduction items
     */
    for (const d of government_deductions) {
      const cutoffBehavior = CUTOFF_RULES[d.type];

      if (!cutoffBehavior) {
        throw new Error(`Invalid deduction type: ${d.type}`);
      }

      await pool.query(
        `
        INSERT INTO employee_government_deduction_items (
          employee_id,
          type,
          amount,
          frequency,
          cutoff_behavior,
          is_active,
          start_date,
          end_date
        )
        VALUES ($1, $2, $3, 'MONTHLY', $4, $5, $6, $7)
        ON CONFLICT (employee_id, type)
        DO UPDATE SET
          amount = EXCLUDED.amount,
          is_active = EXCLUDED.is_active,
          start_date = EXCLUDED.start_date,
          end_date = EXCLUDED.end_date,
          updated_at = NOW()
        `,
        [
          employeeId,
          d.type,
          d.amount,
          cutoffBehavior,
          d.is_active,
          d.start_date,
          d.end_date,
        ]
      );
    }

    /**
     * 4. Deactivate deductions NOT included in payload
     */
    if (incomingTypes.length > 0) {
      await pool.query(
        `
        UPDATE employee_government_deduction_items
        SET is_active = false,
            updated_at = NOW()
        WHERE employee_id = $1
          AND type NOT IN (${incomingTypes
            .map((_, i) => `$${i + 2}`)
            .join(",")})
        `,
        [employeeId, ...incomingTypes]
      );
    } else {
      // No deductions sent → deactivate ALL
      await pool.query(
        `
        UPDATE employee_government_deduction_items
        SET is_active = false,
            updated_at = NOW()
        WHERE employee_id = $1
        `,
        [employeeId]
      );
    }

    await pool.query("COMMIT");

    res.json({ message: "Government deductions saved" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({
      message: "Failed to save deductions",
    });
  }
});

/**
 * ======================================================
 * GET GOVERNMENT DEDUCTIONS (EMPLOYEE PROFILE)
 * ======================================================
 * GET /api/employees/:employeeId/government-deductions
 */
router.get("/:employeeId/government-deductions", async (req, res) => {
  const { employeeId } = req.params;

  /** 🔒 HARD GUARD */
  if (!employeeId || employeeId === "undefined") {
    return res.status(400).json({
      message: "Valid employeeId is required",
    });
  }

  try {
    /**
     * 1. Check main container
     */
    const mainResult = await pool.query(
      `
      SELECT has_government_deductions
      FROM employee_government_deductions
      WHERE employee_id = $1
      `,
      [employeeId]
    );

    /**
     * 2. Fetch deduction items
     */
    const itemsResult = await pool.query(
      `
      SELECT
        type,
        amount,
        frequency,
        cutoff_behavior,
        is_active,
        start_date,
        end_date
      FROM employee_government_deduction_items
      WHERE employee_id = $1
      ORDER BY type
      `,
      [employeeId]
    );

    res.json({
      has_government_deductions:
        mainResult.rows[0]?.has_government_deductions ?? false,
      deductions: itemsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to load government deductions",
    });
  }
});

export default router;
