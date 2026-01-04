/**
 * Decode JWT token and extract claims
 * JWT format: header.payload.signature
 */
export function decodeJWT(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decodedPayload = atob(paddedPayload);
    const claims = JSON.parse(decodedPayload);

    return claims;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

/**
 * Get user role from JWT token stored in localStorage
 * Extracts role from token claims (looks for 'role' or 'roles' field)
 */
export function getRoleFromToken(): string | null {
  try {
    if (typeof window === "undefined") {
      console.log("getRoleFromToken: Not in browser (SSR)");
      return null;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("getRoleFromToken: No token in localStorage");
      return null;
    }

    console.log("getRoleFromToken: Token found, decoding...");
    const claims = decodeJWT(token);
    if (!claims) {
      console.log("getRoleFromToken: Failed to decode JWT");
      return null;
    }

    console.log("getRoleFromToken: JWT claims:", claims);

    // JWT might have role as string or array
    const role = claims.role || claims.roles?.[0] || claims.groups?.[0];
    console.log("getRoleFromToken: Extracted role:", role);

    return role || null;
  } catch (error) {
    console.error("Error getting role from token:", error);
    return null;
  }
}

/**
 * Check if user has a specific role
 */
export function hasRole(requiredRole: string): boolean {
  const role = getRoleFromToken();
  return role?.toUpperCase() === requiredRole.toUpperCase();
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(requiredRoles: string[]): boolean {
  const role = getRoleFromToken();
  return requiredRoles.some((r) => role?.toUpperCase() === r.toUpperCase());
}
