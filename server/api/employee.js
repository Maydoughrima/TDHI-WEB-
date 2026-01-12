import express from "express";
import { pool } from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/* ======================================================
   IMAGE UPLOAD CONFIG
====================================================== */

const uploadDir = "uploads/employeeImages";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `emp_${req.params.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

/* ======================================================
   HELPERS (ANTI-NaN & SAFE CASTING)
====================================================== */

const numOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const intOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

/* ======================================================
   GET /api/departments
====================================================== */
router.get("/departments", async (_, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT department
      FROM employees
      WHERE department IS NOT NULL
      ORDER BY department ASC
    `);

    res.json({ success: true, data: rows.map((r) => r.department) });
  } catch (err) {
    console.error("Fetch departments error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   GET /api/employees?department=
====================================================== */
router.get("/employees", async (req, res) => {
  try {
    const { department } = req.query;
    if (!department) {
      return res.status(400).json({ success: false });
    }

    const { rows } = await pool.query(
      `
      SELECT id, employee_no, full_name, position
      FROM employees
      WHERE department = $1
      ORDER BY full_name ASC
      `,
      [department]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Fetch employees error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   GET /api/employees/:id
====================================================== */
router.get("/employees/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
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
        e.date_hired,
        e.civil_status,
        e.citizenship,
        e.spouse_name,
        e.spouse_address,
        e.image_url,

        ep.employment_status,
        ep.designation,
        ep.basic_rate,
        ep.daily_rate,
        ep.hourly_rate,
        ep.leave_credits,
        ep.sss_no,
        ep.hdmf_no,
        ep.philhealth_no,
        ep.tin_no
      FROM employees e
      LEFT JOIN employee_payroll ep
        ON ep.employee_id = e.id
      WHERE e.id = $1
      `,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Fetch employee profile error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   PATCH /api/employees/:id
====================================================== */
router.patch("/employees/:id", async (req, res) => {
  try {
    const {
      full_name,
      address,
      place_of_birth,
      date_of_birth,
      date_hired,
      civil_status,
      citizenship,
      spouse_name,
      spouse_address,
      contact_no,
      email,
      position,
    } = req.body || {};

    await pool.query(
      `
      UPDATE employees
      SET
        full_name      = COALESCE($1, full_name),
        address        = COALESCE($2, address),
        place_of_birth = COALESCE($3, place_of_birth),
        date_of_birth  = COALESCE($4, date_of_birth),
        date_hired     = COALESCE($5, date_hired),
        civil_status   = COALESCE($6, civil_status),
        citizenship    = COALESCE($7, citizenship),
        spouse_name    = COALESCE($8, spouse_name),
        spouse_address = COALESCE($9, spouse_address),
        contact_no     = COALESCE($10, contact_no),
        email          = COALESCE($11, email),
        position       = COALESCE($12, position)
      WHERE id = $13
      `,
      [
        full_name,
        address,
        place_of_birth,
        date_of_birth,
        date_hired,
        civil_status,
        citizenship,
        spouse_name,
        spouse_address,
        contact_no,
        email,
        position,
        req.params.id,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Save personal info error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   PATCH /api/employees/:id/image
====================================================== */
router.patch(
  "/employees/:id/image",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false });
      }

      const imageUrl = `/uploads/employeeImages/${req.file.filename}`;

      await pool.query(
        `UPDATE employees SET image_url = $1 WHERE id = $2`,
        [imageUrl, req.params.id]
      );

      res.json({ success: true, image_url: imageUrl });
    } catch (err) {
      console.error("Image upload error:", err);
      res.status(500).json({ success: false });
    }
  }
);

/* ======================================================
   POST /api/employees/:id/payroll  ✅ FIXED
====================================================== */
router.post("/employees/:id/payroll", async (req, res) => {
  try {
    const body = req.body || {}; // 🔥 CRITICAL FIX

    const employment_status =
      body.employment_status ?? body.employeeStatus ?? null;

    const designation = body.designation ?? null;

    const basic_rate = numOrNull(body.basic_rate ?? body.basicRate);
    const daily_rate = numOrNull(body.daily_rate ?? body.dailyRate);
    const hourly_rate = numOrNull(body.hourly_rate ?? body.hourlyRate);

    const leave_credits = intOrNull(
      body.leave_credits ?? body.leaveCredits
    );

    const sss_no = body.sss_no ?? body.sssNo ?? null;
    const hdmf_no =
      body.hdmf_no ?? body.hdmfNo ?? body.pagibig_no ?? null;
    const tin_no = body.tin_no ?? body.tinNo ?? null;

    await pool.query(
      `
      INSERT INTO employee_payroll (
        employee_id,
        employment_status,
        designation,
        basic_rate,
        daily_rate,
        hourly_rate,
        leave_credits,
        sss_no,
        hdmf_no,
        tin_no
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      ON CONFLICT (employee_id)
      DO UPDATE SET
        employment_status = EXCLUDED.employment_status,
        designation       = EXCLUDED.designation,
        basic_rate        = EXCLUDED.basic_rate,
        daily_rate        = EXCLUDED.daily_rate,
        hourly_rate       = EXCLUDED.hourly_rate,
        leave_credits     = EXCLUDED.leave_credits,
        sss_no            = EXCLUDED.sss_no,
        hdmf_no           = EXCLUDED.hdmf_no,
        tin_no            = EXCLUDED.tin_no
      `,
      [
        req.params.id,
        employment_status,
        designation,
        basic_rate,
        daily_rate,
        hourly_rate,
        leave_credits,
        sss_no,
        hdmf_no,
        tin_no,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Save payroll error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   GET /api/employees/:id/payroll
====================================================== */
router.get("/employees/:id/payroll", async (req, res) => {
  try {
    const { rows } = await pool.query(
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
        philhealth_no,
        tin_no
      FROM employee_payroll
      WHERE employee_id = $1
      `,
      [req.params.id]
    );

    res.json({ success: true, data: rows[0] || null });
  } catch (err) {
    console.error("Fetch payroll error:", err);
    res.status(500).json({ success: false });
  }
});

export default router;
