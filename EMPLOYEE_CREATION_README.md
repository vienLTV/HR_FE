# Employee Creation Feature

Complete implementation for OWNER users to create new employee (USER) accounts.

## 🚀 Quick Start

### 1. Import the component

```tsx
import CreateEmployeeButton from "@/components/employee/CreateEmployeeButton";
```

### 2. Add to your page

```tsx
export default function EmployeePage() {
  return (
    <div>
      <CreateEmployeeButton />
    </div>
  );
}
```

That's it! The button will:

- ✅ Only show for OWNER users
- ✅ Open a modal with a form
- ✅ Submit to backend API
- ✅ Handle success/error states
- ✅ Auto-refresh on success

## 📁 Files Created

```
src/
├── lib/
│   ├── api/
│   │   └── users.ts                  # API helper functions
│   └── types/
│       └── employee.ts               # TypeScript type definitions
├── components/
│   └── employee/
│       ├── CreateEmployeeButton.tsx  # Main button component
│       ├── CreateEmployeeModal.tsx   # Modal dialog component
│       └── examples.tsx              # Usage examples
└── app/
    └── (dashboard)/
        └── employee/
            └── page.tsx              # Integration example
```

## 🎯 Features

### ✨ Core Features

- **Role-Based Access**: Button only visible to OWNER users
- **Type-Safe API**: Full TypeScript types for requests/responses
- **Error Handling**: Displays backend error messages
- **Loading States**: Shows spinner during submission
- **Auto-Refresh**: Refreshes employee list on success
- **Form Validation**: Client-side validation for required fields
- **Accessibility**: Keyboard navigation and screen reader support

### 🎨 UI/UX Features

- **Modal Dialog**: Clean, centered modal with backdrop
- **Responsive Design**: Works on mobile and desktop
- **Success Feedback**: Green banner with success message
- **Error Feedback**: Red banner with error message
- **Disabled States**: Form disabled during submission
- **Auto-Close**: Modal closes automatically after success

## 📝 API Contract

### Endpoint

```
POST /users
```

### Request Headers

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

```json
{
  "fullName": "John Doe",
  "email": "john.doe@company.com",
  "password": "securePassword123",
  "role": "USER"
}
```

### Success Response (201)

```json
{
  "success": true,
  "code": 201,
  "message": "User created successfully",
  "data": {
    "accountEmail": "john.doe@company.com",
    "employeeId": "550e8400-e29b-41d4-a716-446655440000",
    "role": "USER"
  }
}
```

### Error Response (400/500)

```json
{
  "success": false,
  "code": 400,
  "message": "Email already exists",
  "data": null
}
```

## 🔧 Component API

### CreateEmployeeButton

```tsx
interface CreateEmployeeButtonProps {
  onEmployeeCreated?: () => void; // Optional callback after success
  className?: string; // Optional custom CSS classes
}
```

**Example:**

```tsx
<CreateEmployeeButton onEmployeeCreated={() => console.log("Created!")} className="custom-class" />
```

### CreateEmployeeModal

```tsx
interface CreateEmployeeModalProps {
  isOpen: boolean; // Controls modal visibility
  onClose: () => void; // Callback to close modal
  onSuccess: () => void; // Callback after successful creation
}
```

**Example:**

```tsx
<CreateEmployeeModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={() => {
    setIsOpen(false);
    refreshData();
  }}
/>
```

## 📚 Usage Examples

### Example 1: Basic Integration

```tsx
"use client";

import CreateEmployeeButton from "@/components/employee/CreateEmployeeButton";

export default function EmployeePage() {
  return (
    <div className="p-6">
      <h1>Employees</h1>
      <CreateEmployeeButton />
    </div>
  );
}
```

### Example 2: With Refresh Callback

```tsx
"use client";

import { useState } from "react";
import CreateEmployeeButton from "@/components/employee/CreateEmployeeButton";

export default function EmployeePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <CreateEmployeeButton onEmployeeCreated={() => setRefreshKey((prev) => prev + 1)} />
      <EmployeeTable key={refreshKey} />
    </div>
  );
}
```

### Example 3: Custom Modal Control

```tsx
"use client";

import { useState } from "react";
import CreateEmployeeModal from "@/components/employee/CreateEmployeeModal";

export default function CustomPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Add Employee</button>

      <CreateEmployeeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          setIsOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
}
```

### Example 4: API Usage Only

```tsx
import { createUser } from "@/lib/api/users";

async function handleCreateEmployee() {
  try {
    const response = await createUser({
      fullName: "Jane Smith",
      email: "jane.smith@company.com",
      password: "password123",
      role: "USER",
    });

    console.log("Employee created:", response.data);
  } catch (error) {
    console.error("Failed:", error.message);
  }
}
```

## 🔐 Security

### Client-Side

