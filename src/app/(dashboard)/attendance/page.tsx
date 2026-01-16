"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/app/utils/api";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/app/components/Spinner";
import { Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { useI18n } from "@/app/providers/LanguageProvider";

type AttendanceStatus = "PRESENT" | "PENDING" | "ABSENT" | "LATE" | "LEAVE";

interface AttendanceRecord {
  attendanceId: string;
  organizationId: string;
  employeeId: string;
  attendanceDate: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: AttendanceStatus;
  notes: string | null;
}

export default function AttendancePage() {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTodayAttendance = async () => {
    try {
      // Get today's attendance records (get multiple in case of re-check-in)
      const response = await api.get("/attendance/my-attendance?page=0&size=10");
      if (response.ok) {
        const result = await response.json();
        const items = result.data.items || [];
        const today = new Date().toISOString().split("T")[0];

        // Find the latest record for today
        const todayRecords = items.filter((record: AttendanceRecord) => {
          try {
            const recordDate = new Date(record.attendanceDate).toISOString().split("T")[0];
            return recordDate === today;
          } catch {
            return false;
          }
        });

        if (todayRecords.length > 0) {
          // Get the most recent record (first one in the list, since it's sorted by date DESC)
          setTodayAttendance(todayRecords[0]);
          return;
        }
        setTodayAttendance(null);
      }
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
    }
  };

  const fetchAttendanceHistory = async (page: number = 0) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/attendance/my-attendance?page=${page}&size=10`);
      if (response.ok) {
        const result = await response.json();
        setAttendanceHistory(result.data.items || []);
        setTotalPages(result.data.totalPages || 0);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      toast({
        title: "Error",
        description: "Failed to load attendance history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
    fetchAttendanceHistory();
  }, []);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      const response = await api.post("/attendance/check-in", {});

      if (response.ok) {
        const resJson = await response.json().catch(() => null);
        const attendance = resJson?.data as AttendanceRecord | null;
        if (attendance) {
          setTodayAttendance(attendance);
        } else {
          // Fallback to fetching if payload missing
          await fetchTodayAttendance();
        }
        toast({
          title: "Success",
          description: "Checked in successfully",
        });
        // Refresh history to reflect the latest changes
        await fetchAttendanceHistory(0);
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to check in" }));
        throw new Error(errorData.message || errorData.detail || "Failed to check in");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to check in";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setIsCheckingOut(true);
    try {
      const response = await api.post("/attendance/check-out", {});

      if (response.ok) {
        const resJson = await response.json().catch(() => null);
        const attendance = resJson?.data as AttendanceRecord | null;
        if (attendance) {
          setTodayAttendance(attendance);
        } else {
          await fetchTodayAttendance();
        }
        toast({
          title: "Success",
          description: "Checked out successfully",
        });
        // Refresh history to reflect the latest changes
        await fetchAttendanceHistory(0);
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to check out" }));
        throw new Error(errorData.message || errorData.detail || "Failed to check out");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to check out";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatTime = (datetime: string | null) => {
    if (!datetime) return "-";
    return new Date(datetime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    const styles = {
      PRESENT: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      ABSENT: "bg-red-100 text-red-800",
      LATE: "bg-orange-100 text-orange-800",
      LEAVE: "bg-blue-100 text-blue-800",
    };
    const statusKeyMap = {
      PRESENT: t("attendance.status.present"),
      PENDING: t("attendance.status.pending"),
      ABSENT: t("attendance.status.absent"),
      LATE: t("attendance.status.late"),
      LEAVE: t("attendance.status.leave"),
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {statusKeyMap[status] || status}
      </span>
    );
  };

  const canCheckIn = !todayAttendance || (todayAttendance && todayAttendance.checkOutTime);
  const canCheckOut = todayAttendance && !todayAttendance.checkOutTime;

  return (
    <div className="w-full p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("attendance.title")}</h1>
        <p className="text-gray-500">{t("attendance.subtitle")}</p>
      </div>

      {/* Today's Attendance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t("attendance.today")}
          </CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">{t("attendance.status")}</p>
              <div className="flex items-center gap-2">
                {todayAttendance ? (
                  getStatusBadge(todayAttendance.status)
                ) : (
                  <span className="text-gray-400 text-sm">{t("attendance.notCheckedIn")}</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">{t("attendance.checkIn")}</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatTime(todayAttendance?.checkInTime || null)}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">{t("attendance.checkOut")}</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatTime(todayAttendance?.checkOutTime || null)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleCheckIn}
              disabled={!canCheckIn || isCheckingIn}
              className="flex-1"
              size="lg"
            >
              {isCheckingIn ? (
                <>
                  <Spinner /> {t("attendance.checkingIn")}
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  {t("attendance.checkIn")}
                </>
              )}
            </Button>

            <Button
              onClick={handleCheckOut}
              disabled={!canCheckOut || isCheckingOut}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              {isCheckingOut ? (
                <>
                  <Spinner /> {t("attendance.checkingOut")}
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-5 w-5" />
                  {t("attendance.checkOut")}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("attendance.history")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        {t("attendance.date")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        {t("attendance.checkInTime")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        {t("attendance.checkOutTime")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        {t("attendance.status")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        {t("attendance.notes")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          {t("attendance.noRecords")}
                        </td>
                      </tr>
                    ) : (
                      attendanceHistory.map((record) => (
                        <tr key={record.attendanceId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(record.attendanceDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatTime(record.checkInTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatTime(record.checkOutTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(record.status)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{record.notes || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={() => fetchAttendanceHistory(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    {t("attendance.prev")}
                  </Button>
                  <span className="text-sm text-gray-600">
                    {t("attendance.page")} {currentPage + 1} {t("attendance.of")} {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => fetchAttendanceHistory(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                  >
                    {t("attendance.next")}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
