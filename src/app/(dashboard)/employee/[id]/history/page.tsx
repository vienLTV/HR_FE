"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EmployeeHistoryTable } from "@/app/components/EmployeeHistoryTable";
import { Button } from "@/components/ui/button";

export default function EmployeeHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  return (
    <div className="w-full p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/employee")}
                className="gap-2 rounded-lg bg-white border-2 border-gray-400 hover:bg-gray-100 hover:border-gray-600"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Employees
              </Button>
              <h1 className="text-3xl font-bold">Employee History</h1>
            </div>
            <p className="text-gray-500">
              Review all changes made to this employee&apos;s data over time
            </p>
          </div>
        </div>

        {/* History Table */}
        <EmployeeHistoryTable employeeId={employeeId} />
      </div>
    </div>
  );
}
