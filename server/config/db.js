import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "pg";

const { Pool } = pkg;

// ✅ Recreate __dirname (since we’re in ESM mode)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Debug log
console.log("Loaded DB vars:", {  
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
});

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD || ""),
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL database!"))
  .catch((err) => console.error("Connection error", err));

export default pool;
