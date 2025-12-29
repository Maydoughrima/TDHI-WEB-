import { getEmployeeById } from "../employeeprofile";

export function getEmployeeDeductions(employeeId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const emp = getEmployeeById(employeeId);

            if (!emp){
                resolve ([]);
                return;
            }
            resolve(emp.deductions || []);
        }, 500); // Simulate network delay 
    })
}