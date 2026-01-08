import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * ======================================================
 * GET /api/departments
 * PURPOSE:
 * - Populate Department dropdown
 * - Driven by existing employees
 * ======================================================
 */
router.get("/departments", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT department
      FROM employees
      WHERE department IS NOT NULL
      ORDER BY department ASC
    `);

    res.json({
      success: true,
      data: result.rows.map((r) => r.department),
    });
  } catch (error) {
    console.error("Fetch departments error:", error);
    res.status(500).json({ success: false });
  }
});

/**
 * ======================================================
 * GET /api/employees
 * PURPOSE:
 * - Populate Employee dropdown
 * - Filtered by department
 * ======================================================
 * QUERY PARAMS:
 * - department (required)
 */
router.get("/employees", async (req, res) => {
  try {
    const { department } = req.query;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        employee_no,
        full_name,
        position
      FROM employees
      WHERE department = $1
      ORDER BY full_name ASC
      `,
      [department]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Fetch employees error:", error);
    res.status(500).json({ success: false });
  }
});

/**
 * ======================================================
 * GET /api/employees/:id
 * PURPOSE:
 * - Auto-fill Employee Profile page
 * - Personal Info + Payroll Info
 * ======================================================
 */
router.get("/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        -- Personal Information
        e.id,
        e.employee_no,
        e.full_name,
        e.department,
        e.position,
        e.email,
        e.contact_no,
        e.address,
        e.place_of_birth,
        e.date_of_birth,
        e.civil_status,
        e.citizenship,
        e.spouse_name,
        e.spouse_address,
        e.image_url,

        -- Payroll Information
        ep.employment_status,
        ep.designation,
        ep.basic_rate,
        ep.daily_rate,
        ep.hourly_rate,
        ep.leave_credits,
        ep.sss_no,
        ep.pagibig_no,
        ep.philhealth_no,
        ep.tin_no

      FROM employees e
      LEFT JOIN employee_payroll ep
        ON ep.employee_id = e.id
      WHERE e.id = $1
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Fetch employee profile error:", error);
    res.status(500).json({ success: false });
  }
});

//payroll
router.get("/employees/:id/payroll", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        employment_status,
        designation,
        basic_rate,
        daily_rate,
        hourly_rate,
        leave_credits,
        sss_no,
        hdmf_no,
        tin_no
      FROM employee_payroll
      WHERE employee_id = $1
      `,
      [id]
    );

    return res.json({
      success: true,
      data: result.rows[0] || null,
    });
  } catch (error) {
    console.error("Fetch payroll info error:", error);
    res.status(500).json({ success: false });
  }
});

export default router;
