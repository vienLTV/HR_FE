"use client";

import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useRouter } from "next/navigation";
import { Employee } from "@/app/components/DataTable";
import { UpdateEmployeeModal } from "@/app/components/UpdateEmployeeModal";
import { DeleteEmployeeModal } from "@/app/components/DeleteEmployeeModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/app/components/Spinner";
import AvatarUploadDialog from "@/app/components/AvatarUploadDialog";
import BankAccountInfo from "@/app/components/BankAccountInfo";
import { useI18n } from "@/app/providers/LanguageProvider";

interface PersonalProps {
  params: { employeeId?: string };
}

const PersonalPage = ({ params }: PersonalProps) => {
  const { t } = useI18n();
  const router = useRouter();
  const [employeeData, setEmployeeData] = useState<Employee | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<
    {
      changedAt: string;
      changedBy: string;
      fieldName: string;
      oldValue: string | null;
      newValue: string | null;
      changeType: string;
    }[]
  >([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const fetchEmployeeData = async () => {
    try {
      setIsLoading(true);

      // Determine which employee ID to use
      const effectiveEmployeeId = params.employeeId || localStorage.getItem("employeeId");

      if (!effectiveEmployeeId) {
        throw new Error("No employee ID available");
      }

      // Fetch employee data using the effectiveEmployeeId
      const response = await api.get("/employees/" + effectiveEmployeeId);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Failed to fetch employee data: ${response.status} - ${errorData?.message || response.statusText}`,
        );
      }
      const data = await response.json();

      if (!data.data) {
        throw new Error("No employee data in response");
      }

      setEmployeeData(data.data);

      // reset history state when employee changes
      setHistory([]);
      setHistoryError(null);
      setHistoryLoaded(false);

      // Render main content first, then load avatar in background
      setIsLoading(false);
      fetchAvatarImage(effectiveEmployeeId);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setIsLoading(false);
      // Handle error state here, e.g., set an error message state
    } finally {
      // do not block UI on avatar fetch
    }
  };

  const fetchAvatarImage = async (activeEmployeeId: string) => {
    try {
      const cacheKey = `avatar:${activeEmployeeId}`;
      const cached = typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;
      if (cached) {
        setAvatarUrl(cached);
        return;
      }

      const response = await api.get(`/employees/profile/${activeEmployeeId}`);
      if (response.ok) {
        const data = await response.json();
        const imageUrl = `data:${data.data.avatarContentType};base64,${data.data.avatarImage}`;
        setAvatarUrl(imageUrl);
        if (typeof window !== "undefined") {
          sessionStorage.setItem(cacheKey, imageUrl);
        }
      } else {
        console.error("Failed to fetch avatar image");
      }
    } catch (error) {
      console.error("Error fetching avatar image:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeHistory = async (employeeId: string) => {
    try {
      setHistoryLoading(true);
      setHistoryError(null);

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setHistoryError("You are not authorized to view employee history.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/employee-history/employee/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        setHistoryError("You are not authorized to view employee history.");
        return;
      }

      if (response.status === 403) {
        setHistoryError("You don't have permission to view employee history.");
        return;
      }

      if (!response.ok) {
        setHistoryError("Failed to load employee history. Please try again.");
        return;
      }

      const data = await response.json();
      const records = data?.data?.items || data?.data || data || [];
      setHistory(Array.isArray(records) ? records : []);
    } catch (err) {
      console.error("Error fetching employee history:", err);
      setHistoryError("Failed to load employee history. Please try again.");
    } finally {
      setHistoryLoaded(true);
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "history") return;
    if (!employeeData?.employeeId) return;
    if (historyLoaded) return;

    fetchEmployeeHistory(employeeData.employeeId);
  }, [activeTab, employeeData?.employeeId, historyLoaded]);

  const handleEmployeeUpdated = () => {
    fetchEmployeeData();
  };

  const handleEmployeeDeleted = () => {
    router.push("/personal");
  };

  if (isLoading) {
    return <Spinner />;
  }
  if (error) return <div>Error: {error}</div>;
  if (!employeeData) return <div>No data available</div>;

  const handleAvatarUpdate = () => {
    fetchEmployeeData();
  };

  const formatDateTime = (value: string) => {
    if (!value) return "N/A";
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleString();
  };

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-primary-heading mb-1">{t("personal.title")}</h1>
      <p className="text-muted-foreground mb-3">{t("personal.subtitle")}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardContent className="border border-gray-400">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mt-5 gap-3">
                <TabsTrigger
                  className="border border-gray-300 data-[state=active]:text-[#054FA5]"
                  value="personal"
                >
                  <span className="text-md font-bold">{t("personal.tabs.personal")}</span>
                </TabsTrigger>
                <TabsTrigger
                  className="border border-gray-300 data-[state=active]:text-[#054FA5]"
                  value="history"
                >
                  <span className="text-md font-bold">{t("personal.tabs.history")}</span>
                </TabsTrigger>
                <TabsTrigger
                  className="border border-gray-300 data-[state=active]:text-[#054FA5]"
                  value="emergency"
                >
                  <span className="text-md font-bold">{t("personal.tabs.emergency")}</span>
                </TabsTrigger>
                <TabsTrigger
                  className="border border-gray-300 data-[state=active]:text-[#054FA5]"
                  value="bank"
                >
                  <span className="text-md font-bold">{t("personal.tabs.bank")}</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card className="border border-gray-300">
                    <CardHeader>
                      <CardTitle className="text-primary-md">
                        {t("personal.section.company")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.companyEmail")}
                          </dt>
                          <dd className="mt-1 text-md font-medium">{employeeData.companyEmail}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.companyPhone")}
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.companyPhoneNumber}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.employeeStatus")}
                          </dt>
                          <dd
                            className={`p-2 mt-2 inline-flex text-xs leading-5 ${
                              employeeData.employeeStatus === "OFFICIAL"
                                ? "label-primary"
                                : employeeData.employeeStatus === "PROBATION"
                                  ? "label-warning"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {employeeData.employeeStatus === "OFFICIAL"
                              ? t("employee.status.official")
                              : employeeData.employeeStatus === "PROBATION"
                                ? t("employee.status.probation")
                                : employeeData.employeeStatus}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.jobTitle")}
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.jobTitle?.title || "N/A"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.team")}
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.team?.name || "N/A"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.department")}
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.department?.name || "N/A"}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-300">
                    <CardHeader>
                      <CardTitle className="text-primary-md">
                        {t("personal.section.detail")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.gender")}
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.gender == "MALE"
                              ? t("personal.gender.male")
                              : employeeData.gender == "FEMALE"
                                ? t("personal.gender.female")
                                : t("personal.gender.other")}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.firstName")}
                          </dt>
                          <dd className="mt-1 text-md font-medium">{employeeData.firstName}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.lastName")}
                          </dt>
                          <dd className="mt-1 text-md font-medium">{employeeData.lastName}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.personalEmail")}
                          </dt>
                          <dd className="mt-1 text-md font-medium">{employeeData.personalEmail}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.personalPhone")}
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.personalPhoneNumber}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.currentAddress")}
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.currentAddress}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.dateOfBirth")}
                          </dt>
                          <dd className="mt-1 text-md font-medium">{employeeData.dateOfBirth}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.birthPlace")}
                          </dt>
                          <dd className="mt-1 text-md font-medium">{employeeData.birthPlace}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t("personal.field.maritalStatus")}
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.maritalStatus == "MARRIED"
                              ? t("personal.maritalStatus.married")
                              : t("personal.maritalStatus.notMarried")}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-3 flex justify-start items-center gap-3">
                  <div className="w-32">
                    <UpdateEmployeeModal
                      employeeId={employeeData.employeeId}
                      employeeUpdated={handleEmployeeUpdated}
                    />
                  </div>
                  {employeeData.employeeId !== localStorage.getItem("employeeId") &&
                    localStorage.getItem("role") == "OWNER" && (
                      <div className="w-32">
                        <DeleteEmployeeModal
                          employee={employeeData}
                          employeeDeleted={handleEmployeeDeleted}
                        />
                      </div>
                    )}
                </div>
              </TabsContent>
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("personal.history.title")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {historyLoading ? (
                      <p className="text-sm text-gray-600">{t("personal.history.loading")}</p>
                    ) : historyError ? (
                      <p className="text-sm text-red-600">{historyError}</p>
                    ) : history.length === 0 ? (
                      <p className="text-sm text-gray-600">{t("personal.history.empty")}</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("personal.history.date")}
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("personal.history.changedBy")}
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("personal.history.field")}
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("personal.history.oldNew")}
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("personal.history.type")}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {history.map((item, idx) => (
                              <tr key={`${item.changedAt}-${idx}`} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-800">
                                  {formatDateTime(item.changedAt)}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-800">
                                  {item.changedBy || "N/A"}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-800">
                                  {item.fieldName || "N/A"}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-800">
                                  <div className="flex flex-col">
                                    <span className="text-gray-500 line-through">
                                      {item.oldValue ?? "N/A"}
                                    </span>
                                    <span className="text-gray-900">{item.newValue ?? "N/A"}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-2 text-sm font-semibold text-gray-800">
                                  {item.changeType || ""}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent className="border border-gray-600" value="emergency">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("personal.emergency.title")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{t("personal.emergency.desc")}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="bank">
                <BankAccountInfo employeeId={employeeData.employeeId} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="border rounded-none border-gray-400">
          <CardHeader>
            <CardTitle className="text-primary-md">{t("personal.profileSummary")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Employee Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <h2 className="text-xl text-primary-md">{`${employeeData.firstName} ${employeeData.lastName}`}</h2>
              <p className="text-muted-foreground">{employeeData.jobTitle?.title || "N/A"}</p>
              <div className="mt-4">
                <AvatarUploadDialog
                  employeeId={employeeData.employeeId}
                  onAvatarUpdate={handleAvatarUpdate}
                />
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <p>
                <strong>{t("personal.profileSummary.team")}:</strong>{" "}
                {employeeData.team?.name || "N/A"}
              </p>
              <p>
                <strong>{t("personal.profileSummary.status")}: </strong>
                <span
                  className={`p-2 inline-flex text-xs leading-5 ${
                    employeeData.employeeStatus === "OFFICIAL"
                      ? "label-primary"
                      : employeeData.employeeStatus === "PROBATION"
                        ? "label-warning"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {employeeData.employeeStatus === "OFFICIAL"
                    ? t("employee.status.official")
                    : employeeData.employeeStatus === "PROBATION"
                      ? t("employee.status.probation")
                      : employeeData.employeeStatus}
                </span>
              </p>
              <p>
                <strong>{t("personal.profileSummary.email")}:</strong> {employeeData.companyEmail}
              </p>
              <p>
                <strong>{t("personal.profileSummary.phone")}:</strong>{" "}
                {employeeData.companyPhoneNumber}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalPage;
