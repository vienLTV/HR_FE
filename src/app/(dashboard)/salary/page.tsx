"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/app/utils/api";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/app/components/Spinner";
import { DollarSign, Calendar, CheckCircle, Clock } from "lucide-react";

interface SalaryRecord {
  salaryId: string;
  employeeId: string;
  employeeName?: string;
  month: string;
  year: number;
  basicSalary: number;
  bonus: number;
  deductions: number;
  totalSalary: number;
  status: "PENDING" | "PAID";
  paidAt?: string;
}

export default function MySalaryPage() {
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMySalary = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/salary/my-salary");
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
    fetchMySalary();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    return status === "PAID" ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Paid
      </span>
    ) : (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold flex items-center gap-1">
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
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <DollarSign className="w-8 h-8" />
          My Salary
        </h1>
        <p className="text-gray-600 mt-1">View your salary history</p>
      </div>

      {/* Salary Records */}
      {salaryRecords.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 text-gray-500">
            No salary records found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {salaryRecords.map((record) => (
            <Card key={record.salaryId}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {record.month}/{record.year}
                    </CardTitle>
                    <CardDescription>Salary breakdown</CardDescription>
                  </div>
                  {getStatusBadge(record.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Basic Salary</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatCurrency(record.basicSalary)}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Bonus</p>
                    <p className="text-lg font-semibold text-green-600">
                      +{formatCurrency(record.bonus)}
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Deductions</p>
                    <p className="text-lg font-semibold text-red-600">
                      -{formatCurrency(record.deductions)}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Salary</p>
                    <p className="text-xl font-bold text-purple-600">
                      {formatCurrency(record.totalSalary)}
                    </p>
                  </div>
                </div>
                {record.paidAt && (
                  <p className="text-sm text-gray-500 mt-4">
                    Paid at: {new Date(record.paidAt).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
