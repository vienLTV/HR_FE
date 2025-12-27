# Employee Creation Feature - Implementation Guide

## Overview

This implementation provides a complete UI for OWNER users to create new USER (employee) accounts in the Cetus application.

## Architecture

### 1. **API Layer** (`src/lib/api/users.ts`)

- **Purpose**: Handles all user-related API calls
- **Key Functions**:
  - `createUser(request: CreateUserRequest)`: Creates a new employee account
- **Type Safety**: Full TypeScript types for requests and responses
- **Authentication**: Automatically reads JWT from localStorage
- **Error Handling**:
  - 401 errors trigger automatic redirect to login
  - Server errors are properly parsed and thrown
  - Type-safe error messages

### 2. **Modal Component** (`src/components/employee/CreateEmployeeModal.tsx`)

- **Purpose**: Reusable modal dialog for employee creation form
- **Props**:
  - `isOpen: boolean` - Controls modal visibility
  - `onClose: () => void` - Callback when modal is closed
  - `onSuccess: () => void` - Callback on successful creation
- **Features**:
  - Form validation (required fields, email format, password length)
  - Loading states with spinner
  - Success/error message display
  - Auto-close on success
  - Keyboard accessibility
  - Click-outside-to-close functionality
- **State Management**:
  - Local form state with `useState`
  - Error and success message handling
  - Loading state during API calls

### 3. **Button Component** (`src/components/employee/CreateEmployeeButton.tsx`)

- **Purpose**: Trigger button that opens the creation modal
- **Role-Based Access Control**:
  - Only renders for users with "OWNER" role
  - Checks localStorage on mount
  - Returns `null` if user is not OWNER
- **Props**:
  - `onEmployeeCreated?: () => void` - Optional callback after successful creation
  - `className?: string` - Optional custom styling
- **Integration**: Manages modal state internally

### 4. **Page Integration** (`src/app/(dashboard)/employee/page.tsx`)

- **Implementation**: Button integrated into employee listing page
- **Features**:
  - Positioned in header next to page title
  - Triggers DataTable refresh on successful creation
  - Uses key-based refresh mechanism

## Usage Examples

### Basic Usage (Current Implementation)

```tsx
import CreateEmployeeButton from "@/components/employee/CreateEmployeeButton";

export default function EmployeePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <CreateEmployeeButton onEmployeeCreated={() => setRefreshKey((prev) => prev + 1)} />
      <DataTable key={refreshKey} />
    </div>
  );
}
```

### Standalone Usage (Other Pages)

```tsx
import CreateEmployeeButton from "@/components/employee/CreateEmployeeButton";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Button will auto-hide for non-OWNER users */}
      <CreateEmployeeButton />
    </div>
  );
}
```

### Custom Styling

```tsx
<CreateEmployeeButton
  className="my-custom-class"
  onEmployeeCreated={() => {
    console.log("Employee created!");
    fetchEmployees();
  }}
/>
```

### Direct Modal Usage (Advanced)

```tsx
import CreateEmployeeModal from "@/components/employee/CreateEmployeeModal";

export default function CustomPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Custom Trigger</button>

      <CreateEmployeeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          setIsOpen(false);
          // Custom success handling
        }}
      />
    </>
  );
}
```

## API Contract

### Request

```typescript
POST /users
Content-Type: application/json
Authorization: Bearer <JWT>

{
  "fullName": "John Doe",
  "email": "john.doe@company.com",
  "password": "securePassword123",
  "role": "USER"
}
```

### Success Response (201 Created)

```typescript
{
  "success": true,
  "code": 201,
  "message": "User created successfully",
  "data": {
    "accountEmail": "john.doe@company.com",
    "employeeId": "uuid-here",
    "role": "USER"
  }
}
```

### Error Response (400/500)

```typescript
{
  "success": false,
  "code": 400,
  "message": "Email already exists",
  "data": null
}
```

## Security Features

1. **Role-Based Access Control**

   - Button only visible to OWNER users
   - Backend must also validate OWNER role
   - Client-side check prevents UI clutter

2. **JWT Authentication**

   - Token automatically included in requests
   - Auto-redirect on 401 errors
   - Token retrieved from localStorage

3. **Input Validation**
   - Required fields enforced
   - Email format validation
   - Password minimum length (6 characters)
   - XSS prevention through React's auto-escaping

## User Experience

### Success Flow

