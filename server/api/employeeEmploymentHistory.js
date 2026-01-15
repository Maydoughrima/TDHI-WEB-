import express from "express";
import { pool } from "../config/db.js";
import { transactionLog } from "../services/transactionLog.js";

const router = express.Router();

/* ======================================================
   GET /api/employees/:id/employment-history
====================================================== */
router.get("/:id/employment-history", async (req, res) => {
  try {
    const employeeId = req.params.id;

    const { rows } = await pool.query(
      `
      SELECT *
      FROM employee_employment_history
      WHERE employee_id = $1
      ORDER BY start_date DESC
      `,
      [employeeId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Fetch employment history error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   POST /api/employees/:id/employment-history
   ADD EMPLOYMENT RECORD
====================================================== */
router.post("/:id/employment-history", async (req, res) => {
  const client = await pool.connect();

  try {
    const employeeId = req.params.id;
    const actorId = req.headers["x-user-id"] || null;
    const actorRole = "PAYROLL_CHECKER";

    const {
      company_name,
      position,
      employment_type,
      company_place,
      start_date,
      end_date,
    } = req.body;

    const { rows } = await client.query(
      `
      INSERT INTO employee_employment_history (
        employee_id,
        company_name,
        position,
        employment_type,
        company_place,
        start_date,
        end_date
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        employeeId,
        company_name,
        position,
        employment_type,
        company_place,
        start_date,
        end_date || null,
      ]
    );

    await transactionLog({
      actorId,
      actorRole,
      action: "ADD",
      entity: "EMPLOYEE_EMPLOYMENT_HISTORY",
      entityId: employeeId,
      status: "COMPLETED",
      description: `Added employment history: ${company_name} (${position})`,
    });

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Add employment history error:", err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

/* ======================================================
   PATCH /api/employees/employment-history/:historyId
   EDIT EMPLOYMENT RECORD + AUDIT TRAIL
====================================================== */
router.patch("/employment-history/:historyId", async (req, res) => {
  const client = await pool.connect();

  try {
    const historyId = req.params.historyId;
    const actorId = req.headers["x-user-id"] || null;
    const actorRole = "PAYROLL_CHECKER";

    // Fetch old record
    const { rows } = await client.query(
      `SELECT * FROM employee_employment_history WHERE id = $1`,
      [historyId]
    );

    const old = rows[0];
    if (!old) {
      return res.status(404).json({ success: false });
    }

    const fields = {
      company_name: req.body.company_name,
      position: req.body.position,
      employment_type: req.body.employment_type,
      company_place: req.body.company_place,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
    };

    await client.query(
      `
      UPDATE employee_employment_history SET
        company_name = COALESCE($1, company_name),
        position = COALESCE($2, position),
        employment_type = COALESCE($3, employment_type),
        company_place = COALESCE($4, company_place),
        start_date = COALESCE($5, start_date),
        end_date = COALESCE($6, end_date),
        updated_at = NOW()
      WHERE id = $7
      `,
      [
        fields.company_name,
        fields.position,
        fields.employment_type,
        fields.company_place,
        fields.start_date,
        fields.end_date,
        historyId,
      ]
    );

    // 🔍 FIELD-LEVEL AUDIT LOG (EDIT)
    for (const key in fields) {
      if (
        fields[key] !== undefined &&
        String(fields[key]) !== String(old[key])
      ) {
        await transactionLog({
          actorId,
          actorRole,
          action: "EDIT", // ✅ AS REQUESTED
          entity: "EMPLOYEE_EMPLOYMENT_HISTORY",
          entityId: old.employee_id,
          status: "COMPLETED",
          description: `${key} changed from "${old[key] ?? "NULL"}" to "${fields[key]}"`,
        });
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Edit employment history error:", err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

/* ======================================================
   DELETE /api/employees/employment-history/:historyId
====================================================== */
router.delete("/employment-history/:historyId", async (req, res) => {
  const client = await pool.connect();

  try {
    const historyId = req.params.historyId;
    const actorId = req.headers["x-user-id"] || null;
    const actorRole = "PAYROLL_CHECKER";

    const { rows } = await client.query(
      `SELECT * FROM employee_employment_history WHERE id = $1`,
      [historyId]
    );

    const record = rows[0];
    if (!record) {
      return res.status(404).json({ success: false });
    }

    await client.query(
      `DELETE FROM employee_employment_history WHERE id = $1`,
      [historyId]
    );

    await transactionLog({
      actorId,
      actorRole,
      action: "DELETE",
      entity: "EMPLOYEE_EMPLOYMENT_HISTORY",
      entityId: record.employee_id,
      status: "COMPLETED",
      description: `Removed employment history: ${record.company_name}`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Delete employment history error:", err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

export default router;
