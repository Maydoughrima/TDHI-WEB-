import express from "express";
import { pool } from "../config/db.js";
import { transactionLog } from "../services/transactionLog.js";

const router = express.Router();

/* ======================================================
   POST /api/leave-requests
====================================================== */
router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    const actorId = req.headers["x-user-id"];
    if (!actorId) {
      return res.status(401).json({ success: false, message: "Unauthenticated" });
    }

    const { employee_id, leave_type, start_date, end_date, reason } = req.body;
    if (!employee_id || !leave_type || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    await client.query("BEGIN");

    const { rows: roleRows } = await client.query(
      `SELECT role FROM users WHERE id = $1`,
      [actorId]
    );

    if (!roleRows.length || roleRows[0].role !== "USER") {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        message: "Only payroll users can submit leave requests",
      });
    }

    const { rows: empRows } = await client.query(
      `SELECT department FROM employees WHERE id = $1`,
      [employee_id]
    );

    if (!empRows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const { rows } = await client.query(
      `
      INSERT INTO leave_requests (
        employee_id, requested_by, department,
        leave_type, start_date, end_date,
        reason, status, created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,'PENDING',NOW())
      RETURNING *
      `,
      [
        employee_id,
        actorId,
        empRows[0].department,
        leave_type,
        start_date,
        end_date,
        reason ?? null,
      ]
    );

    await transactionLog({
      actorId,
      actorRole: "USER",
      action: "ADD",
      entity: "LEAVE_REQUEST",
      entityId: employee_id,
      status: "PENDING",
      description: `Submitted ${leave_type} leave`,
    });

    await client.query("COMMIT");
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

/* ======================================================
   PATCH /api/leave-requests/:id/decision
   ✅ SINGLE SOURCE OF TRUTH
====================================================== */
router.patch("/:id/decision", async (req, res) => {
  const client = await pool.connect();

  try {
    const actorId = req.headers["x-user-id"];
    const { decision } = req.body;

    if (!actorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated",
      });
    }

    if (!["APPROVED", "REJECTED"].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Invalid decision",
      });
    }

    await client.query("BEGIN");

    /* ===============================
       1️⃣ VERIFY PAYROLL CHECKER
    =============================== */
    const { rows: roleRows } = await client.query(
      `SELECT role FROM users WHERE id = $1`,
      [actorId]
    );

    if (!roleRows.length || roleRows[0].role !== "PAYROLL_CHECKER") {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    /* ===============================
       2️⃣ LOCK LEAVE REQUEST
    =============================== */
    const { rows: leaveRows } = await client.query(
      `
      SELECT *
      FROM leave_requests
      WHERE id = $1
      FOR UPDATE
      `,
      [req.params.id]
    );

    if (!leaveRows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    const leave = leaveRows[0];

    if (leave.status !== "PENDING") {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "Leave request already processed",
      });
    }

    /* ===============================
       3️⃣ CALCULATE LEAVE DAYS
    =============================== */
    const start = new Date(leave.start_date);
    const end = new Date(leave.end_date);

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const leaveDays =
      Math.floor((end - start) / MS_PER_DAY) + 1;

    if (leaveDays <= 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Invalid leave duration",
      });
    }

    /* ===============================
       4️⃣ DEDUCT LEAVE CREDITS (IF APPROVED)
    =============================== */
    if (decision === "APPROVED") {
      const { rows: payrollRows } = await client.query(
        `
        SELECT leave_credits
        FROM employee_payroll
        WHERE employee_id = $1
        FOR UPDATE
        `,
        [leave.employee_id]
      );

      if (!payrollRows.length) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          message: "Employee payroll record not found",
        });
      }

      const currentCredits = Number(payrollRows[0].leave_credits);

      if (currentCredits < leaveDays) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: `Insufficient leave credits. Required: ${leaveDays}, Available: ${currentCredits}`,
        });
      }

      await client.query(
        `
        UPDATE employee_payroll
        SET
          leave_credits = leave_credits - $1,
          updated_at = NOW()
        WHERE employee_id = $2
        `,
        [leaveDays, leave.employee_id]
      );
    }

    /* ===============================
       5️⃣ UPDATE LEAVE REQUEST STATUS
    =============================== */
    await client.query(
      `
      UPDATE leave_requests
      SET
        status = $1,
        approved_by = $2,
        approved_at = NOW(),
        updated_at = NOW()
      WHERE id = $3
      `,
      [decision, actorId, leave.id]
    );

    /* ===============================
       6️⃣ AUDIT TRAIL
    =============================== */
    await transactionLog({
      actorId,
      actorRole: "PAYROLL_CHECKER",
      action: "APPROVE",
      entity: "LEAVE_REQUEST",
      entityId: leave.employee_id,
      status: decision,
      description:
        decision === "APPROVED"
          ? `Approved ${leave.leave_type} leave (${leaveDays} day(s) deducted)`
          : `Rejected ${leave.leave_type} leave`,
    });

    await client.query("COMMIT");

    return res.json({
      success: true,
      message:
        decision === "APPROVED"
          ? `Leave approved. ${leaveDays} credit(s) deducted`
          : "Leave rejected",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("LEAVE DECISION ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to process leave request",
    });
  } finally {
    client.release();
  }
});


/* ======================================================
   GET /api/leave-requests/pending
====================================================== */
router.get("/pending", async (_, res) => {
  const { rows } = await pool.query(`
    SELECT lr.id, e.full_name AS employee_name,
           lr.department, lr.leave_type,
           lr.start_date, lr.end_date,
           lr.created_at AS requested_at
    FROM leave_requests lr
    JOIN employees e ON e.id = lr.employee_id
    WHERE lr.status = 'PENDING'
    ORDER BY lr.created_at DESC
  `);

  res.json({ success: true, data: rows });
});

export default router;
