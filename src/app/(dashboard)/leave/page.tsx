"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Check, X, MoreHorizontal, Plus } from "lucide-react";
import { api } from "@/app/utils/api";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/app/components/Spinner";
import { useRole } from "@/hooks/useRole";

type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

interface LeaveRequest {
  leaveRequestId: string;
  employeeId: string;
  employeeName?: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

interface CreateLeaveRequest {
  fromDate: string;
  toDate: string;
  reason: string;
}

export default function LeavePage() {
  const { role, isLoaded } = useRole();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  // Fetch leave requests based on role
  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const endpoint =
        role && ["MANAGER", "ADMIN", "OWNER"].includes(role.toUpperCase())
          ? "/leave-requests" // All requests for managers
          : "/leave-requests/my"; // Only user's requests

      const response = await api.get(endpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch leave requests");
      }

      const data = await response.json();
      setLeaveRequests(data.data || []);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      toast({
        title: "Error",
        description: "Failed to load leave requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && role) {
      fetchLeaveRequests();
    }
  }, [isLoaded, role]);

  const handleCreateLeave = async () => {
    if (!fromDate || !toDate || !reason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      toast({
        title: "Validation Error",
        description: "From date cannot be after to date",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const requestBody: CreateLeaveRequest = {
        fromDate,
        toDate,
        reason: reason.trim(),
      };

      const response = await api.post("/leave-requests", requestBody);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create leave request");
      }

      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      });

      // Reset form
      setFromDate("");
      setToDate("");
      setReason("");
      setCreateDialogOpen(false);

      // Refresh list
      fetchLeaveRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit leave request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (leaveRequestId: string, newStatus: "APPROVED" | "REJECTED") => {
    try {
      const response = await api.put(`/leave-requests/${leaveRequestId}/status`, {
        status: newStatus,
      });

      if (!response.ok) {
        throw new Error("Failed to update leave request status");
      }

      toast({
        title: "Success",
        description: `Leave request ${newStatus.toLowerCase()} successfully`,
      });

      // Refresh list
      fetchLeaveRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update leave request status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: LeaveStatus) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      CANCELLED: "bg-gray-100 text-gray-800",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDays = (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Leave Management
          </h1>
          <p className="text-gray-500 mt-1">
            {role && ["MANAGER", "ADMIN", "OWNER"].includes(role.toUpperCase())
              ? "Manage team leave requests"
              : "Submit and track your leave requests"}
          </p>
        </div>

        {/* Create Leave Button - Available for all roles */}
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Request Leave
        </Button>
      </div>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {role && ["MANAGER", "ADMIN", "OWNER"].includes(role.toUpperCase())
              ? "All Leave Requests"
              : "My Leave Requests"}
          </CardTitle>
          <CardDescription>
            {role && ["MANAGER", "ADMIN", "OWNER"].includes(role.toUpperCase())
              ? "Review and approve team leave requests"
              : "View the status of your leave requests"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : leaveRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No leave requests found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    {role && ["MANAGER", "ADMIN", "OWNER"].includes(role.toUpperCase()) && (
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Employee
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      From Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      To Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Submitted
                    </th>
                    {role && ["MANAGER", "ADMIN", "OWNER"].includes(role.toUpperCase()) && (
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaveRequests.map((request) => (
                    <tr key={request.leaveRequestId} className="hover:bg-gray-50">
                      {role && ["MANAGER", "ADMIN", "OWNER"].includes(role.toUpperCase()) && (
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {request.employeeName || "Unknown"}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(request.fromDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(request.toDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {calculateDays(request.fromDate, request.toDate)} days
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate" title={request.reason}>
                          {request.reason}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.createdAt)}
                      </td>
                      {role && ["MANAGER", "ADMIN", "OWNER"].includes(role.toUpperCase()) && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.status === "PENDING" ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(request.leaveRequestId, "APPROVED")
                                  }
                                  className="text-green-600 focus:text-green-600"
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(request.leaveRequestId, "REJECTED")
                                  }
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <span className="text-xs text-gray-400">
                              {request.status === "APPROVED" ? "Approved" : "Rejected"}
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Leave Request Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
            <DialogDescription>
              Submit a new leave request. Your manager will review and approve it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="fromDate" className="text-sm font-medium">
                From Date *
              </label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                disabled={isSubmitting}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="toDate" className="text-sm font-medium">
                To Date *
              </label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                disabled={isSubmitting}
                min={fromDate || new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason *
              </label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for your leave request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
                rows={4}
              />
            </div>

            {fromDate && toDate && (
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                <strong>Duration:</strong> {calculateDays(fromDate, toDate)} day(s)
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateLeave} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
