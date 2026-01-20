import express from "express";
import cors from "cors";
import dotenv from "dotenv";


//import user api route 
import employeeRoutes from "./api/employee.js";
import userRoutes from "./api/user.js";
import transactionRoutes from "./api/transactions.js";
import departmentRoutes from "./api/departments.js";
import employmentHistoryRoutes from "./api/employeeEmploymentHistory.js"
import educationRoutes from "./api/employeeEducation.js"
import employeeGovernmentDeductions from "./api/employeeGovernmentDeductions.js"
import employeeLoans from "./api/employeeLoans.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); //enable cross origin sharing (for the front end to call this API)
app.use(express.json()); //parse json bodies

//define simple route test
app.get("/", (req,res) =>{
    res.send("Server is running..."); //test message
});


//mount api routes under /api user
app.use("/api", userRoutes);
app.use("/api", transactionRoutes);
app.use("/api/employees", employeeRoutes);    
app.use("/uploads", express.static("uploads"));
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employmentHistoryRoutes);
app.use("/api/employees", educationRoutes);
app.use ("/api/employees",employeeGovernmentDeductions);
app.use ("/api/employees",employeeLoans);

//start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});