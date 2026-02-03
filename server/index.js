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
import payrollFilesRoutes from "./api/payrollFiles.js"
import payrollSnapshots from "./api/payrollSnapshots.js"
import payrollTransactionsRouter from "./api/payrollTransactions.js"
import payrollPayslips from "./api/payrollPayslips.js"
import payrollemployeePayslips from "./api/payrollEmployeePayslip.js"
import payrollFileEmployeesRoutes from "./api/payrollFileEmployees.js";
import ledgerRoutes from "./api/ledger.js"
import ledgerEarnings from "./api/ledgerEarnings.js";
import reportsRoute from "./api/reports.js"
import dashboardRoute from "./api/dashboard.js"
import leaveRequestRouter from './api/leaveRequest.js'

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
app.use("/api/payroll-files", payrollFilesRoutes);
app.use("/api", payrollSnapshots);
app.use("/api/payroll-transactions", payrollTransactionsRouter)
app.use("/api/payroll-files", payrollPayslips);
app.use("/api/payroll-files", payrollemployeePayslips);
app.use("/api/payroll-files", payrollFileEmployeesRoutes);
app.use("/api", ledgerEarnings);
app.use("/api", ledgerRoutes);
app.use("/api", reportsRoute);
app.use("/api", dashboardRoute);
app.use("/api/leave-requests", leaveRequestRouter);


//start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});