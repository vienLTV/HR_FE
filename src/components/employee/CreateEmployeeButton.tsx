"use client";

import React, { useState, useEffect } from "react";
import CreateEmployeeModal from "./CreateEmployeeModal";

interface CreateEmployeeButtonProps {
  onEmployeeCreated?: () => void;
  className?: string;
}

export default function CreateEmployeeButton({
  onEmployeeCreated,
  className = "",
}: CreateEmployeeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Get user role from localStorage
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      setUserRole(role);
    }
  }, []);

  // Only show button if user is OWNER
  if (!userRole || !userRole.includes("OWNER")) {
    return null;
  }

  const handleSuccess = () => {
    // Refresh employee list if callback provided
    if (onEmployeeCreated) {
      onEmployeeCreated();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`
          inline-flex items-center gap-2 px-4 py-2 
          bg-blue-600 text-white font-medium rounded-md 
          hover:bg-blue-700 transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${className}
        `}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create Employee
      </button>

      <CreateEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
