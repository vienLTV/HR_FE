"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/app/providers/LanguageProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Lock } from "lucide-react";

export default function Navbar() {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });
  const router = useRouter();

  useEffect(() => {
    // This code will only run on the client-side
    const firstName = localStorage.getItem("firstName") || "";
    const lastName = localStorage.getItem("lastName") || "";
    const role = localStorage.getItem("role") || "";
    setUserInfo({ firstName, lastName, role });
  }, []);

  const fullName = `${userInfo.firstName} ${userInfo.lastName}`.trim();

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("role");
    localStorage.removeItem("organizationId");

    // Redirect to login
    router.push("/login");
  };

  const { t } = useI18n();
  return (
    <div className="flex items-center justify-between p-4 border-b-2">
      {/* SEARCH */}
      <div className="hidden md:flex items-center gap-2 rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder={t("navbar.search.placeholder")}
          className="w-[200px] p-1 bg-transparent outline-none"
        />
      </div>

      {/* ICON AND USER */}
      <div className="flex items-center gap-4 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-red-600 text-white rounded-full text-xs">
            1
          </div>
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />

        <div className="flex flex-col">
          <span className="text-xs leading-3 text-[#054FA5] font-bold">{fullName}</span>
          <span className="text-[10px] text-gray-600 text-right">{userInfo.role}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
              <Image
                src="/avatar.png"
                alt="User Avatar"
                width={36}
                height={36}
                className="rounded-full"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>{t("navbar.profile")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/change-password")}
              className="cursor-pointer"
            >
              <Lock className="mr-2 h-4 w-4" />
              <span>{t("navbar.changePassword")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("navbar.signOut")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
