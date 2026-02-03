import express from "express";
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";

// AUDIT LOG
import { transactionLog } from "../services/transactionLog.js";

const router = express.Router();

/* ===============================
   UPLOAD SETUP
=============================== */
const uploadDir = "uploads/profile-images";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${req.headers["x-user-id"]}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

/* ===============================
   USER LOGIN
=============================== */
router.post("/user/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const { rows } = await pool.query(
      `
      SELECT id, username, fullname, role, password_hash
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    await transactionLog({
      actorId: user.id,
      actorRole: user.role,
      action: "LOGIN",
      entity: "USER",
      entityId: user.id,
      status: "COMPLETED",
      description: `User ${user.username} logged in`,
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ===============================
   GET CURRENT USER PROFILE
   GET /api/me
=============================== */
router.get("/me", async (req, res) => {
  try {
    const actorId = req.headers["x-user-id"];

    if (!actorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated",
      });
    }

    const { rows } = await pool.query(
      `
      SELECT id, username, fullname, role, profile_image
      FROM users
      WHERE id = $1
      `,
      [actorId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("FETCH PROFILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
});

/* ===============================
   UPDATE PROFILE IMAGE
   PUT /api/me/profile-image
=============================== */
router.put(
  "/me/profile-image",
  upload.single("profile_image"),
  async (req, res) => {
    try {
      const actorId = req.headers["x-user-id"];

      if (!actorId) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required",
        });
      }

      const imageUrl = `http://localhost:5000/uploads/profile-images/${req.file.filename}`;

      const { rowCount } = await pool.query(
        `
        UPDATE users
        SET profile_image = $1
        WHERE id = $2
        `,
        [imageUrl, actorId]
      );

      if (!rowCount) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        profile_image: imageUrl,
      });
    } catch (err) {
      console.error("PROFILE IMAGE UPLOAD ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Failed to upload profile image",
      });
    }
  }
);

export default router;
