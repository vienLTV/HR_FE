import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Employee } from "./DataTable";
import { api } from "../utils/api";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface DeleteEmployeeProps{
    employee: Employee
    employeeDeleted: () => void
}

export function DeleteEmployeeModal({employee}: DeleteEmployeeProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const deleteEmployee = async() => {
        try {
            const response = await api.delete(`/employees/${employee.employeeId}`);
            if (!response.ok) {
                toast({
                    title: "Error",
                    description: "Failed to delete employee. Please try again.",
                    variant: "destructive",
                  })
                throw new Error;
            }
            const data = await response.json();
          if (data.success) {
            setIsOpen(false)
            toast({
              title: "Employee Deleted",
              description: "The employee has been successfully deleted.",
            })
            router.push('/employee');
          }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async() => {
        deleteEmployee();
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="button-red hover:bg-red">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-primary-md">Delete Employee</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <p>This employee will be removed permanently!</p>
                    <h3 className="font-bold text-black mt-2">{employee.firstName} {employee.lastName}</h3>
                </DialogDescription>
                <DialogFooter>
                    <Button onClick={handleDelete} className="button-red hover:bg-white">Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}