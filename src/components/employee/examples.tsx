/**
 * EXAMPLE: Complete implementation of employee creation feature
 * This file demonstrates all components working together
 */

"use client";

import { useState } from "react";
import CreateEmployeeButton from "@/components/employee/CreateEmployeeButton";

/**
 * Example 1: Basic Integration (Recommended)
 * Use this pattern in your employee management page
 */
export function EmployeeManagementExample() {
  const [employees, setEmployees] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchEmployees = async () => {
    // Your existing employee fetch logic
    const response = await fetch("/api/employees");
    const data = await response.json();
    setEmployees(data);
  };

  const handleEmployeeCreated = () => {
    // Refresh employee list after creation
    setRefreshKey((prev) => prev + 1);
    // OR call fetchEmployees() directly
    // fetchEmployees();
  };

  return (
    <div className="p-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-gray-600">Manage your team members</p>
        </div>

        {/* Button only shows for OWNER users */}
        <CreateEmployeeButton onEmployeeCreated={handleEmployeeCreated} />
      </div>

      {/* Employee List/Table */}
      <div key={refreshKey}>
        {/* Your employee table/list component */}
        <EmployeeTable employees={employees} />
      </div>
    </div>
  );
}

/**
 * Example 2: Standalone Button (Simple)
 * Use this when you just want the button without refresh logic
 */
export function SimpleExample() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Button auto-hides for non-OWNER users */}
      <CreateEmployeeButton />

      {/* Rest of your page */}
    </div>
  );
}

/**
 * Example 3: Custom Callback
 * Use this when you need custom logic after employee creation
 */
export function CustomCallbackExample() {
  const [totalEmployees, setTotalEmployees] = useState(0);

  const handleEmployeeCreated = () => {
    // Custom logic after creation
    console.log("New employee created!");

    // Update statistics
    setTotalEmployees((prev) => prev + 1);

    // Show notification
    alert("Employee account created successfully!");

    // Trigger analytics
    // trackEvent('employee_created');

    // Refresh data from multiple sources
    // fetchDashboardData();
    // fetchEmployeeStats();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees ({totalEmployees})</h1>

        <CreateEmployeeButton onEmployeeCreated={handleEmployeeCreated} />
      </div>
    </div>
  );
}

/**
 * Example 4: Custom Styling
 * Use this when you need to match specific design requirements
 */
export function CustomStyledExample() {
  return (
    <div className="p-6">
      <div className="flex gap-4">
        {/* Default styling */}
        <CreateEmployeeButton />

        {/* Custom styling */}
        <CreateEmployeeButton
          className="bg-purple-600 hover:bg-purple-700"
          onEmployeeCreated={() => console.log("Created!")}
        />

        {/* With wrapper for additional styling */}
        <div className="shadow-lg rounded-lg">
          <CreateEmployeeButton />
        </div>
      </div>
    </div>
  );
}

/**
 * Example 5: Advanced Modal Control
 * Use this if you need direct control over the modal
 */
import CreateEmployeeModal from "@/components/employee/CreateEmployeeModal";

export function AdvancedModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check user role on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("role"));
    }
  }, []);

  // Only render for OWNER
  if (!userRole?.includes("OWNER")) {
    return <div>Access Denied</div>;
  }

  const handleSuccess = () => {
    console.log("Employee created!");
    setIsModalOpen(false);

    // Custom success handling
    window.location.reload();
  };

  return (
    <div className="p-6">
      {/* Custom trigger button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Add New Team Member
      </button>

      {/* Programmatically open modal */}
      <button onClick={() => setIsModalOpen(true)}>Another Trigger</button>

      {/* Modal component */}
      <CreateEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

/**
 * Example 6: Multiple Action Buttons
 * Use this when you have multiple admin actions
 */
export function MultipleActionsExample() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Management</h1>

        <div className="flex gap-3">
          {/* Import button (future feature) */}
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">Import CSV</button>

          {/* Export button */}
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">Export</button>

          {/* Create button */}
          <CreateEmployeeButton onEmployeeCreated={refreshData} />
        </div>
      </div>

      <EmployeeTable key={refreshKey} />
    </div>
  );
}

/**
 * Example 7: With Error Boundary
 * Use this for production-grade error handling
 */
import { ErrorBoundary } from "react-error-boundary";

export function ErrorBoundaryExample() {
  return (
    <ErrorBoundary
      fallback={<div>Failed to load employee creation feature</div>}
      onError={(error) => console.error("Employee creation error:", error)}
    >
      <div className="p-6">
        <CreateEmployeeButton
          onEmployeeCreated={() => {
            // Safe operations
            try {
              localStorage.setItem("lastEmployeeCreated", Date.now());
            } catch (err) {
              console.error("Failed to update local storage:", err);
            }
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

/**
 * Example 8: API Integration Pattern
 * Shows how to integrate with your existing API layer
 */
export function ApiIntegrationExample() {
  const [employees, setEmployees] = useState([]);

  // Your existing API service
  const employeeService = {
    async getAll() {
      const response = await fetch("/api/employees");
      return response.json();
    },
    async refresh() {
      const data = await this.getAll();
      setEmployees(data);
    },
  };

  const handleEmployeeCreated = async () => {
    // Refresh using your existing service
    await employeeService.refresh();

    // Update cache/state
    // invalidateQueries('employees');

    // Show notification
    showNotification("Employee created successfully!");
  };

  return (
    <div>
      <CreateEmployeeButton onEmployeeCreated={handleEmployeeCreated} />
      <EmployeeList employees={employees} />
    </div>
  );
}

/**
 * Dummy components for examples
 */
function EmployeeTable({ employees }: { employees?: any[] }) {
  return <div>Employee Table Component</div>;
}

function EmployeeList({ employees }: { employees: any[] }) {
  return <div>Employee List Component</div>;
}

function showNotification(message: string) {
  alert(message);
}

// Export all examples
export default {
  EmployeeManagementExample,
  SimpleExample,
  CustomCallbackExample,
  CustomStyledExample,
  AdvancedModalExample,
  MultipleActionsExample,
  ErrorBoundaryExample,
  ApiIntegrationExample,
};
