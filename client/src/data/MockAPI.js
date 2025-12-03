import { departments } from "./department";
import { employees } from "./employee";
import { payrolls } from "./payroll";
import { transactions } from "./transactions";

export const api = {
  getDepartments: async () => departments,
  getEmployees: async () => employees,
  getEmployeeById: async (id) =>
    employees.find((emp) => emp.id === id),

  getPayrolls: async () => payrolls,
  getPayrollById: async (id) =>
    payrolls.find((p) => p.id === id),

  getTransactionsByPayCode: async (payCode) =>
    transactions.filter((t) => t.payCode === payCode),

  getTransactions: async () => transactions,
};
