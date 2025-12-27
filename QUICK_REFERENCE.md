# Employee Creation - Quick Reference Card

## 📦 Installation (Already Done!)

All files are created and ready to use. No installation needed.

## 🚀 Usage

### Option 1: Use the Button Component (Recommended)

```tsx
import CreateEmployeeButton from "@/components/employee/CreateEmployeeButton";

<CreateEmployeeButton />;
```

### Option 2: Use with Refresh Callback

```tsx
import CreateEmployeeButton from "@/components/employee/CreateEmployeeButton";

<CreateEmployeeButton onEmployeeCreated={() => refreshEmployeeList()} />;
```

### Option 3: Direct API Call

```tsx
import { createUser } from "@/lib/api/users";

await createUser({
  fullName: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "USER",
});
```

## 🎯 Component Props

### CreateEmployeeButton

| Prop                | Type         | Required | Default     | Description            |
| ------------------- | ------------ | -------- | ----------- | ---------------------- |
| `onEmployeeCreated` | `() => void` | No       | `undefined` | Callback after success |
| `className`         | `string`     | No       | `""`        | Custom CSS classes     |

### CreateEmployeeModal

| Prop        | Type         | Required | Description         |
| ----------- | ------------ | -------- | ------------------- |
| `isOpen`    | `boolean`    | Yes      | Controls visibility |
| `onClose`   | `() => void` | Yes      | Close callback      |
| `onSuccess` | `() => void` | Yes      | Success callback    |

## 📋 Form Fields

| Field      | Type     | Required | Validation         |
| ---------- | -------- | -------- | ------------------ |
| `fullName` | text     | ✅ Yes   | Non-empty          |
| `email`    | email    | ✅ Yes   | Valid email format |
| `password` | password | ✅ Yes   | Min 6 characters   |
| `role`     | hidden   | ✅ Yes   | Fixed as "USER"    |

## 🔐 Security Checklist

- ✅ Only OWNER users see button
- ✅ JWT from localStorage
- ✅ No hardcoded credentials
- ✅ Auto-redirect on 401
- ⚠️ Backend must verify OWNER role
- ⚠️ Backend must validate JWT

## 🎨 Styling

### Default Button

```tsx
<CreateEmployeeButton />
```

Result: Blue button with "Create Employee" text

### Custom Styled

```tsx
<CreateEmployeeButton className="bg-purple-600 hover:bg-purple-700" />
```

## 🐛 Quick Troubleshooting

| Problem                 | Solution                                              |
| ----------------------- | ----------------------------------------------------- |
| Button doesn't appear   | Check `localStorage.getItem('role')` includes "OWNER" |
| "Session expired" error | Re-login to get fresh JWT token                       |
| Form won't submit       | Fill all required fields, check email format          |
| Modal won't open        | Check browser console, verify "use client" directive  |

## 📊 API Reference

### Endpoint

```
POST /users
```

### Headers

```
Authorization: Bearer <JWT>
Content-Type: application/json
```

### Request

```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "role": "USER"
}
```

### Response (Success)

```json
{
  "success": true,
  "code": 201,
  "message": "User created successfully",
  "data": {
    "accountEmail": "string",
    "employeeId": "uuid",
    "role": "USER"
  }
}
```

### Response (Error)

```json
{
  "success": false,
  "code": 400,
  "message": "Error message",
  "data": null
}
```

## 🔄 State Flow

```
User clicks button
    ↓
Modal opens
    ↓
User fills form
    ↓
Validation passes
    ↓
API call (with loading state)
    ↓
Success: Show message → Callback → Close
Error: Show error message → Stay open
```

## 📁 Files to Know

| File                                               | Purpose               |
| -------------------------------------------------- | --------------------- |
| `src/components/employee/CreateEmployeeButton.tsx` | Main button component |
| `src/components/employee/CreateEmployeeModal.tsx`  | Modal with form       |
| `src/lib/api/users.ts`                             | API functions         |
| `src/lib/types/employee.ts`                        | TypeScript types      |

## 🧪 Test Scenarios

1. ✅ Login as OWNER → Button appears
2. ✅ Login as USER → Button hidden
3. ✅ Click button → Modal opens
4. ✅ Submit empty → Validation error
5. ✅ Submit valid → Success message
6. ✅ Submit duplicate email → Error message
7. ✅ Success → List refreshes

## 💡 Pro Tips

1. **Always use callback** to refresh data after creation
2. **Check role server-side** - client check is UX only
3. **Import types** from `@/lib/types/employee`
4. **Use examples** in `examples.tsx` as reference
5. **Read docs** in README files for edge cases

## 🔗 Documentation Links

- [Quick Start](./EMPLOYEE_CREATION_README.md)
- [Full Guide](./EMPLOYEE_CREATION_GUIDE.md)
- [Examples](./src/components/employee/examples.tsx)
- [Types](./src/lib/types/employee.ts)
- [Summary](./IMPLEMENTATION_SUMMARY.md)

## ⚡ One-Minute Setup

```tsx
// 1. Import
import CreateEmployeeButton from "@/components/employee/CreateEmployeeButton";

// 2. Use
export default function EmployeePage() {
  return <CreateEmployeeButton />;
}

// Done! 🎉
```

## 📞 Need Help?

1. Check browser console for errors
2. Verify `localStorage.getItem('token')` exists
3. Verify `localStorage.getItem('role')` includes "OWNER"
4. Check Network tab for API response
5. Review troubleshooting in README

---

**That's it!** Simple, type-safe, production-ready employee creation. 🚀
