"use client";

import { DataTable } from "@/app/components/DataTable";
import { useI18n } from "@/app/providers/LanguageProvider";

export default function EmployeePage() {
  const { t } = useI18n();
  return (
    <div className="w-full p-4">
      {/* TITLE */}
      <div className="mb-4">
        <h1 className="text-primary-heading">{t("employee.title")}</h1>
        <p className="text-gray-500 text-md">{t("employee.subtitle")}</p>
      </div>

      {/* TABLE */}
      <div className="w-full mt-2">
        <DataTable />
      </div>
    </div>
  );
}
