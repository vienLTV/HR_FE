"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/app/utils/api";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/app/components/Spinner";
import { Users, DollarSign, CheckCircle, Clock } from "lucide-react";
import { useI18n } from "@/app/providers/LanguageProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TeamSalaryRecord {
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
}

export default function TeamSalaryPage() {
  const { t } = useI18n();
  const [salaryRecords, setSalaryRecords] = useState<TeamSalaryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeamSalary = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/salary/team-salary");
      if (response.ok) {
        const result = await response.json();
        setSalaryRecords(Array.isArray(result.data) ? result.data : []);
      }
    } catch (error) {
      console.error("Error fetching team salary:", error);
      toast({
        title: "Error",
        description: "Failed to load team salary records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamSalary();
  }, []);

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
        {t("status.paid")}
      </span>
    ) : (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold inline-flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {t("status.pending")}
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
          <Users className="w-8 h-8" />
          {t("teamSalary.title")}
        </h1>
        <p className="text-gray-600 mt-1">{t("teamSalary.subtitle")}</p>
      </div>

      {/* Team Salary Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("teamSalary.table.title")}</CardTitle>
          <CardDescription>{t("teamSalary.table.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {salaryRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">{t("teamSalary.table.empty")}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("salaryManagement.table.employee")}</TableHead>
                  <TableHead>{t("salaryManagement.table.period")}</TableHead>
                  <TableHead className="text-right">{t("salaryManagement.table.basic")}</TableHead>
                  <TableHead className="text-right">{t("salaryManagement.table.bonus")}</TableHead>
                  <TableHead className="text-right">
                    {t("salaryManagement.table.deductions")}
                  </TableHead>
                  <TableHead className="text-right">{t("salaryManagement.table.total")}</TableHead>
                  <TableHead>{t("salaryManagement.table.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryRecords.map((record) => (
                  <TableRow key={record.salaryId}>
                    <TableCell className="font-medium">
                      {record.employeeName || t("status.unknown")}
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
