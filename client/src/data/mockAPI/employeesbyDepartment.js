// src/data/mockEmployees.js

export const employeesByDepartment = {
  HR: [
    {
      id: 11,
      employeeNo: "HR-001",
      name: "Maria Santos",
      department: "Human Resources",
      position: "HR Assistant",
      employeeStatus: "Regular",

      /* =====================
         PAY RATES (MASTER DATA)
         ===================== */
      basicRate: 18000,      // monthly
      dailyRate: 600,
      hourlyRate: 75,
      quincenaRate: 9000,

      /* =====================
         ALLOWANCES (EARNINGS)
         ===================== */
      allowances: [
        {
          codeType: "BENEF/AL",
          description: "Cost of Living Allowance",
          unit: "Monthly",
          amount: 1500,
          lastPay: "Y",
        },
        {
          codeType: "DEDUC",
          description: "Transportation Allowance",
          unit: "Monthly",
          amount: 800,
          lastPay: "N",
        },
      ],

      /* =====================
         DEDUCTIONS
         ===================== */
      deductions: [
        { code: "SSS", amount: 1000 },
        { code: "PhilHealth", amount: 400 },
        { code: "Pag-IBIG", amount: 200 },
      ],

      /* =====================
         PERSONAL INFO
         ===================== */
      address: "Tagum City",
      placeOfBirth: "Davao City",
      dateOfBirth: "1995-05-12",
      dateHired: "2022-03-01",
      civilStatus: "Single",
      citizenship: "Filipino",
      contactNo: "09123456789",
      emailAddress: "maria.santos@example.com",

      /* =====================
         GOVERNMENT IDS
         ===================== */
      sssNo: "34-2222222-1",
      hdmfNo: "2222-1111-3333",
      tinNo: "222-444-555",

      avatar: null,
    },
  ],

  Finance: [
    {
      id: 21,
      employeeNo: "FIN-002",
      name: "Jenna Lopez",
      department: "Finance",
      position: "Accounting Staff",
      employeeStatus: "Probationary",

      basicRate: 20000,
      dailyRate: 670,
      hourlyRate: 84,
      quincenaRate: 10000,

      allowances: [
        {
          codeType: "BENEF/AL",
          description: "Meal Allowance",
          unit: "Monthly",
          amount: 1200,
          lastPay: "Y",
        },
        
      ],

      deductions: [
        { code: "SSS", amount: 1100 },
        { code: "Tax", amount: 1500 },
      ],

      address: "Davao City",
      placeOfBirth: "Tagum City",
      dateOfBirth: "1994-11-04",
      dateHired: "2021-10-17",
      civilStatus: "Married",
      citizenship: "Filipino",
      contactNo: "09124567777",
      emailAddress: "jenna.lopez@example.com",

      sssNo: "55-3333333-2",
      hdmfNo: "3333-2222-1111",
      tinNo: "333-555-777",

      avatar: null,
    },
  ],

  IT: [
    {
      id: 31,
      employeeNo: "IT-014",
      name: "John Dela Cruz",
      department: "IT Department",
      position: "Frontend Developer",
      employeeStatus: "Regular",

      basicRate: 30000,
      dailyRate: 1000,
      hourlyRate: 125,
      quincenaRate: 15000,

      allowances: [
        {
          code: "INTERNET",
          description: "Internet Allowance",
          unit: "Monthly",
          amount: 2000,
          lastPay: "Y",
        },
        {
          code: "OT",
          description: "Overtime Pay",
          unit: "Hours",
          amount: 3500,
          lastPay: "Y",
        },
      ],

      deductions: [
        { code: "SSS", amount: 1500 },
        { code: "Tax", amount: 2500 },
      ],

      address: "Tagum City",
      placeOfBirth: "Davao City",
      dateOfBirth: "1997-08-20",
      dateHired: "2020-02-10",
      civilStatus: "Single",
      citizenship: "Filipino",
      contactNo: "09998887766",
      emailAddress: "john.dc@example.com",

      sssNo: "11-4444444-3",
      hdmfNo: "4444-3333-2222",
      tinNo: "444-666-888",

      avatar: "/avatars/john.png",
    },
  ],
};
