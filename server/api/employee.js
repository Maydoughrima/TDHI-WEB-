import express from "express";
import { pool } from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { transactionLog } from "../services/transactionLog.js";

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
   HELPERS
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
   GET /api/employees/departments
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
    console.error("Departments error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   GET /api/employees/all
   PURPOSE:
   - Payroll usage
   - Fetch all active employees
====================================================== */
router.get("/all", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        e.id,
        e.employee_no,
        e.full_name,
        e.department,
        ep.employment_status
      FROM employees e
      LEFT JOIN employee_payroll ep
        ON ep.employee_id = e.id
      ORDER BY e.full_name ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("Fetch all employees error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   GET /api/employees?department=HR
====================================================== */
router.get("/", async (req, res) => {
  try {
    const { department } = req.query;
    if (!department) return res.status(400).json({ success: false });

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
    console.error("Employees error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   GET /api/employees/:id
====================================================== */
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        e.*,
        ep.employment_status,
        ep.designation,
        ep.basic_rate,
        ep.daily_rate,
        ep.hourly_rate,
        ep.leave_credits,
        ep.sss_no,
        ep.hdmf_no,
        ep.tin_no
      FROM employees e
      LEFT JOIN employee_payroll ep
        ON ep.employee_id = e.id
      WHERE e.id = $1
      `,
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ success: false });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Fetch employee error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   PATCH /api/employees/:id/image
   UPDATE EMPLOYEE PROFILE IMAGE + AUDIT
====================================================== */
router.patch("/:id/image", upload.single("image"), async (req, res) => {
  const client = await pool.connect();

  try {
    const employeeId = req.params.id;
    const actorId = req.headers["x-user-id"] || null;
    const actorRole = "PAYROLL_CHECKER";

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    // get old image (for audit / cleanup later)
    const { rows } = await client.query(
      `SELECT image_url FROM employees WHERE id = $1`,
      [employeeId]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false });
    }

    const oldImage = rows[0].image_url;
    const newImage = `/uploads/employeeImages/${req.file.filename}`;

    await client.query(
      `
      UPDATE employees
      SET image_url = $1
      WHERE id = $2
      `,
      [newImage, employeeId]
    );

    await transactionLog({
      actorId,
      actorRole,
      action: "EDIT",
      entity: "EMPLOYEE_PROFILE",
      entityId: employeeId,
      status: "COMPLETED",
      description: `Profile image updated`,
    });

    res.json({ success: true, image_url: newImage });
  } catch (err) {
    console.error("Update image error:", err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

/* ======================================================
   POST /api/employees
   ADD EMPLOYEE + PAYROLL + AUDIT
====================================================== */
router.post("/", upload.single("image"), async (req, res) => {
  const client = await pool.connect();

  try {
    const actorId = req.headers["x-user-id"] || null;
    const actorRole = "PAYROLL_CHECKER";

    const {
      employeeNo,
      fullName,
      address,
      placeOfBirth,
      dateOfBirth,
      dateHired,
      department,
      position,
      emailAddress,
      contactNo,
      civilStatus,
      citizenship,
      nameOfSpouse,
      spouseAddress,

      employeeStatus,
      designation,
      basicRate,
      dailyRate,
      hourlyRate,
      leaveCredits,
      sssNo,
      hdmfNo,
      tinNo,
    } = req.body;

    await client.query("BEGIN");

    /* 🔴 CHECK IF EMPLOYEE NO EXISTS */
    const exists = await client.query(
      `SELECT 1 FROM employees WHERE employee_no = $1 LIMIT 1`,
      [employeeNo]
    );

    if (exists.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        code: "EMPLOYEE_NO_EXISTS",
        message: "Employee number already exists",
      });
    }

    /* ================= INSERT EMPLOYEE ================= */
    const empResult = await client.query(
      `
      INSERT INTO employees (
        employee_no,
        full_name,
        address,
        place_of_birth,
        date_of_birth,
        date_hired,
        department,
        position,
        email,
        contact_no,
        civil_status,
        citizenship,
        spouse_name,
        spouse_address,
        image_url
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
      )
      RETURNING id
      `,
      [
        employeeNo,
        fullName,
        address,
        placeOfBirth,
        dateOfBirth,
        dateHired,
        department,
        position,
        emailAddress,
        contactNo,
        civilStatus,
        citizenship,
        nameOfSpouse,
        spouseAddress,
        req.file ? `/uploads/employeeImages/${req.file.filename}` : null,
      ]
    );

    const employeeId = empResult.rows[0].id;

    /* ================= INSERT PAYROLL ================= */
    await client.query(
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
      `,
      [
        employeeId,
        employeeStatus,
        designation,
        numOrNull(basicRate),
        numOrNull(dailyRate),
        numOrNull(hourlyRate),
        intOrNull(leaveCredits),
        sssNo,
        hdmfNo,
        tinNo,
      ]
    );

    /* ================= AUDIT LOGS ================= */
    await transactionLog({
      actorId,
      actorRole,
      action: "ADD",
      entity: "EMPLOYEE_PROFILE",
      entityId: employeeId,
      status: "COMPLETED",
      description: `Added employee profile: ${fullName}`,
    });

    await transactionLog({
      actorId,
      actorRole,
      action: "ADD",
      entity: "EMPLOYEE_PAYROLL_INFO",
      entityId: employeeId,
      status: "COMPLETED",
      description: `Added employee payroll info`,
    });

    await client.query("COMMIT");

    res.json({
      success: true,
      data: {
        id: employeeId,
        department,
        full_name: fullName,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Add employee error:", err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

/* ======================================================
   PATCH /api/employees/:id
   EMPLOYEE PROFILE (PERSONAL INFO) + AUDIT
====================================================== */
router.patch("/:id", async (req, res) => {
  const client = await pool.connect();

  try {
    const employeeId = req.params.id;
    const actorId = req.headers["x-user-id"] || null;
    const actorRole = "PAYROLL_CHECKER";

    const { rows } = await client.query(
      `SELECT * FROM employees WHERE id = $1`,
      [employeeId]
    );

    const old = rows[0];
    if (!old) return res.status(404).json({ success: false });

    const fields = {
      full_name: req.body.full_name,
      address: req.body.address,
      place_of_birth: req.body.place_of_birth,
      date_of_birth: req.body.date_of_birth,
      date_hired: req.body.date_hired,
      civil_status: req.body.civil_status,
      citizenship: req.body.citizenship,
      spouse_name: req.body.spouse_name,
      spouse_address: req.body.spouse_address,
      contact_no: req.body.contact_no,
      email: req.body.email,
      position: req.body.position,
      department: req.body.department,
    };

    await client.query(
      `
      UPDATE employees SET
      full_name = COALESCE($1, full_name),
      address = COALESCE($2, address),
      place_of_birth = COALESCE($3, place_of_birth),
      date_of_birth = COALESCE($4, date_of_birth),
      date_hired = COALESCE($5, date_hired),
      civil_status = COALESCE($6, civil_status),
      citizenship = COALESCE($7, citizenship),
      spouse_name = COALESCE($8, spouse_name),
      spouse_address = COALESCE($9, spouse_address),
      contact_no = COALESCE($10, contact_no),
      email = COALESCE($11, email),
      position = COALESCE($12, position),
      department = COALESCE($13, department)  -- ✅
      WHERE id = $14
      `,
      [
        fields.full_name,
        fields.address,
        fields.place_of_birth,
        fields.date_of_birth,
        fields.date_hired,
        fields.civil_status,
        fields.citizenship,
        fields.spouse_name,
        fields.spouse_address,
        fields.contact_no,
        fields.email,
        fields.position,
        fields.department,
        employeeId,
      ]
    );

    for (const key in fields) {
      if (fields[key] !== undefined && fields[key] !== old[key]) {
        await transactionLog({
          actorId,
          actorRole,
          action: "EDIT",
          entity: "EMPLOYEE_PROFILE", // ✅ MATCHES ENUM
          entityId: employeeId,
          status: "COMPLETED",
          description: `${key} changed from "${old[key] ?? "NULL"}" to "${
            fields[key]
          }"`,
        });
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Save employee profile error:", err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

/* ======================================================
   GET /api/employees/:id/payroll
====================================================== */
router.get("/:id/payroll", async (req, res) => {
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

/* ======================================================
   POST /api/employees/:id/payroll
   EMPLOYEE PAYROLL INFO + AUDIT
====================================================== */
router.post("/:id/payroll", async (req, res) => {
  const client = await pool.connect();

  try {
    const employeeId = req.params.id;
    const actorId = req.headers["x-user-id"] || null;
    const actorRole = "PAYROLL_CHECKER";

    const { rows } = await client.query(
      `SELECT * FROM employee_payroll WHERE employee_id = $1`,
      [employeeId]
    );

    const old = rows[0] || {};

    const p = {
      employment_status: req.body.employeeStatus ?? null,
      designation: req.body.designation ?? null,
      basic_rate: numOrNull(req.body.basicRate),
      daily_rate: numOrNull(req.body.dailyRate),
      hourly_rate: numOrNull(req.body.hourlyRate),
      leave_credits: intOrNull(req.body.leaveCredits),
      sss_no: req.body.sssNo ?? null,
      hdmf_no: req.body.hdmfNo ?? null,
      tin_no: req.body.tinNo ?? null,
    };

    await client.query(
      `
      INSERT INTO employee_payroll (
        employee_id, employment_status, designation,
        basic_rate, daily_rate, hourly_rate,
        leave_credits, sss_no, hdmf_no, tin_no
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      ON CONFLICT (employee_id) DO UPDATE SET
        employment_status = EXCLUDED.employment_status,
        designation = EXCLUDED.designation,
        basic_rate = EXCLUDED.basic_rate,
        daily_rate = EXCLUDED.daily_rate,
        hourly_rate = EXCLUDED.hourly_rate,
        leave_credits = EXCLUDED.leave_credits,
        sss_no = EXCLUDED.sss_no,
        hdmf_no = EXCLUDED.hdmf_no,
        tin_no = EXCLUDED.tin_no
      `,
      [
        employeeId,
        p.employment_status,
        p.designation,
        p.basic_rate,
        p.daily_rate,
        p.hourly_rate,
        p.leave_credits,
        p.sss_no,
        p.hdmf_no,
        p.tin_no,
      ]
    );

    for (const k in p) {
      if (old[k] !== p[k]) {
        await transactionLog({
          actorId,
          actorRole,
          action: "EDIT",
          entity: "EMPLOYEE_PAYROLL_INFO", // ✅ MATCHES ENUM
          entityId: employeeId,
          status: "COMPLETED",
          description: `${k} changed from "${old[k] ?? "NULL"}" to "${
            p[k] ?? "NULL"
          }"`,
        });
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Save employee payroll error:", err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

export default router;
