"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "./Spinner";
import { useRole } from "@/hooks/useRole";
import { useI18n } from "@/app/providers/LanguageProvider";
import {
  BriefcaseIcon,
  BuildingIcon,
  HomeIcon,
  UserIcon,
  UserPlus,
  UsersIcon,
  ClipboardCheck,
  Calendar,
  DollarSign,
  Wallet,
  Settings,
} from "lucide-react";

/**
 * Menu items with role-based visibility
 * Role hierarchy: OWNER >= ADMIN > MANAGER > USER
 *
 * USER: Home, Personal, Attendance (basic employee view)
 * MANAGER: + Employees (view only, no create/delete actions)
 * ADMIN/OWNER: All items
 */
export const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: HomeIcon,
        label: "menu.home",
        href: "/home",
        allowedRoles: ["USER", "MANAGER", "ADMIN", "OWNER"],
      },
      {
        icon: UserIcon,
        label: "menu.personal",
        href: "/personal",
        allowedRoles: ["USER", "MANAGER", "ADMIN", "OWNER"],
      },
      {
        icon: ClipboardCheck,
        label: "menu.attendance",
        href: "/attendance",
        allowedRoles: ["USER", "MANAGER", "ADMIN", "OWNER"],
      },
      {
        icon: Calendar,
        label: "menu.leave",
        href: "/leave",
        allowedRoles: ["USER", "MANAGER", "ADMIN", "OWNER"],
      },
      {
        icon: DollarSign,
        label: "menu.salary",
        href: "/salary",
        allowedRoles: ["USER", "MANAGER", "ADMIN", "OWNER"],
      },
      {
        icon: Wallet,
        label: "menu.teamSalary",
        href: "/team-salary",
        allowedRoles: ["MANAGER", "ADMIN", "OWNER"],
      },
      {
        icon: Settings,
        label: "menu.salaryManagement",
        href: "/salary-management",
        allowedRoles: ["ADMIN", "OWNER"],
      },
      {
        icon: UsersIcon,
        label: "menu.employees",
        href: "/employee",
        allowedRoles: ["MANAGER", "ADMIN", "OWNER"],
      },
      {
        icon: BriefcaseIcon,
        label: "menu.jobTitle",
        href: "/job-title",
        allowedRoles: ["ADMIN", "OWNER"],
      },
      {
        icon: UserPlus,
        label: "menu.team",
        href: "/team",
        allowedRoles: ["ADMIN", "OWNER"],
      },
      {
        icon: BuildingIcon,
        label: "menu.department",
        href: "/department",
        allowedRoles: ["ADMIN", "OWNER"],
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { role, isLoaded } = useRole();
  const [isLoading, setIsLoading] = useState(false);
  const [activeHref, setActiveHref] = useState(pathname);

  useEffect(() => {
    setIsLoading(false);
    setActiveHref(pathname);
  }, [pathname]);

  const handleNavigation = async (href: string) => {
    if (href !== activeHref) {
      setIsLoading(true);
      setActiveHref(href);
      await router.push(href);
    }
  };

  // Filter menu items based on user role
  const getVisibleMenuItems = () => {
    console.log("Menu Debug - isLoaded:", isLoaded, "role:", role);

    if (!isLoaded || !role) {
      console.log("Menu: Returning empty - not loaded or no role");
      return [];
    }

    const filtered = menuItems.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const hasAccess = item.allowedRoles.includes(role.toUpperCase());
        console.log(
          `Menu item ${item.label}: role=${role}, allowed=${item.allowedRoles}, hasAccess=${hasAccess}`
        );
        return hasAccess;
      }),
    }));

    console.log("Menu: Filtered items:", filtered);
    return filtered;
  };

  const { t } = useI18n();
  return (
    <>
      {isLoading && <Spinner />}
      <nav className="text-sm mt-2" aria-label="Main Navigation">
        {getVisibleMenuItems().map((i) => (
          <div className="flex flex-col gap-2" key={i.title}>
            {i.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className={`flex items-center justify-center lg:justify-start gap-4 py-2 px-4 rounded-md transition-colors duration-200 ease-in-out md:px-2 ${
                    isActive
                      ? "bg-gray-200 text-blue-600"
                      : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.href);
                  }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-white"}`} />
                  <span
                    className={`hidden lg:block font-bold ${
                      isActive ? "text-blue-600" : "text-white"
                    }`}
                  >
                    {t(item.label)}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </>
  );
};

export default Menu;
