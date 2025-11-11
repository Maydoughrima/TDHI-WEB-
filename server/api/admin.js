import express from "express";
import { loginAdmin } from "./loginAdmin.js";

const router = express.Router();

//post /api/admin/login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const result  = await loginAdmin(username, password);

    if (result.success){
        res.json(result); //returns {success: true, admin: {...}}
    } else{
        res.status(401).json(result); //returns {success: false, message: "..."}
    }
});

export default router;