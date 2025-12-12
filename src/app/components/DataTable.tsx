"use client";

import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, View } from "lucide-react"
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/navigation";
import { CreateEmployeeModal } from "./CreateEmployeeModal";
import { Spinner } from "./Spinner";

export type Employee = {
  employeeId: string
  employeeStatus: string
  companyEmail: string
  jobTitle: JobTitle
  team: Team
  firstName: string
  lastName: string
  companyPhoneNumber: string
  personalPhoneNumber: string
  personalEmail: string
  department: Department
  currentAddress: string
  gender: string
  dateOfBirth: string
  birthPlace: string
  maritalStatus: string
}

export type JobTitle = {
  jobTitleId: string;
  title: string;
  description: string
}

export type Team = {
  teamId: string;
  name: string;
  description: string;
  phoneNumber: string;
  email: string;
  location: string;
  departmentId: string;
}

export type Department = {
  departmentId: string;
  name: string;
  description: string;
  location: string;
  establishedDate: string;
  phoneNumber: string;
  email: string;
}

export function DataTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const fetchEmployeesData = async () => {
    try {
        setIsLoading(true)
        const response = await api.get('/employees/');
        if (!response.ok) {
            throw new Error;
        }
        const data = await response.json();
        setEmployees(data.data.items);
        setIsLoading(false);
    } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
};

  useEffect(() => {
      setMounted(true); // This ensures the component is mounted on the client
    }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchEmployeesData();
  }, [mounted]);

  const handleViewDetail = (employeeId: string) => {
    if (!error && mounted) {
      router.push(`/personal/${employeeId}`);
    }
  }

  const handleEmployeeCreated = () => {
    fetchEmployeesData();
  }

  if (isLoading) {
    return <Spinner />
  }
  if (error) return <div>Error: {error}</div>;
  if (!employees) return <div>No data available</div>;

  return (
    <div className="w-full">
      <div className="mt-3">
          <CreateEmployeeModal employeeCreated={handleEmployeeCreated} />
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
            {employees.map((employee) => (
              <tr key={employee.employeeId} className="hover:bg-gray-200 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">{employee.firstName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.companyEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.jobTitle?.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.team?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.department?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`p-2 inline-flex text-xs leading-5 ${
                    employee.employeeStatus === 'OFFICIAL' ? 'label-primary' :
                    employee.employeeStatus === 'PROBATION' ? 'label-warning' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {employee.employeeStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <DropdownMenu>
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
                        <DropdownMenuSeparator className="" />
                      </DropdownMenuContent>
                    </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
