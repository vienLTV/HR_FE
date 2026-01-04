"use client";

import { useEffect, useState } from "react";
import { getRoleFromToken } from "@/app/utils/jwtDecode";

/**
 * Hook to get user role from JWT token
 * Returns role on client-side only, handles hydration mismatch
 */
export function useRole(): {
  role: string | null;
  isLoaded: boolean;
  hasRole: (requiredRoles: string | string[]) => boolean;
} {
  const [role, setRole] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get role from JWT token stored in localStorage
    const userRole = getRoleFromToken();
    console.log("useRole Hook - Role from JWT:", userRole);
    setRole(userRole);
    setIsLoaded(true);
  }, []);

  const hasRole = (requiredRoles: string | string[]): boolean => {
    if (!role) return false;

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.some((r) => role.toUpperCase() === r.toUpperCase());
  };

  return { role, isLoaded, hasRole };
}
