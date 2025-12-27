const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: "USER";
}

export interface CreateUserResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    accountEmail: string;
    employeeId: string;
    role: string;
  };
}

export interface ApiError {
  success: false;
  code: number;
  message: string;
  data: null;
}

/**
 * Create a new USER (employee) account
 * Only accessible by OWNER role
 */
export async function createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json();

  // Handle non-2xx responses
  if (!response.ok) {
    const error = data as ApiError;
    throw new Error(error.message || "Failed to create user");
  }

  return data as CreateUserResponse;
}
