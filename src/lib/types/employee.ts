/**
 * TypeScript type definitions for employee creation feature
 * These types ensure type safety across the application
 */

/**
 * User role types
 * Based on JWT groups claim
 */
export type UserRole = "USER" | "ADMIN" | "OWNER";

/**
 * Request payload for creating a new user
 * Sent to POST /users endpoint
 */
export interface CreateUserRequest {
  /** Full name of the employee */
  fullName: string;
  /** Email address (must be unique) */
  email: string;
  /** Password (minimum 6 characters) */
  password: string;
  /** Role is always USER for employee creation */
  role: "USER";
}

/**
 * Successful response from POST /users
 * Returned when user is created successfully (201)
 */
export interface CreateUserResponse {
  success: true;
  code: 201;
  message: string;
  data: {
    accountEmail: string;
    employeeId: string;
    role: string;
  };
}

/**
 * Error response from API
 * Returned when request fails (4xx or 5xx)
 */
export interface ApiError {
  success: false;
  code: number;
  message: string;
  data: null;
}

/**
 * Generic API response wrapper
 */
export type ApiResponse<T> =
  | {
      success: true;
      code: number;
      message: string;
      data: T;
    }
  | ApiError;

/**
 * Form data state for create employee modal
 */
export interface CreateEmployeeFormData {
  fullName: string;
  email: string;
  password: string;
}

/**
 * Props for CreateEmployeeButton component
 */
export interface CreateEmployeeButtonProps {
  /** Callback fired after successful employee creation */
  onEmployeeCreated?: () => void;
  /** Optional custom CSS classes */
  className?: string;
}

/**
 * Props for CreateEmployeeModal component
 */
export interface CreateEmployeeModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback fired after successful creation */
  onSuccess: () => void;
}

/**
 * Authentication data stored in localStorage
 */
export interface AuthLocalStorage {
  token: string;
  accountEmail: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  role: string;
}

/**
 * User information from JWT token
 * Decoded from JWT payload
 */
export interface JWTPayload {
  sub: string; // accountEmail
  groups: string; // roles (comma-separated)
  employeeId: string;
  organizationId: string;
  iss: string; // issuer
  exp: number; // expiration timestamp
}

/**
 * Form validation errors
 */
export interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  general?: string;
}

/**
 * Form field type for type-safe onChange handlers
 */
export type FormField = keyof CreateEmployeeFormData;

/**
 * Loading state for async operations
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

/**
 * Employee data structure (for future use)
 */
export interface Employee {
  employeeId: string;
  accountEmail: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  organizationId: string;
  createdAt: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

/**
 * Type guard to check if user has specific role
 */
export function hasRole(role: string | null, requiredRole: UserRole): boolean {
  if (!role) return false;
  return role.includes(requiredRole);
}

/**
 * Type guard to check if error is ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" && error !== null && "success" in error && error.success === false
  );
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is Extract<ApiResponse<T>, { success: true }> {
  return response.success === true;
}

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

/**
 * Form validator function type
 */
export type FormValidator = (data: CreateEmployeeFormData) => ValidationResult;

/**
 * API client configuration
 */
export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Request options for API calls
 */
export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}
