"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmployeeHistoryRecord {
  id: string;
  employeeId: string;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
  changeType: "CREATE" | "UPDATE" | "DELETE";
  changedBy: string;
  changedAt: string;
}

interface EmployeeHistoryTableProps {
  employeeId: string;
}

export function EmployeeHistoryTable({ employeeId }: EmployeeHistoryTableProps) {
  const [historyData, setHistoryData] = useState<EmployeeHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployeeHistory();
  }, [employeeId]);

  const fetchEmployeeHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(`${normalizedBaseUrl}/employee-history/employee/${employeeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load employee history.");
      }

      const result = await response.json();
      const payload = result?.data ?? result;
      const inner = payload?.data ?? payload;

      const data =
        (Array.isArray(result) && result) ||
        (Array.isArray(payload?.content) && payload.content) ||
        (Array.isArray(payload?.items) && payload.items) ||
        (Array.isArray(inner?.content) && inner.content) ||
        (Array.isArray(inner?.items) && inner.items) ||
        (Array.isArray(payload) && payload) ||
        (Array.isArray(inner) && inner) ||
        [];

      setHistoryData(data);
    } catch (err: any) {
      setError(err.message || "Unable to load employee history.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  const formatFieldName = (fieldName: string) => {
    const labels: Record<string, string> = {
      fullName: "Full Name",
      email: "Email",
      phoneNumber: "Phone Number",
      address: "Address",
      dateOfBirth: "Date of Birth",
      gender: "Gender",
      position: "Position",
      department: "Department",
      salary: "Salary",
      hireDate: "Hire Date",
      status: "Status",
      firstName: "First Name",
      lastName: "Last Name",
      companyEmail: "Company Email",
      personalEmail: "Personal Email",
    };
    return labels[fieldName] || fieldName;
  };

  const formatValue = (value: string | null) => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-gray-400 italic">N/A</span>;
    }
    return <span>{value}</span>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Please wait while we fetch employee history...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 text-red-800 rounded-lg p-4">
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  if (historyData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employee History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">No history has been recorded yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Employee History</CardTitle>
        <p className="text-sm text-gray-500">Total {historyData.length} changes recorded</p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[140px]">Timestamp</TableHead>
                <TableHead className="w-[160px]">Performed By</TableHead>
                <TableHead className="w-[150px]">Field</TableHead>
                <TableHead>Old Value → New Value</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.map((record, index) => (
                <TableRow key={`${record.id}-${index}`}>
                  <TableCell className="font-mono text-xs">
                    {formatDate(record.changedAt)}
                  </TableCell>
                  <TableCell className="text-sm">{record.changedBy || "System"}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {formatFieldName(record.fieldName)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">{formatValue(record.oldValue)}</span>
                      <span>→</span>
                      <span className="font-medium">{formatValue(record.newValue)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        record.changeType === "CREATE"
                          ? "bg-blue-100 text-blue-800"
                          : record.changeType === "UPDATE"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.changeType}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
