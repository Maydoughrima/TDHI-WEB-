// src/data/employees.js
import { employeesByDepartment } from "./employeesbyDepartment.js";

export const allEmployees = Object.values(employeesByDepartment).flat();