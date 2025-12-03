import React from "react";

export default function ChartDetails() {
    return (
        <div className="grid grid-cols-2 md:flex md:items-start lg:justify-between md:gap-10 px-3 gap-6">
                  <div className="Pending-payroll border-l-4 border-l-primary pl-3 flex-col items-center">
                    <p className="text-gray-500 font-heading text-sm">
                      Regular Employees
                    </p>
                    <h2 className="text-xl text-primary font-heading font-medium">
                      3,040
                    </h2>
                  </div>

                  <div className="Pending-payroll border-l-4 border-l-primary pl-3 flex-col">
                    <p className="text-gray-500 font-heading text-sm">
                      Reliever
                    </p>
                    <h2 className="text-xl text-primary font-heading font-medium">
                      1,850
                    </h2>
                  </div>

                  <div
                    className="Pending-payroll border-l-4 border-l-primary pl-3 flex-col 
                  col-span-2 md:col-span-1 mx-auto md:mx-0"
                  >
                    <p className="text-gray-500 font-heading text-sm">
                      Probationary
                    </p>
                    <h2 className="text-xl text-primary font-heading font-medium">
                      4,890
                    </h2>
                  </div>

                  <div
                    className="Pending-payroll border-l-4 border-l-primary pl-3 flex-col 
                  col-span-2 md:col-span-1 mx-auto md:mx-0"
                  >
                    <p className="text-gray-500 font-heading text-sm">
                      Consultancy
                    </p>
                    <h2 className="text-xl text-primary font-heading font-medium">
                      4,890
                    </h2>
                  </div>
                </div>
    );
}