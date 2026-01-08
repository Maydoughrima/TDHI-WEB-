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

// ensure folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `emp_${req.params.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

/* ======================================================
   GET /api/departments
====================================================== */
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

/* ======================================================
   GET /api/employees
====================================================== */
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
      SELECT id, employee_no, full_name, position
      FROM employees
      WHERE department = $1
      ORDER BY full_name ASC
      `,
      [department]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Fetch employees error:", error);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   GET /api/employees/:id
====================================================== */
router.get("/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
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
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Fetch employee profile error:", error);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   PATCH /api/employees/:id/image
   PURPOSE: Save IMAGE ONLY
====================================================== */
router.patch(
  "/employees/:id/image",
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image uploaded",
        });
      }

      const imageUrl = `/uploads/employeeImages/${req.file.filename}`;

      await pool.query(
        `
        UPDATE employees
        SET image_url = $1
        WHERE id = $2
        `,
        [imageUrl, id]
      );

      res.json({
        success: true,
        image_url: imageUrl,
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ success: false });
    }
  }
);

export default router;
