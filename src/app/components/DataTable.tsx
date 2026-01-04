"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, View, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/navigation";
import { CreateEmployeeModal } from "./CreateEmployeeModal";
import CreateAccountModal from "@/components/CreateAccountModal";
import { Spinner } from "./Spinner";
import { toast } from "@/hooks/use-toast";

export type Employee = {
  employeeId: string;
  employeeStatus: string;
  companyEmail: string;
  jobTitle: JobTitle;
  team: Team;
  firstName: string;
  lastName: string;
  companyPhoneNumber: string;
  personalPhoneNumber: string;
  personalEmail: string;
  department: Department;
  currentAddress: string;
  gender: string;
  dateOfBirth: string;
  birthPlace: string;
  maritalStatus: string;
  userId?: string;
};

export type JobTitle = {
  jobTitleId: string;
  title: string;
  description: string;
};

export type Team = {
  teamId: string;
  name: string;
  description: string;
  phoneNumber: string;
  email: string;
  location: string;
  departmentId: string;
};

export type Department = {
  departmentId: string;
  name: string;
  description: string;
  location: string;
  establishedDate: string;
  phoneNumber: string;
  email: string;
};

export function DataTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [selectedEmployeeForAccount, setSelectedEmployeeForAccount] = useState<{
    id: string;
    email: string;
    name: string;
  } | null>(null);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);

  const fetchEmployeesData = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      setError(null);
      const response = await api.get("/employees/");
      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      setEmployees(data.data.items);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  const fetchOrganizationData = async () => {
    try {
      const response = await api.get("/sign-up/current");
      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      const organization = data.data;
      console.log("Organization data:", organization);
      const ownerEmailValue = organization.owner || null;
      console.log("Owner email:", ownerEmailValue);
      setOwnerEmail(ownerEmailValue);
    } catch (error) {
      console.error("Error fetching organization:", error);
    }
  };

  useEffect(() => {
    setMounted(true); // This ensures the component is mounted on the client
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const storedRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    const storedEmployeeId =
      typeof window !== "undefined" ? localStorage.getItem("employeeId") : null;
    console.log("Current employeeId from localStorage:", storedEmployeeId);
    setRole(storedRole);
    setCurrentEmployeeId(storedEmployeeId);
    fetchEmployeesData();
    fetchOrganizationData();
  }, [mounted]);

  const handleViewDetail = (employeeId: string) => {
    setOpenMenuId(null);
    if (!error && mounted) {
      router.push(`/personal/${employeeId}`);
    }
  };

  const handleViewHistory = (employeeId: string) => {
    setOpenMenuId(null);
    if (!error && mounted) {
      router.push(`/employee/${employeeId}/history`);
    }
  };

  const handleCreateAccount = (employee: Employee) => {
    setSelectedEmployeeForAccount({
      id: employee.employeeId,
      email: employee.companyEmail,
      name: `${employee.firstName} ${employee.lastName}`,
    });
    setAccountModalOpen(true);
    setOpenMenuId(null);
  };

  const handleAccountCreated = () => {
    fetchEmployeesData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const response = await api.delete(`/employees/${deleteTarget.id}`);
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      if (response.status === 403) {
        throw new Error("You don't have permission");
      }
      if (response.status === 404) {
        throw new Error("Employee not found");
      }
      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      toast({
        title: "Employee deleted successfully",
        description: `${deleteTarget.name} has been removed.`,
      });
      setDeleteTarget(null);
      setOpenMenuId(null);
      // Optimistically update list
      setEmployees((prev) => prev.filter((emp) => emp.employeeId !== deleteTarget.id));
      // Refresh data silently to avoid UI lock/spinner
      fetchEmployeesData(true);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to delete employee",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <Spinner />;
  }
  if (error) return <div>Error: {error}</div>;
  if (!employees) return <div>No data available</div>;

  return (
    <div className="w-full">
      <div className="mt-3">
        <CreateEmployeeModal employeeCreated={handleAccountCreated} />
      </div>
      <div className="py-4">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                First name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Last name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => {
              console.log(
                `Employee: ${employee.firstName} ${employee.lastName}, userId: ${employee.userId}`
              );
              return (
                <tr
                  key={employee.employeeId}
                  className="hover:bg-gray-200 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{employee.firstName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.companyEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.jobTitle?.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.team?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.department?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`p-2 inline-flex text-xs leading-5 ${
                        employee.employeeStatus === "OFFICIAL"
                          ? "label-primary"
                          : employee.employeeStatus === "PROBATION"
                          ? "label-warning"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {employee.employeeStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <DropdownMenu
                      key={employee.employeeId}
                      modal={false}
                      open={openMenuId === employee.employeeId}
                      onOpenChange={(open) => setOpenMenuId(open ? employee.employeeId : null)}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetail(employee.employeeId)}>
                          <View className="mr-2 h-4 w-4" />
                          View Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewHistory(employee.employeeId)}>
                          <View className="mr-2 h-4 w-4" />
                          View History
                        </DropdownMenuItem>
                        {role === "OWNER" &&
                          !employee.userId &&
                          employee.employeeId !== currentEmployeeId && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  console.log("Employee ID:", employee.employeeId);
                                  console.log("Current employee ID:", currentEmployeeId);
                                  handleCreateAccount(employee);
                                }}
                              >
                                <span className="mr-2">👤</span>
                                Create Account
                              </DropdownMenuItem>
                            </>
                          )}
                        {(role === "ADMIN" || role === "OWNER") &&
                          !(
                            ownerEmail &&
                            (ownerEmail.toLowerCase() === employee.companyEmail?.toLowerCase() ||
                              ownerEmail.toLowerCase() === employee.personalEmail?.toLowerCase())
                          ) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  setDeleteTarget({
                                    id: employee.employeeId,
                                    name: `${employee.firstName} ${employee.lastName}`,
                                  })
                                }
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>Are you sure you want to delete this employee?</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-gray-600">{deleteTarget ? deleteTarget.name : ""}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedEmployeeForAccount && (
        <CreateAccountModal
          isOpen={accountModalOpen}
          onClose={() => {
            setAccountModalOpen(false);
            setSelectedEmployeeForAccount(null);
          }}
          employeeId={selectedEmployeeForAccount.id}
          employeeEmail={selectedEmployeeForAccount.email}
          employeeName={selectedEmployeeForAccount.name}
          onAccountCreated={handleAccountCreated}
        />
      )}
    </div>
  );
}
