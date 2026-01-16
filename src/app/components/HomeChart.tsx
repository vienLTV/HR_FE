"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { api } from "@/app/utils/api";
import { useI18n } from "@/app/providers/LanguageProvider";

interface AttendanceDashboardSummary {
  totalEmployees: number;
  totalAttendanceToday: number;
}

export function HomeChart() {
  const { t } = useI18n();
  const [attendanceData, setAttendanceData] = useState<AttendanceDashboardSummary | null>(null);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      try {
        setIsLoadingAttendance(true);
        setAttendanceError(null);
        const response = await api.get("/attendance/dashboard-summary");
        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }
        const data = await response.json();
        setAttendanceData(data.data);
      } catch (error) {
        console.error("Error fetching attendance summary:", error);
        setAttendanceError("Failed to load attendance data");
      } finally {
        setIsLoadingAttendance(false);
      }
    };

    fetchAttendanceSummary();
  }, []);

  return (
    <div className="grid gap-6 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      <Card className="w-full border border-gray-400">
        <CardHeader>
          <CardTitle className="text-primary-md">{t("home.charts.headcount.title")}</CardTitle>
          <CardDescription>{t("home.charts.headcount.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              headcount: {
                label: "Headcount",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { month: "Jan", headcount: 120 },
                  { month: "Feb", headcount: 125 },
                  { month: "Mar", headcount: 130 },
                  { month: "Apr", headcount: 135 },
                  { month: "May", headcount: 140 },
                  { month: "Jun", headcount: 145 },
                ]}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="headcount" stroke="var(--color-headcount)" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full border border-gray-400">
        <CardHeader>
          <CardTitle className="text-primary-md">{t("home.charts.department.title")}</CardTitle>
          <CardDescription>{t("home.charts.department.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              employees: {
                label: "Employees",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { department: "HR", employees: 15 },
                  { department: "Engineering", employees: 50 },
                  { department: "Sales", employees: 30 },
                  { department: "Marketing", employees: 20 },
                  { department: "Finance", employees: 10 },
                ]}
              >
                <XAxis dataKey="department" />
                <YAxis />
                <Bar dataKey="employees" fill="var(--color-employees)" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full border border-gray-400">
        <CardHeader>
          <CardTitle className="text-primary-md">{t("home.charts.turnover.title")}</CardTitle>
          <CardDescription>{t("home.charts.turnover.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              turnover: {
                label: "Turnover Rate",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { month: "Jan", turnover: 2.5 },
                  { month: "Feb", turnover: 2.2 },
                  { month: "Mar", turnover: 2.8 },
                  { month: "Apr", turnover: 2.1 },
                  { month: "May", turnover: 2.4 },
                  { month: "Jun", turnover: 2.3 },
                ]}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="turnover"
                  stroke="var(--color-turnover)"
                  fill="var(--color-turnover)"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full border border-gray-400">
        <CardHeader>
          <CardTitle className="text-primary-md">{t("home.charts.attendance.title")}</CardTitle>
          <CardDescription>{t("home.charts.attendance.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAttendance ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <p className="text-gray-500">{t("home.charts.attendance.loading")}</p>
            </div>
          ) : attendanceError ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <p className="text-red-500">{t("home.charts.attendance.error")}</p>
            </div>
          ) : attendanceData ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">
                  {attendanceData.totalAttendanceToday} / {attendanceData.totalEmployees}
                </p>
                <p className="text-lg text-gray-600 mt-2">
                  {t("home.charts.attendance.checkedIn")}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-[300px] flex items-center justify-center">
              <p className="text-gray-500">{t("home.charts.attendance.noData")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="w-full border border-gray-400">
        <CardHeader>
          <CardTitle className="text-primary-md">{t("home.charts.salary.title")}</CardTitle>
          <CardDescription>{t("home.charts.salary.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              employees: {
                label: "Employees",
                color: "hsl(var(--chart-5))",
              },
            }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { range: "30k-50k", employees: 20 },
                  { range: "50k-70k", employees: 35 },
                  { range: "70k-90k", employees: 25 },
                  { range: "90k-110k", employees: 15 },
                  { range: "110k+", employees: 5 },
                ]}
              >
                <XAxis dataKey="range" />
                <YAxis />
                <Bar dataKey="employees" fill="var(--color-employees)" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full border border-gray-400">
        <CardHeader>
          <CardTitle className="text-primary-md">{t("home.charts.performance.title")}</CardTitle>
          <CardDescription>{t("home.charts.performance.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              employees: {
                label: "Employees",
                color: "hsl(var(--chart-6))",
              },
            }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="30%"
                outerRadius="70%"
                data={[
                  { name: "Exceptional", value: 20 },
                  { name: "Exceeds Expectations", value: 35 },
                  { name: "Meets Expectations", value: 30 },
                  { name: "Needs Improvement", value: 15 },
                ]}
                startAngle={0}
                endAngle={360}
              >
                <RadialBar background dataKey="value" cornerRadius={15} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
