"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Spinner } from "../components/Spinner";

const LoginPage = () => {
  const [accountEmail, setAccountEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountEmail, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Login failed" }));
        setError(errorData.message || `Login failed with status ${response.status}`);
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();

      // Validate response data
      if (!data?.data?.token) {
        setError("Invalid response from server. Please try again.");
        setIsSubmitting(false);
        return;
      }

      console.log("Login successful", data);

      // Save token and user info to localStorage
      // Using try-catch to ensure localStorage operations don't fail silently
      try {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("accountEmail", data.data.accountEmail || "");
        localStorage.setItem("firstName", data.data.firstName || "");
        localStorage.setItem("lastName", data.data.lastName || "");
        localStorage.setItem("employeeId", data.data.employeeId || "");
        localStorage.setItem("role", data.data.role || "");
      } catch (storageError) {
        console.error("Failed to save to localStorage:", storageError);
        setError("Failed to save login data. Please check browser settings.");
        setIsSubmitting(false);
        return;
      }

      // Set loading state AFTER token is saved
      setIsLoading(true);

      // Small delay to ensure localStorage is fully written
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify token was saved before redirecting
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        // Redirect to home page
        router.push("/home");
      } else {
        setError("Failed to save authentication token. Please try again.");
        setIsLoading(false);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center mt-[200px]">
      <div className="flex flex-col w-[500px] p-10 gap-6 rounded-xl border border-gray-300 bg-white shadow-2xl">
        <h1 className="font-bold text-2xl">Sign in to your account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">
              Email
            </label>
            <input
              id="email"
              className="border-gray-300 bg-white border p-2 rounded-lg"
              type="email"
              placeholder="name@email.com"
              value={accountEmail}
              onChange={(e) => setAccountEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                className="border-gray-300 bg-white border p-2 rounded-lg w-full pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="bg-black rounded-lg text-white p-3 mt-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sign in..." : "Sign in"}
          </button>
        </form>

        <p className="text-gray-500">
          Do not have an account yet?
          <Link href="/register" className="m-1 font-medium text-black">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