1. OWNER clicks "Create Employee" button
2. Modal opens with empty form
3. OWNER fills in employee details
4. Submit button shows loading spinner
5. Success message appears
6. Modal auto-closes after 1.5 seconds
7. Employee list refreshes automatically

### Error Flow

1. OWNER submits invalid/duplicate data
2. API returns error
3. Error message displays in red banner
4. Form remains open for correction
5. Error clears when user edits fields

### Loading States

- Submit button disabled during request
- Loading spinner replaces button text
- Form inputs disabled during submission
- Modal cannot be closed during submission

## Styling

### Tailwind Classes Used

- **Modal Backdrop**: `bg-black bg-opacity-50`
- **Modal Container**: `bg-white rounded-lg shadow-xl`
- **Primary Button**: `bg-blue-600 hover:bg-blue-700`
- **Input Fields**: `border-gray-300 focus:ring-blue-500`
- **Error Message**: `bg-red-50 border-red-200 text-red-600`
- **Success Message**: `bg-green-50 border-green-200 text-green-600`

### Responsive Design

- Modal max-width: `max-w-md`
- Mobile padding: `mx-4`
- Stacks buttons vertically on small screens (flex-1)

## Testing Checklist

### Functional Tests

- [ ] Button only shows for OWNER users
- [ ] Button hidden for USER/other roles
- [ ] Modal opens on button click
- [ ] Modal closes on backdrop click
- [ ] Modal closes on X button click
- [ ] Modal closes on Cancel button
- [ ] Form validation works (required fields)
- [ ] Email validation works
- [ ] Password min-length validation works
- [ ] Submit disabled during loading
- [ ] Success message shows on 201
- [ ] Error message shows on failure
- [ ] Employee list refreshes on success
- [ ] Token auto-retrieves from localStorage
- [ ] 401 redirects to login

### Edge Cases

- [ ] Multiple rapid button clicks
- [ ] Network timeout handling
- [ ] Duplicate email submission
- [ ] Empty form submission
- [ ] Very long input strings
- [ ] Special characters in name/email
- [ ] Missing JWT token
- [ ] Expired JWT token

## Troubleshooting

### "Button doesn't appear"

- Check localStorage for "role" key
- Verify role value includes "OWNER"
- Check browser console for errors

### "Session expired" error

- JWT token expired or invalid
- User will be redirected to login
- Re-login to get new token

### "Failed to create employee"

- Check network tab for API response
- Verify backend is running
- Check CORS settings
- Verify API_BASE_URL environment variable

### Form won't submit

- Check browser console for validation errors
- Verify all required fields are filled
- Check password length (min 6 chars)
- Verify email format

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Future Enhancements

### Possible Improvements

1. **Form Enhancements**

   - Add phone number field
   - Add department selection
   - Add role selection (USER/ADMIN)
   - Add profile picture upload

2. **Validation**

   - Password strength indicator
   - Email domain validation
   - Real-time duplicate email check

3. **UX Improvements**

   - Confirmation dialog before close
   - Keyboard shortcuts (ESC to close)
   - Form field auto-focus
   - Success animation

4. **Features**
   - Bulk employee import (CSV)
   - Email invitation system
   - Temporary password generation
   - Welcome email trigger

## Dependencies

### Required Packages

- `react` (^18.x)
- `next` (^13.x)
- TypeScript
- Tailwind CSS

### No External Dependencies

- Pure React (no form libraries)
- No UI component libraries
- Native fetch API
- CSS-in-JS via Tailwind

## File Structure

```
src/
├── app/
│   └── (dashboard)/
│       └── employee/
│           └── page.tsx          # Integration example
├── components/
│   └── employee/
│       ├── CreateEmployeeButton.tsx  # Main button component
│       └── CreateEmployeeModal.tsx   # Modal dialog component
└── lib/
    └── api/
        └── users.ts              # API helper functions
```

## Migration Guide

### From Existing Code

If you have existing employee creation logic:

1. Replace hardcoded fetch calls:

```tsx
// Before
const response = await fetch("/users", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify(data),
});

// After
import { createUser } from "@/lib/api/users";
const response = await createUser(data);
```

2. Replace inline modals:

```tsx
// Before
{
  showModal && <div>...inline modal JSX...</div>;
}

// After
import CreateEmployeeButton from "@/components/employee/CreateEmployeeButton";
<CreateEmployeeButton />;
```

## Support

For issues or questions:

1. Check TypeScript errors in IDE
2. Review browser console for runtime errors
3. Verify API responses in Network tab
4. Check this documentation for examples
