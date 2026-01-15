import express from "express";
import { pool } from "../config/db.js";
import { transactionLog } from "../services/transactionLog.js";

const router = express.Router();

/* ======================================================
   GET /api/employees/:id/education
====================================================== */
router.get("/:id/education", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        id,
        school_name,
        degree,
        year_start,
        year_end
      FROM employee_education
      WHERE employee_id = $1
      ORDER BY year_start DESC
      `,
      [req.params.id]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Fetch education error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   POST /api/employees/:id/education
====================================================== */
router.post("/:id/education", async (req, res) => {
  const client = await pool.connect();

  try {
    const employeeId = req.params.id;
    const actorId = req.headers["x-user-id"] || null;
    const actorRole = "PAYROLL_CHECKER";

    const { school_name, degree, year_start, year_end } = req.body;

    const { rows } = await client.query(
      `
      INSERT INTO employee_education (
        employee_id,
        school_name,
        degree,
        year_start,
        year_end
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        employeeId,
        school_name,
        degree,
        year_start,
        year_end || null,
      ]
    );

    await transactionLog({
      actorId,
      actorRole,
      action: "ADD",
      entity: "EMPLOYEE_EDUCATION",
      entityId: employeeId,
      status: "COMPLETED",
      description: `Added education: ${school_name} (${degree})`,
    });

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Add education error:", err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

/* ======================================================
   PATCH /api/employees/education/:educationId
   UPDATE + AUDIT TRAIL
====================================================== */
router.patch("/education/:educationId", async (req, res) => {
  const client = await pool.connect();

  try {
    const educationId = req.params.educationId;
    const actorId = req.headers["x-user-id"] || null;
    const actorRole = "PAYROLL_CHECKER";

    // Fetch old record
    const { rows } = await client.query(
      `SELECT * FROM employee_education WHERE id = $1`,
      [educationId]
    );

    const old = rows[0];
    if (!old) {
      return res.status(404).json({ success: false });
    }

    const { school_name, degree, year_start, year_end } = req.body;

    await client.query(
      `
      UPDATE employee_education SET
        school_name = COALESCE($1, school_name),
        degree = COALESCE($2, degree),
        year_start = COALESCE($3, year_start),
        year_end = COALESCE($4, year_end)
      WHERE id = $5
      `,
      [
        school_name,
        degree,
        year_start,
        year_end,
        educationId,
      ]
    );

    // Field-level audit logs
    const fields = { school_name, degree, year_start, year_end };

    for (const key in fields) {
      if (
        fields[key] !== undefined &&
        String(fields[key]) !== String(old[key])
      ) {
        await transactionLog({
          actorId,
          actorRole,
          action: "EDIT", // ✅ REQUIRED
          entity: "EMPLOYEE_EDUCATION",
          entityId: old.employee_id,
          status: "COMPLETED",
          description: `Updated education ${key}: "${old[key] ?? "NULL"}" → "${fields[key]}"`,
        });
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Update education error:", err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

/* ======================================================
   DELETE /api/employees/education/:educationId
====================================================== */
router.delete("/education/:educationId", async (req, res) => {
  const client = await pool.connect();

  try {
    const educationId = req.params.educationId;
    const actorId = req.headers["x-user-id"] || null;
    const actorRole = "PAYROLL_CHECKER";

    const { rows } = await client.query(
      `SELECT * FROM employee_education WHERE id = $1`,
      [educationId]
    );

    const record = rows[0];
    if (!record) {
      return res.status(404).json({ success: false });
    }

    await client.query(
      `DELETE FROM employee_education WHERE id = $1`,
      [educationId]
    );

    await transactionLog({
      actorId,
      actorRole,
      action: "DELETE",
      entity: "EMPLOYEE_EDUCATION",
      entityId: record.employee_id,
      status: "COMPLETED",
      description: `Removed education: ${record.school_name}`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Delete education error:", err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

export default router;
