"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/app/utils/api";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/app/components/Spinner";
import { Settings, DollarSign, CheckCircle, Clock, Calculator } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SalaryRecord {
  salaryId: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  bonus: number;
  deductions: number;
  totalSalary: number;
  status: "PENDING" | "PAID";
  paidAt?: string;
}

export default function SalaryManagementPage() {
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculateDialogOpen, setIsCalculateDialogOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculateForm, setCalculateForm] = useState({
    month: "",
    year: new Date().getFullYear().toString(),
  });

  const fetchAllSalary = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/salary/all");
      if (response.ok) {
        const result = await response.json();
        setSalaryRecords(Array.isArray(result.data) ? result.data : []);
      }
    } catch (error) {
      console.error("Error fetching salary:", error);
      toast({
        title: "Error",
        description: "Failed to load salary records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSalary();
  }, []);

  const handleCalculateSalary = async () => {
    if (!calculateForm.month || !calculateForm.year) {
      toast({
        title: "Validation Error",
        description: "Please select month and year",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    try {
      const response = await api.post("/salary/calculate", {
        month: calculateForm.month,
        year: parseInt(calculateForm.year),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Salary calculated successfully",
        });
        setIsCalculateDialogOpen(false);
        fetchAllSalary();
      } else {
        throw new Error("Failed to calculate salary");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate salary",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleMarkAsPaid = async (salaryId: string) => {
    try {
      const response = await api.put(`/salary/${salaryId}/mark-paid`, {});
      if (response.ok) {
        toast({
          title: "Success",
          description: "Salary marked as paid",
        });
        fetchAllSalary();
      } else {
        throw new Error("Failed to mark as paid");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark salary as paid",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    return status === "PAID" ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold inline-flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Paid
      </span>
    ) : (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold inline-flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Salary Management
          </h1>
          <p className="text-gray-600 mt-1">Calculate salary and manage payments</p>
        </div>

        <Dialog open={isCalculateDialogOpen} onOpenChange={setIsCalculateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Salary
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Calculate Salary</DialogTitle>
              <DialogDescription>
                Calculate salary for all employees for a specific period
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month *</Label>
                <Input
                  id="month"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="1-12"
                  value={calculateForm.month}
                  onChange={(e) => setCalculateForm({ ...calculateForm, month: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  min="2020"
                  max="2100"
                  value={calculateForm.year}
                  onChange={(e) => setCalculateForm({ ...calculateForm, year: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCalculateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCalculateSalary} disabled={isCalculating}>
                {isCalculating ? "Calculating..." : "Calculate"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Salary Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Salary Records</CardTitle>
          <CardDescription>Manage employee salaries and payments</CardDescription>
        </CardHeader>
        <CardContent>
          {salaryRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No salary records found. Click "Calculate Salary" to generate salary for employees.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Basic Salary</TableHead>
                  <TableHead className="text-right">Bonus</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryRecords.map((record) => (
                  <TableRow key={record.salaryId}>
                    <TableCell className="font-medium">
                      {record.employeeName || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {record.month}/{record.year}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(record.basicSalary)}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      +{formatCurrency(record.bonus)}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      -{formatCurrency(record.deductions)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(record.totalSalary)}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      {record.status === "PENDING" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsPaid(record.salaryId)}
                        >
                          Mark as Paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
