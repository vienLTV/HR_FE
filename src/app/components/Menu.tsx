"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "./Spinner";
import {
  BriefcaseIcon,
  BuildingIcon,
  HomeIcon,
  UserIcon,
  UserPlus,
  UsersIcon,
  ClipboardCheck,
} from "lucide-react";

export const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: HomeIcon,
        label: "Home",
        href: "/home",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: UserIcon,
        label: "Personal",
        href: "/personal",
        visible: ["admin", "teacher"],
      },
      {
        icon: UsersIcon,
        label: "Employees",
        href: "/employee",
        visible: ["admin", "teacher"],
      },
      {
        icon: ClipboardCheck,
        label: "Attendance",
        href: "/attendance",
        visible: ["admin", "teacher"],
      },
      {
        icon: BriefcaseIcon,
        label: "Job Title",
        href: "/job-title",
        visible: ["admin", "teacher"],
      },
      {
        icon: UserPlus,
        label: "Team",
        href: "/team",
        visible: ["admin"],
      },
      {
        icon: BuildingIcon,
        label: "Department",
        href: "/department",
        visible: ["admin", "teacher"],
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();
  const router = useRouter();
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

  return (
    <>
      {isLoading && <Spinner />}
      <nav className="text-sm mt-2" aria-label="Main Navigation">
        {menuItems.map((i) => (
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
                    {item.label}
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
