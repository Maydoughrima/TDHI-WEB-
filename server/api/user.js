    import express from "express";
    import { pool } from "../config/db.js";
    import bcrypt from "bcrypt";

    const router = express.Router();

    router.post("/user/login", async (req, res) => {
        const{username, password} =  req.body;

        try{
            const userQuery = await pool.query(
                "SELECT * FROM users WHERE username = $1",
            [username]
            );

            if (!userQuery.rows.length) {
                return res.status(401).json({ success: false, message: "Invalid username or password" });
            }

            const user = userQuery.rows[0];
            console.log("User found:", user);
            const isValid = await bcrypt.compare(password, user.password_hash);

            if(!isValid){
                return res.status(401).json({ success: false, message: "Invalid username or password" });
            }

            return res.json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    fullname: user.fullname
                }
            });
            
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });

    export default router;