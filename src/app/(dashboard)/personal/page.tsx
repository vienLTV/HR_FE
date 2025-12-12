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

interface PersonalProps {
  params: { employeeId?: string };
}

const PersonalPage = ({ params }: PersonalProps) => {
  const router = useRouter();
  const [employeeData, setEmployeeData] = useState<Employee | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const fetchEmployeeData = async () => {
    try {
      setIsLoading(true);

      // Determine which employee ID to use
      const effectiveEmployeeId =
        params.employeeId || localStorage.getItem("employeeId");

      if (!effectiveEmployeeId) {
        throw new Error("No employee ID available");
      }

      // Fetch employee data using the effectiveEmployeeId
      const response = await api.get("/employees/" + effectiveEmployeeId);
      if (!response.ok) {
        throw new Error("Failed to fetch employee data");
      }
      const data = await response.json();
      setEmployeeData(data.data);

      await fetchAvatarImage(effectiveEmployeeId);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      // Handle error state here, e.g., set an error message state
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvatarImage = async (activeEmployeeId: string) => {
    try {
      console.log("employeeId to fecth avatar: " + activeEmployeeId);

      const response = await api.get(`/employees/profile/${activeEmployeeId}`);
      if (response.ok) {
        const data = await response.json();
        const imageUrl = `data:${data.data.avatarContentType};base64,${data.data.avatarImage}`;
        setAvatarUrl(imageUrl);
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

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-primary-heading mb-1">Personal</h1>
      <p className="text-muted-foreground mb-3">
        All of Employee Personal Information
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardContent className="border border-gray-400">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mt-5 gap-3">
                <TabsTrigger
                  className="border border-gray-300 data-[state=active]:text-[#054FA5]"
                  value="personal"
                >
                  <span className="text-md font-bold">Personal</span>
                </TabsTrigger>
                <TabsTrigger
                  className="border border-gray-300 data-[state=active]:text-[#054FA5]"
                  value="history"
                >
                  <span className="text-md font-bold">Employee History</span>
                </TabsTrigger>
                <TabsTrigger
                  className="border border-gray-300 data-[state=active]:text-[#054FA5]"
                  value="emergency"
                >
                  <span className="text-md font-bold">Emergency Contact</span>
                </TabsTrigger>
                <TabsTrigger
                  className="border border-gray-300 data-[state=active]:text-[#054FA5]"
                  value="bank"
                >
                  <span className="text-md font-bold">Bank Account</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card className="border border-gray-300">
                    <CardHeader>
                      <CardTitle className="text-primary-md">
                        Company Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Company email
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.companyEmail}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Company phone number
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.companyPhoneNumber}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Employee status
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
                            {employeeData.employeeStatus}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Job Title
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.jobTitle?.title || "N/A"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Team
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.team?.name || "N/A"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Department
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
                        Personal Detail
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Gender
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.gender == "MALE"
                              ? "Male"
                              : employeeData.gender == "FEMALE"
                                ? "Female"
                                : "Other"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            First Name
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.firstName}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Last Name
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.lastName}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Personal Email
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.personalEmail}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Personal Phone Number
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.personalPhoneNumber}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Current Address
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.currentAddress}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Date of Birth
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.dateOfBirth}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Place of Birth
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.birthPlace}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Marital Status
                          </dt>
                          <dd className="mt-1 text-md font-medium">
                            {employeeData.maritalStatus == "MARRIED"
                              ? "Married"
                              : "Not married"}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-3 flex justify-start items-center">
                  <UpdateEmployeeModal
                    employeeId={employeeData.employeeId}
                    employeeUpdated={handleEmployeeUpdated}
                  />
                  <div className="p-2">
                    {employeeData.employeeId !==
                      localStorage.getItem("employeeId") &&
                      localStorage.getItem("role") == "OWNER" && (
                        <DeleteEmployeeModal
                          employee={employeeData}
                          employeeDeleted={handleEmployeeDeleted}
                        />
                      )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Employee History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Employee history information will be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent className="border border-gray-600" value="emergency">
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Emergency contact information will be displayed here.</p>
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
            <CardTitle className="text-primary-md">Profile Summary</CardTitle>
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
              <p className="text-muted-foreground">
                {employeeData.jobTitle?.title || "N/A"}
              </p>
              <div className="mt-4">
                <AvatarUploadDialog
                  employeeId={employeeData.employeeId}
                  onAvatarUpdate={handleAvatarUpdate}
                />
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <p>
                <strong>Team:</strong> {employeeData.team?.name || "N/A"}
              </p>
              <p>
                <strong>Status: </strong>
                <span
                  className={`p-2 inline-flex text-xs leading-5 ${
                    employeeData.employeeStatus === "OFFICIAL"
                      ? "label-primary"
                      : employeeData.employeeStatus === "PROBATION"
                        ? "label-warning"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {employeeData.employeeStatus}
                </span>
              </p>
              <p>
                <strong>Email:</strong> {employeeData.companyEmail}
              </p>
              <p>
                <strong>Phone:</strong> {employeeData.companyPhoneNumber}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalPage;
