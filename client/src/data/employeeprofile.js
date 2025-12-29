// mockEmployees.js

export const departments = [
  { id: 1, name: "Human Resources" },
  { id: 2, name: "Finance" },
  { id: 3, name: "IT Department" },
];

export const employeesByDepartment = {
  1: [
    {
      id: 11,
      name: "Maria Santos",
      employeeNo: "HR-001",
      address: "Tagum City",
      placeOfBirth: "Davao City",
      dateOfBirth: "1995-05-12",
      dateHired: "2022-03-01",
      department: "Human Resources",
      position: "HR Assistant",
      emailAddress: "maria.santos@example.com",
      civilStatus: "single",
      citizenship: "Filipino",
      contactNo: "09123456789",

      // Payroll
      employeeStatus: "Regular",
      designation: "HR Staff",
      basicRate: "18000",
      dailyRate: "600",
      hourlyRate: "75",
      leaveCredits: "5",
      sssNo: "34-2222222-1",
      hdmfNo: "2222-1111-3333",
      tinNo: "222-444-555",

      // EDUCATIONAL SUMMARY
      education: [
        {
          school: "University of Mindanao Tagum College",
          degree: "Bachelor of Science in Human Resource Management",
          batch: "Batch 2015 - 2019",
        },
        {
          school: "Tagum National High School",
          degree: "Secondary Education",
          batch: "Batch 2011 - 2015",
        },
        {
          school: "Tagum National High School-xr",
          degree: "Secondary Education",
          batch: "Batch 2011 - 2015",
        },
      ],

      // EMPLOYMENT HISTORY
      employment: [
        {
          position: "Editor",
          compname: "Da Marouders",
          date: "Batch 2015 - 2019",
        },
        {
          position: "Editor",
          compname: "Da Marouders",
          date: "Batch 2015 - 2019",
        },
        {
          position: "Editor",
          compname: "Da Marouders",
          date: "Batch 2015 - 2019",
        },
      ],

      deductions: [
        { id: 1, type: "Tax", amount: 150 },
        { id: 2, type: "SSS", amount: 100 },
        { id: 3, type: "PhilHealth", amount: 50 },
        { id: 4, type: "Loan", amount: 200 },
        { id: 5, type: "Pag-IBIG", amount: 75},
        { id: 6, type: "Other", amount: 25 },
      ],
    },
  ],

  2: [
    {
      id: 21,
      name: "Jenna Lopez",
      employeeNo: "FIN-002",
      address: "Davao City",
      placeOfBirth: "Tagum",
      dateOfBirth: "1994-11-04",
      dateHired: "2021-10-17",
      department: "Finance",
      position: "Accounting Staff",
      emailAddress: "jenna.lopez@example.com",
      civilStatus: "married",
      citizenship: "Filipino",
      contactNo: "09124567777",

      employeeStatus: "Probationary",
      designation: "Finance Assistant",
      basicRate: "20000",
      dailyRate: "670",
      hourlyRate: "84",
      leaveCredits: "2",
      sssNo: "55-3333333-2",
      hdmfNo: "3333-2222-1111",
      tinNo: "333-555-777",

      // EDUCATIONAL SUMMARY
      education: [
        {
          school: "Ateneo de Davao University",
          degree: "BS Accountancy",
          batch: "Batch 2012 - 2016",
        },
      ],
    },
  ],

  3: [
    {
      id: 31,
      name: "John Dela Cruz",
      employeeNo: "IT-014",
      address: "Tagum City",
      placeOfBirth: "Davao",
      dateOfBirth: "1997-08-20",
      dateHired: "2020-02-10",
      department: "IT Department",
      position: "Frontend Developer",
      emailAddress: "john.dc@example.com",
      civilStatus: "single",
      citizenship: "Filipino",
      contactNo: "09998887766",

      employeeStatus: "Regular",
      designation: "Developer",
      basicRate: "30000",
      dailyRate: "1000",
      hourlyRate: "125",
      leaveCredits: "7",
      sssNo: "11-4444444-3",
      hdmfNo: "4444-3333-2222",
      tinNo: "444-666-888",

      // EDUCATIONAL SUMMARY
      education: [
        {
          school: "University of Southeastern Philippines",
          degree: "BS Information Technology",
          batch: "Batch 2016 - 2020",
        },
        {
          school: "Apokon National High School",
          degree: "Secondary Education",
          batch: "Batch 2012 - 2016",
        },
      ],
    },
  ],
};

// Helper function to get employee by ID
export function getEmployeeById(id) {
  for (const dept in employeesByDepartment) {
    const found = employeesByDepartment[dept].find((emp) => emp.id == id);
    if (found) return found;
  }
  return null;
}
