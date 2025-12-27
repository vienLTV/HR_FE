"use client";

import { DataTable } from "@/app/components/DataTable";

export default function EmployeePage() {
  return (
    <div className="w-full p-4">
      {/* TITLE */}
      <div className="mb-4">
        <h1 className="text-primary-heading">Employee</h1>
        <p className="text-gray-500 text-md">List of all employees</p>
      </div>

      {/* TABLE */}
      <div className="w-full mt-2">
        <DataTable />
      </div>
    </div>
  );
}