- ✅ Role check (OWNER only)
- ✅ JWT token from localStorage
- ✅ Auto-redirect on 401
- ✅ XSS prevention (React auto-escaping)

### Backend Required

- ⚠️ Verify OWNER role in backend
- ⚠️ Validate JWT signature
- ⚠️ Check email uniqueness
- ⚠️ Sanitize input data

## 🎨 Customization

### Custom Button Style

```tsx
<CreateEmployeeButton className="bg-purple-600 hover:bg-purple-700 shadow-lg" />
```

### Custom Success Behavior

```tsx
<CreateEmployeeButton
  onEmployeeCreated={() => {
    // Custom logic
    showNotification("Employee added!");
    trackEvent("employee_created");
    refreshDashboard();
  }}
/>
```

## ⚙️ Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### TypeScript Config

No changes needed. Uses strict mode by default.

### Tailwind Config

No changes needed. Uses default Tailwind classes.

## 🐛 Troubleshooting

### Button Doesn't Appear

**Problem**: Button not visible even for OWNER
**Solution**:

1. Check localStorage: `localStorage.getItem('role')`
2. Verify role includes "OWNER"
3. Check browser console for errors

### "Session Expired" Error

**Problem**: Getting 401 error on submit
**Solution**:

1. Check JWT token: `localStorage.getItem('token')`
2. Verify token hasn't expired
3. Re-login to get fresh token

### Modal Won't Open

**Problem**: Clicking button does nothing
**Solution**:

1. Check browser console for errors
2. Verify component is client-side (`"use client"`)
3. Check React DevTools for state

### Form Won't Submit

**Problem**: Submit button disabled or not working
**Solution**:

1. Fill all required fields
2. Check email format
3. Check password length (min 6)
4. Open browser console for validation errors

## 📊 Testing

### Manual Testing Checklist

- [ ] Button visible for OWNER
- [ ] Button hidden for non-OWNER
- [ ] Modal opens on click
- [ ] Form validation works
- [ ] Submit shows loading state
- [ ] Success shows green message
- [ ] Error shows red message
- [ ] List refreshes on success
- [ ] Modal closes on success
- [ ] Modal closes on backdrop click

### Unit Testing (Future)

```tsx
import { render, screen } from "@testing-library/react";
import CreateEmployeeButton from "./CreateEmployeeButton";

describe("CreateEmployeeButton", () => {
  it("renders for OWNER users", () => {
    localStorage.setItem("role", "OWNER");
    render(<CreateEmployeeButton />);
    expect(screen.getByText("Create Employee")).toBeInTheDocument();
  });

  it("does not render for non-OWNER", () => {
    localStorage.setItem("role", "USER");
    render(<CreateEmployeeButton />);
    expect(screen.queryByText("Create Employee")).toBeNull();
  });
});
```

## 🚧 Known Limitations

1. **No Email Validation**: Client-side only checks format, not uniqueness
2. **No Password Strength**: Only checks minimum length
3. **No Bulk Import**: Can only create one employee at a time
4. **No Role Selection**: Role is always USER
5. **No Department**: Cannot assign department during creation

## 🔮 Future Enhancements

### Planned Features

- [ ] Bulk CSV import
- [ ] Email uniqueness check (real-time)
- [ ] Password strength indicator
- [ ] Department selection
- [ ] Role selection (USER/ADMIN)
- [ ] Profile picture upload
- [ ] Email invitation system
- [ ] Welcome email trigger

### Possible Improvements

- [ ] Form field validation library (Zod/Yup)
- [ ] Toast notifications instead of inline messages
- [ ] Optimistic UI updates
- [ ] Undo functionality
- [ ] Keyboard shortcuts
- [ ] Multi-step wizard

## 📖 Additional Resources

- [Full Documentation](./EMPLOYEE_CREATION_GUIDE.md)
- [Usage Examples](./src/components/employee/examples.tsx)
- [Type Definitions](./src/lib/types/employee.ts)
- [API Client](./src/lib/api/users.ts)

## 💡 Tips

1. **Always handle callbacks**: Use `onEmployeeCreated` to refresh data
2. **Check roles server-side**: Client-side check is for UX only
3. **Use TypeScript**: Import types from `@/lib/types/employee`
4. **Handle errors gracefully**: Display user-friendly messages
5. **Test with real data**: Create test employees to verify flow

## 🤝 Contributing

To add new features:

1. Update types in `src/lib/types/employee.ts`
2. Update API in `src/lib/api/users.ts`
3. Update components as needed
4. Add examples to `examples.tsx`
5. Update this README

## 📄 License

Same as parent project.

## 👥 Authors

Generated by GitHub Copilot for Cetus HR Management System.

---

**Need Help?** Check the [troubleshooting section](#-troubleshooting) or review the [examples](./src/components/employee/examples.tsx).
