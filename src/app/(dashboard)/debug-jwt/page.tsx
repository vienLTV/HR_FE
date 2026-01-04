"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { decodeJWT, getRoleFromToken } from "@/app/utils/jwtDecode";
import { useRole } from "@/hooks/useRole";

export default function DebugJWTPage() {
  const [token, setToken] = useState<string | null>(null);
  const [claims, setClaims] = useState<any>(null);
  const [roleFromStorage, setRoleFromStorage] = useState<string | null>(null);
  const { role: roleFromHook, isLoaded } = useRole();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");
      setToken(storedToken);
      setRoleFromStorage(storedRole);

      if (storedToken) {
        const decodedClaims = decodeJWT(storedToken);
        setClaims(decodedClaims);
      }
    }
  }, []);

  const extractedRole = getRoleFromToken();

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">JWT Token Debug Page</h1>

      <Card>
        <CardHeader>
          <CardTitle>Token Status</CardTitle>
          <CardDescription>Check if JWT token exists</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Token exists:</strong> {token ? "✅ Yes" : "❌ No"}
          </p>
          {token && (
            <p className="mt-2 text-xs text-gray-500 break-all">
              Token: {token.substring(0, 50)}...
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>JWT Claims</CardTitle>
          <CardDescription>Decoded JWT payload</CardDescription>
        </CardHeader>
        <CardContent>
          {claims ? (
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(claims, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">No claims available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Extraction</CardTitle>
          <CardDescription>Different methods to get role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <strong>From localStorage ("role"):</strong>
            <span className="ml-2 px-2 py-1 bg-blue-100 rounded">{roleFromStorage || "null"}</span>
          </div>

          <div>
            <strong>From JWT (getRoleFromToken):</strong>
            <span className="ml-2 px-2 py-1 bg-green-100 rounded">{extractedRole || "null"}</span>
          </div>

          <div>
            <strong>From useRole hook:</strong>
            <span className="ml-2 px-2 py-1 bg-purple-100 rounded">
              {isLoaded ? roleFromHook || "null" : "loading..."}
            </span>
          </div>

          {claims && (
            <>
              <div className="mt-4 pt-4 border-t">
                <p className="font-semibold mb-2">JWT Fields:</p>
                <ul className="space-y-1 text-sm">
                  <li>
                    <strong>groups:</strong> {JSON.stringify(claims.groups || "not found")}
                  </li>
                  <li>
                    <strong>role:</strong> {JSON.stringify(claims.role || "not found")}
                  </li>
                  <li>
                    <strong>roles:</strong> {JSON.stringify(claims.roles || "not found")}
                  </li>
                  <li>
                    <strong>subject (email):</strong> {claims.sub || "not found"}
                  </li>
                  <li>
                    <strong>organizationId:</strong> {claims.organizationId || "not found"}
                  </li>
                  <li>
                    <strong>employeeId:</strong> {claims.employeeId || "not found"}
                  </li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected Behavior</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            Backend uses <code className="bg-gray-200 px-1">groups</code> field in JWT to store
            roles as an array.
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Example: <code className="bg-gray-200 px-1">{`{ "groups": ["USER"] }`}</code>
          </p>
          <p className="text-sm text-gray-700 mt-2">
            The frontend should extract the first element from the{" "}
            <code className="bg-gray-200 px-1">groups</code> array.
          </p>
        </CardContent>
      </Card>

      <Button
        onClick={() => {
          console.log("=== JWT Debug Info ===");
          console.log("Token:", token?.substring(0, 50) + "...");
          console.log("Claims:", claims);
          console.log("Role from localStorage:", roleFromStorage);
          console.log("Role from getRoleFromToken():", extractedRole);
          console.log("Role from useRole hook:", roleFromHook);
          alert("Check browser console for detailed logs");
        }}
      >
        Log to Console
      </Button>
    </div>
  );
}
